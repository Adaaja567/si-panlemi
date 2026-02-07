const express = require('express');
const Order = require('../models/Order');

const authAdmin = require('../middleware/authAdmin');
const requireRole = require('../middleware/requireRole');

const router = express.Router();

router.use(authAdmin);
router.use(requireRole('super_admin'));

router.get('/', async (req, res) => {
  try {
    const daysRaw = Number(req.query.days || 30);
    const days = Math.max(7, Math.min(3650, daysRaw));

    const from = new Date();
    from.setDate(from.getDate() - days + 1);
    from.setHours(0, 0, 0, 0);

    // hanya yang benar-benar dibayar
    const match = { paymentStatus: 'paid', paidAt: { $gte: from } };

    const agg = await Order.aggregate([
      { $match: match },
      {
        $addFields: {
          itemsTotal: {
            $reduce: {
              input: '$items',
              initialValue: 0,
              in: { $add: ['$$value', { $multiply: ['$$this.price', '$$this.quantity'] }] },
            },
          },
        },
      },
      {
        $addFields: {
          orderTotal: { $ifNull: ['$totalAmount', '$itemsTotal'] },
        },
      },
      {
        $facet: {
          summary: [
            {
              $group: {
                _id: null,
                revenuePaid: { $sum: '$orderTotal' },
                ordersPaidCount: { $sum: 1 },
              },
            },
          ],
          topProducts: [
            { $unwind: '$items' },
            {
              $group: {
                _id: '$items.product',
                name: { $first: '$items.name' },
                qty: { $sum: '$items.quantity' },
                revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
              },
            },
            { $sort: { qty: -1 } },
            { $limit: 10 },
          ],
          series: [
            {
              $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$paidAt' } },
                revenue: { $sum: '$orderTotal' },
                count: { $sum: 1 },
              },
            },
            { $sort: { _id: 1 } },
          ],
        },
      },
    ]);

    const summary = agg?.[0]?.summary?.[0] || { revenuePaid: 0, ordersPaidCount: 0 };

    return res.json({
      rangeDays: days,
      revenuePaid: summary.revenuePaid || 0,
      ordersPaidCount: summary.ordersPaidCount || 0,
      topProducts: agg?.[0]?.topProducts || [],
      series: agg?.[0]?.series || [],
    });
  } catch (err) {
    console.error('GET /api/super-admin/analytics error:', err);
    return res.status(500).json({ message: 'Gagal memuat analytics' });
  }
});

module.exports = router;