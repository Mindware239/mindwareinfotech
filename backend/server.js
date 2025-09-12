const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { Op } = require('sequelize');
require('dotenv').config();

const { connectDB } = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Import models
const Gallery = require('./models/Gallery');
const Blog = require('./models/Blog');
const Testimonial = require('./models/Testimonial');
const Internship = require('./models/Internship');
const VideoLecture = require('./models/VideoLecture');
const Job = require('./models/Job');
const JobApplication = require('./models/JobApplication');
const Banner = require('./models/Banner');
const Course = require('./models/Course');

// Import routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const galleryRoutes = require('./routes/gallery');
const internshipRoutes = require('./routes/internships');
const studentRoutes = require('./routes/students');
const paymentRoutes = require('./routes/payments');
const videoRoutes = require('./routes/videos');
const adminRoutes = require('./routes/admin');
const certificateRoutes = require('./routes/certificates');
const testimonialRoutes = require('./routes/testimonialRoutes');
const jobRoutes = require('./routes/jobs');
const bannerRoutes = require('./routes/banners');
const notificationRoutes = require('./routes/notifications');
const courseRoutes = require('./routes/courses');
const enrollmentRoutes = require('./routes/enrollments');
const faqRoutes = require('./routes/faqs');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "http:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "http://localhost:5000", "http://localhost:3000", "ws://localhost:3000"]
    }
  }
}));

// CORS configuration - More permissive for images
app.use(cors({
  origin: true, // Allow all origins for images
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Serve static files from uploads directory with CORS headers
app.use('/uploads', (req, res, next) => {
  // Set CORS headers for images
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'false'); // Changed to false for images
  res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  
  // Set cache headers for images
  res.header('Cache-Control', 'public, max-age=31536000');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  next();
}, express.static(path.join(__dirname, 'uploads')));

// Additional image serving route for better CORS handling
app.get('/uploads/*', (req, res) => {
  const filePath = path.join(__dirname, req.path);
  
  // Set CORS headers for images
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  res.header('Access-Control-Allow-Credentials', 'false');
  res.header('Access-Control-Expose-Headers', 'Content-Length, Content-Type');
  res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  res.header('Cache-Control', 'public, max-age=31536000');
  
  // Check if file exists
  if (fs.existsSync(filePath)) {
    res.sendFile(filePath);
  } else {
    res.status(404).json({ error: 'Image not found' });
  }
});

// Mount routes
app.use('/api/auth', authRoutes);
// Temporarily disable admin routes authentication for testing
// app.use('/api/admin', adminRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/faqs', faqRoutes);

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine upload path based on the route
    let uploadPath = 'uploads/';
    if (req.originalUrl.includes('/gallery')) {
      uploadPath = 'uploads/gallery/';
    } else if (req.originalUrl.includes('/banners')) {
      uploadPath = 'uploads/banners/';
    }
    
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Mindware India API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Test endpoint to verify server is working
app.get('/api/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Test endpoint is working',
    timestamp: new Date().toISOString()
  });
});

// Authentication routes (simple implementation)
app.post('/api/auth/login', (req, res) => {
  try {
    console.log('POST /api/auth/login');
    console.log('Body:', req.body);
    
    const { email, password } = req.body;
    
    // Simple authentication for admin
    if (email === 'admin@mindwareindia.com' && password === 'admin123') {
      const user = {
        id: 1,
        name: 'Admin User',
        email: 'admin@mindwareindia.com',
        role: 'admin'
      };
      
      // Generate a simple token (in real app, use JWT)
      const token = 'admin-token-' + Date.now();
      
      res.json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token
        }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
});

app.get('/api/auth/me', (req, res) => {
  try {
    console.log('GET /api/auth/me');
    
    // Simple user check (in real app, verify JWT token)
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token && token.startsWith('admin-token-')) {
      const user = {
        id: 1,
        name: 'Admin User',
        email: 'admin@mindwareindia.com',
        role: 'admin'
      };
      
      res.json({
        success: true,
        data: { user }
      });
    } else {
      res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }
  } catch (error) {
    console.error('Error checking auth:', error);
    res.status(500).json({
      success: false,
      message: 'Auth check failed',
      error: error.message
    });
  }
});

app.post('/api/auth/logout', (req, res) => {
  try {
    console.log('POST /api/auth/logout');
    
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Error during logout:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed',
      error: error.message
    });
  }
});

