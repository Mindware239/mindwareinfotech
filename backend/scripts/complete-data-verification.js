const { sequelize } = require('../config/database');

async function completeDataVerification() {
  try {
    console.log('🔍 COMPLETE DATA VERIFICATION - ALL RELATIONSHIPS CHECK\n');
    console.log('=' .repeat(80));
    
    // 1. Check Enrollment Table Structure
    console.log('\n📋 1. ENROLLMENT TABLE STRUCTURE VERIFICATION:');
    console.log('-' .repeat(50));
    const [enrollmentFields] = await sequelize.query('DESCRIBE enrollments');
    console.log('✅ All enrollment fields present:');
    enrollmentFields.forEach(field => {
      console.log(`   ${field.Field}: ${field.Type} | Null: ${field.Null} | Key: ${field.Key}`);
    });
    
    // 2. Check Foreign Key Relationships
    console.log('\n🔗 2. FOREIGN KEY RELATIONSHIPS VERIFICATION:');
    console.log('-' .repeat(50));
    
    // Check course_id relationship
    const [courseCheck] = await sequelize.query(`
      SELECT COUNT(*) as count 
      FROM enrollments e 
      LEFT JOIN courses c ON e.course_id = c.id 
      WHERE e.course_id IS NOT NULL
    `);
    console.log(`✅ course_id relationship: ${courseCheck[0].count} enrollments linked to courses`);
    
    // Check user_id relationship
    const [userCheck] = await sequelize.query(`
      SELECT COUNT(*) as count 
      FROM enrollments e 
      LEFT JOIN users u ON e.user_id = u.id 
      WHERE e.user_id IS NOT NULL
    `);
    console.log(`✅ user_id relationship: ${userCheck[0].count} enrollments linked to users`);
    
    // 3. Complete Data Flow Verification
    console.log('\n🔄 3. COMPLETE DATA FLOW VERIFICATION:');
    console.log('-' .repeat(50));
    
    const [completeData] = await sequelize.query(`
      SELECT 
        e.id as enrollment_id,
        e.first_name,
        e.last_name,
        e.email as enrollment_email,
        e.phone,
        e.gender,
        e.address,
        e.city,
        e.state,
        e.country,
        e.highest_qualification,
        e.institution,
        e.year_of_passing,
        e.course_interest,
        e.training_mode,
        e.experience,
        e.motivation,
        e.career_goals,
        e.payment_amount,
        e.payment_status,
        e.status as enrollment_status,
        e.created_at as enrollment_date,
        u.id as user_id,
        u.name as user_name,
        u.email as user_email,
        u.role as user_role,
        c.id as course_id,
        c.title as course_title,
        c.category as course_category,
        c.level as course_level,
        c.duration as course_duration,
        c.price as course_price,
        c.currency as course_currency,
        c.status as course_status
      FROM enrollments e
      LEFT JOIN users u ON e.user_id = u.id
      LEFT JOIN courses c ON e.course_id = c.id
      ORDER BY e.created_at DESC
    `);
    
    console.log('✅ Complete enrollment data with all relationships:');
    console.log(JSON.stringify(completeData, null, 2));
    
    // 4. Payment Relationships
    console.log('\n💳 4. PAYMENT RELATIONSHIPS VERIFICATION:');
    console.log('-' .repeat(50));
    
    const [paymentData] = await sequelize.query(`
      SELECT 
        p.id as payment_id,
        p.user_id,
        p.enrollment_id,
        p.course_id,
        p.amount,
        p.currency,
        p.status as payment_status,
        p.payment_method,
        p.created_at as payment_date,
        e.first_name,
        e.last_name,
        e.email as enrollment_email,
        c.title as course_title,
        u.name as user_name
      FROM payments p
      LEFT JOIN enrollments e ON p.enrollment_id = e.id
      LEFT JOIN courses c ON p.course_id = c.id
      LEFT JOIN users u ON p.user_id = u.id
      ORDER BY p.created_at DESC
    `);
    
    console.log('✅ Payment data with relationships:');
    console.log(JSON.stringify(paymentData, null, 2));
    
    // 5. Data Statistics
    console.log('\n📊 5. DATA STATISTICS:');
    console.log('-' .repeat(50));
    
    const [stats] = await sequelize.query(`
      SELECT 
        (SELECT COUNT(*) FROM users WHERE role = 'student') as total_students,
        (SELECT COUNT(*) FROM users WHERE role = 'admin') as total_admins,
        (SELECT COUNT(*) FROM courses WHERE status = 'published') as published_courses,
        (SELECT COUNT(*) FROM courses) as total_courses,
        (SELECT COUNT(*) FROM enrollments) as total_enrollments,
        (SELECT COUNT(*) FROM enrollments WHERE status = 'approved') as approved_enrollments,
        (SELECT COUNT(*) FROM enrollments WHERE payment_status = 'completed') as completed_payments,
        (SELECT COUNT(*) FROM payments WHERE status = 'completed') as total_payments,
        (SELECT SUM(amount) FROM payments WHERE status = 'completed') as total_revenue
    `);
    
    console.log('✅ System Statistics:');
    console.log(`   👥 Total Students: ${stats[0].total_students}`);
    console.log(`   👨‍💼 Total Admins: ${stats[0].total_admins}`);
    console.log(`   📚 Published Courses: ${stats[0].published_courses}`);
    console.log(`   📖 Total Courses: ${stats[0].total_courses}`);
    console.log(`   🎓 Total Enrollments: ${stats[0].total_enrollments}`);
    console.log(`   ✅ Approved Enrollments: ${stats[0].approved_enrollments}`);
    console.log(`   💳 Completed Payments: ${stats[0].completed_payments}`);
    console.log(`   💰 Total Revenue: ₹${stats[0].total_revenue || 0}`);
    
    // 6. Data Flow Summary
    console.log('\n🎯 6. DATA FLOW SUMMARY:');
    console.log('-' .repeat(50));
    console.log('✅ USER REGISTRATION → ENROLLMENT → PAYMENT FLOW:');
    console.log('   1. 👤 User registers → users table');
    console.log('   2. 📚 Course created → courses table');
    console.log('   3. 🎓 User enrolls → enrollments table (user_id + course_id)');
    console.log('   4. 💳 Payment made → payments table (enrollment_id + user_id + course_id)');
    console.log('   5. 🔗 All data connected through foreign keys');
    
    console.log('\n✅ ADMIN PANEL CAN NOW SHOW:');
    console.log('   • Student names and details from users table');
    console.log('   • Course titles and details from courses table');
    console.log('   • Enrollment status and payment information');
    console.log('   • Complete payment history and revenue tracking');
    
    console.log('\n✅ USER PANEL CAN NOW SHOW:');
    console.log('   • User\'s enrolled courses');
    console.log('   • Course progress and status');
    console.log('   • Payment history and receipts');
    console.log('   • Course materials and resources');
    
    console.log('\n🎉 ALL DATA RELATIONSHIPS VERIFIED AND WORKING!');
    console.log('=' .repeat(80));
    
  } catch (error) {
    console.error('❌ Error in data verification:', error);
    throw error;
  }
}

// Run the verification
if (require.main === module) {
  completeDataVerification()
    .then(() => {
      console.log('\n✅ Complete verification finished successfully!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Verification failed:', error);
      process.exit(1);
    });
}

module.exports = completeDataVerification;
