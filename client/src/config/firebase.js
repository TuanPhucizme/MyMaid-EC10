/**
 * Firebase Configuration for Client
 * @desc Cấu hình Firebase cho frontend với Firebase Auth
 */

import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged
} from 'firebase/auth';

// Firebase config - Lấy từ Firebase Console > Project Settings > General > Web app
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || process.env.FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID || process.env.FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID || process.env.FIREBASE_MEASUREMENT_ID
};

// Kiểm tra config trước khi khởi tạo
if (!firebaseConfig.apiKey) {
  console.error('❌ Firebase API Key is missing!');
  console.error('💡 Please add REACT_APP_FIREBASE_API_KEY to your .env file');
  console.error('🔗 Get it from: Firebase Console > Project Settings > General > Web app');
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth and get a reference to the service
export const auth = getAuth(app);

// Auth functions
export const firebaseAuth = {
  // Đăng ký với email và password
  async register(email, password, firstName, lastName) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Cập nhật display name
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });
      
      // Gửi email xác thực
      await sendEmailVerification(user);
      
      return { 
        success: true, 
        user,
        message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.'
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        code: error.code
      };
    }
  },

  // Đăng nhập với email và password
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Kiểm tra email đã được xác thực chưa
      if (!user.emailVerified) {
        return {
          success: false,
          error: 'Vui lòng xác thực email trước khi đăng nhập',
          code: 'EMAIL_NOT_VERIFIED'
        };
      }
      
      // Lấy ID token để gửi lên backend
      const idToken = await user.getIdToken();
      
      return { 
        success: true, 
        user,
        idToken,
        message: 'Đăng nhập thành công!'
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        code: error.code
      };
    }
  },

  // Đăng xuất
  async logout() {
    try {
      await signOut(auth);
      return { 
        success: true,
        message: 'Đăng xuất thành công!'
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  // Gửi email đặt lại mật khẩu
  async sendPasswordReset(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { 
        success: true,
        message: 'Email đặt lại mật khẩu đã được gửi!'
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  // Gửi lại email xác thực
  async resendEmailVerification(user) {
    try {
      await sendEmailVerification(user);
      return { 
        success: true,
        message: 'Email xác thực đã được gửi lại!'
      };
    } catch (error) {
      return { 
        success: false, 
        error: error.message 
      };
    }
  },

  // Lấy ID token hiện tại
  async getCurrentIdToken() {
    try {
      const user = auth.currentUser;
      if (user) {
        const idToken = await user.getIdToken(true); // force refresh
        return { success: true, idToken };
      }
      return { success: false, error: 'Không có user hiện tại' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  },

  // Lắng nghe thay đổi auth state
  onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }
};

export default app;