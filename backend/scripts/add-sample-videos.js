const { sequelize } = require('../config/database');
const VideoLecture = require('../models/VideoLecture');
const Course = require('../models/Course');

async function addSampleVideos() {
  try {
    console.log('Adding sample videos...');

    // First, let's find or create a course
    let course = await Course.findOne();
    if (!course) {
      console.log('No course found, creating a sample course...');
      course = await Course.create({
        title: 'Full Stack Web Development',
        description: 'Complete web development course covering frontend and backend technologies',
        category: 'web-development',
        level: 'beginner',
        duration: 120, // 120 hours
        price: 9999,
        currency: 'INR',
        status: 'published',
        created_by: 1
      });
    }

    // Sample videos with realistic data using local video files
    const sampleVideos = [
      {
        title: 'Introduction to React.js',
        description: 'Learn the fundamentals of React.js including components, state, and props. Perfect for beginners who want to start their React journey.',
        video_url: '/uploads/videos/video-1757586782904-792143147.mp4',
        thumbnail: {
          url: 'https://via.placeholder.com/640x360/4f46e5/ffffff?text=React+Introduction',
          alt: 'React Introduction Thumbnail'
        },
        duration: 1800, // 30 minutes
        course_id: course.id,
        chapter: 'Getting Started',
        order: 1,
        access_level: 'free',
        price: 0,
        currency: 'INR',
        status: 'published',
        tags: ['react', 'javascript', 'frontend', 'beginner'],
        created_by: 1
      },
      {
        title: 'Advanced React Patterns',
        description: 'Master advanced React patterns including HOCs, Render Props, and Custom Hooks. Take your React skills to the next level.',
        video_url: '/uploads/videos/video-1757586787447-237048812.mp4',
        thumbnail: {
          url: 'https://via.placeholder.com/640x360/059669/ffffff?text=Advanced+React',
          alt: 'Advanced React Thumbnail'
        },
        duration: 3600, // 60 minutes
        course_id: course.id,
        chapter: 'Advanced Concepts',
        order: 2,
        access_level: 'premium',
        price: 999,
        currency: 'INR',
        status: 'published',
        tags: ['react', 'advanced', 'patterns', 'hooks'],
        created_by: 1
      },
      {
        title: 'Node.js Backend Development',
        description: 'Build robust backend applications with Node.js and Express. Learn RESTful APIs, authentication, and database integration.',
        video_url: '/uploads/videos/video-1757586788605-701350006.mp4',
        thumbnail: {
          url: 'https://via.placeholder.com/640x360/dc2626/ffffff?text=Node.js+Backend',
          alt: 'Node.js Backend Thumbnail'
        },
        duration: 2700, // 45 minutes
        course_id: course.id,
        chapter: 'Backend Development',
        order: 3,
        access_level: 'preview',
        price: 499,
        currency: 'INR',
        preview_duration: 300, // 5 minutes preview
        status: 'published',
        tags: ['nodejs', 'backend', 'express', 'api'],
        created_by: 1
      },
      {
        title: 'Database Design with MySQL',
        description: 'Learn database design principles and MySQL implementation. Create efficient, scalable database schemas.',
        video_url: '/uploads/videos/video-1757586792730-28495375.mp4',
        thumbnail: {
          url: 'https://via.placeholder.com/640x360/7c3aed/ffffff?text=MySQL+Database',
          alt: 'MySQL Database Thumbnail'
        },
        duration: 2400, // 40 minutes
        course_id: course.id,
        chapter: 'Database Management',
        order: 4,
        access_level: 'premium',
        price: 799,
        currency: 'INR',
        status: 'published',
        tags: ['mysql', 'database', 'sql', 'design'],
        created_by: 1
      },
      {
        title: 'JavaScript ES6+ Features',
        description: 'Explore modern JavaScript features including arrow functions, destructuring, async/await, and modules.',
        video_url: '/uploads/videos/video-1757587847779-84144548.mp4',
        thumbnail: {
          url: 'https://via.placeholder.com/640x360/f59e0b/ffffff?text=JavaScript+ES6',
          alt: 'JavaScript ES6 Thumbnail'
        },
        duration: 2100, // 35 minutes
        course_id: course.id,
        chapter: 'JavaScript Fundamentals',
        order: 5,
        access_level: 'free',
        price: 0,
        currency: 'INR',
        status: 'published',
        tags: ['javascript', 'es6', 'modern', 'fundamentals'],
        created_by: 1
      },
      {
        title: 'CSS Grid and Flexbox Mastery',
        description: 'Master modern CSS layout techniques with Grid and Flexbox. Create responsive, beautiful layouts.',
        video_url: '/uploads/videos/video-1757587849774-337929996.mp4',
        thumbnail: {
          url: 'https://via.placeholder.com/640x360/10b981/ffffff?text=CSS+Layout',
          alt: 'CSS Layout Thumbnail'
        },
        duration: 1800, // 30 minutes
        course_id: course.id,
        chapter: 'CSS Styling',
        order: 6,
        access_level: 'premium',
        price: 599,
        currency: 'INR',
        status: 'published',
        tags: ['css', 'grid', 'flexbox', 'layout'],
        created_by: 1
      }
    ];

    // Clear existing videos first
    await VideoLecture.destroy({ where: {} });
    console.log('Cleared existing videos');

    // Create sample videos
    for (const videoData of sampleVideos) {
      const video = await VideoLecture.create(videoData);
      console.log(`✅ Created video: ${video.title} (${video.access_level})`);
    }

    console.log('\n🎉 Sample videos added successfully!');
    console.log(`Total videos: ${await VideoLecture.count()}`);

  } catch (error) {
    console.error('❌ Error adding sample videos:', error);
  } finally {
    await sequelize.close();
  }
}

addSampleVideos();
