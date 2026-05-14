// User Controller
// Handles all user-related business logic

const bcrypt = require('bcrypt');
const sequelize = require('../config/database');
const { User } = require('../models');
const { generateSecureToken, hashToken } = require('../utils/tokenUtils');
const { sendPasswordResetEmail } = require('../services/emailService');

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }, // Don't send passwords
    });
    
    // Map to ensure last_login_at is included in response
    const usersData = users.map(user => ({
      id: user.id,
      username: user.username,
      email: user.email,
      score: user.score,
      level: user.level,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
      last_login_at: user.lastLoginAt,
    }));
    
    res.status(200).json({
      success: true,
      data: usersData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message,
    });
  }
};

// Get user by ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message,
    });
  }
};

// Create a new user
exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log('=== SIGNUP REQUEST ===');
    console.log('Received data:', { username, email, passwordLength: password?.length });

    // Validate input
    if (!username || !email || !password) {
      console.log('Validation failed - missing fields');
      return res.status(400).json({
        success: false,
        message: 'Username, email, and password are required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({
        success: false,
        message: 'Invalid email format',
      });
    }

    // Validate username length
    if (username.length < 3 || username.length > 100) {
      console.log('Username length invalid:', username.length);
      return res.status(400).json({
        success: false,
        message: 'Username must be between 3 and 100 characters',
      });
    }

    console.log('Checking for existing user with email:', email);
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('Email already registered:', email);
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    console.log('Checking for existing username:', username);
    // Check if username already exists
    const existingUsername = await User.findOne({ where: { username } });
    if (existingUsername) {
      console.log('Username already taken:', username);
      return res.status(400).json({
        success: false,
        message: 'Username already taken',
      });
    }

    // Hash password with bcrypt (10 salt rounds)
    console.log('Starting password hash...');
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully');

    console.log('Creating user in database...');
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      lastLoginAt: new Date(), // Set login time on registration
    }, {
      fields: ['username', 'email', 'password', 'lastLoginAt'] // Only insert these fields
    });

    console.log('User created successfully with ID:', user.id);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        last_login_at: user.lastLoginAt,
      },
    });
  } catch (error) {
    console.error('=== ERROR CREATING USER ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error details:', error);
    
    // Handle specific Sequelize errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Email or username already exists',
      });
    }

    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error: ' + error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message,
    });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, score, level } = req.body;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Update only provided fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (score !== undefined) user.score = score;
    if (level !== undefined) user.level = level;

    await user.save();

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message,
    });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message,
    });
  }
};

// Forgot password - Production-ready with security best practices
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      // Return generic message to prevent user enumeration
      return res.status(200).json({
        success: true,
        message: 'If an account exists with this email, a password reset link has been sent',
      });
    }

    // Find user by email
    const user = await User.findOne({ where: { email } });

    // Always return same message to prevent user enumeration
    const genericMessage = 'If an account exists with this email, a password reset link has been sent';

    if (!user) {
      console.log(`Password reset requested for non-existent email: ${email}`);
      return res.status(200).json({
        success: true,
        message: genericMessage,
      });
    }

    // Generate secure random token (32 bytes = 64 hex characters)
    const plainToken = generateSecureToken(32);
    const tokenHash = hashToken(plainToken);

    // Token expires in 30 minutes
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    // Update user with reset token and expiry
    await user.update({
      reset_token_hash: tokenHash,
      reset_token_expiry: expiresAt,
    });

    // Create reset link with plain token (not the hash!)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    console.log('🔍 DEBUG - FRONTEND_URL:', process.env.FRONTEND_URL);
    console.log('🔍 DEBUG - Using URL:', frontendUrl);
    const resetLink = `${frontendUrl}/reset-password?token=${plainToken}`;

    // Send email
    try {
      await sendPasswordResetEmail(email, resetLink, user.username);
      console.log(`✅ Password reset email sent to: ${email}`);
    } catch (emailError) {
      console.error('❌ Email sending failed:', emailError);
      // Still return success to user for security (don't reveal email service issues)
    }

    res.status(200).json({
      success: true,
      message: genericMessage,
    });
  } catch (error) {
    console.error('❌ Error in forgotPassword:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request',
    });
  }
};

