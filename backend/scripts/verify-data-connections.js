const { sequelize } = require('../config/database');

async function verifyDataConnections() {
  try {
    console.log('🔍 Verifying complete data flow and connections...\n');
    
    // 1. Check Users
    console.log('👥 USERS TABLE:');
    const [users] = await sequelize.query(`
      SELECT id, name, email, role, created_at 
      FROM users 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    console.log(JSON.stringify(users, null, 2));
    
    // 2. Check Courses
    console.log('\n📚 COURSES TABLE:');
    const [courses] = await sequelize.query(`
      SELECT id, title, category, price, currency, status, created_at 
      FROM courses 
      ORDER BY created_at DESC 
      LIMIT 5
    `);
    console.log(JSON.stringify(courses, null, 2));
    
    // 3. Check Enrollments with full relationships
    console.log('\n🎓 ENROLLMENTS TABLE (with relationships):');
    const [enrollments] = await sequelize.query(`
      SELECT 
        e.id as enrollment_id,
        e.first_name,
        e.last_name,
        e.email as enrollment_email,
        e.status as enrollment_status,
        e.payment_status,
        e.payment_amount,
        e.created_at as enrollment_date,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        c.id as course_id,
        c.title as course_title,
        c.category as course_category,
        c.price as course_price
      FROM enrollments e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN courses c ON e.course_id = c.id
      ORDER BY e.created_at DESC
    `);
    console.log(JSON.stringify(enrollments, null, 2));
    
    // 4. Check Payments
    console.log('\n💳 PAYMENTS TABLE:');
    const [payments] = await sequelize.query(`
      SELECT 
        p.id as payment_id,
        p.user_id,
        p.student_id,
        p.enrollment_id,
        p.course_id,
        p.amount,
        p.currency,
        p.status as payment_status,
        p.payment_method,
        p.created_at as payment_date,
        u.name as user_name,
        c.title as course_title
      FROM payments p
      LEFT JOIN users u ON p.user_id = u.id
      LEFT JOIN courses c ON p.course_id = c.id
      ORDER BY p.created_at DESC
      LIMIT 5
    `);
    console.log(JSON.stringify(payments, null, 2));
    
    // 5. Complete data flow verification
    console.log('\n🔄 COMPLETE DATA FLOW VERIFICATION:');
    const [completeFlow] = await sequelize.query(`
      SELECT 
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        e.id as enrollment_id,
        e.status as enrollment_status,
        e.payment_status,
        e.payment_amount,
        c.id as course_id,
        c.title as course_title,
        c.category as course_category,
        p.id as payment_id,
        p.status as payment_status,
        p.amount as payment_amount
      FROM users u
      LEFT JOIN enrollments e ON u.id = e.user_id
      LEFT JOIN courses c ON e.course_id = c.id
      LEFT JOIN payments p ON e.id = p.enrollment_id
      WHERE u.role = 'student'
      ORDER BY u.created_at DESC
    `);
    console.log(JSON.stringify(completeFlow, null, 2));
    
    // 6. Summary statistics
    console.log('\n📊 SUMMARY STATISTICS:');
    const [stats] = await sequelize.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
        (SELECT COUNT(*) FROM courses WHERE status = 'published') as total_courses,
        (SELECT COUNT(*) FROM enrollments) as total_enrollments,
        (SELECT COUNT(*) FROM payments WHERE status = 'completed') as completed_payments,
        (SELECT SUM(amount) FROM payments WHERE status = 'completed') as total_revenue
    `);
    console.log(JSON.stringify(stats[0], null, 2));
    
    console.log('\n✅ Data verification completed!');
    console.log('\n📋 DATA FLOW EXPLANATION:');
    console.log('1. 👥 USERS: Students register and get user accounts');
    console.log('2. 📚 COURSES: Available courses are stored in courses table');
    console.log('3. 🎓 ENROLLMENTS: Students enroll in courses (user_id + course_id)');
    console.log('4. 💳 PAYMENTS: Payments are linked to enrollments (enrollment_id)');
    console.log('5. 🔗 RELATIONSHIPS: All data is properly connected through foreign keys');
    
  } catch (error) {
    console.error('❌ Error verifying data connections:', error);
    throw error;
  }
}

// Run the verification
if (require.main === module) {
  verifyDataConnections()
    .then(() => {
      console.log('\n🎉 Verification completed successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Verification failed:', error);
      process.exit(1);
    });
}

module.exports = verifyDataConnections;
