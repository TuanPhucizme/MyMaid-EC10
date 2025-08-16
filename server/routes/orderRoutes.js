const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @route   POST /api/orders
 * @desc    Tạo đơn hàng mới
 * @access  Private
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { 
      service, 
      schedule, 
      contact, 
      summary, 
      paymentMethod = 'vnpay',
      vnpayOrderId 
    } = req.body;

    const userId = req.user.uid;
    
    // Validate required fields
    if (!service || !schedule || !contact || !summary) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    // Tạo order object
    const orderData = {
      userId,
      partnerId: null,
      service: {
        id: service.id,
        name: service.name,
        icon: service.icon || ''
      },
      schedule: {
        date: schedule.date,
        time: schedule.time,
        duration: schedule.duration || 2,
        frequency: schedule.frequency || 'one-time'
      },
      contact: {
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        address: contact.address,
        notes: contact.notes || ''
      },
      payment: {
        amount: summary.totalPrice,
        method: paymentMethod,
        vnpayOrderId: vnpayOrderId || null,
        currency: 'VND'
      },
      status: 'pending_payment', // pending_payment, pending_confirmation, confirmed, in_progress, completed, cancelled
      statusHistory: [{
        status: 'pending_payment',
        timestamp: new Date(),
        note: 'Đơn hàng được tạo, chờ thanh toán'
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Thêm vào Firestore
    const orderRef = await db.collection('orders').add(orderData);
    
    res.status(201).json({
      success: true,
      message: 'Tạo đơn hàng thành công',
      orderId: orderRef.id,
      order: { id: orderRef.id, ...orderData }
    });

  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi tạo đơn hàng',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/orders/available
 * @desc    Lấy danh sách các đơn hàng đang chờ đối tác nhận
 * @access  Private (Partner only)
 */
router.get('/available', authMiddleware, async (req, res, next) => {
  try {
    const ordersRef = db.collection('orders');
    // Lấy các đơn hàng chưa có partnerId và đang chờ xác nhận
    const q = ordersRef
      .where('status', '==', 'pending_confirmation')
      .orderBy('createdAt', 'desc');
    const snapshot = await q.get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const availableOrders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(availableOrders);

  } catch (error) {
    console.error('Lỗi khi lấy đơn hàng có sẵn:', error);
    next(error);
  }
});

/**
 * @route   PUT /api/orders/:orderId/accept
 * @desc    Đối tác chấp nhận một đơn hàng
 * @access  Private (Partner only)
 */
router.put('/:orderId/accept', authMiddleware, async (req, res, next) => {
  const { uid: partnerId } = req.user;
  const { orderId } = req.params;
  const orderDocRef = db.collection('orders').doc(orderId);
  const partnerDocRef = db.collection('partners').doc(partnerId);

  try {
    // ✅ SỬ DỤNG TRANSACTION ĐỂ ĐẢM BẢO AN TOÀN DỮ LIỆU
    // Giúp ngăn chặn 2 đối tác cùng nhận 1 đơn hàng
    await db.runTransaction(async (transaction) => {
      const orderDoc = await transaction.get(orderDocRef);
      const partnerDoc = await transaction.get(partnerDocRef);
      if (!orderDoc.exists) {
        throw new Error('Đơn hàng không tồn tại.');
      }

      const orderData = orderDoc.data();
      // Kiểm tra lại trạng thái để chắc chắn đơn hàng vẫn còn khả dụng
      if (orderData.status !== 'pending_confirmation') {
        throw new Error('Đơn hàng này đã được nhận hoặc đã bị hủy.');
      }
      const currentStatusHistory = orderData.statusHistory || [];

      const newHistoryEntry = {
        status: 'confirmed',
        note: `Được nhận bởi đối tác (ID: ${partnerId})`,
        timestamp: new Date() // Sử dụng new Date() thay vì serverTimestamp()
      };
      const updatedStatusHistory = [...currentStatusHistory, newHistoryEntry];

      // Cập nhật đơn hàng
      transaction.update(orderDocRef, {
        partnerId: partnerId, // Gán ID của đối tác
        status: 'confirmed',  // Chuyển trạng thái
        updatedAt: new Date(),
        statusHistory: updatedStatusHistory
      });
      transaction.update(partnerDocRef, {
        'operational.activeJobs': FieldValue.increment(1)
      });
    });

    res.status(200).send({ message: 'Nhận đơn thành công!' });

  } catch (error) {
    console.error(`Lỗi khi partner ${partnerId} nhận đơn ${orderId}:`, error);
    // Trả về lỗi 409 (Conflict) nếu đơn đã được nhận
    if (error.message.includes('đã được nhận')) {
      return res.status(409).send({ message: error.message });
    }
    next(error);
  }
});

/**
 * @route   GET /api/orders
 * @desc    Lấy danh sách đơn hàng của user
 * @access  Private
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.uid;
    const { status, limit = 20, page = 1 } = req.query;

    let query = db.collection('orders')
      .where('userId', '==', userId)
      .orderBy('createdAt', 'desc');

    // Filter by status if provided
    if (status && status !== 'all') {
      query = query.where('status', '==', status);
    }

    // Pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    if (offset > 0) {
      query = query.offset(offset);
    }
    query = query.limit(parseInt(limit));

    const snapshot = await query.get();
    
    const orders = [];
    snapshot.forEach(doc => {
      orders.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      orders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: orders.length
      }
    });

  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy danh sách đơn hàng',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/orders/:orderId
 * @desc    Lấy chi tiết đơn hàng
 * @access  Private
 */
router.get('/:orderId', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const userId = req.user.uid;

    const doc = await db.collection('orders').doc(orderId).get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    const orderData = doc.data();
    
    // Check if user owns this order
    if (orderData.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập đơn hàng này'
      });
    }

    res.json({
      success: true,
      order: {
        id: doc.id,
        ...orderData
      }
    });

  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy chi tiết đơn hàng',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/orders/:orderId/status
 * @desc    Cập nhật trạng thái đơn hàng
 * @access  Private
 */
router.put('/:orderId/status', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status, note = '' } = req.body;
    const userId = req.user.uid;

    // Validate status
    const validStatuses = [
      'pending_payment', 
      'pending_confirmation', 
      'confirmed', 
      'in_progress', 
      'completed', 
      'cancelled'
    ];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Trạng thái không hợp lệ'
      });
    }

    const orderRef = db.collection('orders').doc(orderId);
    const doc = await orderRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    const orderData = doc.data();
    
    // Check if user owns this order
    if (orderData.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền cập nhật đơn hàng này'
      });
    }

    // Validate status transition
    const currentStatus = orderData.status;
    if (!isValidStatusTransition(currentStatus, status)) {
      return res.status(400).json({
        success: false,
        message: `Không thể chuyển từ trạng thái "${currentStatus}" sang "${status}"`
      });
    }

    // Update order
    const statusHistoryEntry = {
      status,
      timestamp: new Date(),
      note: note || getDefaultStatusNote(status)
    };

    await orderRef.update({
      status,
      statusHistory: [...(orderData.statusHistory || []), statusHistoryEntry],
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Cập nhật trạng thái thành công',
      newStatus: status
    });

  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật trạng thái',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/orders/:orderId/cancel
 * @desc    Hủy đơn hàng (chỉ cho phép ở trạng thái pending_confirmation)
 * @access  Private
 */
