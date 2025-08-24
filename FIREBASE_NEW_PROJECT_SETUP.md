# Firebase New Project Setup Guide - MyMaid-EC10

## 🔥 Hướng dẫn thiết lập Firebase project mới

### 1. Lấy Service Account Key

1. **Truy cập Firebase Console:**
   - Vào [Firebase Console](https://console.firebase.google.com/)
   - Chọn project `my-maid-82d5e`

2. **Tạo Service Account Key:**
   - Vào **Project Settings** (⚙️) > **Service accounts**
   - Click **Generate new private key**
   - Tải file JSON về máy

3. **Cập nhật file .env:**
   ```bash
   # Mở file JSON vừa tải và copy các thông tin sau:
   FIREBASE_PROJECT_ID=my-maid-82d5e
   FIREBASE_PRIVATE_KEY_ID=<private_key_id từ file JSON>
   FIREBASE_PRIVATE_KEY="<private_key từ file JSON - giữ nguyên format với \n>"
   FIREBASE_CLIENT_EMAIL=<client_email từ file JSON>
   FIREBASE_CLIENT_ID=<client_id từ file JSON>
   ```

### 2. Thiết lập Firestore Database

1. **Tạo Firestore Database:**
   - Vào **Firestore Database** > **Create database**
   - Chọn **Start in test mode** (tạm thời)
   - Chọn region: `asia-southeast1` (Singapore)

2. **Cập nhật Firestore Rules:**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Cho phép đọc/ghi collection mm_users
       match /mm_users/{userId} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
         allow create: if request.auth != null && request.auth.uid == userId;
       }
       
       // Cho phép đọc services cho tất cả user đã đăng nhập
       match /services/{serviceId} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && 
           exists(/databases/$(database)/documents/mm_users/$(request.auth.uid)) &&
           get(/databases/$(database)/documents/mm_users/$(request.auth.uid)).data.role == 'admin';
       }
       
       // Cho phép đọc/ghi orders
       match /orders/{orderId} {
         allow read, write: if request.auth != null && 
           (resource.data.userId == request.auth.uid || 
            exists(/databases/$(database)/documents/mm_users/$(request.auth.uid)) &&
            get(/databases/$(database)/documents/mm_users/$(request.auth.uid)).data.role in ['admin', 'staff']);
         allow create: if request.auth != null;
       }
       
       // Cho phép admin đọc system config
       match /system/{document} {
         allow read: if request.auth != null;
         allow write: if request.auth != null && 
           exists(/databases/$(database)/documents/mm_users/$(request.auth.uid)) &&
           get(/databases/$(database)/documents/mm_users/$(request.auth.uid)).data.role == 'admin';
       }
     }
   }
   ```

### 3. Thiết lập Firebase Authentication

1. **Bật Authentication:**
   - Vào **Authentication** > **Get started**
   - Vào tab **Sign-in method**

2. **Bật Email/Password:**
   - Click **Email/Password** > **Enable** > **Save**

3. **Bật Google Sign-in (tùy chọn):**
   - Click **Google** > **Enable**
   - Nhập **Project support email**
   - **Save**

### 4. Thiết lập Firebase Storage

1. **Tạo Storage:**
   - Vào **Storage** > **Get started**
   - Chọn **Start in test mode**
   - Chọn region: `asia-southeast1`

2. **Cập nhật Storage Rules:**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       // Cho phép upload avatar
       match /avatars/{userId}/{allPaths=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Cho phép upload order attachments
       match /orders/{orderId}/{allPaths=**} {
         allow read, write: if request.auth != null;
       }
     }
   }
   ```

### 5. Chạy script seed dữ liệu

```bash
# Từ thư mục root của project
cd server
npm run seed
```

### 6. Kiểm tra kết nối

```bash
# Test Firebase connection
node -e "
const { db } = require('./config/firebaseAdmin');
db.collection('services').get().then(snapshot => {
  console.log('✅ Firebase connected! Services count:', snapshot.size);
  process.exit(0);
}).catch(err => {
  console.error('❌ Firebase connection failed:', err);
  process.exit(1);
});
"
```

## 🚀 Các bước tiếp theo

1. **Cập nhật .env với Service Account Key thực tế**
2. **Chạy seed script để tạo dữ liệu mẫu**
3. **Test ứng dụng với Firebase mới**
4. **Deploy lên production khi sẵn sàng**

## 📝 Lưu ý quan trọng

- ⚠️ **Không commit file .env vào git**
- 🔒 **Giữ bí mật Service Account Key**
- 🧪 **Test kỹ trước khi deploy production**
- 📊 **Monitor usage và costs trên Firebase Console**
