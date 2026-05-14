const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const BugReport = sequelize.define('BugReport', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Guest',
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('Pending', 'In Progress', 'Resolved'),
      defaultValue: 'Pending',
    },
    history: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    }
  }, {
    tableName: 'bug_reports',
    timestamps: true,
  });

  return BugReport;
};
