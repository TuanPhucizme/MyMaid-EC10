import axios from 'axios';
import { firebaseAuth } from '../config/firebase';

// Create axios instance
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 10000,
});

// Request interceptor to add Firebase ID token
api.interceptors.request.use(
  async (config) => {
    try {
      const result = await firebaseAuth.getCurrentIdToken();
      if (result.success && result.idToken) {
        config.headers.Authorization = `Bearer ${result.idToken}`;
      }
    } catch (error) {
      console.error('Error getting Firebase token:', error);
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
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid, sign out from Firebase
      try {
        await firebaseAuth.logout();
      } catch (logoutError) {
        console.error('Error during auto logout:', logoutError);
      }
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API endpoints (chỉ giữ lại những endpoint cần thiết)
export const authAPI = {
  // Các endpoint này sẽ được xử lý bởi Firebase Auth ở frontend
  // Chỉ giữ lại các endpoint cần tương tác với backend data
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
