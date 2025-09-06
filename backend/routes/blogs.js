const express = require('express');
const {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogsByCategory,
  searchBlogs,
  likeBlog,
  addComment
} = require('../controllers/blogController');

const { protect, authorize, optionalAuth } = require('../middleware/auth');
const { validateBlog, validateObjectId, validatePagination } = require('../middleware/validation');

const router = express.Router();

// Public routes
router.get('/', validatePagination, optionalAuth, getBlogs);
router.get('/search', validatePagination, searchBlogs);
router.get('/category/:category', validatePagination, getBlogsByCategory);
router.get('/:id', validateObjectId('id'), optionalAuth, getBlog);

// Protected routes
router.post('/', protect, authorize('admin', 'instructor'), validateBlog, createBlog);
router.put('/:id', protect, authorize('admin', 'instructor'), validateObjectId('id'), validateBlog, updateBlog);
router.delete('/:id', protect, authorize('admin'), validateObjectId('id'), deleteBlog);

// User interactions
router.post('/:id/like', protect, validateObjectId('id'), likeBlog);
router.post('/:id/comments', protect, validateObjectId('id'), addComment);

module.exports = router;
