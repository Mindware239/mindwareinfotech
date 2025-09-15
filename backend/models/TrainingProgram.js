const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TrainingProgram = sequelize.define('TrainingProgram', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING(250),
    allowNull: false,
    unique: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  short_description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(100),
    allowNull: false,
    defaultValue: 'web-development'
  },
  subcategory: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'expert'),
    allowNull: false,
    defaultValue: 'beginner'
  },
  duration: {
    type: DataTypes.STRING(50),
    allowNull: false,
    defaultValue: '3 months'
  },
  duration_hours: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 120
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0
  },
  original_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  discount_percentage: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  currency: {
    type: DataTypes.STRING(3),
    allowNull: false,
    defaultValue: 'INR'
  },
  is_free: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    allowNull: false,
    defaultValue: 'draft'
  },
  image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  thumbnail: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  learning_outcomes: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  prerequisites: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  curriculum: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  instructor_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  instructor: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  max_students: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  enrolled_students: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true,
    defaultValue: 0
  },
  total_reviews: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  reviews: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  meta_title: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  meta_description: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  meta_keywords: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  og_title: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  og_description: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  og_image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  twitter_title: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  twitter_description: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  twitter_image: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  canonical_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  robots_meta: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  focus_keyword: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  seo_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
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
  }
}, {
  tableName: 'training_programs',
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
      fields: ['is_featured']
    },
    {
      fields: ['level']
    },
    {
      fields: ['instructor_id']
    },
    {
      fields: ['created_by']
    }
  ]
});

// Instance methods
TrainingProgram.prototype.getPricing = function() {
  const currentPrice = this.price;
  const originalPrice = this.original_price || this.price;
  const hasDiscount = this.discount_percentage > 0 && this.original_price > this.price;
  const discountPercentage = this.discount_percentage || 0;
  const isFree = this.is_free || this.price === 0;

  return {
    currentPrice,
    originalPrice,
    hasDiscount,
    discountPercentage,
    isFree,
    currency: this.currency
  };
};

TrainingProgram.prototype.getDuration = function() {
  return this.duration || `${this.duration_hours || 120} hours`;
};

TrainingProgram.prototype.getLevel = function() {
  const levels = {
    'beginner': 'Beginner',
    'intermediate': 'Intermediate', 
    'advanced': 'Advanced',
    'expert': 'Expert'
  };
  return levels[this.level] || 'Beginner';
};

TrainingProgram.prototype.formatPrice = function(price, currency = 'INR') {
  if (price === 0) return 'Free';
  
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  });
  
  return formatter.format(price);
};

module.exports = TrainingProgram;