// Test database connection
app.get('/api/test-db', async (req, res) => {
  try {
    console.log('Testing database connection...');
    const testQuery = await Gallery.findOne();
    res.json({
      success: true,
      message: 'Database connection successful',
      data: testQuery
    });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message
    });
  }
});

// Admin dashboard endpoint (temporarily without auth for testing)
app.get('/api/admin/dashboard', async (req, res) => {
  try {
    console.log('GET /api/admin/dashboard - Fetching dashboard data');
    
    // Get counts from all tables
    const [
      totalStudents,
      totalBlogs,
      totalInternships,
      totalGalleryItems,
      totalTestimonials,
      totalVideos
    ] = await Promise.all([
      // Student.count(), // Comment out if Student model doesn't exist
      Promise.resolve(0), // Placeholder for students
      Blog.count(),
      Internship.count(),
      Gallery.count(),
      Testimonial.count(),
      VideoLecture.count()
    ]);

    // Calculate total revenue (placeholder)
    const totalRevenue = 1250000; // Placeholder value

    res.json({
      success: true,
      data: {
        stats: {
          totalStudents,
          totalBlogs,
          totalInternships,
          totalGalleryItems,
          totalTestimonials,
          totalVideos,
          totalRevenue
        },
        recentActivity: [
          {
            id: 1,
            type: 'gallery',
            message: 'New gallery item added',
            timestamp: new Date().toISOString()
          },
          {
            id: 2,
            type: 'blog',
            message: 'New blog post published',
            timestamp: new Date().toISOString()
          }
        ]
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: error.message
    });
  }
});

// Check gallery data
app.get('/api/check-gallery-data', async (req, res) => {
  try {
    const galleries = await Gallery.findAll();
    console.log('All gallery items:', galleries.map(g => ({
      id: g.id,
      title: g.title,
      is_featured: g.is_featured,
      status: g.status,
      images: g.images
    })));
    
    res.json({
      success: true,
      count: galleries.length,
      galleries: galleries.map(g => ({
        id: g.id,
        title: g.title,
        is_featured: g.is_featured,
        status: g.status,
        images: g.images
      }))
    });
  } catch (error) {
    console.error('Error checking gallery data:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking gallery data',
      error: error.message
    });
  }
});

// Create sample testimonials with images
app.get('/api/create-sample-testimonials', async (req, res) => {
  try {
    console.log('Creating sample testimonials...');
    
    // Check if testimonials already exist
    const existingCount = await Testimonial.count();
    if (existingCount > 0) {
      return res.json({
        success: true,
        message: 'Testimonials already exist',
        count: existingCount
      });
    }
    
    // Create sample testimonials
    const testimonialData = [
      {
        client_name: 'John Doe',
        client_designation: 'Software Engineer',
        client_company: 'Tech Corp',
        testimonial_text: 'The training program at Mindware India was exceptional. I learned so much and got placed in a great company. The hands-on approach and real-world projects really helped me understand the concepts better.',
        testimonial_rating: 5,
        course: 'Full Stack Development',
        testimonial_status: 1,
        success_metrics: JSON.stringify({
          'Salary Increase': '150%',
          'Job Placement': 'Within 2 weeks',
          'Skills Learned': '15+ technologies'
        }),
        created_by: 1
      },
      {
        client_name: 'Jane Smith',
        client_designation: 'Frontend Developer',
        client_company: 'Web Solutions',
        testimonial_text: 'Excellent course content and great instructors. Highly recommended for anyone looking to learn web development. The mentorship program was particularly helpful.',
        testimonial_rating: 5,
        course: 'React Development',
        testimonial_status: 1,
        success_metrics: JSON.stringify({
          'Projects Completed': '8',
          'Certification': 'Achieved',
          'Career Growth': 'Promoted to Senior'
        }),
        created_by: 1
      },
      {
        client_name: 'Mike Johnson',
        client_designation: 'Backend Developer',
        client_company: 'Data Systems Inc',
        testimonial_text: 'The Node.js and database training was comprehensive. I was able to build scalable applications and got multiple job offers after completing the program.',
        testimonial_rating: 5,
        course: 'Backend Development',
        testimonial_status: 1,
        success_metrics: JSON.stringify({
          'Applications Built': '12',
          'Database Skills': 'Advanced',
          'Job Offers': '5+'
        }),
        created_by: 1
      }
    ];
    
    const createdTestimonials = await Testimonial.bulkCreate(testimonialData);
    console.log(`Created ${createdTestimonials.length} sample testimonials`);
    
    res.json({
      success: true,
      message: `Created ${createdTestimonials.length} sample testimonials`,
      createdCount: createdTestimonials.length
    });
  } catch (error) {
    console.error('Error creating sample testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating sample testimonials',
      error: error.message
    });
  }
});

