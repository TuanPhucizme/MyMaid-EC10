# MyMaid-EC10

MyMaid-EC10 là một nền tảng kết nối dịch vụ giúp việc chuyên nghiệp, cho phép người dùng tìm kiếm và thuê người giúp việc phù hợp với nhu cầu của họ.

## 🚀 Tính năng chính

### ✅ Đã hoàn thành:
- **Đăng ký/Đăng nhập**: Hệ thống authentication với Firebase
- **Xác minh email**: Gửi email xác minh để kích hoạt tài khoản
- **Quên mật khẩu**: Tính năng đặt lại mật khẩu qua email
- **Dashboard**: Giao diện tổng quan cho người dùng
- **Quản lý hồ sơ**: Cập nhật thông tin cá nhân
- **Thanh toán**: Tích hợp VNPay cho thanh toán
- **Giao diện responsive**: Tương thích với mọi thiết bị

## 🏗️ Kiến trúc

### Backend (Express.js)
```
server/
├── app.js                 # Main application file
├── config/
│   └── firebaseAdmin.js   # Firebase Admin configuration
├── middleware/
│   └── authMiddleware.js  # Authentication middleware
├── routes/
│   ├── userRoutes.js      # User management routes
│   └── payment.js         # Payment routes (VNPay)
└── package.json
```

### Frontend (React)
```
client/
├── src/
│   ├── components/        # UI components
│   ├── pages/            # Page components
│   ├── context/          # React context
│   ├── services/         # API services
│   ├── config/           # Configuration files
│   ├── data/             # Mock data
│   ├── hooks/            # Custom hooks
│   ├── utils/            # Utility functions
│   ├── App.js            # Main app component
│   └── index.js          # App entry point
├── public/               # Static files
└── package.json
```

## 🛠️ Tech Stack

### Backend:
- **Express.js**: Web framework
- **Firebase Firestore**: Database
- **Firebase Admin**: Server-side Firebase SDK
- **JWT**: Authentication tokens
- **CORS**: Cross-origin resource sharing

### Frontend:
- **React 18**: UI framework
- **React Router**: Client-side routing
- **Tailwind CSS**: Styling framework
- **Firebase Auth**: Client-side authentication
- **GSAP**: Animation library
- **React Hook Form**: Form handling

## 🚀 Cài đặt và Chạy

### Prerequisites:
- Node.js 18+
- Firebase project với Authentication và Firestore enabled

### Quick Start:

1. **Clone repository:**
```bash
git clone <repository-url>
cd MyMaid-EC10
```

2. **Cài đặt dependencies:**
```bash
npm run install:all
```

3. **Cấu hình Firebase:**
   - Tạo Firebase project tại [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication và Firestore
   - Tạo Service Account và download JSON key
   - Copy file `.env.example` thành `.env` và điền thông tin Firebase

4. **Chạy ứng dụng:**
```bash
# Khởi động cả frontend và backend
npm start

# Hoặc chạy riêng lẻ
npm run server-only    # Chỉ backend (port 5000)
npm run client-only    # Chỉ frontend (port 3000)
```

5. **Truy cập ứng dụng:**
   - Frontend: http://localhost:3000
   - Backend: http://localhost:5000

## 🔧 Cấu hình

### Environment Variables (.env):
```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:3000
```

## 📱 Tính năng

### Người dùng:
- Đăng ký/Đăng nhập với email
- Xác minh email
- Quên mật khẩu
- Cập nhật hồ sơ cá nhân
- Xem dashboard

### Hệ thống:
- Authentication với Firebase
- Database với Firestore
- Thanh toán VNPay
- Responsive design
- Process management

## 🚀 Scripts

```bash
# Khởi động
npm start                    # Khởi động cả frontend và backend
npm run server-only          # Chỉ backend
npm run client-only          # Chỉ frontend

# Dừng
npm stop                     # Dừng tất cả processes

# Tiện ích
npm run install:all          # Cài đặt tất cả dependencies
npm run check-env            # Kiểm tra environment variables
npm run status               # Kiểm tra trạng thái processes
npm run restart              # Khởi động lại tất cả services
```

## 📁 Cấu trúc Project

```
MyMaid-EC10/
├── client/                  # Frontend React app
├── server/                  # Backend Express app
├── .env                     # Environment variables
├── .env.example            # Environment template
├── process-manager.js       # Process management
├── force-kill-ports.js      # Port management utility
└── package.json            # Root package.json
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

Nếu gặp vấn đề, hãy kiểm tra:
1. Environment variables đã được cấu hình đúng chưa
2. Firebase project đã được setup chưa
3. Port 3000 và 5000 có bị chiếm không
4. Dependencies đã được cài đặt đầy đủ chưa
