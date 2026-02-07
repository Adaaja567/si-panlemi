require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const connectDB = require('./config/db');
const path = require('path');
const fs = require('fs');

const authRoutes = require(path.join(__dirname, 'routes', 'auth'));
const productRoutes = require(path.join(__dirname, 'routes', 'products'));
const adminProductRoutes = require(path.join(__dirname, 'routes', 'adminProducts'));
const orderRoutes = require(path.join(__dirname, 'routes', 'orders'));
const userAuthRoutes = require(path.join(__dirname, 'routes', 'userAuth'));
const stockNotificationRoutes = require(path.join(__dirname, 'routes', 'stockNotifications'));
const uploadRoutes = require(path.join(__dirname, 'routes', 'upload'));
const resetPasswordRoutes = require(path.join(__dirname, 'routes', 'resetPassword'));
const settingsRoutes = require(path.join(__dirname, 'routes', 'settings'));

const myOrdersRoutes = require(path.join(__dirname, 'routes', 'myOrders'));
const adminOrdersRoutes = require(path.join(__dirname, 'routes', 'adminOrders'));
const superAdminAnalyticsRoutes = require(path.join(__dirname, 'routes', 'superAdminAnalytics'));

const superAdminAdminsRoutes = require(path.join(__dirname, 'routes', 'superAdminAdmins'));
const superAdminUsersRoutes = require(path.join(__dirname, 'routes', 'superAdminUsers'));

const AdminUser = require('./models/AdminUser');
const User = require('./models/User');

const app = express();

// Koneksi MongoDB
connectDB(process.env.MONGODB_URI);

// Pastikan folder upload ada
const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const PRODUCTS_DIR = path.join(UPLOADS_DIR, 'products');
const PROOFS_DIR = path.join(UPLOADS_DIR, 'payment-proofs');
fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
fs.mkdirSync(PROOFS_DIR, { recursive: true });

// Static files untuk akses bukti transfer
// contoh URL: http://localhost:4000/uploads/payment-proofs/xxx.webp
app.use('/uploads', express.static(UPLOADS_DIR));

app.use(helmet());
app.use(express.json()); // untuk request JSON (COD)
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// Rate limit untuk login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Increased untuk development
  message: 'Terlalu banyak percobaan login, coba lagi nanti.',
});

// Routes
app.use('/api/auth', loginLimiter, authRoutes);      // admin/super_admin login
app.use('/api/users', loginLimiter, userAuthRoutes); // user login/daftar

app.use('/api/products', productRoutes);
app.use('/api/admin/products', adminProductRoutes);
app.use('/api/upload', uploadRoutes);

app.use('/api/orders', orderRoutes);                 // create order (guest/user)
app.use('/api/my-orders', myOrdersRoutes);           // user: riwayat + cancel
app.use('/api/admin/orders', adminOrdersRoutes);     // admin: kelola order
app.use('/api/stock', stockNotificationRoutes);      // admin: stock notifications

app.use('/api/reset-password', resetPasswordRoutes);
app.use('/api/settings', settingsRoutes);

app.use('/api/super-admin/analytics', superAdminAnalyticsRoutes);
app.use('/api/super-admin/admins', superAdminAdminsRoutes);
app.use('/api/super-admin/users', superAdminUsersRoutes);

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// Buat super admin default jika belum ada
const createDefaultAdmin = async () => {
  const username = process.env.ADMIN_DEFAULT_USERNAME;
  const password = process.env.ADMIN_DEFAULT_PASSWORD;
  const role = process.env.ADMIN_DEFAULT_ROLE || 'super_admin';
  if (!username || !password) return;

  const existing = await AdminUser.findOne({ username: username.toLowerCase() });
  if (existing) return;

  const hash = await bcrypt.hash(password, 10);
  await AdminUser.create({
    username: username.toLowerCase(),
    passwordHash: hash,
    role,
    isActive: true,
  });

  console.log(`Admin default dibuat: ${username} (${role})`);
};

const createDefaultUser = async () => {
  const phone = process.env.USER_DEFAULT_PHONE;
  const password = process.env.USER_DEFAULT_PASSWORD;
  const name = process.env.USER_DEFAULT_NAME || 'Pelanggan Demo';
  const address = process.env.USER_DEFAULT_ADDRESS || 'Alamat demo';

  if (!phone || !password) return;

  const existing = await User.findOne({ phone });
  if (existing) return;

  const hash = await bcrypt.hash(password, 10);
  await User.create({
    name,
    phone,
    address,
    role: 'user',
    passwordHash: hash,
    isActive: true,
  });

  console.log(`User default dibuat: ${phone}`);
};

createDefaultAdmin().catch(console.error);
createDefaultUser().catch(console.error);

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend berjalan di port ${PORT}`));