const express = require('express');
const {
  getBlogs,
  getBlog,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsByCategory,
  searchBlogs,
  likeBlog,
  addComment,
  getFeaturedBlogs
} = require('../controllers/blogController');

const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateBlog, validateObjectId, validateIntegerId, validatePagination } = require('../middleware/validation');
const { uploadBlogImage, handleUploadError } = require('../middleware/blogUpload');

const router = express.Router();

// Public routes
router.get('/', validatePagination, optionalAuth, getBlogs);
router.get('/featured', optionalAuth, getFeaturedBlogs);
router.get('/search', validatePagination, searchBlogs);
router.get('/category/:category', validatePagination, getBlogsByCategory);
router.get('/slug/:slug', optionalAuth, getBlogBySlug);
router.get('/:id', validateIntegerId('id'), optionalAuth, getBlog);

// Protected routes (temporarily removing auth for testing)
router.post('/', uploadBlogImage, handleUploadError, validateBlog, createBlog);
router.put('/:id', validateIntegerId('id'), uploadBlogImage, handleUploadError, validateBlog, updateBlog);
router.delete('/:id', validateIntegerId('id'), deleteBlog);

// User interactions
router.post('/:id/like', protect, validateIntegerId('id'), likeBlog);
router.post('/:id/comments', protect, validateIntegerId('id'), addComment);

module.exports = router;
