const Banner = require('../models/Banner');
const { Op } = require('sequelize');

// @desc    Get all banners
// @route   GET /api/banners
// @access  Public
const getBanners = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      banner_type,
      is_active,
      sort = 'banner_position',
      order = 'ASC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Add filters
    if (banner_type) whereClause.banner_type = banner_type;
    if (is_active !== undefined && is_active !== null) {
      whereClause.is_active = is_active === 'true' || is_active === true;
    }

    const { count, rows: banners } = await Banner.findAndCountAll({
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
      data: banners
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single banner
// @route   GET /api/banners/:id
// @access  Public
const getBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new banner
// @route   POST /api/banners
// @access  Private/Admin
const createBanner = async (req, res, next) => {
  try {
    const bannerData = {
      ...req.body,
      created_by: req.user?.id || 1 // Default admin user
    };

    // Handle file upload
    if (req.file) {
      bannerData.image_url = `/uploads/banners/${req.file.filename}`;
    }

    const banner = await Banner.create(bannerData);

    res.status(201).json({
      success: true,
      message: 'Banner created successfully',
      data: banner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update banner
// @route   PUT /api/banners/:id
// @access  Private/Admin
const updateBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    // Handle file upload
    if (req.file) {
      req.body.image_url = `/uploads/banners/${req.file.filename}`;
    }

    await banner.update(req.body);

    res.status(200).json({
      success: true,
      message: 'Banner updated successfully',
      data: banner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete banner
// @route   DELETE /api/banners/:id
// @access  Private/Admin
const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    await banner.destroy();

    res.status(200).json({
      success: true,
      message: 'Banner deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get active banners by type
// @route   GET /api/banners/active/:type
// @access  Public
const getActiveBannersByType = async (req, res, next) => {
  try {
    const { type } = req.params;
    const { limit = 5 } = req.query;

    const banners = await Banner.findAll({
      where: {
        banner_type: type,
        is_active: true,
        [Op.or]: [
          { start_date: null },
          { start_date: { [Op.lte]: new Date() } }
        ],
        [Op.or]: [
          { end_date: null },
          { end_date: { [Op.gte]: new Date() } }
        ]
      },
      order: [['banner_position', 'ASC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: banners
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update banner position
// @route   PUT /api/banners/:id/position
// @access  Private/Admin
const updateBannerPosition = async (req, res, next) => {
  try {
    const { position } = req.body;
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    await banner.update({ banner_position: position });

    res.status(200).json({
      success: true,
      message: 'Banner position updated successfully',
      data: banner
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle banner status
// @route   PUT /api/banners/:id/toggle
// @access  Private/Admin
const toggleBannerStatus = async (req, res, next) => {
  try {
    const banner = await Banner.findByPk(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: 'Banner not found'
      });
    }

    await banner.update({ is_active: !banner.is_active });

    res.status(200).json({
      success: true,
      message: `Banner ${banner.is_active ? 'activated' : 'deactivated'} successfully`,
      data: banner
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBanners,
  getBanner,
  createBanner,
  updateBanner,
  deleteBanner,
  getActiveBannersByType,
  updateBannerPosition,
  toggleBannerStatus
};
