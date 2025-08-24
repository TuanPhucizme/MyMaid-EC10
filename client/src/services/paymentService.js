/**
 * Payment Service
 * Xử lý thanh toán với error handling thay vì localhost calls
 */

import { createError, ERROR_TYPES, SERVICES, showUserError, logError } from './errorHandler';
import { createOrder, updatePaymentInfo, PAYMENT_METHODS } from './firebaseOrderService';

import config from '../config/default.json';

/**
 * Tạo URL thanh toán VNPay
 */
export const createVNPayPaymentUrl = async (orderData, userId) => {
  try {
    const orderResult = await createOrder(orderData, userId);
    
    if (!orderResult.success) {
      throw orderResult;
    }

    const { orderId } = orderResult;
    const amount = orderData.payment.amount;

const response = await fetch('http://localhost:5000/api/payment/create_payment_url', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            orderDbId: orderId, // Gửi ID đơn hàng thật
            amount: amount,
            language: 'vn',
        }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi tạo URL thanh toán từ server');
    }

    const result = await response.json();
    const { paymentUrl } = result;

    if (!paymentUrl) {
        throw new Error("Không nhận được URL thanh toán từ server.");
    }

    // Lưu orderId để xác thực khi VNPAY trả về
    localStorage.setItem('orderDbId', orderId);

    return {
      success: true,
      paymentUrl: paymentUrl, // URL này đã có đầy đủ chữ ký từ backend
      orderDbId: orderId,
      message: 'Tạo URL thanh toán thành công'
    };

  } catch (error) {
    logError(error, 'createVNPayPaymentUrl');
    throw createError(
      ERROR_TYPES.PAYMENT_ERROR,
      SERVICES.PAYMENT,
      'Không thể tạo URL thanh toán: ' + error.message
    );
  }
};

/**
 * Xử lý kết quả thanh toán từ VNPay
 */
export const processVNPayReturn = async (params) => {
  try {
    const {
      vnp_ResponseCode,
      vnp_TransactionNo,
      vnp_Amount,
      vnp_PayDate,
      vnp_TxnRef
    } = params;

    // Kiểm tra mã phản hồi
    const isSuccess = vnp_ResponseCode === '00';
    
    if (!isSuccess) {
      const errorMessage = getVNPayErrorMessage(vnp_ResponseCode);
      throw createError(
        ERROR_TYPES.PAYMENT_ERROR,
        SERVICES.PAYMENT,
        errorMessage
      );
    }

    // Lấy order ID từ localStorage
    const orderId = localStorage.getItem('orderDbId');
    if (!orderId) {
      throw createError(
        ERROR_TYPES.VALIDATION_ERROR,
        SERVICES.PAYMENT,
        'Không tìm thấy thông tin đơn hàng'
      );
    }

    // Cập nhật thông tin thanh toán trong Firebase
    const paymentData = {
      vnpayTransactionId: vnp_TransactionNo,
      vnpayResponseCode: vnp_ResponseCode,
      vnpayPayDate: vnp_PayDate,
      amount: parseInt(vnp_Amount) / 100
    };

    await updatePaymentInfo(orderId, paymentData);

    // Cleanup localStorage
    localStorage.removeItem('orderDbId');
    localStorage.removeItem('vnpayOrderId');
    localStorage.removeItem('bookingDetails');

    return {
      success: true,
      orderId,
      paymentData,
      message: 'Thanh toán thành công'
    };

  } catch (error) {
    logError(error, 'processVNPayReturn');
    
    if (error.success === false) {
      throw error;
    }
    
    throw createError(
      ERROR_TYPES.PAYMENT_ERROR,
      SERVICES.PAYMENT,
      'Lỗi xử lý kết quả thanh toán: ' + error.message
    );
  }
};

/**
 * Chuyển đổi mã lỗi VNPay thành thông báo
 */
