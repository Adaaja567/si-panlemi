const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const rateLimit = require('express-rate-limit');

const router = express.Router();

// Fungsi normalisasi phone yang sama dengan userAuth
function normalizePhone(input) {
  let p = String(input || '').trim();
  p = p.replace(/[\s\-()]/g, '');
  if (p.startsWith('+')) p = p.slice(1);
  if (p.startsWith('0')) return '62' + p.slice(1);
  if (p.startsWith('8')) return '62' + p;
  if (p.startsWith('62')) return p;
  return p;
}

// Rate limiting untuk reset password
const resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 3, // Maksimal 3 percobaan per 15 menit
  message: 'Terlalu banyak percobaan reset password. Coba lagi dalam 15 menit.',
  standardHeaders: true,
  legacyHeaders: false,
});

// Temporary storage untuk kode verifikasi (dalam produksi gunakan Redis)
const verificationCodes = new Map();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Reset password routes working!' });
});

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Reset password routes working!' });
});

// POST /api/reset-password/request - Request reset password
router.post('/request', resetPasswordLimiter, async (req, res) => {
  try {
    const phoneRaw = String(req.body?.phone || '').trim();
    const phone = normalizePhone(phoneRaw);

    if (!phone) {
      return res.status(400).json({ message: 'Nomor WhatsApp wajib diisi' });
    }

    // Cari user berdasarkan nomor phone (cek format asli dan normalized)
    const user = await User.findOne({ phone: { $in: [phone, phoneRaw] } });
    if (!user) {
      // Jangan beri tahu bahwa user tidak ditemukan (security)
      return res.json({ 
        message: 'Jika nomor terdaftar, kode verifikasi akan dikirim via WhatsApp',
        success: true 
      });
    }

    // Generate kode verifikasi 6 digit
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Simpan kode dengan expiry 10 menit - gunakan phone yang normalized
    const expiryTime = Date.now() + (10 * 60 * 1000); // 10 menit
    verificationCodes.set(phone, {
      code: verificationCode,
      expiry: expiryTime,
      attempts: 0,
      userId: user._id // Simpan user ID untuk update nanti
    });

    // Dalam implementasi nyata, kirim SMS/WhatsApp di sini
    console.log(`Verification code for ${phone}: ${verificationCode}`);
    
    // Untuk development, return kode (HAPUS di production!)
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.json({
      message: 'Kode verifikasi telah dikirim via WhatsApp',
      success: true,
      ...(isDevelopment && { devCode: verificationCode }) // Hanya untuk development
    });

  } catch (error) {
    console.error('Reset password request error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// POST /api/reset-password/verify - Verify code dan reset password
router.post('/verify', resetPasswordLimiter, async (req, res) => {
  try {
    const phoneRaw = String(req.body?.phone || '').trim();
    const phone = normalizePhone(phoneRaw);
    const { verificationCode, newPassword } = req.body;

    if (!phone || !verificationCode || !newPassword) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: 'Password minimal 6 karakter' });
    }

    // Cek kode verifikasi - gunakan phone yang normalized
    const storedData = verificationCodes.get(phone);
    if (!storedData) {
      return res.status(400).json({ message: 'Kode verifikasi tidak valid atau sudah expired' });
    }

    // Cek expiry
    if (Date.now() > storedData.expiry) {
      verificationCodes.delete(phone);
      return res.status(400).json({ message: 'Kode verifikasi sudah expired' });
    }

    // Cek attempts (maksimal 3 kali salah)
    if (storedData.attempts >= 3) {
      verificationCodes.delete(phone);
      return res.status(400).json({ message: 'Terlalu banyak percobaan salah. Minta kode baru.' });
    }

    // Cek kode
    if (storedData.code !== verificationCode) {
      storedData.attempts += 1;
      return res.status(400).json({ 
        message: `Kode verifikasi salah. Sisa percobaan: ${3 - storedData.attempts}` 
      });
    }

    // Kode benar, update password menggunakan userId yang tersimpan
    const user = await User.findById(storedData.userId);
    if (!user) {
      return res.status(404).json({ message: 'User tidak ditemukan' });
    }

    // Hash password baru
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password di database
    await User.findByIdAndUpdate(user._id, { 
      passwordHash: hashedPassword,
      phone: phone // Sekalian normalisasi phone number
    });

    // Hapus kode verifikasi
    verificationCodes.delete(phone);

    console.log(`Password reset successful for user: ${user.name} (${phone})`);

    res.json({
      message: 'Password berhasil direset',
      success: true
    });

  } catch (error) {
    console.error('Reset password verify error:', error);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// GET /api/reset-password/cleanup - Cleanup expired codes (internal)
router.get('/cleanup', (req, res) => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [phone, data] of verificationCodes.entries()) {
    if (now > data.expiry) {
      verificationCodes.delete(phone);
      cleaned++;
    }
  }
  
  res.json({ 
    message: `Cleaned ${cleaned} expired codes`,
    activecodes: verificationCodes.size 
  });
});

module.exports = router;