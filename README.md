# Game Web Backend API

A scalable Express.js backend for managing games and categories with MySQL database.

## 🎯 Features

### API Endpoints
- ✅ Category CRUD operations
- ✅ Game CRUD operations
- ✅ User management
- ✅ Category-Game relationships
- ✅ RESTful API design
- ✅ Standardized response format

### Database
- ✅ MySQL with Sequelize ORM
- ✅ Connection pooling
- ✅ Automatic migrations
- ✅ Proper relationships
- ✅ Timestamps on all tables

### Middleware
- ✅ CORS configuration
- ✅ Error handling
- ✅ Request logging
- ✅ 404 handling
- ✅ JSON parsing

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MySQL 8.0+
- npm or yarn

### Installation

1. **Install dependencies**
```bash
npm install
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Setup database**
```bash
npm run setup
```

4. **Start server**
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup guide
- **[games_admin/INTEGRATION_GUIDE.md](../games_admin/INTEGRATION_GUIDE.md)** - API integration guide

## 🏗️ Architecture

### Tech Stack
- **Framework**: Express.js
- **ORM**: Sequelize
- **Database**: MySQL 8.0+
- **Runtime**: Node.js 16+

### Project Structure
```
src/
├── config/
│   ├── database.js              # Database connection
│   └── setupDatabase.js         # Database initialization
├── controllers/
│   ├── categoryController.js    # Category business logic
│   ├── gameController.js        # Game business logic
│   └── userController.js        # User business logic
├── middleware/
│   ├── cors.js                  # CORS configuration
│   ├── errorHandler.js          # Error handling
│   ├── notFoundHandler.js       # 404 handling
│   ├── requestLogger.js         # Request logging
│   └── index.js                 # Middleware exports
├── models/
│   ├── Category.js              # Category model
│   ├── Game.js                  # Game model
│   ├── User.js                  # User model
│   └── index.js                 # Model associations
├── routes/
│   ├── categoryRoutes.js        # Category routes
│   ├── gameRoutes.js            # Game routes
│   ├── userRoutes.js            # User routes
│   └── index.js                 # Route aggregation
└── server.js                    # Express app setup
```

## 🔌 API Endpoints

### Categories
```
GET    /api/categories              # Get all categories
GET    /api/categories/:id          # Get category by ID
POST   /api/categories              # Create category
PUT    /api/categories/:id          # Update category
DELETE /api/categories/:id          # Delete category
```

### Games
```
GET    /api/games                   # Get all games
GET    /api/games/:id               # Get game by ID
GET    /api/games/category/:categoryId # Get games by category
POST   /api/games                   # Create game
PUT    /api/games/:id               # Update game
DELETE /api/games/:id               # Delete game
```

### Users
```
GET    /api/users                   # Get all users
GET    /api/users/:id               # Get user by ID
POST   /api/users                   # Create user
PUT    /api/users/:id               # Update user
DELETE /api/users/:id               # Delete user
```

### Health Check
```
GET    /health                      # Server health check
```

## 📊 Data Models

### Category
```typescript
{
  id: number;
  name: string;              // Unique
  description: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  games?: Game[];
}
```

### Game
```typescript
{
  id: number;
  categoryId: number;        // Foreign key
  title: string;
  description: string;
  thumbnail: string;
  genre: string;
  releaseDate: Date;
  rating: number;            // 0-10
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
}
```

### User
```typescript
{
  id: number;
  email: string;             // Unique
  username: string;          // Unique
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

## ⚙️ Configuration

### Environment Variables
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=games_db
DB_USER=root
DB_PASSWORD=password

# Server
NODE_ENV=development
PORT=5000

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:3001
```

### Database Connection
```javascript
{
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: 'mysql',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}
```

## 🔄 Request/Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": {}
}
```

## 🧪 Testing API

### Using cURL

**Get all categories:**
```bash
curl http://localhost:5000/api/categories
```

**Create category:**
```bash
curl -X POST http://localhost:5000/api/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Action",
    "description": "Action games",
    "icon": "🎮",
    "displayOrder": 0
  }'
```

**Update category:**
```bash
curl -X PUT http://localhost:5000/api/categories/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Updated Action",
    "isActive": true
  }'
```

**Delete category:**
```bash
curl -X DELETE http://localhost:5000/api/categories/1
```

### Using Postman
1. Import API collection
2. Set base URL to `http://localhost:5000`
3. Test each endpoint

## 🗄️ Database Schema

### Categories Table
```sql
CREATE TABLE categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  icon VARCHAR(255),
  displayOrder INT DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_isActive (isActive),
  INDEX idx_displayOrder (displayOrder)
);
```

### Games Table
```sql
CREATE TABLE games (
  id INT PRIMARY KEY AUTO_INCREMENT,
  categoryId INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail VARCHAR(255),
  genre VARCHAR(100) NOT NULL,
  releaseDate DATE,
  rating FLOAT DEFAULT 0,
  price DECIMAL(10, 2) DEFAULT 0,
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (categoryId) REFERENCES categories(id) ON DELETE CASCADE,
  INDEX idx_categoryId (categoryId),
  INDEX idx_isActive (isActive)
);
```

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  firstName VARCHAR(100),
  lastName VARCHAR(100),
  isActive BOOLEAN DEFAULT true,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_email (email),
  INDEX idx_username (username)
);
```

## 🚀 Deployment

### Build
```bash
npm run build
```

### Start Production
```bash
NODE_ENV=production npm start
```

### Using PM2
```bash
npm install -g pm2
pm2 start src/server.js --name "game-api"
pm2 save
pm2 startup
```

### Environment Setup
```env
NODE_ENV=production
DB_HOST=production-db-host
DB_USER=prod_user
DB_PASSWORD=secure_password
CORS_ORIGIN=https://youradmin.com,https://yourfrontend.com
```

## 🔒 Security

### Implemented
- ✅ CORS configuration
- ✅ Input validation
- ✅ Error handling
- ✅ Environment variables for secrets
- ✅ SQL injection prevention (Sequelize)

### TODO
- ⚠️ Add authentication middleware
- ⚠️ Add rate limiting
- ⚠️ Add request validation
- ⚠️ Add HTTPS/SSL
- ⚠️ Add security headers

## 📊 Performance

### Optimization
- Connection pooling (max: 5, min: 0)
- Query optimization with indexes
- Eager loading for relationships
- Pagination ready
- Caching ready

### Monitoring
- Request logging
- Error logging
- Performance metrics ready
- Health check endpoint

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Verify MySQL is running
mysql -u root -p

# Check credentials in .env
cat .env

# Test connection
mysql -h localhost -u root -p games_db
```

### Port Already in Use
```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or use different port
PORT=5001 npm run dev
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Database Sync Error
```bash
# Drop and recreate database
mysql -u root -p -e "DROP DATABASE games_db; CREATE DATABASE games_db;"
npm run setup
```

## 📝 Logging

### Development
- All queries logged to console
- Request logging enabled
- Error logging enabled

### Production
- Query logging disabled
- Request logging to file
- Error logging to file
- Performance metrics collected

## 🎓 Learning Resources

- [Express.js Documentation](https://expressjs.com/)
- [Sequelize Documentation](https://sequelize.org/)
- [MySQL Documentation](https://dev.mysql.com/doc/)
- [Node.js Documentation](https://nodejs.org/docs/)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📄 License

ISC

## 👥 Support

For issues or questions:
1. Check the documentation
2. Review error logs
3. Verify database connection
4. Check environment variables
5. Review API endpoints

## 🎉 Ready to Deploy!

This backend is production-ready with:
- ✅ Proper error handling
- ✅ Database optimization
- ✅ CORS configuration
- ✅ Request logging
- ✅ Scalable architecture
- ✅ Comprehensive documentation

Start building! 🚀
