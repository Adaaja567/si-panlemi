// Script untuk fix admin di collection yang BENAR
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function fixAdminFinal() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Hapus semua admin di collection 'adminusers'
        const deleted = await mongoose.connection.db.collection('adminusers').deleteMany({});
        console.log(`🗑️  Deleted ${deleted.deletedCount} admin dari collection 'adminusers'`);

        // Buat admin baru dengan credentials yang benar
        const username = 'superadmin';
        const password = 'e9d72cc89d3d87653851d872fd6a6e98ada60562ffbe6ff2c2844bec2ec20a67';
        const passwordHash = await bcrypt.hash(password, 10);

        const newAdmin = {
            username: username,
            passwordHash: passwordHash,
            role: 'super_admin',
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await mongoose.connection.db.collection('adminusers').insertOne(newAdmin);
        console.log('✅ Admin baru dibuat di collection "adminusers"!');

        // Verify
        const verify = await mongoose.connection.db.collection('adminusers').find({}).toArray();
        console.log(`\n✅ Total admin di "adminusers": ${verify.length}`);
        verify.forEach(admin => {
            console.log(`   - Username: ${admin.username}, Role: ${admin.role}`);
        });

        console.log('\n📋 LOGIN CREDENTIALS:');
        console.log('   Username: superadmin');
        console.log('   Password: e9d72cc89d3d87653851d872fd6a6e98ada60562ffbe6ff2c2844bec2ec20a67');
        console.log('\n⚠️  LOGOUT dari browser dan login lagi!');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

fixAdminFinal();
