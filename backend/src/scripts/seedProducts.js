require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');

const sampleProducts = [
  // Ayam Ungkep
  {
    name: 'Ayam Ungkep 1kg',
    category: 'ayam',
    description: 'Ayam ungkep dengan bumbu tradisional kuning, siap goreng atau bakar',
    price: 50000,
    unit: '1 kg',
    status: 'available',
    imageUrl: '/images/1.png', // Menggunakan foto yang ada
    usage: 'Tinggal goreng atau bakar 10-15 menit hingga kecoklatan',
    isActive: true,
    stock: 50
  },
  {
    name: 'Ayam Ungkep 0.5kg',
    category: 'ayam',
    description: 'Ayam ungkep dengan bumbu tradisional kuning, siap goreng atau bakar',
    price: 25000,
    unit: '0.5 kg',
    status: 'available',
    imageUrl: '/images/1.png', // Menggunakan foto yang sama
    usage: 'Tinggal goreng atau bakar 10-15 menit hingga kecoklatan',
    isActive: true,
    stock: 50
  },
  
  // Lele Fresh
  {
    name: 'Lele Fresh 1kg',
    category: 'lele_fresh',
    description: 'Lele segar langsung dari kolam, sudah dibersihkan dan siap olah',
    price: 20000,
    unit: '1 kg',
    status: 'available',
    imageUrl: '/images/2.png', // Menggunakan foto yang ada
    usage: 'Bisa digoreng, dibakar, atau dibuat pecel lele',
    isActive: true,
    stock: 50
  },
  {
    name: 'Lele Fresh 0.5kg',
    category: 'lele_fresh',
    description: 'Lele segar langsung dari kolam, sudah dibersihkan dan siap olah',
    price: 10000,
    unit: '0.5 kg',
    status: 'available',
    imageUrl: '/images/2.png', // Menggunakan foto yang sama
    usage: 'Bisa digoreng, dibakar, atau dibuat pecel lele',
    isActive: true,
    stock: 50
  },
  
  // Lele Marinasi
  {
    name: 'Lele Marinasi 1kg',
    category: 'lele_marinasi',
    description: 'Lele yang sudah dimarinasi dengan bumbu kuning pedas, tinggal goreng',
    price: 28000,
    unit: '1 kg',
    status: 'available',
    imageUrl: '/images/3.png', // Menggunakan foto yang ada
    usage: 'Goreng dengan api sedang 8-10 menit hingga matang',
    isActive: true,
    stock: 50
  },
  {
    name: 'Lele Marinasi 0.5kg',
    category: 'lele_marinasi',
    description: 'Lele yang sudah dimarinasi dengan bumbu kuning pedas, tinggal goreng',
    price: 14000,
    unit: '0.5 kg',
    status: 'available',
    imageUrl: '/images/3.png', // Menggunakan foto yang sama
    usage: 'Goreng dengan api sedang 8-10 menit hingga matang',
    isActive: true,
    stock: 50
  },
  
  // Telur
  {
    name: 'Telur Ayam Segar',
    category: 'telur',
    description: 'Telur ayam segar campuran putih dan coklat, kualitas premium',
    price: 29000,
    unit: '1 kg',
    status: 'available',
    imageUrl: '/images/4.png', // Menggunakan foto yang ada
    usage: 'Cocok untuk berbagai masakan, lebih gurih dan bergizi',
    isActive: true,
    stock: 50
  },
  
  // Minyak Goreng
  {
    name: 'Minyak Goreng',
    category: 'minyak',
    description: 'Minyak goreng berkualitas kemasan botol, jernih dan tidak berbau',
    price: 17500,
    unit: '1 liter',
    status: 'available',
    imageUrl: '/images/5.png', // Menggunakan foto yang ada
    usage: 'Untuk menggoreng, menumis, dan memasak sehari-hari',
    isActive: true,
    stock: 50
  }
];

async function seedProducts() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert sample products
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`Inserted ${insertedProducts.length} products:`);
    
    insertedProducts.forEach(product => {
      console.log(`- ${product.name} - Rp ${product.price.toLocaleString()}`);
    });

    console.log('\n✅ Products seeded successfully!');
    console.log('\n📸 Foto produk yang perlu ditambahkan ke folder frontend/public/images/products/:');
    console.log('- ayam-ungkep-1kg.jpg (foto ayam ungkep kuning)');
    console.log('- ayam-ungkep-05kg.jpg (foto ayam ungkep kuning)');
    console.log('- lele-fresh-1kg.jpg (foto lele segar)');
    console.log('- lele-fresh-05kg.jpg (foto lele segar)');
    console.log('- lele-marinasi-1kg.jpg (foto lele marinasi kuning)');
    console.log('- lele-marinasi-05kg.jpg (foto lele marinasi kuning)');
    console.log('- telur-1kg.jpg (foto telur campuran)');
    console.log('- minyak-1liter.jpg (foto minyak goreng botol)');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

seedProducts();