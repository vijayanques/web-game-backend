// Game Controller
// Handles all game-related business logic

const { Game, Category } = require('../models');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Get all games (with category info)
exports.getAllGames = async (req, res) => {
  try {
    const { search, category_id } = req.query;
    
    // Build where clause
    const whereClause = { isActive: true };
    
    // Add category filter if provided
    if (category_id) {
      whereClause.categoryId = category_id;
    }
    
    // Add search filter if provided
    if (search) {
      const { Op } = require('sequelize');
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { genre: { [Op.like]: `%${search}%` } },
      ];
    }

    const games = await Game.findAll({
      where: whereClause,
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: games,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching games',
      error: error.message,
    });
  }
};

// Search games (dedicated search endpoint)
exports.searchGames = async (req, res) => {
  try {
    const { q } = req.query;
    
    // Return empty array if search query is too short
    if (!q || q.trim().length < 2) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'Search query too short',
      });
    }

    const { Op } = require('sequelize');
    
    // Search in games and include category
    const games = await Game.findAll({
      where: {
        isActive: true,
        [Op.or]: [
          { title: { [Op.like]: `%${q}%` } },
          { description: { [Op.like]: `%${q}%` } },
          { genre: { [Op.like]: `%${q}%` } },
        ],
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
      limit: 10,
      order: [
        // Prioritize exact matches in title
        [
          require('sequelize').literal(
            `CASE 
              WHEN title LIKE '${q}%' THEN 1 
              WHEN title LIKE '%${q}%' THEN 2 
              ELSE 3 
            END`
          ),
          'ASC'
        ],
        ['title', 'ASC']
      ],
    });

    // Format response to match frontend expectations
    const formattedGames = games.map(game => ({
      id: game.id,
      title: game.title,
      slug: game.slug,
      thumbnail_url: game.thumbnail,
      description: game.description,
      category_name: game.category ? game.category.name : null,
      category_id: game.categoryId,
      genre: game.genre,
      rating: game.rating,
    }));

    res.status(200).json({
      success: true,
      data: formattedGames,
      count: formattedGames.length,
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Error searching games',
      error: error.message,
    });
  }
};

// Get game by ID or slug
exports.getGameById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if id is a number (ID) or string (slug)
    const isNumeric = !isNaN(id);
    
    const game = await Game.findOne({
      where: isNumeric ? { id } : { slug: id },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }

    res.status(200).json({
      success: true,
      data: game,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching game',
      error: error.message,
    });
  }
};

// Get games by category
exports.getGamesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;

    const games = await Game.findAll({
      where: { categoryId, isActive: true },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name'],
        },
      ],
    });

    res.status(200).json({
      success: true,
      data: games,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching games by category',
      error: error.message,
    });
  }
};

// Create a new game
exports.createGame = async (req, res) => {
  try {
    const {
      categoryId,
      title,
      description,
      genre,
      releaseDate,
      rating,
      gameUrl,
    } = req.body;
    let thumbnail = null;
    let videoUrl = null;

    console.log('📝 Creating game:', { categoryId, title, genre, rating });
    console.log('📁 Files:', req.files ? Object.keys(req.files) : 'none');

    // Upload thumbnail
    if (req.files?.thumbnail?.[0]) {
      try {
        const result = await uploadToCloudinary(req.files.thumbnail[0].buffer, req.files.thumbnail[0].originalname, 'image');
        thumbnail = result.secure_url;
        console.log('✅ Thumbnail:', thumbnail);
      } catch (uploadError) {
        console.error('❌ Thumbnail error:', uploadError.message);
        return res.status(400).json({
          success: false,
          message: 'Thumbnail upload failed',
          error: uploadError.message,
        });
      }
    }

    // Upload video
    if (req.files?.video?.[0]) {
      try {
        const result = await uploadToCloudinary(req.files.video[0].buffer, req.files.video[0].originalname, 'video');
        videoUrl = result.secure_url;
        console.log('✅ Video:', videoUrl);
      } catch (uploadError) {
        console.error('❌ Video error:', uploadError.message);
        return res.status(400).json({
          success: false,
          message: 'Video upload failed',
          error: uploadError.message,
        });
      }
    }

    // Validate required fields
    if (!categoryId || !title || !genre) {
      console.error('❌ Missing required fields');
      return res.status(400).json({
        success: false,
        message: 'categoryId, title, and genre are required',
      });
    }

    // Verify category exists
    const category = await Category.findByPk(categoryId);
    if (!category) {
      console.error('❌ Category not found:', categoryId);
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    // Generate slug
    const slug = generateSlug(title);

    // Convert and validate rating
    let ratingValue = 0;
    if (rating) {
      ratingValue = parseFloat(rating);
      if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 10) {
        ratingValue = 0;
      }
    }

    console.log('📊 Final data:', { categoryId: parseInt(categoryId), title, genre, rating: ratingValue });

    const game = await Game.create({
      categoryId: parseInt(categoryId),
      title,
      slug,
      description: description || '',
      thumbnail,
      videoUrl,
      genre,
      releaseDate: releaseDate || null,
      rating: ratingValue,
      gameUrl: gameUrl || '',
    });

    console.log('✅ Game created:', game.id);
    res.status(201).json({
      success: true,
      message: 'Game created successfully',
      data: game,
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error creating game',
      error: error.message,
      details: error.errors ? error.errors.map(e => e.message) : null,
    });
  }
};