// Update existing blog posts with featured images
app.get('/api/update-blog-images', async (req, res) => {
  try {
    console.log('Updating blog posts with featured images...');
    
    // Get all blog posts
    const blogs = await Blog.findAll();
    console.log(`Found ${blogs.length} blog posts`);
    
    if (blogs.length === 0) {
      return res.json({
        success: true,
        message: 'No blog posts found to update',
        count: 0
      });
    }
    
    // List of available uploaded blog images
    const availableImages = [
      'blog-1757424208625-743240812.png',
      'blog-1757424208640-320065946.png',
      'blog-1757482727936-325560737.png'
    ];
    
    let updatedCount = 0;
    
    for (let i = 0; i < blogs.length; i++) {
      const blog = blogs[i];
      const imageIndex = i % availableImages.length;
      const imageFilename = availableImages[imageIndex];
      
      // Update blog with featured image
      await blog.update({
        featured_image: `/uploads/blogs/${imageFilename}`,
        featured: true // Make them featured so they show on website
      });
      
      updatedCount++;
      console.log(`Updated blog ${blog.id}: ${blog.title}`);
    }
    
    res.json({
      success: true,
      message: `Updated ${updatedCount} blog posts with featured images`,
      updatedCount
    });
  } catch (error) {
    console.error('Error updating blog images:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating blog images',
      error: error.message
    });
  }
});

// Update existing gallery items with actual images
app.get('/api/update-gallery-images', async (req, res) => {
  try {
    console.log('Updating gallery items with actual images...');
    
    // Get all gallery items
    const galleries = await Gallery.findAll();
    console.log(`Found ${galleries.length} gallery items`);
    
    if (galleries.length === 0) {
      // If no gallery items exist, create some sample ones
      console.log('No gallery items found, creating sample data...');
      
      const sampleGalleryData = [
        {
          title: 'Team Building Workshop',
          description: 'Our annual team building workshop where we learned collaboration and communication skills.',
          category: 'workshops',
          subcategory: 'team-building',
          tags: ['team', 'workshop', 'collaboration'],
          location: 'Mindware India Office',
          event_date: new Date('2024-01-15'),
          status: 'active',
          is_featured: true,
          is_public: true,
          images: [{
            filename: 'gallery-1757162175645-370243270.png',
            originalname: 'team-building-1.png',
            url: '/uploads/gallery/gallery-1757162175645-370243270.png',
            size: 1024000,
            mimetype: 'image/png',
            isPrimary: true
          }],
          created_by: 1
        },
        {
          title: 'Student Graduation Ceremony',
          description: 'Celebrating our students who completed their training programs successfully.',
          category: 'events',
          subcategory: 'graduation',
          tags: ['graduation', 'students', 'celebration'],
          location: 'Conference Hall',
          event_date: new Date('2024-02-20'),
          status: 'active',
          is_featured: true,
          is_public: true,
          images: [{
            filename: 'gallery-1757162306471-789916507.png',
            originalname: 'graduation-1.png',
            url: '/uploads/gallery/gallery-1757162306471-789916507.png',
            size: 2048000,
            mimetype: 'image/png',
            isPrimary: true
          }],
          created_by: 1
        }
      ];
      
      const createdGalleries = await Gallery.bulkCreate(sampleGalleryData);
      console.log(`Created ${createdGalleries.length} sample gallery items`);
      
      return res.json({
        success: true,
        message: `Created ${createdGalleries.length} sample gallery items with actual images`,
        createdCount: createdGalleries.length
      });
    }
    
    // List of available uploaded images
    const availableImages = [
      'gallery-1757162175645-370243270.png',
      'gallery-1757162306471-789916507.png',
      'gallery-1757162321851-478061310.png',
      'gallery-1757162354613-792757449.png'
    ];
    
    let updatedCount = 0;
    
    for (let i = 0; i < galleries.length; i++) {
      const gallery = galleries[i];
      const imageIndex = i % availableImages.length;
      const imageFilename = availableImages[imageIndex];
      
      // Update gallery with actual image
      await gallery.update({
        images: [{
          filename: imageFilename,
          originalname: `gallery-image-${i + 1}.png`,
          url: `/uploads/gallery/${imageFilename}`,
          size: 1024000,
          mimetype: 'image/png',
          isPrimary: true
        }],
        is_featured: true // Make them featured so they show on website
      });
      
      updatedCount++;
      console.log(`Updated gallery ${gallery.id}: ${gallery.title}`);
    }
    
    res.json({
      success: true,
      message: `Updated ${updatedCount} gallery items with actual images`,
      updatedCount
    });
  } catch (error) {
    console.error('Error updating gallery images:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating gallery images',
      error: error.message
    });
  }
});

