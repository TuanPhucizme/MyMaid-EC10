const MAPBOX_ACCESS_TOKEN = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
const MAPBOX_BASE_URL = 'https://api.mapbox.com';

/**
 * Geocoding: Chuyển đổi địa chỉ thành tọa độ
 * @param {string} address - Địa chỉ cần tìm kiếm
 * @param {string} country - Quốc gia (mặc định: VN cho Việt Nam)
 * @returns {Promise<Object>} - Kết quả geocoding
 */
export const geocodeAddress = async (address, country = 'VN') => {
  try {
    const query = encodeURIComponent(address);
    const url = `${MAPBOX_BASE_URL}/geocoding/v5/mapbox.places/${query}.json?country=${country}&language=vi&access_token=${MAPBOX_ACCESS_TOKEN}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const addressComponents = parseAddressComponents(feature.context, feature.place_name);
      const formattedAddress = formatFullAddress(addressComponents);
      
      return {
        success: true,
        coordinates: feature.center, // [longitude, latitude]
        placeName: feature.place_name,
        formattedAddress: formattedAddress,
        components: addressComponents,
        context: feature.context,
        bbox: feature.bbox,
        properties: feature.properties
      };
    } else {
      return {
        success: false,
        message: 'Không tìm thấy địa chỉ'
      };
    }
  } catch (error) {
    console.error('Lỗi geocoding:', error);
    return {
      success: false,
      message: 'Lỗi khi tìm kiếm địa chỉ'
    };
  }
};

/**
 * Trích xuất thông tin địa chỉ chi tiết từ context
 * @param {Array} context - Mảng context từ Mapbox
 * @returns {Object} - Thông tin địa chỉ được phân tách
 */
const parseAddressComponents = (context, placeName) => {
  const components = {
    houseNumber: null,
    street: null,
    ward: null,
    district: null,
    city: null,
    province: null,
    country: null,
    postalCode: null
  };

  if (!context) return components;

  // Phân tích context để lấy các thành phần địa chỉ
  context.forEach(item => {
    const type = item.id.split('.')[0];
    switch (type) {
      case 'postcode':
        components.postalCode = item.text;
        break;
      case 'district':
        components.district = item.text;
        break;
      case 'place':
        // Thường là thành phố hoặc quận/huyện
        if (item.text.includes('Quận') || item.text.includes('Huyện')) {
          components.district = item.text;
        } else {
          components.city = item.text;
        }
        break;
      case 'region':
        components.province = item.text;
        break;
      case 'country':
        components.country = item.text;
        break;
      case 'locality':
        components.ward = item.text;
        break;
      case 'neighborhood':
        components.ward = item.text;
        break;
    }
  });

  // Cố gắng trích xuất số nhà và tên đường từ place_name
  if (placeName) {
    const parts = placeName.split(',').map(p => p.trim());
    if (parts.length > 0) {
      const firstPart = parts[0];
      // Tìm kiếm pattern số nhà + tên đường
      const streetMatch = firstPart.match(/^(\d+[\w/]*)\s+(.+)$/);
      if (streetMatch) {
        components.houseNumber = streetMatch[1];
        components.street = streetMatch[2];
      } else {
        // Nếu không có số nhà, coi toàn bộ là tên đường
        components.street = firstPart;
      }
    }
  }

  return components;
};

/**
 * Định dạng địa chỉ hoàn chỉnh từ các thành phần
 * @param {Object} components - Thành phần địa chỉ
 * @returns {string} - Địa chỉ được định dạng
 */
const formatFullAddress = (components) => {
  const parts = [];
  
  if (components.houseNumber && components.street) {
    parts.push(`${components.houseNumber} ${components.street}`);
  } else if (components.street) {
    parts.push(components.street);
  }
  
  if (components.ward) parts.push(components.ward);
  if (components.district) parts.push(components.district);
  if (components.city) parts.push(components.city);
  if (components.province) parts.push(components.province);
  if (components.country) parts.push(components.country);
  
  return parts.join(', ');
};

/**
 * Reverse Geocoding: Chuyển đổi tọa độ thành địa chỉ
 * @param {number} longitude - Kinh độ
 * @param {number} latitude - Vĩ độ
 * @returns {Promise<Object>} - Kết quả reverse geocoding
 */
export const reverseGeocode = async (longitude, latitude) => {
  try {
    const url = `${MAPBOX_BASE_URL}/geocoding/v5/mapbox.places/${longitude},${latitude}.json?language=vi&types=address,poi&access_token=${MAPBOX_ACCESS_TOKEN}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      const addressComponents = parseAddressComponents(feature.context, feature.place_name);
      const formattedAddress = formatFullAddress(addressComponents);
      
      return {
        success: true,
        address: feature.place_name,
        formattedAddress: formattedAddress,
        components: addressComponents,
        context: feature.context,
        properties: feature.properties,
        coordinates: [longitude, latitude]
      };
    } else {
      return {
        success: false,
        message: 'Không thể xác định địa chỉ từ tọa độ'
      };
    }
  } catch (error) {
    console.error('Lỗi reverse geocoding:', error);
    return {
      success: false,
      message: 'Lỗi khi xác định địa chỉ'
    };
  }
};

