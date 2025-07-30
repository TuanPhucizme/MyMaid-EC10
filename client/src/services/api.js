import axios from 'axios';
import Cookies from 'js-cookie';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('token');
    const firebaseToken = Cookies.get('firebaseToken');
    
    if (firebaseToken) {
      // Use Firebase token if available
      config.headers.Authorization = `Bearer ${firebaseToken}`;
    } else if (token) {
      // Fallback to JWT token for legacy users
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      Cookies.remove('token');
      Cookies.remove('firebaseToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints
export const authAPI = {
  // Traditional auth endpoints
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  
  // Firebase auth endpoints
  loginWithFirebase: (idToken) => api.post('/auth/login/firebase', { idToken }),
  refreshToken: (firebaseUid) => api.post('/auth/refresh-token', { firebaseUid }),
  
  // Common auth endpoints
  verifyEmail: (token) => api.post('/auth/verify-email', { token }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, newPassword) => api.post('/auth/reset-password', { token, newPassword }),
  logout: () => api.post('/auth/logout'),
  
  // User profile endpoints
  getProfile: () => api.get('/users/profile'),
  updateProfile: (profileData) => api.put('/users/profile', profileData),
};

// User API endpoints
export const userAPI = {
  getDashboard: () => api.get('/users/dashboard'),
  deleteAccount: () => api.delete('/users/account'),
};

// Link API endpoints
export const linkAPI = {
  checkLink: (url) => api.post('/links/check', { url }),
  getHistory: (page = 1, limit = 20) => api.get(`/links/history?page=${page}&limit=${limit}`),
  getLinkResult: (linkId) => api.get(`/links/${linkId}`),
  deleteLinkResult: (linkId) => api.delete(`/links/${linkId}`),
};

export default api;
