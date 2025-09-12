const { sequelize } = require('../config/database');

async function addIndexes() {
  try {
    console.log('🔧 Adding database indexes for better performance...');
    
    // Add indexes for blogs table
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_blogs_status_featured 
      ON blogs (status, is_featured, created_at DESC);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_blogs_category 
      ON blogs (category);
    `);
    
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_blogs_author 
      ON blogs (author_id);
    `);
    
    // Add indexes for testimonials table
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_testimonials_status_order 
      ON testimonials (testimonial_status, testimonial_order, created_at DESC);
    `);
    
    // Add indexes for gallery table
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_gallery_status_featured 
      ON gallery (status, is_featured, created_at DESC);
    `);
    
    // Add indexes for video_lectures table
    await sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_videos_course 
      ON video_lectures (course_id, created_at DESC);
    `);
    
    console.log('✅ Database indexes added successfully!');
    
  } catch (error) {
    console.error('❌ Error adding indexes:', error);
  } finally {
    await sequelize.close();
  }
}

addIndexes();
