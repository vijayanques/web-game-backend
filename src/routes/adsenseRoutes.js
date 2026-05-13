const express = require('express');
const router = express.Router();
const adsenseController = require('../controllers/adsenseController');

// Public route for frontend
router.get('/config', adsenseController.getAdConfigs);

// Admin routes (In a real app, these should be protected by admin middleware)
router.get('/all', adsenseController.getAllAdConfigs);
router.post('/upsert', adsenseController.upsertAdConfig);
router.delete('/:id', adsenseController.deleteAdConfig);

module.exports = router;
