const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  
  // Personal Details
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
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
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  dateOfBirth: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('male', 'female', 'other'),
    allowNull: false
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  state: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  pincode: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  country: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'India'
  },
  
  // Education Details
  highestQualification: {
    type: DataTypes.ENUM('10th', '12th', 'diploma', 'bachelor', 'master', 'phd', 'other'),
    allowNull: false
  },
  institution: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  yearOfPassing: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1950,
      max: 2030
    }
  },
  percentage: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  additionalQualifications: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Training Details
  courseInterest: {
    type: DataTypes.ENUM(
      'web-development',
      'mobile-development',
      'data-science',
      'cybersecurity',
      'cloud-computing',
      'artificial-intelligence',
      'machine-learning',
      'digital-marketing',
      'ui-ux-design',
      'other'
    ),
    allowNull: false
  },
  preferredBatch: {
    type: DataTypes.ENUM('morning', 'afternoon', 'evening', 'weekend', 'flexible'),
    allowNull: true
  },
  trainingMode: {
    type: DataTypes.ENUM('online', 'offline', 'hybrid'),
    allowNull: false
  },
  experience: {
    type: DataTypes.ENUM('fresher', '1-2', '3-5', '6-10', '10+'),
    allowNull: true
  },
  currentCompany: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  currentDesignation: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  expectedStartDate: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  
  // Other Information
  howDidYouHear: {
    type: DataTypes.ENUM('google', 'social-media', 'friend', 'advertisement', 'website', 'other'),
    allowNull: true
  },
  motivation: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  careerGoals: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  specialRequirements: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Document Upload (stored as JSON)
  profilePhoto: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },
  resume: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },
  certificates: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  idProof: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },
  addressProof: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: null
  },
  
  // Payment Details
  paymentMode: {
    type: DataTypes.ENUM('online', 'bank-transfer', 'cash', 'cheque', 'installment'),
    allowNull: true
  },
  paymentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0
  },
  paymentStatus: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'refunded'),
    allowNull: false,
    defaultValue: 'pending'
  },
  paymentReference: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  
  // Additional fields
  status: {
    type: DataTypes.ENUM('pending', 'under-review', 'approved', 'rejected', 'enrolled', 'completed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  
  // Timestamps
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'enrollments',
  timestamps: true,
  indexes: [
    {
      fields: ['email']
    },
    {
      fields: ['status']
    },
    {
      fields: ['courseInterest']
    },
    {
      fields: ['createdAt']
    }
  ]
});

// Instance methods
Enrollment.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

Enrollment.prototype.getDocumentCount = function() {
  const documents = [
    this.profilePhoto,
    this.resume,
    this.idProof,
    this.addressProof,
    ...(this.certificates || [])
  ].filter(Boolean);
  
  return documents.length;
};

Enrollment.prototype.isDocumentComplete = function() {
  return this.getDocumentCount() >= 3;
};

// Class methods
Enrollment.getStats = async function() {
  const total = await this.count();
  const pending = await this.count({ where: { status: 'pending' } });
  const approved = await this.count({ where: { status: 'approved' } });
  const enrolled = await this.count({ where: { status: 'enrolled' } });
  const completed = await this.count({ where: { status: 'completed' } });
  
  return {
    total,
    pending,
    approved,
    enrolled,
    completed
  };
};

Enrollment.getByCourse = async function() {
  return await this.findAll({
    attributes: [
      'courseInterest',
      [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count']
    ],
    group: ['courseInterest'],
    order: [[this.sequelize.fn('COUNT', this.sequelize.col('id')), 'DESC']]
  });
};

Enrollment.getMonthlyStats = async function(months = 12) {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  
  return await this.findAll({
    attributes: [
      [this.sequelize.fn('DATE_FORMAT', this.sequelize.col('createdAt'), '%Y-%m'), 'month'],
      [this.sequelize.fn('COUNT', this.sequelize.col('id')), 'count']
    ],
    where: {
      createdAt: {
        [this.sequelize.Op.gte]: startDate
      }
    },
    group: [this.sequelize.fn('DATE_FORMAT', this.sequelize.col('createdAt'), '%Y-%m')],
    order: [[this.sequelize.fn('DATE_FORMAT', this.sequelize.col('createdAt'), '%Y-%m'), 'ASC']]
  });
};

module.exports = Enrollment;
