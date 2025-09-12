const Banner = require('../models/Banner');
const { sequelize } = require('../config/database');

async function seedBanners() {
  try {
    console.log('🌱 Seeding banners...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Sync models
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized');
    
    // Clear existing banners
    await Banner.destroy({ where: {} });
    console.log('🗑️ Cleared existing banners');
    
    // Create sample banners
    const banners = [
      {
        title: 'Welcome to Mindware Infotech',
        subtitle: 'Complete Software Solutions & Training',
        description: 'We provide comprehensive software development services and professional training programs to help you succeed in the tech industry.',
        image_url: '/uploads/banners/banner-1757329778616-249422715.jpg',
        button_text: 'Get Started',
        button_url: 'https://mindwareinfotech.com',
        banner_type: 'hero',
        banner_position: 1,
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
        banner_position: 2,
        is_active: true,
        created_by: 1
      },
      {
        title: 'Internship Opportunities',
        subtitle: 'Gain Real-World Experience',
        description: 'Join our internship program and work on real projects with experienced developers.',
        image_url: '/uploads/banners/internship-banner.jpg',
        button_text: 'Apply Now',
        button_url: 'https://mindwareinfotech.com/internships',
        banner_type: 'about',
        banner_position: 3,
        is_active: true,
        created_by: 1
      }
    ];
    
    // Create banners
    for (const bannerData of banners) {
      await Banner.create(bannerData);
      console.log(`✅ Created banner: ${bannerData.title}`);
    }
    
    // Get all banners
    const allBanners = await Banner.findAll();
    console.log(`📊 Total banners created: ${allBanners.length}`);
    
    console.log('🎉 Banner seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding banners:', error);
  } finally {
    await sequelize.close();
  }
}

seedBanners();
