const mongoose = require('mongoose');

const adminUserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },

    // ✅ wajib ada supaya admin.role kebaca
    role: { type: String, enum: ['admin', 'super_admin'], default: 'admin', index: true },

    // ✅ biar bisa disable akun
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.models.AdminUser || mongoose.model('AdminUser', adminUserSchema);