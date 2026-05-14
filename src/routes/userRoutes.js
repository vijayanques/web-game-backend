// User Routes
// Defines all user-related API endpoints

const express = require('express');
const userController = require('../controllers/userController');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Rate limiter for forgot password (3 requests per hour per email)
const forgotPasswordLimiter = rateLimiter({
  maxRequests: 3,
  windowMs: 60 * 60 * 1000, // 1 hour
  keyGenerator: (req) => req.body.email || req.ip, // Rate limit by email or IP
  message: 'Too many password reset requests. Please try again later.',
});

// Rate limiter for reset password (5 attempts per hour per IP)
const resetPasswordLimiter = rateLimiter({
  maxRequests: 5,
  windowMs: 60 * 60 * 1000, // 1 hour
  keyGenerator: (req) => req.ip,
  message: 'Too many password reset attempts. Please try again later.',
});

// POST forgot password (must come before /:id route)
router.post('/forgot-password', forgotPasswordLimiter, userController.forgotPassword);

// POST reset password
router.post('/reset-password', resetPasswordLimiter, userController.resetPassword);

// POST login
router.post('/login', userController.loginUser);

// POST google login
router.post('/google-login', userController.googleLogin);

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
