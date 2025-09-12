const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Gallery = sequelize.define('Gallery', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [5, 100]
    }
  },
  description: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      len: [0, 500]
    }
  },
  images: {
    type: DataTypes.JSON,
    allowNull: false,
    defaultValue: []
  },
  category: {
    type: DataTypes.ENUM(
      'events',
      'training',
      'workshops',
      'team-building',
      'awards',
      'office',
      'students',
      'projects',
      'conferences',
      'other'
    ),
    allowNull: false
  },
  subcategory: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  event_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('draft', 'active', 'archived'),
    defaultValue: 'active'
  },
  is_featured: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  is_public: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
  tableName: 'gallery',
  hooks: {
    beforeCreate: (gallery) => {
      if (gallery.images) {
        gallery.metadata = {
          total_images: gallery.images.length,
          ...gallery.metadata
        };
        
        // Set primary image if none is set
        if (gallery.images.length > 0 && !gallery.images.some(img => img.isPrimary)) {
          gallery.images[0].isPrimary = true;
        }
      }

      // Auto-generate SEO fields if not provided
      if (!gallery.meta_title && gallery.title) {
        gallery.meta_title = gallery.title.length > 60 ? gallery.title.substring(0, 57) + '...' : gallery.title;
      }
      
      if (!gallery.meta_description && gallery.description) {
        gallery.meta_description = gallery.description.length > 160 ? gallery.description.substring(0, 157) + '...' : gallery.description;
      }
      
      if (!gallery.og_title && gallery.title) {
        gallery.og_title = gallery.title.length > 100 ? gallery.title.substring(0, 97) + '...' : gallery.title;
      }
      
      if (!gallery.og_description && gallery.description) {
        gallery.og_description = gallery.description.length > 200 ? gallery.description.substring(0, 197) + '...' : gallery.description;
      }
      
      if (!gallery.twitter_title && gallery.title) {
        gallery.twitter_title = gallery.title.length > 70 ? gallery.title.substring(0, 67) + '...' : gallery.title;
      }
      
      if (!gallery.twitter_description && gallery.description) {
        gallery.twitter_description = gallery.description.length > 200 ? gallery.description.substring(0, 197) + '...' : gallery.description;
      }
    },
    beforeUpdate: (gallery) => {
      if (gallery.changed('images')) {
        gallery.metadata = {
          ...gallery.metadata,
          total_images: gallery.images.length
        };
      }

      // Auto-update SEO fields if title or description changed
      if (gallery.changed('title') && !gallery.meta_title) {
        gallery.meta_title = gallery.title.length > 60 ? gallery.title.substring(0, 57) + '...' : gallery.title;
      }
      
      if (gallery.changed('description') && !gallery.meta_description) {
        gallery.meta_description = gallery.description.length > 160 ? gallery.description.substring(0, 157) + '...' : gallery.description;
      }
    }
  }
});

// Instance methods
Gallery.prototype.addImage = async function(imageData) {
  const images = this.images || [];
  images.push(imageData);
  this.images = images;
  return await this.save();
};

Gallery.prototype.removeImage = async function(imageUrl) {
  const images = (this.images || []).filter(img => img.url !== imageUrl);
  this.images = images;
  return await this.save();
};

Gallery.prototype.setPrimaryImage = async function(imageUrl) {
  const images = (this.images || []).map(img => ({
    ...img,
    isPrimary: img.url === imageUrl
  }));
  this.images = images;
  return await this.save();
};

Gallery.prototype.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

Gallery.prototype.toggleLike = async function() {
  this.likes += 1;
  return await this.save();
};

// Static methods
Gallery.getFeatured = async function(limit = 10) {
  return await this.findAll({
    where: {
      is_featured: true,
      status: 'active',
      is_public: true
    },
    order: [['created_at', 'DESC']],
    limit
  });
};

Gallery.getByCategory = async function(category, limit = 20) {
  return await this.findAll({
    where: {
      category,
      status: 'active',
      is_public: true
    },
    order: [['event_date', 'DESC'], ['created_at', 'DESC']],
    limit
  });
};

module.exports = Gallery;