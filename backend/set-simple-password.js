// Script untuk set password yang simple
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function setSimplePassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Password baru yang simple
        const newPassword = 'SuperAdmin2026';
        const passwordHash = await bcrypt.hash(newPassword, 10);

        // Update admin
        await mongoose.connection.db.collection('adminusers').updateOne(
            { username: 'superadmin' },
            { $set: { passwordHash: passwordHash, updatedAt: new Date() } }
        );

        console.log('✅ Password berhasil diupdate!');
        
        // Test
        const admin = await mongoose.connection.db.collection('adminusers').findOne({ username: 'superadmin' });
        const match = await bcrypt.compare(newPassword, admin.passwordHash);
        console.log('🔐 Test password:', match ? '✅ MATCH' : '❌ NO MATCH');

        console.log('\n📋 NEW LOGIN CREDENTIALS:');
        console.log('   Username: superadmin');
        console.log('   Password: SuperAdmin2026');
        console.log('\n⚠️  Copy-paste password ini dengan hati-hati!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

setSimplePassword();
