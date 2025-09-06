const Certificate = require('../models/Certificate');
const { Op } = require('sequelize');

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Public
const getCertificates = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Add search filter
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }

    // Add category filter
    if (category) {
      whereClause.category = category;
    }

    const { count, rows: certificates } = await Certificate.findAndCountAll({
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
      data: certificates
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single certificate
// @route   GET /api/certificates/:id
// @access  Public
const getCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new certificate
// @route   POST /api/certificates
// @access  Private/Admin
const createCertificate = async (req, res, next) => {
  try {
    const certificateData = {
      ...req.body,
      created_by: req.user.id
    };

    const certificate = await Certificate.create(certificateData);

    res.status(201).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update certificate
// @route   PUT /api/certificates/:id
// @access  Private/Admin
const updateCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    await certificate.update(req.body);

    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private/Admin
const deleteCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    await certificate.destroy();

    res.status(200).json({
      success: true,
      message: 'Certificate deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Generate certificate
// @route   POST /api/certificates/generate
// @access  Private/Admin/Instructor
const generateCertificate = async (req, res, next) => {
  try {
    const certificateData = {
      ...req.body,
      created_by: req.user.id,
      verification_code: Math.random().toString(36).substr(2, 9).toUpperCase()
    };

    const certificate = await Certificate.create(certificateData);

    res.status(201).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify certificate
// @route   GET /api/certificates/verify/:code
// @access  Public
const verifyCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findOne({
      where: { verification_code: req.params.code }
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found or invalid verification code'
      });
    }

    res.status(200).json({
      success: true,
      data: certificate
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my certificates
// @route   GET /api/certificates/my-certificates
// @access  Private
const getMyCertificates = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10
    } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: certificates } = await Certificate.findAndCountAll({
      where: { student_id: req.user.id },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: certificates
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Revoke certificate
// @route   PUT /api/certificates/:id/revoke
// @access  Private/Admin
const revokeCertificate = async (req, res, next) => {
  try {
    const certificate = await Certificate.findByPk(req.params.id);

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    await certificate.update({ status: 'revoked' });

    res.status(200).json({
      success: true,
      message: 'Certificate revoked successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCertificates,
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate,
  generateCertificate,
  verifyCertificate,
  getMyCertificates,
  revokeCertificate
};
