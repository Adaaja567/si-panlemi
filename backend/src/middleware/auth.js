const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token = null;

  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  } else if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) {
    return res.status(401).json({ message: 'Tidak ada token, akses ditolak' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = { id: decoded.id, username: decoded.username };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa' });
  }
};

const requireSuperAdmin = async (req, res, next) => {
  try {
    // First check if user is authenticated
    const authHeader = req.headers.authorization;
    let token = null;

    if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    } else if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (!token) {
      return res.status(401).json({ message: 'Tidak ada token, akses ditolak' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await AdminUser.findById(decoded.id);

    if (!admin || admin.role !== 'super_admin') {
      return res.status(403).json({ message: 'Akses ditolak. Hanya super admin yang diizinkan.' });
    }

    req.admin = { id: admin._id, username: admin.username, role: admin.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token tidak valid atau kedaluwarsa' });
  }
};

module.exports = { authMiddleware, requireSuperAdmin };