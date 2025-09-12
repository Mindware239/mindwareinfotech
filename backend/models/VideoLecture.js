const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VideoLecture = sequelize.define('VideoLecture', {
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
    type: DataTypes.STRING(1000),
    allowNull: true,
    validate: {
      len: [0, 1000]
    }
  },
  video_url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  thumbnail: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration in seconds'
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  chapter: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  order: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1
    }
  },
  is_free: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_preview: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'INR'
  },
  access_level: {
    type: DataTypes.ENUM('free', 'premium', 'preview'),
    defaultValue: 'free'
  },
  preview_duration: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'Preview duration in seconds (for premium videos)'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  resources: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  transcript: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  subtitles: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likes: {
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
  tableName: 'video_lectures',
  hooks: {
    beforeCreate: (video) => {
      // Auto-generate SEO fields if not provided
      if (!video.meta_title && video.title) {
        video.meta_title = video.title.length > 60 ? video.title.substring(0, 57) + '...' : video.title;
      }
      
      if (!video.meta_description && video.description) {
        video.meta_description = video.description.length > 160 ? video.description.substring(0, 157) + '...' : video.description;
      }
      
      if (!video.og_title && video.title) {
        video.og_title = video.title.length > 100 ? video.title.substring(0, 97) + '...' : video.title;
      }
      
      if (!video.og_description && video.description) {
        video.og_description = video.description.length > 200 ? video.description.substring(0, 197) + '...' : video.description;
      }
      
      if (!video.twitter_title && video.title) {
        video.twitter_title = video.title.length > 70 ? video.title.substring(0, 67) + '...' : video.title;
      }
      
      if (!video.twitter_description && video.description) {
        video.twitter_description = video.description.length > 200 ? video.description.substring(0, 197) + '...' : video.description;
      }
    },
    beforeUpdate: (video) => {
      // Auto-update SEO fields if title or description changed
      if (video.changed('title') && !video.meta_title) {
        video.meta_title = video.title.length > 60 ? video.title.substring(0, 57) + '...' : video.title;
      }
      
      if (video.changed('description') && !video.meta_description) {
        video.meta_description = video.description.length > 160 ? video.description.substring(0, 157) + '...' : video.description;
      }
    }
  }
});

// Instance methods
VideoLecture.prototype.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

// Ensure JSON fields are properly parsed
VideoLecture.addHook('afterFind', (instances) => {
  if (Array.isArray(instances)) {
    instances.forEach(instance => {
      if (instance && instance.dataValues) {
        // Parse JSON fields if they are strings
        ['tags', 'resources', 'subtitles'].forEach(field => {
          if (typeof instance.dataValues[field] === 'string') {
            try {
              instance.dataValues[field] = JSON.parse(instance.dataValues[field]);
            } catch (e) {
              instance.dataValues[field] = [];
            }
          }
        });
      }
    });
  } else if (instances && instances.dataValues) {
    // Single instance
    ['tags', 'resources', 'subtitles'].forEach(field => {
      if (typeof instances.dataValues[field] === 'string') {
        try {
          instances.dataValues[field] = JSON.parse(instances.dataValues[field]);
        } catch (e) {
          instances.dataValues[field] = [];
        }
      }
    });
  }
});

VideoLecture.prototype.getFormattedDuration = function() {
  const hours = Math.floor(this.duration / 3600);
  const minutes = Math.floor((this.duration % 3600) / 60);
  const seconds = this.duration % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

// Define associations
VideoLecture.associate = (models) => {
  // VideoLecture belongs to Course
  VideoLecture.belongsTo(models.Course, {
    foreignKey: 'course_id',
    as: 'course'
  });

  // VideoLecture has many VideoAccesses
  VideoLecture.hasMany(models.VideoAccess, {
    foreignKey: 'video_id',
    as: 'videoAccesses'
  });
};

module.exports = VideoLecture;