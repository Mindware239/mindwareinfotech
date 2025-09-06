import api from './api';

const galleryService = {
  // Get all gallery items
  getGalleryItems: async (params = {}) => {
    try {
      const response = await api.get('/gallery', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single gallery item
  getGalleryItem: async (id) => {
    try {
      const response = await api.get(`/gallery/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create gallery item
  createGalleryItem: async (galleryData) => {
    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(galleryData).forEach(key => {
        if (key === 'images' && Array.isArray(galleryData[key])) {
          // Handle multiple image uploads
          galleryData[key].forEach((image, index) => {
            if (image.file) {
              formData.append(`images[${index}]`, image.file);
            }
          });
        } else if (galleryData[key] && typeof galleryData[key] === 'object' && galleryData[key].file) {
          // Handle single file uploads
          formData.append(key, galleryData[key].file);
        } else if (galleryData[key] !== null && galleryData[key] !== undefined) {
          // Handle regular form fields
          formData.append(key, galleryData[key]);
        }
      });

      const response = await api.post('/gallery', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update gallery item
  updateGalleryItem: async (id, galleryData) => {
    try {
      const formData = new FormData();
      
      // Add all form fields to FormData
      Object.keys(galleryData).forEach(key => {
        if (key === 'images' && Array.isArray(galleryData[key])) {
          // Handle multiple image uploads
          galleryData[key].forEach((image, index) => {
            if (image.file) {
              formData.append(`images[${index}]`, image.file);
            }
          });
        } else if (galleryData[key] && typeof galleryData[key] === 'object' && galleryData[key].file) {
          // Handle single file uploads
          formData.append(key, galleryData[key].file);
        } else if (galleryData[key] !== null && galleryData[key] !== undefined) {
          // Handle regular form fields
          formData.append(key, galleryData[key]);
        }
      });

      const response = await api.put(`/gallery/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete gallery item
  deleteGalleryItem: async (id) => {
    try {
      const response = await api.delete(`/gallery/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get gallery items by category
  getGalleryByCategory: async (category, params = {}) => {
    try {
      const response = await api.get(`/gallery/category/${category}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get featured gallery items
  getFeaturedGallery: async (limit = 10) => {
    try {
      const response = await api.get('/gallery', { 
        params: { featured: true, limit } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search gallery items
  searchGallery: async (query, params = {}) => {
    try {
      const response = await api.get('/gallery/search', { 
        params: { q: query, ...params } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get gallery statistics
  getGalleryStats: async () => {
    try {
      const response = await api.get('/gallery/stats');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update gallery item status
  updateGalleryStatus: async (id, status) => {
    try {
      const response = await api.patch(`/gallery/${id}/status`, { status });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Toggle featured status
  toggleFeatured: async (id, isFeatured) => {
    try {
      const response = await api.patch(`/gallery/${id}/featured`, { is_featured: isFeatured });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bulk update gallery items
  bulkUpdateGallery: async (galleryIds, updateData) => {
    try {
      const response = await api.patch('/gallery/bulk-update', {
        ids: galleryIds,
        data: updateData
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Bulk delete gallery items
  bulkDeleteGallery: async (galleryIds) => {
    try {
      const response = await api.delete('/gallery/bulk-delete', {
        data: { ids: galleryIds }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get recent gallery items
  getRecentGallery: async (limit = 10) => {
    try {
      const response = await api.get('/gallery/recent', { 
        params: { limit } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get gallery analytics
  getGalleryAnalytics: async (params = {}) => {
    try {
      const response = await api.get('/gallery/analytics', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default galleryService;