router.put('/:orderId/cancel', authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { reason = 'Khách hàng hủy đơn' } = req.body;
    const userId = req.user.uid;

    const orderRef = db.collection('orders').doc(orderId);
    const doc = await orderRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    const orderData = doc.data();
    
    // Check if user owns this order
    if (orderData.userId !== userId) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền hủy đơn hàng này'
      });
    }

    // Check if order can be cancelled
    if (!canCancelOrder(orderData.status)) {
      return res.status(400).json({
        success: false,
        message: `Không thể hủy đơn hàng ở trạng thái "${orderData.status}". Chỉ có thể hủy đơn hàng ở trạng thái "pending_confirmation".`
      });
    }

    // Cancel order
    const statusHistoryEntry = {
      status: 'cancelled',
      timestamp: new Date(),
      note: reason
    };

    await orderRef.update({
      status: 'cancelled',
      statusHistory: [...(orderData.statusHistory || []), statusHistoryEntry],
      updatedAt: new Date(),
      cancelledAt: new Date(),
      cancellationReason: reason
    });

    res.json({
      success: true,
      message: 'Hủy đơn hàng thành công'
    });

  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi hủy đơn hàng',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/orders/:orderId/payment-success
 * @desc    Cập nhật đơn hàng sau khi thanh toán thành công
 * @access  Public (được gọi từ VNPay callback)
 */
router.put('/:orderId/payment-success', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { 
      vnpayTransactionId, 
      vnpayResponseCode, 
      vnpayAmount,
      vnpayBankCode,
      vnpayPayDate 
    } = req.body;

    const orderRef = db.collection('orders').doc(orderId);
    const doc = await orderRef.get();
    
    if (!doc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy đơn hàng'
      });
    }

    const orderData = doc.data();
    
    // Validate payment amount
    if (vnpayAmount && parseInt(vnpayAmount) !== orderData.payment.amount) {
      return res.status(400).json({
        success: false,
        message: 'Số tiền thanh toán không khớp'
      });
    }

    // Update order with payment info
    const statusHistoryEntry = {
      status: 'pending_confirmation',
      timestamp: new Date(),
      note: 'Thanh toán thành công, chờ xác nhận'
    };

    await orderRef.update({
      status: 'pending_confirmation',
      'payment.vnpayTransactionId': vnpayTransactionId,
      'payment.vnpayResponseCode': vnpayResponseCode,
      'payment.vnpayBankCode': vnpayBankCode,
      'payment.vnpayPayDate': vnpayPayDate,
      'payment.paidAt': new Date(),
      statusHistory: [...(orderData.statusHistory || []), statusHistoryEntry],
      updatedAt: new Date()
    });

    res.json({
      success: true,
      message: 'Cập nhật thanh toán thành công'
    });

  } catch (error) {
    console.error('Error updating payment success:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật thanh toán',
      error: error.message
    });
  }
});

// Helper functions
function isValidStatusTransition(currentStatus, newStatus) {
  const transitions = {
    'pending_payment': ['pending_confirmation', 'cancelled'],
    'pending_confirmation': ['confirmed', 'cancelled'],
    'confirmed': ['in_progress', 'cancelled'],
    'in_progress': ['completed'],
    'completed': [], // No transitions from completed
    'cancelled': [] // No transitions from cancelled
  };
  
  return transitions[currentStatus]?.includes(newStatus) || false;
}

function canCancelOrder(status) {
  return ['pending_confirmation'].includes(status);
}

function getDefaultStatusNote(status) {
  const notes = {
    'pending_payment': 'Chờ thanh toán',
    'pending_confirmation': 'Chờ xác nhận',
    'confirmed': 'Đã xác nhận, chờ nhân viên đến',
    'in_progress': 'Đang thực hiện dịch vụ',
    'completed': 'Hoàn thành dịch vụ',
    'cancelled': 'Đã hủy'
  };
  
  return notes[status] || '';
}

module.exports = router;
