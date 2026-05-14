const express = require('express');
const router = express.Router();
const trafficController = require('../controllers/trafficController');

// Public route to track traffic
router.post('/track', trafficController.trackTraffic);

// Admin route to get stats
router.get('/stats', trafficController.getTrafficStats);

module.exports = router;