// Reset password - Production-ready with security best practices
exports.resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    console.log('🔄 Reset password request received');
    console.log('Token length:', token ? token.length : 0);
    console.log('Token:', token ? token.substring(0, 20) + '...' : 'NO TOKEN');

    // Validate input
    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      });
    }

    // Validate password strength
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long',
      });
    }

    // Hash the incoming token to look it up in database
    const tokenHash = hashToken(token);
    console.log('🔍 Token hash:', tokenHash);

    // First, let's check ALL users with reset tokens
    const allUsersWithTokens = await User.findAll({
      where: {
        reset_token_hash: {
          [sequelize.Op.ne]: null
        }
      },
      attributes: ['id', 'email', 'reset_token_hash', 'reset_token_expiry']
    });
    
    console.log('📋 Users with reset tokens:', allUsersWithTokens.length);
    allUsersWithTokens.forEach(u => {
      console.log(`  - ${u.email}: hash=${u.reset_token_hash ? u.reset_token_hash.substring(0, 10) + '...' : 'null'}, expiry=${u.reset_token_expiry}`);
    });

    // Find user with matching token hash
    const user = await User.findOne({
      where: {
        reset_token_hash: tokenHash
      }
    });

    console.log('🔍 User found:', !!user);
    if (user) {
      console.log('   Email:', user.email);
      console.log('   Stored hash:', user.reset_token_hash.substring(0, 10) + '...');
      console.log('   Incoming hash:', tokenHash.substring(0, 10) + '...');
      console.log('   Match:', user.reset_token_hash === tokenHash);
    }

    // Check if user exists with this token
    if (!user) {
      console.log('❌ Invalid token or user not found');
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset link. Please request a new password reset.',
      });
    }

    // Check if token is expired
    const now = new Date();
    const expiryTime = new Date(user.reset_token_expiry);
    console.log('🕐 Token expiry check - Now:', now.toISOString(), 'Expiry:', expiryTime.toISOString());

    if (!user.reset_token_expiry || now > expiryTime) {
      console.log('❌ Token expired');
      // Clear the token
      await user.update({
        reset_token_hash: null,
        reset_token_expiry: null,
      });
      
      return res.status(400).json({
        success: false,
        message: 'Reset link has expired. Please request a new password reset.',
      });
    }

    // Hash new password with bcrypt (10 salt rounds)
    console.log('🔐 Hashing new password...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear reset token
    await user.update({
      password: hashedPassword,
      reset_token_hash: null,
      reset_token_expiry: null,
    });

    console.log(`✅ Password reset successful for user: ${user.email}`);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. You can now login with your new password.',
    });
  } catch (error) {
    console.error('❌ Error in resetPassword:', error.message);
    console.error('❌ Full error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while resetting your password',
      error: error.message,
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('=== LOGIN REQUEST ===');
    console.log('Received email:', email);

    // Validate input
    if (!email || !password) {
      console.log('Validation failed - missing email or password');
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    console.log('Finding user by email:', email);
    // Find user by email
    const user = await User.findOne({ where: { email } });

    if (!user) {
      console.log('User not found:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    console.log('User found, comparing passwords...');

    // Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      console.log('Password mismatch for user:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    console.log('Login successful for user:', email);

    // Update last_login_at timestamp
    user.lastLoginAt = new Date();
    await user.save();

    // Login successful
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        score: user.score,
        level: user.level,
        last_login_at: user.lastLoginAt,
      },
    });
  } catch (error) {
    console.error('=== ERROR DURING LOGIN ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error details:', error);
    
    res.status(500).json({
      success: false,
      message: 'Error during login',
      error: error.message,
    });
  }
};

// Google Login/Signup
exports.googleLogin = async (req, res) => {
  try {
    const { email, username, googleId } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required for Google login',
      });
    }

    // Find user by email
    let user = await User.findOne({ where: { email } });

    if (!user) {
      // Create new user if they don't exist
      // Generate a random username if not provided or taken
      let finalUsername = username || email.split('@')[0];
      const existingUsername = await User.findOne({ where: { username: finalUsername } });
      if (existingUsername) {
        finalUsername = `${finalUsername}_${Math.floor(Math.random() * 1000)}`;
      }

      // Generate a random password since they are using Google
      const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);

      user = await User.create({
        username: finalUsername,
        email,
        password: randomPassword,
        lastLoginAt: new Date(),
      });
    } else {
      // Update last login
      user.lastLoginAt = new Date();
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: 'Google login successful',
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        score: user.score,
        level: user.level,
        last_login_at: user.lastLoginAt,
      },
    });
  } catch (error) {
    console.error('Error during Google login:', error);
    res.status(500).json({
      success: false,
      message: 'Error during Google login',
      error: error.message,
    });
  }
};
