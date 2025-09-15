const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class CourseService {
  // Get all courses
  async getCourses(params = {}) {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.category) queryParams.append('category', params.category);
      if (params.status) queryParams.append('status', params.status);
      if (params.featured) queryParams.append('featured', params.featured);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.page) queryParams.append('page', params.page);
      if (params.search) queryParams.append('search', params.search);
      
      const url = `${API_BASE_URL}/courses${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch courses');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  }

  // Get course by ID
  async getCourseById(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses/${id}`);
      if (!response.ok) throw new Error('Failed to fetch course');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error;
    }
  }

  // Get courses by category
  async getCoursesByCategory(categorySlug) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses?category=${categorySlug}&status=published`);
      if (!response.ok) throw new Error('Failed to fetch courses by category');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching courses by category:', error);
      throw error;
    }
  }

  // Get featured courses
  async getFeaturedCourses(limit = 6) {
    try {
      const response = await fetch(`${API_BASE_URL}/courses?featured=true&status=published&limit=${limit}`);
      if (!response.ok) throw new Error('Failed to fetch featured courses');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching featured courses:', error);
      throw error;
    }
  }

  // Get course categories
  async getCourseCategories() {
    try {
      const response = await fetch(`${API_BASE_URL}/course-categories/active`);
      if (!response.ok) throw new Error('Failed to fetch course categories');
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching course categories:', error);
      throw error;
    }
  }

  // Search courses
  async searchCourses(query, filters = {}) {
    try {
      const searchParams = new URLSearchParams();
      searchParams.append('search', query);
      
      Object.keys(filters).forEach(key => {
        if (filters[key]) searchParams.append(key, filters[key]);
      });
      
      const response = await fetch(`${API_BASE_URL}/courses?${searchParams.toString()}`);
      if (!response.ok) throw new Error('Failed to search courses');
      
      return await response.json();
    } catch (error) {
      console.error('Error searching courses:', error);
      throw error;
    }
  }

  // Get course pricing info
  getCoursePricing(course) {
    const originalPrice = parseFloat(course.original_price) || parseFloat(course.price);
    const currentPrice = parseFloat(course.price);
    const discountPercentage = parseFloat(course.discount_percentage) || 0;
    
    const hasDiscount = discountPercentage > 0 && originalPrice > currentPrice;
    const savings = hasDiscount ? originalPrice - currentPrice : 0;
    
    return {
      originalPrice,
      currentPrice,
      discountPercentage,
      hasDiscount,
      savings,
      currency: course.currency || 'INR',
      isFree: course.is_free || currentPrice === 0,
      installmentAvailable: course.installment_available || false,
      installmentCount: course.installment_count || 1,
      enrollmentFee: parseFloat(course.enrollment_fee) || 0
    };
  }

  // Format price for display
  formatPrice(price, currency = 'INR') {
    if (price === 0) return 'Free';
    
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
    
    return formatter.format(price);
  }

  // Get course duration in readable format
  getCourseDuration(course) {
    const duration = course.duration || 0;
    const durationUnit = course.duration_unit || 'hours';
    
    if (durationUnit === 'hours') {
      if (duration < 24) {
        return `${duration} hours`;
      } else if (duration < 168) { // 7 days
        const days = Math.round(duration / 24);
        return `${days} day${days > 1 ? 's' : ''}`;
      } else {
        const weeks = Math.round(duration / 168);
        return `${weeks} week${weeks > 1 ? 's' : ''}`;
      }
    } else if (durationUnit === 'days') {
      if (duration < 7) {
        return `${duration} day${duration > 1 ? 's' : ''}`;
      } else {
        const weeks = Math.round(duration / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''}`;
      }
    } else if (durationUnit === 'weeks') {
      if (duration < 4) {
        return `${duration} week${duration > 1 ? 's' : ''}`;
      } else {
        const months = Math.round(duration / 4);
        return `${months} month${months > 1 ? 's' : ''}`;
      }
    } else if (durationUnit === 'months') {
      return `${duration} month${duration > 1 ? 's' : ''}`;
    }
    
    return `${duration} ${durationUnit}`;
  }

  // Get course level display
  getCourseLevel(level) {
    const levelMap = {
      'beginner': 'Beginner',
      'intermediate': 'Intermediate', 
      'advanced': 'Advanced',
      'expert': 'Expert'
    };
    
    return levelMap[level] || level;
  }

  // Get course status display
  getCourseStatus(status) {
    const statusMap = {
      'draft': 'Draft',
      'published': 'Published',
      'archived': 'Archived'
    };
    
    return statusMap[status] || status;
  }
}

export default new CourseService();