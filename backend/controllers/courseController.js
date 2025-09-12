const Course = require('../models/Course');
const { Op } = require('sequelize');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res, next) => {
  try {
    console.log('getCourses called with query:', req.query);
    
    const {
      page = 1,
      limit = 10,
      search,
      category,
      level,
      status,
      featured,
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
        { short_description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Add category filter
    if (category) {
      whereClause.category = category;
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

    console.log('Where clause:', whereClause);

    const { count, rows: courses } = await Course.findAndCountAll({
      where: whereClause,
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    console.log('Found courses:', count);

    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: courses
    });
  } catch (error) {
    console.error('Error in getCourses:', error);
    next(error);
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
const getCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin/Instructor
const createCourse = async (req, res, next) => {
  try {
    console.log('createCourse called with body:', req.body);
    console.log('User:', req.user);
    
    const courseData = {
      ...req.body,
      instructor_id: req.user ? req.user.id : 1 // Default to user 1 if no auth
    };

    // Extract SEO fields from nested seo object
    if (courseData.seo && typeof courseData.seo === 'object') {
      const seoFields = courseData.seo;
      delete courseData.seo; // Remove the nested seo object
      
      // Add SEO fields to the top level
      Object.keys(seoFields).forEach(key => {
        if (seoFields[key] !== null && seoFields[key] !== undefined && seoFields[key] !== '') {
          courseData[key] = seoFields[key];
        }
      });
    }

    console.log('Course data to create:', courseData);

    const course = await Course.create(courseData);

    console.log('Course created successfully:', course.toJSON());

    res.status(201).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Error creating course:', error);
    next(error);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin/Instructor
const updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const updateData = { ...req.body };

    // Extract SEO fields from nested seo object
    if (updateData.seo && typeof updateData.seo === 'object') {
      const seoFields = updateData.seo;
      delete updateData.seo; // Remove the nested seo object
      
      // Add SEO fields to the top level
      Object.keys(seoFields).forEach(key => {
        if (seoFields[key] !== null && seoFields[key] !== undefined && seoFields[key] !== '') {
          updateData[key] = seoFields[key];
        }
      });
    }

    await course.update(updateData);

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByPk(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    await course.destroy();

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get courses by category
// @route   GET /api/courses/category/:category
// @access  Public
const getCoursesByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const {
      page = 1,
      limit = 10,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: courses } = await Course.findAndCountAll({
      where: { category },
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get courses by instructor
// @route   GET /api/courses/instructor/:instructorId
// @access  Public
const getCoursesByInstructor = async (req, res, next) => {
  try {
    const { instructorId } = req.params;
    const {
      page = 1,
      limit = 10,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: courses } = await Course.findAndCountAll({
      where: { instructor_id: instructorId },
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured courses
// @route   GET /api/courses/featured
// @access  Public
const getFeaturedCourses = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const courses = await Course.findAll({
      where: { 
        is_featured: true,
        status: 'published'
      },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: courses
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  getCoursesByCategory,
  getCoursesByInstructor,
  getFeaturedCourses
};
