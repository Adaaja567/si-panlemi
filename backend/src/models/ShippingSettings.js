const mongoose = require('mongoose');

const shippingSettingsSchema = new mongoose.Schema({
  areaName: {
    type: String,
    required: true,
    unique: true
  },
  keywords: [{
    type: String,
    required: true
  }],
  distanceKm: {
    type: Number,
    required: true
  },
  shippingFee: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  description: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ShippingSettings', shippingSettingsSchema);