// Middleware Index
// Centralized export for all middleware

const corsMiddleware = require('./cors');
const requestLogger = require('./requestLogger');
const errorHandler = require('./errorHandler');
const notFoundHandler = require('./notFoundHandler');

module.exports = {
  corsMiddleware,
  requestLogger,
  errorHandler,
  notFoundHandler,
};
