const { sequelize } = require('../config/database');

const addMissingIndexes = async () => {
  try {
    await sequelize.authenticate();
    console.log('📊 Database connection established for adding missing indexes.');

    // Add missing indexes for commonly queried columns
    const missingIndexes = [
      'CREATE INDEX IF NOT EXISTS idx_banners_created_at ON banners(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_certificates_created_at ON certificates(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_certificates_status ON certificates(status)',
      'CREATE INDEX IF NOT EXISTS idx_course_categories_created_at ON course_categories(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_faqs_created_at ON faqs(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status)',
      'CREATE INDEX IF NOT EXISTS idx_students_created_at ON students(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_video_access_created_at ON video_access(created_at)',
      
      // Additional performance indexes
      'CREATE INDEX IF NOT EXISTS idx_enrollments_created_at ON enrollments(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_testimonials_created_at ON testimonials(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_internships_created_at ON internships(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at)',
      'CREATE INDEX IF NOT EXISTS idx_video_lectures_created_at ON video_lectures(created_at)'
    ];

    console.log('🔧 Adding missing performance indexes...');
    
    for (const indexQuery of missingIndexes) {
      try {
        await sequelize.query(indexQuery);
        console.log(`✅ Added index: ${indexQuery.split('idx_')[1].split(' ON')[0]}`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  Index already exists: ${indexQuery.split('idx_')[1].split(' ON')[0]}`);
        } else {
          console.log(`❌ Error adding index: ${error.message}`);
        }
      }
    }

    console.log('\n🎉 Missing indexes added successfully!');
    console.log('💡 Database queries should now be significantly faster.');

  } catch (error) {
    console.error('❌ Error adding missing indexes:', error.message);
  } finally {
    await sequelize.close();
  }
};

addMissingIndexes();

