const { sequelize } = require('../config/database');
const User = require('../models/User');
const Student = require('../models/Student');
const Internship = require('../models/Internship');
const Blog = require('../models/Blog');
const Gallery = require('../models/Gallery');
const VideoLecture = require('../models/VideoLecture');
const Course = require('../models/Course');
const Payment = require('../models/Payment');
const Certificate = require('../models/Certificate');

const initDatabase = async () => {
  try {
    console.log('🔄 Initializing database...');
    
    // Test database connection
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Create all tables
    await sequelize.sync({ force: true });
    console.log('✅ All tables created successfully');
    
    // Create default admin user
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@mindwareindia.com',
      password: 'admin123',
      phone: '9876543210',
      role: 'admin',
      is_active: true,
      is_email_verified: true
    });
    
    console.log('✅ Default admin user created');
    console.log('📧 Email: admin@mindwareindia.com');
    console.log('🔑 Password: admin123');
    
    // Create sample data
    await createSampleData();
    
    console.log('🎉 Database initialization completed successfully!');
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  } finally {
    await sequelize.close();
  }
};

const createSampleData = async () => {
  try {
    console.log('📝 Creating sample data...');
    
    // Create sample students
    const students = await User.bulkCreate([
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
        phone: '9876543211',
        role: 'student',
        is_active: true,
        is_email_verified: true
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'password123',
        phone: '9876543212',
        role: 'student',
        is_active: true,
        is_email_verified: true
      }
    ]);
    
    // Create student records
    for (const student of students) {
      await Student.create({
        user_id: student.id,
        student_id: `STU${student.id.toString().padStart(6, '0')}`,
        profile_data: {
          college: 'Sample College',
          year: '3rd Year',
          branch: 'Computer Science'
        }
      });
    }
    
    // Create sample internships
    await Internship.bulkCreate([
      {
        title: 'Web Development Internship',
        description: 'Learn full-stack web development with React and Node.js',
        short_description: 'Hands-on experience in modern web technologies',
        company: 'Mindware India',
        location: 'Remote',
        type: 'remote',
        duration: 3,
        duration_unit: 'months',
        stipend_amount: 5000,
        stipend_currency: 'INR',
        stipend_type: 'fixed',
        requirements: {
          skills: ['HTML', 'CSS', 'JavaScript', 'React'],
          education: 'B.Tech/B.E',
          experience: '0-1 years'
        },
        responsibilities: [
          'Develop responsive web applications',
          'Work with React and Node.js',
          'Collaborate with team members'
        ],
        benefits: [
          'Certificate of completion',
          'Letter of recommendation',
          'Stipend'
        ],
        application_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        start_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        end_date: new Date(Date.now() + 100 * 24 * 60 * 60 * 1000),
        max_applications: 20,
        status: 'active',
        category: 'web-development',
        tags: ['react', 'nodejs', 'javascript', 'web-development'],
        created_by: 1
      },
      {
        title: 'Data Science Internship',
        description: 'Work on real-world data science projects using Python and ML',
        short_description: 'Gain practical experience in data analysis and machine learning',
        company: 'Mindware India',
        location: 'Hybrid',
        type: 'hybrid',
        duration: 6,
        duration_unit: 'months',
        stipend_amount: 8000,
        stipend_currency: 'INR',
        stipend_type: 'performance-based',
        requirements: {
          skills: ['Python', 'Pandas', 'NumPy', 'Scikit-learn'],
          education: 'B.Tech/B.E/MCA',
          experience: '0-2 years'
        },
        responsibilities: [
          'Analyze large datasets',
          'Build machine learning models',
          'Create data visualizations'
        ],
        benefits: [
          'Certificate of completion',
          'Industry exposure',
          'Performance-based stipend'
        ],
        application_deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        start_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        end_date: new Date(Date.now() + 200 * 24 * 60 * 60 * 1000),
        max_applications: 15,
        status: 'active',
        category: 'data-science',
        tags: ['python', 'machine-learning', 'data-analysis', 'pandas'],
        created_by: 1
      }
    ]);
    
    // Create sample blog posts
    await Blog.bulkCreate([
      {
        title: 'Getting Started with React Development',
        slug: 'getting-started-with-react-development',
        excerpt: 'Learn the fundamentals of React and build your first application',
        content: 'React is a powerful JavaScript library for building user interfaces...',
        author_id: 1,
        category: 'programming',
        tags: ['react', 'javascript', 'frontend', 'tutorial'],
        status: 'published',
        is_featured: true,
        published_at: new Date(),
        reading_time: 5,
        views: 150,
        likes: 25
      },
      {
        title: 'Career Tips for Computer Science Students',
        slug: 'career-tips-for-computer-science-students',
        excerpt: 'Essential advice for CS students to build a successful career',
        content: 'As a computer science student, you have numerous opportunities...',
        author_id: 1,
        category: 'career',
        tags: ['career', 'computer-science', 'advice', 'students'],
        status: 'published',
        is_featured: false,
        published_at: new Date(),
        reading_time: 8,
        views: 89,
        likes: 12
      }
    ]);
    
    // Create sample gallery items
    await Gallery.bulkCreate([
      {
        title: 'Web Development Workshop',
        description: 'Students learning React and Node.js in our workshop',
        images: [
          {
            url: '/images/gallery/workshop-1.jpg',
            alt: 'Workshop session',
            isPrimary: true
          }
        ],
        category: 'workshops',
        event_date: new Date(),
        location: 'Mindware India Office',
        status: 'active',
        is_featured: true,
        created_by: 1
      }
    ]);
    
    console.log('✅ Sample data created successfully');
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    throw error;
  }
};

// Run initialization if this file is executed directly
if (require.main === module) {
  initDatabase()
    .then(() => {
      console.log('🎉 Database initialization completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Database initialization failed:', error);
      process.exit(1);
    });
}

module.exports = { initDatabase };
