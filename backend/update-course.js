const { sequelize } = require('./config/database');
const Course = require('./models/Course');

async function updateCourse() {
  try {
    console.log('Connecting to database...');
    await sequelize.authenticate();
    console.log('Database connected successfully!');

    // Find the existing course
    const course = await Course.findOne();
    if (course) {
      console.log('Found course:', course.title);
      
      // Update the course with proper data
      await course.update({
        category: 'web-development',
        status: 'published',
        level: 'beginner',
        duration: 40,
        price: 5000,
        is_free: false,
        language: 'English',
        short_description: 'Complete full stack web development course',
        requirements: ['Basic computer knowledge'],
        learning_outcomes: ['Build full stack applications'],
        skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js']
      });
      
      console.log('Course updated successfully!');
    } else {
      console.log('No course found to update');
    }

  } catch (error) {
    console.error('Error updating course:', error);
  } finally {
    await sequelize.close();
    console.log('Database connection closed.');
  }
}

updateCourse();
