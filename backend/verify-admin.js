// Script untuk cek dan verify admin password
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function verifyAdmin() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Cek admin yang ada
        const admin = await mongoose.connection.db.collection('users').findOne({ username: 'admin' });
        
        if (!admin) {
            console.log('❌ Admin tidak ditemukan!');
            process.exit(1);
        }

        console.log('👤 Admin ditemukan:');
        console.log('   Username:', admin.username);
        console.log('   Email:', admin.email);
        console.log('   Password hash:', admin.password.substring(0, 30) + '...');

        // Test password lama
        const testOld = await bcrypt.compare('admin123', admin.password);
        console.log('\n🔐 Test password "admin123":', testOld ? '✅ MATCH' : '❌ NO MATCH');

        // Test password baru
        const testNew = await bcrypt.compare('NgendokFarm2026!Secure', admin.password);
        console.log('🔐 Test password "NgendokFarm2026!Secure":', testNew ? '✅ MATCH' : '❌ NO MATCH');

        // Jika masih password lama, update ke password baru
        if (testOld && !testNew) {
            console.log('\n⚠️  Password masih lama, updating...');
            const newHash = await bcrypt.hash('NgendokFarm2026!Secure', 10);
            
            await mongoose.connection.db.collection('users').updateOne(
                { username: 'admin' },
                { $set: { password: newHash, updatedAt: new Date() } }
            );
            
            console.log('✅ Password berhasil diupdate ke: NgendokFarm2026!Secure');
        }

        console.log('\n📋 Current Login:');
        console.log('   Username: admin');
        console.log('   Password:', testNew ? 'NgendokFarm2026!Secure' : 'admin123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

verifyAdmin();
