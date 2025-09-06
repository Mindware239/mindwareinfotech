import api from './api';

const bannerService = {
  // Get all banners
  getBanners: async (params = {}) => {
    try {
      const response = await api.get('/banners', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single banner
  getBanner: async (id) => {
    try {
      const response = await api.get(`/banners/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create banner
  createBanner: async (bannerData) => {
    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(bannerData).forEach(key => {
        if (bannerData[key] && typeof bannerData[key] === 'object' && bannerData[key].file) {
          // Handle file uploads
          formData.append(key, bannerData[key].file);
        } else if (bannerData[key] !== null && bannerData[key] !== undefined) {
          // Handle regular form fields
          formData.append(key, bannerData[key]);
        }
      });

      const response = await api.post('/banners', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update banner
  updateBanner: async (id, bannerData) => {
    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(bannerData).forEach(key => {
        if (bannerData[key] && typeof bannerData[key] === 'object' && bannerData[key].file) {
          // Handle file uploads
          formData.append(key, bannerData[key].file);
        } else if (bannerData[key] !== null && bannerData[key] !== undefined) {
          // Handle regular form fields
          formData.append(key, bannerData[key]);
        }
      });

      const response = await api.put(`/banners/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete banner
  deleteBanner: async (id) => {
    try {
      const response = await api.delete(`/banners/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get banners by type
  getBannersByType: async (type, params = {}) => {
    try {
      const response = await api.get(`/banners/type/${type}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get active banners
  getActiveBanners: async (params = {}) => {
    try {
      const response = await api.get('/banners', { 
        params: { active: true, ...params } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search banners
  searchBanners: async (query, params = {}) => {
    try {
      const response = await api.get('/banners/search', { 
        params: { q: query, ...params } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update banner status
  updateBannerStatus: async (id, isActive) => {
    try {
      const response = await api.patch(`/banners/${id}/status`, { is_active: isActive });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update banner position
  updateBannerPosition: async (id, position) => {
    try {
      const response = await api.patch(`/banners/${id}/position`, { banner_position: position });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get banner statistics
  getBannerStats: async () => {
    try {
      const response = await api.get('/banners/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bulk update banners
  bulkUpdateBanners: async (bannerIds, updateData) => {
    try {
      const response = await api.patch('/banners/bulk-update', {
        ids: bannerIds,
        data: updateData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bulk delete banners
  bulkDeleteBanners: async (bannerIds) => {
    try {
      const response = await api.delete('/banners/bulk-delete', {
        data: { ids: bannerIds }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get recent banners
  getRecentBanners: async (limit = 10) => {
    try {
      const response = await api.get('/banners/recent', { 
        params: { limit } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get banner analytics
  getBannerAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/banners/analytics', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default bannerService;
