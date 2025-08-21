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
      const customerName = userDoc.exists ? userDoc.data().name : 'Không rõ';

      // Lấy thông tin đối tác (nếu có)
      let partnerName = 'Chưa gán';
      if (bookingData.partnerId) {
        const partnerDoc = await db.collection('mm_users').doc(bookingData.partnerId).get();
        if (partnerDoc.exists) {
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

module.exports = router;