const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: { type: String, required: true, trim: true },
    unit: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      validate: [(v) => Array.isArray(v) && v.length > 0, 'Minimal 1 produk'],
    },

    customerName: { type: String, required: true, trim: true },
    customerPhone: { type: String, required: true, trim: true },
    customerAddress: { type: String, required: true, trim: true },

    // Area pengiriman (untuk rule COD)
    deliveryArea: {
      type: String,
      enum: ['rembang_kota', 'outside', 'unknown'],
      default: 'unknown',
      index: true,
    },

    // Ongkir (kalau nanti kamu ingin non-0 untuk luar area, tinggal set di route)
    shippingFee: { type: Number, default: 0, min: 0 },
    shippingFree: { type: Boolean, default: false, index: true },

    // Metode bayar: cod/dana. Legacy tetap diizinkan agar data lama aman.
    paymentMethod: {
      type: String,
      enum: ['cod', 'dana', 'transfer_bank', 'e_wallet'],
      default: 'cod',
      index: true,
    },

    // Bukti transfer (khusus DANA)
    paymentProofUrl: { type: String, default: null },

    paymentVerificationStatus: {
      type: String,
      enum: ['none', 'waiting', 'approved', 'rejected'],
      default: 'none',
      index: true,
    },

    paymentVerifiedAt: { type: Date, default: null },

    note: { type: String, trim: true, default: '' },

    status: {
      type: String,
      enum: ['menunggu', 'dikonfirmasi', 'dibayar', 'dikirim', 'selesai', 'dibatalkan'],
      default: 'menunggu',
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ['belum_bayar', 'sudah_bayar'],
      default: 'belum_bayar',
      index: true,
    },

    paidAt: { type: Date, default: null, index: true },

    totalAmount: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

orderSchema.pre('save', function () {
  if (this.isModified('status') && this.status === 'dibayar') {
    if (this.paymentStatus !== 'sudah_bayar') this.paymentStatus = 'sudah_bayar';
    if (!this.paidAt) this.paidAt = new Date();
  }

  if (this.isModified('paymentStatus')) {
    if (this.paymentStatus === 'sudah_bayar' && !this.paidAt) {
      this.paidAt = new Date();
    }
    if (this.paymentStatus === 'belum_bayar') {
      this.paidAt = null;
    }
  }
});

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);