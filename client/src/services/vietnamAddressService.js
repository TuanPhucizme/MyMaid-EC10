// client/src/services/vietnamAddressService.js

// Import error handler
import { createError, ERROR_TYPES, SERVICES, showUserError, logError } from './errorHandler';

// API Base URL - disabled for production to force error handling
const API_BASE_URL = null; // process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

/**
 * Lấy danh sách tỉnh/thành phố
 * @param {string} search - Từ khóa tìm kiếm (optional)
 * @returns {Promise<Object>} - Kết quả API
 */
export const getProvinces = async (search = '') => {
  try {
    // Check if API is available
    if (!API_BASE_URL) {
      throw createError(
        ERROR_TYPES.SERVICE_UNAVAILABLE,
        SERVICES.VIETNAM_ADDRESS,
        'Dịch vụ địa chỉ Việt Nam không khả dụng'
      );
    }

    const url = new URL(`${API_BASE_URL}/addresses/provinces`);
    if (search) {
      url.searchParams.append('search', search);
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw createError(
        ERROR_TYPES.API_ERROR,
        SERVICES.VIETNAM_ADDRESS,
        data.message || 'Lỗi khi lấy danh sách tỉnh/thành phố'
      );
    }

    return {
      success: true,
      provinces: data.data,
      total: data.total
    };
  } catch (error) {
    logError(error, 'getProvinces');

    if (error.success === false) {
      // Already formatted error
      return error;
    }

    // Unexpected error
    const formattedError = createError(
      ERROR_TYPES.NETWORK_ERROR,
      SERVICES.VIETNAM_ADDRESS,
      'Không thể kết nối đến dịch vụ địa chỉ'
    );

    return formattedError;
  }
};

/**
 * Lấy danh sách quận/huyện theo tỉnh/thành phố
 * @param {string} provinceId - ID của tỉnh/thành phố
 * @param {string} search - Từ khóa tìm kiếm (optional)
 * @returns {Promise<Object>} - Kết quả API
 */
export const getDistricts = async (provinceId, search = '') => {
  try {
    const url = new URL(`${API_BASE_URL}/addresses/districts/${provinceId}`);
    if (search) {
      url.searchParams.append('search', search);
    }

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lỗi khi lấy danh sách quận/huyện');
    }

    return {
      success: true,
      districts: data.data,
      total: data.total,
      provinceId: data.provinceId
    };
  } catch (error) {
    console.error('Error fetching districts:', error);
    return {
      success: false,
      message: error.message || 'Lỗi khi lấy danh sách quận/huyện'
    };
  }
};

/**
 * Tìm kiếm địa chỉ tổng hợp
 * @param {string} query - Từ khóa tìm kiếm
 * @param {number} limit - Số lượng kết quả tối đa
 * @returns {Promise<Object>} - Kết quả API
 */
export const searchAddresses = async (query, limit = 10) => {
  try {
    if (!query || query.trim().length < 2) {
      return {
        success: true,
        addresses: [],
        total: 0
      };
    }

    // Check if API is available
    if (!API_BASE_URL) {
      // Return mock data for demo purposes
      return {
        success: true,
        addresses: [
          {
            id: 'mock_1',
            name: query.includes('Hà Nội') ? 'Hà Nội' : 'Quận 1',
            fullName: query.includes('Hà Nội') ? 'Thành phố Hà Nội' : 'Quận 1, Thành phố Hồ Chí Minh',
            type: 'district',
            province: { name: query.includes('Hà Nội') ? 'Hà Nội' : 'TP. Hồ Chí Minh' }
          }
        ],
        total: 1,
        query: query,
        note: 'Dữ liệu demo - dịch vụ backend không khả dụng'
      };
    }

    const url = new URL(`${API_BASE_URL}/addresses/search`);
    url.searchParams.append('q', query);
    url.searchParams.append('limit', limit.toString());

    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      throw createError(
        ERROR_TYPES.API_ERROR,
        SERVICES.VIETNAM_ADDRESS,
        data.message || 'Lỗi khi tìm kiếm địa chỉ'
      );
    }

    return {
      success: true,
      addresses: data.data,
      total: data.total,
      query: data.query
    };
  } catch (error) {
    logError(error, 'searchAddresses');

    if (error.success === false) {
      return error;
    }

    // Return fallback data instead of error for better UX
    return {
      success: true,
      addresses: [],
      total: 0,
      query: query,
      note: 'Dịch vụ tìm kiếm tạm thời không khả dụng'
    };
  }
};

/**
 * Lấy gợi ý địa chỉ phổ biến
 * @returns {Promise<Object>} - Kết quả API
 */
export const getAddressSuggestions = async () => {
  try {
    // Check if API is available
    if (!API_BASE_URL) {
      // Return default popular places
      return {
        success: true,
        suggestions: [
          {
            id: 'default_1',
            name: 'Quận 1, TP. Hồ Chí Minh',
            fullName: 'Quận 1, Thành phố Hồ Chí Minh',
            type: 'district',
            icon: '🏛️'
          },
          {
            id: 'default_2',
            name: 'Quận Hoàn Kiếm, Hà Nội',
            fullName: 'Quận Hoàn Kiếm, Thành phố Hà Nội',
            type: 'district',
            icon: '🏛️'
          },
          {
            id: 'default_3',
            name: 'Sân bay Tân Sơn Nhất',
            fullName: 'Sân bay Quốc tế Tân Sơn Nhất, TP. Hồ Chí Minh',
            type: 'poi',
            icon: '✈️'
          }
        ],
        total: 3,
        note: 'Dữ liệu mặc định - dịch vụ backend không khả dụng'
      };
    }

    const response = await fetch(`${API_BASE_URL}/addresses/suggestions`);
    const data = await response.json();

    if (!response.ok) {
      throw createError(
        ERROR_TYPES.API_ERROR,
        SERVICES.VIETNAM_ADDRESS,
        data.message || 'Lỗi khi lấy gợi ý địa chỉ'
      );
    }

    return {
      success: true,
      suggestions: data.data,
      total: data.total
    };
  } catch (error) {
    logError(error, 'getAddressSuggestions');

    // Always return fallback data for suggestions
    return {
      success: true,
      suggestions: [
        {
          id: 'fallback_1',
          name: 'Quận 1, TP. Hồ Chí Minh',
          fullName: 'Quận 1, Thành phố Hồ Chí Minh',
          type: 'district',
          icon: '🏛️'
        }
      ],
      total: 1,
      note: 'Dữ liệu dự phòng'
    };
  }
};

