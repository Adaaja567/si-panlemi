const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const { loginValidator } = require('../utils/validators');
const validateRequest = require('../middleware/validateRequest');
const authAdmin = require('../middleware/authAdmin');

const router = express.Router();

function cookieOpts() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  };
}

// GET /api/auth/me - Get current admin info
router.get('/me', authAdmin, async (req, res) => {
  try {
    return res.json({
      user: {
        id: String(req.admin._id),
        role: req.admin.role || 'admin',
        username: req.admin.username,
      },
    });
  } catch (err) {
    console.error('GET /api/auth/me error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

router.post('/login', loginValidator, validateRequest, async (req, res) => {
  try {
    const username = String(req.body?.username || '').trim().toLowerCase();
    const password = String(req.body?.password || '');
    const rememberMe = Boolean(req.body?.rememberMe);

    const admin = await AdminUser.findOne({ username });
    if (!admin) return res.status(401).json({ message: 'Username atau password salah' });
    if (admin.isActive === false) return res.status(403).json({ message: 'Akun dinonaktifkan' });

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Username atau password salah' });

    const payload = {
      id: String(admin._id),
      type: 'admin',             // ✅ penting untuk authAdmin.js
      role: admin.role || 'admin',
      username: admin.username,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });

    const opts = cookieOpts();
    if (rememberMe) opts.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 hari

    res.cookie('token', token, opts);

    return res.json({
      message: 'Login berhasil',
      token: token, // ✅ Kirim token di response body untuk frontend
      user: {
        id: String(admin._id),
        role: admin.role || 'admin',
        username: admin.username,
      },
    });
  } catch (err) {
    console.error('POST /api/auth/login error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

router.post('/logout', (req, res) => {
  res.clearCookie('token', cookieOpts());
  return res.json({ message: 'Logout admin berhasil' });
});

module.exports = router;