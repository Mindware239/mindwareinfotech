const { sequelize } = require('../config/database');

async function completeMigration() {
  try {
    console.log('🔄 Completing course category migration...');
    
    // Check if columns exist and add them if they don't
    console.log('🔄 Checking and adding missing columns...');
    
    // Check courses table columns
    const [courseColumns] = await sequelize.query(`
      SHOW COLUMNS FROM courses LIKE 'category_id'
    `);
    
    if (courseColumns.length === 0) {
      await sequelize.query(`
        ALTER TABLE courses ADD COLUMN category_id INT NULL AFTER instructor_id
      `);
      console.log('✅ Added category_id to courses table');
    } else {
      console.log('ℹ️  category_id already exists in courses table');
    }
    
    // Check for other missing columns in courses
    const missingColumns = [
      { name: 'original_price', type: 'DECIMAL(10,2) NULL AFTER price' },
      { name: 'discount_percentage', type: 'DECIMAL(5,2) NULL DEFAULT 0 AFTER original_price' },
      { name: 'enrollment_fee', type: 'DECIMAL(10,2) NULL DEFAULT 0 AFTER is_free' },
      { name: 'installment_available', type: 'BOOLEAN NULL DEFAULT FALSE AFTER enrollment_fee' },
      { name: 'installment_count', type: 'INT NULL DEFAULT 1 AFTER installment_available' }
    ];
    
    for (const column of missingColumns) {
      const [columns] = await sequelize.query(`
        SHOW COLUMNS FROM courses LIKE '${column.name}'
      `);
      
      if (columns.length === 0) {
        await sequelize.query(`
          ALTER TABLE courses ADD COLUMN ${column.name} ${column.type}
        `);
        console.log(`✅ Added ${column.name} to courses table`);
      } else {
        console.log(`ℹ️  ${column.name} already exists in courses table`);
      }
    }
    
    // Check enrollments table for courseId
    const [enrollmentColumns] = await sequelize.query(`
      SHOW COLUMNS FROM enrollments LIKE 'courseId'
    `);
    
    if (enrollmentColumns.length === 0) {
      await sequelize.query(`
        ALTER TABLE enrollments ADD COLUMN courseId INT NULL
      `);
      console.log('✅ Added courseId to enrollments table');
    } else {
      console.log('ℹ️  courseId already exists in enrollments table');
    }
    
    // Add foreign key constraints if they don't exist
    console.log('🔄 Adding foreign key constraints...');
    
    try {
      await sequelize.query(`
        ALTER TABLE courses 
        ADD CONSTRAINT fk_courses_category_id 
        FOREIGN KEY (category_id) REFERENCES course_categories(id) 
        ON DELETE SET NULL ON UPDATE CASCADE
      `);
      console.log('✅ Added foreign key constraint for courses.category_id');
    } catch (error) {
      if (error.message.includes('Duplicate key name')) {
        console.log('ℹ️  Foreign key constraint already exists for courses.category_id');
      } else {
        throw error;
      }
    }
    
    try {
      await sequelize.query(`
        ALTER TABLE enrollments 
        ADD CONSTRAINT fk_enrollments_course_id 
        FOREIGN KEY (courseId) REFERENCES courses(id) 
        ON DELETE SET NULL ON UPDATE CASCADE
      `);
      console.log('✅ Added foreign key constraint for enrollments.courseId');
    } catch (error) {
      if (error.message.includes('Duplicate key name')) {
        console.log('ℹ️  Foreign key constraint already exists for enrollments.courseId');
      } else {
        throw error;
      }
    }
    
    // Update existing courses to use new category system
    console.log('🔄 Updating existing courses with category IDs...');
    
    // Get category mappings
    const [categories] = await sequelize.query(`
      SELECT id, slug FROM course_categories
    `);
    
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });
    
    // Update courses based on old category field
    const categoryUpdates = [
      { oldCategory: 'web-development', newCategoryId: categoryMap['web-development'] },
      { oldCategory: 'mobile-development', newCategoryId: categoryMap['mobile-development'] },
      { oldCategory: 'data-science', newCategoryId: categoryMap['data-science'] },
      { oldCategory: 'programming', newCategoryId: categoryMap['programming-fundamentals'] },
      { oldCategory: 'design', newCategoryId: categoryMap['ui-ux-design'] },
      { oldCategory: 'ai-ml', newCategoryId: categoryMap['data-science'] },
      { oldCategory: 'cybersecurity', newCategoryId: categoryMap['cybersecurity'] },
      { oldCategory: 'devops', newCategoryId: categoryMap['cloud-computing'] }
    ];
    
    for (const update of categoryUpdates) {
      if (update.newCategoryId) {
        const [result] = await sequelize.query(`
          UPDATE courses 
          SET category_id = ? 
          WHERE category = ? AND category_id IS NULL
        `, {
          replacements: [update.newCategoryId, update.oldCategory]
        });
        console.log(`✅ Updated ${result.affectedRows} ${update.oldCategory} courses`);
      }
    }
    
    // Set default category for courses without category
    const defaultCategoryId = categoryMap['programming-fundamentals'];
    if (defaultCategoryId) {
      const [result] = await sequelize.query(`
        UPDATE courses 
        SET category_id = ? 
        WHERE category_id IS NULL
      `, {
        replacements: [defaultCategoryId]
      });
      console.log(`✅ Set default category for ${result.affectedRows} courses without category`);
    }
    
    console.log('🎉 Course category migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  completeMigration()
    .then(() => {
      console.log('✅ Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = completeMigration;
