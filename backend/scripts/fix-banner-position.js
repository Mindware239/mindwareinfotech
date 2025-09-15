const { sequelize } = require('../config/database');

async function fixBannerPosition() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Update the column type
    await sequelize.query('ALTER TABLE banners MODIFY COLUMN banner_position VARCHAR(50) DEFAULT "hero"');
    console.log('✅ Updated banner_position column to VARCHAR');
    
    // Update existing data
    await sequelize.query('UPDATE banners SET banner_position = "header" WHERE banner_id = 10');
    await sequelize.query('UPDATE banners SET banner_position = "hero" WHERE banner_id = 11');
    await sequelize.query('UPDATE banners SET banner_position = "service" WHERE banner_id = 12');
    await sequelize.query('UPDATE banners SET banner_position = "about" WHERE banner_id = 13');
    console.log('✅ Updated banner positions');
    
    // Set all banners as active
    await sequelize.query('UPDATE banners SET is_active = 1');
    console.log('✅ Set all banners as active');
    
    // Test the query
    const result = await sequelize.query('SELECT * FROM banners WHERE banner_position = "header" AND is_active = 1');
    console.log('📊 Header banners found:', result[0].length);
    if (result[0].length > 0) {
      console.log('✅ Banner title:', result[0][0].title);
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixBannerPosition();
