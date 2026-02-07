const express = require('express');
const Product = require('../models/Product');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

router.use(authMiddleware);

// GET /api/admin/products -> semua produk (aktif & nonaktif)
router.get('/', async (req, res) => {
  try {
    const items = await Product.find().sort({ createdAt: -1 });
    return res.json(items);
  } catch (err) {
    console.error('GET /api/admin/products error:', err);
    return res.status(500).json({ message: 'Gagal memuat produk' });
  }
});

// POST /api/admin/products -> create
router.post('/', async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim();
    const category = String(req.body?.category || '').trim();
    const description = String(req.body?.description || '').trim();
    const unit = String(req.body?.unit || 'kg').trim();
    const price = Number(req.body?.price);
    const stock = Number(req.body?.stock) || 0;
    const status = req.body?.status || 'available';
    const imageUrl = String(req.body?.imageUrl || '').trim();
    const usage = String(req.body?.usage || '').trim();
    const isActive = req.body?.isActive === undefined ? true : Boolean(req.body?.isActive);

    if (!name) return res.status(400).json({ message: 'Nama produk wajib diisi.' });
    if (!Number.isFinite(price) || price < 0) return res.status(400).json({ message: 'Harga tidak valid.' });

    const created = await Product.create({
      name,
      category,
      description,
      unit,
      price,
      stock,
      status,
      imageUrl,
      usage,
      isActive,
    });

    return res.status(201).json(created);
  } catch (err) {
    console.error('POST /api/admin/products error:', err);
    return res.status(500).json({ message: 'Gagal menambah produk' });
  }
});

// PUT /api/admin/products/:id -> update
router.put('/:id', async (req, res) => {
  try {
    const update = {};

    if (req.body?.name !== undefined) update.name = String(req.body?.name || '').trim();
    if (req.body?.category !== undefined) update.category = String(req.body?.category || '').trim();
    if (req.body?.description !== undefined) update.description = String(req.body?.description || '').trim();
    if (req.body?.unit !== undefined) update.unit = String(req.body?.unit || '').trim();
    if (req.body?.imageUrl !== undefined) update.imageUrl = String(req.body?.imageUrl || '').trim();
    if (req.body?.usage !== undefined) update.usage = String(req.body?.usage || '').trim();
    if (req.body?.status !== undefined) update.status = req.body?.status;
    if (req.body?.isActive !== undefined) update.isActive = Boolean(req.body?.isActive);

    if (req.body?.price !== undefined) {
      const price = Number(req.body?.price);
      if (!Number.isFinite(price) || price < 0) return res.status(400).json({ message: 'Harga tidak valid.' });
      update.price = price;
    }

    if (req.body?.stock !== undefined) {
      const stock = Number(req.body?.stock);
      if (!Number.isFinite(stock) || stock < 0) return res.status(400).json({ message: 'Stock tidak valid.' });
      update.stock = stock;
    }

    if (update.name !== undefined && !update.name) {
      return res.status(400).json({ message: 'Nama produk wajib diisi.' });
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!updated) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    return res.json(updated);
  } catch (err) {
    console.error('PUT /api/admin/products/:id error:', err);
    return res.status(500).json({ message: 'Gagal mengubah produk' });
  }
});

// DELETE /api/admin/products/:id -> delete
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Produk tidak ditemukan' });

    return res.json({ message: 'Produk dihapus' });
  } catch (err) {
    console.error('DELETE /api/admin/products/:id error:', err);
    return res.status(500).json({ message: 'Gagal menghapus produk' });
  }
});

module.exports = router;