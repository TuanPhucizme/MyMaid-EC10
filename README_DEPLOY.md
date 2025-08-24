# 🚀 HƯỚNG DẪN DEPLOY MYMAID-EC10 LÊN RENDER

## 📋 Tổng quan

Dự án MyMaid-EC10 được thiết kế để deploy lên Render với kiến trúc:
- **Backend API**: Node.js Web Service
- **Frontend Client**: React Static Site
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Maps**: Mapbox Integration

## 🎯 Kiến trúc Deploy

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   GitHub Repo   │    │   Render API    │    │ Render Client   │
│                 │───▶│   (Backend)     │    │  (Frontend)     │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Firebase      │    │   Firebase      │
                       │   Firestore     │    │   Auth/Storage  │
                       └─────────────────┘    └─────────────────┘
```

## 🚀 Bước 1: Chuẩn bị

### 1.1 Kiểm tra dự án
```bash
# Chạy script kiểm tra deploy
npm run deploy:check

# Hoặc chạy trực tiếp
node scripts/deploy-render.js
```

### 1.2 Cài đặt dependencies
```bash
# Cài đặt tất cả dependencies
npm run install:all

# Test build production
npm run build:production
```

### 1.3 Cấu hình Environment Variables
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Điền các giá trị thực tế:
```env
# Firebase Configuration
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Key-Content\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
FIREBASE_STORAGE_BUCKET=your-project.appspot.com

# Client Firebase Config
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id
REACT_APP_FIREBASE_MEASUREMENT_ID=your-measurement-id

# Mapbox
REACT_APP_MAPBOX_ACCESS_TOKEN=your-mapbox-token

# API URL
REACT_APP_API_URL=https://mymaid-ec10-api.onrender.com
```

## 🌐 Bước 2: Setup Render

### 2.1 Tạo tài khoản Render
1. Truy cập [render.com](https://render.com)
2. Đăng ký tài khoản mới
3. Kết nối với GitHub account
4. Chọn region **Singapore** (gần Việt Nam nhất)

### 2.2 Deploy Backend API
1. Click "New +" → "Web Service"
2. Connect repository `mymaid-ec10`
3. Cấu hình:
   - **Name**: `mymaid-ec10-api`
   - **Environment**: `Node`
   - **Region**: `Singapore`
   - **Branch**: `main`
   - **Build Command**: `cd server && npm install`
   - **Start Command**: `cd server && npm start`
   - **Instance Type**: `Free`
   - **Health Check Path**: `/api/health`

4. Environment Variables (Server):
   ```
   NODE_ENV=production
   PORT=10000
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY=your-escaped-private-key
   FIREBASE_CLIENT_EMAIL=your-service-account-email
   FIREBASE_DATABASE_URL=your-database-url
   FIREBASE_STORAGE_BUCKET=your-storage-bucket
   ```

### 2.3 Deploy Frontend Client
1. Click "New +" → "Static Site"
2. Connect repository `mymaid-ec10`
3. Cấu hình:
   - **Name**: `mymaid-ec10-client`
   - **Build Command**: `cd client && npm install && npm run build`
   - **Publish Directory**: `client/build`
   - **Region**: `Singapore`

4. Environment Variables (Client):
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

## 🔧 Bước 3: Deploy và Test

### 3.1 Deploy
1. Click "Create Web Service" cho cả API và Client
2. Render sẽ tự động:
   - Clone repository
   - Install dependencies
   - Build application
   - Start services
   - Assign domains

### 3.2 Test Deployment
```bash
# Test API Health
curl https://mymaid-ec10-api.onrender.com/api/health

# Test Client
# Truy cập: https://mymaid-ec10-client.onrender.com
```

### 3.3 Kiểm tra Logs
- Vào Render Dashboard
- Chọn service
- Tab "Logs" để xem deployment logs
- Tab "Events" để xem deployment events

## 🚨 Troubleshooting

### Build Failures
```bash
# Kiểm tra logs
# Vào Render Dashboard > Service > Logs

# Test local build
npm run build:production
```

### Runtime Errors
```bash
# Kiểm tra environment variables
# Đảm bảo FIREBASE_PRIVATE_KEY được escape đúng

# Test Firebase connection
npm run test-firebase
```

### Client Issues
```bash
# Kiểm tra REACT_APP_API_URL
# Đảm bảo CORS được cấu hình đúng
# Kiểm tra static files được serve đúng
```

## 🔄 Auto-Deploy

### GitHub Integration
1. Trong Render Dashboard, enable "Auto-Deploy"
2. Mỗi khi push code lên `main` branch
3. Render sẽ tự động deploy

### Manual Deploy
```bash
# Build production
npm run build:production

# Push to GitHub
git add .
git commit -m "Deploy to production"
git push origin main
```

## 📱 Domain & SSL

### Custom Domain
1. Vào Render Dashboard > Settings > Custom Domains
2. Thêm domain của bạn
3. Cấu hình DNS records theo hướng dẫn

### SSL Certificate
- Render tự động cung cấp SSL miễn phí
- HTTPS sẽ hoạt động ngay sau khi deploy

## 📊 Monitoring

### Render Dashboard
- **Metrics**: CPU, Memory, Response Time
- **Logs**: Real-time application logs
- **Events**: Deployment history
- **Alerts**: Setup notifications

### Health Checks
```bash
# API Health
GET https://mymaid-ec10-api.onrender.com/api/health

# Expected Response:
{
  "status": "OK",
  "message": "MyMaid API is running",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 123.456
}
```

## 🎉 Success Criteria

- [ ] Backend API accessible tại `/api/health`
- [ ] Frontend client load thành công
- [ ] Authentication flow hoạt động
- [ ] Firebase operations thành công
- [ ] Mapbox integration hoạt động
- [ ] SSL certificate hoạt động
- [ ] Auto-deploy setup thành công

## 📚 Tài liệu tham khảo

- [Render Documentation](https://render.com/docs)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [React Build](https://create-react-app.dev/docs/production-build)
- [DEPLOY_CHECKLIST.md](./DEPLOY_CHECKLIST.md)

## 🆘 Hỗ trợ

Nếu gặp vấn đề:
1. Kiểm tra logs trong Render Dashboard
2. Test local build với `npm run deploy:check`
3. Kiểm tra environment variables
4. Xem file `DEPLOY_CHECKLIST.md`
5. Tạo issue trên GitHub repository

---

**Lưu ý quan trọng**: 
- Không bao giờ commit file `.env` vào git
- FIREBASE_PRIVATE_KEY phải được escape newlines với `\n`
- Test kỹ trước khi deploy production
- Backup database trước khi deploy
