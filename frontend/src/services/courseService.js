import api from './api';

const courseService = {
  // Get all courses
  getCourses: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.featured) queryParams.append('featured', params.featured);
      if (params.level) queryParams.append('level', params.level);
      
      const response = await api.get(`/courses?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error.response?.data || error;
    }
  },

  // Get single course by ID
  getCourseById: async (id) => {
    try {
      const response = await api.get(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course:', error);
      throw error.response?.data || error;
    }
  },

  // Get featured courses
  getFeaturedCourses: async (limit = 6) => {
    try {
      const response = await api.get(`/courses?featured=true&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured courses:', error);
      throw error.response?.data || error;
    }
  },

  // Create new course
  createCourse: async (courseData) => {
    try {
      const response = await api.post('/courses', courseData);
      return response.data;
    } catch (error) {
      console.error('Error creating course:', error);
      throw error.response?.data || error;
    }
  },

  // Update course
  updateCourse: async (id, courseData) => {
    try {
      const response = await api.put(`/courses/${id}`, courseData);
      return response.data;
    } catch (error) {
      console.error('Error updating course:', error);
      throw error.response?.data || error;
    }
  },

  // Delete course
  deleteCourse: async (id) => {
    try {
      const response = await api.delete(`/courses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error.response?.data || error;
    }
  },

  // Get courses by category
  getCoursesByCategory: async (category, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      
      const response = await api.get(`/courses/category/${category}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching courses by category:', error);
      throw error.response?.data || error;
    }
  },

  // Get courses by instructor
  getCoursesByInstructor: async (instructorId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      
      const response = await api.get(`/courses/instructor/${instructorId}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching instructor courses:', error);
      throw error.response?.data || error;
    }
  }
};

export default courseService;
