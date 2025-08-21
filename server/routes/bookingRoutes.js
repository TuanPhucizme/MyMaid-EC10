// server/routes/bookingRoutes.js

const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

/**
 * @route   GET /api/bookings
 * @desc    Lấy danh sách tất cả các đơn hàng trong hệ thống
 * @access  Private (Admin only)
 */
router.get('/', [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const bookingsRef = db.collection('orders');
    const snapshot = await bookingsRef.orderBy('createdAt', 'desc').get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    // Dùng Promise.all để lấy thông tin user và partner hiệu quả
    const bookingsPromises = snapshot.docs.map(async (doc) => {
      const bookingData = doc.data();
      
      // Lấy thông tin khách hàng
      const userDoc = await db.collection('mm_users').doc(bookingData.userId).get();
      const customerName = userDoc.exists() ? userDoc.data().name : 'Không rõ';

      // Lấy thông tin đối tác (nếu có)
      let partnerName = 'Chưa gán';
      if (bookingData.partnerId) {
        const partnerDoc = await db.collection('mm_users').doc(bookingData.partnerId).get();
        if (partnerDoc.exists()) {
          partnerName = partnerDoc.data().name;
        }
      }

      return {
        id: doc.id,
        ...bookingData,
        customerName,
        partnerName,
      };
    });

    const bookingsList = await Promise.all(bookingsPromises);
    res.status(200).json(bookingsList);

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