// Initialize all sample data and update images
app.get('/api/init-all-data', async (req, res) => {
  try {
    console.log('Initializing all sample data and updating images...');
    
    // Create sample testimonials first
    const testimonialCount = await Testimonial.count();
    if (testimonialCount === 0) {
      const testimonialData = [
        {
          client_name: 'John Doe',
          client_designation: 'Software Engineer',
          client_company: 'Tech Corp',
          testimonial_text: 'The training program at Mindware India was exceptional. I learned so much and got placed in a great company. The hands-on approach and real-world projects really helped me understand the concepts better.',
          testimonial_rating: 5,
          course: 'Full Stack Development',
          testimonial_status: 1,
          success_metrics: JSON.stringify({
            'Salary Increase': '150%',
            'Job Placement': 'Within 2 weeks',
            'Skills Learned': '15+ technologies'
          }),
          created_by: 1
        },
        {
          client_name: 'Jane Smith',
          client_designation: 'Frontend Developer',
          client_company: 'Web Solutions',
          testimonial_text: 'Excellent course content and great instructors. Highly recommended for anyone looking to learn web development. The mentorship program was particularly helpful.',
          testimonial_rating: 5,
          course: 'React Development',
          testimonial_status: 1,
          success_metrics: JSON.stringify({
            'Projects Completed': '8',
            'Certification': 'Achieved',
            'Career Growth': 'Promoted to Senior'
          }),
          created_by: 1
        },
        {
          client_name: 'Mike Johnson',
          client_designation: 'Backend Developer',
          client_company: 'Data Systems Inc',
          testimonial_text: 'The Node.js and database training was comprehensive. I was able to build scalable applications and got multiple job offers after completing the program.',
          testimonial_rating: 5,
          course: 'Backend Development',
          testimonial_status: 1,
          success_metrics: JSON.stringify({
            'Applications Built': '12',
            'Database Skills': 'Advanced',
            'Job Offers': '5+'
          }),
          created_by: 1
        }
      ];
      
      await Testimonial.bulkCreate(testimonialData);
      console.log('Created sample testimonials');
    }
    
    // Update blog posts with featured images
    const blogs = await Blog.findAll();
    if (blogs.length > 0) {
      const availableBlogImages = [
        'blog-1757424208625-743240812.png',
        'blog-1757424208640-320065946.png',
        'blog-1757482727936-325560737.png'
      ];
      
      for (let i = 0; i < blogs.length; i++) {
        const blog = blogs[i];
        const imageIndex = i % availableBlogImages.length;
        const imageFilename = availableBlogImages[imageIndex];
        
        await blog.update({
          featured_image: `/uploads/blogs/${imageFilename}`,
          featured: true
        });
      }
      console.log(`Updated ${blogs.length} blog posts with featured images`);
    }
    
    // Update gallery items with actual images
    const galleries = await Gallery.findAll();
    if (galleries.length > 0) {
      const availableGalleryImages = [
        'gallery-1757162175645-370243270.png',
        'gallery-1757162306471-789916507.png',
        'gallery-1757162321851-478061310.png',
        'gallery-1757162354613-792757449.png'
      ];
      
      for (let i = 0; i < galleries.length; i++) {
        const gallery = galleries[i];
        const imageIndex = i % availableGalleryImages.length;
        const imageFilename = availableGalleryImages[imageIndex];
        
        await gallery.update({
          images: [{
            filename: imageFilename,
            originalname: `gallery-image-${i + 1}.png`,
            url: `/uploads/gallery/${imageFilename}`,
            size: 1024000,
            mimetype: 'image/png',
            isPrimary: true
          }],
          is_featured: true
        });
      }
      console.log(`Updated ${galleries.length} gallery items with actual images`);
    }
    
    res.json({
      success: true,
      message: 'All sample data initialized and images updated successfully',
      data: {
        testimonials: testimonialCount > 0 ? testimonialCount : 3,
        blogs: blogs.length,
        galleries: galleries.length
      }
    });
  } catch (error) {
    console.error('Error initializing all data:', error);
    res.status(500).json({
      success: false,
      message: 'Error initializing all data',
      error: error.message
    });
  }
});

