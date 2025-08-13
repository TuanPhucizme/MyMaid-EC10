import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendEmailVerification,
  signOut,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase'; // Đổi tên firebaseAuth thành auth cho nhất quán
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
  const [user, setUser] = useState(null); // User từ Firebase Auth
  const [userProfile, setUserProfile] = useState(null); // Hồ sơ từ Firestore
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      if (firebaseUser) {
        const userDocRef = doc(db, "mm_users", firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (userDocSnap.exists()) {
          setUserProfile(userDocSnap.data());
        } else {
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Đăng nhập thành công!');
      return { success: true };
    } catch (error) {
      const message = error.code === 'auth/invalid-credential' 
        ? 'Email hoặc mật khẩu không chính xác.' 
        : 'Đăng nhập thất bại. Vui lòng thử lại.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const register = async (userData) => {
    const { email, password, firstName, lastName } = userData;
    try {
      // 1. Tạo tài khoản trong Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // 2. Tạo hồ sơ trong Firestore
      await setDoc(doc(db, "mm_users", firebaseUser.uid), {
        firstName,
        lastName,
        name: `${firstName} ${lastName}`,
        email,
        role: 'customer',
        status: 'pending_verification',
        createdAt: new Date(),
      });

      // 3. Gửi email xác thực
      const actionCodeSettings = {
        url: 'http://localhost:3000/email-verification',
        handleCodeInApp: true,
      };
      await sendEmailVerification(firebaseUser, actionCodeSettings);
      
      return { success: true };

    } catch (error) {
      const message = error.code === 'auth/email-already-in-use'
        ? 'Email này đã được sử dụng.'
        : 'Đăng ký thất bại. Vui lòng thử lại.';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Đăng xuất thành công!');
      return { success: true };
    } catch (error) {
      toast.error('Đăng xuất thất bại.');
      return { success: false, error: 'Đăng xuất thất bại' };
    }
  };

  const resendEmailVerification = useCallback(async () => {
    if (!auth.currentUser) {
      toast.error('Bạn cần đăng nhập để thực hiện hành động này.');
      return { success: false, error: 'User not logged in' };
    }
    try {
      await sendEmailVerification(auth.currentUser);
      toast.success('Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư.');
      return { success: true };
    } catch (error) {
      toast.error('Gửi lại email thất bại. Vui lòng thử lại sau.');
      return { success: false, error: 'Failed to resend email' };
    }
  }, []);

  const forgotPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.');
      return { success: true };
    } catch (error) {
      const message = error.code === 'auth/user-not-found'
        ? 'Không tìm thấy tài khoản với email này.'
        : 'Gửi email thất bại.';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    login,
    register,
    logout,
    resendEmailVerification,
    forgotPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};