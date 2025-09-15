const { Sequelize } = require('sequelize');

// Alternative database configuration
const sequelize = new Sequelize(
  process.env.DB_NAME || 'mindwareinfotech_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || '127.0.0.1', // Try 127.0.0.1 instead of localhost
    port: process.env.DB_PORT || 3307,
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 60000, // Increased timeout
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 60000, // 60 seconds
      acquireTimeout: 60000,
      timeout: 60000,
      reconnect: true
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
    console.log('🔄 Attempting database connection...');
    await sequelize.authenticate();
    console.log('📊 MySQL Connected: Database connection established successfully');
    
    // Load all models and set up associations
    require('../models');
    console.log('🔗 Model associations established');
    
    // Sync database (create tables if they don't exist)
    if (process.env.NODE_ENV === 'development') {
      await sequelize.sync({ force: false });
      console.log('🔄 Database synchronized');
    }
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    console.error('Full error:', error);
    
    // Try to provide helpful error messages
    if (error.message.includes('ETIMEDOUT')) {
      console.error('💡 Suggestion: Check if MariaDB is running and firewall settings');
    } else if (error.message.includes('ECONNREFUSED')) {
      console.error('💡 Suggestion: MariaDB might not be running');
    } else if (error.message.includes('ER_ACCESS_DENIED_ERROR')) {
      console.error('💡 Suggestion: Check username/password');
    }
    
    // Don't exit the process, just log the error
    console.log('⚠️  Continuing without database connection...');
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await sequelize.close();
    console.log('🔌 MySQL connection closed through app termination');
  } catch (error) {
    console.error('Error closing database connection:', error.message);
  }
  process.exit(0);
});

module.exports = { sequelize, connectDB };

