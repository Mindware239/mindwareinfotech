const axios = require('axios');

const API_BASE = 'http://localhost:5000/api';

const trainingPrograms = [
  {
    title: 'Complete Web Development Bootcamp',
    slug: 'complete-web-development-bootcamp',
    description: 'Master full-stack web development from scratch. Learn HTML5, CSS3, JavaScript, React, Node.js, and MongoDB to build modern web applications.',
    short_description: 'Learn full-stack web development with hands-on projects and real-world applications.',
    category: 'web-development',
    subcategory: 'full-stack',
    level: 'beginner',
    duration: '6 months',
    duration_hours: 480,
    price: 25000,
    original_price: 35000,
    discount_percentage: 29,
    currency: 'INR',
    is_free: false,
    is_featured: true,
    status: 'published',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'MongoDB', 'Express.js', 'Git'],
    learning_outcomes: [
      'Build responsive websites using HTML5 and CSS3',
      'Create interactive web applications with JavaScript',
      'Develop modern React applications with hooks and context',
      'Build RESTful APIs with Node.js and Express',
      'Work with MongoDB for database management',
      'Deploy applications to production environments'
    ],
    prerequisites: [
      'Basic computer skills',
      'No prior programming experience required',
      'Willingness to learn and practice regularly'
    ],
    curriculum: [
      {
        title: 'Frontend Fundamentals',
        duration: '8 weeks',
        topics: ['HTML5 semantic elements', 'CSS3 styling', 'JavaScript ES6+', 'Responsive design']
      },
      {
        title: 'React Development',
        duration: '6 weeks',
        topics: ['React components', 'State management', 'React hooks', 'Testing']
      }
    ],
    instructor: {
      name: 'Rajesh Kumar',
      title: 'Senior Full-Stack Developer',
      bio: '10+ years of experience in web development',
      rating: 4.9,
      students: 2500,
      courses: 15
    },
    start_date: new Date('2024-02-01'),
    end_date: new Date('2024-08-01'),
    location: 'Online + Delhi',
    max_students: 50,
    enrolled_students: 35,
    rating: 4.8,
    total_reviews: 120,
    tags: ['web-development', 'react', 'nodejs', 'mongodb', 'full-stack'],
    meta_title: 'Complete Web Development Bootcamp - Learn Full-Stack Development',
    meta_description: 'Master full-stack web development with our comprehensive bootcamp.',
    created_by: 1
  },
  {
    title: 'Advanced React & Redux Mastery',
    slug: 'advanced-react-redux-mastery',
    description: 'Deep dive into advanced React concepts, Redux state management, performance optimization, and modern React patterns.',
    short_description: 'Master advanced React concepts and Redux for building scalable applications.',
    category: 'web-development',
    subcategory: 'frontend',
    level: 'intermediate',
    duration: '3 months',
    duration_hours: 180,
    price: 15000,
    original_price: 20000,
    discount_percentage: 25,
    currency: 'INR',
    is_free: false,
    is_featured: true,
    status: 'published',
    skills: ['React', 'Redux', 'TypeScript', 'Testing', 'Performance'],
    learning_outcomes: [
      'Master advanced React patterns and hooks',
      'Implement complex state management with Redux',
      'Optimize React application performance',
      'Write comprehensive tests for React apps'
    ],
    prerequisites: [
      'Basic knowledge of JavaScript and React',
      'Understanding of ES6+ features',
      'Experience with HTML and CSS'
    ],
    instructor: {
      name: 'Priya Sharma',
      title: 'React Expert & Tech Lead',
      bio: '8+ years specializing in React ecosystem',
      rating: 4.9,
      students: 1800,
      courses: 12
    },
    start_date: new Date('2024-03-01'),
    end_date: new Date('2024-06-01'),
    location: 'Online',
    max_students: 30,
    enrolled_students: 22,
    rating: 4.7,
    total_reviews: 85,
    tags: ['react', 'redux', 'typescript', 'testing'],
    meta_title: 'Advanced React & Redux Mastery Course',
    meta_description: 'Master advanced React concepts and Redux state management.',
    created_by: 1
  },
  {
    title: 'Python for Data Science & AI',
    slug: 'python-data-science-ai',
    description: 'Comprehensive Python programming course focused on data science, machine learning, and artificial intelligence applications.',
    short_description: 'Learn Python programming for data science, machine learning, and AI applications.',
    category: 'data-science',
    subcategory: 'python',
    level: 'beginner',
    duration: '4 months',
    duration_hours: 320,
    price: 20000,
    original_price: 28000,
    discount_percentage: 29,
    currency: 'INR',
    is_free: false,
    is_featured: true,
    status: 'published',
    skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'TensorFlow'],
    learning_outcomes: [
      'Master Python programming fundamentals',
      'Work with data using Pandas and NumPy',
      'Create data visualizations with Matplotlib',
      'Build machine learning models'
    ],
    prerequisites: [
      'Basic computer skills',
      'No prior programming experience required',
      'Mathematical aptitude helpful'
    ],
    instructor: {
      name: 'Dr. Amit Patel',
      title: 'Data Science Lead & AI Researcher',
      bio: 'PhD in Computer Science with 12+ years in data science',
      rating: 4.9,
      students: 3200,
      courses: 20
    },
    start_date: new Date('2024-02-15'),
    end_date: new Date('2024-06-15'),
    location: 'Online + Mumbai',
    max_students: 40,
    enrolled_students: 28,
    rating: 4.8,
    total_reviews: 150,
    tags: ['python', 'data-science', 'machine-learning', 'ai'],
    meta_title: 'Python for Data Science & AI - Complete Course',
    meta_description: 'Master Python for data science, machine learning, and AI.',
    created_by: 1
  },
  {
    title: 'Free HTML & CSS Basics',
    slug: 'free-html-css-basics',
    description: 'Learn the fundamentals of web development with HTML5 and CSS3. Perfect for beginners who want to start their web development journey.',
    short_description: 'Start your web development journey with HTML5 and CSS3 fundamentals.',
    category: 'web-development',
    subcategory: 'frontend',
    level: 'beginner',
    duration: '1 month',
    duration_hours: 40,
    price: 0,
    currency: 'INR',
    is_free: true,
    is_featured: false,
    status: 'published',
    skills: ['HTML5', 'CSS3', 'Responsive Design', 'Flexbox', 'Grid'],
    learning_outcomes: [
      'Create semantic HTML5 structure',
      'Style websites with CSS3',
      'Build responsive layouts',
      'Use Flexbox and Grid systems'
    ],
    prerequisites: [
      'Basic computer skills',
      'No prior programming experience required',
      'Access to a text editor'
    ],
    instructor: {
      name: 'Anita Singh',
      title: 'Frontend Development Instructor',
      bio: '5+ years teaching web development fundamentals',
      rating: 4.7,
      students: 5000,
      courses: 8
    },
    start_date: new Date('2024-01-01'),
    end_date: new Date('2024-12-31'),
    location: 'Online',
    max_students: 1000,
    enrolled_students: 450,
    rating: 4.5,
    total_reviews: 200,
    tags: ['html', 'css', 'beginner', 'free'],
    meta_title: 'Free HTML & CSS Basics Course',
    meta_description: 'Learn HTML5 and CSS3 fundamentals for free.',
    created_by: 1
  }
];

async function addTrainingPrograms() {
  try {
    console.log('🌱 Adding training programs via API...');
    
    for (const program of trainingPrograms) {
      try {
        const response = await axios.post(`${API_BASE}/training-programs`, program, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer your-admin-token' // You might need to get a real token
          }
        });
        console.log(`✅ Added: ${program.title}`);
      } catch (error) {
        console.log(`❌ Failed to add ${program.title}:`, error.response?.data?.message || error.message);
      }
    }
    
    console.log('🎉 Training programs addition completed!');
  } catch (error) {
    console.error('❌ Error adding training programs:', error.message);
  }
}

// Run the function
addTrainingPrograms();
