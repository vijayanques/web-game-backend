// User Model
// Defines the User table schema and associations

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

console.log(' Loading User model...');
console.log('Sequelize type:', typeof sequelize);
console.log('Sequelize.define type:', typeof sequelize?.define);

if (!sequelize) {
  throw new Error(' Sequelize instance is undefined in User.js');
}

if (typeof sequelize.define !== 'function') {
  console.error(' Sequelize object:', sequelize);
  throw new Error(' sequelize.define is not a function. Sequelize object is invalid.');
}

const User = sequelize.define(
  'User',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        len: [3, 100],
      },
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    resetToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    resetTokenExpiry: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login_at',
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
    tableName: 'users',
    timestamps: true,
  }
);

module.exports = User;
