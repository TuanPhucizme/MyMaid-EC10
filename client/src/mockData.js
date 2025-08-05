// src/mockData.js

// Lấy ngày hiện tại để tạo dữ liệu động
const now = new Date();
const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);

// Dữ liệu mẫu cho đối tác đang đăng nhập
export const mockPartner = {
  name: 'An Nguyễn',
  email: 'partner.an@example.com',
  role: 'partner',
};

// Dữ liệu mẫu cho các đơn hàng (bookings)
export const mockBookings = [
  // --- Đơn mới được giao (sẽ xuất hiện trong danh sách "Đơn vừa được đặt") ---
  {
    id: 'job001',
    partnerId: 'PARTNER_UID_TUVXYZ',
    status: 'confirmed', // Trạng thái đã xác nhận
    createdAt: new Date(), // Hôm nay
    service: { name: 'Dọn dẹp nhà cửa' },
    schedule: { date: '2025-08-10', time: '09:00' },
    contact: { name: 'Trần Văn Khách' },
    summary: { totalPrice: 150000 },
  },
  {
    id: 'job002',
    partnerId: 'PARTNER_UID_TUVXYZ',
    status: 'confirmed',
    createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 ngày trước
    service: { name: 'Vệ sinh chuyên sâu' },
    schedule: { date: '2025-08-12', time: '14:00' },
    contact: { name: 'Lê Thị Bình' },
    summary: { totalPrice: 300000 },
  },

  // --- Đơn đã hoàn thành TRONG THÁNG NÀY (sẽ được tính vào doanh thu) ---
  {
    id: 'job003',
    partnerId: 'PARTNER_UID_TUVXYZ',
    status: 'completed', // Trạng thái đã hoàn thành
    createdAt: startOfMonth, // Ngày đầu của tháng này
    service: { name: 'Nấu ăn gia đình' },
    schedule: { date: '2025-08-01', time: '18:00' },
    contact: { name: 'Phạm Gia Hân' },
    summary: { totalPrice: 180000 },
  },
  {
    id: 'job004',
    partnerId: 'PARTNER_UID_TUVXYZ',
    status: 'completed',
    createdAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 ngày trước
    service: { name: 'Dọn dẹp nhà cửa' },
    schedule: { date: '2025-08-05', time: '10:00' },
    contact: { name: 'Võ Minh Tuấn' },
    summary: { totalPrice: 150000 },
  },

  // --- Đơn đã hoàn thành THÁNG TRƯỚC (sẽ KHÔNG được tính vào doanh thu tháng này) ---
  {
    id: 'job005',
    partnerId: 'PARTNER_UID_TUVXYZ',
    status: 'completed',
    createdAt: lastMonth, // Ngày của tháng trước
    service: { name: 'Giặt ủi' },
    schedule: { date: '2025-07-15', time: '11:00' },
    contact: { name: 'Đặng Thu Thảo' },
    summary: { totalPrice: 100000 },
  },

  // --- Đơn đã hủy (sẽ không xuất hiện ở đâu cả) ---
  {
    id: 'job006',
    partnerId: 'PARTNER_UID_TUVXYZ',
    status: 'cancelled',
    createdAt: new Date(),
    service: { name: 'Chăm sóc trẻ em' },
    schedule: { date: '2025-08-20', time: '08:00' },
    contact: { name: 'Hoàng Văn Dũng' },
    summary: { totalPrice: 200000 },
  },
];


// src/mockBookingDetails.js

// Dữ liệu này giả lập một document duy nhất được lấy từ collection 'bookings'
export const mockBookingDetails = {
  id: 'job-abc-123',
  status: 'confirmed', // 'pending', 'confirmed', 'completed', 'cancelled'
  createdAt: new Date('2025-08-05T10:00:00Z'),
  
  service: {
    name: 'Vệ sinh chuyên sâu',
    icon: '🧹',
  },

  schedule: {
    date: '2025-08-10',
    time: '09:00',
    area: {
      label: 'Vừa (50-80m² / 2-3 phòng)',
      duration: 4, // Thời lượng ước tính (giờ)
    },
  },

  contact: {
    name: 'Trần Văn Khách',
    phone: '0987654321',
  },

  address: {
    street: '123 Đường ABC, Phường Bến Nghé',
    district: 'Quận 1',
    city: 'Thành phố Hồ Chí Minh',
  },
  
  notes: 'Lưu ý có chó nhỏ (giống Poodle, rất hiền) trong nhà. Vui lòng lau kỹ khu vực bếp.',

  summary: {
    totalPrice: 300000, // Tổng tiền khách trả
    partnerEarning: 240000, // Số tiền đối tác nhận được (sau khi trừ phí)
  },
};