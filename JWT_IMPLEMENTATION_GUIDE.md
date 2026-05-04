# JWT Implementation Guide for Backend

## Step 1: Install JWT Package

```bash
cd game_web_backend
npm install jsonwebtoken
npm install --save-dev @types/jsonwebtoken
```

## Step 2: Add JWT Secret to .env

Add to `game_web_backend/.env`:

```env
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
```

## Step 3: Create JWT Utility

Create `game_web_backend/src/utils/jwt.js`:

```javascript
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Generate JWT token
exports.generateToken = (userId, email) => {
  return jwt.sign(
    { 
      id: userId, 
      email: email 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// Verify JWT token
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Decode JWT token without verification
exports.decodeToken = (token) => {
  return jwt.decode(token);
};
```

## Step 4: Create Auth Middleware

Create `game_web_backend/src/middleware/auth.js`:

```javascript
const { verifyToken } = require('../utils/jwt');
const { User } = require('../models');

exports.authenticate = async (req, res, next) => {
  try {
    // Get token from header or cookie
    const token = req.headers.authorization?.replace('Bearer ', '') || 
                  req.cookies?.auth_token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      });
    }

    // Get user from database
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Attach user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Authentication failed',
      error: error.message,
    });
  }
};
```

## Step 5: Update User Controller

Update `game_web_backend/src/controllers/userController.js`:

### Add JWT import at top:
```javascript
const { generateToken } = require('../utils/jwt');
```

### Update loginUser function:
```javascript
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

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    // Login successful
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: token, // Send JWT token
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
```

### Update createUser (signup) function:
```javascript
exports.createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    console.log('=== SIGNUP REQUEST ===');
    console.log('Received data:', { username, email, passwordLength: password?.length });

    // ... existing validation code ...

    console.log('Creating user in database...');
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      lastLoginAt: new Date(),
    });

    console.log('User created successfully with ID:', user.id);

    // Generate JWT token
    const token = generateToken(user.id, user.email);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      token: token, // Send JWT token
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        last_login_at: user.lastLoginAt,
      },
    });
  } catch (error) {
    // ... existing error handling ...
  }
};
```

## Step 6: Protect Routes (Optional)

Update `game_web_backend/src/routes/userRoutes.js`:

```javascript
const express = require('express');
const userController = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/forgot-password', userController.forgotPassword);
router.post('/reset-password', userController.resetPassword);
router.post('/login', userController.loginUser);
router.post('/', userController.createUser);

// Protected routes (require authentication)
router.get('/', authenticate, userController.getAllUsers);
router.get('/:id', authenticate, userController.getUserById);
router.put('/:id', authenticate, userController.updateUser);
router.delete('/:id', authenticate, userController.deleteUser);

module.exports = router;
```

## Step 7: Install Cookie Parser

```bash
npm install cookie-parser
```

Update `game_web_backend/src/server.js`:

```javascript
const cookieParser = require('cookie-parser');

// ... existing code ...

app.use(cookieParser());
```

## Step 8: Test JWT Implementation

### Test Login:
```bash
curl -X POST http://localhost:8000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

Expected Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": 1,
    "username": "test",
    "email": "test@example.com",
    "score": 0,
    "level": 1
  }
}
```

### Test Protected Route:
```bash
curl -X GET http://localhost:8000/api/users \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Summary

✅ JWT token generated on login/signup
✅ Token sent to frontend
✅ Frontend stores token in cookies
✅ Token used for protected routes
✅ Secure and scalable authentication

## Security Notes

1. **Change JWT_SECRET** in production
2. **Use HTTPS** in production
3. **Set httpOnly** cookies for security
4. **Implement token refresh** for better UX
5. **Add rate limiting** to prevent brute force

## Next Steps

1. Install packages: `npm install jsonwebtoken cookie-parser`
2. Create utility files
3. Update controllers
4. Test endpoints
5. Deploy to production
