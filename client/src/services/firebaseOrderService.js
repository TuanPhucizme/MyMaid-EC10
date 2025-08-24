/**
 * Firebase Order Service
 * Xử lý tất cả operations liên quan đến orders trong Firebase
 */

import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  arrayUnion 
} from 'firebase/firestore';
import { createError, ERROR_TYPES, SERVICES, logError } from './errorHandler';

// Collection names
const COLLECTIONS = {
  ORDERS: 'orders',
  USERS: 'mm_users',
  SERVICES: 'services'
};

// Order status enum
export const ORDER_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  PENDING_CONFIRMATION: 'pending_confirmation', 
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Payment methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  VNPAY: 'vnpay',
  MOMO: 'momo'
};

/**
 * Tạo đơn hàng mới
 */
export const createOrder = async (orderData, userId) => {
  try {
    if (!userId) {
      throw createError(
        ERROR_TYPES.AUTH_ERROR,
        SERVICES.ORDER,
        'Người dùng chưa đăng nhập'
      );
    }

    // Validate required fields
    const requiredFields = ['service', 'schedule', 'contact', 'payment'];
    for (const field of requiredFields) {
      if (!orderData[field]) {
        throw createError(
          ERROR_TYPES.VALIDATION_ERROR,
          SERVICES.ORDER,
          `Thiếu thông tin bắt buộc: ${field}`
        );
      }
    }

    // Tạo order object
    const order = {
      userId,
      partnerId: null,
      service: {
        id: orderData.service.id,
        name: orderData.service.name,
        icon: orderData.service.icon || '',
        category: orderData.service.category || 'cleaning'
      },
      schedule: {
        date: orderData.schedule.date,
        time: orderData.schedule.time,
        duration: orderData.schedule.duration || 2,
        frequency: orderData.schedule.frequency || 'one-time'
      },
      contact: {
        name: orderData.contact.name,
        phone: orderData.contact.phone,
        email: orderData.contact.email,
        address: orderData.contact.address,
        addressCoordinates: orderData.contact.addressCoordinates || null,
        addressComponents: orderData.contact.addressComponents || null,
        notes: orderData.contact.notes || ''
      },
      payment: {
        amount: orderData.payment.amount,
        method: orderData.payment.method || PAYMENT_METHODS.CASH,
        currency: 'VND',
        vnpayOrderId: orderData.payment.vnpayOrderId || null,
        status: 'pending'
      },
      status: ORDER_STATUS.PENDING_PAYMENT,
      statusHistory: [{
        status: ORDER_STATUS.PENDING_PAYMENT,
        timestamp: new Date(),
        note: 'Đơn hàng được tạo'
      }],
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };

    // Lưu vào Firestore
    console.log('📝 Creating order in Firestore...', order);
    const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), order);

    console.log('✅ Order created successfully with ID:', docRef.id);

    return {
      success: true,
      orderId: docRef.id,
      order: { id: docRef.id, ...order }
    };

  } catch (error) {
    logError(error, 'createOrder');
    
    if (error.success === false) {
      throw error;
    }
    
    throw createError(
      ERROR_TYPES.API_ERROR,
      SERVICES.ORDER,
      'Không thể tạo đơn hàng: ' + error.message
    );
  }
};

/**
 * Cập nhật trạng thái đơn hàng
 */
