# 🔧 Troubleshooting Mapbox - Bản đồ màu trắng

## 🚨 Vấn đề hiện tại

Bản đồ hiển thị màu trắng và có các warning trong console:
- `React does not recognize the 'initialCenter' prop on a DOM element`
- `React does not recognize the 'initialZoom' prop on a DOM element`
- `Unknown event handler property 'onMapClick'`

## 🔍 Nguyên nhân

1. **Environment variables không được load**: `REACT_APP_MAPBOX_ACCESS_TOKEN` không được đọc từ file `.env`
2. **Development server cần restart**: React cần restart để load lại environment variables
3. **Xung đột tên component**: Icon `Map` từ lucide-react xung đột với component `Map` của chúng ta

## ✅ Giải pháp

### Bước 1: Kiểm tra file .env

Đảm bảo file `client/.env` có dòng:
```env
REACT_APP_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieWFuZWNoaSIsImEiOiJjbWViajBmdnQwZXU3MmxweHR5ZnplcHJ0In0.JPwiF0eTFmizO1GKKAeCqw
```

### Bước 2: Restart Development Server

**Quan trọng**: Environment variables chỉ được load khi khởi động server!

```bash
# Dừng server hiện tại (Ctrl+C)
# Sau đó chạy lại
cd client
npm start
```

### Bước 3: Kiểm tra Console

Mở Developer Tools (F12) và kiểm tra console:
- ✅ Nếu thấy: "✅ Mapbox access token đã được tìm thấy"
- ❌ Nếu thấy: "❌ Mapbox access token không được tìm thấy!"

### Bước 4: Kiểm tra Network Tab

Trong Network tab, tìm các request đến `api.mapbox.com`:
- Nếu có request và status 200: ✅ Token hoạt động
- Nếu có request và status 401: ❌ Token không hợp lệ
- Nếu không có request: ❌ Token không được gửi

## 🧪 Test Component

Đã thêm `MapDebug` component để kiểm tra environment variables:

```jsx
import MapDebug from './MapDebug';

// Hiển thị trong modal map
<MapDebug />
```

## 🔄 Các bước đã sửa

1. ✅ Sửa xung đột tên: `Map` icon → `MapIcon`
2. ✅ Thêm import `Map` component
3. ✅ Thêm error handling và fallback UI
4. ✅ Thêm debug logging
5. ✅ Thêm MapDebug component

## 🚀 Cách test

1. Mở trang BookingPage
2. Chuyển đến Bước 3: Chọn Địa Chỉ
3. Click nút "Bản đồ"
4. Kiểm tra console và MapDebug component
5. Nếu vẫn màu trắng, restart development server

## 📞 Hỗ trợ

Nếu vẫn gặp vấn đề:

1. **Kiểm tra console** để xem error messages
2. **Kiểm tra Network tab** để xem API calls
3. **Restart development server** để load lại .env
4. **Kiểm tra Mapbox account** để xem token có hợp lệ không

---

**Lưu ý**: Environment variables trong React chỉ được load khi khởi động server. Mọi thay đổi trong `.env` file đều cần restart server!
