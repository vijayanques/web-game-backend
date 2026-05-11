// Category Controller
// Handles all category-related business logic with games

const { Category, Game } = require('../models');
const { uploadToCloudinary } = require('../utils/cloudinaryUpload');

// Get all categories with their games
exports.getAllCategoriesWithGames = async (req, res) => {
  try {
    const categories = await Category.findAll({
      where: { isActive: true },
      include: [
        {
          model: Game,
          as: 'games',
          where: { isActive: true },
          required: false,
          attributes: [
            'id',
            'title',
            'slug',
            'description',
            'genre',
            'rating',
            'thumbnail',
            'gameUrl',
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};

// Get all categories for admin (including inactive)
exports.getAllCategoriesForAdmin = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Game,
          as: 'games',
          required: false,
          attributes: [
            'id',
            'title',
            'slug',
            'description',
            'genre',
            'rating',
            'thumbnail',
            'gameUrl',
          ],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching categories',
      error: error.message,
    });
  }
};

// Get single category with its games (supports both ID and slug)
exports.getCategoryWithGames = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if id is a number (ID) or string (slug)
    const isNumeric = !isNaN(id);
    
    const category = await Category.findOne({
      where: isNumeric ? { id } : { slug: id },
      include: [
        {
          model: Game,
          as: 'games',
          where: { isActive: true },
          required: false,
          attributes: [
            'id',
            'title',
            'slug',
            'description',
            'genre',
            'rating',
            'thumbnail',
            'gameUrl',
          ],
        },
      ],
    });

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching category',
      error: error.message,
    });
  }
};

// Create a new category
exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    let image = null;
    
    console.log('Received category data:', { name, description, icon }); // Debug log
    
    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        image = result.secure_url;
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Image upload failed',
          error: uploadError.message,
        });
      }
    }

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required',
      });
    }

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');

    const category = await Category.create({
      name,
      slug,
      description,
      icon: icon || 'Tag', // Add icon field with default value
      image,
    });

    console.log('Category created:', category.toJSON()); // Debug log

    res.status(201).json({
      success: true,
      message: 'Category created successfully',
      data: category,
    });
  } catch (error) {
    console.error('Error creating category:', error); // Debug log
    res.status(500).json({
      success: false,
      message: 'Error creating category',
      error: error.message,
    });
  }
};

// Update category
exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, icon, isActive } = req.body;
    let image = null;
    
    // Upload image to Cloudinary if provided
    if (req.file) {
      try {
        const result = await uploadToCloudinary(req.file.buffer, req.file.originalname);
        image = result.secure_url;
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        return res.status(400).json({
          success: false,
          message: 'Image upload failed',
          error: uploadError.message,
        });
      }
    }

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    if (name) {
      category.name = name;
      // Generate slug from name
      category.slug = name
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }
    if (description) category.description = description;
    if (icon) category.icon = icon; // Add icon update
    if (image) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.status(200).json({
      success: true,
      message: 'Category updated successfully',
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating category',
      error: error.message,
    });
  }
};

// Delete category
exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const category = await Category.findByPk(id);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Category not found',
      });
    }

    await category.destroy();

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting category',
      error: error.message,
    });
  }
};
