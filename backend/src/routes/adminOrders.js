const express = require('express');
const Order = require('../models/Order');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();
router.use(authMiddleware);

const VALID_STATUS = ['pending', 'confirmed', 'paid', 'shipped', 'completed', 'cancelled'];

// GET list semua pesanan
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('items.product', 'name category');

    res.json(orders);
  } catch (err) {
    console.error('GET /admin/orders error:', err);
    res.status(500).json({ message: 'Gagal mengambil pesanan' });
  }
});

// GET detail satu pesanan
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product', 'name category');
    if (!order) return res.status(404).json({ message: 'Pesanan tidak ditemukan' });

    res.json(order);
  } catch (err) {
    console.error('GET /admin/orders/:id error:', err);
    res.status(500).json({ message: 'Gagal mengambil pesanan' });
  }
});

// PUT ubah status operasional
router.put('/:id/status', async (req, res) => {
  try {
    const status = String(req.body?.status || '').trim();

    if (!VALID_STATUS.includes(status)) {
      return res.status(400).json({ message: 'Status tidak valid' });
    }

    const update = { status };

    if (status === 'paid') {
      update.paymentStatus = 'paid';
      update.paidAt = new Date();
    }

    const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!order) return res.status(404).json({ message: 'Pesanan tidak ditemukan' });

    res.json(order);
  } catch (err) {
    console.error('PUT /admin/orders/:id/status error:', err);
    res.status(500).json({ message: 'Gagal mengubah status pesanan' });
  }
});

// PUT verifikasi bukti transfer (khusus DANA)
router.put('/:id/payment/verify', async (req, res) => {
  try {
    const action = String(req.body?.action || '').trim(); // approve | reject
    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({ message: 'Action tidak valid (approve/reject)' });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Pesanan tidak ditemukan' });

    const paymentMethod = order.paymentMethod === 'cod' ? 'cod' : 'dana';
    if (paymentMethod !== 'dana') {
      return res.status(400).json({ message: 'Pesanan ini bukan pembayaran DANA.' });
    }
    if (!order.paymentProofUrl) {
      return res.status(400).json({ message: 'Bukti transfer belum ada.' });
    }

    order.paymentVerifiedAt = new Date();

    if (action === 'approve') {
      order.paymentVerificationStatus = 'approved';
      order.paymentStatus = 'paid';
      order.status = 'paid';
      order.paidAt = new Date();
    } else {
      order.paymentVerificationStatus = 'rejected';
      order.paymentStatus = 'unpaid';
      order.paidAt = null;
      // status operasional tidak dipaksa berubah (biar admin yang tentukan)
    }

    await order.save();
    res.json(order);
  } catch (err) {
    console.error('PUT /admin/orders/:id/payment/verify error:', err);
    res.status(500).json({ message: 'Gagal verifikasi pembayaran' });
  }
});

module.exports = router;