/**
 * Authentication Middleware
 * Verifies JWT token and attaches user info to request
 */

const authenticateToken = (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    // For now, we'll do a simple check
    // In production, you should verify JWT properly
    // This is a placeholder - replace with actual JWT verification
    
    // Extract user ID from token or header
    // For notifications, we can use a simple user ID from header
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({ error: 'User ID required' });
    }

    // Attach user to request
    req.user = { id: userId };
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = {
  authenticateToken,
};
