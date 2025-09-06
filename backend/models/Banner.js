const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Banner = sequelize.define('Banner', {
  banner_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  subtitle: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  image_url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  button_text: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  button_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  banner_type: {
    type: DataTypes.ENUM('hero', 'about', 'service', 'testimonial', 'contact'),
    allowNull: false,
    defaultValue: 'hero'
  },
  banner_position: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'banners',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['banner_type']
    },
    {
      fields: ['is_active']
    },
    {
      fields: ['banner_position']
    }
  ]
});

module.exports = Banner;
