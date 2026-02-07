const express = require('express');
const bcrypt = require('bcrypt');
const AdminUser = require('../models/AdminUser');
const authAdmin = require('../middleware/authAdmin');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

router.use(authAdmin);
router.use(requireRole('super_admin'));

// GET /api/super-admin/admins - List all admins
router.get('/', async (req, res) => {
  try {
    const admins = await AdminUser.find({}, { passwordHash: 0 }).sort({ createdAt: -1 });
    
    return res.json({
      admins: admins.map(admin => ({
        id: admin._id,
        username: admin.username,
        role: admin.role,
        isActive: admin.isActive,
        createdAt: admin.createdAt,
        updatedAt: admin.updatedAt,
      }))
    });
  } catch (err) {
    console.error('GET /api/super-admin/admins error:', err);
    return res.status(500).json({ message: 'Gagal memuat daftar admin' });
  }
});

// POST /api/super-admin/admins - Create new admin
router.post('/', async (req, res) => {
  try {
    const { username, password, role = 'admin' } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username dan password wajib diisi' });
    }

    if (!['admin', 'super_admin'].includes(role)) {
      return res.status(400).json({ message: 'Role harus admin atau super_admin' });
    }

    // Check if username already exists
    const existingAdmin = await AdminUser.findOne({ username: username.toLowerCase() });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Username sudah digunakan' });
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // Create new admin
    const newAdmin = new AdminUser({
      username: username.toLowerCase(),
      passwordHash,
      role,
      isActive: true,
    });

    await newAdmin.save();

    return res.status(201).json({
      message: 'Admin berhasil dibuat',
      admin: {
        id: newAdmin._id,
        username: newAdmin.username,
        role: newAdmin.role,
        isActive: newAdmin.isActive,
        createdAt: newAdmin.createdAt,
      }
    });
  } catch (err) {
    console.error('POST /api/super-admin/admins error:', err);
    return res.status(500).json({ message: 'Gagal membuat admin' });
  }
});

// PUT /api/super-admin/admins/:id - Update admin
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { role, isActive, password } = req.body;

    const admin = await AdminUser.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin tidak ditemukan' });
    }

    // Prevent super admin from deactivating themselves
    if (req.admin._id.toString() === id && isActive === false) {
      return res.status(400).json({ message: 'Tidak dapat menonaktifkan akun sendiri' });
    }

    // Update fields
    if (role && ['admin', 'super_admin'].includes(role)) {
      admin.role = role;
    }

    if (typeof isActive === 'boolean') {
      admin.isActive = isActive;
    }

    if (password) {
      const saltRounds = 12;
      admin.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    await admin.save();

    return res.json({
      message: 'Admin berhasil diupdate',
      admin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
        isActive: admin.isActive,
        updatedAt: admin.updatedAt,
      }
    });
  } catch (err) {
    console.error('PUT /api/super-admin/admins/:id error:', err);
    return res.status(500).json({ message: 'Gagal mengupdate admin' });
  }
});

// DELETE /api/super-admin/admins/:id - Delete admin
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Prevent super admin from deleting themselves
    if (req.admin._id.toString() === id) {
      return res.status(400).json({ message: 'Tidak dapat menghapus akun sendiri' });
    }

    const admin = await AdminUser.findById(id);
    if (!admin) {
      return res.status(404).json({ message: 'Admin tidak ditemukan' });
    }

    await AdminUser.findByIdAndDelete(id);

    return res.json({
      message: 'Admin berhasil dihapus',
      deletedAdmin: {
        id: admin._id,
        username: admin.username,
        role: admin.role,
      }
    });
  } catch (err) {
    console.error('DELETE /api/super-admin/admins/:id error:', err);
    return res.status(500).json({ message: 'Gagal menghapus admin' });
  }
});

module.exports = router;