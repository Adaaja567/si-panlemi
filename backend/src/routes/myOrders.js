const express = require('express');
const authUser = require('../middleware/authUser');
const Order = require('../models/Order');

const router = express.Router();

// GET /api/my-orders  -> daftar pesanan milik user yang login
router.get('/', authUser, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    return res.json(orders);
  } catch (err) {
    console.error('GET /api/my-orders error:', err);
    return res.status(500).json({ message: 'Gagal memuat pesanan' });
  }
});

// PUT /api/my-orders/:id/cancel -> batal jika masih pending
router.put('/:id/cancel', authUser, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ message: 'Pesanan tidak ditemukan' });

    if (order.status !== 'pending') {
      return res.status(400).json({ message: 'Hanya bisa batal saat status pending' });
    }

    order.status = 'cancelled';
    await order.save();

    return res.json(order);
  } catch (err) {
    console.error('PUT /api/my-orders/:id/cancel error:', err);
    return res.status(500).json({ message: 'Gagal membatalkan pesanan' });
  }
});

module.exports = router;