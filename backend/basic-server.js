const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const morgan = require('morgan');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('dev'));

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Simple login route for testing
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simple hardcoded admin check
  if (email === 'admin@mindwareindia.com' && password === 'admin123') {
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: 1,
          name: 'Admin User',
          email: 'admin@mindwareindia.com',
          role: 'admin'
        },
        token: 'dummy-token-for-testing'
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

// Simple user verification route
app.get('/api/auth/me', (req, res) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (token === 'dummy-token-for-testing') {
    res.status(200).json({
      success: true,
      data: {
        user: {
          id: 1,
          name: 'Admin User',
          email: 'admin@mindwareindia.com',
          role: 'admin'
        }
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
});

// Admin Dashboard API
app.get('/api/admin/dashboard', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      stats: {
        totalUsers: 156,
        totalInternships: 12,
        totalBlogs: 45,
        totalTestimonials: 28
      },
      recentActivities: [
        { id: 1, type: 'user_registration', message: 'New user registered', time: '2 hours ago' },
        { id: 2, type: 'blog_published', message: 'New blog post published', time: '4 hours ago' },
        { id: 3, type: 'testimonial_added', message: 'New testimonial added', time: '6 hours ago' }
      ]
    }
  });
});

// Internships API
app.get('/api/internships', (req, res) => {
  const { featured, limit = 10 } = req.query;
  
  const internships = [
    {
      id: 1,
      title: 'Web Development Internship',
      description: 'Learn full-stack web development with React and Node.js',
      company: 'Mindware India',
      location: 'Remote',
      type: 'remote',
      duration: 3,
      stipend: 5000,
      status: 'active',
      is_featured: true
    },
    {
      id: 2,
      title: 'Data Science Internship',
      description: 'Work on real-world data science projects using Python and ML',
      company: 'Mindware India',
      location: 'Hybrid',
      type: 'hybrid',
      duration: 6,
      stipend: 8000,
      status: 'active',
      is_featured: true
    }
  ];
  
  let filteredInternships = internships;
  if (featured === 'true') {
    filteredInternships = internships.filter(i => i.is_featured);
  }
  if (limit) {
    filteredInternships = filteredInternships.slice(0, parseInt(limit));
  }
  
  res.status(200).json({
    success: true,
    data: filteredInternships
  });
});

// Videos API
app.get('/api/videos', (req, res) => {
  const { featured, limit = 10 } = req.query;
  
  const videos = [
    {
      _id: 1,
      title: 'React Fundamentals',
      description: 'Learn the basics of React development',
      url: 'https://example.com/video1',
      duration: '2:30:00',
      is_featured: true,
      thumbnail: {
        url: '/images/video-placeholder.jpg'
      },
      views: 1250,
      likes: 89,
      tags: ['React', 'JavaScript', 'Frontend'],
      isFree: true,
      isPreview: false,
      resources: []
    },
    {
      _id: 2,
      title: 'Node.js Backend Development',
      description: 'Build robust backend applications with Node.js',
      url: 'https://example.com/video2',
      duration: '3:15:00',
      is_featured: true,
      thumbnail: {
        url: '/images/video-placeholder.jpg'
      },
      views: 980,
      likes: 67,
      tags: ['Node.js', 'Backend', 'JavaScript'],
      isFree: false,
      isPreview: true,
      resources: []
    }
  ];
  
  let filteredVideos = videos;
  if (featured === 'true') {
    filteredVideos = videos.filter(v => v.is_featured);
  }
  if (limit) {
    filteredVideos = filteredVideos.slice(0, parseInt(limit));
  }
  
  res.status(200).json({
    success: true,
    data: filteredVideos
  });
});

// Testimonials API
app.get('/api/testimonials/active', (req, res) => {
  const testimonials = [
    {
      id: 1,
      client_name: 'John Doe',
      client_designation: 'Software Developer',
      client_company: 'Tech Corp',
      testimonial_text: 'Excellent training program! Helped me land my dream job.',
      rating: 5,
      status: 'active'
    },
    {
      id: 2,
      client_name: 'Jane Smith',
      client_designation: 'Data Analyst',
      client_company: 'Data Inc',
      testimonial_text: 'The internship program was very comprehensive and practical.',
      rating: 5,
      status: 'active'
    }
  ];
  
  res.status(200).json({
    success: true,
    data: testimonials
  });
});

