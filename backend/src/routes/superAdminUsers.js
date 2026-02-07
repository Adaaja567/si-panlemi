const express = require('express');
const User = require('../models/User');

const authAdmin = require('../middleware/authAdmin');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

router.use(authAdmin);
router.use(requireRole('super_admin'));

// GET /api/super-admin/users
router.get('/', async (req, res) => {
  try {
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select('_id name phone address isActive createdAt updatedAt passwordHash')
      .lean();

    // Tambahkan info password untuk superadmin
    const usersWithPasswordInfo = users.map(user => {
      // Cek apakah password sudah pernah diubah dari default
      const hasCustomPassword = user.passwordHash ? true : false;
      const lastChanged = user.updatedAt || user.createdAt;
      
      // Untuk keamanan, tidak tampilkan password asli
      // Tapi beri info yang berguna untuk superadmin
      return {
        ...user,
        passwordInfo: {
          hasCustomPassword,
          lastChanged,
          // Info untuk superadmin: apakah user menggunakan password default (nomor WA) atau sudah custom
          status: hasCustomPassword ? 'Custom Password' : 'Default (No. WA)',
          hint: hasCustomPassword ? 'User telah mengatur password sendiri' : `Password default: ${user.phone}`
        }
      };
    });

    return res.json(usersWithPasswordInfo);
  } catch (err) {
    console.error('GET /api/super-admin/users error:', err);
    return res.status(500).json({ message: 'Gagal memuat data user' });
  }
});

// PUT /api/super-admin/users/:id -> aktif/nonaktif
router.put('/:id', async (req, res) => {
  try {
    const isActive = req.body?.isActive;
    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ message: 'isActive harus boolean' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isActive },
      { new: true }
    )
      .select('_id name phone address isActive createdAt')
      .lean();

    if (!user) return res.status(404).json({ message: 'User tidak ditemukan' });

    return res.json(user);
  } catch (err) {
    console.error('PUT /api/super-admin/users/:id error:', err);
    return res.status(500).json({ message: 'Gagal update user' });
  }
});

module.exports = router;