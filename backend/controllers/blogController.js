const Blog = require('../models/Blog');
const User = require('../models/User');
const { Op } = require('sequelize');

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
const getBlogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      category,
      status = 'published',
      featured,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    const whereClause = {};

    // Add search filter
    if (search) {
      whereClause[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { excerpt: { [Op.like]: `%${search}%` } },
        { content: { [Op.like]: `%${search}%` } }
      ];
    }

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

    const { count, rows: blogs } = await Blog.findAndCountAll({
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
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog
// @route   GET /api/blogs/:id
// @access  Public
const getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'avatar']
        }
      ]
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment views
    await blog.incrementViews();

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new blog
// @route   POST /api/blogs
// @access  Private/Admin
const createBlog = async (req, res, next) => {
  try {
    const blogData = {
      ...req.body,
      author_id: req.user.id
    };

    const blog = await Blog.create(blogData);

    res.status(201).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Private/Admin
const updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Check if user is author or admin
    if (blog.author_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this blog post'
      });
    }

    await blog.update(req.body);

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Private/Admin
const deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Check if user is author or admin
    if (blog.author_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this blog post'
      });
    }

    await blog.destroy();

    res.status(200).json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get blog by slug
// @route   GET /api/blogs/slug/:slug
// @access  Public
const getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({
      where: { slug: req.params.slug },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'avatar']
        }
      ]
    });

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    // Increment views
    await blog.incrementViews();

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured blogs
// @route   GET /api/blogs/featured
// @access  Public
const getFeaturedBlogs = async (req, res, next) => {
  try {
    const { limit = 5 } = req.query;

    const blogs = await Blog.findAll({
      where: {
        is_featured: true,
        status: 'published'
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'avatar']
        }
      ],
      order: [['created_at', 'DESC']],
      limit: parseInt(limit)
    });

    res.status(200).json({
      success: true,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get blogs by category
// @route   GET /api/blogs/category/:category
// @access  Public
const getBlogsByCategory = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = 'created_at',
      order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;

    const { count, rows: blogs } = await Blog.findAndCountAll({
      where: {
        category: req.params.category,
        status: 'published'
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'avatar']
        }
      ],
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like blog
// @route   POST /api/blogs/:id/like
// @access  Private
const likeBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    await blog.toggleLike();

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search blogs
// @route   GET /api/blogs/search
// @access  Public
const searchBlogs = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
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

    const { count, rows: blogs } = await Blog.findAndCountAll({
      where: {
        [Op.and]: [
          { status: 'published' },
          {
            [Op.or]: [
              { title: { [Op.like]: `%${searchQuery}%` } },
              { excerpt: { [Op.like]: `%${searchQuery}%` } },
              { content: { [Op.like]: `%${searchQuery}%` } },
              { tags: { [Op.like]: `%${searchQuery}%` } }
            ]
          }
        ]
      },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'email', 'avatar']
        }
      ],
      order: [[sort, order.toUpperCase()]],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    res.status(200).json({
      success: true,
      count,
      pages: Math.ceil(count / limit),
      currentPage: parseInt(page),
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add comment to blog
// @route   POST /api/blogs/:id/comment
// @access  Private
const addComment = async (req, res, next) => {
  try {
    const blog = await Blog.findByPk(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog post not found'
      });
    }

    await blog.addComment(req.user.id, req.body.content);

    res.status(200).json({
      success: true,
      message: 'Comment added successfully'
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogBySlug,
  getFeaturedBlogs,
  getBlogsByCategory,
  searchBlogs,
  likeBlog,
  addComment
};