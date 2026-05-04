// Game Model
// Defines the Game table schema and associations

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

console.log('📝 Loading Game model...');
console.log('Sequelize type:', typeof sequelize);
console.log('Sequelize.define type:', typeof sequelize?.define);

if (!sequelize || typeof sequelize.define !== 'function') {
  console.error('❌ Sequelize object:', sequelize);
  throw new Error('❌ Sequelize instance is invalid in Game.js');
}

const Game = sequelize.define(
  'Game',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'categories',
        key: 'id',
      },
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    thumbnail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    gameUrl: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    genre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    releaseDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    rating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      validate: {
        min: 0,
        max: 10,
      },
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'games',
    timestamps: true,
  }
);

module.exports = Game;
