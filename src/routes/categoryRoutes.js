// Category Routes
// Defines all category-related API endpoints

const express = require('express');
const categoryController = require('../controllers/categoryController');
const upload = require('../middleware/cloudinaryUpload');

const router = express.Router();

// GET all categories for admin (including inactive)
router.get('/admin/all', categoryController.getAllCategoriesForAdmin);

// GET all categories with their games (only active)
router.get('/', categoryController.getAllCategoriesWithGames);

// GET single category with its games
router.get('/:id', categoryController.getCategoryWithGames);

// POST create new category with image upload
router.post('/', upload.single('image'), categoryController.createCategory);

// PUT update category with image upload
router.put('/:id', upload.single('image'), categoryController.updateCategory);

// DELETE category
router.delete('/:id', categoryController.deleteCategory);

module.exports = router;
