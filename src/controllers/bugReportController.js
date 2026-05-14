const { BugReport } = require('../models');

// Create a new bug report (Frontend)
exports.createBugReport = async (req, res) => {
  try {
    const { username, title, description, imageUrl } = req.body;
    
    const initialHistory = [{
      status: 'Pending',
      message: 'Bug report submitted successfully.',
      timestamp: new Date().toISOString()
    }];

    const bugReport = await BugReport.create({
      username: username || 'Guest',
      title,
      description,
      imageUrl,
      status: 'Pending',
      history: initialHistory
    });

    res.status(201).json({ success: true, data: bugReport });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error creating bug report', error: error.message });
  }
};

// Get all bug reports (Admin)
exports.getAllBugReports = async (req, res) => {
  try {
    const bugReports = await BugReport.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, data: bugReports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching bug reports', error: error.message });
  }
};

// Get bug reports by username (Frontend tracking)
exports.getUserBugReports = async (req, res) => {
  try {
    const { username } = req.params;
    const bugReports = await BugReport.findAll({
      where: { username },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ success: true, data: bugReports });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching user bug reports', error: error.message });
  }
};

// Update bug report status (Admin)
exports.updateBugReportStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminMessage } = req.body;

    const bugReport = await BugReport.findByPk(id);
    if (!bugReport) {
      return res.status(404).json({ success: false, message: 'Bug report not found' });
    }

    const currentHistory = bugReport.history || [];
    const updatedHistory = [
      ...currentHistory,
      {
        status,
        message: adminMessage || `Status updated to ${status}`,
        timestamp: new Date().toISOString()
      }
    ];

    await bugReport.update({
      status,
      history: updatedHistory
    });

    res.status(200).json({ success: true, data: bugReport });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating bug report', error: error.message });
  }
};
