// Category Model
// Defines the Category table schema with associations to games

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

console.log('📝 Loading Category model...');
console.log('Sequelize type:', typeof sequelize);
console.log('Sequelize.define type:', typeof sequelize?.define);

if (!sequelize || typeof sequelize.define !== 'function') {
  console.error('❌ Sequelize object:', sequelize);
  throw new Error('❌ Sequelize instance is invalid in Category.js');
}

const Category = sequelize.define(
  'Category',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        len: [2, 100],
      },
    },
    slug: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    icon: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: 'Tag',
    },
    image: {
      type: DataTypes.STRING(255),
      allowNull: true,
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
    tableName: 'categories',
    timestamps: true,
    hooks: {
      beforeCreate: (category) => {
        category.slug = category.name
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-');
      },
      beforeUpdate: (category) => {
        if (category.changed('name')) {
          category.slug = category.name
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-');
        }
      },
    },
  }
);

module.exports = Category;
