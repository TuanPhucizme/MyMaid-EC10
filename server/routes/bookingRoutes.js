// server/routes/bookingRoutes.js

const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

/**
 * @route   GET /api/bookings
 * @desc    Lấy danh sách tất cả các đơn hàng trong hệ thống với pagination và filtering
 * @access  Private (Admin only)
 */
router.get('/', [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const { limit = 50, page = 1, status, partnerId, userId, startDate, endDate } = req.query;

    let query = db.collection('orders');

    // Filter by status if provided
    if (status) {
      query = query.where('status', '==', status);
    }

    // Filter by partnerId if provided
    if (partnerId) {
      query = query.where('partnerId', '==', partnerId);
    }

    // Filter by userId if provided
    if (userId) {
      query = query.where('userId', '==', userId);
    }

    // Filter by date range if provided
    if (startDate) {
      query = query.where('createdAt', '>=', new Date(startDate));
    }
    if (endDate) {
      query = query.where('createdAt', '<=', new Date(endDate));
    }

    // Order by creation date
    query = query.orderBy('createdAt', 'desc');

    // Apply pagination
    const offset = (parseInt(page) - 1) * parseInt(limit);
    query = query.limit(parseInt(limit)).offset(offset);

    const snapshot = await query.get();

    if (snapshot.empty) {
      return res.status(200).json({
        orders: [],
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: 0,
          totalPages: 0
        }
      });
    }

    // Dùng Promise.all để lấy thông tin user và partner hiệu quả
    const bookingsPromises = snapshot.docs.map(async (doc) => {
      const bookingData = doc.data();

      // Lấy thông tin khách hàng
      const userDoc = await db.collection('mm_users').doc(bookingData.userId).get();
      const customerName = userDoc.exists ? userDoc.data().name : 'Không rõ';
      const customerEmail = userDoc.exists ? userDoc.data().email : '';
      const customerPhone = userDoc.exists ? userDoc.data().phone : '';

      // Lấy thông tin đối tác (nếu có)
      let partnerName = 'Chưa gán';
      let partnerEmail = '';
      let partnerPhone = '';
      if (bookingData.partnerId) {
        const partnerDoc = await db.collection('mm_users').doc(bookingData.partnerId).get();
        if (partnerDoc.exists) {
          const partnerData = partnerDoc.data();
          partnerName = partnerData.name;
          partnerEmail = partnerData.email || '';
          partnerPhone = partnerData.phone || '';
        }
      }

      return {
        id: doc.id,
        ...bookingData,
        // Convert Firestore timestamps to JavaScript Date objects
        createdAt: bookingData.createdAt?.toDate ? bookingData.createdAt.toDate() : bookingData.createdAt,
        updatedAt: bookingData.updatedAt?.toDate ? bookingData.updatedAt.toDate() : bookingData.updatedAt,
        customerInfo: {
          name: customerName,
          email: customerEmail,
          phone: customerPhone
        },
        partnerInfo: {
          name: partnerName,
          email: partnerEmail,
          phone: partnerPhone
        }
      };
    });

    const ordersList = await Promise.all(bookingsPromises);

    // Get total count for pagination
    let totalQuery = db.collection('orders');
    if (status) totalQuery = totalQuery.where('status', '==', status);
    if (partnerId) totalQuery = totalQuery.where('partnerId', '==', partnerId);
    if (userId) totalQuery = totalQuery.where('userId', '==', userId);
    if (startDate) totalQuery = totalQuery.where('createdAt', '>=', new Date(startDate));
    if (endDate) totalQuery = totalQuery.where('createdAt', '<=', new Date(endDate));

    const totalSnapshot = await totalQuery.get();
    const total = totalSnapshot.size;

    res.status(200).json({
      orders: ordersList,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    });

  } catch (error) {
    console.error('Error fetching all bookings:', error);
    next(error);
  }
});

/**
 * @route   POST /api/bookings
 * @desc    Tạo booking mới với dữ liệu service mở rộng
 * @access  Private
 */
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { uid: userId } = req.user;
    const {
      serviceType,
      serviceData,
      date,
      time,
      address,
      addressCoordinates,
      addressComponents,
      formattedAddress,
      phone,
      name,
      email,
      notes,
      frequency
    } = req.body;

    // Validate required fields
    if (!serviceType || !date || !time || !address || !phone || !name || !email) {
      return res.status(400).json({
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    // Tạo booking data
    const bookingData = {
      userId,
      serviceType,
      serviceData: serviceData || {},
      schedule: {
        date,
        time,
        frequency: frequency || 'one-time'
      },
      address: {
        formatted: formattedAddress || address,
        coordinates: addressCoordinates,
        components: addressComponents,
        raw: address
      },
      customer: {
        name,
        phone,
        email
      },
      notes: notes || '',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Lưu vào database
    const docRef = await db.collection('orders').add(bookingData);

    res.status(201).json({
      success: true,
      orderId: docRef.id,
      message: 'Đặt dịch vụ thành công'
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    next(error);
  }
});

module.exports = router;