const express = require('express');
const jwt = require('jsonwebtoken');
const Order = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

async function getLoggedInUserIfAny(req) {
  const auth = req.headers.authorization || '';
  const headerToken = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  const cookieToken = req.cookies?.userToken || null;

  const token = headerToken || cookieToken;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.type !== 'user') return null;

    const user = await User.findById(payload.id);
    if (!user || user.isActive === false) return null;

    return user;
  } catch {
    return null;
  }
}

// Upload config (local)
const UPLOAD_DIR = path.join(__dirname, '..', '..', 'uploads', 'payment-proofs');
// Comment untuk Vercel - filesystem read-only
// fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase() || '.jpg';
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg';
    const name = `proof_${Date.now()}_${Math.random().toString(16).slice(2)}${safeExt}`;
    cb(null, name);
  },
});

function fileFilter(req, file, cb) {
  const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
  cb(ok ? null : new Error('Format bukti transfer harus JPG/PNG/WEBP'), ok);
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

function maybeUpload(req, res, next) {
  if (req.is('multipart/form-data')) {
    return upload.single('paymentProof')(req, res, next);
  }
  return next();
}

function calculateShippingFee(deliveryArea, customerAddress) {
  const area = String(deliveryArea || '').toLowerCase();
  const address = String(customerAddress || '').toLowerCase();

  // Area gratis ongkir (dalam radius 5km)
  const freeAreas = ['rembang kota', 'ngrandu', 'pulo', 'karanganyar', 'tasikharjo', 'bulu', 'sedan'];
  if (freeAreas.some(freeArea => area.includes(freeArea) || address.includes(freeArea))) {
    return 0;
  }

  // Area >5km (Rp 15.000 - default, admin bisa ubah nanti)
  // Semua area lain yang tidak masuk kategori gratis
  return 15000;
}

function normalizeDeliveryArea(rawArea, customerAddress) {
  const a = String(rawArea || '').trim().toLowerCase();

  // kalau frontend mengirim pilihan yang benar
  if (a === 'rembang_kota') return 'rembang_kota';
  if (a === 'outside') return 'outside';

  // fallback dari teks alamat (biar tetap jalan walau belum ada dropdown)
  const addr = String(customerAddress || '').toLowerCase();
  if (addr.includes('rembang') && addr.includes('kota')) return 'rembang_kota';

  // kalau cuma ada "rembang" tanpa "kota", anggap unknown (biar tidak salah)
  return 'unknown';
}

/**
 * POST /api/orders
 * - COD: JSON
 * - DANA: multipart/form-data + paymentProof
 *
 * Body tambahan:
 * - deliveryArea: 'rembang_kota' | 'outside' (disarankan dari frontend)
 */
router.post('/', maybeUpload, async (req, res) => {
  try {
    const customerName = String(req.body?.customerName || '').trim();
    const customerPhone = String(req.body?.customerPhone || '').trim();
    const customerAddress = String(req.body?.customerAddress || '').trim();

    const rawPaymentMethod = String(req.body?.paymentMethod || 'cod').trim();
    const paymentMethod = rawPaymentMethod === 'cod' ? 'cod' : 'dana';

    const note = String(req.body?.note || '');

    if (!customerName || !customerPhone || !customerAddress) {
      return res.status(400).json({ message: 'Nama, nomor WA, dan alamat wajib diisi.' });
    }

    // items bisa array (JSON) atau string JSON (multipart)
    let items = req.body?.items;
    if (typeof items === 'string') {
      try {
        items = JSON.parse(items);
      } catch {
        return res.status(400).json({ message: 'Format items tidak valid.' });
      }
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Minimal satu produk dalam pesanan.' });
    }

    // Area
    const deliveryArea = normalizeDeliveryArea(req.body?.deliveryArea, customerAddress);

    // Hitung ongkir berdasarkan area
    const shippingFee = calculateShippingFee(deliveryArea, customerAddress);
    const shippingFree = shippingFee === 0;

    // Rule COD: tidak ada batasan area lagi, semua area bisa COD dengan ongkir masing-masing
    // Rule DANA: sama, semua area bisa DANA dengan ongkir masing-masing

    // DANA wajib bukti transfer
    let paymentProofUrl = null;
    let paymentVerificationStatus = 'none';

    if (paymentMethod === 'dana') {
      if (!req.file) {
        return res.status(400).json({ message: 'Bukti transfer DANA wajib diupload.' });
      }
      paymentProofUrl = `/uploads/payment-proofs/${req.file.filename}`;
      paymentVerificationStatus = 'waiting';
    }

    const orderItems = items.map((item) => {
      const productId = item.productId || item.product;
      const name = String(item.name || '').trim();
      const unit = String(item.unit || '').trim();
      const price = Number(item.price);
      const quantity = Number(item.quantity);

      if (!productId || !name || !unit || !Number.isFinite(price) || !Number.isFinite(quantity)) {
        throw new Error('Item pesanan tidak valid.');
      }
      if (price < 0 || quantity < 1) throw new Error('Item pesanan tidak valid.');

      return { product: productId, name, unit, price, quantity };
    });

    const totalAmount = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0) + shippingFee;

    // ongkir sudah dihitung di atas
    // const shippingFee = 0;
    // const shippingFree = paymentMethod === 'cod' && deliveryArea === 'rembang_kota';

    // Validasi dan kurangi stock
    const stockUpdates = [];
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Produk ${item.name} tidak ditemukan.`);
      }
      
      if (product.stock < item.quantity) {
        throw new Error(`Stock ${item.name} tidak mencukupi. Tersedia: ${product.stock}, diminta: ${item.quantity}`);
      }
      
      stockUpdates.push({
        productId: item.product,
        quantity: item.quantity,
        currentStock: product.stock
      });
    }

    // Kurangi stock untuk semua produk
    for (const update of stockUpdates) {
      await Product.findByIdAndUpdate(
        update.productId,
        { 
          $inc: { stock: -update.quantity },
          // Auto update status jika stock habis
          $set: { 
            status: update.currentStock - update.quantity <= 0 ? 'out_of_stock' : 'available'
          }
        }
      );
    }

    const user = await getLoggedInUserIfAny(req);

    const order = await Order.create({
      user: user ? user._id : null,
      items: orderItems,
      customerName,
      customerPhone,
      customerAddress,
      deliveryArea,
      shippingFee,
      shippingFree,
      paymentMethod,
      paymentProofUrl,
      paymentVerificationStatus,
      note,
      totalAmount,
    });

    return res.status(201).json(order);
  } catch (err) {
    console.error('POST /api/orders error:', err);
    return res.status(500).json({
      message: err?.message === 'Item pesanan tidak valid.' ? err.message : 'Gagal membuat pesanan',
    });
  }
});

/**
 * GET /api/orders/search?phone=xxx
 * Search orders by phone number (for guest users and registered users)
 */
router.get('/search', async (req, res) => {
  try {
    const { phone } = req.query;
    
    if (!phone) {
      return res.status(400).json({ message: 'Nomor WhatsApp diperlukan' });
    }

    // Search orders by phone number
    const orders = await Order.find({ 
      customerPhone: phone 
    }).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error('GET /api/orders/search error:', err);
    return res.status(500).json({ message: 'Gagal mencari pesanan' });
  }
});

module.exports = router;