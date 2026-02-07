// Script untuk update status ke bahasa Indonesia
require('dotenv').config();
const mongoose = require('mongoose');

async function updateStatus() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB\n');

        const Orders = mongoose.connection.db.collection('orders');

        // Mapping status lama ke baru
        const statusMap = {
            'pending': 'menunggu',
            'confirmed': 'dikonfirmasi',
            'paid': 'dibayar',
            'shipped': 'dikirim',
            'completed': 'selesai',
            'cancelled': 'dibatalkan'
        };

        const paymentStatusMap = {
            'unpaid': 'belum_bayar',
            'paid': 'sudah_bayar'
        };

        // Update status
        for (const [oldStatus, newStatus] of Object.entries(statusMap)) {
            const result = await Orders.updateMany(
                { status: oldStatus },
                { $set: { status: newStatus } }
            );
            if (result.modifiedCount > 0) {
                console.log(`✅ Updated ${result.modifiedCount} orders: ${oldStatus} → ${newStatus}`);
            }
        }

        // Update payment status
        for (const [oldStatus, newStatus] of Object.entries(paymentStatusMap)) {
            const result = await Orders.updateMany(
                { paymentStatus: oldStatus },
                { $set: { paymentStatus: newStatus } }
            );
            if (result.modifiedCount > 0) {
                console.log(`✅ Updated ${result.modifiedCount} orders payment: ${oldStatus} → ${newStatus}`);
            }
        }

        console.log('\n✅ Semua status berhasil diupdate ke bahasa Indonesia!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

updateStatus();
