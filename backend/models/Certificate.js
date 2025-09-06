const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Certificate = sequelize.define('Certificate', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'students',
      key: 'id'
    }
  },
  course_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'courses',
      key: 'id'
    }
  },
  certificate_id: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  student_name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  course_name: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  completion_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  grade: {
    type: DataTypes.ENUM('A+', 'A', 'B+', 'B', 'C+', 'C', 'D', 'F'),
    allowNull: false
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 100
    }
  },
  certificate_url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  verification_code: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.ENUM('generated', 'issued', 'verified', 'revoked'),
    defaultValue: 'generated'
  },
  issued_by: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  issued_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  valid_until: {
    type: DataTypes.DATE,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'certificates',
  hooks: {
    beforeCreate: async (certificate) => {
      if (!certificate.certificate_id) {
        const count = await Certificate.count();
        certificate.certificate_id = `CERT${Date.now()}${String(count + 1).padStart(4, '0')}`;
      }
      
      if (!certificate.verification_code) {
        certificate.verification_code = Math.random().toString(36).substring(2, 15) + 
                                       Math.random().toString(36).substring(2, 15);
      }
    }
  }
});

// Instance methods
Certificate.prototype.verify = async function() {
  this.status = 'verified';
  return await this.save();
};

Certificate.prototype.revoke = async function() {
  this.status = 'revoked';
  return await this.save();
};

// Static methods
Certificate.verifyByCode = async function(code) {
  return await this.findOne({
    where: {
      verification_code: code,
      status: ['issued', 'verified']
    }
  });
};

module.exports = Certificate;