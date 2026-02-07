const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async function authUser(req, res, next) {
  const auth = req.headers.authorization || '';
  const headerToken = auth.startsWith('Bearer ') ? auth.slice(7) : null;

  const cookieToken = req.cookies?.userToken || null;

  const token = headerToken || cookieToken;
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.type !== 'user') return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(payload.id);
    if (!user || user.isActive === false) return res.status(401).json({ message: 'Unauthorized' });

    req.user = user;
    next();
  } catch {
    return res.status(401).json({ message: 'Unauthorized' });
  }
};