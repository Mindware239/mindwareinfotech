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
      const response = await api.post('/gallery', galleryData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update gallery item
  updateGalleryItem: async (id, galleryData) => {
    try {
      const response = await api.put(`/gallery/${id}`, galleryData);
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

  // Get gallery by category
  getGalleryByCategory: async (category, params = {}) => {
    try {
      const response = await api.get(`/gallery/category/${category}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search gallery
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

  // Like gallery item
  likeGalleryItem: async (id) => {
    try {
      const response = await api.post(`/gallery/${id}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get featured gallery items
  getFeaturedGallery: async (limit = 8) => {
    try {
      const response = await api.get('/gallery', { 
        params: { featured: true, limit } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get gallery categories
  getGalleryCategories: async () => {
    try {
      const response = await api.get('/gallery/categories');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default galleryService;
