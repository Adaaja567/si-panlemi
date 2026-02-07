const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    // untuk user/pelanggan
    name: {
      type: String,
      required: false, // user biasanya isi, admin bisa kosong
      trim: true,
    },
    phone: {
      type: String,
      unique: true,
      sparse: true, // memungkinkan banyak dokumen tanpa phone
      trim: true,
    },
    address: {
      type: String,
      trim: true,
      default: '',
    },

    // untuk admin/super admin (login admin pakai username + password)
    username: {
      type: String,
      unique: true,
      sparse: true, // memungkinkan banyak dokumen tanpa username
      trim: true,
      lowercase: true,
    },

    role: {
      type: String,
      enum: ['user', 'admin', 'super_admin'],
      default: 'user',
      index: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

userSchema.pre('validate', function () {
  if (!this.phone && !this.username) {
    this.invalidate('phone', 'User harus punya phone atau username.');
    this.invalidate('username', 'User harus punya phone atau username.');
  }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);