const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const FAQ = sequelize.define('FAQ', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 500]
    }
  },
  answer: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [10, 2000]
    }
  },
  category: {
    type: DataTypes.ENUM(
      'general',
      'courses',
      'enrollment',
      'payment',
      'technical',
      'support',
      'billing',
      'refund',
      'certificate',
      'internship'
    ),
    allowNull: false,
    defaultValue: 'general'
  },
  priority: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'draft'),
    allowNull: false,
    defaultValue: 'active'
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  views: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  helpful_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  not_helpful_count: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'faqs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  indexes: [
    {
      fields: ['category']
    },
    {
      fields: ['status']
    },
    {
      fields: ['priority']
    },
    {
      fields: ['is_featured']
    }
  ]
});

// Instance methods
FAQ.prototype.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

FAQ.prototype.markHelpful = async function() {
  this.helpful_count += 1;
  return await this.save();
};

FAQ.prototype.markNotHelpful = async function() {
  this.not_helpful_count += 1;
  return await this.save();
};

// Static methods
FAQ.getByCategory = async function(category) {
  return await this.findAll({
    where: {
      category: category,
      status: 'active'
    },
    order: [['priority', 'DESC'], ['created_at', 'DESC']]
  });
};

FAQ.getFeatured = async function(limit = 5) {
  return await this.findAll({
    where: {
      is_featured: true,
      status: 'active'
    },
    order: [['priority', 'DESC'], ['created_at', 'DESC']],
    limit: limit
  });
};

FAQ.search = async function(query) {
  return await this.findAll({
    where: {
      status: 'active',
      [sequelize.Op.or]: [
        { question: { [sequelize.Op.like]: `%${query}%` } },
        { answer: { [sequelize.Op.like]: `%${query}%` } },
        { tags: { [sequelize.Op.like]: `%${query}%` } }
      ]
    },
    order: [['priority', 'DESC'], ['created_at', 'DESC']]
  });
};

// Hooks for automatic field generation
FAQ.beforeCreate(async (faq) => {
  // Generate tags from question and answer if not provided
  if (!faq.tags || faq.tags.length === 0) {
    const text = `${faq.question} ${faq.answer}`.toLowerCase();
    const commonWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'shall', 'how', 'what', 'when', 'where', 'why', 'who', 'which', 'this', 'that', 'these', 'those'];
    
    const words = text
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3 && !commonWords.includes(word))
      .slice(0, 5);
    
    faq.tags = [...new Set(words)];
  }
});

// Define associations
const User = require('./User');

// FAQ belongs to User (creator)
FAQ.belongsTo(User, {
  foreignKey: 'created_by',
  as: 'creator'
});

// FAQ belongs to User (updater)
FAQ.belongsTo(User, {
  foreignKey: 'updated_by',
  as: 'updater'
});

// User has many FAQs
User.hasMany(FAQ, {
  foreignKey: 'created_by',
  as: 'faqs'
});

module.exports = FAQ;

