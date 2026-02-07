// Script untuk seed default settings
require('dotenv').config();
const mongoose = require('mongoose');

async function seedSettings() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const Settings = mongoose.connection.db.collection('settings');

        // Default jam operasional
        const defaultSettings = [
            {
                key: 'jam_operasional',
                value: {
                    senin: { buka: '08:00', tutup: '17:00', libur: false },
                    selasa: { buka: '08:00', tutup: '17:00', libur: false },
                    rabu: { buka: '08:00', tutup: '17:00', libur: false },
                    kamis: { buka: '08:00', tutup: '17:00', libur: false },
                    jumat: { buka: '08:00', tutup: '17:00', libur: false },
                    sabtu: { buka: '08:00', tutup: '15:00', libur: false },
                    minggu: { buka: '00:00', tutup: '00:00', libur: true }
                },
                description: 'Jam operasional toko',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ];

        for (const setting of defaultSettings) {
            await Settings.updateOne(
                { key: setting.key },
                { $set: setting },
                { upsert: true }
            );
        }

        console.log('✅ Default settings berhasil dibuat!');
        console.log('\n📋 Settings:');
        const all = await Settings.find({}).toArray();
        all.forEach(s => {
            console.log(`   - ${s.key}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

seedSettings();
