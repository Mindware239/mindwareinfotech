const { sequelize } = require('../config/database');
const VideoLecture = require('../models/VideoLecture');

const sampleVideos = [
  {
    title: 'Introduction to React',
    description: 'Learn the basics of React and how to build modern web applications',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: { url: '/images/video-thumbnails/react-intro.jpg' },
    duration: 2730, // 45:30 in seconds
    course_id: 1,
    chapter: 'Getting Started',
    order: 1,
    created_by: 1,
    category: 'Frontend Development',
    difficulty_level: 'Beginner',
    is_featured: true,
    status: 'published',
    view_count: 1250,
    instructor_name: 'John Doe'
  },
  {
    title: 'Node.js Backend Development',
    description: 'Master server-side JavaScript with Node.js and Express',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: { url: '/images/video-thumbnails/nodejs-backend.jpg' },
    duration: 4815, // 1:20:15 in seconds
    course_id: 1,
    chapter: 'Backend Fundamentals',
    order: 2,
    created_by: 1,
    category: 'Backend Development',
    difficulty_level: 'Intermediate',
    is_featured: true,
    status: 'published',
    view_count: 890,
    instructor_name: 'Jane Smith'
  },
  {
    title: 'Database Design with MySQL',
    description: 'Learn database design principles and MySQL implementation',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: { url: '/images/video-thumbnails/mysql-database.jpg' },
    duration: 3945, // 1:05:45 in seconds
    course_id: 1,
    chapter: 'Database Design',
    order: 3,
    created_by: 1,
    category: 'Database',
    difficulty_level: 'Beginner',
    is_featured: false,
    status: 'published',
    view_count: 650,
    instructor_name: 'Mike Johnson'
  },
  {
    title: 'Advanced JavaScript Concepts',
    description: 'Deep dive into advanced JavaScript features and patterns',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: { url: '/images/video-thumbnails/advanced-js.jpg' },
    duration: 8130, // 2:15:30 in seconds
    course_id: 1,
    chapter: 'Advanced Topics',
    order: 4,
    created_by: 1,
    category: 'Frontend Development',
    difficulty_level: 'Advanced',
    is_featured: true,
    status: 'published',
    view_count: 2100,
    instructor_name: 'Sarah Wilson'
  },
  {
    title: 'Docker Containerization',
    description: 'Learn how to containerize applications with Docker',
    video_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    thumbnail: { url: '/images/video-thumbnails/docker-container.jpg' },
    duration: 5420, // 1:30:20 in seconds
    course_id: 1,
    chapter: 'DevOps Tools',
    order: 5,
    created_by: 1,
    category: 'DevOps',
    difficulty_level: 'Intermediate',
    is_featured: false,
    status: 'published',
    view_count: 750,
    instructor_name: 'Alex Brown'
  }
];

async function seedVideos() {
  try {
    console.log('🌱 Seeding video lectures...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Sync database
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized');
    
    // Clear existing videos
    await VideoLecture.destroy({ where: {} });
    console.log('🗑️ Cleared existing video lectures');
    
    // Create sample videos
    for (const video of sampleVideos) {
      await VideoLecture.create(video);
      console.log(`✅ Created video: ${video.title}`);
    }
    
    console.log(`📊 Total videos created: ${sampleVideos.length}`);
    console.log('🎉 Video seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding videos:', error);
  } finally {
    await sequelize.close();
  }
}

seedVideos();
