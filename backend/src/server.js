require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const adminProductRoutes = require('./routes/adminProducts');
const AdminUser = require('./models/AdminUser');
const bcrypt = require('bcrypt');

const app = express();

connectDB(process.env.MONGODB_URI);

app.use(helmet());
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Terlalu banyak percobaan login, coba lagi nanti.',
});

app.use('/api/auth', loginLimiter, authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin/products', adminProductRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const createDefaultAdmin = async () => {
  const username = process.env.ADMIN_DEFAULT_USERNAME;
  const password = process.env.ADMIN_DEFAULT_PASSWORD;
  if (!username || !password) return;

  const existing = await AdminUser.findOne({ username: username.toLowerCase() });
  if (existing) return;

  const hash = await bcrypt.hash(password, 10);
  await AdminUser.create({
    username: username.toLowerCase(),
    passwordHash: hash,
  });
  console.log(`Admin default dibuat: ${username}`);
};

createDefaultAdmin().catch(console.error);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend berjalan di port ${PORT}`);
});