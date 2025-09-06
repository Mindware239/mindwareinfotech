import api from './api';

const enrollmentService = {
  // Get all enrollments
  getEnrollments: async (params = {}) => {
    try {
      const response = await api.get('/enrollments', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single enrollment
  getEnrollment: async (id) => {
    try {
      const response = await api.get(`/enrollments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create enrollment
  createEnrollment: async (enrollmentData) => {
    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(enrollmentData).forEach(key => {
        if (key === 'certificates' && Array.isArray(enrollmentData[key])) {
          // Handle multiple certificates
          enrollmentData[key].forEach((cert, index) => {
            if (cert.file) {
              formData.append(`certificates[${index}]`, cert.file);
            }
          });
        } else if (enrollmentData[key] && typeof enrollmentData[key] === 'object' && enrollmentData[key].file) {
          // Handle single file uploads
          formData.append(key, enrollmentData[key].file);
        } else if (enrollmentData[key] !== null && enrollmentData[key] !== undefined) {
          // Handle regular form fields
          formData.append(key, enrollmentData[key]);
        }
      });

      const response = await api.post('/enrollments', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update enrollment
  updateEnrollment: async (id, enrollmentData) => {
    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(enrollmentData).forEach(key => {
        if (key === 'certificates' && Array.isArray(enrollmentData[key])) {
          // Handle multiple certificates
          enrollmentData[key].forEach((cert, index) => {
            if (cert.file) {
              formData.append(`certificates[${index}]`, cert.file);
            }
          });
        } else if (enrollmentData[key] && typeof enrollmentData[key] === 'object' && enrollmentData[key].file) {
          // Handle single file uploads
          formData.append(key, enrollmentData[key].file);
        } else if (enrollmentData[key] !== null && enrollmentData[key] !== undefined) {
          // Handle regular form fields
          formData.append(key, enrollmentData[key]);
        }
      });

      const response = await api.put(`/enrollments/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete enrollment
  deleteEnrollment: async (id) => {
    try {
      const response = await api.delete(`/enrollments/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update enrollment status
  updateEnrollmentStatus: async (id, status) => {
    try {
      const response = await api.patch(`/enrollments/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get enrollments by status
  getEnrollmentsByStatus: async (status, params = {}) => {
    try {
      const response = await api.get(`/enrollments/status/${status}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search enrollments
  searchEnrollments: async (query, params = {}) => {
    try {
      const response = await api.get('/enrollments/search', { 
        params: { q: query, ...params } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get enrollment statistics
  getEnrollmentStats: async () => {
    try {
      const response = await api.get('/enrollments/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Export enrollments
  exportEnrollments: async (params = {}) => {
    try {
      const response = await api.get('/enrollments/export', { 
        params,
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bulk update enrollments
  bulkUpdateEnrollments: async (enrollmentIds, updateData) => {
    try {
      const response = await api.patch('/enrollments/bulk-update', {
        ids: enrollmentIds,
        data: updateData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bulk delete enrollments
  bulkDeleteEnrollments: async (enrollmentIds) => {
    try {
      const response = await api.delete('/enrollments/bulk-delete', {
        data: { ids: enrollmentIds }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get enrollment by student email
  getEnrollmentByEmail: async (email) => {
    try {
      const response = await api.get(`/enrollments/email/${email}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get recent enrollments
  getRecentEnrollments: async (limit = 10) => {
    try {
      const response = await api.get('/enrollments/recent', { 
        params: { limit } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get enrollment analytics
  getEnrollmentAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/enrollments/analytics', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default enrollmentService;
