# MyMaid - Sprint 1 Implementation

MyMaid là một ứng dụng web cho phép người dùng tìm kiếm người giúp việc phù hợp với các nhu cầu của họ. Đây là implementation của Sprint 1 với các tính năng cơ bản.

## 🚀 Tính năng Sprint 1

### ✅ Đã hoàn thành:
- **Đăng ký tài khoản**: Người dùng có thể tạo tài khoản mới
- **Xác minh email**: Hệ thống gửi email xác minh để kích hoạt tài khoản
- **Đăng nhập**: Người dùng có thể đăng nhập vào hệ thống
- **Quên mật khẩu**: Tính năng đặt lại mật khẩu qua email
- **Kiểm tra link**: Dán link để kiểm tra độ tin cậy từ crawler API
- **Dashboard cá nhân**: Giao diện tổng quan hoạt động của người dùng
- **Chỉnh sửa hồ sơ**: Cập nhật thông tin cá nhân cơ bản

## 🏗️ Architecture

### Backend (Express.js)
```
main/server/
├── src/
│   ├── app.js                 # Main application file
│   ├── config/
│   │   └── firebase.js        # Firebase configuration
│   ├── controllers/
│   │   ├── authController.js  # Authentication logic
│   │   ├── userController.js  # User management
│   │   └── linkController.js  # Link checking logic
│   ├── middleware/
│   │   ├── auth.js           # Authentication middleware
│   │   ├── validation.js     # Request validation
│   │   └── errorHandler.js   # Error handling
│   ├── routes/
│   │   ├── auth.js           # Auth routes
│   │   ├── users.js          # User routes
│   │   └── links.js          # Link routes
│   ├── services/
│   │   ├── emailService.js   # Email sending
│   │   └── crawlerService.js # Link crawling/checking
│   └── utils/                # Utility functions
├── package.json
└── .env.example
```

### Frontend (React)
```
main/client/
├── src/
│   ├── components/
│   │   ├── Navbar.js         # Navigation component
│   │   ├── ProtectedRoute.js # Route protection
│   │   └── LoadingSpinner.js # Loading indicator
│   ├── pages/
│   │   ├── HomePage.js       # Landing page
│   │   ├── LoginPage.js      # Login form
│   │   ├── RegisterPage.js   # Registration form
│   │   ├── DashboardPage.js  # User dashboard
│   │   ├── CheckLinkPage.js  # Link checking
│   │   ├── ProfilePage.js    # Profile management
│   │   ├── VerifyEmailPage.js # Email verification
│   │   ├── ForgotPasswordPage.js # Password reset request
│   │   └── ResetPasswordPage.js  # Password reset form
│   ├── context/
│   │   └── AuthContext.js    # Authentication context
│   ├── services/
│   │   └── api.js           # API client
│   ├── App.js               # Main app component
│   └── index.js             # App entry point
├── public/
└── package.json
```

## 🛠️ Tech Stack

### Backend:
- **Express.js**: Web framework
- **Firebase Firestore**: Database
- **Firebase Admin**: Server-side Firebase SDK
- **JWT**: Authentication tokens
- **Bcrypt**: Password hashing
- **Nodemailer**: Email sending
- **Joi**: Request validation
- **Axios**: HTTP client for crawler API

### Frontend:
- **React 18**: UI framework
- **React Router**: Client-side routing
- **React Hook Form**: Form handling
- **React Query**: Data fetching and caching
- **Styled Components**: CSS-in-JS styling
- **Yup**: Form validation
- **Lucide React**: Icons
- **React Hot Toast**: Notifications

## 🚀 Cài đặt và Chạy

### Prerequisites:
- Node.js 16+
- Firebase project với Firestore enabled
- Email service (Gmail với App Password)

### Backend Setup:

1. **Cài đặt dependencies:**
```bash
cd backup/server
npm install
```

2. **Cấu hình environment:**
```bash
cp .env.example .env
# Chỉnh sửa .env với thông tin Firebase và email
```

3. **Chạy server:**
```bash
# Development
npm run dev

# Production
npm start
```

Server sẽ chạy tại `http://localhost:5000`

### Frontend Setup:

1. **Cài đặt dependencies:**
```bash
cd backup/client
npm install
```

2. **Chạy client:**
```bash
npm start
```

Client sẽ chạy tại `http://localhost:3000`

## 🔧 Cấu hình

### Firebase Setup:
1. Tạo Firebase project tại https://console.firebase.google.com
2. Enable Firestore Database
3. Tạo Service Account và download JSON key
4. Cấu hình thông tin trong `.env`

### Email Setup:
1. Sử dụng Gmail với App Password
2. Cấu hình SMTP settings trong `.env`

### Environment Variables:
```env
# Server
PORT=5000
NODE_ENV=development

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com

# JWT
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Crawler API
CRAWLER_API_URL=https://api.example.com/crawler
CRAWLER_API_KEY=your-api-key

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

## 📊 Database Schema

### Collections:

#### users
```javascript
{
  email: string,
  password: string (hashed),
  firstName: string,
  lastName: string,
  isVerified: boolean,
  createdAt: timestamp,
  updatedAt: timestamp,
  profile: {
    bio: string,
    avatar: string
  },
  stats: {
    linksChecked: number,
    joinedAt: timestamp
  }
}
```

#### links
```javascript
{
  userId: string,
  url: string,
  credibilityScore: number,
  status: string,
  summary: string,
  sources: array,
  metadata: {
    title: string,
    domain: string,
    publishDate: timestamp,
    author: string
  },
  checkedAt: timestamp
}
```

#### verification_tokens
```javascript
{
  userId: string,
  token: string,
  email: string,
  expiresAt: timestamp,
  createdAt: timestamp
}
```

#### password_reset_tokens
```javascript
{
  userId: string,
  token: string,
  email: string,
  expiresAt: timestamp,
  createdAt: timestamp
}
```

## 🔗 API Endpoints

### Authentication:
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/verify-email` - Xác minh email
- `POST /api/auth/forgot-password` - Quên mật khẩu
- `POST /api/auth/reset-password` - Đặt lại mật khẩu

### Users:
- `GET /api/users/profile` - Lấy thông tin profile
- `PUT /api/users/profile` - Cập nhật profile
- `GET /api/users/dashboard` - Lấy dữ liệu dashboard
- `DELETE /api/users/account` - Xóa tài khoản

### Links:
- `POST /api/links/check` - Kiểm tra link
- `GET /api/links/history` - Lịch sử kiểm tra
- `GET /api/links/:linkId` - Chi tiết kết quả
- `DELETE /api/links/:linkId` - Xóa kết quả

## 🧪 Testing

```bash
# Backend tests
cd backup/server
npm test

# Frontend tests
cd backup/client
npm test
```

## 📝 Next Steps (Sprint 2+)

- Community features
- Advanced filtering
- Expert verification
- Chatbot integration
- Admin panel
- Mobile app
- Advanced analytics

## 🤝 Contributing

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

## 📄 License

MIT License - see LICENSE file for details
