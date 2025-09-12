const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VideoAccess = sequelize.define('VideoAccess', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  video_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'video_lectures',
      key: 'id'
    }
  },
  access_type: {
    type: DataTypes.ENUM('free', 'premium', 'preview'),
    allowNull: false
  },
  payment_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'payments',
      key: 'id'
    }
  },
  access_granted_at: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  expires_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  progress: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {
      current_time: 0,
      total_time: 0,
      percentage: 0,
      last_watched: null
    }
  },
  watch_count: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  last_watched_at: {
    type: DataTypes.DATE,
    allowNull: true
  },
  completed: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  completed_at: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'video_access',
  indexes: [
    {
      unique: true,
      fields: ['user_id', 'video_id']
    },
    {
      fields: ['user_id']
    },
    {
      fields: ['video_id']
    },
    {
      fields: ['access_type']
    },
    {
      fields: ['is_active']
    }
  ]
});

// Instance methods
VideoAccess.prototype.updateProgress = async function(currentTime, totalTime) {
  const percentage = totalTime > 0 ? (currentTime / totalTime) * 100 : 0;
  
  this.progress = {
    current_time: currentTime,
    total_time: totalTime,
    percentage: percentage,
    last_watched: new Date()
  };
  
  this.last_watched_at = new Date();
  this.watch_count += 1;
  
  // Mark as completed if watched more than 90%
  if (percentage >= 90) {
    this.completed = true;
    this.completed_at = new Date();
  }
  
  return await this.save();
};

VideoAccess.prototype.grantAccess = async function(accessType, paymentId = null, expiresAt = null) {
  this.access_type = accessType;
  this.payment_id = paymentId;
  this.expires_at = expiresAt;
  this.access_granted_at = new Date();
  this.is_active = true;
  
  return await this.save();
};

VideoAccess.prototype.revokeAccess = async function() {
  this.is_active = false;
  return await this.save();
};

module.exports = VideoAccess;
