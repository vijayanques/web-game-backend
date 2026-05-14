const { SiteTraffic } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

// Track user activity (Public)
exports.trackTraffic = async (req, res) => {
  try {
    const { username, page, device, browser, action, sessionTime, timestamp } = req.body;
    
    // Get IP from request
    let ipAddress = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    if (ipAddress.includes(',')) ipAddress = ipAddress.split(',')[0].trim();
    
    const traffic = await SiteTraffic.create({
      username: username || 'Guest',
      page,
      device: device || 'desktop',
      browser: browser || 'chrome',
      action: action || 'page_view',
      sessionTime: sessionTime || '0s',
      ipAddress,
      timestamp: timestamp || new Date()
    });

    res.status(200).json({ success: true, data: traffic });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error tracking traffic', error: error.message });
  }
};

// Get traffic statistics (Admin)
exports.getTrafficStats = async (req, res) => {
  try {
    const now = new Date();
    
    // Page Visits (Total actions of type 'page_view')
    const pageVisits = await SiteTraffic.count({ where: { action: 'page_view' } });
    
    // Total Visitors (Unique IPs)
    const totalVisitors = await SiteTraffic.count({ distinct: true, col: 'ipAddress' });
    
    // Online Users (Active in last 5 mins)
    const fiveMinsAgo = new Date(now.getTime() - 5 * 60000);
    const onlineUsers = await SiteTraffic.count({
      distinct: true,
      col: 'ipAddress',
      where: { timestamp: { [Op.gte]: fiveMinsAgo } }
    });
    
    // Games Started & Completed
    const gamesStarted = await SiteTraffic.count({ where: { action: 'game_started' } });
    const gamesCompleted = await SiteTraffic.count({ where: { action: 'game_completed' } });

    // Device Analytics
    const mobileUsers = await SiteTraffic.count({ where: { device: 'mobile' } });
    const desktopUsers = await SiteTraffic.count({ where: { device: 'desktop' } });
    const tabletUsers = await SiteTraffic.count({ where: { device: 'tablet' } });

    // Browser Analytics
    const chrome = await SiteTraffic.count({ where: { browser: 'chrome' } });
    const safari = await SiteTraffic.count({ where: { browser: 'safari' } });
    const firefox = await SiteTraffic.count({ where: { browser: 'firefox' } });
    const edge = await SiteTraffic.count({ where: { browser: 'edge' } });
    
    // Other browsers
    const allBrowsersCount = await SiteTraffic.count();
    const otherBrowsers = allBrowsersCount - (chrome + safari + firefox + edge);

    // Recent Activity Table (Last 500 to allow frontend pagination/search)
    const recentActivity = await SiteTraffic.findAll({
      order: [['timestamp', 'DESC']],
      limit: 500
    });

    // Chart Data (Mock aggregation for now, but dynamic from DB if you group by date)
    // To make it truly dynamic, we group by DATE(timestamp)
    const dailyData = await SiteTraffic.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('timestamp')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: [sequelize.fn('DATE', sequelize.col('timestamp'))],
      order: [[sequelize.fn('DATE', sequelize.col('timestamp')), 'ASC']],
      limit: 7
    });

    // Calculate Average Session Time dynamically
    const userSessions = await SiteTraffic.findAll({
      attributes: [
        'ipAddress',
        [sequelize.fn('MIN', sequelize.col('timestamp')), 'start_time'],
        [sequelize.fn('MAX', sequelize.col('timestamp')), 'end_time']
      ],
      group: ['ipAddress']
    });

    let totalDuration = 0;
    let validSessions = 0;
    userSessions.forEach(session => {
      const start = new Date(session.dataValues.start_time);
      const end = new Date(session.dataValues.end_time);
      const duration = (end - start) / 1000; // in seconds
      if (duration > 0) {
        totalDuration += duration;
        validSessions++;
      }
    });

    const avgSessionSeconds = validSessions > 0 ? totalDuration / validSessions : 0;
    const avgMinutes = Math.floor(avgSessionSeconds / 60);
    const avgSeconds = Math.floor(avgSessionSeconds % 60);
    const avgSessionTime = `${avgMinutes}m ${avgSeconds}s`;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          pageVisits,
          totalVisitors,
          onlineUsers,
          gamesStarted,
          gamesCompleted,
          avgSessionTime
        },
        devices: { mobile: mobileUsers, desktop: desktopUsers, other: tabletUsers },
        browsers: { chrome, safari, firefox, edge, other: otherBrowsers },
        recentActivity,
        charts: { dailyData }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching traffic stats', error: error.message });
  }
};
