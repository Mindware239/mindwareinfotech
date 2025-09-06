const User = require('../models/User');
const Student = require('../models/Student');
const Blog = require('../models/Blog');
const Internship = require('../models/Internship');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');
const Payment = require('../models/Payment');
const { Op } = require('sequelize');

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalBlogs,
      totalInternships,
      totalGalleryItems,
      totalTestimonials,
      totalPayments,
      recentStudents,
      recentBlogs
    ] = await Promise.all([
      Student.count(),
      Blog.count(),
      Internship.count(),
      Gallery.count(),
      Testimonial.count(),
      Payment.count(),
      Student.findAll({
        limit: 5,
        order: [['created_at', 'DESC']],
        attributes: ['id', 'firstName', 'lastName', 'email', 'created_at']
      }),
      Blog.findAll({
        limit: 5,
        order: [['created_at', 'DESC']],
        attributes: ['id', 'title', 'status', 'created_at']
      })
    ]);

    // Calculate total revenue
    const revenueResult = await Payment.findOne({
      attributes: [
        [Payment.sequelize.fn('SUM', Payment.sequelize.col('amount')), 'totalRevenue']
      ],
      where: { status: 'completed' }
    });

    const totalRevenue = revenueResult ? parseFloat(revenueResult.dataValues.totalRevenue) || 0 : 0;

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalStudents,
          totalBlogs,
          totalInternships,
          totalGalleryItems,
          totalTestimonials,
          totalPayments,
          totalRevenue
        },
        recentStudents,
        recentBlogs
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      role,
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

    // Add role filter
    if (role) {
      whereClause.role = role;
    }

    const { count, rows: users } = await User.findAndCountAll({
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
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single user
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update(req.body);

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system logs
// @route   GET /api/admin/logs
// @access  Private/Admin
const getSystemLogs = async (req, res, next) => {
  try {
    // This would typically read from log files or a logging service
    // For now, return a placeholder response
    res.status(200).json({
      success: true,
      data: {
        logs: [],
        message: 'Log system not implemented yet'
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get system stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getSystemStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalStudents,
      totalBlogs,
      totalInternships,
      totalPayments
    ] = await Promise.all([
      User.count(),
      Student.count(),
      Blog.count(),
      Internship.count(),
      Payment.count()
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalStudents,
        totalBlogs,
        totalInternships,
        totalPayments
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent activity
// @route   GET /api/admin/activity
// @access  Private/Admin
const getRecentActivity = async (req, res, next) => {
  try {
    // This would typically fetch recent activities from a log system
    // For now, return a placeholder response
    res.status(200).json({
      success: true,
      data: {
        activities: [],
        message: 'Activity tracking not implemented yet'
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  getSystemLogs,
  getSystemStats,
  getRecentActivity
};
