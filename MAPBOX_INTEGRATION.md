# 🗺️ Tích hợp Mapbox vào MyMaid

## 📋 Tổng quan

Dự án đã được tích hợp Mapbox để cung cấp chức năng bản đồ và chọn địa chỉ chính xác cho dịch vụ maid. Mapbox được chọn vì:

- ✅ Hỗ trợ tiếng Việt tốt
- ✅ Dữ liệu địa chỉ Việt Nam chính xác
- ✅ Miễn phí với 50,000 request/tháng
- ✅ Giao diện đẹp và dễ sử dụng

## 🔑 Cài đặt

### 1. Dependencies đã được cài đặt

```bash
npm install mapbox-gl react-map-gl
```

### 2. Environment Variables

File `.env` đã được cập nhật với Mapbox access token:

```env
# Mapbox Configuration
REACT_APP_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoieWFuZWNoaSIsImEiOiJjbWViajBmdnQwZXU3MmxweHR5ZnplcHJ0In0.JPwiF0eTFmizO1GKKAeCqw
```

## 🧩 Components đã tạo

### 1. MapboxService (`src/services/mapboxService.js`)

Service chính để tương tác với Mapbox API:

- **geocodeAddress()**: Chuyển đổi địa chỉ thành tọa độ
- **reverseGeocode()**: Chuyển đổi tọa độ thành địa chỉ
- **searchPlaces()**: Tìm kiếm địa điểm
- **getDirections()**: Lấy thông tin tuyến đường

### 2. Map Component (`src/components/Map.js`)

Component bản đồ tương tác với các tính năng:

- Hiển thị bản đồ Mapbox
- Tìm kiếm địa chỉ
- Điều hướng và zoom
- Hiển thị markers
- Lấy vị trí người dùng

### 3. AddressSelector (`src/components/AddressSelector.js`)

Component chọn địa chỉ với:

- Input tìm kiếm địa chỉ
- Modal bản đồ để chọn địa chỉ
- Geocoding và reverse geocoding
- Validation địa chỉ

## 🚀 Cách sử dụng

### 1. Sử dụng Map component

```jsx
import Map from '../components/Map';

<Map
  initialCenter={[106.6297, 10.8231]} // Hồ Chí Minh
  initialZoom={12}
  markers={markers}
  onMapClick={handleMapClick}
  height="500px"
/>
```

### 2. Sử dụng AddressSelector

```jsx
import AddressSelector from '../components/AddressSelector';

<AddressSelector
  value={address}
  onChange={setAddress}
  onAddressSelect={({ address, coordinates }) => {
    console.log('Địa chỉ:', address);
    console.log('Tọa độ:', coordinates);
  }}
/>
```

### 3. Sử dụng MapboxService

```jsx
import { geocodeAddress, reverseGeocode } from '../services/mapboxService';

// Tìm kiếm địa chỉ
const result = await geocodeAddress('123 Đường ABC, Quận 1, TP.HCM', 'VN');

// Lấy địa chỉ từ tọa độ
const address = await reverseGeocode(106.6297, 10.8231);
```

## 📱 Tích hợp vào BookingPage

Trang đặt dịch vụ đã được cập nhật với 4 bước:

1. **Bước 1**: Chọn dịch vụ
2. **Bước 2**: Chọn thời gian và quy mô
3. **Bước 3**: Chọn địa chỉ (với Mapbox)
4. **Bước 4**: Thông tin liên hệ

### Tính năng mới:

- ✅ Chọn địa chỉ chính xác trên bản đồ
- ✅ Geocoding tự động
- ✅ Validation địa chỉ
- ✅ Hiển thị tọa độ trong tóm tắt
- ✅ Giao diện thân thiện người dùng

## 🎨 Styling

CSS đã được thêm vào `src/index.css`:

```css
/* Mapbox Styles */
.mapboxgl-map {
  font-family: 'Inter', sans-serif;
}

.mapboxgl-popup-content {
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}
```

## 🧪 Testing

Trang demo đã được tạo tại `src/pages/MapDemoPage.js` để test:

- AddressSelector component
- Map component
- Tương tác giữa các components
- Geocoding và reverse geocoding

## 🔧 Troubleshooting

### 1. Bản đồ không hiển thị

- Kiểm tra Mapbox access token trong `.env`
- Kiểm tra console để xem lỗi
- Đảm bảo đã cài đặt `mapbox-gl` CSS

### 2. Geocoding không hoạt động

- Kiểm tra kết nối internet
- Kiểm tra quota Mapbox (50,000 request/tháng)
- Kiểm tra console để xem lỗi API

### 3. Styling không đúng

- Kiểm tra CSS đã được import
- Kiểm tra Tailwind CSS classes
- Kiểm tra styled-components

## 📚 Tài liệu tham khảo

- [Mapbox GL JS Documentation](https://docs.mapbox.com/mapbox-gl-js/)
- [Mapbox Geocoding API](https://docs.mapbox.com/api/search/geocoding/)
- [React Map GL](https://visgl.github.io/react-map-gl/)

## 🎯 Tính năng tương lai

- [ ] Tích hợp với Google Maps API (backup)
- [ ] Lưu lịch sử địa chỉ
- [ ] Tối ưu hóa cho mobile
- [ ] Offline maps
- [ ] Multi-language support
- [ ] Advanced routing

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:

1. Console browser để xem lỗi
2. Network tab để xem API calls
3. Mapbox account để kiểm tra quota
4. Environment variables

---

**Lưu ý**: Mapbox access token hiện tại có thể cần được thay thế bằng token mới nếu hết hạn hoặc vượt quota.
