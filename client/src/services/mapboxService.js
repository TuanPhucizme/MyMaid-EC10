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
      return {
        success: true,
        coordinates: feature.center, // [longitude, latitude]
        placeName: feature.place_name,
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
 * Reverse Geocoding: Chuyển đổi tọa độ thành địa chỉ
 * @param {number} longitude - Kinh độ
 * @param {number} latitude - Vĩ độ
 * @returns {Promise<Object>} - Kết quả reverse geocoding
 */
export const reverseGeocode = async (longitude, latitude) => {
  try {
    const url = `${MAPBOX_BASE_URL}/geocoding/v5/mapbox.places/${longitude},${latitude}.json?language=vi&access_token=${MAPBOX_ACCESS_TOKEN}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      const feature = data.features[0];
      return {
        success: true,
        address: feature.place_name,
        context: feature.context,
        properties: feature.properties
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
 * Tìm kiếm địa điểm (Places API)
 * @param {string} query - Từ khóa tìm kiếm
 * @param {Array} coordinates - Tọa độ trung tâm [longitude, latitude]
 * @param {number} radius - Bán kính tìm kiếm (km)
 * @returns {Promise<Object>} - Kết quả tìm kiếm
 */
export const searchPlaces = async (query, coordinates = null, radius = 10) => {
  try {
    let url = `${MAPBOX_BASE_URL}/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?language=vi&access_token=${MAPBOX_ACCESS_TOKEN}`;
    
    if (coordinates) {
      url += `&proximity=${coordinates[0]},${coordinates[1]}`;
    }
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.features && data.features.length > 0) {
      return {
        success: true,
        places: data.features.map(feature => ({
          id: feature.id,
          name: feature.text,
          fullName: feature.place_name,
          coordinates: feature.center,
          type: feature.place_type[0],
          relevance: feature.relevance
        }))
      };
    } else {
      return {
        success: false,
        message: 'Không tìm thấy địa điểm nào'
      };
    }
  } catch (error) {
    console.error('Lỗi tìm kiếm địa điểm:', error);
    return {
      success: false,
      message: 'Lỗi khi tìm kiếm địa điểm'
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
 * Kiểm tra xem Mapbox có sẵn sàng không
 * @returns {boolean}
 */
export const isMapboxAvailable = () => {
  return !!MAPBOX_ACCESS_TOKEN;
};
