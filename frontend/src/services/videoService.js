import api from './api';

const videoService = {
  // Get all videos
  getAllVideos: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.featured) queryParams.append('featured', params.featured);
      
      const response = await api.get(`/videos?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error.response?.data || error;
    }
  },

  // Get all videos (alias)
  getVideos: async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.category) queryParams.append('category', params.category);
      if (params.search) queryParams.append('search', params.search);
      if (params.status) queryParams.append('status', params.status);
      if (params.featured) queryParams.append('featured', params.featured);
      
      const response = await api.get(`/videos?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching videos:', error);
      throw error.response?.data || error;
    }
  },

  // Get single video by ID
  getVideoById: async (id) => {
    try {
      const response = await api.get(`/videos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching video:', error);
      throw error.response?.data || error;
    }
  },

  // Get featured videos
  getFeaturedVideos: async (limit = 3) => {
    try {
      const response = await api.get(`/videos?featured=true&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching featured videos:', error);
      throw error.response?.data || error;
    }
  },

  // Create new video
  createVideo: async (videoData) => {
    try {
      console.log('Creating video with data:', videoData);
      const response = await api.post('/videos', videoData);
      console.log('Video created successfully:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error creating video:', error);
      throw error.response?.data || error;
    }
  },

  // Update video
  updateVideo: async (id, videoData) => {
    try {
      const response = await api.put(`/videos/${id}`, videoData);
      return response.data;
    } catch (error) {
      console.error('Error updating video:', error);
      throw error.response?.data || error;
    }
  },

  // Delete video
  deleteVideo: async (id) => {
    try {
      const response = await api.delete(`/videos/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting video:', error);
      throw error.response?.data || error;
    }
  },

  // Upload video file
  uploadVideo: async (formData, onProgress) => {
    try {
      const response = await api.post('/videos/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          if (onProgress) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(percentCompleted);
          }
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading video:', error);
      throw error.response?.data || error;
    }
  },

  // Upload thumbnail
  uploadThumbnail: async (formData) => {
    try {
      const response = await api.post('/videos/upload-thumbnail', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      throw error.response?.data || error;
    }
  },

  // Upload multiple files (video + thumbnail)
  uploadMultiple: async (formData) => {
    try {
      const response = await api.post('/videos/upload-multiple', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading files:', error);
      throw error.response?.data || error;
    }
  },

  // Get videos by course
  getVideosByCourse: async (courseId, params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      
      if (params.page) queryParams.append('page', params.page);
      if (params.limit) queryParams.append('limit', params.limit);
      if (params.search) queryParams.append('search', params.search);
      
      const response = await api.get(`/videos/course/${courseId}?${queryParams.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course videos:', error);
      throw error.response?.data || error;
    }
  },

  // Get video progress (for students)
  getVideoProgress: async (videoId) => {
    try {
      const response = await api.get(`/videos/${videoId}/progress`);
      return response.data;
    } catch (error) {
      console.error('Error fetching video progress:', error);
      throw error.response?.data || error;
    }
  },

  // Check video access
  checkVideoAccess: async (videoId) => {
    try {
      const response = await api.get(`/videos/${videoId}/access`);
      return response.data;
    } catch (error) {
      console.error('Error checking video access:', error);
      throw error.response?.data || error;
    }
  },

  // Purchase video access
  purchaseVideoAccess: async (videoId) => {
    try {
      const response = await api.post(`/videos/${videoId}/purchase`);
      return response.data;
    } catch (error) {
      console.error('Error purchasing video access:', error);
      throw error.response?.data || error;
    }
  },

  // Grant video access after payment
  grantVideoAccess: async (videoId, accessData) => {
    try {
      const response = await api.post(`/videos/${videoId}/grant-access`, accessData);
      return response.data;
    } catch (error) {
      console.error('Error granting video access:', error);
      throw error.response?.data || error;
    }
  },

  // Update video progress
  updateVideoProgress: async (videoId, progressData) => {
    try {
      const response = await api.post(`/videos/${videoId}/progress`, progressData);
      return response.data;
    } catch (error) {
      console.error('Error updating video progress:', error);
      throw error.response?.data || error;
    }
  },

  // Check enrollment status
  checkEnrollment: async (courseId) => {
    try {
      const response = await api.get(`/enrollments/check/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error checking enrollment:', error);
      throw error.response?.data || error;
    }
  }
};

export default videoService;