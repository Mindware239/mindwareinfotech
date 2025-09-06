const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Internship = sequelize.define('Internship', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [10, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [50, 2000]
    }
  },
  short_description: {
    type: DataTypes.STRING(300),
    allowNull: false,
    validate: {
      len: [20, 300]
    }
  },
  company: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('remote', 'onsite', 'hybrid'),
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 12
    }
  },
  duration_unit: {
    type: DataTypes.ENUM('weeks', 'months'),
    defaultValue: 'months'
  },
  stipend_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  stipend_currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'INR'
  },
  stipend_type: {
    type: DataTypes.ENUM('fixed', 'performance-based', 'unpaid'),
    defaultValue: 'fixed'
  },
  requirements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  responsibilities: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  benefits: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  application_deadline: {
    type: DataTypes.DATE,
    allowNull: false
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  max_applications: {
    type: DataTypes.INTEGER,
    defaultValue: 50,
    validate: {
      min: 1
    }
  },
  current_applications: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'paused', 'closed', 'completed'),
    defaultValue: 'draft'
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  category: {
    type: DataTypes.ENUM(
      'web-development',
      'mobile-development',
      'data-science',
      'ai-ml',
      'design',
      'marketing',
      'business',
      'other'
    ),
    allowNull: false
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  contact_info: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'internships'
});

// Instance methods
Internship.prototype.isApplicationOpen = function() {
  const now = new Date();
  return this.status === 'active' && 
         this.application_deadline > now && 
         this.current_applications < this.max_applications;
};

Internship.prototype.getRemainingDays = function() {
  const now = new Date();
  const deadline = new Date(this.application_deadline);
  const diffTime = deadline - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

Internship.prototype.canApply = function(userId) {
  return this.isApplicationOpen() && 
         this.status === 'active';
};

module.exports = Internship;