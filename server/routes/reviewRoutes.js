// server/routes/reviewRoutes.js

const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const authMiddleware = require('../middleware/authMiddleware');
const { FieldValue } = require('firebase-admin/firestore');

/**
 * @route   POST /api/reviews
 * @desc    Khách hàng tạo một review mới cho một đơn hàng đã hoàn thành
 * @access  Private
 */
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { uid: userId } = req.user;
    const { bookingId, partnerId, rating, comment } = req.body;

    // 1. Validation cơ bản
    if (!bookingId || !partnerId || !rating) {
      return res.status(400).send({ message: 'Thiếu thông tin bắt buộc.' });
    }
    if (rating < 1 || rating > 5) {
      return res.status(400).send({ message: 'Điểm đánh giá phải từ 1 đến 5.' });
    }

    const bookingDocRef = db.collection('bookings').doc(bookingId);
    const partnerDocRef = db.collection('mm_partners').doc(partnerId);
    const reviewQuery = db.collection('mm_reviews').where('bookingId', '==', bookingId);

    // 2. SỬ DỤNG TRANSACTION ĐỂ ĐẢM BẢO AN TOÀN
    await db.runTransaction(async (transaction) => {
      const bookingDoc = await transaction.get(bookingDocRef);
      const partnerDoc = await transaction.get(partnerDocRef);
      const reviewSnapshot = await transaction.get(reviewQuery);

      // 3. KIỂM TRA CÁC ĐIỀU KIỆN
      if (!bookingDoc.exists) throw new Error('Đơn hàng không tồn tại.');
      if (!partnerDoc.exists) throw new Error('Đối tác không tồn tại.');
      if (!reviewSnapshot.empty) throw new Error('Đơn hàng này đã được đánh giá.');

      const bookingData = bookingDoc.data();
      if (bookingData.userId !== userId) throw new Error('Bạn không có quyền đánh giá đơn hàng này.');
      if (bookingData.status !== 'completed') throw new Error('Chỉ có thể đánh giá các đơn hàng đã hoàn thành.');

      // 4. TẠO REVIEW MỚI
      const newReviewRef = db.collection('mm_reviews').doc(); // Tạo ref cho review mới
      transaction.set(newReviewRef, {
        bookingId,
        userId,
        partnerId,
        rating,
        comment: comment || "",
        createdAt: new Date(),
      });

      // 5. CẬP NHẬT ĐIỂM TRUNG BÌNH CHO PARTNER (Denormalization)
      const partnerData = partnerDoc.data();
      const oldRatingCount = partnerData.operational.rating.count || 0;
      const oldRatingAverage = partnerData.operational.rating.average || 0;
      
      const newRatingCount = oldRatingCount + 1;
      const newRatingAverage = ((oldRatingAverage * oldRatingCount) + rating) / newRatingCount;

      transaction.update(partnerDocRef, {
        'operational.rating.count': newRatingCount,
        'operational.rating.average': parseFloat(newRatingAverage.toFixed(2)), // Làm tròn đến 2 chữ số
      });
    });

    res.status(201).send({ message: 'Cảm ơn bạn đã gửi đánh giá!' });

  } catch (error) {
    console.error(`Lỗi khi user ${req.user?.uid} tạo review:`, error);
    res.status(400).send({ message: error.message }); // Gửi lỗi validation về cho client
  }
});

module.exports = router;