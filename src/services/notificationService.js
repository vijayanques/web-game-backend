const { Notification, User } = require('../models');
const socketService = require('./socketService');

/**
 * Create notification and send to users
 */
const createAndSendNotification = async (notificationData, sendToAll = true) => {
  try {
    // Create notification in database
    const notification = await Notification.create({
      title: notificationData.title,
      body: notificationData.body,
      type: notificationData.type,
      redirectUrl: notificationData.redirectUrl,
      userId: notificationData.userId || null,
      relatedGameId: notificationData.relatedGameId || null,
      relatedCategoryId: notificationData.relatedCategoryId || null,
      isRead: false,
    });

    console.log(' Notification created in DB:', notification.id);

    // Send via socket.io
    const notificationWithImage = {
      ...notification.toJSON(),
      imageUrl: notificationData.imageUrl,
    };
    socketService.emitNotification(notificationWithImage, sendToAll, notificationData.userId);

    return notification;
  } catch (error) {
    console.error('❌ Error creating and sending notification:', error);
    throw error;
  }
};

/**
 * Get user notifications
 */
const getUserNotifications = async (userId, limit = 20, offset = 0) => {
  try {
    const { Game, Category } = require('../models');
    const { count, rows } = await Notification.findAndCountAll({
      where: {
        [require('sequelize').Op.or]: [
          { userId },
          { userId: null }
        ]
      },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      include: [
        {
          model: Game,
          as: 'game',
          attributes: ['id', 'title', 'slug', 'thumbnail'],
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name', 'slug', 'image'],
        },
      ],
    });

    return { notifications: rows, total: count };
  } catch (error) {
    console.error('Error fetching user notifications:', error);
    throw error;
  }
};

/**
 * Get unread notification count
 */
const getUnreadCount = async (userId) => {
  try {
    const count = await Notification.count({
      where: {
        [require('sequelize').Op.or]: [
          { userId },
          { userId: null }
        ],
        isRead: false
      },
    });
    return count;
  } catch (error) {
    console.error('Error fetching unread count:', error);
    throw error;
  }
};

/**
 * Mark notification as read
 */
const markAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }
    notification.isRead = true;
    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error marking notification as read:', error);
    throw error;
  }
};

/**
 * Mark all notifications as read
 */
const markAllAsRead = async (userId) => {
  try {
    await Notification.update(
      { isRead: true },
      { where: { userId, isRead: false } }
    );
    return { success: true };
  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    throw error;
  }
};

/**
 * Delete notification
 */
const deleteNotification = async (notificationId) => {
  try {
    const notification = await Notification.findByPk(notificationId);
    if (!notification) {
      throw new Error('Notification not found');
    }
    await notification.destroy();
    return { success: true };
  } catch (error) {
    console.error('Error deleting notification:', error);
    throw error;
  }
};

/**
 * Send push notification via FCM
 */
const sendFcmNotification = async (token, payload) => {
  try {
    const admin = require('firebase-admin');

    // Check if firebase-admin is initialized
    if (!admin.apps.length) {
      console.warn('⚠️ Firebase Admin not initialized. Skipping push notification.');
      return null;
    }

    const message = {
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {},
      token: token,
    };

    const response = await admin.messaging().send(message);
    console.log('🚀 FCM Notification sent successfully:', response);
    return response;
  } catch (error) {
    console.error('❌ Error sending FCM notification:', error);
    throw error;
  }
};

module.exports = {
  createAndSendNotification,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendFcmNotification,
};
