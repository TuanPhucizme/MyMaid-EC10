import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';

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
  const [loading, setLoading] = useState(true);

  // Check for existing token on app load
  useEffect(() => {
    const token = Cookies.get('token');
    const firebaseToken = Cookies.get('firebaseToken');
    
    if (firebaseToken || token) {
      // Verify token and get user data
      authAPI.getProfile()
        .then(response => {
          setUser(response.data.user);
        })
        .catch(() => {
          // Token is invalid, remove it
          Cookies.remove('token');
          Cookies.remove('firebaseToken');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // Traditional login
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      const { token, user: userData } = response.data;
      
      // Store token in cookie (7 days)
      Cookies.set('token', token, { expires: 7, secure: true, sameSite: 'strict' });
      
      setUser(userData);
      toast.success('Đăng nhập thành công!');
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Đăng nhập thất bại';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Firebase login
  const loginWithFirebase = async (idToken) => {
    try {
      const response = await authAPI.loginWithFirebase(idToken);
      const { customToken, user: userData } = response.data;
      
      // Store Firebase token in cookie (7 days)
      Cookies.set('firebaseToken', idToken, { expires: 7, secure: true, sameSite: 'strict' });
      
      setUser(userData);
      toast.success('Đăng nhập thành công!');
      
      return { success: true, customToken };
    } catch (error) {
      const message = error.response?.data?.error || 'Đăng nhập thất bại';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      toast.success('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Đăng ký thất bại';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint to clean up server-side session
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clean up client-side tokens
      Cookies.remove('token');
      Cookies.remove('firebaseToken');
      setUser(null);
      toast.success('Đăng xuất thành công');
    }
  };

  const verifyEmail = async (token) => {
    try {
      await authAPI.verifyEmail(token);
      toast.success('Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Xác thực email thất bại';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const forgotPassword = async (email) => {
    try {
      await authAPI.forgotPassword(email);
      toast.success('Link đặt lại mật khẩu đã được gửi đến email của bạn');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Gửi email đặt lại mật khẩu thất bại';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const resetPassword = async (token, newPassword) => {
    try {
      await authAPI.resetPassword(token, newPassword);
      toast.success('Đặt lại mật khẩu thành công! Bạn có thể đăng nhập ngay bây giờ.');
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.error || 'Đặt lại mật khẩu thất bại';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const refreshToken = async (firebaseUid) => {
    try {
      const response = await authAPI.refreshToken(firebaseUid);
      const { customToken } = response.data;
      return { success: true, customToken };
    } catch (error) {
      const message = error.response?.data?.error || 'Làm mới token thất bại';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      setUser(response.data.user);
      toast.success('Cập nhật hồ sơ thành công');
      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.error || 'Cập nhật hồ sơ thất bại';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    loading,
    login,
    loginWithFirebase,
    register,
    logout,
    verifyEmail,
    forgotPassword,
    resetPassword,
    refreshToken,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
