const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const CourseCategory = sequelize.define('CourseCategory', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  slug: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      notEmpty: true,
      len: [2, 100]
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  icon: {
    type: DataTypes.STRING(100),
    allowNull: true,
    defaultValue: 'fas fa-laptop-code'
  },
  color: {
    type: DataTypes.STRING(7),
    allowNull: true,
    defaultValue: '#3B82F6',
    validate: {
      is: /^#[0-9A-F]{6}$/i
    }
  },
  is_active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  sort_order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  meta_title: {
    type: DataTypes.STRING(60),
    allowNull: true
  },
  meta_description: {
    type: DataTypes.STRING(160),
    allowNull: true
  },
  meta_keywords: {
    type: DataTypes.STRING(500),
    allowNull: true
  }
}, {
  tableName: 'course_categories',
  hooks: {
    beforeCreate: (category) => {
      if (!category.slug && category.name) {
        category.slug = category.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
    },
    beforeUpdate: (category) => {
      if (category.changed('name') && !category.slug) {
        category.slug = category.name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
      }
    }
  }
});

// Instance methods
CourseCategory.prototype.getCourseCount = async function() {
  const Course = require('./Course');
  return await Course.count({
    where: { category_id: this.id }
  });
};

CourseCategory.prototype.getActiveCourseCount = async function() {
  const Course = require('./Course');
  return await Course.count({
    where: { 
      category_id: this.id,
      status: 'published'
    }
  });
};

// Class methods
CourseCategory.getActiveCategories = async function() {
  return await this.findAll({
    where: { is_active: true },
    order: [['sort_order', 'ASC'], ['name', 'ASC']]
  });
};

CourseCategory.getWithStats = async function() {
  const Course = require('./Course');
  return await this.findAll({
    include: [{
      model: Course,
      as: 'courses',
      attributes: ['id'],
      where: { status: 'published' },
      required: false
    }],
    attributes: {
      include: [
        [sequelize.fn('COUNT', sequelize.col('courses.id')), 'course_count']
      ]
    },
    group: ['CourseCategory.id'],
    order: [['sort_order', 'ASC'], ['name', 'ASC']]
  });
};

// Define associations
CourseCategory.associate = (models) => {
  // CourseCategory has many Courses
  CourseCategory.hasMany(models.Course, {
    foreignKey: 'category_id',
    as: 'courses'
  });
};

module.exports = CourseCategory;
