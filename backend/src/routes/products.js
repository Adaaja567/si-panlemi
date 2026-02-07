const express = require('express');
const Product = require('../models/Product');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const items = await Product.find({
      $or: [{ isActive: true }, { isActive: { $exists: false } }],
    }).sort({ createdAt: -1 });

    return res.json(items);
  } catch (err) {
    console.error('GET /api/products error:', err);
    return res.status(500).json({ message: 'Gagal mengambil produk' });
  }
});

module.exports = router;