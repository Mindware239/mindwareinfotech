const { sequelize } = require('../config/database');
const Banner = require('../models/Banner');

async function createHeaderBanner() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Clear existing banners
    await Banner.destroy({ where: {} });
    console.log('🗑️ Cleared existing banners');
    
    // Create header banner
    const headerBanner = await Banner.create({
      title: 'Join Our Growing Team',
      subtitle: 'Explore Exciting Career Opportunities',
      description: 'Be part of our innovative team and work on cutting-edge projects. We offer competitive packages and growth opportunities.',
      image_url: '/uploads/banners/banner-1757680907082-22582561.webp',
      button_text: 'VIEW JOBS',
      button_url: '/careers',
      banner_type: 'header',
      banner_position: 'header',
      is_active: true,
      created_by: 1
    });
    
    console.log('✅ Created header banner:', headerBanner.title);
    
    // Create other banners
    const otherBanners = [
      {
        title: 'Welcome to Mindware Infotech',
        subtitle: 'Complete Software Solutions & Training',
        description: 'We provide comprehensive software development services and professional training programs to help you succeed in the tech industry.',
        image_url: '/uploads/banners/banner-1757329778616-249422715.jpg',
        button_text: 'Get Started',
        button_url: 'https://mindwareinfotech.com',
        banner_type: 'hero',
        banner_position: 'hero',
        is_active: true,
        created_by: 1
      },
      {
        title: 'Professional Training Programs',
        subtitle: 'Learn from Industry Experts',
        description: 'Our comprehensive training programs cover the latest technologies and industry best practices.',
        image_url: '/uploads/banners/training-banner.jpg',
        button_text: 'View Courses',
        button_url: 'https://mindwareinfotech.com/courses',
        banner_type: 'service',
        banner_position: 'service',
        is_active: true,
        created_by: 1
      }
    ];
    
    for (const bannerData of otherBanners) {
      await Banner.create(bannerData);
      console.log(`✅ Created banner: ${bannerData.title}`);
    }
    
    // Test the header banner query
    const headerBanners = await Banner.findAll({
      where: { banner_position: 'header', is_active: true }
    });
    
    console.log('📊 Header banners found:', headerBanners.length);
    if (headerBanners.length > 0) {
      console.log('✅ Header banner title:', headerBanners[0].title);
    }
    
    await sequelize.close();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createHeaderBanner();
