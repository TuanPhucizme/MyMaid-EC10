const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/stats', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // ✅ SỬA LỖI 1: SỬ DỤNG CÚ PHÁP CỦA ADMIN SDK
    const bookingsQuery = db.collection("mm_bookings").where("createdAt", ">=", startOfMonth);
    const bookingsSnapshot = await bookingsQuery.get();
    
    let revenue = 0;
    bookingsSnapshot.forEach(doc => {
      if (doc.data().status === 'completed') {
        revenue += doc.data().summary.totalPrice;
      }
    });

    const pendingPartnersQuery = db.collection("mm_partners").where("operational.status", "==", "pending_approval");
    const pendingPartnersSnapshot = await pendingPartnersQuery.get();

    const stats = {
      revenueThisMonth: revenue,
      bookingsThisMonth: bookingsSnapshot.size,
      pendingPartners: pendingPartnersSnapshot.size
    };

    res.status(200).json(stats);

  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

/**
 * @route   GET /api/partners
 * @desc    Lấy danh sách tất cả đối tác và thông tin cơ bản của họ
 * @access  Private (Admin only)
 */
router.get('/', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const partnersRef = db.collection('mm_partners');
    const partnersSnapshot = await partnersRef.get();

    if (partnersSnapshot.empty) {
      return res.status(200).json([]);
    }

    const partnerPromises = partnersSnapshot.docs.map(async (pDoc) => {
      const partnerData = pDoc.data();
      const userDocRef = db.collection('mm_users').doc(pDoc.id);
      const userDoc = await userDocRef.get();

      if (userDoc.exists() && partnerData) {
        return {
          uid: pDoc.id,
          name: userDoc.data().name || 'N/A',
          email: userDoc.data().email || 'N/A',
          phone: userDoc.data().phone || 'N/A',
          // ✅ SỬA LỖI 2: DÙNG OPTIONAL CHAINING ĐỂ AN TOÀN HƠN
          status: partnerData.operational?.status || 'unknown',
          rating: partnerData.operational?.rating?.average || 0,
          jobsCompleted: partnerData.operational?.jobsCompleted || 0,
          registeredAt: partnerData.registeredAt ? partnerData.registeredAt.toDate() : null,
        };
      }
      return null;
    });

    const partnersList = (await Promise.all(partnerPromises)).filter(p => p !== null);
    res.status(200).json(partnersList);

  } catch (error) {
    console.error('Error fetching partners list:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

/**
 * @route   PUT /api/partners/:partnerId/status
 * @desc    Cập nhật trạng thái của một đối tác (e.g., approve, suspend)
 * @access  Private (Admin only)
 */
router.put('/:partnerId/status', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const { partnerId } = req.params;
    const { status } = req.body;

    // Validation
    const validStatuses = ['active', 'pending_approval', 'suspended', 'inactive'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).send({ message: 'Invalid status provided.' });
    }

    const partnerDocRef = db.collection('partners').doc(partnerId);
    const doc = await partnerDocRef.get();

    if (!doc.exists) {
      return res.status(404).send({ message: 'Partner not found.' });
    }

    // Cập nhật trường lồng nhau bằng dot notation
    await partnerDocRef.update({
      'operational.status': status
    });

    res.status(200).send({ message: `Partner status updated to ${status}` });

  } catch (error) {
    console.error(`Error updating partner ${req.params.partnerId} status:`, error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router;