export const updateOrderStatus = async (orderId, newStatus, note = '', additionalData = {}) => {
  try {
    if (!orderId) {
      throw createError(
        ERROR_TYPES.VALIDATION_ERROR,
        SERVICES.ORDER,
        'ID đơn hàng không hợp lệ'
      );
    }

    const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (!orderDoc.exists()) {
      throw createError(
        ERROR_TYPES.VALIDATION_ERROR,
        SERVICES.ORDER,
        'Không tìm thấy đơn hàng'
      );
    }

    const currentOrder = orderDoc.data();
    
    // Tạo status history entry
    const statusHistoryEntry = {
      status: newStatus,
      timestamp: new Date(),
      note: note || `Cập nhật trạng thái: ${newStatus}`
    };

    // Prepare update data
    const updateData = {
      status: newStatus,
      statusHistory: arrayUnion(statusHistoryEntry),
      updatedAt: serverTimestamp(),
      ...additionalData
    };

    // Cập nhật document
    await updateDoc(orderRef, updateData);
    
    return {
      success: true,
      orderId,
      newStatus,
      message: 'Cập nhật trạng thái thành công'
    };

  } catch (error) {
    logError(error, 'updateOrderStatus');
    
    if (error.success === false) {
      throw error;
    }
    
    throw createError(
      ERROR_TYPES.API_ERROR,
      SERVICES.ORDER,
      'Không thể cập nhật trạng thái đơn hàng: ' + error.message
    );
  }
};

/**
 * Cập nhật thông tin thanh toán
 */
export const updatePaymentInfo = async (orderId, paymentData) => {
  try {
    const additionalData = {
      'payment.status': 'completed',
      'payment.paidAt': serverTimestamp(),
      'payment.vnpayTransactionId': paymentData.vnpayTransactionId,
      'payment.vnpayResponseCode': paymentData.vnpayResponseCode,
      'payment.vnpayBankCode': paymentData.vnpayBankCode,
      'payment.vnpayPayDate': paymentData.vnpayPayDate
    };

    return await updateOrderStatus(
      orderId, 
      ORDER_STATUS.PENDING_CONFIRMATION,
      'Thanh toán thành công, chờ xác nhận',
      additionalData
    );

  } catch (error) {
    logError(error, 'updatePaymentInfo');
    throw error;
  }
};

/**
 * Lấy đơn hàng theo ID
 */
export const getOrderById = async (orderId) => {
  try {
    const orderRef = doc(db, COLLECTIONS.ORDERS, orderId);
    const orderDoc = await getDoc(orderRef);
    
    if (!orderDoc.exists()) {
      throw createError(
        ERROR_TYPES.VALIDATION_ERROR,
        SERVICES.ORDER,
        'Không tìm thấy đơn hàng'
      );
    }

    return {
      success: true,
      order: { id: orderDoc.id, ...orderDoc.data() }
    };

  } catch (error) {
    logError(error, 'getOrderById');
    
    if (error.success === false) {
      throw error;
    }
    
    throw createError(
      ERROR_TYPES.API_ERROR,
      SERVICES.ORDER,
      'Không thể lấy thông tin đơn hàng: ' + error.message
    );
  }
};

/**
 * Lấy danh sách đơn hàng của user
 */
export const getUserOrders = async (userId, limit = 20) => {
  try {
    if (!userId) {
      throw createError(
        ERROR_TYPES.AUTH_ERROR,
        SERVICES.ORDER,
        'Người dùng chưa đăng nhập'
      );
    }

    const ordersQuery = query(
      collection(db, COLLECTIONS.ORDERS),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(ordersQuery);
    const orders = [];
    
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() });
    });

    return {
      success: true,
      orders,
      total: orders.length
    };

  } catch (error) {
    logError(error, 'getUserOrders');
    
    if (error.success === false) {
      throw error;
    }
    
    throw createError(
      ERROR_TYPES.API_ERROR,
      SERVICES.ORDER,
      'Không thể lấy danh sách đơn hàng: ' + error.message
    );
  }
};

/**
 * Hủy đơn hàng
 */
export const cancelOrder = async (orderId, reason = '') => {
  try {
    return await updateOrderStatus(
      orderId,
      ORDER_STATUS.CANCELLED,
      reason || 'Đơn hàng bị hủy',
      { cancelledAt: serverTimestamp(), cancelReason: reason }
    );

  } catch (error) {
    logError(error, 'cancelOrder');
    throw error;
  }
};

export default {
  createOrder,
  updateOrderStatus,
  updatePaymentInfo,
  getOrderById,
  getUserOrders,
  cancelOrder,
  ORDER_STATUS,
  PAYMENT_METHODS
};
