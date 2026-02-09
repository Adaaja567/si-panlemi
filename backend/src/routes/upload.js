const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Pastikan folder upload ada
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');
const PRODUCTS_DIR = path.join(UPLOADS_DIR, 'products');
const PROOFS_DIR = path.join(UPLOADS_DIR, 'payment-proofs');

// Buat folder jika belum ada
// Comment untuk Vercel - filesystem read-only
// fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
// fs.mkdirSync(PROOFS_DIR, { recursive: true });

// Konfigurasi multer untuk foto produk
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PRODUCTS_DIR);
  },
  filename: (req, file, cb) => {
    // Generate nama file unik: timestamp-random-originalname
    const timestamp = Date.now();
    const random = Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const name = path.basename(file.originalname, ext);
    const cleanName = name.replace(/[^a-zA-Z0-9]/g, '');
    cb(null, `${timestamp}-${random}-${cleanName}${ext}`);
  }
});

// Filter file untuk foto produk
const productFileFilter = (req, file, cb) => {
  // Hanya terima file gambar
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('File harus berupa gambar (JPG, PNG, WEBP, dll)'), false);
  }
};

// Multer instance untuk foto produk
const uploadProduct = multer({
  storage: productStorage,
  fileFilter: productFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
    files: 1 // Hanya 1 file
  }
});

// POST /api/upload/product - Upload foto produk
router.post('/product', authMiddleware, uploadProduct.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        message: 'Tidak ada file yang diupload' 
      });
    }

    // URL untuk akses file
    const fileUrl = `/uploads/products/${req.file.filename}`;
    
    res.json({
      message: 'File berhasil diupload',
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: fileUrl,
      fullUrl: `${req.protocol}://${req.get('host')}${fileUrl}`
    });
  } catch (error) {
    console.error('Upload product image error:', error);
    res.status(500).json({ 
      message: 'Gagal mengupload file',
      error: error.message 
    });
  }
});

// DELETE /api/upload/product/:filename - Hapus foto produk
router.delete('/product/:filename', authMiddleware, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(PRODUCTS_DIR, filename);
    
    // Cek apakah file ada
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ 
        message: 'File tidak ditemukan' 
      });
    }
    
    // Hapus file
    fs.unlinkSync(filePath);
    
    res.json({ 
      message: 'File berhasil dihapus',
      filename: filename 
    });
  } catch (error) {
    console.error('Delete product image error:', error);
    res.status(500).json({ 
      message: 'Gagal menghapus file',
      error: error.message 
    });
  }
});

// GET /api/upload/products - List semua foto produk
router.get('/products', authMiddleware, (req, res) => {
  try {
    const files = fs.readdirSync(PRODUCTS_DIR);
    const imageFiles = files.filter(file => {
      const ext = path.extname(file).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp', '.gif'].includes(ext);
    });
    
    const fileList = imageFiles.map(filename => ({
      filename,
      url: `/uploads/products/${filename}`,
      fullUrl: `${req.protocol}://${req.get('host')}/uploads/products/${filename}`,
      size: fs.statSync(path.join(PRODUCTS_DIR, filename)).size,
      created: fs.statSync(path.join(PRODUCTS_DIR, filename)).birthtime
    }));
    
    res.json({
      files: fileList,
      count: fileList.length
    });
  } catch (error) {
    console.error('List product images error:', error);
    res.status(500).json({ 
      message: 'Gagal memuat daftar file',
      error: error.message 
    });
  }
});

// Error handler untuk multer
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ 
        message: 'File terlalu besar. Maksimal 5MB' 
      });
    }
    if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({ 
        message: 'Terlalu banyak file. Maksimal 1 file' 
      });
    }
  }
  
  res.status(400).json({ 
    message: error.message || 'Error upload file' 
  });
});

module.exports = router;