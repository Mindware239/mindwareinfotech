const { Sequelize } = require('sequelize');

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'mindwareindiadb',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
    define: {
      timestamps: true,
      underscored: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('📊 MySQL Connected: Database connection established successfully');
    
    // Load all models
    const User = require('../models/User');
    const Course = require('../models/Course');
    const Enrollment = require('../models/Enrollment');
    const VideoLecture = require('../models/VideoLecture');
    const VideoAccess = require('../models/VideoAccess');
    const Payment = require('../models/Payment');
    
    // Set up associations
    const models = {
      User,
      Course,
      Enrollment,
      VideoLecture,
      VideoAccess,
      Payment
    };
    
    // Call associate function for each model
    Object.keys(models).forEach(modelName => {
      if (models[modelName].associate) {
        models[modelName].associate(models);
      }
    });
    
    console.log('🔗 Model associations established');
    
    // Sync database (create tables if they don't exist)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: false });
      console.log('🔄 Database synchronized');
    }
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Handle connection events (removed as not supported in newer Sequelize versions)

// Graceful shutdown
process.on('SIGINT', async () => {
  await sequelize.close();
  console.log('🔌 MySQL connection closed through app termination');
  process.exit(0);
});

module.exports = { sequelize, connectDB };