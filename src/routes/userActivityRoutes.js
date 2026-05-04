// User Activity Routes
// Track user game play activity

const express = require('express');
const router = express.Router();
const { UserActivity, Game, User, Category } = require('../models');

/**
 * POST /api/user-activity
 * Record when a user plays a game
 */
router.post('/', async (req, res) => {
  try {
    const { userId, gameId } = req.body;

    if (!userId || !gameId) {
      return res.status(400).json({
        success: false,
        message: 'userId and gameId are required',
      });
    }

    // Verify user exists
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify game exists and get its category
    const game = await Game.findByPk(gameId);
    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }

    // Create activity record
    const activity = await UserActivity.create({
      user_id: userId,
      game_id: gameId,
      category_id: game.categoryId,
      played_at: new Date(),
    });

    res.status(201).json({
      success: true,
      data: activity,
      message: 'Activity recorded successfully',
    });
  } catch (error) {
    console.error('Error recording activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record activity',
      error: error.message,
    });
  }
});

/**
 * GET /api/user-activity/:userId
 * Get user's activity history
 */
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const activities = await UserActivity.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Game,
          as: 'game',
        },
        {
          model: Category,
          as: 'category',
        },
      ],
      order: [['played_at', 'DESC']],
      limit: 50,
    });

    res.status(200).json({
      success: true,
      data: activities,
      message: 'Activity history retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching activity:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch activity',
      error: error.message,
    });
  }
});

/**
 * GET /api/user-activity/stats
 * Get overall activity statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const { Sequelize } = require('sequelize');
    
    // Get total number of plays
    const totalPlays = await UserActivity.count();
    
    // Get unique users who played
    const uniqueUsers = await UserActivity.count({
      distinct: true,
      col: 'user_id',
    });
    
    // Get most played games
    const mostPlayed = await UserActivity.findAll({
      attributes: [
        'game_id',
        [Sequelize.fn('COUNT', Sequelize.col('game_id')), 'playCount'],
      ],
      group: ['game_id'],
      order: [[Sequelize.literal('playCount'), 'DESC']],
      limit: 10,
      include: [
        {
          model: Game,
          as: 'game',
          attributes: ['id', 'title', 'thumbnail'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: {
        totalPlays,
        uniqueUsers,
        mostPlayed,
      },
      message: 'Statistics retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message,
    });
  }
});

module.exports = router;
