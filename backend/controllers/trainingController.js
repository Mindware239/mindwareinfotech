const TrainingProgram = require('../models/TrainingProgram');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// @desc    Get all training programs
// @route   GET /api/training-programs
// @access  Public
const getTrainingPrograms = async (req, res, next) => {
  try {
    console.log('getTrainingPrograms called with query:', req.query);
    
    const {
      page = 1,
      limit = 10,
      search,
      category,
      subcategory,
      level,
      status = 'published',
      featured,
      instructor_id,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Add search filter
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { short_description: { [Op.like]: `%${search}%` } },
        { tags: { [Op.contains]: [search] } }
      ];
    }

    // Add category filter
    if (category) {
      whereClause.category = category;
    }

    // Add subcategory filter
    if (subcategory) {
      whereClause.subcategory = subcategory;
    }

    // Add level filter
    if (level) {
      whereClause.level = level;
    }

    // Add status filter
    if (status) {
      whereClause.status = status;
    }

    // Add featured filter
    if (featured) {
      whereClause.is_featured = featured === 'true';
    }

    // Add instructor filter
    if (instructor_id) {
      whereClause.instructor_id = instructor_id;
    }

    console.log('Where clause:', whereClause);

    const { count, rows: trainingPrograms } = await TrainingProgram.findAndCountAll({
      where: whereClause,
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    console.log('Found training programs:', count);

    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: trainingPrograms
    });
  } catch (error) {
    console.error('Error in getTrainingPrograms:', error);
    next(error);
  }
};

// @desc    Get single training program by ID
// @route   GET /api/training-programs/:id
// @access  Public
const getTrainingProgram = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trainingProgram = await TrainingProgram.findByPk(id);

    if (!trainingProgram) {
      return res.status(404).json({
        success: false,
        message: 'Training program not found'
      });
    }

    res.status(200).json({
      success: true,
      data: trainingProgram
    });
  } catch (error) {
    console.error('Error in getTrainingProgram:', error);
    next(error);
  }
};

// @desc    Get single training program by slug
// @route   GET /api/training-programs/slug/:slug
// @access  Public
const getTrainingProgramBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    const trainingProgram = await TrainingProgram.findOne({
      where: { slug }
    });

    if (!trainingProgram) {
      return res.status(404).json({
        success: false,
        message: 'Training program not found'
      });
    }

    res.status(200).json({
      success: true,
      data: trainingProgram
    });
  } catch (error) {
    console.error('Error in getTrainingProgramBySlug:', error);
    next(error);
  }
};

// @desc    Get training programs by category
// @route   GET /api/training-programs/category/:category
// @access  Public
const getTrainingProgramsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const { limit = 10, featured } = req.query;

    const whereClause = {
      category,
      status: 'published'
    };

    if (featured) {
      whereClause.is_featured = featured === 'true';
    }

    const trainingPrograms = await TrainingProgram.findAll({
      where: whereClause,
      order: [['is_featured', 'DESC'], ['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      count: trainingPrograms.length,
      data: trainingPrograms
    });
  } catch (error) {
    console.error('Error in getTrainingProgramsByCategory:', error);
    next(error);
  }
};

// @desc    Get featured training programs
// @route   GET /api/training-programs/featured
// @access  Public
const getFeaturedTrainingPrograms = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const trainingPrograms = await TrainingProgram.findAll({
      where: {
        is_featured: true,
        status: 'published'
      },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      count: trainingPrograms.length,
      data: trainingPrograms
    });
  } catch (error) {
    console.error('Error in getFeaturedTrainingPrograms:', error);
    next(error);
  }
};