// Update game
exports.updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      categoryId,
      title,
      description,
      genre,
      releaseDate,
      rating,
      isActive,
      gameUrl,
    } = req.body;
    let thumbnail = null;
    let videoUrl = null;

    console.log('📝 Updating game:', id);

    // Upload thumbnail
    if (req.files?.thumbnail?.[0]) {
      try {
        const result = await uploadToCloudinary(req.files.thumbnail[0].buffer, req.files.thumbnail[0].originalname, 'image');
        thumbnail = result.secure_url;
        console.log('✅ Thumbnail:', thumbnail);
      } catch (uploadError) {
        console.error('❌ Thumbnail error:', uploadError.message);
        return res.status(400).json({
          success: false,
          message: 'Thumbnail upload failed',
          error: uploadError.message,
        });
      }
    }

    // Upload video
    if (req.files?.video?.[0]) {
      try {
        const result = await uploadToCloudinary(req.files.video[0].buffer, req.files.video[0].originalname, 'video');
        videoUrl = result.secure_url;
        console.log('✅ Video:', videoUrl);
      } catch (uploadError) {
        console.error('❌ Video error:', uploadError.message);
        return res.status(400).json({
          success: false,
          message: 'Video upload failed',
          error: uploadError.message,
        });
      }
    }

    const game = await Game.findByPk(id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }

    // Verify category exists if categoryId is being updated
    if (categoryId && categoryId !== game.categoryId) {
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found',
        });
      }
      game.categoryId = categoryId;
    }

    if (title) {
      game.title = title;
      game.slug = generateSlug(title);
    }
    if (description) game.description = description;
    if (thumbnail) game.thumbnail = thumbnail;
    if (videoUrl) game.videoUrl = videoUrl;
    if (genre) game.genre = genre;
    if (releaseDate) game.releaseDate = releaseDate;
    if (rating !== undefined) {
      let ratingValue = parseFloat(rating);
      if (isNaN(ratingValue) || ratingValue < 0 || ratingValue > 10) {
        ratingValue = 0;
      }
      game.rating = ratingValue;
    }
    if (isActive !== undefined) game.isActive = isActive;
    if (gameUrl) game.gameUrl = gameUrl;

    await game.save();

    console.log('✅ Game updated:', game.id);
    res.status(200).json({
      success: true,
      message: 'Game updated successfully',
      data: game,
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating game',
      error: error.message,
      details: error.errors ? error.errors.map(e => e.message) : null,
    });
  }
};

// Delete game
exports.deleteGame = async (req, res) => {
  try {
    const { id } = req.params;

    const game = await Game.findByPk(id);

    if (!game) {
      return res.status(404).json({
        success: false,
        message: 'Game not found',
      });
    }

    await game.destroy();

    res.status(200).json({
      success: true,
      message: 'Game deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting game',
      error: error.message,
    });
  }
};
