# MyMaid EC10 Process Management

## Tổng quan

Dự án MyMaid EC10 đã được cải thiện với hệ thống quản lý process mới để giải quyết các vấn đề:

1. ✅ **npm start ở root chỉ start mỗi frontend** - Đã sửa để chạy cả frontend và backend
2. ✅ **npm stop có thể chưa kill process được từ root npm start** - Đã cải thiện với process manager
3. ✅ **frontend phải chạy ở port 3000** - Đã cấu hình để frontend chạy ở port 3000

## Các lệnh mới

### Khởi động ứng dụng
```bash
# Khởi động cả frontend và backend (port 3000 và 5000)
npm start

# Hoặc sử dụng process manager trực tiếp
npm run pm:start
node process-manager.js start
```

### Dừng ứng dụng
```bash
# Dừng tất cả process một cách an toàn
npm stop

# Hoặc sử dụng process manager trực tiếp
npm run pm:stop
node process-manager.js stop
```

### Kiểm tra trạng thái
```bash
# Kiểm tra trạng thái các process
npm run status

# Hoặc sử dụng process manager trực tiếp
npm run pm:status
node process-manager.js status
```

### Khởi động lại
```bash
# Khởi động lại tất cả services
npm run restart

# Hoặc sử dụng process manager trực tiếp
npm run pm:restart
node process-manager.js restart
```

## Các lệnh legacy (cũ)

Nếu bạn muốn sử dụng hệ thống cũ:

```bash
# Khởi động với script cũ
npm run start:legacy

# Dừng với script cũ
npm run stop:legacy
```

## Các lệnh tiện ích

```bash
# Cài đặt tất cả dependencies
npm run install:all

# Kiểm tra environment variables
npm run check-env

# Chỉ chạy server
npm run server-only

# Chỉ chạy client
npm run client-only

# Kill process trên port cụ thể
npm run kill:ports

# Kiểm tra trạng thái port
npm run status
```

## Cấu hình Port

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## Tính năng Process Manager

### Lưu trữ PID
Process manager sẽ lưu trữ PID của các process vào file `.mymaid-pids.json` để có thể kill chính xác.

### Tự động cleanup
Khi nhận signal SIGINT hoặc SIGTERM, process manager sẽ tự động dừng tất cả process một cách an toàn.

### Kiểm tra port
Trước khi khởi động, process manager sẽ kiểm tra và kill các process đang sử dụng port 3000 và 5000.

### Logging màu sắc
Các log được hiển thị với màu sắc để dễ phân biệt:
- 🔵 **SERVER** - Backend process
- 🟣 **CLIENT** - Frontend process
- 🟡 **KILL** - Process termination
- 🟢 **Success** - Thành công
- 🔴 **Error** - Lỗi

## Troubleshooting

### Nếu port bị chiếm
```bash
# Kill tất cả process trên port 3000 và 5000
npm run kill:ports

# Hoặc restart toàn bộ
npm run restart
```

### Nếu process không dừng được
```bash
# Force kill tất cả Node.js process
npm run stop:legacy

# Sau đó khởi động lại
npm start
```

### Kiểm tra trạng thái
```bash
# Xem process nào đang chạy
npm run status

# Kiểm tra port
netstat -ano | findstr :3000
netstat -ano | findstr :5000
```

## Cấu trúc file

```
MyMaid-EC10/
├── process-manager.js     # Process manager mới
├── start.js              # Script khởi động cũ
├── .mymaid-pids.json     # File lưu PID (tự động tạo)
└── package.json          # Scripts cập nhật
```

## Lưu ý

- Process manager sẽ tự động tạo file `.mymaid-pids.json` để theo dõi process
- Khi sử dụng `npm start`, cả frontend và backend sẽ được khởi động
- Frontend sẽ chạy ở port 3000 như yêu cầu
- Sử dụng `Ctrl+C` để dừng tất cả process một cách an toàn 