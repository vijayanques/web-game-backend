// Top Picks Routes
// Personalized game recommendations based on user activity

const express = require('express');
const router = express.Router();
const { UserActivity, Game, Category, User } = require('../models');
const { Op } = require('sequelize');

/**
 * GET /api/top-picks?userId={id}
 * Get personalized game recommendations for a user
 */
router.get('/', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required',
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

    // Get user's activity to find their preferred categories
    const userActivities = await UserActivity.findAll({
      where: { user_id: userId },
      attributes: ['category_id'],
    });

    // Extract category IDs from user's activity
    const categoryIds = [
      ...new Set(
        userActivities
          .map((activity) => activity.category_id)
          .filter((id) => id !== null)
      ),
    ];

    // Get games the user has already played
    const playedGameIds = await UserActivity.findAll({
      where: { user_id: userId },
      attributes: ['game_id'],
    }).then((activities) => activities.map((a) => a.game_id));

    let recommendedGames = [];

    // If user has activity, recommend games from their preferred categories
    if (categoryIds.length > 0) {
      recommendedGames = await Game.findAll({
        where: {
          categoryId: {
            [Op.in]: categoryIds,
          },
          id: {
            [Op.notIn]: playedGameIds.length > 0 ? playedGameIds : [0],
          },
        },
        include: [
          {
            model: Category,
            as: 'category',
          },
        ],
        limit: 10,
        order: [['createdAt', 'DESC']],
      });
    }

    // If not enough recommendations, add popular games
    if (recommendedGames.length < 10) {
      const additionalGames = await Game.findAll({
        where: {
          id: {
            [Op.notIn]: [
              ...playedGameIds,
              ...recommendedGames.map((g) => g.id),
            ],
          },
        },
        include: [
          {
            model: Category,
            as: 'category',
          },
        ],
        limit: 10 - recommendedGames.length,
        order: [['createdAt', 'DESC']],
      });

      recommendedGames = [...recommendedGames, ...additionalGames];
    }

    // Format response to match frontend expectations
    const formattedGames = recommendedGames.map((game) => {
      const plainGame = game.get({ plain: true });
      return {
        id: plainGame.id,
        name: plainGame.title, // Frontend expects 'name'
        title: plainGame.title,
        category: plainGame.category?.name || '',
        categoryId: plainGame.categoryId,
        thumbnail: plainGame.thumbnail || 'https://via.placeholder.com/300x200?text=' + encodeURIComponent(plainGame.title),
        url: plainGame.gameUrl || '', // Frontend expects 'url'
        gameUrl: plainGame.gameUrl,
        slug: plainGame.slug,
        description: plainGame.description,
        genre: plainGame.genre,
        releaseDate: plainGame.releaseDate,
        rating: plainGame.rating,
        isActive: plainGame.isActive,
      };
    });

    res.status(200).json({
      success: true,
      data: formattedGames,
      message: 'Top picks retrieved successfully',
    });
  } catch (error) {
    console.error('Error fetching top picks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch top picks',
      error: error.message,
    });
  }
});

module.exports = router;
