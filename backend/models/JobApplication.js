const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const JobApplication = sequelize.define('JobApplication', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'jobs',
      key: 'id'
    }
  },
  applicant_name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: [2, 100]
    }
  },
  applicant_email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  applicant_phone: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  cover_letter: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  resume: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },
  portfolio_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  linkedin_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  github_url: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  experience_years: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      min: 0,
      max: 50
    }
  },
  current_company: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  current_position: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  expected_salary: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  availability: {
    type: DataTypes.ENUM('immediate', '2-weeks', '1-month', '2-months', '3-months', 'flexible'),
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewing', 'shortlisted', 'interviewed', 'accepted', 'rejected'),
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  interview_date: {
    type: DataTypes.DATE,
    allowNull: true
  },
  interview_notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'job_applications',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

module.exports = JobApplication;
