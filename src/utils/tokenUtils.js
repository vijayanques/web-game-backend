// Token Utility Functions
// Handles secure token generation and hashing

const crypto = require('crypto');

/**
 * Generate a secure random token
 * @param {number} bytes - Number of random bytes (default: 32)
 * @returns {string} - Hex string token
 */
const generateSecureToken = (bytes = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

/**
 * Hash a token using SHA-256
 * @param {string} token - Plain text token
 * @returns {string} - Hashed token
 */
const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Verify a token against its hash
 * @param {string} token - Plain text token
 * @param {string} hash - Hashed token
 * @returns {boolean} - True if token matches hash
 */
const verifyToken = (token, hash) => {
  const tokenHash = hashToken(token);
  return crypto.timingSafeEqual(
    Buffer.from(tokenHash),
    Buffer.from(hash)
  );
};

module.exports = {
  generateSecureToken,
  hashToken,
  verifyToken,
};
