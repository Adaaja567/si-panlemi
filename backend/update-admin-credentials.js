// Script untuk update admin credentials
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function updateAdminCredentials() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Credentials baru
        const newUsername = 'superadmin';
        const newPassword = 'e9d72cc89d3d87653851d872fd6a6e98ada60562ffbe6ff2c2844bec2ec20a67';

        // Hash password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update admin
        const result = await mongoose.connection.db.collection('users').updateOne(
            { username: 'admin' },
            { 
                $set: { 
                    username: newUsername,
                    passwordHash: hashedPassword,
                    updatedAt: new Date()
                } 
            }
        );

        if (result.modifiedCount > 0) {
            console.log('✅ Admin credentials berhasil diupdate!');
        } else {
            console.log('⚠️  Admin tidak ditemukan');
        }

        // Verify
        const verify = await mongoose.connection.db.collection('users').findOne({ username: newUsername });
        if (verify) {
            console.log('\n🔍 Verify admin:');
            console.log('   Username:', verify.username);
            console.log('   Email:', verify.email);
            console.log('   Role:', verify.role);
        }

        console.log('\n📋 NEW LOGIN CREDENTIALS:');
        console.log('   Username: superadmin');
        console.log('   Password: e9d72cc89d3d87653851d872fd6a6e98ada60562ffbe6ff2c2844bec2ec20a67');
        console.log('\n⚠️  SIMPAN CREDENTIALS INI DENGAN AMAN!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

updateAdminCredentials();
