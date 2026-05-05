// Game Routes
// Defines all game-related API endpoints

const express = require('express');
const gameController = require('../controllers/gameController');
const upload = require('../middleware/cloudinaryUpload');

const router = express.Router();

// GET search games (must be before /:id route)
router.get('/search', gameController.searchGames);

// GET all games
router.get('/', gameController.getAllGames);

// GET games by category
router.get('/category/:categoryId', gameController.getGamesByCategory);

// GET game by ID
router.get('/:id', gameController.getGameById);

// POST create new game with thumbnail and video upload
router.post('/', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), gameController.createGame);

// PUT update game with thumbnail and video upload
router.put('/:id', upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), gameController.updateGame);

// DELETE game
router.delete('/:id', gameController.deleteGame);

module.exports = router;
