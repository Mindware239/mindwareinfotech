const { sequelize } = require('./config/database');
const Course = require('./models/Course');

async function testCourseDatabase() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully!');

    // Check if courses table exists and has data
    const courseCount = await Course.count();
    console.log(`Total courses in database: ${courseCount}`);

    if (courseCount === 0) {
      console.log('No courses found. Creating a test course...');
      
      const testCourse = await Course.create({
        title: 'Web Development Fundamentals',
        description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
        short_description: 'Complete web development course for beginners',
        instructor_id: 1,
        category: 'web-development',
        level: 'beginner',
        duration: 40,
        price: 5000,
        is_free: false,
        status: 'published',
        language: 'English',
        requirements: ['Basic computer knowledge', 'No programming experience required'],
        learning_outcomes: ['Build responsive websites', 'Understand HTML and CSS', 'Write JavaScript code'],
        skills: ['HTML', 'CSS', 'JavaScript', 'Responsive Design']
      });

      console.log('Test course created successfully:', testCourse.toJSON());
    } else {
      console.log('Fetching existing courses...');
      const courses = await Course.findAll({
        limit: 5,
        order: [['created_at', 'DESC']]
      });
      
      courses.forEach((course, index) => {
        console.log(`${index + 1}. ${course.title} (${course.category}) - ${course.status}`);
      });
    }

  } catch (error) {
    console.error('Error testing course database:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

testCourseDatabase();
