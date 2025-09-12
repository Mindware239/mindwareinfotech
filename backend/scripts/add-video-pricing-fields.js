const { sequelize } = require('../config/database');

async function addVideoPricingFields() {
  try {
    console.log('Adding video pricing fields...');
    
    // Add new columns to video_lectures table
    await sequelize.query(`
      ALTER TABLE video_lectures 
      ADD COLUMN price DECIMAL(10,2) DEFAULT 0,
      ADD COLUMN currency VARCHAR(3) DEFAULT 'INR',
      ADD COLUMN access_level ENUM('free', 'premium', 'preview') DEFAULT 'free',
      ADD COLUMN preview_duration INT DEFAULT NULL COMMENT 'Preview duration in seconds'
    `);
    
    console.log('✅ Video pricing fields added successfully');
    
    // Create video_access table
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS video_access (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        video_id INT NOT NULL,
        access_type ENUM('free', 'premium', 'preview') NOT NULL,
        payment_id INT DEFAULT NULL,
        access_granted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        expires_at DATETIME DEFAULT NULL,
        is_active BOOLEAN DEFAULT TRUE,
        progress JSON DEFAULT NULL,
        watch_count INT DEFAULT 0,
        last_watched_at DATETIME DEFAULT NULL,
        completed BOOLEAN DEFAULT FALSE,
        completed_at DATETIME DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_user_video (user_id, video_id),
        KEY idx_user_id (user_id),
        KEY idx_video_id (video_id),
        KEY idx_access_type (access_type),
        KEY idx_is_active (is_active),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (video_id) REFERENCES video_lectures(id) ON DELETE CASCADE,
        FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE SET NULL
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci
    `);
    
    console.log('✅ Video access table created successfully');
    
    // Update existing videos to have proper access levels
    await sequelize.query(`
      UPDATE video_lectures 
      SET access_level = CASE 
        WHEN is_free = 1 THEN 'free'
        WHEN is_preview = 1 THEN 'preview'
        ELSE 'premium'
      END
    `);
    
    console.log('✅ Updated existing videos with access levels');
    
    console.log('🎉 Database migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
}

// Run migration if called directly
if (require.main === module) {
  addVideoPricingFields()
    .then(() => {
      console.log('Migration completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

module.exports = addVideoPricingFields;
