const { sequelize } = require('../config/database');
const CourseCategory = require('../models/CourseCategory');

async function checkCategories() {
  try {
    console.log('🔍 Checking course categories...\n');
    
    const categories = await CourseCategory.findAll({
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });
    
    console.log(`📊 Found ${categories.length} categories:\n`);
    
    categories.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name}`);
      console.log(`   Slug: ${category.slug}`);
      console.log(`   Description: ${category.description || 'No description'}`);
      console.log(`   Icon: ${category.icon || 'No icon'}`);
      console.log(`   Color: ${category.color}`);
      console.log(`   Status: ${category.is_active ? 'Active' : 'Inactive'}`);
      console.log(`   Sort Order: ${category.sort_order}`);
      console.log(`   Created: ${category.created_at}`);
      console.log('   ' + '─'.repeat(50));
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await sequelize.close();
  }
}

checkCategories();
