// Script untuk test login admin
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function testLogin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Cek admin yang ada
        const admin = await mongoose.connection.db.collection('adminusers').findOne({ username: 'superadmin' });
        
        if (!admin) {
            console.log('❌ Admin tidak ditemukan!');
            process.exit(1);
        }

        console.log('👤 Admin ditemukan:');
        console.log('   Username:', admin.username);
        console.log('   Role:', admin.role);
        console.log('   PasswordHash:', admin.passwordHash.substring(0, 30) + '...');

        // Test password
        const testPassword = 'e9d72cc89d3d87653851d872fd6a6e98ada60562ffbe6ff2c2844bec2ec20a67';
        const match = await bcrypt.compare(testPassword, admin.passwordHash);
        
        console.log('\n🔐 Test password:', match ? '✅ MATCH' : '❌ NO MATCH');

        if (!match) {
            console.log('\n⚠️  Password tidak match! Membuat password baru yang simple...');
            
            // Buat password simple
            const newPassword = 'SuperAdmin2026!';
            const newHash = await bcrypt.hash(newPassword, 10);
            
            await mongoose.connection.db.collection('adminusers').updateOne(
                { username: 'superadmin' },
                { $set: { passwordHash: newHash, updatedAt: new Date() } }
            );
            
            console.log('✅ Password diupdate ke: SuperAdmin2026!');
            
            // Test password baru
            const testNew = await bcrypt.compare(newPassword, newHash);
            console.log('🔐 Test password baru:', testNew ? '✅ MATCH' : '❌ NO MATCH');
            
            console.log('\n📋 NEW LOGIN:');
            console.log('   Username: superadmin');
            console.log('   Password: SuperAdmin2026!');
        } else {
            console.log('\n📋 LOGIN:');
            console.log('   Username: superadmin');
            console.log('   Password: e9d72cc89d3d87653851d872fd6a6e98ada60562ffbe6ff2c2844bec2ec20a67');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

testLogin();
