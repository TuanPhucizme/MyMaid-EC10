// server/routes/addressRoutes.js

const express = require('express');
const router = express.Router();

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Address routes working!' });
});

// Dữ liệu địa chỉ Việt Nam (có thể lưu trong database hoặc file JSON)
const vietnamAddresses = {
  provinces: [
    { id: 'HN', name: 'Hà Nội', type: 'Thành phố Trung ương' },
    { id: 'HCM', name: 'Hồ Chí Minh', type: 'Thành phố Trung ương' },
    { id: 'DN', name: 'Đà Nẵng', type: 'Thành phố Trung ương' },
    { id: 'HP', name: 'Hải Phòng', type: 'Thành phố Trung ương' },
    { id: 'CT', name: 'Cần Thơ', type: 'Thành phố Trung ương' },
    { id: 'AG', name: 'An Giang', type: 'Tỉnh' },
    { id: 'BR', name: 'Bà Rịa - Vũng Tàu', type: 'Tỉnh' },
    { id: 'BL', name: 'Bạc Liêu', type: 'Tỉnh' },
    { id: 'BK', name: 'Bắc Kạn', type: 'Tỉnh' },
    { id: 'BG', name: 'Bắc Giang', type: 'Tỉnh' },
    { id: 'BN', name: 'Bắc Ninh', type: 'Tỉnh' },
    { id: 'BT', name: 'Bến Tre', type: 'Tỉnh' },
    { id: 'BD', name: 'Bình Định', type: 'Tỉnh' },
    { id: 'BP', name: 'Bình Phước', type: 'Tỉnh' },
    { id: 'BU', name: 'Bình Thuận', type: 'Tỉnh' },
    { id: 'CM', name: 'Cà Mau', type: 'Tỉnh' },
    { id: 'CB', name: 'Cao Bằng', type: 'Tỉnh' },
    { id: 'DL', name: 'Đắk Lắk', type: 'Tỉnh' },
    { id: 'DG', name: 'Đắk Nông', type: 'Tỉnh' },
    { id: 'DB', name: 'Điện Biên', type: 'Tỉnh' },
    { id: 'DT', name: 'Đồng Tháp', type: 'Tỉnh' },
    { id: 'GL', name: 'Gia Lai', type: 'Tỉnh' },
    { id: 'HG', name: 'Hà Giang', type: 'Tỉnh' },
    { id: 'HNam', name: 'Hà Nam', type: 'Tỉnh' },
    { id: 'HT', name: 'Hà Tĩnh', type: 'Tỉnh' },
    { id: 'HD', name: 'Hải Dương', type: 'Tỉnh' },
    { id: 'HU', name: 'Thừa Thiên Huế', type: 'Tỉnh' },
    { id: 'HB', name: 'Hòa Bình', type: 'Tỉnh' },
    { id: 'HY', name: 'Hưng Yên', type: 'Tỉnh' },
    { id: 'KH', name: 'Khánh Hòa', type: 'Tỉnh' },
    { id: 'KG', name: 'Kiên Giang', type: 'Tỉnh' },
    { id: 'KT', name: 'Kon Tum', type: 'Tỉnh' },
    { id: 'LC', name: 'Lai Châu', type: 'Tỉnh' },
    { id: 'LD', name: 'Lâm Đồng', type: 'Tỉnh' },
    { id: 'LS', name: 'Lạng Sơn', type: 'Tỉnh' },
    { id: 'LO', name: 'Lào Cai', type: 'Tỉnh' },
    { id: 'LA', name: 'Long An', type: 'Tỉnh' },
    { id: 'ND', name: 'Nam Định', type: 'Tỉnh' },
    { id: 'NA', name: 'Nghệ An', type: 'Tỉnh' },
    { id: 'NB', name: 'Ninh Bình', type: 'Tỉnh' },
    { id: 'NT', name: 'Ninh Thuận', type: 'Tỉnh' },
    { id: 'PY', name: 'Phú Yên', type: 'Tỉnh' },
    { id: 'QB', name: 'Quảng Bình', type: 'Tỉnh' },
    { id: 'QN', name: 'Quảng Nam', type: 'Tỉnh' },
    { id: 'QG', name: 'Quảng Ngãi', type: 'Tỉnh' },
    { id: 'QNi', name: 'Quảng Ninh', type: 'Tỉnh' },
    { id: 'QT', name: 'Quảng Trị', type: 'Tỉnh' },
    { id: 'ST', name: 'Sóc Trăng', type: 'Tỉnh' },
    { id: 'SL', name: 'Sơn La', type: 'Tỉnh' },
    { id: 'TN', name: 'Tây Ninh', type: 'Tỉnh' },
    { id: 'TB', name: 'Thái Bình', type: 'Tỉnh' },
    { id: 'TG', name: 'Tiền Giang', type: 'Tỉnh' },
    { id: 'TV', name: 'Trà Vinh', type: 'Tỉnh' },
    { id: 'TQ', name: 'Tuyên Quang', type: 'Tỉnh' },
    { id: 'VL', name: 'Vĩnh Long', type: 'Tỉnh' },
    { id: 'VP', name: 'Vĩnh Phúc', type: 'Tỉnh' },
    { id: 'YB', name: 'Yên Bái', type: 'Tỉnh' }
  ],
  districts: {
    'HN': [
      { id: 'BA_DINH', name: 'Ba Đình', type: 'Quận' },
      { id: 'HOAN_KIEM', name: 'Hoàn Kiếm', type: 'Quận' },
      { id: 'TAY_HO', name: 'Tây Hồ', type: 'Quận' },
      { id: 'LONG_BIEN', name: 'Long Biên', type: 'Quận' },
      { id: 'CAU_GIAY', name: 'Cầu Giấy', type: 'Quận' },
      { id: 'DONG_DA', name: 'Đống Đa', type: 'Quận' },
      { id: 'HAI_BA_TRUNG', name: 'Hai Bà Trưng', type: 'Quận' },
      { id: 'HOANG_MAI', name: 'Hoàng Mai', type: 'Quận' },
      { id: 'THANH_XUAN', name: 'Thanh Xuân', type: 'Quận' },
      { id: 'SOC_SON', name: 'Sóc Sơn', type: 'Huyện' },
      { id: 'DONG_ANH', name: 'Đông Anh', type: 'Huyện' },
      { id: 'GIA_LAM', name: 'Gia Lâm', type: 'Huyện' },
      { id: 'NAM_TU_LIEM', name: 'Nam Từ Liêm', type: 'Quận' },
      { id: 'BAC_TU_LIEM', name: 'Bắc Từ Liêm', type: 'Quận' },
      { id: 'ME_LINH', name: 'Mê Linh', type: 'Huyện' },
      { id: 'HA_DONG', name: 'Hà Đông', type: 'Quận' }
    ],
    'HCM': [
      { id: 'QUAN_1', name: 'Quận 1', type: 'Quận' },
      { id: 'QUAN_2', name: 'Quận 2', type: 'Quận' },
      { id: 'QUAN_3', name: 'Quận 3', type: 'Quận' },
      { id: 'QUAN_4', name: 'Quận 4', type: 'Quận' },
      { id: 'QUAN_5', name: 'Quận 5', type: 'Quận' },
      { id: 'QUAN_6', name: 'Quận 6', type: 'Quận' },
      { id: 'QUAN_7', name: 'Quận 7', type: 'Quận' },
      { id: 'QUAN_8', name: 'Quận 8', type: 'Quận' },
      { id: 'QUAN_9', name: 'Quận 9', type: 'Quận' },
      { id: 'QUAN_10', name: 'Quận 10', type: 'Quận' },
      { id: 'QUAN_11', name: 'Quận 11', type: 'Quận' },
      { id: 'QUAN_12', name: 'Quận 12', type: 'Quận' },
      { id: 'THU_DUC', name: 'Thủ Đức', type: 'Thành phố' },
      { id: 'BINH_THANH', name: 'Bình Thạnh', type: 'Quận' },
      { id: 'GO_VAP', name: 'Gò Vấp', type: 'Quận' },
      { id: 'PHU_NHUAN', name: 'Phú Nhuận', type: 'Quận' },
      { id: 'TAN_BINH', name: 'Tân Bình', type: 'Quận' },
      { id: 'TAN_PHU', name: 'Tân Phú', type: 'Quận' },
      { id: 'BINH_TAN', name: 'Bình Tân', type: 'Quận' },
      { id: 'CU_CHI', name: 'Củ Chi', type: 'Huyện' },
      { id: 'HOC_MON', name: 'Hóc Môn', type: 'Huyện' },
      { id: 'BINH_CHANH', name: 'Bình Chánh', type: 'Huyện' },
      { id: 'NHA_BE', name: 'Nhà Bè', type: 'Huyện' },
      { id: 'CAN_GIO', name: 'Cần Giờ', type: 'Huyện' }
    ]
  }
};

