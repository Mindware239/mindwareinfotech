const { sequelize } = require('../config/database');

const addPerformanceIndexes = async () => {
  try {
    await sequelize.authenticate();
    console.log('📊 Database connection established for adding performance indexes.');

    // Add indexes for commonly queried columns
    const indexes = [
      // Users table
      'CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)',
      'CREATE INDEX IF NOT EXISTS idx_users_role ON users(role)',
      'CREATE INDEX IF NOT EXISTS idx_users_is_active ON users(is_active)',
      
      // Courses table
      'CREATE INDEX IF NOT EXISTS idx_courses_category_id ON courses(category_id)',
      'CREATE INDEX IF NOT EXISTS idx_courses_status ON courses(status)',
      'CREATE INDEX IF NOT EXISTS idx_courses_is_featured ON courses(is_featured)',
      'CREATE INDEX IF NOT EXISTS idx_courses_created_at ON courses(created_at)',
      
      // Enrollments table
      'CREATE INDEX IF NOT EXISTS idx_enrollments_user_id ON enrollments(userId)',
      'CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments(courseId)',
      'CREATE INDEX IF NOT EXISTS idx_enrollments_status ON enrollments(status)',
      'CREATE INDEX IF NOT EXISTS idx_enrollments_created_at ON enrollments(created_at)',
      
      // Internships table
      'CREATE INDEX IF NOT EXISTS idx_internships_category_id ON internships(category_id)',
      'CREATE INDEX IF NOT EXISTS idx_internships_status ON internships(status)',
      'CREATE INDEX IF NOT EXISTS idx_internships_is_featured ON internships(is_featured)',
      'CREATE INDEX IF NOT EXISTS idx_internships_created_at ON internships(created_at)',
      
      // Blogs table
      'CREATE INDEX IF NOT EXISTS idx_blogs_status ON blogs(status)',
      'CREATE INDEX IF NOT EXISTS idx_blogs_is_featured ON blogs(is_featured)',
      'CREATE INDEX IF NOT EXISTS idx_blogs_author_id ON blogs(author_id)',
      'CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs(created_at)',
      
      // Gallery table
      'CREATE INDEX IF NOT EXISTS idx_gallery_status ON gallery(status)',
      'CREATE INDEX IF NOT EXISTS idx_gallery_is_featured ON gallery(is_featured)',
      'CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at)',
      
      // Testimonials table
      'CREATE INDEX IF NOT EXISTS idx_testimonials_status ON testimonials(testimonial_status)',
      'CREATE INDEX IF NOT EXISTS idx_testimonials_order ON testimonials(testimonial_order)',
      
      // Jobs table
      'CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status)',
      'CREATE INDEX IF NOT EXISTS idx_jobs_is_featured ON jobs(is_featured)',
      'CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON jobs(created_at)',
      
      // Banners table
      'CREATE INDEX IF NOT EXISTS idx_banners_is_active ON banners(is_active)',
      'CREATE INDEX IF NOT EXISTS idx_banners_position ON banners(banner_position)',
      
      // FAQs table
      'CREATE INDEX IF NOT EXISTS idx_faqs_status ON faqs(status)',
      'CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category)',
      
      // Video lectures table
      'CREATE INDEX IF NOT EXISTS idx_video_lectures_course_id ON video_lectures(course_id)',
      'CREATE INDEX IF NOT EXISTS idx_video_lectures_status ON video_lectures(status)',
      'CREATE INDEX IF NOT EXISTS idx_video_lectures_is_free ON video_lectures(is_free)',
      
      // Video access table
      'CREATE INDEX IF NOT EXISTS idx_video_access_user_id ON video_access(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_video_access_video_id ON video_access(video_id)',
      
      // Payments table
      'CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status)',
      'CREATE INDEX IF NOT EXISTS idx_payments_created_at ON payments(created_at)',
      
      // Certificates table
      'CREATE INDEX IF NOT EXISTS idx_certificates_user_id ON certificates(user_id)',
      'CREATE INDEX IF NOT EXISTS idx_certificates_course_id ON certificates(course_id)',
      
      // Course categories table
      'CREATE INDEX IF NOT EXISTS idx_course_categories_is_active ON course_categories(is_active)',
      'CREATE INDEX IF NOT EXISTS idx_course_categories_sort_order ON course_categories(sort_order)'
    ];

    console.log('🔧 Adding performance indexes...');
    
    for (const indexQuery of indexes) {
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

    console.log('\n🎉 Performance indexes added successfully!');
    console.log('💡 This should significantly improve query performance.');

  } catch (error) {
    console.error('❌ Error adding performance indexes:', error.message);
  } finally {
    await sequelize.close();
  }
};

addPerformanceIndexes();

