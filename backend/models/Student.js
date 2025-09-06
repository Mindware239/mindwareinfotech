const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Student = sequelize.define('Student', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  student_id: {
    type: DataTypes.STRING(20),
    allowNull: false,
    unique: true
  },
  applications: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  enrolled_courses: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  profile_data: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  },
  achievements: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  last_activity: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'students',
  hooks: {
    beforeCreate: async (student) => {
      if (!student.student_id) {
        const count = await Student.count();
        student.student_id = `STU${String(count + 1).padStart(6, '0')}`;
      }
    }
  }
});

// Instance methods
Student.prototype.getApplicationStatus = function(internshipId) {
  const applications = this.applications || [];
  const application = applications.find(app => 
    app.internship_id === internshipId
  );
  return application ? application.status : null;
};

Student.prototype.isEnrolledInCourse = function(courseId) {
  const enrolledCourses = this.enrolled_courses || [];
  return enrolledCourses.some(enrollment => 
    enrollment.course_id === courseId && 
    enrollment.status !== 'dropped'
  );
};

Student.prototype.getCourseProgress = function(courseId) {
  const enrolledCourses = this.enrolled_courses || [];
  const enrollment = enrolledCourses.find(enrollment => 
    enrollment.course_id === courseId
  );
  return enrollment ? enrollment.progress : 0;
};

module.exports = Student;