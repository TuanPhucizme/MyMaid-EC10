# 🚀 DEPLOY CHECKLIST - MyMaid-EC10 lên Render

## 📋 Pre-Deploy Checklist

### ✅ Code Preparation
- [ ] Code đã được test local và hoạt động tốt
- [ ] Tất cả environment variables đã được cấu hình đúng
- [ ] Firebase project đã được setup và hoạt động
- [ ] Mapbox API key đã được cấu hình
- [ ] Git repository đã được push lên GitHub

### ✅ Environment Variables Setup
- [ ] Tạo file `.env` từ `.env.example`
- [ ] Điền đầy đủ Firebase configuration
- [ ] Điền Mapbox access token
- [ ] Kiểm tra FIREBASE_PRIVATE_KEY đã được escape newlines

## 🎯 Deploy Steps

### 1. Setup Render Account
- [ ] Đăng ký tài khoản tại [render.com](https://render.com)
- [ ] Kết nối với GitHub account
- [ ] Chọn region Singapore (gần Việt Nam nhất)

### 2. Deploy Backend API
- [ ] Tạo Web Service mới
- [ ] Chọn repository `mymaid-ec10`
- [ ] Cấu hình:
  - **Name**: `mymaid-ec10-api`
  - **Environment**: `Node`
  - **Region**: `Singapore`
  - **Branch**: `main`
  - **Build Command**: `cd server && npm install`
  - **Start Command**: `cd server && npm start`
  - **Instance Type**: `Free`

### 3. Setup Environment Variables cho API
- [ ] Thêm các biến môi trường server:
  ```
  NODE_ENV=production
  PORT=10000
  FIREBASE_PROJECT_ID=your-project-id
  FIREBASE_PRIVATE_KEY=your-escaped-private-key
  FIREBASE_CLIENT_EMAIL=your-service-account-email
  FIREBASE_DATABASE_URL=your-database-url
  FIREBASE_STORAGE_BUCKET=your-storage-bucket
  ```

### 4. Deploy Frontend Client
- [ ] Tạo Static Site mới
- [ ] Chọn repository `mymaid-ec10`
- [ ] Cấu hình:
  - **Name**: `mymaid-ec10-client`
  - **Build Command**: `cd client && npm install && npm run build`
  - **Publish Directory**: `client/build`
  - **Region**: `Singapore`

### 5. Setup Environment Variables cho Client
- [ ] Thêm các biến môi trường client:
  ```
  REACT_APP_FIREBASE_API_KEY=your-api-key
  REACT_APP_FIREBASE_AUTH_DOMAIN=your-auth-domain
  REACT_APP_FIREBASE_PROJECT_ID=your-project-id
  REACT_APP_FIREBASE_STORAGE_BUCKET=your-storage-bucket
  REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
  REACT_APP_FIREBASE_APP_ID=your-app-id
  REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id
  REACT_APP_MAPBOX_ACCESS_TOKEN=your-mapbox-token
  REACT_APP_API_URL=https://mymaid-ec10-api.onrender.com
  ```

## 🔧 Post-Deploy Verification

### ✅ API Health Check
- [ ] Truy cập: `https://mymaid-ec10-api.onrender.com/api/health`
- [ ] Kiểm tra response status 200
- [ ] Test các API endpoints chính

### ✅ Client Functionality
- [ ] Truy cập: `https://mymaid-ec10-client.onrender.com`
- [ ] Kiểm tra React app load thành công
- [ ] Test authentication flow
- [ ] Test các tính năng chính

### ✅ Integration Tests
- [ ] Test kết nối giữa client và API
- [ ] Test Firebase operations
- [ ] Test Mapbox integration
- [ ] Test payment flow (nếu có)

## 🚨 Troubleshooting

### Build Failures
- [ ] Kiểm tra logs trong Render dashboard
- [ ] Đảm bảo Node.js version compatibility
- [ ] Kiểm tra tất cả dependencies được install

### Runtime Errors
- [ ] Kiểm tra environment variables
- [ ] Xem logs trong Render dashboard
- [ ] Test Firebase connection

### Client Issues
- [ ] Kiểm tra REACT_APP_API_URL
- [ ] Đảm bảo CORS được cấu hình đúng
- [ ] Kiểm tra static files được serve đúng

## 📱 Domain & SSL

### Custom Domain (Optional)
- [ ] Thêm custom domain trong Render dashboard
- [ ] Cấu hình DNS records
- [ ] SSL certificate sẽ được tự động cấp

### SSL Certificate
- [ ] Render tự động cung cấp SSL miễn phí
- [ ] Kiểm tra HTTPS hoạt động đúng

## 🔄 Auto-Deploy Setup

### GitHub Integration
- [ ] Enable auto-deploy trong Render dashboard
- [ ] Test bằng cách push code mới
- [ ] Kiểm tra deployment logs

## 📊 Monitoring

### Render Dashboard
- [ ] Setup alerts cho deployment failures
- [ ] Monitor resource usage
- [ ] Setup log aggregation nếu cần

## 🎉 Success Criteria

- [ ] Backend API accessible và healthy
- [ ] Frontend client load thành công
- [ ] Tất cả tính năng hoạt động bình thường
- [ ] Performance đạt yêu cầu
- [ ] SSL certificate hoạt động
- [ ] Auto-deploy setup thành công

---

**Lưu ý quan trọng**: 
- FIREBASE_PRIVATE_KEY phải được escape newlines với `\n`
- Không bao giờ commit file `.env` vào git
- Test kỹ trước khi deploy production
- Backup database trước khi deploy
