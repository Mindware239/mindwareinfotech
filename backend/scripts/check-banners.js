const { sequelize } = require('../config/database');

async function checkBanners() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    const result = await sequelize.query('SELECT banner_id, title, banner_position, is_active FROM banners');
    console.log('📊 All banners:');
    result[0].forEach(banner => {
      console.log(`ID: ${banner.banner_id}, Title: ${banner.title}, Position: ${banner.banner_position}, Active: ${banner.is_active}`);
    });
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkBanners();
