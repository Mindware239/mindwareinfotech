import api from './api';

const studentService = {
  // Get all students (Admin/Instructor only)
  getStudents: async (params = {}) => {
    try {
      const response = await api.get('/students', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get single student
  getStudent: async (id) => {
    try {
      const response = await api.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get my profile
  getMyProfile: async () => {
    try {
      const response = await api.get('/students/profile/me');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update my profile
  updateMyProfile: async (profileData) => {
    try {
      const response = await api.put('/students/profile/me', profileData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get my applications
  getMyApplications: async (params = {}) => {
    try {
      const response = await api.get('/students/applications/me', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get my courses
  getMyCourses: async (params = {}) => {
    try {
      const response = await api.get('/students/courses/me', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Create student (Admin only)
  createStudent: async (studentData) => {
    try {
      const response = await api.post('/students', studentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update student (Admin/Instructor only)
  updateStudent: async (id, studentData) => {
    try {
      const response = await api.put(`/students/${id}`, studentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Delete student (Admin only)
  deleteStudent: async (id) => {
    try {
      const response = await api.delete(`/students/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default studentService;
