const { sequelize } = require('./config/database');
const Course = require('./models/Course');

async function testCourses() {
  try {
    console.log('Testing database connection...');
    await sequelize.authenticate();
    console.log('Database connection successful!');

    console.log('Testing Course model...');
    
    // Try to sync the Course model
    await Course.sync({ force: false });
    console.log('Course model synced successfully!');

    // Try to create a test course
    console.log('Creating test course...');
    const testCourse = await Course.create({
      title: 'Test Course',
      description: 'This is a test course',
      short_description: 'Test course description',
      instructor_id: 1,
      category: 'web-development',
      level: 'beginner',
      duration: 10,
      price: 1000,
      is_free: false,
      status: 'draft',
      language: 'English'
    });
    console.log('Test course created:', testCourse.toJSON());

    // Try to fetch all courses
    console.log('Fetching all courses...');
    const courses = await Course.findAll();
    console.log('Found courses:', courses.length);
    courses.forEach(course => {
      console.log(`- ${course.title} (${course.category})`);
    });

  } catch (error) {
    console.error('Error testing courses:', error);
  } finally {
    await sequelize.close();
  }
}

testCourses();
