const Gallery = require('../models/Gallery');
const { Op } = require('sequelize');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for gallery image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads/gallery');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'gallery-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit per image
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images are allowed.'));
    }
  }
});

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
    console.log('Received gallery creation request');
    console.log('Body:', req.body);
    console.log('Files:', req.files);
    console.log('User:', req.user);

    const galleryData = {
      ...req.body,
      created_by: req.user ? req.user.id : 1 // Fallback for testing
    };

    // Ensure required fields have default values
    if (!galleryData.status) {
      galleryData.status = 'active';
    }
    if (!galleryData.is_featured) {
      galleryData.is_featured = false;
    }
    if (!galleryData.is_public) {
      galleryData.is_public = true;
    }

    // Handle file uploads
    if (req.files && req.files.images) {
      console.log('Processing uploaded files:', req.files.images);
      const images = [];
      
      // Handle single image upload
      if (Array.isArray(req.files.images)) {
        req.files.images.forEach((file, index) => {
          console.log(`Processing file ${index}:`, file.originalname);
          images.push({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            url: `/uploads/gallery/${file.filename}`,
            size: file.size,
            mimetype: file.mimetype,
            isPrimary: index === 0 // First image is primary
          });
        });
      } else {
        // Single file upload
        const file = req.files.images;
        console.log('Processing single file:', file.originalname);
        images.push({
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          url: `/uploads/gallery/${file.filename}`,
          size: file.size,
          mimetype: file.mimetype,
          isPrimary: true
        });
      }
      
      galleryData.images = images;
      console.log('Processed images:', images);
    } else {
      console.log('No files uploaded');
    }

    // Parse tags if they're sent as a string
    if (galleryData.tags && typeof galleryData.tags === 'string') {
      galleryData.tags = galleryData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    console.log('Final gallery data:', galleryData);

    const galleryItem = await Gallery.create(galleryData);
    console.log('Gallery item created:', galleryItem);

    res.status(201).json({
      success: true,
      data: galleryItem
    });
  } catch (error) {
    console.error('Error creating gallery item:', error);
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

    const updateData = { ...req.body };

    // Handle file uploads
    if (req.files && req.files.images) {
      const images = [];
      
      // Handle single image upload
      if (Array.isArray(req.files.images)) {
        req.files.images.forEach((file, index) => {
          images.push({
            filename: file.filename,
            originalName: file.originalname,
            path: file.path,
            url: `/uploads/gallery/${file.filename}`,
            size: file.size,
            mimetype: file.mimetype,
            isPrimary: index === 0 // First image is primary
          });
        });
      } else {
        // Single file upload
        const file = req.files.images;
        images.push({
          filename: file.filename,
          originalName: file.originalname,
          path: file.path,
          url: `/uploads/gallery/${file.filename}`,
          size: file.size,
          mimetype: file.mimetype,
          isPrimary: true
        });
      }
      
      // If updating images, replace existing ones
      updateData.images = images;
    }

    // Parse tags if they're sent as a string
    if (updateData.tags && typeof updateData.tags === 'string') {
      updateData.tags = updateData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
    }

    await galleryItem.update(updateData);

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
  likeGalleryItem,
  upload
};
