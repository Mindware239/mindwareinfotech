const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [5, 200]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: [50, 5000]
    }
  },
  short_description: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      len: [20, 500]
    }
  },
  department: {
    type: DataTypes.ENUM(
      'engineering',
      'design',
      'marketing',
      'sales',
      'hr',
      'finance',
      'operations',
      'support',
      'management',
      'other'
    ),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('full-time', 'part-time', 'contract', 'internship', 'freelance'),
    allowNull: false
  },
  experience_level: {
    type: DataTypes.ENUM('entry', 'junior', 'mid', 'senior', 'lead', 'executive'),
    allowNull: false
  },
  salary_min: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  salary_max: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'INR'
  },
  requirements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
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
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  application_deadline: {
    type: DataTypes.DATE,
    allowNull: true
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'paused', 'closed', 'filled'),
    defaultValue: 'draft'
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_remote: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_urgent: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  applications_count: {
    type: DataTypes.INTEGER,
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
  // SEO Fields
  meta_title: {
    type: DataTypes.STRING(60),
    allowNull: true,
    validate: {
      len: [0, 60]
    }
  },
  meta_description: {
    type: DataTypes.STRING(160),
    allowNull: true,
    validate: {
      len: [0, 160]
    }
  },
  meta_keywords: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  },
  // Open Graph Fields
  og_title: {
    type: DataTypes.STRING(100),
    allowNull: true,
    validate: {
      len: [0, 100]
    }
  },
  og_description: {
    type: DataTypes.STRING(200),
    allowNull: true,
    validate: {
      len: [0, 200]
    }
  },
  og_image: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  // Twitter Card Fields
  twitter_title: {
    type: DataTypes.STRING(70),
    allowNull: true,
    validate: {
      len: [0, 70]
    }
  },
  twitter_description: {
    type: DataTypes.STRING(200),
    allowNull: true,
    validate: {
      len: [0, 200]
    }
  },
  twitter_image: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  // Additional SEO Fields
  canonical_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  robots_meta: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'index, follow'
  },
  focus_keyword: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  seo_score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 100
    }
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'jobs',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  hooks: {
    beforeCreate: (job) => {
      // Auto-generate SEO fields if not provided
      if (!job.meta_title && job.title) {
        job.meta_title = job.title.length > 60 ? job.title.substring(0, 57) + '...' : job.title;
      }
      
      if (!job.meta_description && job.short_description) {
        job.meta_description = job.short_description.length > 160 ? job.short_description.substring(0, 157) + '...' : job.short_description;
      }
      
      if (!job.og_title && job.title) {
        job.og_title = job.title.length > 100 ? job.title.substring(0, 97) + '...' : job.title;
      }
      
      if (!job.og_description && job.short_description) {
        job.og_description = job.short_description.length > 200 ? job.short_description.substring(0, 197) + '...' : job.short_description;
      }
      
      if (!job.twitter_title && job.title) {
        job.twitter_title = job.title.length > 70 ? job.title.substring(0, 67) + '...' : job.title;
      }
      
      if (!job.twitter_description && job.short_description) {
        job.twitter_description = job.short_description.length > 200 ? job.short_description.substring(0, 197) + '...' : job.short_description;
      }
    },
    beforeUpdate: (job) => {
      // Auto-update SEO fields if title or description changed
      if (job.changed('title') && !job.meta_title) {
        job.meta_title = job.title.length > 60 ? job.title.substring(0, 57) + '...' : job.title;
      }
      
      if (job.changed('short_description') && !job.meta_description) {
        job.meta_description = job.short_description.length > 160 ? job.short_description.substring(0, 157) + '...' : job.short_description;
      }
    }
  }
});

// Instance methods
Job.prototype.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

Job.prototype.incrementApplications = async function() {
  this.applications_count += 1;
  return await this.save();
};

module.exports = Job;