/**
 * Tìm kiếm địa điểm với autocomplete (Places API)
 * @param {string} query - Từ khóa tìm kiếm
 * @param {Array} coordinates - Tọa độ trung tâm [longitude, latitude]
 * @param {number} limit - Số lượng kết quả tối đa (mặc định: 5)
 * @returns {Promise<Object>} - Kết quả tìm kiếm
 */
export const searchPlaces = async (query, coordinates = null, limit = 5) => {
  // Sử dụng function tối ưu cho Việt Nam
  return await searchVietnamesePlaces(query, coordinates, limit);
};

/**
 * Lấy icon phù hợp cho loại địa điểm
 * @param {string} placeType - Loại địa điểm
 * @returns {string} - Emoji icon
 */
const getPlaceIcon = (placeType) => {
  switch (placeType) {
    case 'address':
      return '🏠';
    case 'poi':
      return '📍';
    case 'neighborhood':
      return '🏘️';
    case 'place':
      return '🏙️';
    case 'region':
      return '🗺️';
    case 'country':
      return '🌍';
    case 'district':
      return '🏢';
    case 'province':
      return '🏛️';
    default:
      return '📍';
  }
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
    'đường', 'phố', 'ngõ', 'hẻm', 'số', 'tp.', 'q.', 'p.', 'tt.'
  ];

  const hasVietnameseKeyword = vietnameseKeywords.some(keyword =>
    address.toLowerCase().includes(keyword)
  );

  if (!hasVietnameseKeyword) {
    errors.push('Địa chỉ nên chứa các từ khóa địa chỉ Việt Nam');
  }

  return {
    isValid: errors.length === 0,
    errors,
    score: errors.length === 0 ? 1 : Math.max(0, 1 - errors.length * 0.3)
  };
};

/**
 * Chuẩn hóa địa chỉ Việt Nam
 * @param {string} address - Địa chỉ cần chuẩn hóa
 * @returns {string} - Địa chỉ đã chuẩn hóa
 */
export const normalizeVietnameseAddress = (address) => {
  if (!address) return '';

  let normalized = address.trim();

  // Chuẩn hóa các từ viết tắt
  const abbreviations = {
    'tp.': 'thành phố',
    'tp ': 'thành phố ',
    'q.': 'quận',
    'q ': 'quận ',
    'p.': 'phường',
    'p ': 'phường ',
    'tt.': 'thị trấn',
    'tt ': 'thị trấn ',
    'đ.': 'đường',
    'đ ': 'đường '
  };

  Object.entries(abbreviations).forEach(([abbr, full]) => {
    const regex = new RegExp(abbr, 'gi');
    normalized = normalized.replace(regex, full);
  });

  // Chuẩn hóa khoảng trắng
  normalized = normalized.replace(/\s+/g, ' ').trim();

  // Viết hoa chữ cái đầu của mỗi từ
  normalized = normalized.replace(/\b\w/g, char => char.toUpperCase());

  return normalized;
};

/**
 * Tìm kiếm địa chỉ Việt Nam với tối ưu hóa
 * @param {string} query - Từ khóa tìm kiếm
 * @param {Array} coordinates - Tọa độ trung tâm [longitude, latitude]
 * @param {number} limit - Số lượng kết quả tối đa
 * @returns {Promise<Object>} - Kết quả tìm kiếm
 */
export const searchVietnamesePlaces = async (query, coordinates = null, limit = 8) => {
  try {
    if (!query.trim() || query.length < 2) {
      return {
        success: true,
        places: []
      };
    }

    // Chuẩn hóa query
    const normalizedQuery = normalizeVietnameseAddress(query);

    // Tạo URL với các tham số tối ưu cho Việt Nam
    let url = `${MAPBOX_BASE_URL}/geocoding/v5/mapbox.places/${encodeURIComponent(normalizedQuery)}.json?`;

    const params = new URLSearchParams({
      language: 'vi',
      limit: limit.toString(),
      types: 'address,poi,neighborhood,place,district,region',
      country: 'VN',
      access_token: MAPBOX_ACCESS_TOKEN
    });

    // Thêm proximity nếu có tọa độ
    if (coordinates && Array.isArray(coordinates) && coordinates.length === 2) {
      params.append('proximity', `${coordinates[0]},${coordinates[1]}`);
    } else {
      // Mặc định ưu tiên khu vực Hồ Chí Minh và Hà Nội
      params.append('proximity', '106.6297,10.8231'); // HCM
    }

    url += params.toString();

    const response = await fetch(url);
    const data = await response.json();

    if (data.features && data.features.length > 0) {
      const places = data.features.map(feature => {
        const addressComponents = parseAddressComponents(feature.context, feature.place_name);
        const validation = validateVietnameseAddress(feature.place_name);

        return {
          id: feature.id,
          name: feature.text,
          fullName: feature.place_name,
          formattedAddress: formatFullAddress(addressComponents),
          coordinates: feature.center,
          type: feature.place_type[0],
          relevance: feature.relevance,
          components: addressComponents,
          icon: getPlaceIcon(feature.place_type[0]),
          validation: validation,
          bbox: feature.bbox,
          properties: feature.properties
        };
      });

      // Sắp xếp theo độ liên quan và validation score
      const sortedPlaces = places.sort((a, b) => {
        const scoreA = (a.relevance || 0) * (a.validation?.score || 0.5);
        const scoreB = (b.relevance || 0) * (b.validation?.score || 0.5);
        return scoreB - scoreA;
      });

      return {
        success: true,
        places: sortedPlaces,
        query: normalizedQuery,
        originalQuery: query
      };
    } else {
      return {
        success: true,
        places: [],
        query: normalizedQuery,
        originalQuery: query
      };
    }
  } catch (error) {
    console.error('Lỗi tìm kiếm địa chỉ Việt Nam:', error);
    return {
      success: false,
      message: 'Lỗi khi tìm kiếm địa chỉ',
      error: error.message
    };
  }
};

