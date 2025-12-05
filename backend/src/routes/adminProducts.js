const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const { productValidator } = require('../utils/validators');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.use(auth);

router.get('/', async (req, res) => {
  const products = await Product.find().sort({ createdAt: -1 });
  res.json(products);
});

router.post('/', productValidator, validateRequest, async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

router.put('/:id', productValidator, validateRequest, async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updated) return res.status(404).json({ message: 'Produk tidak ditemukan' });
  res.json(updated);
});

router.delete('/:id', async (req, res) => {
  const deleted = await Product.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ message: 'Produk tidak ditemukan' });
  res.json({ message: 'Produk dihapus' });
});

module.exports = router;