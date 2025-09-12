const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Blog = sequelize.define('Blog', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: [3, 200]
    }
  },
  slug: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true
  },
  excerpt: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      len: [5, 500]
    }
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  author_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  category: {
    type: DataTypes.ENUM(
      'technology',
      'programming',
      'career',
      'internship',
      'tutorial',
      'news',
      'company-updates',
      'student-success',
      'industry-insights'
    ),
    allowNull: false
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  featured_image: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  images: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'archived'),
    defaultValue: 'draft'
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_published: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  published_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  reading_time: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  comments: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  seo: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  social_shares: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'blogs',
  hooks: {
    beforeCreate: (blog) => {
      if (!blog.slug) {
        blog.slug = blog.title
          .toLowerCase()
          .replace(/[^a-z0-9 -]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim('-');
      }
      
      if (blog.content) {
        const wordsPerMinute = 200;
        const wordCount = blog.content.split(/\s+/).length;
        blog.reading_time = Math.ceil(wordCount / wordsPerMinute);
      }
    },
    beforeUpdate: (blog) => {
      if (blog.changed('status') && blog.status === 'published' && !blog.published_at) {
        blog.published_at = new Date();
        blog.is_published = true;
      }
      
      if (blog.changed('content')) {
        const wordsPerMinute = 200;
        const wordCount = blog.content.split(/\s+/).length;
        blog.reading_time = Math.ceil(wordCount / wordsPerMinute);
      }
    }
  }
});

// Instance methods
Blog.prototype.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

Blog.prototype.addComment = async function(userId, content) {
  const comments = this.comments || [];
  comments.push({
    user_id: userId,
    content: content,
    created_at: new Date()
  });
  this.comments = comments;
  return await this.save();
};

Blog.prototype.toggleLike = async function() {
  this.likes += 1;
  return await this.save();
};

// Hooks for automatic field generation
Blog.beforeCreate(async (blog) => {
  // Generate slug from title
  if (blog.title && !blog.slug) {
    blog.slug = blog.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  // Generate excerpt from content if not provided
  if (blog.content && !blog.excerpt) {
    const plainText = blog.content.replace(/<[^>]*>/g, '');
    blog.excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
  }
  
  // Set published_at if status is published
  if (blog.status === 'published' && !blog.published_at) {
    blog.published_at = new Date();
  }
});

Blog.beforeUpdate(async (blog) => {
  // Generate slug from title if title changed
  if (blog.changed('title') && blog.title) {
    blog.slug = blog.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');
  }
  
  // Generate excerpt from content if content changed and excerpt not provided
  if (blog.changed('content') && blog.content && !blog.excerpt) {
    const plainText = blog.content.replace(/<[^>]*>/g, '');
    blog.excerpt = plainText.substring(0, 200) + (plainText.length > 200 ? '...' : '');
  }
  
  // Set published_at if status changed to published
  if (blog.changed('status') && blog.status === 'published' && !blog.published_at) {
    blog.published_at = new Date();
  }
});

// Define associations
const User = require('./User');

// Blog belongs to User (author)
Blog.belongsTo(User, {
  foreignKey: 'author_id',
  as: 'author'
});

// User has many Blogs
User.hasMany(Blog, {
  foreignKey: 'author_id',
  as: 'blogs'
});

module.exports = Blog;