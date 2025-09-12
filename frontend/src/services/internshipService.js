import api from './api';

const internshipService = {
  // Get all internships
  getInternships: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      
      const response = await api.get(`/internships?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching internships:', error);
      throw error.response?.data || error;
    }
  },

  // Get single internship by ID
  getInternshipById: async (id) => {
    try {
      const response = await api.get(`/internships/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching internship:', error);
      throw error.response?.data || error;
    }
  },

  // Create new internship
  createInternship: async (internshipData) => {
    try {
      console.log('Creating internship with data:', internshipData);
      const response = await api.post('/internships', internshipData);
      console.log('Internship created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating internship:', error);
      throw error.response?.data || error;
    }
  },

  // Update internship
  updateInternship: async (id, internshipData) => {
    try {
      const response = await api.put(`/internships/${id}`, internshipData);
      return response.data;
    } catch (error) {
      console.error('Error updating internship:', error);
      throw error.response?.data || error;
    }
  },

  // Delete internship
  deleteInternship: async (id) => {
    try {
      const response = await api.delete(`/internships/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting internship:', error);
      throw error.response?.data || error;
    }
  }
};

export default internshipService;