// Blogs API
app.get('/api/blogs', (req, res) => {
  const { featured, limit = 10 } = req.query;
  
  const blogs = [
    {
      id: 1,
      title: 'Getting Started with React Development',
      excerpt: 'Learn the fundamentals of React and build your first application',
      content: 'React is a powerful JavaScript library...',
      author: 'Admin User',
      category: 'programming',
      status: 'published',
      is_featured: true,
      views: 150,
      likes: 25
    },
    {
      id: 2,
      title: 'Career Tips for Computer Science Students',
      excerpt: 'Essential advice for CS students to build a successful career',
      content: 'As a computer science student...',
      author: 'Admin User',
      category: 'career',
      status: 'published',
      is_featured: true,
      views: 89,
      likes: 12
    }
  ];
  
  let filteredBlogs = blogs;
  if (featured === 'true') {
    filteredBlogs = blogs.filter(b => b.is_featured);
  }
  if (limit) {
    filteredBlogs = filteredBlogs.slice(0, parseInt(limit));
  }
  
  res.status(200).json({
    success: true,
    data: filteredBlogs
  });
});

// Gallery API
app.get('/api/gallery', (req, res) => {
  const { featured, limit = 10 } = req.query;
  
  const gallery = [
    {
      id: 1,
      title: 'Web Development Workshop',
      description: 'Students learning React and Node.js in our workshop',
      images: ['/images/gallery/workshop-1.jpg'],
      category: 'workshops',
      is_featured: true,
      status: 'active'
    },
    {
      id: 2,
      title: 'Data Science Training',
      description: 'Hands-on data science training session',
      images: ['/images/gallery/datascience-1.jpg'],
      category: 'training',
      is_featured: true,
      status: 'active'
    }
  ];
  
  let filteredGallery = gallery;
  if (featured === 'true') {
    filteredGallery = gallery.filter(g => g.is_featured);
  }
  if (limit) {
    filteredGallery = filteredGallery.slice(0, parseInt(limit));
  }
  
  res.status(200).json({
    success: true,
    data: filteredGallery
  });
});

// ==================== CRUD ENDPOINTS ====================

// Students CRUD
app.post('/api/students', (req, res) => {
  const { name, email, phone, course, status } = req.body;
  const newStudent = {
    _id: Date.now(),
    name,
    email,
    phone,
    course,
    status: status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.status(201).json({ success: true, data: newStudent });
});

app.put('/api/students/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, course, status } = req.body;
  const updatedStudent = {
    _id: id,
    name,
    email,
    phone,
    course,
    status,
    updatedAt: new Date().toISOString()
  };
  res.status(200).json({ success: true, data: updatedStudent });
});

app.delete('/api/students/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: 'Student deleted successfully' });
});

// Internships CRUD
app.post('/api/internships', (req, res) => {
  const { title, description, duration, requirements, benefits, status } = req.body;
  const newInternship = {
    _id: Date.now(),
    title,
    description,
    duration,
    requirements,
    benefits,
    status: status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.status(201).json({ success: true, data: newInternship });
});

app.put('/api/internships/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, duration, requirements, benefits, status } = req.body;
  const updatedInternship = {
    _id: id,
    title,
    description,
    duration,
    requirements,
    benefits,
    status,
    updatedAt: new Date().toISOString()
  };
  res.status(200).json({ success: true, data: updatedInternship });
});

app.delete('/api/internships/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: 'Internship deleted successfully' });
});

// Blogs CRUD
app.post('/api/blogs', (req, res) => {
  const { title, content, excerpt, author, category, tags, status } = req.body;
  const newBlog = {
    _id: Date.now(),
    title,
    content,
    excerpt,
    author,
    category,
    tags,
    status: status || 'published',
    views: 0,
    likes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.status(201).json({ success: true, data: newBlog });
});

app.put('/api/blogs/:id', (req, res) => {
  const { id } = req.params;
  const { title, content, excerpt, author, category, tags, status } = req.body;
  const updatedBlog = {
    _id: id,
    title,
    content,
    excerpt,
    author,
    category,
    tags,
    status,
    updatedAt: new Date().toISOString()
  };
  res.status(200).json({ success: true, data: updatedBlog });
});

app.delete('/api/blogs/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: 'Blog deleted successfully' });
});

