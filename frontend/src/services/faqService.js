import api from './api';

const faqService = {
  // Get all FAQs with pagination, search, and filtering
  getFAQs: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.category) queryParams.append('category', params.category);
      if (params.status) queryParams.append('status', params.status);
      if (params.search) queryParams.append('search', params.search);
      if (params.featured) queryParams.append('featured', params.featured);
      if (params.sort) queryParams.append('sort', params.sort);
      if (params.order) queryParams.append('order', params.order);
      
      const response = await api.get(`/faqs?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs:', error);
      throw error.response?.data || error;
    }
  },

  // Get single FAQ by ID
  getFAQ: async (id) => {
    try {
      const response = await api.get(`/faqs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      throw error.response?.data || error;
    }
  },

  // Get featured FAQs
  getFeaturedFAQs: async (limit = 5) => {
    try {
      const response = await api.get(`/faqs/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured FAQs:', error);
      throw error.response?.data || error;
    }
  },

  // Get FAQs by category
  getFAQsByCategory: async (category) => {
    try {
      const response = await api.get(`/faqs/category/${category}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQs by category:', error);
      throw error.response?.data || error;
    }
  },

  // Search FAQs
  searchFAQs: async (query, limit = 10) => {
    try {
      const response = await api.get(`/faqs/search?q=${encodeURIComponent(query)}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error searching FAQs:', error);
      throw error.response?.data || error;
    }
  },

  // Get FAQ categories
  getFAQCategories: async () => {
    try {
      const response = await api.get('/faqs/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching FAQ categories:', error);
      throw error.response?.data || error;
    }
  },

  // Create new FAQ
  createFAQ: async (faqData) => {
    try {
      const response = await api.post('/faqs', faqData);
      return response.data;
    } catch (error) {
      console.error('Error creating FAQ:', error);
      throw error.response?.data || error;
    }
  },

  // Update FAQ
  updateFAQ: async (id, faqData) => {
    try {
      const response = await api.put(`/faqs/${id}`, faqData);
      return response.data;
    } catch (error) {
      console.error('Error updating FAQ:', error);
      throw error.response?.data || error;
    }
  },

  // Delete FAQ
  deleteFAQ: async (id) => {
    try {
      const response = await api.delete(`/faqs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      throw error.response?.data || error;
    }
  },

  // Mark FAQ as helpful
  markHelpful: async (id) => {
    try {
      const response = await api.post(`/faqs/${id}/helpful`);
      return response.data;
    } catch (error) {
      console.error('Error marking FAQ as helpful:', error);
      throw error.response?.data || error;
    }
  },

  // Mark FAQ as not helpful
  markNotHelpful: async (id) => {
    try {
      const response = await api.post(`/faqs/${id}/not-helpful`);
      return response.data;
    } catch (error) {
      console.error('Error marking FAQ as not helpful:', error);
      throw error.response?.data || error;
    }
  }
};

export default faqService;

