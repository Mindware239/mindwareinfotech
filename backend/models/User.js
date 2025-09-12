const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: false,
    validate: {
      is: /^[6-9]\d{9}$/
    }
  },
  role: {
    type: DataTypes.ENUM('student', 'admin', 'instructor'),
    defaultValue: 'student'
  },
  avatar: {
    type: DataTypes.STRING(500),
    defaultValue: ''
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  is_email_verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  email_verification_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  password_reset_token: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  password_reset_expires: {
    type: DataTypes.DATE,
    allowNull: true
  },
  last_login: {
    type: DataTypes.DATE,
    allowNull: true
  },
  profile_data: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  preferences: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Instance methods
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

User.prototype.getPublicProfile = function() {
  const userData = this.toJSON();
  delete userData.password;
  delete userData.email_verification_token;
  delete userData.password_reset_token;
  delete userData.password_reset_expires;
  return userData;
};

// Define associations
User.associate = (models) => {
  // User has many Courses (as instructor)
  User.hasMany(models.Course, {
    foreignKey: 'instructor_id',
    as: 'courses'
  });

  // User has many Enrollments
  User.hasMany(models.Enrollment, {
    foreignKey: 'userId',
    as: 'enrollments'
  });

  // User has many VideoAccesses
  User.hasMany(models.VideoAccess, {
    foreignKey: 'user_id',
    as: 'videoAccesses'
  });
};

module.exports = User;