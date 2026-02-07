// Script untuk cek semua collections dan admin
require('dotenv').config();
const mongoose = require('mongoose');

async function checkCollections() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        // List semua collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📁 Collections yang ada:');
        collections.forEach(col => {
            console.log(`   - ${col.name}`);
        });

        // Cek collection 'users'
        console.log('\n👥 Collection "users":');
        const users = await mongoose.connection.db.collection('users').find({ role: 'admin' }).toArray();
        console.log(`   Total admin: ${users.length}`);
        users.forEach(u => console.log(`   - ${u.username}`));

        // Cek collection 'adminusers'
        console.log('\n👥 Collection "adminusers":');
        const adminusers = await mongoose.connection.db.collection('adminusers').find({}).toArray();
        console.log(`   Total admin: ${adminusers.length}`);
        adminusers.forEach(u => console.log(`   - ${u.username}`));

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkCollections();
