# Firebase Setup Guide

## Cài đặt Firebase cho MyMaid-EC10

### 1. Tạo Firebase Project

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Đặt tên project: `mymaid-ec10` (hoặc tên bạn muốn)

### 2. Cấu hình Authentication

1. Trong Firebase Console, chọn **Authentication**
2. Chọn tab **Sign-in method**
3. Bật **Email/Password** authentication
4. Tùy chọn: Bật **Email link (passwordless sign-in)** nếu muốn

### 3. Tạo Service Account

1. Trong Firebase Console, chọn **Project Settings** (biểu tượng bánh răng)
2. Chọn tab **Service accounts**
3. Chọn **Firebase Admin SDK**
4. Chọn **Generate new private key**
5. Tải file JSON về và lưu an toàn

### 4. Cấu hình Environment Variables

Tạo file `.env` trong thư mục `server/` với nội dung:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# JWT Configuration (for legacy users)
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# Firebase Configuration
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY_ID=your-private-key-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour private key here\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your-client-id
FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token

# Frontend URL (for email verification and password reset links)
FRONTEND_URL=http://localhost:3000

# Email Configuration (for custom email service)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=your-email@gmail.com

# CORS Configuration
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 5. Cấu hình Firestore Database

1. Trong Firebase Console, chọn **Firestore Database**
2. Chọn **Create database**
3. Chọn **Start in test mode** (cho development)
4. Chọn location gần nhất

### 6. Cấu hình Security Rules

Trong Firestore Database, chọn tab **Rules** và cập nhật:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.firebaseUid;
      allow create: if request.auth != null;
    }
    
    // Links collection
    match /links/{linkId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.userId;
      allow create: if request.auth != null;
    }
    
    // Verification tokens
    match /verification_tokens/{tokenId} {
      allow read, write: if request.auth != null;
    }
    
    // Password reset tokens
    match /password_reset_tokens/{tokenId} {
      allow read, write: if request.auth != null;
    }
    
    // User sessions
    match /user_sessions/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == resource.data.firebaseUid;
    }
  }
}
```

### 7. Cài đặt Dependencies

```bash
# Trong thư mục server
cd server
npm install

# Trong thư mục client
cd ../client
npm install
```

### 8. Chạy ứng dụng

```bash
# Terminal 1 - Backend
cd server
npm run dev

# Terminal 2 - Frontend
cd client
npm start
```

## Tính năng Firebase Authentication

### Backend Endpoints

1. **POST /api/auth/register** - Đăng ký với Firebase
2. **POST /api/auth/login** - Đăng nhập truyền thống (legacy)
3. **POST /api/auth/login/firebase** - Đăng nhập với Firebase ID token
4. **POST /api/auth/verify-email** - Xác thực email
5. **POST /api/auth/forgot-password** - Quên mật khẩu
6. **POST /api/auth/reset-password** - Đặt lại mật khẩu
7. **POST /api/auth/refresh-token** - Làm mới Firebase token
8. **POST /api/auth/logout** - Đăng xuất

### Client Integration

```javascript
import { useAuth } from '../context/AuthContext';

const { loginWithFirebase, login, register, logout } = useAuth();

// Firebase login
const handleFirebaseLogin = async (idToken) => {
  const result = await loginWithFirebase(idToken);
  if (result.success) {
    // Redirect to dashboard
  }
};

// Traditional login
const handleLogin = async (email, password) => {
  const result = await login(email, password);
  if (result.success) {
    // Redirect to dashboard
  }
};
```

## Lưu ý Bảo mật

1. **Không bao giờ commit file `.env`** vào git
2. **Bảo vệ service account key** - chỉ sử dụng trong server
3. **Cấu hình CORS** đúng domain
4. **Sử dụng HTTPS** trong production
5. **Rate limiting** để tránh abuse
6. **Validate input** ở cả client và server

## Troubleshooting

### Lỗi thường gặp

1. **Firebase initialization failed**
   - Kiểm tra environment variables
   - Đảm bảo service account key đúng format

2. **Token verification failed**
   - Kiểm tra Firebase project ID
   - Đảm bảo private key đúng

3. **CORS errors**
   - Cấu hình CORS_ORIGIN đúng
   - Kiểm tra domain trong Firebase Console

4. **Email verification không hoạt động**
   - Kiểm tra FRONTEND_URL
   - Cấu hình email service

### Debug

```bash
# Kiểm tra Firebase connection
node -e "
const admin = require('firebase-admin');
const serviceAccount = require('./path/to/serviceAccountKey.json');
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
console.log('Firebase connected successfully');
"
``` 