// Initialize sample data
app.get('/api/init-sample-data', async (req, res) => {
  try {
    console.log('Initializing sample data...');
    
    // Check if data already exists
    const existingCount = await Gallery.count();
    if (existingCount > 0) {
      return res.json({
        success: true,
        message: 'Sample data already exists',
        count: existingCount
      });
    }
    
    // Create sample gallery items
    const galleryData = [
      {
        title: 'Team Building Workshop',
        description: 'Our annual team building workshop where we learned collaboration and communication skills.',
        category: 'workshops',
        subcategory: 'team-building',
        tags: ['team', 'workshop', 'collaboration'],
        location: 'Mindware India Office',
        event_date: new Date('2024-01-15'),
        status: 'active',
        is_featured: true,
        is_public: true,
        images: [
          {
            filename: 'gallery-1757162175645-370243270.png',
            originalname: 'team-building-1.jpg',
            url: '/uploads/gallery/gallery-1757162175645-370243270.png',
            size: 1024000,
            mimetype: 'image/png',
            isPrimary: true
          }
        ],
        created_by: 1
      },
      {
        title: 'Student Graduation Ceremony',
        description: 'Celebrating our students who completed their training programs successfully.',
        category: 'events',
        subcategory: 'graduation',
        tags: ['graduation', 'students', 'celebration'],
        location: 'Conference Hall',
        event_date: new Date('2024-02-20'),
        status: 'active',
        is_featured: true,
        is_public: true,
        images: [
          {
            filename: 'gallery-1757162306471-789916507.png',
            originalname: 'graduation-1.jpg',
            url: '/uploads/gallery/gallery-1757162306471-789916507.png',
            size: 2048000,
            mimetype: 'image/png',
            isPrimary: true
          }
        ],
        created_by: 1
      }
    ];
    
    // Create sample blog posts
    const blogData = [
      {
        title: 'Introduction to React Development',
        content: 'React is a powerful JavaScript library for building user interfaces. In this comprehensive guide, we will explore the fundamentals of React development.',
        excerpt: 'Learn the basics of React development with our comprehensive guide.',
        category: 'technology',
        status: 'published',
        featured: true,
        tags: ['react', 'javascript', 'frontend'],
        author_id: 1,
        created_by: 1
      },
      {
        title: 'Node.js Backend Development',
        content: 'Node.js allows you to run JavaScript on the server side. This makes it perfect for building scalable web applications.',
        excerpt: 'Discover the power of Node.js for backend development.',
        category: 'technology',
        status: 'published',
        featured: false,
        tags: ['nodejs', 'backend', 'javascript'],
        author_id: 1,
        created_by: 1
      }
    ];
    
    // Create sample internships
    const internshipData = [
      {
        title: 'Frontend Developer Internship',
        description: 'Join our team as a frontend developer intern and work on exciting web projects.',
        company: 'Mindware India',
        location: 'Remote',
        duration: '3 months',
        stipend: 15000,
        requirements: ['HTML', 'CSS', 'JavaScript', 'React'],
        status: 'active',
        created_by: 1
      },
      {
        title: 'Backend Developer Internship',
        description: 'Work on server-side development using Node.js and databases.',
        company: 'Mindware India',
        location: 'Hybrid',
        duration: '6 months',
        stipend: 20000,
        requirements: ['Node.js', 'MongoDB', 'Express.js'],
        status: 'active',
        created_by: 1
      }
    ];
    
    // Create sample testimonials
    const testimonialData = [
      {
        name: 'John Doe',
        position: 'Software Engineer',
        company: 'Tech Corp',
        content: 'The training program at Mindware India was exceptional. I learned so much and got placed in a great company.',
        rating: 5,
        status: 'approved',
        created_by: 1
      },
      {
        name: 'Jane Smith',
        position: 'Frontend Developer',
        company: 'Web Solutions',
        content: 'Excellent course content and great instructors. Highly recommended for anyone looking to learn web development.',
        rating: 5,
        status: 'approved',
        created_by: 1
      }
    ];
    
    // Create sample video lectures
    const videoData = [
      {
        title: 'React Fundamentals',
        description: 'Learn the basics of React development',
        video_url: 'https://example.com/react-fundamentals.mp4',
        duration: 120,
        category: 'frontend',
        level: 'beginner',
        status: 'published',
        created_by: 1
      },
      {
        title: 'Node.js Backend Development',
        description: 'Master Node.js for backend development',
        video_url: 'https://example.com/nodejs-backend.mp4',
        duration: 180,
        category: 'backend',
        level: 'intermediate',
        status: 'published',
        created_by: 1
      }
    ];
    
    // Create all sample data
    const [galleryItems, blogItems, internshipItems, testimonialItems, videoItems] = await Promise.all([
      Gallery.bulkCreate(galleryData),
      Blog.bulkCreate(blogData),
      Internship.bulkCreate(internshipData),
      Testimonial.bulkCreate(testimonialData),
      VideoLecture.bulkCreate(videoData)
    ]);
    
    res.json({
      success: true,
      message: 'Sample data created successfully',
      data: {
        gallery: galleryItems.length,
        blogs: blogItems.length,
        internships: internshipItems.length,
        testimonials: testimonialItems.length,
        videos: videoItems.length
      }
    });
  } catch (error) {
    console.error('Error creating sample data:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating sample data',
      error: error.message
    });
  }
});