/**
 * @route   GET /api/addresses/provinces
 * @desc    Lấy danh sách tỉnh/thành phố
 * @access  Public
 */
router.get('/provinces', async (req, res) => {
  try {
    const { search } = req.query;
    
    let provinces = vietnamAddresses.provinces;
    
    // Tìm kiếm theo tên nếu có
    if (search) {
      const searchTerm = search.toLowerCase().trim();
      provinces = provinces.filter(province => 
        province.name.toLowerCase().includes(searchTerm)
      );
    }
    
    res.status(200).json({
      success: true,
      data: provinces,
      total: provinces.length
    });
  } catch (error) {
    console.error('Error fetching provinces:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách tỉnh/thành phố'
    });
  }
});

/**
 * @route   GET /api/addresses/districts/:provinceId
 * @desc    Lấy danh sách quận/huyện theo tỉnh/thành phố
 * @access  Public
 */
router.get('/districts/:provinceId', async (req, res) => {
  try {
    const { provinceId } = req.params;
    const { search } = req.query;
    
    let districts = vietnamAddresses.districts[provinceId] || [];
    
    // Tìm kiếm theo tên nếu có
    if (search) {
      const searchTerm = search.toLowerCase().trim();
      districts = districts.filter(district => 
        district.name.toLowerCase().includes(searchTerm)
      );
    }
    
    res.status(200).json({
      success: true,
      data: districts,
      total: districts.length,
      provinceId
    });
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy danh sách quận/huyện'
    });
  }
});

