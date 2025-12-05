const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const { loginValidator } = require('../utils/validators');
const validateRequest = require('../middleware/validateRequest');

const router = express.Router();

router.post('/login', loginValidator, validateRequest, async (req, res) => {
  const { username, password } = req.body;

  const admin = await AdminUser.findOne({ username: username.toLowerCase() });
  if (!admin) {
    return res.status(401).json({ message: 'Username atau password salah' });
  }

  const isMatch = await bcrypt.compare(password, admin.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ message: 'Username atau password salah' });
  }

  const payload = { id: admin._id, username: admin.username };
  const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '8h' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 8 * 60 * 60 * 1000,
  });

  res.json({ message: 'Login berhasil', token });
});

module.exports = router;