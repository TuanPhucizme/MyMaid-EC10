# Environment Variables Check Guide

## Kiểm tra cấu hình Firebase

### 1. Chạy script kiểm tra

```bash
# Trong thư mục server
cd server
npm run check-env
```

Script này sẽ kiểm tra:
- ✅ Các biến Firebase có được đọc đúng không
- ✅ Firebase Admin SDK có khởi tạo thành công không
- ✅ Kết nối Firestore và Auth có hoạt động không

### 2. Cấu trúc file .env

File `.env` phải được đặt ở **root directory** (cùng cấp với thư mục `server/` và `client/`):

```
MyMaid-EC10/
├── .env                    ← File này phải ở đây
├── server/
│   ├── src/
│   └── package.json
├── client/
│   ├── src/
│   └── package.json
└── README.md
```

### 3. Nội dung file .env

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

### 4. Cách lấy Firebase Service Account Key

1. Truy cập [Firebase Console](https://console.firebase.google.com/)
2. Chọn project của bạn
3. Vào **Project Settings** (biểu tượng bánh răng)
4. Chọn tab **Service accounts**
5. Chọn **Firebase Admin SDK**
6. Chọn **Generate new private key**
7. Tải file JSON về
8. Copy các giá trị từ file JSON vào file `.env`

### 5. Troubleshooting

#### Lỗi: "Missing required Firebase environment variables"

**Nguyên nhân:**
- File `.env` không tồn tại ở root directory
- Tên biến môi trường sai
- File `.env` có format sai

**Khắc phục:**
```bash
# Kiểm tra file .env có tồn tại không
ls -la ../.env

# Kiểm tra nội dung file (ẩn các giá trị nhạy cảm)
cat ../.env | grep FIREBASE
```

#### Lỗi: "Firebase initialization failed"

**Nguyên nhân:**
- Private key sai format
- Project ID không đúng
- Service account không có quyền

**Khắc phục:**
1. Kiểm tra private key có đúng format không:
   ```env
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
   ```

2. Đảm bảo private key được bao trong dấu ngoặc kép và có `\n` thay vì xuống dòng thật

#### Lỗi: "Token verification failed"

**Nguyên nhân:**
- Firebase project ID không đúng
- Service account không có quyền Auth

**Khắc phục:**
1. Kiểm tra project ID trong Firebase Console
2. Đảm bảo service account có quyền Authentication Admin

### 6. Kiểm tra thủ công

```bash
# Kiểm tra biến môi trường
node -e "
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
console.log('FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL);
"

# Test Firebase connection
node -e "
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const admin = require('firebase-admin');
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI
};
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
console.log('✅ Firebase connected successfully');
"
```

### 7. Restart Server

Sau khi thay đổi file `.env`, nhớ restart server:

```bash
# Dừng server (Ctrl+C)
# Sau đó chạy lại
npm run dev
```

### 8. Logs

Kiểm tra logs khi khởi động server:

```bash
npm run dev
```

Bạn sẽ thấy:
- ✅ Firebase Admin SDK initialized successfully
- 🚀 Server running on port 5000

Nếu có lỗi, sẽ hiển thị thông báo cụ thể về vấn đề gì. 