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
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'video_lectures'
});

// Instance methods
VideoLecture.prototype.incrementViews = async function() {
  this.views += 1;
  return await this.save();
};

VideoLecture.prototype.getFormattedDuration = function() {
  const hours = Math.floor(this.duration / 3600);
  const minutes = Math.floor((this.duration % 3600) / 60);
  const seconds = this.duration % 60;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

module.exports = VideoLecture;