const getVNPayErrorMessage = (responseCode) => {
  const errorMessages = {
    '01': 'Giao dịch chưa hoàn tất',
    '02': 'Giao dịch bị lỗi',
    '04': 'Giao dịch đảo (Khách hàng đã bị trừ tiền tại Ngân hàng nhưng GD chưa thành công ở VNPAY)',
    '05': 'VNPAY đang xử lý giao dịch này (GD hoàn tiền)',
    '06': 'VNPAY đã gửi yêu cầu hoàn tiền sang Ngân hàng (GD hoàn tiền)',
    '07': 'Giao dịch bị nghi ngờ gian lận',
    '09': 'GD Hoàn trả bị từ chối',
    '10': 'Đã giao hàng',
    '11': 'Giao dịch không thành công do: Khách hàng nhập sai mật khẩu xác thực giao dịch (OTP)',
    '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa',
    '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP)',
    '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
    '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch',
    '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày',
    '75': 'Ngân hàng thanh toán đang bảo trì',
    '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định',
    '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
  };

  return errorMessages[responseCode] || 'Giao dịch không thành công';
};

/**
 * Xử lý thanh toán khi hoàn thành (cash)
 */
export const processCashPayment = async (orderData, userId) => {
  try {
    // Tạo đơn hàng với phương thức thanh toán cash
    const cashOrderData = {
      ...orderData,
      payment: {
        ...orderData.payment,
        method: PAYMENT_METHODS.CASH
      }
    };

    const orderResult = await createOrder(cashOrderData, userId);
    
    if (!orderResult.success) {
      throw orderResult;
    }

    // Cleanup localStorage
    localStorage.removeItem('bookingDetails');

    return {
      success: true,
      orderId: orderResult.orderId,
      order: orderResult.order,
      message: 'Đặt dịch vụ thành công. Bạn sẽ thanh toán khi hoàn thành.'
    };

  } catch (error) {
    logError(error, 'processCashPayment');
    
    if (error.success === false) {
      throw error;
    }
    
    throw createError(
      ERROR_TYPES.PAYMENT_ERROR,
      SERVICES.PAYMENT,
      'Không thể xử lý đặt dịch vụ: ' + error.message
    );
  }
};

/**
 * Validate payment data
 */
export const validatePaymentData = (orderData) => {
  const errors = [];

  // Log dữ liệu để debug
  console.log('🔍 Validating payment data:', orderData);

  if (!orderData.payment?.amount || orderData.payment.amount <= 0) {
    errors.push('Số tiền thanh toán không hợp lệ');
  }

  if (!orderData.service?.id) {
    errors.push('Thông tin dịch vụ không hợp lệ');
  }

  // Kiểm tra thông tin liên hệ chi tiết hơn
  if (!orderData.contact) {
    errors.push('Thiếu thông tin liên hệ');
  } else {
    if (!orderData.contact.name || orderData.contact.name.trim() === '') {
      errors.push('Họ và tên là bắt buộc');
    }
    if (!orderData.contact.phone || orderData.contact.phone.trim() === '') {
      errors.push('Số điện thoại là bắt buộc');
    }
    if (!orderData.contact.address || orderData.contact.address.trim() === '') {
      errors.push('Địa chỉ là bắt buộc');
    }
  }

  if (!orderData.schedule?.date || !orderData.schedule?.time) {
    errors.push('Thông tin lịch hẹn không đầy đủ');
  }

  if (errors.length > 0) {
    const detailedMessage = errors.join(', ');
    console.error('❌ Validation errors:', errors);

    throw createError(
      ERROR_TYPES.VALIDATION_ERROR,
      SERVICES.PAYMENT,
      detailedMessage
    );
  }

  console.log('✅ Payment data validation passed');
  return true;
};

/**
 * Get payment methods available
 */
export const getAvailablePaymentMethods = () => {
  return [
    {
      id: PAYMENT_METHODS.CASH,
      name: 'Thanh toán khi hoàn thành',
      description: 'Thanh toán bằng tiền mặt sau khi hoàn thành dịch vụ',
      icon: '💵',
      available: true
    },
    {
      id: PAYMENT_METHODS.VNPAY,
      name: 'VNPay',
      description: 'Thanh toán online qua VNPay (ATM, Visa, MasterCard)',
      icon: '💳',
      available: true
    }
  ];
};

export default {
  createVNPayPaymentUrl,
  processVNPayReturn,
  processCashPayment,
  validatePaymentData,
  getAvailablePaymentMethods,
  PAYMENT_METHODS
};
