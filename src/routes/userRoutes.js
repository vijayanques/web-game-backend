// User Routes
// Defines all user-related API endpoints

const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// POST forgot password (must come before /:id route)
router.post('/forgot-password', userController.forgotPassword);

// POST reset password
router.post('/reset-password', userController.resetPassword);

// POST login
router.post('/login', userController.loginUser);

// GET all users
router.get('/', userController.getAllUsers);

// GET user by ID
router.get('/:id', userController.getUserById);

// POST create new user (signup)
router.post('/', userController.createUser);

// PUT update user
router.put('/:id', userController.updateUser);

// DELETE user
router.delete('/:id', userController.deleteUser);

module.exports = router;
