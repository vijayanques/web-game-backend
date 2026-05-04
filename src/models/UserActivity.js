// UserActivity Model
// Tracks user game activity and play history

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

console.log('📝 Loading UserActivity model...');
console.log('Sequelize type:', typeof sequelize);
console.log('Sequelize.define type:', typeof sequelize?.define);

if (!sequelize || typeof sequelize.define !== 'function') {
  console.error('❌ Sequelize object:', sequelize);
  throw new Error('❌ Sequelize instance is invalid in UserActivity.js');
}

const UserActivity = sequelize.define(
  'UserActivity',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    game_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'games',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'categories',
        key: 'id',
      },
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
    },
    played_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'user_activity',
    timestamps: false,
  }
);

module.exports = UserActivity;