// @desc    Get training program categories
// @route   GET /api/training-programs/categories
// @access  Public
const getTrainingCategories = async (req, res, next) => {
  try {
    const { CourseCategory } = require('../models');
    
    const categories = await CourseCategory.findAll({
      where: {
        is_active: true
      },
      order: [['sort_order', 'ASC'], ['name', 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error in getTrainingCategories:', error);
    next(error);
  }
};

// @desc    Create training program
// @route   POST /api/training-programs
// @access  Private/Admin
const createTrainingProgram = async (req, res, next) => {
  try {
    const trainingProgramData = {
      ...req.body,
      created_by: req.user?.id || req.body.created_by || 1,
      updated_by: req.user?.id || req.body.created_by || 1
    };

    // Generate slug if not provided
    if (!trainingProgramData.slug) {
      let baseSlug = trainingProgramData.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      
      // Check if slug exists and make it unique
      let slug = baseSlug;
      let counter = 1;
      while (await TrainingProgram.findOne({ where: { slug } })) {
        slug = `${baseSlug}-${counter}`;
        counter++;
      }
      trainingProgramData.slug = slug;
    }

    const trainingProgram = await TrainingProgram.create(trainingProgramData);

    res.status(201).json({
      success: true,
      data: trainingProgram
    });
  } catch (error) {
    console.error('Error in createTrainingProgram:', error);
    
    // Handle validation errors
    if (error.name === 'SequelizeValidationError') {
      const validationErrors = error.errors.map(err => ({
        field: err.path,
        message: err.message,
        value: err.value
      }));
      
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }
    
    // Handle unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'A record with this information already exists',
        field: error.errors[0]?.path || 'unknown'
      });
    }
    
    next(error);
  }
};

// @desc    Update training program
// @route   PUT /api/training-programs/:id
// @access  Private/Admin
const updateTrainingProgram = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updateData = {
      ...req.body,
      updated_by: req.user?.id || req.body.created_by || 1
    };

    const trainingProgram = await TrainingProgram.findByPk(id);

    if (!trainingProgram) {
      return res.status(404).json({
        success: false,
        message: 'Training program not found'
      });
    }

    await trainingProgram.update(updateData);

    res.status(200).json({
      success: true,
      data: trainingProgram
    });
  } catch (error) {
    console.error('Error in updateTrainingProgram:', error);
    next(error);
  }
};

// @desc    Delete training program
// @route   DELETE /api/training-programs/:id
// @access  Private/Admin
const deleteTrainingProgram = async (req, res, next) => {
  try {
    const { id } = req.params;

    const trainingProgram = await TrainingProgram.findByPk(id);

    if (!trainingProgram) {
      return res.status(404).json({
        success: false,
        message: 'Training program not found'
      });
    }

    await trainingProgram.destroy();

    res.status(200).json({
      success: true,
      message: 'Training program deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteTrainingProgram:', error);
    next(error);
  }
};

// @desc    Get training program stats
// @route   GET /api/training-programs/stats
// @access  Public
const getTrainingStats = async (req, res, next) => {
  try {
    const stats = await TrainingProgram.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'total'],
        [sequelize.fn('SUM', sequelize.col('enrolled_students')), 'total_enrolled'],
        [sequelize.fn('AVG', sequelize.col('rating')), 'avg_rating']
      ],
      where: {
        status: 'published'
      },
      group: ['category']
    });

    const totalPrograms = await TrainingProgram.count({
      where: { status: 'published' }
    });

    const totalEnrolled = await TrainingProgram.sum('enrolled_students', {
      where: { status: 'published' }
    });

    res.status(200).json({
      success: true,
      data: {
        totalPrograms,
        totalEnrolled: totalEnrolled || 0,
        byCategory: stats
      }
    });
  } catch (error) {
    console.error('Error in getTrainingStats:', error);
    next(error);
  }
};

