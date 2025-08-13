# Hướng Dẫn Sử Dụng Hệ Thống Quản Lý Đơn Hàng - MyMaid

## Tổng Quan

Hệ thống quản lý đơn hàng MyMaid cho phép khách hàng theo dõi và quản lý các đơn hàng dịch vụ từ lúc đặt đến khi hoàn thành. Hệ thống bao gồm các tính năng:

- ✅ Tạo đơn hàng tự động khi thanh toán
- ✅ Theo dõi trạng thái đơn hàng theo thời gian thực
- ✅ Hủy đơn hàng ở trạng thái chờ xác nhận
- ✅ Xem lịch sử giao dịch toàn bộ
- ✅ Chi tiết đầy đủ về từng đơn hàng

## Các Trạng Thái Đơn Hàng

### 1. Chờ Thanh Toán (`pending_payment`)
- **Mô tả**: Đơn hàng vừa được tạo, chờ khách hàng thanh toán
- **Hành động**: Tự động chuyển sang trạng thái tiếp theo sau khi thanh toán thành công

### 2. Chờ Xác Nhận (`pending_confirmation`)
- **Mô tả**: Thanh toán thành công, chờ nhân viên xác nhận
- **Hành động khả dụng**: 
  - ✅ Hủy đơn hàng (với lý do)
  - ✅ Xem chi tiết đơn hàng

### 3. Đã Xác Nhận (`confirmed`)
- **Mô tả**: Nhân viên đã xác nhận, chuẩn bị thực hiện dịch vụ
- **Hành động**: Chờ nhân viên đến làm việc

### 4. Đang Thực Hiện (`in_progress`)
- **Mô tả**: Nhân viên đang thực hiện dịch vụ tại địa chỉ khách hàng
- **Hành động**: Theo dõi tiến độ

### 5. Hoàn Thành (`completed`)
- **Mô tả**: Dịch vụ đã được hoàn thành
- **Hành động**: Xem lại chi tiết và đánh giá (nếu có)

### 6. Đã Hủy (`cancelled`)
- **Mô tả**: Đơn hàng đã bị hủy
- **Hành động**: Xem lý do hủy và chi tiết

## Cách Sử Dụng

### 1. Đặt Dịch Vụ và Tạo Đơn Hàng

1. **Chọn dịch vụ**: Vào trang dịch vụ và chọn dịch vụ cần đặt
2. **Điền thông tin**: Nhập thông tin liên hệ, địa chỉ, thời gian
3. **Thanh toán**: Được chuyển đến trang thanh toán
4. **Tạo đơn hàng tự động**: Hệ thống tự động tạo đơn hàng và chuyển đến VNPay
5. **Hoàn tất**: Sau khi thanh toán thành công, đơn hàng chuyển sang trạng thái "Chờ xác nhận"

### 2. Theo Dõi Đơn Hàng

1. **Truy cập**: Đăng nhập và vào "Đơn hàng của tôi" từ menu user
2. **Xem theo trạng thái**: Chọn tab tương ứng với trạng thái muốn xem:
   - Chờ xác nhận
   - Đã xác nhận  
   - Đang thực hiện
   - Hoàn thành
   - Tất cả
3. **Chi tiết đơn hàng**: Click "Xem chi tiết" để xem thông tin đầy đủ

### 3. Hủy Đơn Hàng

#### Hủy Nhanh:
1. Ở danh sách đơn hàng, click "Hủy đơn" (chỉ hiện ở trạng thái "Chờ xác nhận")
2. Xác nhận hủy đơn

#### Hủy Chi Tiết:
1. Vào chi tiết đơn hàng
2. Click "Hủy đơn hàng"
3. Nhập lý do hủy
4. Xác nhận hủy

### 4. Xem Chi Tiết Đơn Hàng

Modal chi tiết đơn hàng bao gồm:

#### Thông Tin Cơ Bản:
- Trạng thái hiện tại
- Mã đơn hàng
- Dịch vụ đã đặt

#### Thông Tin Dịch Vụ:
- Tên dịch vụ
- Ngày & giờ thực hiện
- Thời gian thực hiện (giờ)
- Tổng tiền

#### Thông Tin Liên Hệ:
- Họ tên khách hàng
- Số điện thoại
- Địa chỉ thực hiện
- Ghi chú (nếu có)

