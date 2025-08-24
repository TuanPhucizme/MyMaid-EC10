/**
 * Error Handler Service
 * Thay thế tất cả localhost calls bằng error handling
 */

// Enum cho các loại lỗi
export const ERROR_TYPES = {
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_ERROR: 'API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  AUTH_ERROR: 'AUTH_ERROR',
  PAYMENT_ERROR: 'PAYMENT_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE'
};

// Enum cho các service
export const SERVICES = {
  VIETNAM_ADDRESS: 'VIETNAM_ADDRESS',
  MAPBOX: 'MAPBOX',
  PAYMENT: 'PAYMENT',
  ORDER: 'ORDER',
  AUTH: 'AUTH',
  BOOKING: 'BOOKING'
};

/**
 * Tạo error object chuẩn
 */
export const createError = (type, service, message, details = null) => {
  return {
    success: false,
    error: {
      type,
      service,
      message,
      details,
      timestamp: new Date().toISOString()
    }
  };
};

/**
 * Hiển thị thông báo lỗi cho user
 */
export const showUserError = (error, customMessage = null) => {
  const userMessage = customMessage || getUserFriendlyMessage(error);

  // Log chi tiết lỗi cho debugging
  console.error('🚨 Lỗi hệ thống:', error);

  // Dispatch custom event để UI components có thể lắng nghe
  const errorEvent = new CustomEvent('userError', {
    detail: {
      message: userMessage,
      error: error,
      timestamp: new Date().toISOString()
    }
  });
  window.dispatchEvent(errorEvent);

  return userMessage;
};

/**
 * Hiển thị thông báo thành công cho user
 */
export const showUserSuccess = (message, title = null) => {
  // Log thông báo thành công
  console.log('✅ Thành công:', message);

  // Dispatch custom event để UI components có thể lắng nghe
  const successEvent = new CustomEvent('userSuccess', {
    detail: {
      message: message,
      title: title,
      timestamp: new Date().toISOString()
    }
  });
  window.dispatchEvent(successEvent);

  return message;
};

/**
 * Chuyển đổi lỗi kỹ thuật thành thông báo thân thiện
 */
export const getUserFriendlyMessage = (error) => {
  if (!error || !error.error) {
    return 'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.';
  }

  const { type, service, message } = error.error;

  // Nếu có message cụ thể từ backend, ưu tiên hiển thị message đó
  if (message && typeof message === 'string' && message.trim()) {
    // Kiểm tra nếu message đã là user-friendly
    if (isUserFriendlyMessage(message)) {
      return message;
    }
  }

  switch (type) {
    case ERROR_TYPES.NETWORK_ERROR:
      return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.';

    case ERROR_TYPES.API_ERROR:
      switch (service) {
        case SERVICES.VIETNAM_ADDRESS:
          return 'Dịch vụ tìm kiếm địa chỉ tạm thời không khả dụng. Vui lòng nhập địa chỉ thủ công.';
        case SERVICES.MAPBOX:
          return 'Dịch vụ bản đồ tạm thời không khả dụng. Vui lòng thử lại sau.';
        case SERVICES.PAYMENT:
          return message || 'Dịch vụ thanh toán tạm thời không khả dụng. Vui lòng thử lại sau hoặc chọn thanh toán khi hoàn thành.';
        case SERVICES.ORDER:
          return message || 'Không thể xử lý đơn hàng. Vui lòng thử lại sau.';
        default:
          return message || 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.';
      }

    case ERROR_TYPES.VALIDATION_ERROR:
      return message || 'Thông tin không hợp lệ. Vui lòng kiểm tra lại.';

    case ERROR_TYPES.AUTH_ERROR:
      return message || 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';

    case ERROR_TYPES.PAYMENT_ERROR:
      return message || 'Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.';

    case ERROR_TYPES.SERVICE_UNAVAILABLE:
      return message || 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.';

    default:
      return message || 'Đã xảy ra lỗi không xác định. Vui lòng thử lại sau.';
  }
};

/**
 * Kiểm tra xem message có phải là user-friendly không
 */