// Testimonials CRUD
app.post('/api/testimonials', (req, res) => {
  const { name, position, company, content, rating, status } = req.body;
  const newTestimonial = {
    _id: Date.now(),
    name,
    position,
    company,
    content,
    rating: rating || 5,
    status: status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.status(201).json({ success: true, data: newTestimonial });
});

app.put('/api/testimonials/:id', (req, res) => {
  const { id } = req.params;
  const { name, position, company, content, rating, status } = req.body;
  const updatedTestimonial = {
    _id: id,
    name,
    position,
    company,
    content,
    rating,
    status,
    updatedAt: new Date().toISOString()
  };
  res.status(200).json({ success: true, data: updatedTestimonial });
});

app.delete('/api/testimonials/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
});

// Gallery CRUD
app.post('/api/gallery', (req, res) => {
  const { title, description, imageUrl, category, tags, status } = req.body;
  const newGalleryItem = {
    _id: Date.now(),
    title,
    description,
    imageUrl,
    category,
    tags,
    status: status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.status(201).json({ success: true, data: newGalleryItem });
});

app.put('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, imageUrl, category, tags, status } = req.body;
  const updatedGalleryItem = {
    _id: id,
    title,
    description,
    imageUrl,
    category,
    tags,
    status,
    updatedAt: new Date().toISOString()
  };
  res.status(200).json({ success: true, data: updatedGalleryItem });
});

app.delete('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: 'Gallery item deleted successfully' });
});

// Videos CRUD
app.post('/api/videos', (req, res) => {
  const { title, description, url, duration, thumbnail, tags, isFree, isPreview, status } = req.body;
  const newVideo = {
    _id: Date.now(),
    title,
    description,
    url,
    duration,
    thumbnail,
    tags,
    isFree: isFree || false,
    isPreview: isPreview || false,
    status: status || 'active',
    views: 0,
    likes: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.status(201).json({ success: true, data: newVideo });
});

app.put('/api/videos/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, url, duration, thumbnail, tags, isFree, isPreview, status } = req.body;
  const updatedVideo = {
    _id: id,
    title,
    description,
    url,
    duration,
    thumbnail,
    tags,
    isFree,
    isPreview,
    status,
    updatedAt: new Date().toISOString()
  };
  res.status(200).json({ success: true, data: updatedVideo });
});

app.delete('/api/videos/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: 'Video deleted successfully' });
});

// Banners CRUD
app.post('/api/banners', (req, res) => {
  const { title, description, imageUrl, link, position, status } = req.body;
  const newBanner = {
    _id: Date.now(),
    title,
    description,
    imageUrl,
    link,
    position,
    status: status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.status(201).json({ success: true, data: newBanner });
});

app.put('/api/banners/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, imageUrl, link, position, status } = req.body;
  const updatedBanner = {
    _id: id,
    title,
    description,
    imageUrl,
    link,
    position,
    status,
    updatedAt: new Date().toISOString()
  };
  res.status(200).json({ success: true, data: updatedBanner });
});

app.delete('/api/banners/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: 'Banner deleted successfully' });
});

// Users CRUD
app.post('/api/users', (req, res) => {
  const { name, email, role, status } = req.body;
  const newUser = {
    _id: Date.now(),
    name,
    email,
    role: role || 'user',
    status: status || 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  res.status(201).json({ success: true, data: newUser });
});

app.put('/api/users/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, role, status } = req.body;
  const updatedUser = {
    _id: id,
    name,
    email,
    role,
    status,
    updatedAt: new Date().toISOString()
  };
  res.status(200).json({ success: true, data: updatedUser });
});

app.delete('/api/users/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: 'User deleted successfully' });
});

// Enrollment CRUD
app.get('/api/enrollments', (req, res) => {
  const { page = 1, limit = 10, search, status } = req.query;
  
  // Mock data for enrollments
  const mockEnrollments = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      phone: '+91-9876543210',
      courseInterest: 'web-development',
      trainingMode: 'online',
      status: 'pending',
      paymentStatus: 'pending',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      phone: '+91-9876543211',
      courseInterest: 'data-science',
      trainingMode: 'offline',
      status: 'approved',
      paymentStatus: 'completed',
      createdAt: new Date().toISOString()
    }
  ];
  
  res.status(200).json({
    success: true,
    count: mockEnrollments.length,
    pages: 1,
    currentPage: parseInt(page),
    data: mockEnrollments
  });
});

