const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const SiteTraffic = sequelize.define(
    'SiteTraffic',
    {
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
      page: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      device: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      browser: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      action: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'page_view',
      },
      sessionTime: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: '0s',
      },
      ipAddress: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      timestamp: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'site_traffic',
      timestamps: true,
    }
  );

  return SiteTraffic;
};
