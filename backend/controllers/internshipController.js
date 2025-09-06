const Internship = require('../models/Internship');
const { Op } = require('sequelize');

// @desc    Get all internships
// @route   GET /api/internships
// @access  Public
const getInternships = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      type,
      status = 'active',
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
        { company: { [Op.like]: `%${search}%` } }
      ];
    }

    // Add category filter
    if (category) {
      whereClause.category = category;
    }

    // Add type filter
    if (type) {
      whereClause.type = type;
    }

    // Add status filter
    if (status) {
      whereClause.status = status;
    }

    const { count, rows: internships } = await Internship.findAndCountAll({
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
      data: internships
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single internship
// @route   GET /api/internships/:id
// @access  Public
const getInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findByPk(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    res.status(200).json({
      success: true,
      data: internship
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new internship
// @route   POST /api/internships
// @access  Private/Admin
const createInternship = async (req, res, next) => {
  try {
    const internshipData = {
      ...req.body,
      created_by: req.user.id
    };

    const internship = await Internship.create(internshipData);

    res.status(201).json({
      success: true,
      data: internship
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update internship
// @route   PUT /api/internships/:id
// @access  Private/Admin
const updateInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findByPk(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    await internship.update(req.body);

    res.status(200).json({
      success: true,
      data: internship
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete internship
// @route   DELETE /api/internships/:id
// @access  Private/Admin
const deleteInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findByPk(req.params.id);

    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    await internship.destroy();

    res.status(200).json({
      success: true,
      message: 'Internship deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get internships by category
// @route   GET /api/internships/category/:category
// @access  Public
const getInternshipsByCategory = async (req, res, next) => {
  try {
    const { category } = req.params;
    const {
      page = 1,
      limit = 10,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: internships } = await Internship.findAndCountAll({
      where: { category, status: 'active' },
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: internships
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search internships
// @route   GET /api/internships/search
// @access  Public
const searchInternships = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      q: searchTerm,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    if (!searchTerm) {
      return res.status(400).json({
        success: false,
        message: 'Search term is required'
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows: internships } = await Internship.findAndCountAll({
      where: {
        [Op.and]: [
          { status: 'active' },
          {
            [Op.or]: [
              { title: { [Op.like]: `%${searchTerm}%` } },
              { description: { [Op.like]: `%${searchTerm}%` } },
              { company: { [Op.like]: `%${searchTerm}%` } }
            ]
          }
        ]
      },
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: internships
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply to internship
// @route   POST /api/internships/:id/apply
// @access  Private
const applyToInternship = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { coverLetter, resume } = req.body;

    const internship = await Internship.findByPk(id);
    if (!internship) {
      return res.status(404).json({
        success: false,
        message: 'Internship not found'
      });
    }

    if (internship.status !== 'active') {
      return res.status(400).json({
        success: false,
        message: 'This internship is not currently accepting applications'
      });
    }

    // Here you would typically create an application record
    // For now, we'll just return a success message
    res.status(200).json({
      success: true,
      message: 'Application submitted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my applications
// @route   GET /api/internships/my/applications
// @access  Private
const getMyApplications = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10
    } = req.query;

    const offset = (page - 1) * limit;

    // Here you would typically fetch applications for the current user
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
  getInternships,
  getInternship,
  createInternship,
  updateInternship,
  deleteInternship,
  getInternshipsByCategory,
  searchInternships,
  applyToInternship,
  getMyApplications
};
