const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: ['ayam', 'lele_fresh', 'lele_marinasi', 'telur', 'minyak'],
      required: true,
    },
    description: { type: String, default: '', trim: true },
    price: { type: Number, required: true, min: 0 },
    unit: { type: String, required: true, trim: true }, // "/kg", "/ekor", "/liter"
    status: {
      type: String,
      enum: ['available', 'preorder', 'out_of_stock'],
      default: 'available',
    },
    imageUrl: { type: String, default: '', trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);