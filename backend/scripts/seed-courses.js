const { sequelize } = require('../config/database');
const Course = require('../models/Course');

const sampleCourses = [
  {
    title: 'Full Stack Web Development',
    description: 'Complete course covering frontend and backend development with modern technologies including React, Node.js, and databases.',
    short_description: 'Master full-stack development with React, Node.js, and modern tools',
    category: 'Web Development',
    level: 'Beginner to Intermediate',
    duration: '6 months',
    price: 25000,
    discount_price: 20000,
    language: 'English',
    instructor: 'John Doe',
    instructor_id: 1,
    rating: 4.8,
    students_count: 150,
    is_featured: true,
    status: 'active',
    thumbnail: { url: '/images/courses/fullstack.jpg' },
    curriculum: [
      { title: 'HTML & CSS Fundamentals', duration: '2 weeks' },
      { title: 'JavaScript Basics', duration: '3 weeks' },
      { title: 'React Development', duration: '4 weeks' },
      { title: 'Node.js Backend', duration: '4 weeks' },
      { title: 'Database Design', duration: '2 weeks' },
      { title: 'Project Development', duration: '3 weeks' }
    ],
    requirements: [
      'Basic computer knowledge',
      'No prior programming experience required',
      'Dedication to learn and practice'
    ],
    what_you_will_learn: [
      'Build responsive web applications',
      'Master React and modern JavaScript',
      'Create RESTful APIs with Node.js',
      'Design and implement databases',
      'Deploy applications to the cloud'
    ]
  }
];

async function seedCourses() {
  try {
    console.log('🌱 Seeding courses...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');
    
    // Sync database
    await sequelize.sync({ force: false });
    console.log('✅ Database synchronized');
    
    // Clear existing courses
    await Course.destroy({ where: {} });
    console.log('🗑️ Cleared existing courses');
    
    // Create sample courses
    for (const course of sampleCourses) {
      await Course.create(course);
      console.log(`✅ Created course: ${course.title}`);
    }
    
    console.log(`📊 Total courses created: ${sampleCourses.length}`);
    console.log('🎉 Course seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding courses:', error);
  } finally {
    await sequelize.close();
  }
}

seedCourses();