const isUserFriendlyMessage = (message) => {
  const technicalKeywords = [
    'error', 'exception', 'null', 'undefined', 'failed', 'timeout',
    'connection', 'server', 'database', 'firebase', 'api', 'http',
    'status', 'code', 'stack', 'trace'
  ];

  const lowerMessage = message.toLowerCase();
  return !technicalKeywords.some(keyword => lowerMessage.includes(keyword));
};

/**
 * Mock API call - thay thế localhost calls
 */
export const mockApiCall = async (service, endpoint, options = {}) => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Simulate different error scenarios
  const errorScenarios = {
    [SERVICES.VIETNAM_ADDRESS]: {
      probability: 0.1, // 10% chance of error
      error: createError(
        ERROR_TYPES.SERVICE_UNAVAILABLE,
        SERVICES.VIETNAM_ADDRESS,
        'Vietnam Address API không khả dụng'
      )
    },
    [SERVICES.MAPBOX]: {
      probability: 0.05, // 5% chance of error
      error: createError(
        ERROR_TYPES.API_ERROR,
        SERVICES.MAPBOX,
        'Mapbox API không khả dụng'
      )
    },
    [SERVICES.PAYMENT]: {
      probability: 0.15, // 15% chance of error
      error: createError(
        ERROR_TYPES.PAYMENT_ERROR,
        SERVICES.PAYMENT,
        'Dịch vụ thanh toán không khả dụng'
      )
    }
  };

  const scenario = errorScenarios[service];
  if (scenario && Math.random() < scenario.probability) {
    throw scenario.error;
  }

  // Return mock success response
  return {
    success: true,
    data: getMockData(service, endpoint),
    message: 'Thành công'
  };
};

/**
 * Tạo dữ liệu mock cho các service
 */
const getMockData = (service, endpoint) => {
  switch (service) {
    case SERVICES.VIETNAM_ADDRESS:
      return {
        addresses: [
          {
            id: 'mock_1',
            name: 'Quận 1',
            fullName: 'Quận 1, Thành phố Hồ Chí Minh',
            type: 'district',
            province: { name: 'TP. Hồ Chí Minh' }
          }
        ],
        total: 1
      };
    
    case SERVICES.PAYMENT:
      return {
        paymentUrl: '#mock-payment-url',
        vnpayOrderId: 'MOCK_' + Date.now(),
        orderDbId: 'mock_order_id'
      };
    
    default:
      return {};
  }
};

/**
 * Wrapper cho fetch với error handling
 */
export const safeFetch = async (url, options = {}) => {
  try {
    // Kiểm tra nếu là localhost call
    if (url.includes('localhost') || url.includes('127.0.0.1')) {
      console.warn('🚨 Localhost call detected, returning error:', url);
      throw createError(
        ERROR_TYPES.SERVICE_UNAVAILABLE,
        SERVICES.API_ERROR,
        'Dịch vụ backend không khả dụng trong môi trường production'
      );
    }

    const response = await fetch(url, {
      timeout: 10000, // 10 second timeout
      ...options
    });

    if (!response.ok) {
      throw createError(
        ERROR_TYPES.API_ERROR,
        SERVICES.API_ERROR,
        `HTTP ${response.status}: ${response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error.success === false) {
      // Already a formatted error
      throw error;
    }
    
    // Network or other errors
    throw createError(
      ERROR_TYPES.NETWORK_ERROR,
      SERVICES.API_ERROR,
      error.message || 'Lỗi kết nối mạng'
    );
  }
};

/**
 * Log error cho debugging
 */
export const logError = (error, context = '') => {
  const logData = {
    timestamp: new Date().toISOString(),
    context,
    error: error.error || error,
    userAgent: navigator.userAgent,
    url: window.location.href
  };
  
  console.error('🚨 Error Log:', logData);
  
  // Có thể gửi lên error tracking service như Sentry
  // sendToErrorTracking(logData);
};

export default {
  ERROR_TYPES,
  SERVICES,
  createError,
  showUserError,
  getUserFriendlyMessage,
  mockApiCall,
  safeFetch,
  logError
};
