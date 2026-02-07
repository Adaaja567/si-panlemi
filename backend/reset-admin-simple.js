// Script untuk reset admin dengan field yang benar
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function resetAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Hapus admin lama
        await mongoose.connection.db.collection('users').deleteMany({ username: 'admin' });
        console.log('🗑️  Admin lama dihapus');

        // Buat admin baru dengan field BENAR
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newAdmin = {
            username: 'admin',
            email: 'admin@ngendokfarm.com',
            passwordHash: hashedPassword,  // FIELD YANG BENAR
            role: 'admin',
            nama: 'Administrator',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await mongoose.connection.db.collection('users').insertOne(newAdmin);
        console.log('✅ Admin baru dibuat dengan field yang benar!');

        // Verify
        const verify = await mongoose.connection.db.collection('users').findOne({ username: 'admin' });
        console.log('\n🔍 Verify admin:');
        console.log('   username:', verify.username);
        console.log('   passwordHash:', verify.passwordHash ? '✅ ADA' : '❌ TIDAK ADA');
        console.log('   password:', verify.password ? '⚠️  ADA (salah)' : '✅ TIDAK ADA (benar)');

        console.log('\n📋 LOGIN CREDENTIALS:');
        console.log('   Username: admin');
        console.log('   Password: admin123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

resetAdmin();
