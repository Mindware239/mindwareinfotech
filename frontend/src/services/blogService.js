import api from './api';

const blogService = {
  // Get all blogs
  getBlogs: async (params = {}) => {
    try {
      const response = await api.get('/blogs', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single blog
  getBlog: async (id) => {
    try {
      const response = await api.get(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get blog by slug
  getBlogBySlug: async (slug) => {
    try {
      const response = await api.get(`/blogs/slug/${slug}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create blog
  createBlog: async (blogData) => {
    try {
      const response = await api.post('/blogs', blogData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update blog
  updateBlog: async (id, blogData) => {
    try {
      const response = await api.put(`/blogs/${id}`, blogData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete blog
  deleteBlog: async (id) => {
    try {
      const response = await api.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get blogs by category
  getBlogsByCategory: async (category, params = {}) => {
    try {
      const response = await api.get(`/blogs/category/${category}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Search blogs
  searchBlogs: async (query, params = {}) => {
    try {
      const response = await api.get('/blogs/search', { 
        params: { q: query, ...params } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Like blog
  likeBlog: async (id) => {
    try {
      const response = await api.post(`/blogs/${id}/like`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Add comment
  addComment: async (id, content) => {
    try {
      const response = await api.post(`/blogs/${id}/comments`, { content });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get featured blogs
  getFeaturedBlogs: async (limit = 5) => {
    try {
      const response = await api.get('/blogs', { 
        params: { featured: true, limit } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get recent blogs
  getRecentBlogs: async (limit = 5) => {
    try {
      const response = await api.get('/blogs', { 
        params: { limit, sort: 'publishedAt' } 
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default blogService;
