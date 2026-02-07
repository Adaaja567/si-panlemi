// Script untuk update admin password sesuai .env
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function updateAdminPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Ambil password dari .env
        const newPassword = process.env.ADMIN_DEFAULT_PASSWORD;
        console.log('🔐 Password dari .env:', newPassword);

        // Hash password baru
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update admin password
        const result = await mongoose.connection.db.collection('users').updateOne(
            { username: 'admin' },
            { 
                $set: { 
                    password: hashedPassword,
                    updatedAt: new Date()
                } 
            }
        );

        if (result.modifiedCount > 0) {
            console.log('✅ Admin password berhasil diupdate!');
        } else {
            console.log('⚠️  Admin tidak ditemukan atau password sudah sama');
        }

        console.log('\n📋 Login Credentials:');
        console.log('   Username:', process.env.ADMIN_DEFAULT_USERNAME);
        console.log('   Password:', process.env.ADMIN_DEFAULT_PASSWORD);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

updateAdminPassword();
