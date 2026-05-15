const express = require('express');
const router = express.Router();
const firebaseTokenController = require('../controllers/firebaseTokenController');

// POST /api/firebase-tokens/save - Save FCM token
router.post('/save', firebaseTokenController.saveToken);

// POST /api/firebase-tokens/deactivate - Deactivate FCM token
router.post('/deactivate', firebaseTokenController.deactivateToken);

// Admin routes
router.get('/list', firebaseTokenController.listTokens);
router.post('/test-send', firebaseTokenController.testSendNotification);

module.exports = router;