/**
 * Kết hợp tìm kiếm từ API Việt Nam và Mapbox
 * @param {string} query - Từ khóa tìm kiếm
 * @param {number} limit - Số lượng kết quả tối đa
 * @returns {Promise<Object>} - Kết quả tổng hợp
 */
export const searchCombinedAddresses = async (query, limit = 8) => {
  try {
    if (!query || query.trim().length < 2) {
      return {
        success: true,
        addresses: [],
        total: 0
      };
    }

    // Tìm kiếm từ API Việt Nam trước
    const vietnamResult = await searchAddresses(query, Math.ceil(limit / 2));
    
    // Import mapboxService dynamically để tránh circular dependency
    const { searchPlaces } = await import('./mapboxService');
    
    // Tìm kiếm từ Mapbox
    const mapboxResult = await searchPlaces(query, null, Math.ceil(limit / 2));

    const combinedResults = [];

    // Thêm kết quả từ API Việt Nam
    if (vietnamResult.success && vietnamResult.addresses) {
      vietnamResult.addresses.forEach(address => {
        combinedResults.push({
          ...address,
          source: 'vietnam_api',
          coordinates: null, // Sẽ được geocode sau nếu cần
          components: {
            province: address.province?.name,
            district: address.name,
            city: address.province?.name
          }
        });
      });
    }

    // Thêm kết quả từ Mapbox
    if (mapboxResult.success && mapboxResult.places) {
      mapboxResult.places.forEach(place => {
        // Kiểm tra trùng lặp dựa trên tên
        const isDuplicate = combinedResults.some(existing => 
          existing.name.toLowerCase() === place.name.toLowerCase() ||
          existing.fullName.toLowerCase() === place.fullName.toLowerCase()
        );

        if (!isDuplicate) {
          combinedResults.push({
            ...place,
            source: 'mapbox',
            level: 3 // Mapbox results có level thấp hơn
          });
        }
      });
    }

    // Sắp xếp theo độ liên quan và source
    const sortedResults = combinedResults
      .sort((a, b) => {
        // Ưu tiên kết quả từ API Việt Nam
        if (a.source === 'vietnam_api' && b.source === 'mapbox') return -1;
        if (a.source === 'mapbox' && b.source === 'vietnam_api') return 1;
        
        // Sau đó sắp xếp theo relevance
        return (b.relevance || 0) - (a.relevance || 0);
      })
      .slice(0, limit);

    return {
      success: true,
      addresses: sortedResults,
      total: sortedResults.length,
      query,
      sources: {
        vietnam: vietnamResult.success ? vietnamResult.total : 0,
        mapbox: mapboxResult.success ? mapboxResult.places?.length || 0 : 0
      }
    };
  } catch (error) {
    console.error('Error in combined address search:', error);
    return {
      success: false,
      message: error.message || 'Lỗi khi tìm kiếm địa chỉ'
    };
  }
};

/**
 * Format địa chỉ Việt Nam theo chuẩn
 * @param {Object} addressData - Dữ liệu địa chỉ
 * @returns {string} - Địa chỉ đã format
 */
export const formatVietnameseAddress = (addressData) => {
  const parts = [];
  
  if (addressData.street) parts.push(addressData.street);
  if (addressData.ward) parts.push(addressData.ward);
  if (addressData.district) parts.push(addressData.district);
  if (addressData.province) parts.push(addressData.province);
  
  return parts.join(', ');
};

/**
 * Validate địa chỉ Việt Nam
 * @param {string} address - Địa chỉ cần validate
 * @returns {Object} - Kết quả validation
 */
export const validateVietnameseAddress = (address) => {
  const errors = [];
  
  if (!address || address.trim().length < 5) {
    errors.push('Địa chỉ phải có ít nhất 5 ký tự');
  }
  
  // Kiểm tra có chứa ít nhất một từ khóa địa chỉ Việt Nam
  const vietnameseKeywords = [
    'quận', 'huyện', 'thành phố', 'tỉnh', 'phường', 'xã', 'thị trấn',
    'đường', 'phố', 'ngõ', 'hẻm', 'số'
  ];
  
  const hasVietnameseKeyword = vietnameseKeywords.some(keyword => 
    address.toLowerCase().includes(keyword)
  );
  
  if (!hasVietnameseKeyword) {
    errors.push('Địa chỉ nên chứa các từ khóa địa chỉ Việt Nam (quận, huyện, phường, đường, v.v.)');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default {
  getProvinces,
  getDistricts,
  searchAddresses,
  getAddressSuggestions,
  searchCombinedAddresses,
  formatVietnameseAddress,
  validateVietnameseAddress
};
