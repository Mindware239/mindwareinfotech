const { sequelize } = require('../config/database');
const { User, Course, Enrollment, Payment } = require('../models');

async function createEnrollmentTestData() {
  try {
    console.log('🔄 Creating enrollment test data with proper relationships...');
    
    // First, let's check what users and courses we have
    const [users] = await sequelize.query('SELECT id, name, email FROM users LIMIT 5');
    const [courses] = await sequelize.query('SELECT id, title, category FROM courses LIMIT 5');
    
    console.log('Available users:', users);
    console.log('Available courses:', courses);
    
    if (users.length === 0) {
      console.log('➕ Creating test users...');
      await sequelize.query(`
        INSERT INTO users (name, email, password, phone, role, is_active, created_at, updated_at) VALUES
        ('John Doe', 'john@example.com', '$2b$10$example', '9876543210', 'student', 1, NOW(), NOW()),
        ('Jane Smith', 'jane@example.com', '$2b$10$example', '9876543211', 'student', 1, NOW(), NOW()),
        ('Mike Johnson', 'mike@example.com', '$2b$10$example', '9876543212', 'student', 1, NOW(), NOW())
      `);
    }
    
    if (courses.length === 0) {
      console.log('➕ Creating test courses...');
      await sequelize.query(`
        INSERT INTO courses (title, description, short_description, instructor_id, category_id, category, level, duration, price, currency, status, created_at, updated_at) VALUES
        ('Full Stack Web Development', 'Complete full stack web development course', 'Learn full stack development', 1, 1, 'web-development', 'beginner', 40, 5000.00, 'INR', 'published', NOW(), NOW()),
        ('React JS Masterclass', 'Advanced React JS course', 'Master React JS', 1, 1, 'web-development', 'intermediate', 30, 3000.00, 'INR', 'published', NOW(), NOW()),
        ('Node.js Backend Development', 'Complete Node.js course', 'Learn Node.js backend', 1, 1, 'web-development', 'intermediate', 35, 4000.00, 'INR', 'published', NOW(), NOW())
      `);
    }
    
    // Get updated users and courses
    const [updatedUsers] = await sequelize.query('SELECT id, name, email FROM users WHERE role = "student" LIMIT 5');
    const [updatedCourses] = await sequelize.query('SELECT id, title, category FROM courses WHERE status = "published" LIMIT 5');
    
    console.log('Updated users:', updatedUsers);
    console.log('Updated courses:', updatedCourses);
    
    // Update existing enrollment to link with user and course
    console.log('🔗 Linking existing enrollment with user and course...');
    if (updatedUsers.length > 0 && updatedCourses.length > 0) {
      await sequelize.query(`
        UPDATE enrollments 
        SET user_id = ?, course_id = ?, course_interest = ?
        WHERE id = 1
      `, {
        replacements: [updatedUsers[0].id, updatedCourses[0].id, updatedCourses[0].category]
      });
      
      console.log(`✅ Linked enrollment 1 with user ${updatedUsers[0].name} and course ${updatedCourses[0].title}`);
    }
    
    // Create additional test enrollments
    console.log('➕ Creating additional test enrollments...');
    for (let i = 0; i < Math.min(3, updatedUsers.length, updatedCourses.length); i++) {
      const userId = updatedUsers[i].id;
      const courseId = updatedCourses[i].id;
      const courseCategory = updatedCourses[i].category;
      
      // Check if enrollment already exists for this user-course combination
      const [existing] = await sequelize.query(`
        SELECT id FROM enrollments WHERE user_id = ? AND course_id = ?
      `, {
        replacements: [userId, courseId]
      });
      
      if (existing.length === 0) {
        await sequelize.query(`
          INSERT INTO enrollments (
            first_name, last_name, email, phone, date_of_birth, gender, address, city, state, pincode, country,
            highest_qualification, institution, year_of_passing, course_id, course_interest, training_mode,
            motivation, payment_amount, payment_status, status, user_id, created_at, updated_at
          ) VALUES (
            ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW()
          )
        `, {
          replacements: [
            updatedUsers[i].name.split(' ')[0], // first_name
            updatedUsers[i].name.split(' ')[1] || '', // last_name
            updatedUsers[i].email,
            `987654321${i}`,
            '1990-01-01',
            i % 2 === 0 ? 'male' : 'female',
            'Test Address',
            'Test City',
            'Test State',
            '123456',
            'India',
            'bachelor',
            'Test University',
            2015 + i,
            courseId,
            courseCategory,
            'online',
            'To learn new technologies and advance my career',
            1000 + (i * 500),
            i % 2 === 0 ? 'completed' : 'pending',
            i % 2 === 0 ? 'approved' : 'pending',
            userId
          ]
        });
        
        console.log(`✅ Created enrollment for user ${updatedUsers[i].name} and course ${updatedCourses[i].title}`);
      }
    }
    
    // Create payments for completed enrollments
    console.log('💳 Creating payment records...');
    const [enrollments] = await sequelize.query(`
      SELECT e.id, e.user_id, e.course_id, e.payment_amount, e.payment_status, c.title as course_title, u.name as user_name
      FROM enrollments e
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN users u ON e.user_id = u.id
      WHERE e.payment_status = 'completed'
    `);
    
    for (const enrollment of enrollments) {
      // Check if payment already exists
      const [existingPayment] = await sequelize.query(`
        SELECT id FROM payments WHERE enrollment_id = ?
      `, {
        replacements: [enrollment.id]
      });
      
      if (existingPayment.length === 0) {
        await sequelize.query(`
          INSERT INTO payments (
            user_id, student_id, enrollment_id, course_id, amount, currency, status, payment_method,
            student_email, course_name, payment_date, created_at, updated_at
          ) VALUES (
            ?, ?, ?, ?, ?, 'INR', 'completed', 'online', ?, ?, NOW(), NOW(), NOW()
          )
        `, {
          replacements: [
            enrollment.user_id,
            enrollment.user_id,
            enrollment.id,
            enrollment.course_id,
            enrollment.payment_amount,
            enrollment.user_name + '@example.com',
            enrollment.course_title
          ]
        });
        
        console.log(`✅ Created payment for enrollment ${enrollment.id}`);
      }
    }
    
    // Verify the data
    console.log('🔍 Verifying enrollment data with relationships...');
    const [finalData] = await sequelize.query(`
      SELECT 
        e.id,
        e.first_name,
        e.last_name,
        e.email,
        e.status,
        e.payment_status,
        e.payment_amount,
        c.title as course_title,
        c.category as course_category,
        u.name as user_name,
        p.id as payment_id,
        p.status as payment_status
      FROM enrollments e
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN payments p ON e.id = p.enrollment_id
      ORDER BY e.created_at DESC
    `);
    
    console.log('📊 Final enrollment data with relationships:');
    console.log(JSON.stringify(finalData, null, 2));
    
    console.log('🎉 Enrollment test data created successfully!');
    
  } catch (error) {
    console.error('❌ Error creating enrollment test data:', error);
    throw error;
  }
}

// Run the script
if (require.main === module) {
  createEnrollmentTestData()
    .then(() => {
      console.log('✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Script failed:', error);
      process.exit(1);
    });
}

module.exports = createEnrollmentTestData;
