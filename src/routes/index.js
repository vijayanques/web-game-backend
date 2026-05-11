// Routes Index
// Centralized export for all route modules

const express = require('express');
const userRoutes = require('./userRoutes');
const categoryRoutes = require('./categoryRoutes');
const gameRoutes = require('./gameRoutes');
const topPicksRoutes = require('./topPicksRoutes');
const userActivityRoutes = require('./userActivityRoutes');
const adminRoutes = require('./adminRoutes');
const seoRoutes = require('./seoRoutes');

const router = express.Router();

// Mount routes
router.use('/api/users', userRoutes);
router.use('/api/categories', categoryRoutes);
router.use('/api/games', gameRoutes);
router.use('/api/top-picks', topPicksRoutes);
router.use('/api/user-activity', userActivityRoutes);
router.use('/api/admin', adminRoutes);
router.use('/api/seo', seoRoutes);

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
  });
});

// Test endpoint for debugging
router.post('/api/test', (req, res) => {
  console.log('Test endpoint called');
  console.log('Request body:', req.body);
  res.status(200).json({
    success: true,
    message: 'Test endpoint working',
    receivedData: req.body,
  });
});

module.exports = router;
