const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Course = sequelize.define('Course', {
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
  instructor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  category: {
    type: DataTypes.ENUM(
      'web-development',
      'mobile-development',
      'data-science',
      'ai-ml',
      'design',
      'programming',
      'database',
      'devops',
      'cybersecurity',
      'other'
    ),
    allowNull: false
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced', 'expert'),
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false,
    comment: 'Duration in hours'
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    }
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'INR'
  },
  is_free: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  thumbnail: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  banner: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  videos: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  chapters: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  requirements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  learning_outcomes: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  skills: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  language: {
    type: DataTypes.STRING(50),
    defaultValue: 'English'
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  rating: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      average: 0,
      count: 0
    }
  },
  students: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      enrolled: 0,
      completed: 0
    }
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  certificate: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
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
  seo: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'courses',
  hooks: {
    beforeCreate: (course) => {
      if (course.videos) {
        course.metadata = {
          total_videos: course.videos.length,
          ...course.metadata
        };
      }

      // Auto-generate SEO fields if not provided
      if (!course.meta_title && course.title) {
        course.meta_title = course.title.length > 60 ? course.title.substring(0, 57) + '...' : course.title;
      }
      
      if (!course.meta_description && course.short_description) {
        course.meta_description = course.short_description.length > 160 ? course.short_description.substring(0, 157) + '...' : course.short_description;
      }
      
      if (!course.og_title && course.title) {
        course.og_title = course.title.length > 100 ? course.title.substring(0, 97) + '...' : course.title;
      }
      
      if (!course.og_description && course.short_description) {
        course.og_description = course.short_description.length > 200 ? course.short_description.substring(0, 197) + '...' : course.short_description;
      }
      
      if (!course.twitter_title && course.title) {
        course.twitter_title = course.title.length > 70 ? course.title.substring(0, 67) + '...' : course.title;
      }
      
      if (!course.twitter_description && course.short_description) {
        course.twitter_description = course.short_description.length > 200 ? course.short_description.substring(0, 197) + '...' : course.short_description;
      }
    },
    beforeUpdate: (course) => {
      // Auto-update SEO fields if title or description changed
      if (course.changed('title') && !course.meta_title) {
        course.meta_title = course.title.length > 60 ? course.title.substring(0, 57) + '...' : course.title;
      }
      
      if (course.changed('short_description') && !course.meta_description) {
        course.meta_description = course.short_description.length > 160 ? course.short_description.substring(0, 157) + '...' : course.short_description;
      }
    }
  }
});

// Instance methods
Course.prototype.calculateRating = async function() {
  // This would be called when a new review is added
  // Implementation depends on your review system
};

Course.prototype.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

Course.prototype.addStudent = async function() {
  const students = this.students || { enrolled: 0, completed: 0 };
  students.enrolled += 1;
  this.students = students;
  return await this.save();
};

Course.prototype.completeStudent = async function() {
  const students = this.students || { enrolled: 0, completed: 0 };
  students.completed += 1;
  this.students = students;
  return await this.save();
};

// Define associations
Course.associate = (models) => {
  // Course belongs to User (instructor)
  Course.belongsTo(models.User, {
    foreignKey: 'instructor_id',
    as: 'instructor'
  });

  // Course has many Enrollments
  Course.hasMany(models.Enrollment, {
    foreignKey: 'courseId',
    as: 'enrollments'
  });

  // Course has many VideoLectures
  Course.hasMany(models.VideoLecture, {
    foreignKey: 'course_id',
    as: 'videoLectures'
  });
};

module.exports = Course;