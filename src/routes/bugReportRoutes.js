const express = require('express');
const router = express.Router();
const bugReportController = require('../controllers/bugReportController');

router.post('/', bugReportController.createBugReport);
router.get('/', bugReportController.getAllBugReports);
router.get('/user/:username', bugReportController.getUserBugReports);
router.put('/:id/status', bugReportController.updateBugReportStatus);

module.exports = router;
