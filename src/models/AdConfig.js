const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const AdConfig = sequelize.define(
    'AdConfig',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      slot: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      adClient: {
        type: DataTypes.STRING(100),
        allowNull: true, // Optional for now
      },
      adSlot: {
        type: DataTypes.STRING(100),
        allowNull: true, // Optional for now
      },
      imageUrl: {
        type: DataTypes.STRING(500),
        allowNull: true, // For static/promotional ads
      },
      targetUrl: {
        type: DataTypes.STRING(500),
        allowNull: true, // For static/promotional ads
      },
      adType: {
        type: DataTypes.ENUM('adsense', 'static', 'promotional'),
        defaultValue: 'static',
      },
      responsive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
      status: {
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
      tableName: 'AdConfigs',
      timestamps: true,
    }
  );

  return AdConfig;
};
