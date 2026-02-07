// Script untuk cek case sensitivity username
require('dotenv').config();
const mongoose = require('mongoose');

async function checkUsernameCase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const admin = await mongoose.connection.db.collection('adminusers').findOne({ username: 'superadmin' });
        
        console.log('👤 Admin di database:');
        console.log('   Username (raw):', admin.username);
        console.log('   Username (lowercase):', admin.username.toLowerCase());
        
        // Test berbagai case
        const tests = ['superadmin', 'SUPERADMIN', 'SuperAdmin', 'Superadmin'];
        console.log('\n🔍 Test username case:');
        tests.forEach(test => {
            const match = test.toLowerCase() === admin.username;
            console.log(`   "${test}" → ${match ? '✅ MATCH' : '❌ NO MATCH'}`);
        });

        console.log('\n📋 LOGIN (case insensitive):');
        console.log('   Username: superadmin (atau SUPERADMIN atau SuperAdmin)');
        console.log('   Password: e9d72cc89d3d87653851d872fd6a6e98ada60562ffbe6ff2c2844bec2ec20a67');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkUsernameCase();
