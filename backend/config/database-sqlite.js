const { Sequelize } = require('sequelize');
const path = require('path');

// SQLite configuration for testing
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../mindwareindia.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const connectDB = async () => {
  try {
    console.log('🔄 Attempting SQLite connection...');
    await sequelize.authenticate();
    console.log('📊 SQLite Connected: Database connection established successfully');
    
    // Load all models and set up associations
    require('../models');
    console.log('🔗 Model associations established');
    
    // Sync database (create tables if they don't exist)
    await sequelize.sync({ force: false });
    console.log('🔄 Database synchronized');
    
  } catch (error) {
    console.error('❌ SQLite connection error:', error.message);
    process.exit(1);
  }
};

// Graceful shutdown
process.on('SIGINT', async () => {
  try {
    await sequelize.close();
    console.log('🔌 SQLite connection closed through app termination');
  } catch (error) {
    console.error('Error closing database connection:', error.message);
  }
  process.exit(0);
});

module.exports = { sequelize, connectDB };

