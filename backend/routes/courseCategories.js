const express = require('express');
const router = express.Router();
const CourseCategory = require('../models/CourseCategory');
const { protect, isAdmin } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Get all categories
router.get('/', async (req, res) => {
  try {
    const { include_stats = false } = req.query;
    
    let categories;
    if (include_stats === 'true') {
      categories = await CourseCategory.getWithStats();
    } else {
      categories = await CourseCategory.findAll({
        order: [['sort_order', 'ASC'], ['name', 'ASC']]
      });
    }
    
    res.json(categories);
  } catch (error) {
    console.error('Error fetching course categories:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// Get active categories (public)
router.get('/active', async (req, res) => {
  try {
    const categories = await CourseCategory.getActiveCategories();
    res.json(categories);
  } catch (error) {
    console.error('Error fetching active categories:', error);
    res.status(500).json({ error: 'Failed to fetch active categories' });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const category = await CourseCategory.findByPk(id);
    
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    res.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    res.status(500).json({ error: 'Failed to fetch category' });
  }
});

// Create new category (Admin only)
router.post('/', protect, isAdmin, [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('slug').trim().isLength({ min: 2, max: 100 }).withMessage('Slug must be 2-100 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description too long'),
  body('icon').optional().trim().isLength({ max: 100 }).withMessage('Icon class too long'),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Invalid color format'),
  body('sort_order').optional().isInt({ min: 0 }).withMessage('Sort order must be a positive integer'),
  body('is_active').optional().isBoolean().withMessage('is_active must be boolean'),
  body('meta_title').optional().trim().isLength({ max: 60 }).withMessage('Meta title too long'),
  body('meta_description').optional().trim().isLength({ max: 160 }).withMessage('Meta description too long'),
  body('meta_keywords').optional().trim().isLength({ max: 500 }).withMessage('Meta keywords too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const categoryData = req.body;
    
    // Check if slug already exists
    const existingCategory = await CourseCategory.findOne({
      where: { slug: categoryData.slug }
    });
    
    if (existingCategory) {
      return res.status(400).json({ error: 'Category with this slug already exists' });
    }
    
    const category = await CourseCategory.create(categoryData);
    res.status(201).json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    res.status(500).json({ error: 'Failed to create category' });
  }
});

// Update category (Admin only)
router.put('/:id', protect, isAdmin, [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters'),
  body('slug').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Slug must be 2-100 characters'),
  body('description').optional().trim().isLength({ max: 1000 }).withMessage('Description too long'),
  body('icon').optional().trim().isLength({ max: 100 }).withMessage('Icon class too long'),
  body('color').optional().matches(/^#[0-9A-F]{6}$/i).withMessage('Invalid color format'),
  body('sort_order').optional().isInt({ min: 0 }).withMessage('Sort order must be a positive integer'),
  body('is_active').optional().isBoolean().withMessage('is_active must be boolean'),
  body('meta_title').optional().trim().isLength({ max: 60 }).withMessage('Meta title too long'),
  body('meta_description').optional().trim().isLength({ max: 160 }).withMessage('Meta description too long'),
  body('meta_keywords').optional().trim().isLength({ max: 500 }).withMessage('Meta keywords too long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const categoryData = req.body;
    
    const category = await CourseCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Check if slug already exists (excluding current category)
    if (categoryData.slug && categoryData.slug !== category.slug) {
      const existingCategory = await CourseCategory.findOne({
        where: { 
          slug: categoryData.slug,
          id: { [require('sequelize').Op.ne]: id }
        }
      });
      
      if (existingCategory) {
        return res.status(400).json({ error: 'Category with this slug already exists' });
      }
    }
    
    await category.update(categoryData);
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Partial update category (Admin only)
router.patch('/:id', protect, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const category = await CourseCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    await category.update(updateData);
    res.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    res.status(500).json({ error: 'Failed to update category' });
  }
});

// Delete category (Admin only)
router.delete('/:id', protect, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await CourseCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    // Check if category has courses
    const Course = require('../models/Course');
    const courseCount = await Course.count({ where: { category_id: id } });
    
    if (courseCount > 0) {
      return res.status(400).json({ 
        error: `Cannot delete category. It has ${courseCount} course(s) associated with it.` 
      });
    }
    
    await category.destroy();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Error deleting category:', error);
    res.status(500).json({ error: 'Failed to delete category' });
  }
});

// Get category statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;
    
    const category = await CourseCategory.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: 'Category not found' });
    }
    
    const stats = {
      total_courses: await category.getCourseCount(),
      active_courses: await category.getActiveCourseCount()
    };
    
    res.json(stats);
  } catch (error) {
    console.error('Error fetching category stats:', error);
    res.status(500).json({ error: 'Failed to fetch category statistics' });
  }
});

module.exports = router;
