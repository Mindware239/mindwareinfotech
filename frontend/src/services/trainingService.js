import api from './api';

const trainingService = {
  // Get all training programs
  getTrainingPrograms: async (params = {}) => {
    try {
      const response = await api.get('/training-programs', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching training programs:', error);
      throw error;
    }
  },

  // Get single training program by ID
  getTrainingProgram: async (id) => {
    try {
      const response = await api.get(`/training-programs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching training program:', error);
      throw error;
    }
  },

  // Get single training program by slug
  getTrainingProgramBySlug: async (slug) => {
    try {
      const response = await api.get(`/training-programs/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching training program by slug:', error);
      throw error;
    }
  },

  // Get training programs by category
  getTrainingProgramsByCategory: async (category, params = {}) => {
    try {
      const response = await api.get(`/training-programs/category/${category}`, { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching training programs by category:', error);
      throw error;
    }
  },

  // Get featured training programs
  getFeaturedTrainingPrograms: async (limit = 6) => {
    try {
      const response = await api.get('/training-programs/featured', { 
        params: { limit } 
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured training programs:', error);
      throw error;
    }
  },

  // Get training categories
  getTrainingCategories: async () => {
    try {
      const response = await api.get('/training-programs/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching training categories:', error);
      throw error;
    }
  },

  // Get course categories (for admin panel)
  getCourseCategories: async () => {
    try {
      const response = await api.get('/course-categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching course categories:', error);
      throw error;
    }
  },

  // Get training stats
  getTrainingStats: async () => {
    try {
      const response = await api.get('/training-programs/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching training stats:', error);
      throw error;
    }
  },

  // Search training programs
  searchTrainingPrograms: async (query, params = {}) => {
    try {
      const response = await api.get('/training-programs', {
        params: { search: query, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching training programs:', error);
      throw error;
    }
  },

  // Get training programs by level
  getTrainingProgramsByLevel: async (level, params = {}) => {
    try {
      const response = await api.get('/training-programs', {
        params: { level, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching training programs by level:', error);
      throw error;
    }
  },

  // Get free training programs
  getFreeTrainingPrograms: async (params = {}) => {
    try {
      const response = await api.get('/training-programs', {
        params: { is_free: true, ...params }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching free training programs:', error);
      throw error;
    }
  },

  // Utility functions
  getPricing: (program) => {
    const currentPrice = program.price;
    const originalPrice = program.original_price || program.price;
    const hasDiscount = program.discount_percentage > 0 && program.original_price > program.price;
    const discountPercentage = program.discount_percentage || 0;
    const isFree = program.is_free || program.price === 0;

    return {
      currentPrice,
      originalPrice,
      hasDiscount,
      discountPercentage,
      isFree,
      currency: program.currency
    };
  },

  getDuration: (program) => {
    return program.duration || `${program.duration_hours || 120} hours`;
  },

  getLevel: (level) => {
    const levels = {
      'beginner': 'Beginner',
      'intermediate': 'Intermediate',
      'advanced': 'Advanced',
      'expert': 'Expert'
    };
    return levels[level] || 'Beginner';
  },

  formatPrice: (price, currency = 'INR') => {
    if (price === 0) return 'Free';
    
    const formatter = new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
    
    return formatter.format(price);
  },

  getCategoryDisplayName: (category) => {
    const categories = {
      'web-development': 'Web Development',
      'mobile-development': 'Mobile Development',
      'data-science': 'Data Science',
      'cloud-computing': 'Cloud Computing',
      'cybersecurity': 'Cybersecurity',
      'devops': 'DevOps',
      'ui-ux': 'UI/UX Design',
      'digital-marketing': 'Digital Marketing'
    };
    return categories[category] || category;
  },

  getSubcategoryDisplayName: (subcategory) => {
    const subcategories = {
      'frontend': 'Frontend Development',
      'backend': 'Backend Development',
      'full-stack': 'Full-Stack Development',
      'react-native': 'React Native',
      'flutter': 'Flutter',
      'ios': 'iOS Development',
      'android': 'Android Development',
      'python': 'Python',
      'java': 'Java',
      'aws': 'Amazon Web Services',
      'azure': 'Microsoft Azure',
      'gcp': 'Google Cloud Platform',
      'ui-design': 'UI Design',
      'ux-design': 'UX Design',
      'seo': 'SEO',
      'social-media': 'Social Media Marketing'
    };
    return subcategories[subcategory] || subcategory;
  },

  // CRUD Operations for Admin
  createTrainingProgram: async (programData) => {
    try {
      const response = await api.post('/training-programs', programData);
      return response.data;
    } catch (error) {
      console.error('Error creating training program:', error);
      throw error;
    }
  },

  updateTrainingProgram: async (id, programData) => {
    try {
      const response = await api.put(`/training-programs/${id}`, programData);
      return response.data;
    } catch (error) {
      console.error('Error updating training program:', error);
      throw error;
    }
  },

  deleteTrainingProgram: async (id) => {
    try {
      const response = await api.delete(`/training-programs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting training program:', error);
      throw error;
    }
  }
};

export default trainingService;