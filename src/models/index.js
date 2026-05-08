// Models Index
// Centralized export for all models and associations

const sequelize = require('../config/database');

// Load models
const User = require('./User');
const Category = require('./Category');
const Game = require('./Game');
const UserActivity = require('./UserActivity');

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

console.log(' Models initialized successfully');

module.exports = {
  User,
  Category,
  Game,
  UserActivity,
  sequelize,
};
