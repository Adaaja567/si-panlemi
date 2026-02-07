require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const AdminUser = require('../models/AdminUser');

async function seedAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing admins
    await AdminUser.deleteMany({});
    console.log('Cleared existing admins');

    // Create default super admin
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash('admin123', saltRounds);

    const superAdmin = new AdminUser({
      username: 'admin',
      passwordHash,
      role: 'super_admin',
      isActive: true
    });

    await superAdmin.save();
    console.log('✅ Super admin created:');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('Role: super_admin');

    // Create regular admin
    const adminPasswordHash = await bcrypt.hash('admin456', saltRounds);
    const regularAdmin = new AdminUser({
      username: 'staff',
      passwordHash: adminPasswordHash,
      role: 'admin',
      isActive: true
    });

    await regularAdmin.save();
    console.log('\n✅ Regular admin created:');
    console.log('Username: staff');
    console.log('Password: admin456');
    console.log('Role: admin');

    console.log('\n🎉 Admin setup completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding admin:', error);
    process.exit(1);
  }
}

seedAdmin();