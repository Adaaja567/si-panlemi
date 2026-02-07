const express = require('express');
const Settings = require('../models/Settings');
const authAdmin = require('../middleware/authAdmin');

const router = express.Router();

// GET /api/settings - Get all settings (public)
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.find({});
    const settingsObj = {};
    settings.forEach(s => {
      settingsObj[s.key] = s.value;
    });
    return res.json(settingsObj);
  } catch (err) {
    console.error('GET /api/settings error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// GET /api/settings/:key - Get specific setting (public)
router.get('/:key', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });
    if (!setting) {
      return res.status(404).json({ message: 'Setting tidak ditemukan' });
    }
    return res.json({ key: setting.key, value: setting.value });
  } catch (err) {
    console.error('GET /api/settings/:key error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

// PUT /api/settings/:key - Update setting (admin only)
router.put('/:key', authAdmin, async (req, res) => {
  try {
    const { value, description } = req.body;
    
    const setting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { value, description, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    
    return res.json({ 
      message: 'Setting berhasil diupdate',
      setting: { key: setting.key, value: setting.value }
    });
  } catch (err) {
    console.error('PUT /api/settings/:key error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

module.exports = router;
