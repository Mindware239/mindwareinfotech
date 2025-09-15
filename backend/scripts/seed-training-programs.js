const { TrainingProgram } = require('../models');
const { sequelize } = require('../config/database');

const trainingProgramsData = [
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
      'Deploy applications to production environments',
      'Use Git for version control and collaboration',
      'Implement authentication and authorization'
    ],
    prerequisites: [
      'Basic computer skills',
      'No prior programming experience required',
      'Willingness to learn and practice regularly',
      'Access to a computer with internet connection'
    ],
    curriculum: [
      {
        title: 'Frontend Fundamentals',
        duration: '8 weeks',
        topics: [
          'HTML5 semantic elements and forms',
          'CSS3 styling and animations',
          'Responsive design with Flexbox and Grid',
          'JavaScript ES6+ features',
          'DOM manipulation and events',
          'AJAX and API integration'
        ]
      },
      {
        title: 'React Development',
        duration: '6 weeks',
        topics: [
          'React components and JSX',
          'State and props management',
          'React hooks (useState, useEffect, useContext)',
          'React Router for navigation',
          'State management with Redux',
          'Testing React applications'
        ]
      },
      {
        title: 'Backend Development',
        duration: '6 weeks',
        topics: [
          'Node.js fundamentals',
          'Express.js framework',
          'RESTful API design',
          'MongoDB database operations',
          'Authentication and authorization',
          'API testing and documentation'
        ]
      },
      {
        title: 'Project Development',
        duration: '4 weeks',
        topics: [
          'Full-stack project planning',
          'Version control with Git',
          'Deployment strategies',
          'Performance optimization',
          'Security best practices',
          'Code review and collaboration'
        ]
      }
    ],
    instructor: {
      name: 'Rajesh Kumar',
      title: 'Senior Full-Stack Developer',
      bio: '10+ years of experience in web development with expertise in React, Node.js, and cloud technologies.',
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
    tags: ['web-development', 'react', 'nodejs', 'mongodb', 'full-stack', 'bootcamp'],
    meta_title: 'Complete Web Development Bootcamp - Learn Full-Stack Development',
    meta_description: 'Master full-stack web development with our comprehensive bootcamp. Learn React, Node.js, MongoDB and build real projects.',
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
    skills: ['React', 'Redux', 'TypeScript', 'Testing', 'Performance', 'Hooks'],
    learning_outcomes: [
      'Master advanced React patterns and hooks',
      'Implement complex state management with Redux',
      'Optimize React application performance',
      'Write comprehensive tests for React apps',
      'Use TypeScript with React',
      'Implement server-side rendering with Next.js'
    ],
    prerequisites: [
      'Basic knowledge of JavaScript and React',
      'Understanding of ES6+ features',
      'Experience with HTML and CSS',
      'Familiarity with npm and package management'
    ],
    curriculum: [
      {
        title: 'Advanced React Concepts',
        duration: '4 weeks',
        topics: [
          'Advanced hooks and custom hooks',
          'Context API and state management',
          'Higher-order components',
          'Render props pattern',
          'Error boundaries and error handling',
          'Code splitting and lazy loading'
        ]
      },
      {
        title: 'Redux State Management',
        duration: '4 weeks',
        topics: [
          'Redux fundamentals and principles',
          'Actions, reducers, and store',
          'Redux Toolkit and modern Redux',
          'Async operations with Redux Thunk',
          'Redux DevTools and debugging',
          'Testing Redux applications'
        ]
      },
      {
        title: 'Performance & Testing',
        duration: '4 weeks',
        topics: [
          'React performance optimization',
          'Memoization and useMemo/useCallback',
          'Testing with Jest and React Testing Library',
          'TypeScript integration',
          'Next.js and SSR',
          'Production deployment'
        ]
      }
    ],
    instructor: {
      name: 'Priya Sharma',
      title: 'React Expert & Tech Lead',
      bio: '8+ years specializing in React ecosystem with focus on performance and scalability.',
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
    tags: ['react', 'redux', 'typescript', 'testing', 'performance'],
    meta_title: 'Advanced React & Redux Mastery Course',
    meta_description: 'Master advanced React concepts, Redux state management, and performance optimization.',
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
    skills: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Scikit-learn', 'TensorFlow', 'Jupyter'],
    learning_outcomes: [
      'Master Python programming fundamentals',
      'Work with data using Pandas and NumPy',
      'Create data visualizations with Matplotlib',
      'Build machine learning models',
      'Implement deep learning with TensorFlow',
      'Analyze real-world datasets'
    ],
    prerequisites: [
      'Basic computer skills',
      'No prior programming experience required',
      'Mathematical aptitude helpful but not required',
      'Access to a computer with internet connection'
    ],
    curriculum: [
      {
        title: 'Python Fundamentals',
        duration: '6 weeks',
        topics: [
          'Python syntax and data types',
          'Control structures and functions',
          'Object-oriented programming',
          'File handling and modules',
          'Exception handling',
          'Regular expressions'
        ]
      },
      {
        title: 'Data Science Libraries',
        duration: '6 weeks',
        topics: [
          'NumPy for numerical computing',
          'Pandas for data manipulation',
          'Matplotlib for data visualization',
          'Seaborn for statistical plots',
          'Data cleaning and preprocessing',
          'Exploratory data analysis'
        ]
      },
      {
        title: 'Machine Learning',
        duration: '6 weeks',
        topics: [
          'Introduction to machine learning',
          'Scikit-learn library',
          'Supervised learning algorithms',
          'Unsupervised learning techniques',
          'Model evaluation and validation',
          'Feature engineering'
        ]
      },
      {
        title: 'Deep Learning & AI',
        duration: '6 weeks',
        topics: [
          'Introduction to neural networks',
          'TensorFlow and Keras',
          'Deep learning models',
          'Computer vision applications',
          'Natural language processing',
          'AI project development'
        ]
      }
    ],
    instructor: {
      name: 'Dr. Amit Patel',
      title: 'Data Science Lead & AI Researcher',
      bio: 'PhD in Computer Science with 12+ years in data science and machine learning.',
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
    tags: ['python', 'data-science', 'machine-learning', 'ai', 'tensorflow', 'pandas'],
    meta_title: 'Python for Data Science & AI - Complete Course',
    meta_description: 'Master Python for data science, machine learning, and AI with hands-on projects.',
    created_by: 1
  },
  {
    title: 'Cloud Computing with AWS',
    slug: 'cloud-computing-aws',
    description: 'Comprehensive cloud computing course covering AWS services, infrastructure, security, and best practices for scalable applications.',
    short_description: 'Master cloud computing with AWS services and build scalable applications.',
    category: 'cloud-computing',
    subcategory: 'aws',
    level: 'intermediate',
    duration: '3 months',
    duration_hours: 200,
    price: 18000,
    original_price: 25000,
    discount_percentage: 28,
    currency: 'INR',
    is_free: false,
    is_featured: true,
    status: 'published',
    skills: ['AWS', 'EC2', 'S3', 'Lambda', 'RDS', 'CloudFormation', 'DevOps'],
    learning_outcomes: [
      'Understand cloud computing fundamentals',
      'Master AWS core services',
      'Deploy and manage applications on AWS',
      'Implement security best practices',
      'Use infrastructure as code',
      'Monitor and optimize cloud resources'
    ],
    prerequisites: [
      'Basic understanding of networking',
      'Familiarity with command line interface',
      'Basic knowledge of databases',
      'Understanding of web applications'
    ],
    curriculum: [
      {
        title: 'AWS Fundamentals',
        duration: '4 weeks',
        topics: [
          'Introduction to cloud computing',
          'AWS global infrastructure',
          'IAM and security fundamentals',
          'EC2 instances and management',
          'S3 storage services',
          'VPC and networking basics'
        ]
      },
      {
        title: 'AWS Core Services',
        duration: '4 weeks',
        topics: [
          'RDS database services',
          'Lambda serverless computing',
          'API Gateway and microservices',
          'CloudFront CDN',
          'Route 53 DNS management',
          'Elastic Load Balancing'
        ]
      },
      {
        title: 'DevOps & Automation',
        duration: '4 weeks',
        topics: [
          'CloudFormation templates',
          'CodePipeline and CI/CD',
          'CloudWatch monitoring',
          'Auto Scaling groups',
          'Security groups and NACLs',
          'Cost optimization strategies'
        ]
      }
    ],
    instructor: {
      name: 'Suresh Reddy',
      title: 'AWS Solutions Architect',
      bio: 'Certified AWS Solutions Architect with 10+ years in cloud infrastructure.',
      rating: 4.8,
      students: 2200,
      courses: 18
    },
    start_date: new Date('2024-03-15'),
    end_date: new Date('2024-06-15'),
    location: 'Online + Bangalore',
    max_students: 35,
    enrolled_students: 25,
    rating: 4.7,
    total_reviews: 95,
    tags: ['aws', 'cloud-computing', 'devops', 'infrastructure', 'scalability'],
    meta_title: 'Cloud Computing with AWS - Complete Training',
    meta_description: 'Master AWS cloud computing services and build scalable applications.',
    created_by: 1
  },
  {
    title: 'Mobile App Development with React Native',
    slug: 'mobile-app-development-react-native',
    description: 'Build cross-platform mobile applications using React Native. Learn to create iOS and Android apps with a single codebase.',
    short_description: 'Create cross-platform mobile apps with React Native for iOS and Android.',
    category: 'mobile-development',
    subcategory: 'react-native',
    level: 'intermediate',
    duration: '4 months',
    duration_hours: 240,
    price: 22000,
    original_price: 30000,
    discount_percentage: 27,
    currency: 'INR',
    is_free: false,
    is_featured: true,
    status: 'published',
    skills: ['React Native', 'JavaScript', 'iOS', 'Android', 'Expo', 'Redux', 'Firebase'],
    learning_outcomes: [
      'Build cross-platform mobile applications',
      'Master React Native components and navigation',
      'Integrate with device APIs and sensors',
      'Handle state management in mobile apps',
      'Deploy apps to app stores',
      'Implement push notifications'
    ],
    prerequisites: [
      'Basic knowledge of JavaScript and React',
      'Understanding of mobile app concepts',
      'Familiarity with development tools',
      'Access to Mac for iOS development'
    ],
    curriculum: [
      {
        title: 'React Native Fundamentals',
        duration: '6 weeks',
        topics: [
          'React Native setup and environment',
          'Components and styling',
          'Navigation and routing',
          'State management with Redux',
          'Handling user input',
          'Working with lists and data'
        ]
      },
      {
        title: 'Advanced Features',
        duration: '6 weeks',
        topics: [
          'Device APIs and sensors',
          'Camera and image handling',
          'Location services',
          'Push notifications',
          'Offline data storage',
          'Performance optimization'
        ]
      },
      {
        title: 'Backend Integration',
        duration: '4 weeks',
        topics: [
          'RESTful API integration',
          'Authentication and authorization',
          'Real-time data with WebSockets',
          'Firebase integration',
          'Cloud storage and databases',
          'Error handling and debugging'
        ]
      },
      {
        title: 'Deployment & Publishing',
        duration: '4 weeks',
        topics: [
          'App store preparation',
          'iOS App Store submission',
          'Google Play Store submission',
          'App testing and debugging',
          'Performance monitoring',
          'App updates and maintenance'
        ]
      }
    ],
    instructor: {
      name: 'Neha Gupta',
      title: 'Mobile App Development Lead',
      bio: '8+ years in mobile development with expertise in React Native and native iOS/Android.',
      rating: 4.8,
      students: 1900,
      courses: 14
    },
    start_date: new Date('2024-04-01'),
    end_date: new Date('2024-08-01'),
    location: 'Online + Pune',
    max_students: 30,
    enrolled_students: 20,
    rating: 4.6,
    total_reviews: 75,
    tags: ['react-native', 'mobile-development', 'ios', 'android', 'cross-platform'],
    meta_title: 'Mobile App Development with React Native',
    meta_description: 'Build cross-platform mobile apps with React Native for iOS and Android.',
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
      'Use Flexbox and Grid systems',
      'Implement CSS animations',
      'Create mobile-friendly websites'
    ],
    prerequisites: [
      'Basic computer skills',
      'No prior programming experience required',
      'Access to a text editor',
      'Web browser for testing'
    ],
    curriculum: [
      {
        title: 'HTML5 Fundamentals',
        duration: '2 weeks',
        topics: [
          'HTML structure and syntax',
          'Semantic HTML elements',
          'Forms and input types',
          'Images and media',
          'Links and navigation',
          'HTML5 new features'
        ]
      },
      {
        title: 'CSS3 Styling',
        duration: '2 weeks',
        topics: [
          'CSS selectors and properties',
          'Box model and layout',
          'Colors and typography',
          'Flexbox layout system',
          'CSS Grid system',
          'CSS animations and transitions'
        ]
      }
    ],
    instructor: {
      name: 'Anita Singh',
      title: 'Frontend Development Instructor',
      bio: '5+ years teaching web development fundamentals to beginners.',
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
    tags: ['html', 'css', 'beginner', 'free', 'web-development'],
    meta_title: 'Free HTML & CSS Basics Course',
    meta_description: 'Learn HTML5 and CSS3 fundamentals for free. Perfect for web development beginners.',
    created_by: 1
  }
];

async function seedTrainingPrograms() {
  try {
    console.log('🌱 Starting training programs seeding...');
    
    // Clear existing data
    await TrainingProgram.destroy({ where: {} });
    console.log('🗑️  Cleared existing training programs');
    
    // Insert new data
    const trainingPrograms = await TrainingProgram.bulkCreate(trainingProgramsData);
    console.log(`✅ Created ${trainingPrograms.length} training programs`);
    
    // Display summary
    console.log('\n📊 Training Programs Summary:');
    console.log('============================');
    
    const categories = {};
    trainingPrograms.forEach(program => {
      if (!categories[program.category]) {
        categories[program.category] = { total: 0, featured: 0, free: 0 };
      }
      categories[program.category].total++;
      if (program.is_featured) categories[program.category].featured++;
      if (program.is_free) categories[program.category].free++;
    });
    
    Object.entries(categories).forEach(([category, stats]) => {
      console.log(`${category}: ${stats.total} programs (${stats.featured} featured, ${stats.free} free)`);
    });
    
    console.log('\n🎉 Training programs seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Error seeding training programs:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the seeding function
if (require.main === module) {
  seedTrainingPrograms();
}

module.exports = { seedTrainingPrograms };
