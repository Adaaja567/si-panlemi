const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, trim: true, default: '' },
    description: { type: String, trim: true, default: '' },
    unit: { type: String, trim: true, default: 'kg' },
    price: { type: Number, required: true, min: 0 },
    stock: { type: Number, default: 0, min: 0 },
    status: { 
      type: String, 
      enum: ['available', 'preorder', 'out_of_stock'], 
      default: 'available' 
    },
    imageUrl: { type: String, trim: true, default: '' },
    usage: { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Product || mongoose.model('Product', productSchema);