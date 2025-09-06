import api from './api';

const testimonialService = {
  // Get all testimonials
  getTestimonials: async (params = {}) => {
    const response = await api.get('/testimonials', { params });
    return response.data;
  },

  // Get single testimonial
  getTestimonial: async (id) => {
    const response = await api.get(`/testimonials/${id}`);
    return response.data;
  },

  // Get active testimonials for website
  getActiveTestimonials: async () => {
    const response = await api.get('/testimonials/active');
    return response.data;
  },

  // Create testimonial (Admin only)
  createTestimonial: async (testimonialData) => {
    const response = await api.post('/testimonials', testimonialData);
    return response.data;
  },

  // Update testimonial (Admin only)
  updateTestimonial: async (id, testimonialData) => {
    const response = await api.put(`/testimonials/${id}`, testimonialData);
    return response.data;
  },

  // Delete testimonial (Admin only)
  deleteTestimonial: async (id) => {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  },

  // Upload testimonial image
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await api.post('/testimonials/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};

export default testimonialService;
