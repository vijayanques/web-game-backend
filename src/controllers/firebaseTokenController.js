const { FirebaseToken } = require('../models');

/**
 * Save or update a Firebase registration token
 */
exports.saveToken = async (req, res) => {
  try {
    const { token, deviceInfo, userId } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    // Try to find existing token
    let firebaseToken = await FirebaseToken.findOne({ where: { token } });

    if (firebaseToken) {
      // Update existing token
      firebaseToken.userId = userId || firebaseToken.userId;
      firebaseToken.deviceInfo = deviceInfo || firebaseToken.deviceInfo;
      firebaseToken.isActive = true;
      await firebaseToken.save();
    } else {
      // Create new token
      firebaseToken = await FirebaseToken.create({
        token,
        userId: userId || null,
        deviceInfo: deviceInfo || null,
        isActive: true,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Firebase token saved successfully',
      data: firebaseToken,
    });
  } catch (error) {
    console.error('Error saving Firebase token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save Firebase token',
      error: error.message,
    });
  }
};

/**
 * Deactivate a Firebase registration token (e.g., on logout)
 */
exports.deactivateToken = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    const firebaseToken = await FirebaseToken.findOne({ where: { token } });

    if (firebaseToken) {
      firebaseToken.isActive = false;
      await firebaseToken.save();
    }

    res.status(200).json({
      success: true,
      message: 'Firebase token deactivated successfully',
    });
  } catch (error) {
    console.error('Error deactivating Firebase token:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to deactivate Firebase token',
      error: error.message,
    });
  }
};
/**
 * List all registration tokens (for admin)
 */
exports.listTokens = async (req, res) => {
  try {
    const { User } = require('../models');
    const tokens = await FirebaseToken.findAll({
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: tokens,
    });
  } catch (error) {
    console.error('Error listing Firebase tokens:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to list Firebase tokens',
      error: error.message,
    });
  }
};

/**
 * Send a test notification to a specific token
 */
exports.testSendNotification = async (req, res) => {
  try {
    const { token, title, message, data } = req.body;
    const notificationService = require('../services/notificationService');

    if (!token) {
      return res.status(400).json({
        success: false,
        message: 'Token is required',
      });
    }

    const result = await notificationService.sendFcmNotification(token, {
      title: title || 'Test Notification',
      body: message || 'This is a test notification from the admin panel.',
      data: data || {},
    });

    res.status(200).json({
      success: true,
      message: 'Notification sent successfully',
      result,
    });
  } catch (error) {
    console.error('Error sending test notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test notification',
      error: error.message,
    });
  }
};
