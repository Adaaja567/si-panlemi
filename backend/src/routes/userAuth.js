const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authUser = require('../middleware/authUser');

const router = express.Router();

function normalizePhone(input) {
  let p = String(input || '').trim();
  p = p.replace(/[\s\-()]/g, '');
  if (p.startsWith('+')) p = p.slice(1);
  if (p.startsWith('0')) return '62' + p.slice(1);
  if (p.startsWith('8')) return '62' + p;
  if (p.startsWith('62')) return p;
  return p;
}

function cookieOpts() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  };
}

function signUserToken(userId) {
  return jwt.sign({ id: String(userId), type: 'user', role: 'user' }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
}

// GET /api/users/me - Get current user info
router.get('/me', authUser, async (req, res) => {
  try {
    return res.json({
      user: {
        id: String(req.user._id),
        role: 'user',
        name: req.user.name,
        phone: req.user.phone,
        address: req.user.address || '',
      },
    });
  } catch (err) {
    console.error('GET /api/users/me error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// POST /api/users/register
router.post('/register', async (req, res) => {
  try {
    const name = String(req.body?.name || '').trim();
    const phone = normalizePhone(req.body?.phone);
    const address = String(req.body?.address || '').trim();
    const password = String(req.body?.password || '');
    const rememberMe = Boolean(req.body?.rememberMe);

    if (!name || !phone || !address || !password) {
      return res.status(400).json({ message: 'Nama, nomor WA, alamat, dan password wajib diisi.' });
    }

    const existing = await User.findOne({ phone });
    if (existing) return res.status(400).json({ message: 'Nomor sudah terdaftar. Silakan masuk.' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      phone,
      address,
      role: 'user',
      passwordHash: hash,
      isActive: true,
    });

    const token = signUserToken(user._id);

    // ✅ rememberMe: cookie 30 hari, kalau tidak: session cookie
    const opts = cookieOpts();
    if (rememberMe) opts.maxAge = 30 * 24 * 60 * 60 * 1000;

    res.cookie('userToken', token, opts);

    return res.status(201).json({
      message: 'Registrasi berhasil',
      user: { id: String(user._id), role: 'user', name: user.name, phone: user.phone, address: user.address || '' },
    });
  } catch (err) {
    console.error('POST /api/users/register error:', err);
    return res.status(500).json({ message: 'Gagal registrasi' });
  }
});

// POST /api/users/login
router.post('/login', async (req, res) => {
  try {
    const phoneRaw = String(req.body?.phone || '').trim();
    const password = String(req.body?.password || '');
    const rememberMe = Boolean(req.body?.rememberMe);

    const phone = normalizePhone(phoneRaw);

    if (!phone || !password) {
      return res.status(400).json({ message: 'Nomor WA dan password wajib diisi.' });
    }

    const user = await User.findOne({ phone: { $in: [phone, phoneRaw] } });
    if (!user) return res.status(401).json({ message: 'Nomor atau password salah.' });
    if (user.isActive === false) return res.status(403).json({ message: 'Akun dinonaktifkan' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ message: 'Nomor atau password salah.' });

    // rapikan format
    if (user.phone !== phone) {
      user.phone = phone;
      await user.save();
    }

    const token = signUserToken(user._id);

    const opts = cookieOpts();
    if (rememberMe) opts.maxAge = 30 * 24 * 60 * 60 * 1000;

    res.cookie('userToken', token, opts);

    return res.json({
      message: 'Login berhasil',
      user: { id: String(user._id), role: 'user', name: user.name, phone: user.phone, address: user.address || '' },
    });
  } catch (err) {
    console.error('POST /api/users/login error:', err);
    return res.status(500).json({ message: 'Gagal login' });
  }
});

// POST /api/users/logout
router.post('/logout', (req, res) => {
  res.clearCookie('userToken', cookieOpts());
  return res.json({ message: 'Logout user berhasil' });
});

module.exports = router;