// Gallery routes with database integration
app.get('/api/gallery', async (req, res) => {
  try {
    console.log('GET /api/gallery - Fetching from database');
    const { page = 1, limit = 10, category, status = 'active', featured } = req.query;
    
    let whereClause = {};
    if (status) whereClause.status = status;
    if (category) whereClause.category = category;
    if (featured === 'true') whereClause.is_featured = true;
    
    const galleries = await Gallery.findAndCountAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    
    console.log('Gallery query params:', { page, limit, category, status, featured });
    console.log('Gallery where clause:', whereClause);
    console.log('Found galleries:', galleries.rows.length);
    console.log('Gallery data:', galleries.rows.map(g => ({ id: g.id, title: g.title, is_featured: g.is_featured, images: g.images })));
    
    res.json({
      success: true,
      data: galleries.rows,
      pagination: {
        total: galleries.count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(galleries.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching galleries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching galleries',
      error: error.message
    });
  }
});

// GET /api/gallery/:id - Get single gallery item
app.get('/api/gallery/:id', async (req, res) => {
  try {
    console.log(`GET /api/gallery/${req.params.id} - Fetching from database`);
    
    const gallery = await Gallery.findByPk(req.params.id);
    if (!gallery) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }
    
    res.json({
      success: true,
      data: gallery
    });
  } catch (error) {
    console.error('Error fetching gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching gallery',
      error: error.message
    });
  }
});

