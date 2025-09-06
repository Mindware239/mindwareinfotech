const Testimonial = require('../models/Testimonial');
const { Op } = require('sequelize');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
const getTestimonials = async (req, res, next) => {
  try {
    const { status, limit, page } = req.query;
    
    let whereClause = {};
    if (status) {
      whereClause.testimonial_status = status;
    }

    const limitNum = limit ? parseInt(limit) : 10;
    const offset = page ? (parseInt(page) - 1) * limitNum : 0;

    const testimonials = await Testimonial.findAndCountAll({
      where: whereClause,
      order: [['testimonial_order', 'ASC'], ['created_at', 'DESC']],
      limit: limitNum,
      offset: offset
    });

    res.status(200).json({
      success: true,
      count: testimonials.count,
      data: testimonials.rows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single testimonial
// @route   GET /api/testimonials/:id
// @access  Public
const getTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new testimonial
// @route   POST /api/testimonials
// @access  Private/Admin
const createTestimonial = async (req, res, next) => {
  try {
    const {
      client_name,
      client_designation,
      client_company,
      course,
      testimonial_text,
      client_image,
      success_metrics,
      testimonial_rating,
      testimonial_status,
      testimonial_order
    } = req.body;

    // Validate required fields
    if (!client_name || !testimonial_text) {
      return res.status(400).json({
        success: false,
        message: 'Client name and testimonial text are required'
      });
    }

    const testimonial = await Testimonial.create({
      client_name,
      client_designation,
      client_company,
      course,
      testimonial_text,
      client_image,
      success_metrics: success_metrics ? JSON.parse(success_metrics) : null,
      testimonial_rating: testimonial_rating || 5,
      testimonial_status: testimonial_status || '1',
      testimonial_order: testimonial_order || 0
    });

    res.status(201).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update testimonial
// @route   PUT /api/testimonials/:id
// @access  Private/Admin
const updateTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    const {
      client_name,
      client_designation,
      client_company,
      course,
      testimonial_text,
      client_image,
      success_metrics,
      testimonial_rating,
      testimonial_status,
      testimonial_order
    } = req.body;

    await testimonial.update({
      client_name: client_name || testimonial.client_name,
      client_designation: client_designation || testimonial.client_designation,
      client_company: client_company || testimonial.client_company,
      course: course || testimonial.course,
      testimonial_text: testimonial_text || testimonial.testimonial_text,
      client_image: client_image || testimonial.client_image,
      success_metrics: success_metrics ? JSON.parse(success_metrics) : testimonial.success_metrics,
      testimonial_rating: testimonial_rating || testimonial.testimonial_rating,
      testimonial_status: testimonial_status || testimonial.testimonial_status,
      testimonial_order: testimonial_order || testimonial.testimonial_order
    });

    res.status(200).json({
      success: true,
      data: testimonial
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete testimonial
// @route   DELETE /api/testimonials/:id
// @access  Private/Admin
const deleteTestimonial = async (req, res, next) => {
  try {
    const testimonial = await Testimonial.findByPk(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found'
      });
    }

    await testimonial.destroy();

    res.status(200).json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active testimonials for website
// @route   GET /api/testimonials/active
// @access  Public
const getActiveTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.findAll({
      where: {
        testimonial_status: '1'
      },
      order: [['testimonial_order', 'ASC'], ['created_at', 'DESC']],
      limit: 10
    });

    res.status(200).json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getActiveTestimonials
};
