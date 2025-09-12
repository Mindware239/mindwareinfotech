const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5000', 'file://', 'null'],
  credentials: true
}));
app.use(express.json());

// Sample video data
const sampleVideos = [
  {
    id: 1,
    title: "Introduction to React.js",
    description: "Learn the fundamentals of React.js including components, state, and props. This comprehensive tutorial covers everything you need to know to get started with React development.",
    video_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4",
    thumbnail_url: "https://via.placeholder.com/1280x720/667eea/ffffff?text=React+JS+Tutorial",
    category: "web-development",
    instructor: "John Doe",
    duration: 3600,
    difficulty: "beginner",
    tags: "react,javascript,frontend,web development",
    is_featured: true,
    is_premium: false,
    views: 1250,
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    title: "Advanced JavaScript Concepts",
    description: "Master advanced JavaScript concepts including closures, prototypes, async/await, and modern ES6+ features.",
    video_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4",
    thumbnail_url: "https://via.placeholder.com/1280x720/764ba2/ffffff?text=Advanced+JavaScript",
    category: "programming",
    instructor: "Jane Smith",
    duration: 4200,
    difficulty: "intermediate",
    tags: "javascript,es6,async,closures",
    is_featured: true,
    is_premium: true,
    views: 890,
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    title: "Node.js Backend Development",
    description: "Build robust backend applications with Node.js, Express, and MongoDB. Learn about REST APIs, authentication, and database integration.",
    video_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4",
    thumbnail_url: "https://via.placeholder.com/1280x720/43e97b/ffffff?text=Node.js+Backend",
    category: "web-development",
    instructor: "Mike Johnson",
    duration: 5400,
    difficulty: "intermediate",
    tags: "nodejs,express,mongodb,backend",
    is_featured: false,
    is_premium: false,
    views: 650,
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    title: "Python for Data Science",
    description: "Introduction to Python programming for data science, including pandas, numpy, and matplotlib libraries.",
    video_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_3mb.mp4",
    thumbnail_url: "https://via.placeholder.com/1280x720/f093fb/ffffff?text=Python+Data+Science",
    category: "data-science",
    instructor: "Sarah Wilson",
    duration: 4800,
    difficulty: "beginner",
    tags: "python,pandas,numpy,data science",
    is_featured: true,
    is_premium: false,
    views: 1100,
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    title: "Mobile App Development with React Native",
    description: "Create cross-platform mobile applications using React Native. Learn about navigation, state management, and native modules.",
    video_url: "https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_4mb.mp4",
    thumbnail_url: "https://via.placeholder.com/1280x720/4facfe/ffffff?text=React+Native",
    category: "mobile-development",
    instructor: "Alex Brown",
    duration: 6000,
    difficulty: "advanced",
    tags: "react native,mobile,ios,android",
    is_featured: false,
    is_premium: true,
    views: 750,
    created_at: new Date().toISOString()
  }
];

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Video Server is running!',
    timestamp: new Date().toISOString()
  });
});

// Get all videos
app.get('/api/videos', (req, res) => {
  console.log('GET /api/videos - Returning sample data');
  res.json({
    success: true,
    data: sampleVideos
  });
});

// Get single video
app.get('/api/videos/:id', (req, res) => {
  const videoId = parseInt(req.params.id);
  const video = sampleVideos.find(v => v.id === videoId);
  
  if (!video) {
    return res.status(404).json({
      success: false,
      message: 'Video not found'
    });
  }
  
  res.json({
    success: true,
    data: video
  });
});

// Create video
app.post('/api/videos', (req, res) => {
  console.log('POST /api/videos - Creating new video');
  console.log('Body:', req.body);
  
  const newVideo = {
    id: sampleVideos.length + 1,
    ...req.body,
    views: 0,
    created_at: new Date().toISOString()
  };
  
  sampleVideos.push(newVideo);
  
  res.status(201).json({
    success: true,
    message: 'Video created successfully',
    data: newVideo
  });
});

// Update video
app.put('/api/videos/:id', (req, res) => {
  const videoId = parseInt(req.params.id);
  const videoIndex = sampleVideos.findIndex(v => v.id === videoId);
  
  if (videoIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Video not found'
    });
  }
  
  sampleVideos[videoIndex] = {
    ...sampleVideos[videoIndex],
    ...req.body,
    updated_at: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Video updated successfully',
    data: sampleVideos[videoIndex]
  });
});

// Delete video
app.delete('/api/videos/:id', (req, res) => {
  const videoId = parseInt(req.params.id);
  const videoIndex = sampleVideos.findIndex(v => v.id === videoId);
  
  if (videoIndex === -1) {
    return res.status(404).json({
      success: false,
      message: 'Video not found'
    });
  }
  
  sampleVideos.splice(videoIndex, 1);
  
  res.json({
    success: true,
    message: 'Video deleted successfully'
  });
});

// Authentication routes
app.post('/api/auth/login', (req, res) => {
  console.log('POST /api/auth/login');
  const { email, password } = req.body;
  
  if (email === 'admin@mindwareindia.com' && password === 'admin123') {
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: 1,
          name: 'Admin User',
          email: 'admin@mindwareindia.com',
          role: 'admin'
        },
        token: 'admin-token-' + Date.now()
      }
    });
  } else {
    res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  }
});

app.get('/api/auth/me', (req, res) => {
  res.json({
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
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Video Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🎥 Videos API: http://localhost:${PORT}/api/videos`);
  console.log(`🔐 Admin panel: http://localhost:3000/admin`);
});

