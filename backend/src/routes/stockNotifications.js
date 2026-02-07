const express = require('express');
const Product = require('../models/Product');
const { requireSuperAdmin, authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/stock/notifications - Dapatkan produk dengan stock rendah
router.get('/notifications', authMiddleware, async (req, res) => {
  try {
    const lowStockThreshold = 5; // Batas stock rendah
    
    const lowStockProducts = await Product.find({
      isActive: true,
      $or: [
        { stock: { $lte: lowStockThreshold, $gt: 0 } }, // Stock rendah
        { stock: 0, status: { $ne: 'out_of_stock' } }, // Stock habis tapi status belum diupdate
        { status: 'out_of_stock' } // Status out of stock
      ]
    }).sort({ stock: 1, name: 1 });

    const notifications = lowStockProducts.map(product => ({
      id: product._id,
      name: product.name,
      unit: product.unit,
      stock: product.stock,
      status: product.status,
      category: product.category,
      type: product.stock === 0 ? 'out_of_stock' : 'low_stock',
      message: product.stock === 0 
        ? `${product.name} habis!` 
        : `${product.name} stock rendah (${product.stock} ${product.unit})`
    }));

    res.json({
      notifications,
      count: notifications.length,
      lowStockCount: notifications.filter(n => n.type === 'low_stock').length,
      outOfStockCount: notifications.filter(n => n.type === 'out_of_stock').length
    });
  } catch (err) {
    console.error('GET /stock/notifications error:', err);
    res.status(500).json({ message: 'Gagal memuat notifikasi stock' });
  }
});

// PUT /api/stock/restock/:id - Restock produk
router.put('/restock/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity, action = 'add' } = req.body;

    if (quantity < 0) {
      return res.status(400).json({ message: 'Jumlah stock tidak boleh negatif' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Produk tidak ditemukan' });
    }

    let newStock;
    if (action === 'set') {
      newStock = quantity;
    } else {
      newStock = product.stock + quantity;
    }

    // Update stock dan status
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { 
        stock: newStock,
        status: newStock > 0 ? 'available' : 'out_of_stock'
      },
      { new: true }
    );

    res.json({
      message: `Stock ${product.name} berhasil diupdate`,
      product: updatedProduct,
      oldStock: product.stock,
      newStock: newStock,
      added: action === 'add' ? quantity : newStock - product.stock
    });
  } catch (err) {
    console.error('PUT /stock/restock error:', err);
    res.status(500).json({ message: 'Gagal update stock' });
  }
});

// GET /api/stock/summary - Summary stock untuk dashboard
router.get('/summary', authMiddleware, async (req, res) => {
  try {
    const totalProducts = await Product.countDocuments({ isActive: true });
    const outOfStock = await Product.countDocuments({ isActive: true, stock: 0 });
    const lowStock = await Product.countDocuments({ 
      isActive: true, 
      stock: { $gt: 0, $lte: 5 } 
    });
    const inStock = totalProducts - outOfStock - lowStock;

    const topLowStock = await Product.find({
      isActive: true,
      stock: { $gt: 0, $lte: 10 }
    })
    .sort({ stock: 1 })
    .limit(5)
    .select('name stock unit category');

    res.json({
      summary: {
        totalProducts,
        inStock,
        lowStock,
        outOfStock
      },
      topLowStock
    });
  } catch (err) {
    console.error('GET /stock/summary error:', err);
    res.status(500).json({ message: 'Gagal memuat summary stock' });
  }
});

module.exports = router;