/**
 * @route   GET /api/addresses/search
 * @desc    Tìm kiếm địa chỉ tổng hợp
 * @access  Public
 */
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 10 } = req.query;
    
    if (!q || q.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Từ khóa tìm kiếm phải có ít nhất 2 ký tự'
      });
    }
    
    const searchTerm = q.toLowerCase().trim();
    const results = [];
    
    // Tìm kiếm trong tỉnh/thành phố
    vietnamAddresses.provinces.forEach(province => {
      if (province.name.toLowerCase().includes(searchTerm)) {
        results.push({
          id: `province_${province.id}`,
          name: province.name,
          fullName: `${province.type} ${province.name}`,
          type: 'province',
          level: 1,
          icon: '🏛️',
          relevance: province.name.toLowerCase().indexOf(searchTerm) === 0 ? 1 : 0.8
        });
      }
      
      // Tìm kiếm trong quận/huyện của tỉnh này
      const districts = vietnamAddresses.districts[province.id] || [];
      districts.forEach(district => {
        if (district.name.toLowerCase().includes(searchTerm)) {
          results.push({
            id: `district_${province.id}_${district.id}`,
            name: district.name,
            fullName: `${district.type} ${district.name}, ${province.type} ${province.name}`,
            type: 'district',
            level: 2,
            icon: '🏢',
            province: province,
            relevance: district.name.toLowerCase().indexOf(searchTerm) === 0 ? 0.9 : 0.7
          });
        }
      });
    });
    
    // Sắp xếp theo độ liên quan và giới hạn kết quả
    const sortedResults = results
      .sort((a, b) => b.relevance - a.relevance)
      .slice(0, parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: sortedResults,
      total: sortedResults.length,
      query: q
    });
  } catch (error) {
    console.error('Error searching addresses:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi tìm kiếm địa chỉ'
    });
  }
});

/**
 * @route   GET /api/addresses/suggestions
 * @desc    Lấy gợi ý địa chỉ phổ biến
 * @access  Public
 */
router.get('/suggestions', async (req, res) => {
  try {
    const popularAddresses = [
      {
        id: 'hcm_q1',
        name: 'Quận 1',
        fullName: 'Quận 1, Thành phố Hồ Chí Minh',
        type: 'district',
        icon: '🏢',
        popular: true
      },
      {
        id: 'hn_hoankiem',
        name: 'Hoàn Kiếm',
        fullName: 'Quận Hoàn Kiếm, Thành phố Hà Nội',
        type: 'district',
        icon: '🏢',
        popular: true
      },
      {
        id: 'hcm_q3',
        name: 'Quận 3',
        fullName: 'Quận 3, Thành phố Hồ Chí Minh',
        type: 'district',
        icon: '🏢',
        popular: true
      },
      {
        id: 'hn_caugiay',
        name: 'Cầu Giấy',
        fullName: 'Quận Cầu Giấy, Thành phố Hà Nội',
        type: 'district',
        icon: '🏢',
        popular: true
      },
      {
        id: 'dn_haichau',
        name: 'Hải Châu',
        fullName: 'Quận Hải Châu, Thành phố Đà Nẵng',
        type: 'district',
        icon: '🏢',
        popular: true
      }
    ];
    
    res.status(200).json({
      success: true,
      data: popularAddresses,
      total: popularAddresses.length
    });
  } catch (error) {
    console.error('Error fetching address suggestions:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi khi lấy gợi ý địa chỉ'
    });
  }
});

module.exports = router;
