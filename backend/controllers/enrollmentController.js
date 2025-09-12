const Enrollment = require('../models/Enrollment');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const notificationService = require('../services/notificationService');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/enrollments');
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
    const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and documents are allowed.'));
    }
  }
});

// @desc    Get all enrollments
// @route   GET /api/enrollments
// @access  Private (Admin)
const getEnrollments = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      course,
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
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } }
      ];
    }

    // Add status filter
    if (status) {
      whereClause.status = status;
    }

    // Add course filter
    if (course) {
      whereClause.courseInterest = course;
    }

    const { count, rows: enrollments } = await Enrollment.findAndCountAll({
      where: whereClause,
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single enrollment
// @route   GET /api/enrollments/:id
// @access  Private (Admin)
const getEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new enrollment
// @route   POST /api/enrollments
// @access  Public
const createEnrollment = async (req, res, next) => {
  try {
    const enrollmentData = { ...req.body };

    // Handle file uploads
    if (req.files) {
      if (req.files.profilePhoto) {
        enrollmentData.profilePhoto = {
          filename: req.files.profilePhoto[0].filename,
          originalName: req.files.profilePhoto[0].originalname,
          path: req.files.profilePhoto[0].path,
          size: req.files.profilePhoto[0].size,
          mimetype: req.files.profilePhoto[0].mimetype
        };
      }

      if (req.files.resume) {
        enrollmentData.resume = {
          filename: req.files.resume[0].filename,
          originalName: req.files.resume[0].originalname,
          path: req.files.resume[0].path,
          size: req.files.resume[0].size,
          mimetype: req.files.resume[0].mimetype
        };
      }

      if (req.files.idProof) {
        enrollmentData.idProof = {
          filename: req.files.idProof[0].filename,
          originalName: req.files.idProof[0].originalname,
          path: req.files.idProof[0].path,
          size: req.files.idProof[0].size,
          mimetype: req.files.idProof[0].mimetype
        };
      }

      if (req.files.addressProof) {
        enrollmentData.addressProof = {
          filename: req.files.addressProof[0].filename,
          originalName: req.files.addressProof[0].originalname,
          path: req.files.addressProof[0].path,
          size: req.files.addressProof[0].size,
          mimetype: req.files.addressProof[0].mimetype
        };
      }

      if (req.files.certificates) {
        enrollmentData.certificates = req.files.certificates.map(file => ({
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype
        }));
      }
    }

    // Set default values
    enrollmentData.status = enrollmentData.status || 'pending';
    enrollmentData.paymentStatus = enrollmentData.paymentStatus || 'pending';

    const enrollment = await Enrollment.create(enrollmentData);

    // Send notifications after successful enrollment
    try {
      const studentData = {
        name: `${enrollment.firstName} ${enrollment.lastName}`,
        email: enrollment.email,
        phone: enrollment.phone,
        courseName: enrollment.courseInterest
      };

      // Send notifications (WhatsApp + Email)
      const notificationResults = await notificationService.sendEnrollmentConfirmation(
        studentData, 
        ['whatsapp', 'email']
      );

      console.log('Notification results:', notificationResults);
    } catch (notificationError) {
      console.error('Notification failed:', notificationError);
      // Don't fail the enrollment if notifications fail
    }

    res.status(201).json({
      success: true,
      message: 'Enrollment created successfully',
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enrollment
// @route   PUT /api/enrollments/:id
// @access  Private (Admin)
const updateEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    const updateData = { ...req.body };

    // Handle file uploads
    if (req.files) {
      if (req.files.profilePhoto) {
        updateData.profilePhoto = {
          filename: req.files.profilePhoto[0].filename,
          originalName: req.files.profilePhoto[0].originalname,
          path: req.files.profilePhoto[0].path,
          size: req.files.profilePhoto[0].size,
          mimetype: req.files.profilePhoto[0].mimetype
        };
      }

      if (req.files.resume) {
        updateData.resume = {
          filename: req.files.resume[0].filename,
          originalName: req.files.resume[0].originalname,
          path: req.files.resume[0].path,
          size: req.files.resume[0].size,
          mimetype: req.files.resume[0].mimetype
        };
      }

      if (req.files.idProof) {
        updateData.idProof = {
          filename: req.files.idProof[0].filename,
          originalName: req.files.idProof[0].originalname,
          path: req.files.idProof[0].path,
          size: req.files.idProof[0].size,
          mimetype: req.files.idProof[0].mimetype
        };
      }

      if (req.files.addressProof) {
        updateData.addressProof = {
          filename: req.files.addressProof[0].filename,
          originalName: req.files.addressProof[0].originalname,
          path: req.files.addressProof[0].path,
          size: req.files.addressProof[0].size,
          mimetype: req.files.addressProof[0].mimetype
        };
      }

      if (req.files.certificates) {
        updateData.certificates = req.files.certificates.map(file => ({
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          size: file.size,
          mimetype: file.mimetype
        }));
      }
    }

    await enrollment.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Enrollment updated successfully',
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete enrollment
// @route   DELETE /api/enrollments/:id
// @access  Private (Admin)
const deleteEnrollment = async (req, res, next) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    // Delete associated files
    const filesToDelete = [
      enrollment.profilePhoto?.path,
      enrollment.resume?.path,
      enrollment.idProof?.path,
      enrollment.addressProof?.path,
      ...(enrollment.certificates || []).map(cert => cert.path)
    ].filter(Boolean);

    filesToDelete.forEach(filePath => {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await enrollment.destroy();

    res.status(200).json({
      success: true,
      message: 'Enrollment deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update enrollment status
// @route   PATCH /api/enrollments/:id/status
// @access  Private (Admin)
const updateEnrollmentStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const enrollment = await Enrollment.findByPk(req.params.id);

    if (!enrollment) {
      return res.status(404).json({
        success: false,
        message: 'Enrollment not found'
      });
    }

    await enrollment.update({ status });

    res.status(200).json({
      success: true,
      message: 'Enrollment status updated successfully',
      data: enrollment
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get enrollment statistics
// @route   GET /api/enrollments/stats
// @access  Private (Admin)
const getEnrollmentStats = async (req, res, next) => {
  try {
    const totalEnrollments = await Enrollment.count();
    const pendingEnrollments = await Enrollment.count({ where: { status: 'pending' } });
    const approvedEnrollments = await Enrollment.count({ where: { status: 'approved' } });
    const enrolledStudents = await Enrollment.count({ where: { status: 'enrolled' } });
    const completedEnrollments = await Enrollment.count({ where: { status: 'completed' } });

    // Get enrollments by course
    const enrollmentsByCourse = await Enrollment.findAll({
      attributes: [
        'courseInterest',
        [Enrollment.sequelize.fn('COUNT', Enrollment.sequelize.col('id')), 'count']
      ],
      group: ['courseInterest'],
      order: [[Enrollment.sequelize.fn('COUNT', Enrollment.sequelize.col('id')), 'DESC']]
    });

    // Get monthly enrollments for the last 12 months
    const monthlyEnrollments = await Enrollment.findAll({
      attributes: [
        [Enrollment.sequelize.fn('DATE_FORMAT', Enrollment.sequelize.col('created_at'), '%Y-%m'), 'month'],
        [Enrollment.sequelize.fn('COUNT', Enrollment.sequelize.col('id')), 'count']
      ],
      where: {
        created_at: {
          [Op.gte]: new Date(new Date().setMonth(new Date().getMonth() - 12))
        }
      },
      group: [Enrollment.sequelize.fn('DATE_FORMAT', Enrollment.sequelize.col('created_at'), '%Y-%m')],
      order: [[Enrollment.sequelize.fn('DATE_FORMAT', Enrollment.sequelize.col('created_at'), '%Y-%m'), 'ASC']]
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalEnrollments,
        pending: pendingEnrollments,
        approved: approvedEnrollments,
        enrolled: enrolledStudents,
        completed: completedEnrollments,
        byCourse: enrollmentsByCourse,
        monthly: monthlyEnrollments
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search enrollments
// @route   GET /api/enrollments/search
// @access  Private (Admin)
const searchEnrollments = async (req, res, next) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const { count, rows: enrollments } = await Enrollment.findAndCountAll({
      where: {
        [Op.or]: [
          { firstName: { [Op.like]: `%${q}%` } },
          { lastName: { [Op.like]: `%${q}%` } },
          { email: { [Op.like]: `%${q}%` } },
          { phone: { [Op.like]: `%${q}%` } },
          { courseInterest: { [Op.like]: `%${q}%` } }
        ]
      },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent enrollments
// @route   GET /api/enrollments/recent
// @access  Private (Admin)
const getRecentEnrollments = async (req, res, next) => {
  try {
    const { limit = 10 } = req.query;

    const enrollments = await Enrollment.findAll({
      order: [['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk update enrollments
// @route   PATCH /api/enrollments/bulk-update
// @access  Private (Admin)
const bulkUpdateEnrollments = async (req, res, next) => {
  try {
    const { ids, data } = req.body;

    await Enrollment.update(data, {
      where: {
        id: {
          [Op.in]: ids
        }
      }
    });

    res.status(200).json({
      success: true,
      message: `${ids.length} enrollments updated successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Bulk delete enrollments
// @route   DELETE /api/enrollments/bulk-delete
// @access  Private (Admin)
const bulkDeleteEnrollments = async (req, res, next) => {
  try {
    const { ids } = req.body;

    // Get enrollments to delete files
    const enrollments = await Enrollment.findAll({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    });

    // Delete associated files
    enrollments.forEach(enrollment => {
      const filesToDelete = [
        enrollment.profilePhoto?.path,
        enrollment.resume?.path,
        enrollment.idProof?.path,
        enrollment.addressProof?.path,
        ...(enrollment.certificates || []).map(cert => cert.path)
      ].filter(Boolean);

      filesToDelete.forEach(filePath => {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    });

    await Enrollment.destroy({
      where: {
        id: {
          [Op.in]: ids
        }
      }
    });

    res.status(200).json({
      success: true,
      message: `${ids.length} enrollments deleted successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if user is enrolled in a course
// @route   GET /api/enrollments/check/:courseId
// @access  Private
const checkEnrollment = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({
      where: {
        userId: userId,
        courseId: courseId,
        status: 'approved'
      }
    });

    res.status(200).json({
      success: true,
      data: {
        isEnrolled: !!enrollment,
        enrollment: enrollment || null
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's enrolled courses
// @route   GET /api/enrollments/my-courses
// @access  Private
const getMyEnrollments = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: enrollments } = await Enrollment.findAndCountAll({
      where: {
        userId: userId,
        status: 'approved'
      },
      include: [
        {
          model: require('../models/Course'),
          as: 'course',
          attributes: ['id', 'title', 'description', 'category', 'level', 'duration', 'price', 'currency']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: enrollments
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Check if user can access course content
// @route   GET /api/enrollments/access/:courseId
// @access  Private
const checkCourseAccess = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    const enrollment = await Enrollment.findOne({
      where: {
        userId: userId,
        courseId: courseId,
        status: 'approved'
      },
      include: [
        {
          model: require('../models/Course'),
          as: 'course',
          attributes: ['id', 'title', 'access_level', 'price']
        }
      ]
    });

    const hasAccess = !!enrollment;
    
    res.status(200).json({
      success: true,
      data: {
        hasAccess,
        enrollment: enrollment || null,
        course: enrollment?.course || null
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getEnrollments,
  getEnrollment,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
  updateEnrollmentStatus,
  getEnrollmentStats,
  searchEnrollments,
  getRecentEnrollments,
  bulkUpdateEnrollments,
  bulkDeleteEnrollments,
  checkEnrollment,
  getMyEnrollments,
  checkCourseAccess,
  upload
};
