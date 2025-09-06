const { sequelize } = require('../config/database');
const User = require('../models/User');
const Student = require('../models/Student');
const Internship = require('../models/Internship');
const Blog = require('../models/Blog');
const Gallery = require('../models/Gallery');
const VideoLecture = require('../models/VideoLecture');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Certificate = require('../models/Certificate');
const Testimonial = require('../models/Testimonial');
const Banner = require('../models/Banner');

const runMigration = async () => {
  try {
    console.log('🔄 Running database migration...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync all models (create/update tables)
    await sequelize.sync({ alter: true });
    console.log('✅ All tables synchronized successfully');
    
    // Check if admin user exists
    const adminUser = await User.findOne({ where: { email: 'admin@mindwareindia.com' } });
    
    if (!adminUser) {
      console.log('📝 Creating default admin user...');
      await User.create({
        name: 'Admin User',
        email: 'admin@mindwareindia.com',
        password: 'admin123',
        phone: '9876543210',
        role: 'admin',
        is_active: true,
        is_email_verified: true
      });
      console.log('✅ Default admin user created');
      console.log('📧 Email: admin@mindwareindia.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('✅ Admin user already exists');
    }
    
    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  runMigration()
    .then(() => {
      console.log('🎉 Migration completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { runMigration };
