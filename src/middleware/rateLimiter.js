// Rate Limiter Middleware
// Prevents abuse by limiting requests per IP/email

const rateLimitStore = new Map();

// Clean up old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Rate limiter middleware
 * @param {Object} options - Configuration options
 * @param {number} options.maxRequests - Maximum requests allowed
 * @param {number} options.windowMs - Time window in milliseconds
 * @param {string} options.keyGenerator - Function to generate rate limit key (default: IP)
 */
const rateLimiter = (options = {}) => {
  const {
    maxRequests = 3,
    windowMs = 60 * 60 * 1000, // 1 hour default
    keyGenerator = (req) => req.ip,
    message = 'Too many requests, please try again later',
  } = options;

  return (req, res, next) => {
    const key = keyGenerator(req);
    const now = Date.now();

    if (!rateLimitStore.has(key)) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    const data = rateLimitStore.get(key);

    // Reset if window has passed
    if (now > data.resetTime) {
      rateLimitStore.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    // Increment count
    data.count += 1;

    // Check if limit exceeded
    if (data.count > maxRequests) {
      const retryAfter = Math.ceil((data.resetTime - now) / 1000);
      res.set('Retry-After', retryAfter);
      return res.status(429).json({
        success: false,
        message,
        retryAfter: `${Math.ceil(retryAfter / 60)} minutes`,
      });
    }

    next();
  };
};

module.exports = rateLimiter;
