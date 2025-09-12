import React, { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userData = await authService.verifyToken(token);
        // Fix: Handle the correct response structure from backend
        const user = userData.data?.user || userData.user;
        if (user) {
          setUser(user);
          setIsAdmin(user.role === 'admin');
        } else {
          // If no user data, clear token
          localStorage.removeItem('token');
          setUser(null);
          setIsAdmin(false);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Only clear token if it's a 401 error, not network errors
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        setUser(null);
        setIsAdmin(false);
      }
      // For network errors, keep the user logged in
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await authService.login(email, password);
      // Fix: Handle the correct response structure from backend
      const user = response.data?.user || response.user;
      const token = response.data?.token || response.token;
      
      if (user && token) {
        localStorage.setItem('token', token);
        setUser(user);
        setIsAdmin(user.role === 'admin');
        return { success: true, user };
      } else {
        return { 
          success: false, 
          error: 'Invalid response from server' 
        };
      }
    } catch (error) {
      console.error('Login failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await authService.register(userData);
      // Fix: Handle the correct response structure from backend
      const user = response.data?.user || response.user;
      const token = response.data?.token || response.token;
      
      if (user && token) {
        localStorage.setItem('token', token);
        setUser(user);
        setIsAdmin(user.role === 'admin');
        return { success: true, user };
      } else {
        return { 
          success: false, 
          error: 'Invalid response from server' 
        };
      }
    } catch (error) {
      console.error('Registration failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Registration failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAdmin(false);
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authService.updateDetails(profileData);
      setUser(response.data.user);
      return { success: true, user: response.data.user };
    } catch (error) {
      console.error('Profile update failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Profile update failed' 
      };
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      await authService.updatePassword(currentPassword, newPassword);
      return { success: true };
    } catch (error) {
      console.error('Password change failed:', error);
      return { 
        success: false, 
        error: error.response?.data?.message || 'Password change failed' 
      };
    }
  };

  const value = {
    user,
    isAdmin,
    loading,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
