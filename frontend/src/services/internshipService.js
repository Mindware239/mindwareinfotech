import api from './api';

const internshipService = {
  // Get all internships
  getInternships: async (params = {}) => {
    try {
      const response = await api.get('/internships', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single internship
  getInternship: async (id) => {
    try {
      const response = await api.get(`/internships/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create internship
  createInternship: async (internshipData) => {
    try {
      const response = await api.post('/internships', internshipData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update internship
  updateInternship: async (id, internshipData) => {
    try {
      const response = await api.put(`/internships/${id}`, internshipData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete internship
  deleteInternship: async (id) => {
    try {
      const response = await api.delete(`/internships/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get internships by category
  getInternshipsByCategory: async (category, params = {}) => {
    try {
      const response = await api.get(`/internships/category/${category}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search internships
  searchInternships: async (query, params = {}) => {
    try {
      const response = await api.get('/internships/search', { 
        params: { q: query, ...params } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Apply to internship
  applyToInternship: async (id, applicationData) => {
    try {
      const response = await api.post(`/internships/${id}/apply`, applicationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get my applications
  getMyApplications: async (params = {}) => {
    try {
      const response = await api.get('/internships/my/applications', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get featured internships
  getFeaturedInternships: async (limit = 6) => {
    try {
      const response = await api.get('/internships', { 
        params: { featured: true, limit } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get active internships
  getActiveInternships: async (params = {}) => {
    try {
      const response = await api.get('/internships', { 
        params: { status: 'active', ...params } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get internship categories
  getInternshipCategories: async () => {
    try {
      const response = await api.get('/internships/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default internshipService;
