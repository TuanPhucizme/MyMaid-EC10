# Firestore Setup Guide - Sửa lỗi "Missing or insufficient permissions"

## 🔧 Cách sửa lỗi Firestore permissions

### 1. Truy cập Firebase Console
1. Vào [Firebase Console](https://console.firebase.google.com/)
2. Chọn project `factcheck-1d6e8`
3. Vào **Firestore Database** > **Rules**

### 2. Cập nhật Firestore Rules
Thay thế rules hiện tại bằng rules sau:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Cho phép đọc/ghi collection mm_users
    match /mm_users/{userId} {
      // Cho phép user đọc/ghi document của chính mình
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Cho phép tạo document mới khi đăng ký
      allow create: if request.auth != null && request.auth.uid == userId;
    }
    
    // Cho phép đọc/ghi các collection khác nếu cần
    match /{document=**} {
      // Tạm thời cho phép tất cả (chỉ dùng cho development)
      allow read, write: if request.auth != null;
    }
  }
}
```

### 3. Rules cho Production (khi deploy)
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User chỉ có thể đọc/ghi document của chính mình
    match /mm_users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Các collection khác
    match /bookings/{bookingId} {
      allow read, write: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         request.auth.token.role == 'admin');
    }
    
    match /services/{serviceId} {
      allow read: if true; // Ai cũng có thể đọc services
      allow write: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}
```

### 4. Kiểm tra Rules
1. Sau khi cập nhật rules, click **Publish**
2. Đợi vài giây để rules có hiệu lực
3. Thử đăng ký lại

### 5. Debug Firestore
Nếu vẫn gặp lỗi, kiểm tra:
- User đã được authenticate chưa
- Collection name có đúng không (`mm_users`)
- Document ID có đúng không (user.uid)

### 6. Test Rules
Trong Firebase Console > Firestore Database > Rules, có thể test rules:
```javascript
// Test read permission
match /mm_users/{userId} {
  allow read: if request.auth != null && request.auth.uid == userId;
}
```

## 🚨 Lưu ý quan trọng:
- **Development**: Có thể dùng rules mở để test
- **Production**: Phải dùng rules nghiêm ngặt
- **Security**: Không bao giờ expose sensitive data
- **Testing**: Test rules trước khi deploy

## 🔍 Debug Steps:
1. Kiểm tra console logs
2. Xem Firebase Debug component
3. Kiểm tra user authentication status
4. Verify Firestore rules syntax