#### Thông Tin Thanh Toán:
- Phương thức thanh toán: VNPay
- Mã giao dịch VNPAY
- Ngân hàng sử dụng
- Thời gian thanh toán

#### Lịch Sử Trạng Thái:
- Timeline đầy đủ các thay đổi trạng thái
- Thời gian chuyển đổi
- Ghi chú cho mỗi thay đổi

## API Endpoints

### Backend Routes (`/api/orders`)

| Method | Endpoint | Mô tả | Auth |
|--------|----------|-------|------|
| POST | `/api/orders` | Tạo đơn hàng mới | ✅ |
| GET | `/api/orders` | Lấy danh sách đơn hàng | ✅ |
| GET | `/api/orders/:id` | Lấy chi tiết đơn hàng | ✅ |
| PUT | `/api/orders/:id/status` | Cập nhật trạng thái | ✅ |
| PUT | `/api/orders/:id/cancel` | Hủy đơn hàng | ✅ |
| PUT | `/api/orders/:id/payment-success` | Cập nhật thanh toán thành công | Public |

### Frontend Routes

| Route | Component | Mô tả |
|-------|-----------|-------|
| `/my-orders` | `OrderManagementPage` | Trang quản lý đơn hàng |
| `/payment` | `PaymentPage` | Trang thanh toán (đã tích hợp tạo đơn) |
| `/payment-result` | `PaymentResult` | Kết quả thanh toán (đã tích hợp cập nhật đơn) |

## Database Schema (Firestore)

### Collection: `orders`

```javascript
{
  id: "auto-generated-id",
  userId: "firebase-user-id",
  service: {
    id: "service-id",
    name: "Tên dịch vụ",
    icon: "emoji-icon"
  },
  schedule: {
    date: "YYYY-MM-DD",
    time: "HH:MM",
    duration: 2,
    frequency: "one-time"
  },
  contact: {
    name: "Tên khách hàng",
    phone: "0123456789",
    email: "email@example.com",
    address: "Địa chỉ đầy đủ",
    notes: "Ghi chú thêm"
  },
  payment: {
    amount: 250000,
    method: "vnpay",
    currency: "VND",
    vnpayOrderId: "VNPAY-order-id",
    vnpayTransactionId: "transaction-id",
    vnpayResponseCode: "00",
    vnpayBankCode: "NCB",
    vnpayPayDate: "20240101120000",
    paidAt: "2024-01-01T12:00:00Z"
  },
  status: "pending_confirmation",
  statusHistory: [
    {
      status: "pending_payment",
      timestamp: "2024-01-01T11:00:00Z",
      note: "Đơn hàng được tạo"
    },
    {
      status: "pending_confirmation", 
      timestamp: "2024-01-01T12:00:00Z",
      note: "Thanh toán thành công"
    }
  ],
  createdAt: "2024-01-01T11:00:00Z",
  updatedAt: "2024-01-01T12:00:00Z"
}
```

## Lưu Ý Kỹ Thuật

### 1. Authentication
- Tất cả API calls đều cần Firebase ID Token
- Frontend tự động inject token qua axios interceptor

### 2. Error Handling
- Validation đầy đủ ở backend
- Error messages bằng tiếng Việt
- Graceful fallbacks cho UI

### 3. Performance  
- Pagination cho danh sách đơn hàng
- Lazy loading cho chi tiết
- Optimized queries với Firestore indexes

### 4. Security
- User chỉ có thể xem/sửa đơn hàng của mình
- Validation chặt chẽ cho status transitions
- Secure payment integration với VNPay

## Tính Năng Mở Rộng

### Đã Triển Khai:
- ✅ Quản lý trạng thái đơn hàng
- ✅ Hủy đơn hàng với lý do
- ✅ Lịch sử trạng thái chi tiết
- ✅ Tích hợp thanh toán VNPay
- ✅ UI/UX responsive

### Có Thể Mở Rộng:
- 🔄 Thông báo real-time (WebSocket)
- 🔄 Đánh giá và review sau khi hoàn thành
- 🔄 Chat với nhân viên
- 🔄 Tracking GPS của nhân viên
- 🔄 Push notifications
- 🔄 Export lịch sử đơn hàng

## Support

Nếu có vấn đề hoặc cần hỗ trợ:
1. Kiểm tra console browser để xem lỗi JavaScript
2. Kiểm tra server logs cho API errors
3. Verify Firebase authentication status
4. Check Firestore security rules
