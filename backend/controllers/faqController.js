const FAQ = require('../models/FAQ');
const User = require('../models/User');
const { Op } = require('sequelize');
const { sequelize } = require('../config/database');

// @desc    Get all FAQs
// @route   GET /api/faqs
// @access  Public
const getFAQs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      status = 'active',
      search,
      featured,
      sort = 'priority',
      order = 'DESC'
    } = req.query;

    const whereClause = {};

    // Filter by status
    if (status !== 'all') {
      whereClause.status = status;
    }

    // Filter by category
    if (category) {
      whereClause.category = category;
    }

    // Filter by featured
    if (featured === 'true') {
      whereClause.is_featured = true;
    }

    // Search functionality
    if (search) {
      whereClause[Op.or] = [
        { question: { [Op.like]: `%${search}%` } },
        { answer: { [Op.like]: `%${search}%` } },
        { tags: { [Op.like]: `%${search}%` } }
      ];
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const { count, rows: faqs } = await FAQ.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: offset
    });

    res.status(200).json({
      success: true,
      count: count,
      data: faqs,
      pages: Math.ceil(count / parseInt(limit)),
      currentPage: parseInt(page)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single FAQ
// @route   GET /api/faqs/:id
// @access  Public
const getFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        }
      ]
    });

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    // Increment views
    await faq.incrementViews();

    res.status(200).json({
      success: true,
      data: faq
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new FAQ
// @route   POST /api/faqs
// @access  Private/Admin
const createFAQ = async (req, res, next) => {
  try {
    const faqData = {
      ...req.body,
      created_by: req.user?.id || 1 // Default admin user if no auth
    };

    const faq = await FAQ.create(faqData);

    res.status(201).json({
      success: true,
      data: faq
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update FAQ
// @route   PUT /api/faqs/:id
// @access  Private/Admin
const updateFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByPk(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    const updateData = {
      ...req.body,
      updated_by: req.user?.id || 1
    };

    await faq.update(updateData);

    res.status(200).json({
      success: true,
      data: faq
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete FAQ
// @route   DELETE /api/faqs/:id
// @access  Private/Admin
const deleteFAQ = async (req, res, next) => {
  try {
    const faq = await FAQ.findByPk(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    await faq.destroy();

    res.status(200).json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get FAQs by category
// @route   GET /api/faqs/category/:category
// @access  Public
const getFAQsByCategory = async (req, res, next) => {
  try {
    const faqs = await FAQ.getByCategory(req.params.category);

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured FAQs
// @route   GET /api/faqs/featured
// @access  Public
const getFeaturedFAQs = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;
    const faqs = await FAQ.getFeatured(parseInt(limit));

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search FAQs
// @route   GET /api/faqs/search
// @access  Public
const searchFAQs = async (req, res, next) => {
  try {
    const { q, limit = 10 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const faqs = await FAQ.search(q);

    res.status(200).json({
      success: true,
      count: faqs.length,
      data: faqs.slice(0, parseInt(limit))
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark FAQ as helpful
// @route   POST /api/faqs/:id/helpful
// @access  Public
const markHelpful = async (req, res, next) => {
  try {
    const faq = await FAQ.findByPk(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    await faq.markHelpful();

    res.status(200).json({
      success: true,
      message: 'Thank you for your feedback!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark FAQ as not helpful
// @route   POST /api/faqs/:id/not-helpful
// @access  Public
const markNotHelpful = async (req, res, next) => {
  try {
    const faq = await FAQ.findByPk(req.params.id);

    if (!faq) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found'
      });
    }

    await faq.markNotHelpful();

    res.status(200).json({
      success: true,
      message: 'Thank you for your feedback!'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get FAQ categories
// @route   GET /api/faqs/categories
// @access  Public
const getFAQCategories = async (req, res, next) => {
  try {
    const categories = await FAQ.findAll({
      attributes: [
        'category',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      where: {
        status: 'active'
      },
      group: ['category'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']]
    });

    res.status(200).json({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFAQs,
  getFAQ,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  getFAQsByCategory,
  getFeaturedFAQs,
  searchFAQs,
  markHelpful,
  markNotHelpful,
  getFAQCategories
};
