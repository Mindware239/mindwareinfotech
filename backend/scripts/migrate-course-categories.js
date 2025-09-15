const { sequelize } = require('../config/database');

async function migrateCourseCategories() {
  try {
    console.log('🔄 Starting course category migration...');
    
    // Add new columns to courses table
    console.log('🔄 Adding new columns to courses table...');
    
    await sequelize.query(`
      ALTER TABLE courses 
      ADD COLUMN category_id INT NULL AFTER instructor_id,
      ADD COLUMN original_price DECIMAL(10,2) NULL AFTER price,
      ADD COLUMN discount_percentage DECIMAL(5,2) NULL DEFAULT 0 AFTER original_price,
      ADD COLUMN enrollment_fee DECIMAL(10,2) NULL DEFAULT 0 AFTER is_free,
      ADD COLUMN installment_available BOOLEAN NULL DEFAULT FALSE AFTER enrollment_fee,
      ADD COLUMN installment_count INT NULL DEFAULT 1 AFTER installment_available
    `);
    
    console.log('✅ Added new columns to courses table');
    
    // Add foreign key constraint
    console.log('🔄 Adding foreign key constraint...');
    
    await sequelize.query(`
      ALTER TABLE courses 
      ADD CONSTRAINT fk_courses_category_id 
      FOREIGN KEY (category_id) REFERENCES course_categories(id) 
      ON DELETE SET NULL ON UPDATE CASCADE
    `);
    
    console.log('✅ Added foreign key constraint');
    
    // Add new columns to enrollments table
    console.log('🔄 Adding courseId column to enrollments table...');
    
    await sequelize.query(`
      ALTER TABLE enrollments 
      ADD COLUMN courseId INT NULL
    `);
    
    console.log('✅ Added courseId column to enrollments table');
    
    // Add foreign key constraint for enrollments
    console.log('🔄 Adding foreign key constraint for enrollments...');
    
    await sequelize.query(`
      ALTER TABLE enrollments 
      ADD CONSTRAINT fk_enrollments_course_id 
      FOREIGN KEY (courseId) REFERENCES courses(id) 
      ON DELETE SET NULL ON UPDATE CASCADE
    `);
    
    console.log('✅ Added foreign key constraint for enrollments');
    
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
        await sequelize.query(`
          UPDATE courses 
          SET category_id = ? 
          WHERE category = ?
        `, {
          replacements: [update.newCategoryId, update.oldCategory]
        });
        console.log(`✅ Updated ${update.oldCategory} courses`);
      }
    }
    
    // Set default category for courses without category
    const defaultCategoryId = categoryMap['programming-fundamentals'];
    if (defaultCategoryId) {
      await sequelize.query(`
        UPDATE courses 
        SET category_id = ? 
        WHERE category_id IS NULL
      `, {
        replacements: [defaultCategoryId]
      });
      console.log('✅ Set default category for courses without category');
    }
    
    console.log('🎉 Course category migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Error during migration:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  migrateCourseCategories()
    .then(() => {
      console.log('✅ Migration completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Migration failed:', error);
      process.exit(1);
    });
}

module.exports = migrateCourseCategories;
