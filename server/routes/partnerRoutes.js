const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

router.get('/stats', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

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

router.get('/pending', [authMiddleware, adminMiddleware], async (req, res) => {
  try {
    const pendingPartnersQuery = db.collection('mm_partners').where("operational.status", "==", "pending_approval");
    const snapshot = await pendingPartnersQuery.get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const pendingListPromises = snapshot.docs.map(async (pDoc) => {
      const partnerData = pDoc.data();
      const userDoc = await db.collection('mm_users').doc(pDoc.id).get();

      if (userDoc.exists()) {
        // Trả về đầy đủ thông tin cần thiết cho modal
        return {
          uid: pDoc.id,
          name: userDoc.data().name,
          email: userDoc.data().email,
          phone: userDoc.data().phone,
          address: userDoc.data().address,
          photoURL: userDoc.data().photoURL,
          idNumber: partnerData.verification?.idNumber,
          registeredAt: partnerData.registeredAt.toDate(),
        };
      }
      return null;
    });

    const pendingList = (await Promise.all(pendingListPromises)).filter(p => p);
    res.status(200).json(pendingList);

  } catch (error) {
    console.error('Error fetching pending partners:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

/**
 * @route   PUT /api/partners/:partnerId/status
 * @desc    Cập nhật trạng thái của một đối tác (và cập nhật role nếu cần)
 * @access  Private (Admin only)
 */
router.put('/:partnerId/status', [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const { partnerId } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'suspended', 'inactive'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).send({ message: 'Invalid status provided.' });
    }

    const partnerDocRef = db.collection('mm_partners').doc(partnerId);
    const userDocRef = db.collection('mm_users').doc(partnerId);

    // Sử dụng transaction để đảm bảo cả hai hành động cùng thành công hoặc cùng thất bại
    await db.runTransaction(async (transaction) => {
      const partnerDoc = await transaction.get(partnerDocRef);
      if (!partnerDoc.exists) {
        throw new Error('Partner profile not found.');
      }

      // 1. Cập nhật trạng thái trong 'mm_partners'
      transaction.update(partnerDocRef, { 'operational.status': status });

      // 2. NẾU trạng thái là 'active', cập nhật role trong 'mm_users'
      if (status === 'active') {
        transaction.update(userDocRef, { role: 'partner' });
      } else {
        // Nếu bị đình chỉ hoặc không hoạt động, có thể cân nhắc đổi role về 'customer'
        // transaction.update(userDocRef, { role: 'customer' });
      }
    });

    res.status(200).send({ message: `Partner status updated to ${status}` });

  } catch (error) {
    console.error(`Error updating partner ${req.params.partnerId} status:`, error);
    next(error); // Chuyển cho global error handler
  }
});

module.exports = router;