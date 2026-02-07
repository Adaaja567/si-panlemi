const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');

module.exports = async function authAdmin(req, res, next) {
  const auth = req.headers.authorization || '';
  const headerToken = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  // ✅ baca cookie token admin juga (cookie name: token)
  const cookieToken = req.cookies?.token || null;

  const token = headerToken || cookieToken;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.type !== 'admin') return res.status(401).json({ message: 'Unauthorized' });

    const admin = await AdminUser.findById(payload.id);
    if (!admin || admin.isActive === false) return res.status(401).json({ message: 'Unauthorized' });

    req.admin = admin;
    req.role = admin.role;
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};