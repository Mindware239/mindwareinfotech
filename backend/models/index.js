const { sequelize } = require('../config/database');

// Import all models
const User = require('./User');
const Course = require('./Course');
const CourseCategory = require('./CourseCategory');
const Enrollment = require('./Enrollment');
const Certificate = require('./Certificate');
const Payment = require('./Payment');
const Student = require('./Student');
const VideoLecture = require('./VideoLecture');
const VideoAccess = require('./VideoAccess');
const Blog = require('./Blog');
const Testimonial = require('./Testimonial');
const Gallery = require('./Gallery');
const Internship = require('./Internship');
const Job = require('./Job');
const JobApplication = require('./JobApplication');
const Banner = require('./Banner');
const FAQ = require('./FAQ');
const TrainingProgram = require('./TrainingProgram');

// Define associations
const models = {
  User,
  Course,
  CourseCategory,
  Enrollment,
  Certificate,
  Payment,
  Student,
  VideoLecture,
  VideoAccess,
  Blog,
  Testimonial,
  Gallery,
  Internship,
  Job,
  JobApplication,
  Banner,
  FAQ,
  TrainingProgram
};

// Set up associations - only call once
try {
  Object.keys(models).forEach(modelName => {
    if (models[modelName].associate) {
      models[modelName].associate(models);
    }
  });
  console.log('✅ All model associations set up successfully');
} catch (error) {
  console.error('❌ Error setting up associations:', error.message);
}

module.exports = {
  sequelize,
  ...models
};
