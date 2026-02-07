// Script untuk cek field admin di database
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function checkAdminField() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const admin = await mongoose.connection.db.collection('users').findOne({ username: 'admin' });
        
        console.log('👤 Admin fields:');
        console.log(JSON.stringify(admin, null, 2));

        // Cek field mana yang ada
        console.log('\n🔍 Field check:');
        console.log('   password:', admin.password ? '✅ ADA' : '❌ TIDAK ADA');
        console.log('   passwordHash:', admin.passwordHash ? '✅ ADA' : '❌ TIDAK ADA');

        // Update ke field yang benar
        if (admin.password && !admin.passwordHash) {
            console.log('\n⚠️  Field salah! Updating...');
            await mongoose.connection.db.collection('users').updateOne(
                { username: 'admin' },
                { 
                    $set: { passwordHash: admin.password },
                    $unset: { password: "" }
                }
            );
            console.log('✅ Field diperbaiki: password → passwordHash');
        }

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

checkAdminField();
