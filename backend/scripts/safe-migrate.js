const { sequelize } = require('../config/database');
const User = require('../models/User');
const Student = require('../models/Student');

const safeMigrate = async () => {
  try {
    console.log('🔄 Starting safe migration...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync without force (preserve existing data)
    await sequelize.sync({ alter: true });
    console.log('✅ Database schema updated successfully');
    
    // Check if admin user exists
    const adminUser = await User.findOne({ where: { email: 'admin@mindwareindia.com' } });
    
    if (!adminUser) {
      // Create default admin user
      const newAdminUser = await User.create({
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
    
    // Check if sample students exist
    const sampleStudents = await User.findAll({ 
      where: { 
        email: ['john@example.com', 'jane@example.com'] 
      } 
    });
    
    if (sampleStudents.length === 0) {
      // Create sample students
      const students = await User.bulkCreate([
        {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          phone: '9876543211',
          role: 'student',
          is_active: true,
          is_email_verified: true
        },
        {
          name: 'Jane Smith',
          email: 'jane@example.com',
          password: 'password123',
          phone: '9876543212',
          role: 'student',
          is_active: true,
          is_email_verified: true
        }
      ]);
      
      // Create student records
      for (const student of students) {
        await Student.create({
          user_id: student.id,
          student_id: `STU${student.id.toString().padStart(6, '0')}`,
          profile_data: {
            college: 'Sample College',
            year: '3rd Year',
            branch: 'Computer Science'
          }
        });
      }
      
      console.log('✅ Sample students created');
    } else {
      console.log('✅ Sample students already exist');
    }
    
    console.log('🎉 Safe migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

// Run migration if this file is executed directly
if (require.main === module) {
  safeMigrate()
    .then(() => {
      console.log('🎉 Migration completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Migration failed:', error);
      process.exit(1);
    });
}

module.exports = { safeMigrate };