app.post('/api/gallery', upload.array('images', 10), async (req, res) => {
  try {
    console.log('POST /api/gallery - Creating in database');
    console.log('Files:', req.files);
    console.log('Body:', req.body);
    console.log('Headers:', req.headers);

    // Validate required fields
    if (!req.body.title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const galleryData = {
      title: req.body.title,
      description: req.body.description || '',
      category: req.body.category || 'other',
      subcategory: req.body.subcategory || null,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      location: req.body.location || null,
      event_date: req.body.event_date || null,
      status: req.body.status || 'active',
      is_featured: req.body.is_featured === 'true' || req.body.is_featured === true,
      is_public: req.body.is_public === 'true' || req.body.is_public === true,
      images: req.files ? req.files.map(file => {
        const imageData = {
          filename: file.filename,
          originalname: file.originalname,
          path: file.path,
          url: `/uploads/gallery/${file.filename}`,
          size: file.size,
          mimetype: file.mimetype,
          isPrimary: true
        };
        console.log('Gallery image data:', imageData);
        return imageData;
      }) : [],
      created_by: 1 // Default admin user
    };

    console.log('Final gallery data:', galleryData);

    // Create in database
    const newGallery = await Gallery.create(galleryData);
    console.log('Gallery created in database:', newGallery);
    
    res.status(201).json({
      success: true,
      message: 'Gallery created successfully',
      data: newGallery
    });
  } catch (error) {
    console.error('Error creating gallery:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Error creating gallery',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// PUT /api/gallery/:id - Update gallery item
app.put('/api/gallery/:id', upload.array('images', 10), async (req, res) => {
  try {
    console.log(`PUT /api/gallery/${req.params.id} - Updating in database`);
    console.log('Files:', req.files);
    console.log('Body:', req.body);

    const galleryItem = await Gallery.findByPk(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    const updateData = {
      title: req.body.title || galleryItem.title,
      description: req.body.description || galleryItem.description,
      category: req.body.category || galleryItem.category,
      subcategory: req.body.subcategory || galleryItem.subcategory,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : galleryItem.tags,
      location: req.body.location || galleryItem.location,
      event_date: req.body.event_date || galleryItem.event_date,
      status: req.body.status || galleryItem.status,
      is_featured: req.body.is_featured === 'true' || req.body.is_featured === true,
      is_public: req.body.is_public === 'true' || req.body.is_public === true
    };

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      updateData.images = req.files.map(file => ({
        filename: file.filename,
        originalname: file.originalname,
        path: file.path,
        url: `/uploads/gallery/${file.filename}`,
        size: file.size,
        mimetype: file.mimetype,
        isPrimary: true
      }));
    }

    await galleryItem.update(updateData);
    
    res.status(200).json({
      success: true,
      message: 'Gallery updated successfully',
      data: galleryItem
    });
  } catch (error) {
    console.error('Error updating gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating gallery',
      error: error.message
    });
  }
});

// DELETE /api/gallery/:id - Delete gallery item
app.delete('/api/gallery/:id', async (req, res) => {
  try {
    console.log(`DELETE /api/gallery/${req.params.id} - Deleting from database`);

    const galleryItem = await Gallery.findByPk(req.params.id);
    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    await galleryItem.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Gallery deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting gallery:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting gallery',
      error: error.message
    });
  }
});

// Blog routes with database integration
app.get('/api/blogs', async (req, res) => {
  try {
    console.log('GET /api/blogs - Fetching from database');
    const { page = 1, limit = 10, category, search, status = 'published' } = req.query;
    
    let whereClause = {};
    if (status) whereClause.status = status;
    if (category) whereClause.category = category;
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } },
        { excerpt: { [Op.like]: `%${search}%` } }
      ];
    }
    
    const blogs = await Blog.findAndCountAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit)
    });
    
    res.json({
      success: true,
      data: blogs.rows,
      pagination: {
        total: blogs.count,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(blogs.count / parseInt(limit))
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blogs',
      error: error.message
    });
  }
});

app.get('/api/blogs/categories', async (req, res) => {
  try {
    console.log('GET /api/blogs/categories - Fetching from database');
    
    const categories = await Blog.findAll({
      attributes: ['category'],
      where: {
        category: { [Op.ne]: null },
        status: 'published'
      },
      group: ['category'],
      order: [['category', 'ASC']]
    });
    
    const categoryList = categories.map(blog => blog.category).filter(Boolean);
    
    res.json({
      success: true,
      data: categoryList
    });
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog categories',
      error: error.message
    });
  }
});

app.get('/api/blogs/:slug', async (req, res) => {
  try {
    console.log('GET /api/blogs/:slug - Fetching from database');
    const { slug } = req.params;
    
    const blog = await Blog.findOne({
      where: { slug: slug }
    });
    
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Increment view count
    await blog.increment('views');
    
    res.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog',
      error: error.message
    });
  }
});

app.get('/api/blogs/recent/:limit?', async (req, res) => {
  try {
    console.log('GET /api/blogs/recent - Fetching from database');
    const limit = parseInt(req.params.limit) || 5;
    
    const blogs = await Blog.findAll({
      where: { status: 'published' },
      order: [['created_at', 'DESC']],
      limit: limit
    });
    
    res.json({
      success: true,
      data: blogs
    });
  } catch (error) {
    console.error('Error fetching recent blogs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching recent blogs',
      error: error.message
    });
  }
});

