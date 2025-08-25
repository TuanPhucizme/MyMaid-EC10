const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const authMiddleware = require('../middleware/authMiddleware');

/**
 * @route   GET /api/notifications
 * @desc    Lấy danh sách thông báo của partner
 * @access  Private (Partner only)
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { uid: partnerId } = req.user;
    const { limit = 20, offset = 0, unreadOnly = false } = req.query;

    let query = db.collection('notifications')
      .where('partnerId', '==', partnerId)
      .orderBy('createdAt', 'desc')
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    if (unreadOnly === 'true') {
      query = query.where('read', '==', false);
    }

    const snapshot = await query.get();
    
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt
    }));

    // Get unread count
    const unreadQuery = db.collection('notifications')
      .where('partnerId', '==', partnerId)
      .where('read', '==', false);
    
    const unreadSnapshot = await unreadQuery.get();
    const unreadCount = unreadSnapshot.size;

    res.json({
      success: true,
      notifications,
      unreadCount,
      total: notifications.length
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thông báo',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/notifications/:notificationId/read
 * @desc    Đánh dấu thông báo đã đọc
 * @access  Private (Partner only)
 */
router.put('/:notificationId/read', authMiddleware, async (req, res) => {
  try {
    const { uid: partnerId } = req.user;
    const { notificationId } = req.params;

    const notificationRef = db.collection('notifications').doc(notificationId);
    const notificationDoc = await notificationRef.get();

    if (!notificationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }

    const notificationData = notificationDoc.data();
    
    // Verify ownership
    if (notificationData.partnerId !== partnerId) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền truy cập thông báo này'
      });
    }

    await notificationRef.update({
      read: true,
      readAt: new Date()
    });

    res.json({
      success: true,
      message: 'Đã đánh dấu thông báo đã đọc'
    });

  } catch (error) {
    console.error('Error marking notification as read:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật thông báo',
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/notifications/mark-all-read
 * @desc    Đánh dấu tất cả thông báo đã đọc
 * @access  Private (Partner only)
 */
router.put('/mark-all-read', authMiddleware, async (req, res) => {
  try {
    const { uid: partnerId } = req.user;

    const unreadQuery = db.collection('notifications')
      .where('partnerId', '==', partnerId)
      .where('read', '==', false);
    
    const snapshot = await unreadQuery.get();
    
    if (snapshot.empty) {
      return res.json({
        success: true,
        message: 'Không có thông báo chưa đọc',
        updatedCount: 0
      });
    }

    const batch = db.batch();
    let updatedCount = 0;

    snapshot.forEach(doc => {
      batch.update(doc.ref, {
        read: true,
        readAt: new Date()
      });
      updatedCount++;
    });

    await batch.commit();

    res.json({
      success: true,
      message: `Đã đánh dấu ${updatedCount} thông báo đã đọc`,
      updatedCount
    });

  } catch (error) {
    console.error('Error marking all notifications as read:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi cập nhật thông báo',
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/notifications/:notificationId
 * @desc    Xóa thông báo
 * @access  Private (Partner only)
 */
router.delete('/:notificationId', authMiddleware, async (req, res) => {
  try {
    const { uid: partnerId } = req.user;
    const { notificationId } = req.params;

    const notificationRef = db.collection('notifications').doc(notificationId);
    const notificationDoc = await notificationRef.get();

    if (!notificationDoc.exists) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy thông báo'
      });
    }

    const notificationData = notificationDoc.data();
    
    // Verify ownership
    if (notificationData.partnerId !== partnerId) {
      return res.status(403).json({
        success: false,
        message: 'Không có quyền xóa thông báo này'
      });
    }

    await notificationRef.delete();

    res.json({
      success: true,
      message: 'Đã xóa thông báo'
    });

  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi xóa thông báo',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/notifications/stats
 * @desc    Lấy thống kê thông báo
 * @access  Private (Partner only)
 */
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const { uid: partnerId } = req.user;

    // Get total notifications
    const totalQuery = db.collection('notifications')
      .where('partnerId', '==', partnerId);
    const totalSnapshot = await totalQuery.get();

    // Get unread notifications
    const unreadQuery = db.collection('notifications')
      .where('partnerId', '==', partnerId)
      .where('read', '==', false);
    const unreadSnapshot = await unreadQuery.get();

    // Get today's notifications
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const todayQuery = db.collection('notifications')
      .where('partnerId', '==', partnerId)
      .where('createdAt', '>=', today);
    const todaySnapshot = await todayQuery.get();

    res.json({
      success: true,
      stats: {
        total: totalSnapshot.size,
        unread: unreadSnapshot.size,
        today: todaySnapshot.size,
        readPercentage: totalSnapshot.size > 0 ? 
          Math.round(((totalSnapshot.size - unreadSnapshot.size) / totalSnapshot.size) * 100) : 0
      }
    });

  } catch (error) {
    console.error('Error fetching notification stats:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server khi lấy thống kê thông báo',
      error: error.message
    });
  }
});

module.exports = router;
