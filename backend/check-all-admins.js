// Script untuk cek semua admin di database
require('dotenv').config();
const mongoose = require('mongoose');

async function checkAllAdmins() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // Cek semua user dengan role admin
        const admins = await mongoose.connection.db.collection('users').find({ role: 'admin' }).toArray();
        
        console.log(`👥 Total admin: ${admins.length}\n`);
        
        admins.forEach((admin, index) => {
            console.log(`Admin ${index + 1}:`);
            console.log('   ID:', admin._id);
            console.log('   Username:', admin.username);
            console.log('   Email:', admin.email);
            console.log('   Role:', admin.role);
            console.log('   Created:', admin.createdAt);
            console.log('');
        });

        // Hapus admin dengan username 'admin' (yang lama)
        const deleteResult = await mongoose.connection.db.collection('users').deleteMany({ username: 'admin' });
        console.log(`🗑️  Deleted ${deleteResult.deletedCount} admin dengan username 'admin'`);

        // Verify hanya ada superadmin
        const remaining = await mongoose.connection.db.collection('users').find({ role: 'admin' }).toArray();
        console.log(`\n✅ Admin tersisa: ${remaining.length}`);
        remaining.forEach(admin => {
            console.log(`   - ${admin.username}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkAllAdmins();