app.get('/api/blogs/categories', async (req, res) => {
  try {
    console.log('GET /api/blogs/categories - Fetching from database');
    
    const categories = await Blog.findAll({
      attributes: ['category'],
      where: {
        category: { [Op.ne]: null },
        status: 'published'
      },
      group: ['category'],
      order: [['category', 'ASC']]
    });
    
    const categoryList = categories.map(blog => blog.category).filter(Boolean);
    
    res.json({
      success: true,
      data: categoryList
    });
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching blog categories',
      error: error.message
    });
  }
});

app.post('/api/blogs', async (req, res) => {
  try {
    console.log('POST /api/blogs - Creating in database');
    console.log('Body:', req.body);

    // Generate slug from title
    const generateSlug = (title) => {
      return title
        .toLowerCase()
        .replace(/[^a-z0-9 -]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
    };

    const blogData = {
      ...req.body,
      slug: req.body.slug || generateSlug(req.body.title),
      status: req.body.status || 'draft',
      created_by: 1, // Default admin user
      views: 0,
      likes: 0
    };
    
    console.log('Final blog data:', blogData);

    // Create in database
    const newBlog = await Blog.create(blogData);
    console.log('Blog created in database:', newBlog);
    
    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: newBlog
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating blog',
      error: error.message
    });
  }
});

// Testimonial routes with database integration
app.get('/api/testimonials', async (req, res) => {
  try {
    console.log('GET /api/testimonials - Fetching from database');
    const testimonials = await Testimonial.findAll({
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching testimonials',
      error: error.message
    });
  }
});

app.post('/api/testimonials', async (req, res) => {
  try {
    console.log('POST /api/testimonials - Creating in database');
    console.log('Body:', req.body);

    const testimonialData = {
      ...req.body,
      created_by: 1 // Default admin user
    };

    // Create in database
    const newTestimonial = await Testimonial.create(testimonialData);
    console.log('Testimonial created in database:', newTestimonial);
    
    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully',
      data: newTestimonial
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating testimonial',
      error: error.message
    });
  }
});

// Internship routes with database integration
app.get('/api/internships', async (req, res) => {
  try {
    console.log('GET /api/internships - Fetching from database');
    const internships = await Internship.findAll({
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: internships
    });
  } catch (error) {
    console.error('Error fetching internships:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching internships',
      error: error.message
    });
  }
});

app.post('/api/internships', async (req, res) => {
  try {
    console.log('POST /api/internships - Creating in database');
    console.log('Body:', req.body);

    const internshipData = {
      ...req.body,
      created_by: 1 // Default admin user
    };

    // Create in database
    const newInternship = await Internship.create(internshipData);
    console.log('Internship created in database:', newInternship);
    
    res.status(201).json({
      success: true,
      message: 'Internship created successfully',
      data: newInternship
    });
  } catch (error) {
    console.error('Error creating internship:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating internship',
      error: error.message
    });
  }
});

// Video routes with database integration
app.get('/api/videos', async (req, res) => {
  try {
    console.log('GET /api/videos - Fetching from database');
    const videos = await VideoLecture.findAll({
      order: [['created_at', 'DESC']]
    });
    
    res.json({
      success: true,
      data: videos
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching videos',
      error: error.message
    });
  }
});

app.post('/api/videos', async (req, res) => {
  try {
    console.log('POST /api/videos - Creating in database');
    console.log('Body:', req.body);

    const videoData = {
      ...req.body,
      created_by: 1 // Default admin user
    };

    // Create in database
    const newVideo = await VideoLecture.create(videoData);
    console.log('Video created in database:', newVideo);
    
    res.status(201).json({
      success: true,
      message: 'Video created successfully',
      data: newVideo
    });
  } catch (error) {
    console.error('Error creating video:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating video',
      error: error.message
    });
  }
});


// Additional API routes (keeping original route files for other endpoints)
app.use('/api/students', studentRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/certificates', certificateRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use(errorHandler);

// Database connection and server start
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MySQL database
    await connectDB();
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV}`);
      console.log(`🌐 API URL: http://localhost:${PORT}/api`);
      console.log(`💾 Database: MySQL`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

startServer();