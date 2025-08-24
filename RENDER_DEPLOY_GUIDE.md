# Deploy MyMaid-EC10 to Render

## Chuẩn bị deploy lên Render

### 1. Cấu hình Repository

Đảm bảo code đã được push lên GitHub repository.

### 2. Tạo tài khoản Render

1. Đăng ký tài khoản tại [render.com](https://render.com)
2. Kết nối với GitHub account

### 3. Environment Variables

Cần setup các environment variables sau trong Render Dashboard:

#### Firebase Configuration (Server)
- `FIREBASE_PROJECT_ID`: ID của Firebase project
- `FIREBASE_PRIVATE_KEY`: Private key từ service account (format JSON escaped)
- `FIREBASE_CLIENT_EMAIL`: Email của service account
- `FIREBASE_DATABASE_URL`: URL của Realtime Database
- `FIREBASE_STORAGE_BUCKET`: Storage bucket name

#### Firebase Configuration (Client)
- `REACT_APP_FIREBASE_API_KEY`: API key từ Firebase config
- `REACT_APP_FIREBASE_AUTH_DOMAIN`: Auth domain
- `REACT_APP_FIREBASE_PROJECT_ID`: Project ID (same as server)
- `REACT_APP_FIREBASE_STORAGE_BUCKET`: Storage bucket (same as server)
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`: Messaging sender ID
- `REACT_APP_FIREBASE_APP_ID`: App ID
- `REACT_APP_FIREBASE_MEASUREMENT_ID`: Measurement ID (optional)

#### Mapbox Configuration
- `REACT_APP_MAPBOX_ACCESS_TOKEN`: Mapbox access token

#### API Configuration
- `REACT_APP_API_URL`: URL của deployed API (https://your-app.onrender.com)

### 4. Tạo Web Service trên Render

1. Trong Render Dashboard, click "New +"
2. Chọn "Web Service"
3. Connect repository từ GitHub
4. Cấu hình:
   - **Name**: `mymaid-ec10`
   - **Environment**: `Node`
   - **Region**: Singapore (gần Việt Nam nhất)
   - **Branch**: `main`
   - **Build Command**: `npm run build:production`
   - **Start Command**: `npm run start:production`
   - **Instance Type**: Free (hoặc paid plan)

### 5. Advanced Settings

- **Auto-Deploy**: Yes (để tự động deploy khi push code)
- **Health Check Path**: `/api/health`

### 6. Environment Variables Setup

Trong tab "Environment" của web service, thêm tất cả các environment variables đã liệt kê ở trên.

**Lưu ý quan trọng cho FIREBASE_PRIVATE_KEY:**
```
Phải escape newlines trong private key:
"-----BEGIN PRIVATE KEY-----\nYour-Key-Content-Here\n-----END PRIVATE KEY-----\n"
```

### 7. Deploy

1. Click "Create Web Service"
2. Render sẽ tự động:
   - Clone repository
   - Install dependencies
   - Build client
   - Start server
   - Assign domain

### 8. Kiểm tra Deployment

1. Truy cập URL được assign (https://your-app.onrender.com)
2. Kiểm tra health check: https://your-app.onrender.com/api/health
3. Test các API endpoints
4. Test client application

### 9. GitHub Actions (Optional)

Để sử dụng GitHub Actions cho auto-deploy:

1. Trong Render Dashboard, tạo API key
2. Trong GitHub repository settings > Secrets, thêm:
   - `RENDER_API_KEY`: API key từ Render
   - `RENDER_SERVICE_ID`: Service ID từ Render dashboard

### 10. Troubleshooting

**Build fails:**
- Kiểm tra logs trong Render dashboard
- Đảm bảo tất cả dependencies được install
- Kiểm tra Node.js version compatibility

**Runtime errors:**
- Kiểm tra environment variables
- Xem logs trong Render dashboard
- Test Firebase connection

**Client không load:**
- Kiểm tra REACT_APP_API_URL
- Đảm bảo CORS được cấu hình đúng
- Kiểm tra static files được serve đúng

### 11. Domain Custom (Optional)

1. Trong Render Dashboard > Settings > Custom Domains
2. Thêm domain của bạn
3. Cấu hình DNS records theo hướng dẫn

### 12. SSL Certificate

Render tự động cung cấp SSL certificate miễn phí cho tất cả domains.

### 13. Monitoring

- Render cung cấp metrics và logs built-in
- Có thể integrate với các monitoring services khác

## Lệnh Deploy Manual

Nếu muốn deploy manual từ local:

```bash
# Build production
npm run build:production

# Test local production build
npm run start:production

# Push to GitHub (auto-deploy if configured)
git add .
git commit -m "Deploy to production"
git push origin main
```

## Files quan trọng cho Render

- `render.yaml`: Cấu hình service
- `Dockerfile`: Container configuration
- `.dockerignore`: Ignore files for Docker
- `package.json`: Build và start scripts
- `.github/workflows/deploy.yml`: GitHub Actions workflow
