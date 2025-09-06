const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Testimonial = sequelize.define('Testimonial', {
  testimonial_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  client_name: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  client_designation: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  client_company: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  course: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  testimonial_text: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  client_image: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  success_metrics: {
    type: DataTypes.JSON,
    allowNull: true,
    comment: 'JSON object containing projects, duration, outcome'
  },
  testimonial_rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 5,
    validate: {
      min: 1,
      max: 5
    }
  },
  testimonial_status: {
    type: DataTypes.ENUM('0', '1'),
    allowNull: true,
    defaultValue: '1',
    comment: '0 = inactive, 1 = active'
  },
  testimonial_order: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  }
}, {
  tableName: 'testimonials',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['testimonial_status']
    },
    {
      fields: ['testimonial_order']
    }
  ]
});

module.exports = Testimonial;