// @desc    Add sample training programs (for development)
// @route   POST /api/training-programs/seed
// @access  Public (development only)
const seedTrainingPrograms = async (req, res, next) => {
  try {
    // Only allow in development
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'This endpoint is only available in development'
      });
    }

    const samplePrograms = [
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
        skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
        learning_outcomes: [
          'Build responsive websites using HTML5 and CSS3',
          'Create interactive web applications with JavaScript',
          'Develop modern React applications with hooks and context',
          'Build RESTful APIs with Node.js and Express'
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
      },
      {
        title: 'Mobile App Development with React Native',
        slug: 'mobile-app-development-react-native',
        description: 'Build cross-platform mobile applications using React Native. Learn to create iOS and Android apps with a single codebase.',
        short_description: 'Master mobile app development with React Native for iOS and Android.',
        category: 'mobile-development',
        subcategory: 'react-native',
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
        skills: ['React Native', 'JavaScript', 'iOS', 'Android', 'Expo', 'Redux'],
        learning_outcomes: [
          'Build cross-platform mobile applications',
          'Master React Native components and navigation',
          'Integrate with device APIs and third-party libraries',
          'Deploy apps to App Store and Google Play'
        ],
        prerequisites: [
          'Basic knowledge of JavaScript and React',
          'Understanding of mobile app concepts',
          'Experience with development tools'
        ],
        instructor: {
          name: 'Suresh Kumar',
          title: 'Mobile App Development Expert',
          bio: '8+ years in mobile app development with React Native',
          rating: 4.8,
          students: 1500,
          courses: 10
        },
        start_date: new Date('2024-03-15'),
        end_date: new Date('2024-06-15'),
        location: 'Online + Bangalore',
        max_students: 25,
        enrolled_students: 18,
        rating: 4.6,
        total_reviews: 95,
        tags: ['react-native', 'mobile', 'ios', 'android', 'cross-platform'],
        meta_title: 'Mobile App Development with React Native',
        meta_description: 'Learn to build cross-platform mobile apps with React Native.',
        created_by: 1
      },
      {
        title: 'Cloud Computing with AWS',
        slug: 'cloud-computing-aws',
        description: 'Master Amazon Web Services (AWS) cloud platform. Learn to deploy, manage, and scale applications in the cloud.',
        short_description: 'Learn cloud computing fundamentals and AWS services.',
        category: 'cloud-computing',
        subcategory: 'aws',
        level: 'intermediate',
        duration: '2 months',
        duration_hours: 120,
        price: 12000,
        original_price: 18000,
        discount_percentage: 33,
        currency: 'INR',
        is_free: false,
        is_featured: false,
        status: 'published',
        skills: ['AWS', 'EC2', 'S3', 'Lambda', 'RDS', 'CloudFormation'],
        learning_outcomes: [
          'Understand cloud computing concepts',
          'Master AWS core services',
          'Deploy and manage applications on AWS',
          'Implement security and monitoring best practices'
        ],
        prerequisites: [
          'Basic understanding of networking',
          'Familiarity with command line interface',
          'Basic knowledge of databases'
        ],
        instructor: {
          name: 'Ravi Sharma',
          title: 'AWS Solutions Architect',
          bio: 'Certified AWS Solutions Architect with 10+ years experience',
          rating: 4.9,
          students: 2000,
          courses: 12
        },
        start_date: new Date('2024-04-01'),
        end_date: new Date('2024-06-01'),
        location: 'Online',
        max_students: 30,
        enrolled_students: 24,
        rating: 4.7,
        total_reviews: 110,
        tags: ['aws', 'cloud', 'devops', 'infrastructure', 'scalability'],
        meta_title: 'Cloud Computing with AWS - Complete Course',
        meta_description: 'Master AWS cloud platform and services.',
        created_by: 1
      }
    ];

    // Clear existing data
    await TrainingProgram.destroy({ where: {} });
    
    // Insert sample data
    const programs = await TrainingProgram.bulkCreate(samplePrograms);

    res.status(201).json({
      success: true,
      message: `Successfully seeded ${programs.length} training programs`,
      count: programs.length
    });
  } catch (error) {
    console.error('Error seeding training programs:', error);
    next(error);
  }
};

module.exports = {
  getTrainingPrograms,
  getTrainingProgram,
  getTrainingProgramBySlug,
  getTrainingProgramsByCategory,
  getFeaturedTrainingPrograms,
  getTrainingCategories,
  createTrainingProgram,
  updateTrainingProgram,
  deleteTrainingProgram,
  getTrainingStats,
  seedTrainingPrograms
};