/**
 * Lấy thông tin tuyến đường
 * @param {Array} start - Tọa độ điểm bắt đầu [longitude, latitude]
 * @param {Array} end - Tọa độ điểm kết thúc [longitude, latitude]
 * @param {string} profile - Loại tuyến đường (driving, walking, cycling)
 * @returns {Promise<Object>} - Thông tin tuyến đường
 */
export const getDirections = async (start, end, profile = 'driving') => {
  try {
    const coordinates = `${start[0]},${start[1]};${end[0]},${end[1]}`;
    const url = `${MAPBOX_BASE_URL}/directions/v5/mapbox/${profile}/${coordinates}.json?language=vi&access_token=${MAPBOX_ACCESS_TOKEN}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.routes && data.routes.length > 0) {
      const route = data.routes[0];
      return {
        success: true,
        distance: route.distance, // mét
        duration: route.duration, // giây
        geometry: route.geometry,
        legs: route.legs
      };
    } else {
      return {
        success: false,
        message: 'Không thể tìm thấy tuyến đường'
      };
    }
  } catch (error) {
    console.error('Lỗi lấy tuyến đường:', error);
    return {
      success: false,
      message: 'Lỗi khi lấy thông tin tuyến đường'
    };
  }
};

/**
 * Tìm kiếm kết hợp từ Mapbox và API Việt Nam
 * @param {string} query - Từ khóa tìm kiếm
 * @param {Array} coordinates - Tọa độ trung tâm [longitude, latitude]
 * @param {number} limit - Số lượng kết quả tối đa
 * @returns {Promise<Object>} - Kết quả tìm kiếm kết hợp
 */
export const searchCombinedPlaces = async (query, coordinates = null, limit = 8) => {
  try {
    // Import vietnamAddressService dynamically để tránh circular dependency
    const { searchCombinedAddresses } = await import('./vietnamAddressService');

    // Sử dụng function từ vietnamAddressService
    return await searchCombinedAddresses(query, limit);
  } catch (error) {
    console.error('Lỗi tìm kiếm kết hợp:', error);

    // Fallback về Mapbox nếu có lỗi
    return await searchVietnamesePlaces(query, coordinates, limit);
  }
};

/**
 * Geocode địa chỉ với validation Việt Nam
 * @param {string} address - Địa chỉ cần geocode
 * @param {string} country - Quốc gia (mặc định: VN)
 * @returns {Promise<Object>} - Kết quả geocoding với validation
 */
export const geocodeVietnameseAddress = async (address, country = 'VN') => {
  try {
    // Chuẩn hóa địa chỉ trước khi geocode
    const normalizedAddress = normalizeVietnameseAddress(address);

    // Validate địa chỉ
    const validation = validateVietnameseAddress(normalizedAddress);

    // Thực hiện geocoding
    const result = await geocodeAddress(normalizedAddress, country);

    if (result.success) {
      return {
        ...result,
        validation,
        normalizedAddress,
        originalAddress: address
      };
    } else {
      return {
        ...result,
        validation,
        normalizedAddress,
        originalAddress: address
      };
    }
  } catch (error) {
    console.error('Lỗi geocode địa chỉ Việt Nam:', error);
    return {
      success: false,
      message: 'Lỗi khi geocode địa chỉ',
      validation: { isValid: false, errors: ['Lỗi hệ thống'], score: 0 },
      originalAddress: address
    };
  }
};

/**
 * Kiểm tra xem Mapbox có sẵn sàng không
 * @returns {boolean}
 */
export const isMapboxAvailable = () => {
  return !!MAPBOX_ACCESS_TOKEN;
};
