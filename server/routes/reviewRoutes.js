// server/routes/reviewRoutes.js

const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const authMiddleware = require('../middleware/authMiddleware');
const { FieldValue } = require('firebase-admin/firestore');

// server/routes/reviewRoutes.js

/**
 * @route   POST /api/reviews
 * @desc    Khách hàng tạo một review mới
 */
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { uid: userId } = req.user;
    const { bookingId, partnerId, rating, comment } = req.body;

    if (!bookingId || !partnerId || !rating) {
      return res.status(400).send({ message: 'Thiếu thông tin bắt buộc.' });
    }

    const bookingDocRef = db.collection('orders').doc(bookingId);
    const partnerDocRef = db.collection('mm_partners').doc(partnerId);
    const reviewQuery = db.collection('mm_reviews').where('bookingId', '==', bookingId);

    const creationTimestamp = new Date();

    await db.runTransaction(async (transaction) => {
      const bookingDoc = await transaction.get(bookingDocRef);
      const partnerDoc = await transaction.get(partnerDocRef);
      const reviewSnapshot = await transaction.get(reviewQuery);

      if (!bookingDoc.exists) throw new Error('Đơn hàng không tồn tại.');
      if (!partnerDoc.exists) throw new Error('Đối tác không tồn tại.');
      if (!reviewSnapshot.empty) throw new Error('Đơn hàng này đã được đánh giá.');

      const bookingData = bookingDoc.data();
      if (bookingData.userId !== userId) throw new Error('Bạn không có quyền đánh giá đơn hàng này.');
      if (bookingData.status !== 'completed') throw new Error('Chỉ có thể đánh giá các đơn hàng đã hoàn thành.');

      const newReviewRef = db.collection('mm_reviews').doc();
      transaction.set(newReviewRef, {
        bookingId,
        userId,
        partnerId,
        rating,
        comment: comment || "",
        createdAt: creationTimestamp,
      });

      // Cập nhật điểm trung bình cho partner
      const partnerData = partnerDoc.data();
      const oldRatingCount = partnerData.operational.rating.count || 0;
      const oldRatingAverage = partnerData.operational.rating.average || 0;
      const newRatingCount = oldRatingCount + 1;
      const newRatingAverage = ((oldRatingAverage * oldRatingCount) + rating) / newRatingCount;

      transaction.update(partnerDocRef, {
        'operational.rating.count': newRatingCount,
        'operational.rating.average': parseFloat(newRatingAverage.toFixed(2)),
      });
    });

    res.status(201).send({ message: 'Cảm ơn bạn đã gửi đánh giá!' });

  } catch (error) {
    next(error);
  }
});

router.get('/by-booking/:bookingId', authMiddleware, async (req, res, next) => {
  try {
    const { bookingId } = req.params;
    const reviewQuery = db.collection('mm_reviews').where('bookingId', '==', bookingId).limit(1);
    const snapshot = await reviewQuery.get();

    if (snapshot.empty) {
      return res.status(404).send({ message: 'Không tìm thấy đánh giá cho đơn hàng này.' });
    }

    const reviewDoc = snapshot.docs[0];
    const reviewData = reviewDoc.data();

    let serviceName = 'Dịch vụ không xác định';
    const bookingDocRef = db.collection('orders').doc(bookingId);
    const bookingDoc = await bookingDocRef.get();
    if (bookingDoc.exists) {
      serviceName = bookingDoc.data().service?.name || serviceName;
    }

    res.status(200).json({
      id: reviewDoc.id,
      ...reviewData,
      serviceName,
      createdAt: reviewData.createdAt.toDate(), 
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;