import api from './api';

const testimonialService = {
  // Get all testimonials
  getTestimonials: async (params = {}) => {
    try {
      const response = await api.get('/testimonials', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single testimonial
  getTestimonial: async (id) => {
    try {
      const response = await api.get(`/testimonials/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create testimonial
  createTestimonial: async (testimonialData) => {
    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(testimonialData).forEach(key => {
        if (testimonialData[key] && typeof testimonialData[key] === 'object' && testimonialData[key].file) {
          // Handle file uploads
          formData.append(key, testimonialData[key].file);
        } else if (key === 'success_metrics' && typeof testimonialData[key] === 'string') {
          // Handle JSON string for success_metrics
          try {
            const parsed = JSON.parse(testimonialData[key]);
            formData.append(key, JSON.stringify(parsed));
          } catch (e) {
            formData.append(key, testimonialData[key]);
          }
        } else if (testimonialData[key] !== null && testimonialData[key] !== undefined) {
          // Handle regular form fields
          formData.append(key, testimonialData[key]);
        }
      });

      const response = await api.post('/testimonials', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update testimonial
  updateTestimonial: async (id, testimonialData) => {
    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(testimonialData).forEach(key => {
        if (testimonialData[key] && typeof testimonialData[key] === 'object' && testimonialData[key].file) {
          // Handle file uploads
          formData.append(key, testimonialData[key].file);
        } else if (key === 'success_metrics' && typeof testimonialData[key] === 'string') {
          // Handle JSON string for success_metrics
          try {
            const parsed = JSON.parse(testimonialData[key]);
            formData.append(key, JSON.stringify(parsed));
          } catch (e) {
            formData.append(key, testimonialData[key]);
          }
        } else if (testimonialData[key] !== null && testimonialData[key] !== undefined) {
          // Handle regular form fields
          formData.append(key, testimonialData[key]);
        }
      });

      const response = await api.put(`/testimonials/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete testimonial
  deleteTestimonial: async (id) => {
    try {
      const response = await api.delete(`/testimonials/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get testimonials by course
  getTestimonialsByCourse: async (course, params = {}) => {
    try {
      const response = await api.get(`/testimonials/course/${course}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get active testimonials
  getActiveTestimonials: async (params = {}) => {
    try {
      const response = await api.get('/testimonials', { 
        params: { status: '1', ...params } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search testimonials
  searchTestimonials: async (query, params = {}) => {
    try {
      const response = await api.get('/testimonials/search', { 
        params: { q: query, ...params } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update testimonial status
  updateTestimonialStatus: async (id, status) => {
    try {
      const response = await api.patch(`/testimonials/${id}/status`, { testimonial_status: status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update testimonial order
  updateTestimonialOrder: async (id, order) => {
    try {
      const response = await api.patch(`/testimonials/${id}/order`, { testimonial_order: order });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get testimonial statistics
  getTestimonialStats: async () => {
    try {
      const response = await api.get('/testimonials/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bulk update testimonials
  bulkUpdateTestimonials: async (testimonialIds, updateData) => {
    try {
      const response = await api.patch('/testimonials/bulk-update', {
        ids: testimonialIds,
        data: updateData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bulk delete testimonials
  bulkDeleteTestimonials: async (testimonialIds) => {
    try {
      const response = await api.delete('/testimonials/bulk-delete', {
        data: { ids: testimonialIds }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get recent testimonials
  getRecentTestimonials: async (limit = 10) => {
    try {
      const response = await api.get('/testimonials/recent', { 
        params: { limit } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get testimonial analytics
  getTestimonialAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/testimonials/analytics', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default testimonialService;