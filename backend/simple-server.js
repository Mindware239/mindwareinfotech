const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Banners route
app.get('/api/banners', (req, res) => {
  res.json({
    success: true,
    count: 3,
    pages: 1,
    currentPage: 1,
    data: [
      {
        banner_id: 1,
        title: 'Welcome to Mindware Infotech',
        subtitle: 'Complete Software Solutions & Training',
        description: 'We provide comprehensive software development services and professional training programs.',
        image_url: '/uploads/banners/banner-1757329778616-249422715.jpg',
        button_text: 'Get Started',
        button_url: 'https://mindwareinfotech.com',
        banner_type: 'hero',
        banner_position: 1,
        is_active: true,
        created_at: '2025-09-08T11:09:38.000Z',
        updated_at: '2025-09-08T11:09:38.000Z'
      },
      {
        banner_id: 2,
        title: 'Professional Training Programs',
        subtitle: 'Learn from Industry Experts',
        description: 'Our comprehensive training programs cover the latest technologies.',
        image_url: '/uploads/banners/training-banner.jpg',
        button_text: 'View Courses',
        button_url: 'https://mindwareinfotech.com/courses',
        banner_type: 'service',
        banner_position: 2,
        is_active: true,
        created_at: '2025-09-08T11:15:02.000Z',
        updated_at: '2025-09-08T11:15:02.000Z'
      },
      {
        banner_id: 3,
        title: 'Internship Opportunities',
        subtitle: 'Gain Real-World Experience',
        description: 'Join our internship program and work on real projects.',
        image_url: '/uploads/banners/internship-banner.jpg',
        button_text: 'Apply Now',
        button_url: 'https://mindwareinfotech.com/internships',
        banner_type: 'about',
        banner_position: 3,
        is_active: true,
        created_at: '2025-09-08T11:15:02.000Z',
        updated_at: '2025-09-08T11:15:02.000Z'
      }
    ]
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Simple server running on port ${PORT}`);
  console.log(`📡 Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`📋 Banners endpoint: http://localhost:${PORT}/api/banners`);
});
