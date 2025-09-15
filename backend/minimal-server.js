const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { connectDB } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!', timestamp: new Date().toISOString() });
});

// Course categories routes (without associations for now)
app.get('/api/course-categories/active', async (req, res) => {
  try {
    // Return mock data for now
    const categories = [
      {
        id: 1,
        name: 'Web Development',
        slug: 'web-development',
        description: 'Learn modern web development technologies',
        icon: 'fas fa-laptop-code',
        color: '#3B82F6',
        is_active: true,
        sort_order: 1
      },
      {
        id: 2,
        name: 'Mobile Development',
        slug: 'mobile-development',
        description: 'Build mobile applications for iOS and Android',
        icon: 'fas fa-mobile-alt',
        color: '#10B981',
        is_active: true,
        sort_order: 2
      }
    ];
    res.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Courses route
app.get('/api/courses', async (req, res) => {
  try {
    // Return mock data for now
    const courses = [
      {
        id: 1,
        title: 'Complete Web Development Course',
        description: 'Learn full-stack web development from scratch',
        short_description: 'Master HTML, CSS, JavaScript, React, and Node.js',
        price: 15000,
        original_price: 20000,
        discount_percentage: 25,
        currency: 'INR',
        is_free: false,
        level: 'beginner',
        duration: 120,
        skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js'],
        learning_outcomes: ['Build responsive websites', 'Create web applications', 'Deploy to production'],
        status: 'published',
        category_id: 1
      },
      {
        id: 2,
        title: 'Advanced React Development',
        description: 'Master React.js with advanced concepts and patterns',
        short_description: 'Learn React hooks, context, state management, and testing',
        price: 12000,
        original_price: 15000,
        discount_percentage: 20,
        currency: 'INR',
        is_free: false,
        level: 'intermediate',
        duration: 80,
        skills: ['React', 'Redux', 'Testing', 'Performance'],
        learning_outcomes: ['Build complex React apps', 'Implement state management', 'Write tests'],
        status: 'published',
        category_id: 1
      }
    ];
    res.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    console.log('✅ Database connected successfully');
    
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 API available at http://localhost:${PORT}/api`);
      console.log(`🔗 Test endpoint: http://localhost:${PORT}/api/test`);
    });
  } catch (error) {
    console.error('❌ Server startup error:', error);
    process.exit(1);
  }
};

startServer();
