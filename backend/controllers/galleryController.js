const Gallery = require('../models/Gallery');
const { Op } = require('sequelize');

// @desc    Get all gallery items
// @route   GET /api/gallery
// @access  Public
const getGalleryItems = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      category,
      status = 'active',
      featured,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Add category filter
    if (category) {
      whereClause.category = category;
    }

    // Add status filter
    if (status) {
      whereClause.status = status;
    }

    // Add featured filter
    if (featured === 'true') {
      whereClause.is_featured = true;
    }

    const { count, rows: galleryItems } = await Gallery.findAndCountAll({
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
      data: galleryItems
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single gallery item
// @route   GET /api/gallery/:id
// @access  Public
const getGalleryItem = async (req, res, next) => {
  try {
    const galleryItem = await Gallery.findByPk(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: galleryItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new gallery item
// @route   POST /api/gallery
// @access  Private/Admin
const createGalleryItem = async (req, res, next) => {
  try {
    const galleryData = {
      ...req.body,
      created_by: req.user.id
    };

    const galleryItem = await Gallery.create(galleryData);

    res.status(201).json({
      success: true,
      data: galleryItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update gallery item
// @route   PUT /api/gallery/:id
// @access  Private/Admin
const updateGalleryItem = async (req, res, next) => {
  try {
    const galleryItem = await Gallery.findByPk(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    await galleryItem.update(req.body);

    res.status(200).json({
      success: true,
      data: galleryItem
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete gallery item
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
const deleteGalleryItem = async (req, res, next) => {
  try {
    const galleryItem = await Gallery.findByPk(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    await galleryItem.destroy();

    res.status(200).json({
      success: true,
      message: 'Gallery item deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured gallery items
// @route   GET /api/gallery/featured
// @access  Public
const getFeaturedGalleryItems = async (req, res, next) => {
  try {
    const { limit = 6 } = req.query;

    const galleryItems = await Gallery.findAll({
      where: {
        is_featured: true,
        status: 'active'
      },
      order: [['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: galleryItems
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get gallery by category
// @route   GET /api/gallery/category/:category
// @access  Public
const getGalleryByCategory = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: galleryItems } = await Gallery.findAndCountAll({
      where: {
        category: req.params.category,
        status: 'active'
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
      data: galleryItems
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search gallery items
// @route   GET /api/gallery/search
// @access  Public
const searchGallery = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 12,
      q: searchQuery,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    if (!searchQuery) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const offset = (page - 1) * limit;

    const { count, rows: galleryItems } = await Gallery.findAndCountAll({
      where: {
        [Op.and]: [
          { status: 'active' },
          {
            [Op.or]: [
              { title: { [Op.like]: `%${searchQuery}%` } },
              { description: { [Op.like]: `%${searchQuery}%` } },
              { category: { [Op.like]: `%${searchQuery}%` } }
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
      data: galleryItems
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like gallery item
// @route   POST /api/gallery/:id/like
// @access  Private
const likeGalleryItem = async (req, res, next) => {
  try {
    const galleryItem = await Gallery.findByPk(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: 'Gallery item not found'
      });
    }

    // Simple like toggle - you can implement more complex logic
    const currentLikes = galleryItem.likes || 0;
    await galleryItem.update({ likes: currentLikes + 1 });

    res.status(200).json({
      success: true,
      data: galleryItem
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGalleryItems,
  getGalleryItem,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  getFeaturedGalleryItems,
  getGalleryByCategory,
  searchGallery,
  likeGalleryItem
};
