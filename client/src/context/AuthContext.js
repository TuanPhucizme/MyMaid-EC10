import React, { createContext, useContext, useState, useEffect } from 'react';
import { firebaseAuth } from '../config/firebase';
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
  const [idToken, setIdToken] = useState(null);

  // Lắng nghe thay đổi auth state từ Firebase
  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChange(async (firebaseUser) => {
      setLoading(true);
      
      if (firebaseUser && firebaseUser.emailVerified) {
        // User đã đăng nhập và email đã được xác thực
        try {
          const token = await firebaseUser.getIdToken();
          setIdToken(token);
          
          // Tạo user object từ Firebase user
          const userData = {
            id: firebaseUser.uid,
            firebaseUid: firebaseUser.uid,
            email: firebaseUser.email,
            firstName: firebaseUser.displayName?.split(' ')[0] || '',
            lastName: firebaseUser.displayName?.split(' ').slice(1).join(' ') || '',
            isVerified: firebaseUser.emailVerified,
            profile: {
              avatar: firebaseUser.photoURL
            }
          };
          
          setUser(userData);
        } catch (error) {
          console.error('Error getting ID token:', error);
          setUser(null);
          setIdToken(null);
        }
      } else {
        // User chưa đăng nhập hoặc email chưa xác thực
        setUser(null);
        setIdToken(null);
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Đăng nhập với Firebase Auth
  const login = async (email, password) => {
    try {
      setLoading(true);
      const result = await firebaseAuth.login(email, password);
      
      if (result.success) {
        toast.success(result.message);
        return { success: true };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const message = 'Đăng nhập thất bại';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Đăng ký với Firebase Auth
  const register = async (userData) => {
    try {
      setLoading(true);
      const { email, password, firstName, lastName } = userData;
      const result = await firebaseAuth.register(email, password, firstName, lastName);
      
      if (result.success) {
        toast.success(result.message);
        return { success: true };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const message = 'Đăng ký thất bại';
      toast.error(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  // Đăng xuất với Firebase Auth
  const logout = async () => {
    try {
      setLoading(true);
      const result = await firebaseAuth.logout();
      
      if (result.success) {
        toast.success(result.message);
        return { success: true };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Đăng xuất thất bại');
      return { success: false, error: 'Đăng xuất thất bại' };
    } finally {
      setLoading(false);
    }
  };

  // Gửi lại email xác thực
  const resendEmailVerification = async () => {
    try {
      if (user) {
        const result = await firebaseAuth.resendEmailVerification(user);
        
        if (result.success) {
          toast.success(result.message);
          return { success: true };
        } else {
          toast.error(result.error);
          return { success: false, error: result.error };
        }
      } else {
        const message = 'Không tìm thấy user để gửi email xác thực';
        toast.error(message);
        return { success: false, error: message };
      }
    } catch (error) {
      const message = 'Gửi email xác thực thất bại';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Quên mật khẩu với Firebase Auth
  const forgotPassword = async (email) => {
    try {
      const result = await firebaseAuth.sendPasswordReset(email);
      
      if (result.success) {
        toast.success(result.message);
        return { success: true };
      } else {
        toast.error(result.error);
        return { success: false, error: result.error };
      }
    } catch (error) {
      const message = 'Gửi email đặt lại mật khẩu thất bại';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Lấy ID token hiện tại
  const getCurrentIdToken = async () => {
    try {
      const result = await firebaseAuth.getCurrentIdToken();
      return result;
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    idToken,
    login,
    register,
    logout,
    resendEmailVerification,
    forgotPassword,
    getCurrentIdToken
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
