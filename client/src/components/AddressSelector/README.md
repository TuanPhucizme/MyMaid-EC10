# 🏠 Enhanced Address Selector - Google Maps Style

Một component chọn địa chỉ thông minh với tính năng autocomplete giống Google Maps, được tối ưu hóa cho thị trường Việt Nam.

## ✨ Tính năng nổi bật

### 🔍 Autocomplete thông minh
- **Tìm kiếm ngay khi gõ**: Hiển thị kết quả ngay từ ký tự đầu tiên
- **Debounce tối ưu**: 100ms cho ký tự đầu, 200ms cho các ký tự tiếp theo
- **Tìm kiếm song song**: Kết hợp nhiều nguồn dữ liệu cùng lúc
- **Loại bỏ trùng lặp**: Tự động gộp kết quả giống nhau

### 🌟 Địa điểm phổ biến
- Hiển thị sân bay (Tân Sơn Nhất, Nội Bài)
- Trung tâm thành phố (Quận 1 HCM, Hoàn Kiếm HN)
- Tự động load từ API hoặc dùng danh sách mặc định

### 💾 Lịch sử tìm kiếm
- Lưu 5 địa chỉ gần nhất vào localStorage
- Hiển thị khi click vào ô tìm kiếm
- Có thể xóa và cập nhật

### 🎯 Kết quả thông minh
- **Highlight từ khóa**: Làm nổi bật phần khớp với tìm kiếm
- **Icon phân loại**: 🏠 địa chỉ, 🏢 POI, 🏛️ quận/huyện
- **Badge thông tin**: Quận/huyện, thành phố, độ liên quan
- **Sắp xếp theo relevance**: Kết quả phù hợp nhất lên đầu

### 🗺️ Tích hợp bản đồ
- Chọn địa chỉ chính xác trên bản đồ Mapbox
- Reverse geocoding từ tọa độ
- Hiển thị marker cho địa điểm đã chọn

## 🚀 Cách sử dụng

### Import component
```jsx
import AddressSelector from '../components/AddressSelector';
```

### Sử dụng cơ bản
```jsx
const [address, setAddress] = useState('');
const [addressData, setAddressData] = useState(null);

<AddressSelector
  value={address}
  onChange={setAddress}
  onAddressSelect={(data) => {
    setAddressData(data);
    console.log('Địa chỉ đã chọn:', data);
  }}
  placeholder="Nhập địa chỉ hoặc chọn từ gợi ý..."
/>
```

### Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `value` | string | `''` | Giá trị hiện tại của input |
| `onChange` | function | - | Callback khi giá trị input thay đổi |
| `onAddressSelect` | function | - | Callback khi chọn địa chỉ từ dropdown |
| `placeholder` | string | `'Nhập địa chỉ...'` | Placeholder cho input |
| `disabled` | boolean | `false` | Vô hiệu hóa component |
| `showMapButton` | boolean | `true` | Hiển thị nút mở bản đồ |

### Dữ liệu trả về (onAddressSelect)

```javascript
{
  address: "Quận 1, Thành phố Hồ Chí Minh",
  coordinates: [106.7017, 10.7769],
  components: {
    district: "Quận 1",
    city: "TP. Hồ Chí Minh",
    country: "Vietnam"
  },
  formattedAddress: "Quận 1, Thành phố Hồ Chí Minh",
  type: "district",
  source: "mapbox",
  relevance: 0.95,
  place_type: ["district"]
}
```

## 🔧 Cấu hình

### Environment Variables
```bash
REACT_APP_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

### API Dependencies
- **Mapbox Geocoding API**: Tìm kiếm địa chỉ quốc tế
- **Vietnam Address Service**: Dữ liệu địa chỉ Việt Nam chuyên biệt

## 🎨 Customization

### Styling
Component sử dụng styled-components, có thể override CSS:

```jsx
const CustomAddressSelector = styled(AddressSelector)`
  .search-input {
    border-color: #your-color;
  }
  
  .search-results {
    box-shadow: your-shadow;
  }
`;
```

### Custom Icons
```jsx
const getLocationIcon = (type) => {
  switch (type) {
    case 'custom': return '🏪';
    default: return '📍';
  }
};
```

## 📱 Responsive Design

Component tự động responsive trên các thiết bị:
- **Desktop**: Dropdown đầy đủ tính năng
- **Mobile**: Tối ưu cho touch, keyboard ảo
- **Tablet**: Cân bằng giữa desktop và mobile

## 🔍 Troubleshooting

### Không có kết quả tìm kiếm
1. Kiểm tra Mapbox token
2. Kiểm tra kết nối mạng
3. Thử từ khóa khác (ít nhất 2 ký tự)

### Bản đồ không hiển thị
1. Kiểm tra Mapbox token
2. Kiểm tra CORS settings
3. Kiểm tra console errors

### Performance issues
1. Tăng debounce delay
2. Giảm số lượng kết quả (limit)
3. Kiểm tra memory leaks

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push và tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.
