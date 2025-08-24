# 🚀 Firebase Quick Start - MyMaid-EC10

## Bước 1: Cập nhật Service Account Key

1. **Lấy Service Account Key từ Firebase Console:**
   - Vào [Firebase Console](https://console.firebase.google.com/)
   - Chọn project `my-maid-82d5e`
   - **Project Settings** > **Service accounts** > **Generate new private key**
   - Tải file JSON về

2. **Cập nhật file .env:**
   ```bash
   # Mở file JSON vừa tải và copy thông tin vào .env:
   FIREBASE_PROJECT_ID=my-maid-82d5e
   FIREBASE_PRIVATE_KEY_ID=<từ file JSON>
   FIREBASE_PRIVATE_KEY="<từ file JSON - giữ nguyên format>"
   FIREBASE_CLIENT_EMAIL=<từ file JSON>
   FIREBASE_CLIENT_ID=<từ file JSON>
   ```

## Bước 2: Chạy setup tự động

```bash
# Chạy script setup tự động
npm run setup-firebase
```

Script này sẽ:
- ✅ Kiểm tra cấu hình Firebase
- ✅ Test kết nối
- ✅ Xóa dữ liệu cũ (nếu có)
- ✅ Tạo dữ liệu mẫu mới

## Bước 3: Khởi động ứng dụng

```bash
# Khởi động cả server và client
npm run dev

# Hoặc khởi động riêng lẻ:
npm run server:dev  # Server: http://localhost:5000
npm run client:dev  # Client: http://localhost:3000
```

## 🔧 Các lệnh hữu ích

```bash
# Test kết nối Firebase
npm run test-firebase

# Chỉ tạo lại dữ liệu (không xóa)
cd server && npm run seed

# Xóa toàn bộ dữ liệu và tạo lại
cd server && npm run fresh-start

# Xóa dữ liệu (cần xác nhận)
cd server && npm run reset-firestore -- --confirm
```

## 📊 Dữ liệu mẫu được tạo

- **👤 Users:** 1 customer + 2 staff
- **🛍️ Services:** 3 dịch vụ (dọn dẹp, tổng vệ sinh, vệ sinh máy lạnh)
- **📋 Orders:** 3 đơn hàng mẫu với các trạng thái khác nhau
- **⚙️ System:** Cấu hình hệ thống

## 🚨 Lưu ý quan trọng

- ⚠️ **Không commit file .env**
- 🔒 **Bảo mật Service Account Key**
- 🧪 **Test kỹ trước khi deploy**

## 📖 Tài liệu chi tiết

Xem `FIREBASE_NEW_PROJECT_SETUP.md` để biết thêm chi tiết về:
- Thiết lập Firestore Rules
- Cấu hình Authentication
- Thiết lập Storage
- Troubleshooting