app.get('/api/enrollments/:id', (req, res) => {
  const { id } = req.params;
  const enrollment = {
    id: parseInt(id),
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+91-9876543210',
    dateOfBirth: '1995-01-01',
    gender: 'male',
    address: '123 Main Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    country: 'India',
    highestQualification: 'bachelor',
    institution: 'Mumbai University',
    yearOfPassing: 2017,
    percentage: '85%',
    courseInterest: 'web-development',
    preferredBatch: 'evening',
    trainingMode: 'online',
    experience: '1-2',
    motivation: 'I want to learn web development to advance my career',
    careerGoals: 'Become a full-stack developer',
    paymentMode: 'online',
    paymentAmount: 25000,
    paymentStatus: 'pending',
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  res.status(200).json({ success: true, data: enrollment });
});

app.post('/api/enrollments', (req, res) => {
  const enrollmentData = req.body;
  const newEnrollment = {
    id: Date.now(),
    ...enrollmentData,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    message: 'Enrollment created successfully',
    data: newEnrollment
  });
});

app.put('/api/enrollments/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const updatedEnrollment = {
    id: parseInt(id),
    ...updateData,
    updatedAt: new Date().toISOString()
  };
  
  res.status(200).json({
    success: true,
    message: 'Enrollment updated successfully',
    data: updatedEnrollment
  });
});

app.patch('/api/enrollments/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  res.status(200).json({
    success: true,
    message: 'Enrollment status updated successfully',
    data: { id: parseInt(id), status }
  });
});

app.delete('/api/enrollments/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: 'Enrollment deleted successfully' });
});

app.get('/api/enrollments/stats', (req, res) => {
  const stats = {
    total: 150,
    pending: 25,
    approved: 80,
    enrolled: 40,
    completed: 5,
    byCourse: [
      { courseInterest: 'web-development', count: 45 },
      { courseInterest: 'data-science', count: 30 },
      { courseInterest: 'mobile-development', count: 25 },
      { courseInterest: 'cybersecurity', count: 20 },
      { courseInterest: 'cloud-computing', count: 15 },
      { courseInterest: 'other', count: 15 }
    ],
    monthly: [
      { month: '2024-01', count: 12 },
      { month: '2024-02', count: 18 },
      { month: '2024-03', count: 25 },
      { month: '2024-04', count: 22 },
      { month: '2024-05', count: 30 },
      { month: '2024-06', count: 28 },
      { month: '2024-07', count: 35 },
      { month: '2024-08', count: 32 },
      { month: '2024-09', count: 28 }
    ]
  };
  
  res.status(200).json({ success: true, data: stats });
});

app.get('/api/enrollments/search', (req, res) => {
  const { q, page = 1, limit = 10 } = req.query;
  
  res.status(200).json({
    success: true,
    count: 0,
    pages: 0,
    currentPage: parseInt(page),
    data: []
  });
});

app.get('/api/enrollments/recent', (req, res) => {
  const { limit = 10 } = req.query;
  
  const recentEnrollments = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      courseInterest: 'web-development',
      status: 'pending',
      createdAt: new Date().toISOString()
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@example.com',
      courseInterest: 'data-science',
      status: 'approved',
      createdAt: new Date().toISOString()
    }
  ];
  
  res.status(200).json({ success: true, data: recentEnrollments });
});

app.patch('/api/enrollments/bulk-update', (req, res) => {
  const { ids, data } = req.body;
  
  res.status(200).json({
    success: true,
    message: `${ids.length} enrollments updated successfully`
  });
});

app.delete('/api/enrollments/bulk-delete', (req, res) => {
  const { ids } = req.body;
  
  res.status(200).json({
    success: true,
    message: `${ids.length} enrollments deleted successfully`
  });
});

// Gallery CRUD
app.get('/api/gallery', (req, res) => {
  const { page = 1, limit = 10, search, category, status } = req.query;
  
  // Mock data for gallery
  const mockGallery = [
    {
      id: 1,
      title: 'Web Development Workshop',
      description: 'Students learning modern web development techniques',
      category: 'training',
      subcategory: 'workshop',
      images: [
        { url: '/images/gallery/workshop1.jpg', name: 'workshop1.jpg' },
        { url: '/images/gallery/workshop2.jpg', name: 'workshop2.jpg' }
      ],
      event_date: '2024-01-15T10:00:00Z',
      location: 'Mumbai Office',
      status: 'active',
      is_featured: true,
      is_public: true,
      views: 150,
      likes: 25,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Student Success Stories',
      description: 'Our graduates achieving their career goals',
      category: 'students',
      subcategory: 'success',
      images: [
        { url: '/images/gallery/success1.jpg', name: 'success1.jpg' }
      ],
      event_date: '2024-01-10T14:00:00Z',
      location: 'Online',
      status: 'active',
      is_featured: false,
      is_public: true,
      views: 89,
      likes: 12,
      created_at: new Date().toISOString()
    }
  ];
  
  res.status(200).json({
    success: true,
    count: mockGallery.length,
    pages: 1,
    currentPage: parseInt(page),
    data: mockGallery
  });
});

