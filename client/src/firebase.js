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
  apiKey: "AIzaSyBaa-Ea1fyaXg-jsRGdODbC8SVxBxHvPiU",
  authDomain: "my-maid-82d5e.firebaseapp.com",
  projectId: "my-maid-82d5e",
  storageBucket: "my-maid-82d5e.firebasestorage.app",
  messagingSenderId: "328007691262",
  appId: "1:328007691262:web:ef58eeabe5da04913aaeaf",
  measurementId: "G-RGBCE3GJ8N"
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