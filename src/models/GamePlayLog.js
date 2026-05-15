const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GamePlayLog = sequelize.define('GamePlayLog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  gameId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ipAddress: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  playDate: {
    type: DataTypes.DATEONLY, // Stores only YYYY-MM-DD
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
}, {
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['gameId', 'ipAddress', 'playDate'],
      name: 'unique_ip_play_per_day'
    },
    {
      unique: true,
      fields: ['gameId', 'userId', 'playDate'],
      name: 'unique_user_play_per_day'
    }
  ]
});

module.exports = GamePlayLog;