app.get('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  const gallery = {
    id: parseInt(id),
    title: 'Web Development Workshop',
    description: 'Students learning modern web development techniques',
    category: 'training',
    subcategory: 'workshop',
    images: [
      { url: '/images/gallery/workshop1.jpg', name: 'workshop1.jpg' },
      { url: '/images/gallery/workshop2.jpg', name: 'workshop2.jpg' }
    ],
    event_date: '2024-01-15T10:00:00Z',
    location: 'Mumbai Office',
    status: 'active',
    is_featured: true,
    is_public: true,
    views: 150,
    likes: 25,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  res.status(200).json({ success: true, data: gallery });
});

app.post('/api/gallery', (req, res) => {
  const galleryData = req.body;
  const newGallery = {
    id: Date.now(),
    ...galleryData,
    status: 'active',
    is_featured: false,
    is_public: true,
    views: 0,
    likes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    message: 'Gallery item created successfully',
    data: newGallery
  });
});

app.put('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const updatedGallery = {
    id: parseInt(id),
    ...updateData,
    updated_at: new Date().toISOString()
  };
  
  res.status(200).json({
    success: true,
    message: 'Gallery item updated successfully',
    data: updatedGallery
  });
});

app.delete('/api/gallery/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: 'Gallery item deleted successfully' });
});

app.get('/api/gallery/stats', (req, res) => {
  const stats = {
    total: 45,
    active: 38,
    featured: 12,
    byCategory: [
      { category: 'training', count: 15 },
      { category: 'events', count: 12 },
      { category: 'students', count: 8 },
      { category: 'workshops', count: 6 },
      { category: 'other', count: 4 }
    ]
  };
  
  res.status(200).json({ success: true, data: stats });
});

// Banners CRUD
app.get('/api/banners', (req, res) => {
  const { page = 1, limit = 10, search, type, status } = req.query;
  
  // Mock data for banners
  const mockBanners = [
    {
      banner_id: 1,
      title: 'Welcome to Mindware India',
      subtitle: 'Transform Your Career with Our Courses',
      description: 'Join thousands of students who have successfully launched their tech careers',
      image_url: '/images/banners/hero-banner.jpg',
      button_text: 'Get Started',
      button_url: '/courses',
      banner_type: 'hero',
      banner_position: 1,
      is_active: true,
      start_date: '2024-01-01T00:00:00Z',
      end_date: '2024-12-31T23:59:59Z',
      created_at: new Date().toISOString()
    },
    {
      banner_id: 2,
      title: 'About Our Mission',
      subtitle: 'Empowering Future Developers',
      description: 'We are committed to providing quality education and career guidance',
      image_url: '/images/banners/about-banner.jpg',
      button_text: 'Learn More',
      button_url: '/about',
      banner_type: 'about',
      banner_position: 2,
      is_active: true,
      created_at: new Date().toISOString()
    }
  ];
  
  res.status(200).json({
    success: true,
    count: mockBanners.length,
    pages: 1,
    currentPage: parseInt(page),
    data: mockBanners
  });
});

app.get('/api/banners/:id', (req, res) => {
  const { id } = req.params;
  const banner = {
    banner_id: parseInt(id),
    title: 'Welcome to Mindware India',
    subtitle: 'Transform Your Career with Our Courses',
    description: 'Join thousands of students who have successfully launched their tech careers',
    image_url: '/images/banners/hero-banner.jpg',
    button_text: 'Get Started',
    button_url: '/courses',
    banner_type: 'hero',
    banner_position: 1,
    is_active: true,
    start_date: '2024-01-01T00:00:00Z',
    end_date: '2024-12-31T23:59:59Z',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  res.status(200).json({ success: true, data: banner });
});

app.post('/api/banners', (req, res) => {
  const bannerData = req.body;
  const newBanner = {
    banner_id: Date.now(),
    ...bannerData,
    is_active: true,
    banner_position: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    message: 'Banner created successfully',
    data: newBanner
  });
});

