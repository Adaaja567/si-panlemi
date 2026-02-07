require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminUser = require('./src/models/AdminUser');

async function checkAndFixAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Cek semua admin
    const allAdmins = await AdminUser.find({});
    console.log('\n📋 All admins in database:');
    allAdmins.forEach(admin => {
      console.log(`  - Username: ${admin.username}`);
      console.log(`    Role: ${admin.role}`);
      console.log(`    Active: ${admin.isActive}`);
      console.log(`    Password Hash: ${admin.passwordHash.substring(0, 20)}...`);
      console.log('');
    });

    // Cari superadmin
    let superadmin = await AdminUser.findOne({ username: 'superadmin' });

    if (!superadmin) {
      console.log('❌ Superadmin not found, creating new one...');
      const hashedPassword = await bcrypt.hash('SuperAdmin2026', 10);
      superadmin = await AdminUser.create({
        username: 'superadmin',
        passwordHash: hashedPassword,
        role: 'super_admin',
        isActive: true
      });
      console.log('✅ Superadmin created successfully!');
    } else {
      console.log('✅ Superadmin found, updating password...');
      const hashedPassword = await bcrypt.hash('SuperAdmin2026', 10);
      superadmin.passwordHash = hashedPassword;
      superadmin.role = 'super_admin';
      superadmin.isActive = true;
      await superadmin.save();
      console.log('✅ Superadmin password updated!');
    }

    // Test password
    console.log('\n🔐 Testing password...');
    const isMatch = await bcrypt.compare('SuperAdmin2026', superadmin.passwordHash);
    console.log(`Password test result: ${isMatch ? '✅ MATCH' : '❌ NO MATCH'}`);

    console.log('\n✅ Done! You can now login with:');
    console.log('   Username: superadmin');
    console.log('   Password: SuperAdmin2026');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

checkAndFixAdmin();
