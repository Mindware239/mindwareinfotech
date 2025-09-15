const { sequelize } = require('../config/database');

async function updateCourseCategories() {
  try {
    console.log('🔄 Updating course categories...');
    
    // Get category mappings
    const [categories] = await sequelize.query(`
      SELECT id, slug FROM course_categories
    `);
    
    const categoryMap = {};
    categories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });
    
    console.log('📋 Available categories:', Object.keys(categoryMap));
    
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
          WHERE category = ? AND (category_id IS NULL OR category_id = 0)
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
        WHERE category_id IS NULL OR category_id = 0
      `, {
        replacements: [defaultCategoryId]
      });
      console.log(`✅ Set default category for ${result.affectedRows} courses without category`);
    }
    
    // Show final status
    const [courseStats] = await sequelize.query(`
      SELECT 
        cc.name as category_name,
        COUNT(c.id) as course_count
      FROM course_categories cc
      LEFT JOIN courses c ON cc.id = c.category_id
      GROUP BY cc.id, cc.name
      ORDER BY course_count DESC
    `);
    
    console.log('\n📊 Course distribution by category:');
    courseStats.forEach(stat => {
      console.log(`  ${stat.category_name}: ${stat.course_count} courses`);
    });
    
    console.log('\n🎉 Course category update completed successfully!');
    
  } catch (error) {
    console.error('❌ Error updating course categories:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  updateCourseCategories()
    .then(() => {
      console.log('✅ Update completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Update failed:', error);
      process.exit(1);
    });
}

module.exports = updateCourseCategories;
