// Models Index
// Centralized export for all models and associations

const sequelize = require('../config/database');

// Load models
const User = require('./User');
const Category = require('./Category');
const Game = require('./Game');
const UserActivity = require('./UserActivity');
const SeoMetadata = require('./SeoMetadata');
const Notification = require('./Notification')(sequelize);
const FirebaseToken = require('./FirebaseToken')(sequelize);
const AdConfig = require('./AdConfig')(sequelize);

console.log(' Initializing models...');

// Define associations
Category.hasMany(Game, {
  foreignKey: 'categoryId',
  as: 'games',
  onDelete: 'CASCADE',
});

Game.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category',
});

// UserActivity associations
User.hasMany(UserActivity, {
  foreignKey: 'user_id',
  as: 'activities',
  onDelete: 'CASCADE',
});

UserActivity.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user',
});

Game.hasMany(UserActivity, {
  foreignKey: 'game_id',
  as: 'activities',
  onDelete: 'CASCADE',
});

UserActivity.belongsTo(Game, {
  foreignKey: 'game_id',
  as: 'game',
});

Category.hasMany(UserActivity, {
  foreignKey: 'category_id',
  as: 'activities',
  onDelete: 'SET NULL',
});

UserActivity.belongsTo(Category, {
  foreignKey: 'category_id',
  as: 'category',
});

// Notification associations
User.hasMany(Notification, {
  foreignKey: 'userId',
  as: 'notifications',
  onDelete: 'CASCADE',
});

Notification.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

Game.hasMany(Notification, {
  foreignKey: 'relatedGameId',
  as: 'notifications',
  onDelete: 'SET NULL',
});

Notification.belongsTo(Game, {
  foreignKey: 'relatedGameId',
  as: 'game',
});

Category.hasMany(Notification, {
  foreignKey: 'relatedCategoryId',
  as: 'notifications',
  onDelete: 'SET NULL',
});

Notification.belongsTo(Category, {
  foreignKey: 'relatedCategoryId',
  as: 'category',
});

// FirebaseToken associations
User.hasMany(FirebaseToken, {
  foreignKey: 'userId',
  as: 'firebaseTokens',
  onDelete: 'CASCADE',
});

FirebaseToken.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
});

console.log(' Models initialized successfully');

module.exports = {
  User,
  Category,
  Game,
  UserActivity,
  SeoMetadata,
  Notification,
  FirebaseToken,
  AdConfig,
  sequelize,
};
