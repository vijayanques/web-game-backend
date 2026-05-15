const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'game-admin-secret-key-2024';

// Admin credentials (in production, use database)
const ADMIN_USERS = [
  {
    id: 1,
    email: 'admin@gameplatform.com',
    password: '$2b$10$PCI9fzqpscU/kFiMHFYU3uaDE3U142/ymiGy012/HCp.h9xakRERm', // Admin@123
    name: 'Admin User',
    role: 'super_admin'
  }
];

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const user = ADMIN_USERS.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Logout endpoint
router.post('/logout', (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  res.json({ success: true });
});

// Dashboard statistics
router.get('/dashboard/stats', adminController.getDashboardStats);

// Reset trending stats
router.post('/reset-trending', adminController.resetTrendingStats);

module.exports = router;
