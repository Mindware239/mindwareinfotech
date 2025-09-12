import api from './api';

const blogService = {
  // Get all blogs with pagination, search, and filtering
  getBlogs: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      
      const response = await api.get(`/blogs?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blogs:', error);
      throw error.response?.data || error;
    }
  },

  // Get single blog by slug
  getBlogBySlug: async (slug) => {
    try {
      const response = await api.get(`/blogs/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching blog:', error);
      throw error.response?.data || error;
    }
  },

  // Get featured blogs
  getFeaturedBlogs: async (limit = 3) => {
    try {
      const response = await api.get(`/blogs/featured?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured blogs:', error);
      throw error.response?.data || error;
    }
  },

  // Get recent blogs
  getRecentBlogs: async (limit = 5) => {
    try {
      const response = await api.get(`/blogs?limit=${limit}&status=published`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recent blogs:', error);
      throw error.response?.data || error;
    }
  },

  // Get blog categories
  getBlogCategories: async () => {
    try {
      const response = await api.get('/blogs/categories');
      return response.data;
    } catch (error) {
      console.error('Error fetching blog categories:', error);
      throw error.response?.data || error;
    }
  },

  // Create new blog
  createBlog: async (blogData) => {
    try {
      console.log('Creating blog with data:', blogData);
      
      // Handle file upload
      const formData = new FormData();
      
      // Add all text fields
      Object.keys(blogData).forEach(key => {
        if (key === 'featuredImage' && blogData[key] && blogData[key].file) {
          // Handle file upload
          formData.append('featured_image', blogData[key].file);
        } else if (key !== 'featuredImage') {
          // Add other fields
          if (key === 'tags' && Array.isArray(blogData[key])) {
            formData.append(key, JSON.stringify(blogData[key]));
          } else {
            formData.append(key, blogData[key]);
          }
        }
      });
      
      const response = await api.post('/blogs', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Blog created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating blog:', error);
      throw error.response?.data || error;
    }
  },

  // Update blog
  updateBlog: async (id, blogData) => {
    try {
      // Handle file upload
      const formData = new FormData();
      
      // Add all text fields
      Object.keys(blogData).forEach(key => {
        if (key === 'featuredImage' && blogData[key] && blogData[key].file) {
          // Handle file upload
          formData.append('featured_image', blogData[key].file);
        } else if (key !== 'featuredImage') {
          // Add other fields
          if (key === 'tags' && Array.isArray(blogData[key])) {
            formData.append(key, JSON.stringify(blogData[key]));
          } else {
            formData.append(key, blogData[key]);
          }
        }
      });
      
      const response = await api.put(`/blogs/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error updating blog:', error);
      throw error.response?.data || error;
    }
  },

  // Delete blog
  deleteBlog: async (id) => {
    try {
      const response = await api.delete(`/blogs/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting blog:', error);
      throw error.response?.data || error;
    }
  },

  // Like blog
  likeBlog: async (id) => {
    try {
      const response = await api.post(`/blogs/${id}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking blog:', error);
      throw error.response?.data || error;
    }
  },

  // Share blog on social media
  shareBlog: (blog) => {
    const url = encodeURIComponent(window.location.origin + `/blog/${blog.slug}`);
    const title = encodeURIComponent(blog.title);
    const description = encodeURIComponent(blog.excerpt || '');
    
    return {
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      twitter: `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
      whatsapp: `https://wa.me/?text=${title} ${url}`,
      telegram: `https://t.me/share/url?url=${url}&text=${title}`
    };
  }
};

export default blogService;