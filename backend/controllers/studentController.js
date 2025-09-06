const Student = require('../models/Student');
const { Op } = require('sequelize');

// @desc    Get all students
// @route   GET /api/students
// @access  Private/Admin/Instructor
const getStudents = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Add search filter
    if (search) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${search}%` } },
        { lastName: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } }
      ];
    }

    // Add status filter
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: students } = await Student.findAndCountAll({
      where: whereClause,
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      attributes: { exclude: ['password'] }
    });

    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single student
// @route   GET /api/students/:id
// @access  Private/Admin/Instructor
const getStudent = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private/Admin/Instructor
const updateStudent = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await student.update(req.body);

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private/Admin
const deleteStudent = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    await student.destroy();

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student profile
// @route   GET /api/students/profile/me
// @access  Private/Student
const getStudentProfile = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.user.id, {
      attributes: { exclude: ['password'] }
    });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update current student profile
// @route   PUT /api/students/profile/me
// @access  Private/Student
const updateStudentProfile = async (req, res, next) => {
  try {
    const student = await Student.findByPk(req.user.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student profile not found'
      });
    }

    // Remove sensitive fields that shouldn't be updated via this route
    const { password, role, ...updateData } = req.body;

    await student.update(updateData);

    res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student applications
// @route   GET /api/students/applications/me
// @access  Private/Student
const getStudentApplications = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10
    } = req.query;

    const offset = (page - 1) * limit;

    // Here you would typically fetch applications for the current student
    // For now, we'll return an empty array
    res.status(200).json({
      success: true,
      count: 0,
      pages: 0,
      currentPage: parseInt(page),
      data: []
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student courses
// @route   GET /api/students/courses/me
// @access  Private/Student
const getStudentCourses = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10
    } = req.query;

    const offset = (page - 1) * limit;

    // Here you would typically fetch courses for the current student
    // For now, we'll return an empty array
    res.status(200).json({
      success: true,
      count: 0,
      pages: 0,
      currentPage: parseInt(page),
      data: []
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  getStudentProfile,
  updateStudentProfile,
  getStudentApplications,
  getStudentCourses
};
