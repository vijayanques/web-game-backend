const express = require('express');
require('dotenv').config();

// Ensure Railway environment variables take precedence
if (!process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL = 'https://game-web-app1.vercel.app';
}

// Temporary hardcode for Cloudinary
process.env.CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dqslodfmh';
process.env.CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY || '668431224373237';
process.env.CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET || 'Cg0zNSS0FHUyobnsA6SNt8s5C04';

console.log('🚀 Starting server...');
console.log('📍 FRONTEND_URL:', process.env.FRONTEND_URL);

const sequelize = require('./config/database');
const models = require('./models');
const routes = require('./routes');
const { corsMiddleware, requestLogger, errorHandler, notFoundHandler } = require('./middleware');
const { Server } = require('socket.io');
const socketService = require('./services/socketService');

const app = express();

// Manual CORS headers for all requests - MUST BE FIRST
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header('Access-Control-Allow-Origin', origin || '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS, HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Max-Age', '86400'); // 24 hours
  
  // Handle preflight OPTIONS requests immediately
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }
  
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);
app.use(requestLogger);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.use('/', routes);
app.use(notFoundHandler);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
  console.log(` Health check: http://localhost:${PORT}/health`);
  console.log(' Attempting to sync database...');
});

const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD'],
    credentials: true,
  }
});
socketService.init(io);

sequelize
  .sync({ alter: false })
  .then(() => {
    console.log(' Database synchronized successfully');
  })
  .catch((err) => {
    console.warn('  Database sync failed:', err.message);
    console.warn('  Add a MySQL database to Railway to enable database features');
    console.warn('  Go to Railway Dashboard → + New → Database → MySQL');
  });

process.on('SIGINT', () => {
  console.log('\n Shutting down gracefully...');
  server.close(() => {
    console.log(' Server closed');
    sequelize.close();
    process.exit(0);
  });
});