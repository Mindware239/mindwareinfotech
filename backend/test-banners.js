const Banner = require('./models/Banner');
const { sequelize } = require('./config/database');

async function testBanners() {
  try {
    console.log('🔍 Testing Banner functionality...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connected successfully');
    
    // Sync the model
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized');
    
    // Check if banners table exists
    const tableExists = await sequelize.getQueryInterface().showAllTables();
    console.log('📋 Available tables:', tableExists);
    
    // Try to get all banners
    const banners = await Banner.findAll();
    console.log('📊 Total banners in database:', banners.length);
    console.log('📋 Banners data:', JSON.stringify(banners, null, 2));
    
    // Try to create a test banner
    const testBanner = await Banner.create({
      title: 'Test Banner',
      subtitle: 'Test Subtitle',
      description: 'Test Description',
      image_url: '/uploads/banners/test-banner.jpg',
      button_text: 'Learn More',
      button_url: 'https://example.com',
      banner_type: 'hero',
      banner_position: 1,
      is_active: true,
      created_by: 1
    });
    
    console.log('✅ Test banner created:', testBanner.toJSON());
    
    // Get all banners again
    const allBanners = await Banner.findAll();
    console.log('📊 Total banners after creation:', allBanners.length);
    
  } catch (error) {
    console.error('❌ Error testing banners:', error);
  } finally {
    await sequelize.close();
  }
}

testBanners();
