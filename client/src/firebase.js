// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBBf8tbxg8wJEGpEmteGwJDdPUDJheITMA",
  authDomain: "mymaid-2025.firebaseapp.com",
  projectId: "mymaid-2025",
  storageBucket: "mymaid-2025.firebasestorage.app",
  messagingSenderId: "73134731664",
  appId: "1:73134731664:web:53ef0a19a45612c60d4315",
  measurementId: "G-SZY2M0FMDP"
};

let app;

// Kiểm tra xem đã có instance nào được khởi tạo chưa
if (getApps().length === 0) {
  // Nếu chưa có, khởi tạo một instance mới
  app = initializeApp(firebaseConfig);
} else {
  // Nếu đã có, lấy lại instance mặc định đã được khởi tạo
  app = getApp();
}

// Khởi tạo và export các dịch vụ từ instance 'app' đã được xác định
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
const analytics = getAnalytics(app);