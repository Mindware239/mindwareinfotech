import api from './api';

const videoService = {
  // Get all videos
  getVideos: async (params = {}) => {
    try {
      const response = await api.get('/videos', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single video
  getVideo: async (id) => {
    try {
      const response = await api.get(`/videos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create video
  createVideo: async (videoData) => {
    try {
      const response = await api.post('/videos', videoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update video
  updateVideo: async (id, videoData) => {
    try {
      const response = await api.put(`/videos/${id}`, videoData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete video
  deleteVideo: async (id) => {
    try {
      const response = await api.delete(`/videos/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get videos by category
  getVideosByCategory: async (category, params = {}) => {
    try {
      const response = await api.get(`/videos/category/${category}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get videos by course
  getVideosByCourse: async (courseId, params = {}) => {
    try {
      const response = await api.get(`/videos/course/${courseId}`, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Upload video file
  uploadVideo: async (formData) => {
    try {
      const response = await api.post('/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get video progress
  getVideoProgress: async (id) => {
    try {
      const response = await api.get(`/videos/${id}/progress`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update video progress
  updateVideoProgress: async (id, progressData) => {
    try {
      const response = await api.put(`/videos/${id}/progress`, progressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default videoService;