app.put('/api/banners/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const updatedBanner = {
    banner_id: parseInt(id),
    ...updateData,
    updated_at: new Date().toISOString()
  };
  
  res.status(200).json({
    success: true,
    message: 'Banner updated successfully',
    data: updatedBanner
  });
});

app.delete('/api/banners/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: 'Banner deleted successfully' });
});

app.get('/api/banners/stats', (req, res) => {
  const stats = {
    total: 8,
    active: 6,
    byType: [
      { type: 'hero', count: 2 },
      { type: 'about', count: 2 },
      { type: 'service', count: 2 },
      { type: 'testimonial', count: 1 },
      { type: 'contact', count: 1 }
    ]
  };
  
  res.status(200).json({ success: true, data: stats });
});

// Testimonials CRUD
app.get('/api/testimonials', (req, res) => {
  const { page = 1, limit = 10, search, course, status } = req.query;
  
  // Mock data for testimonials
  const mockTestimonials = [
    {
      testimonial_id: 1,
      client_name: 'John Doe',
      client_designation: 'Software Developer',
      client_company: 'Tech Corp',
      course: 'web-development',
      testimonial_text: 'The course was excellent and helped me land my dream job. The instructors were knowledgeable and supportive throughout the learning journey.',
      client_image: '/images/testimonials/john-doe.jpg',
      success_metrics: {
        projects: '5',
        duration: '6 months',
        outcome: 'Got job at Tech Corp'
      },
      testimonial_rating: 5,
      testimonial_status: '1',
      testimonial_order: 1,
      created_at: new Date().toISOString()
    },
    {
      testimonial_id: 2,
      client_name: 'Jane Smith',
      client_designation: 'Data Scientist',
      client_company: 'Data Inc',
      course: 'data-science',
      testimonial_text: 'Amazing learning experience! The practical approach and real-world projects made all the difference in my career transition.',
      client_image: '/images/testimonials/jane-smith.jpg',
      success_metrics: {
        projects: '8',
        duration: '4 months',
        outcome: 'Salary increased by 150%'
      },
      testimonial_rating: 5,
      testimonial_status: '1',
      testimonial_order: 2,
      created_at: new Date().toISOString()
    }
  ];
  
  res.status(200).json({
    success: true,
    count: mockTestimonials.length,
    pages: 1,
    currentPage: parseInt(page),
    data: mockTestimonials
  });
});

app.get('/api/testimonials/:id', (req, res) => {
  const { id } = req.params;
  const testimonial = {
    testimonial_id: parseInt(id),
    client_name: 'John Doe',
    client_designation: 'Software Developer',
    client_company: 'Tech Corp',
    course: 'web-development',
    testimonial_text: 'The course was excellent and helped me land my dream job. The instructors were knowledgeable and supportive throughout the learning journey.',
    client_image: '/images/testimonials/john-doe.jpg',
    success_metrics: {
      projects: '5',
      duration: '6 months',
      outcome: 'Got job at Tech Corp'
    },
    testimonial_rating: 5,
    testimonial_status: '1',
    testimonial_order: 1,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  res.status(200).json({ success: true, data: testimonial });
});

app.post('/api/testimonials', (req, res) => {
  const testimonialData = req.body;
  const newTestimonial = {
    testimonial_id: Date.now(),
    ...testimonialData,
    testimonial_rating: 5,
    testimonial_status: '1',
    testimonial_order: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  res.status(201).json({
    success: true,
    message: 'Testimonial created successfully',
    data: newTestimonial
  });
});

app.put('/api/testimonials/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  const updatedTestimonial = {
    testimonial_id: parseInt(id),
    ...updateData,
    updated_at: new Date().toISOString()
  };
  
  res.status(200).json({
    success: true,
    message: 'Testimonial updated successfully',
    data: updatedTestimonial
  });
});

app.delete('/api/testimonials/:id', (req, res) => {
  const { id } = req.params;
  res.status(200).json({ success: true, message: 'Testimonial deleted successfully' });
});

app.get('/api/testimonials/stats', (req, res) => {
  const stats = {
    total: 25,
    active: 22,
    averageRating: 4.8,
    byCourse: [
      { course: 'web-development', count: 10 },
      { course: 'data-science', count: 8 },
      { course: 'mobile-development', count: 4 },
      { course: 'cybersecurity', count: 3 }
    ]
  };
  
  res.status(200).json({ success: true, data: stats });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`🚀 Basic Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔐 Admin login: admin@mindwareindia.com / admin123`);
});
