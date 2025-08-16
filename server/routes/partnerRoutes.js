const express = require('express');
const router = express.Router();
const { db, storage } = require('../config/firebaseAdmin'); // Thêm storage vào
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const multer = require('multer'); // Import multer
const { v4: uuidv4 } = require('uuid');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn 5MB
  },
});

/**
 * @route   POST /api/partners/register
 * @desc    Cho phép người dùng đã đăng nhập đăng ký làm đối tác
 * @access  Private (Logged-in users)
 */
router.post('/register', authMiddleware, async (req, res) => {
  try {
    const { nationalId } = req.body;
    const user = req.user; // Lấy từ authMiddleware

    if (!nationalId) {
      return res.status(400).send({ message: 'Vui lòng cung cấp số CCCD/CMND.' });
    }

    // 1. Sử dụng Batched Write để cập nhật nhiều collection
    const batch = db.batch();

    // Tham chiếu đến document của user và partner
    const userDocRef = db.collection('mm_users').doc(user.uid);
    const partnerDocRef = db.collection('mm_partners').doc(user.uid);

    // Tác vụ 1: Cập nhật role trong mm_users
    batch.update(userDocRef, { role: 'partner' });

    // Tác vụ 2: Tạo document mới trong mm_partners
    batch.set(partnerDocRef, {
      userId: user.uid,
      nationalId: nationalId,
      registeredAt: new Date(),
      operational: {
        status: 'active', // <-- KÍCH HOẠT NGAY LẬP TỨC
        rating: {
          average: 0,
          count: 0,
        },
        jobsCompleted: 0,
      },
    });

    // 2. Commit batch
    await batch.commit();

    res.status(201).send({ message: 'Chúc mừng! Bạn đã chính thức trở thành đối tác của chúng tôi.' });

  } catch (error) {
    console.error('Lỗi khi đăng ký đối tác:', error);
    res.status(500).send({ message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' });
  }
});

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
          registeredAt: partnerData.registeredAt?.toDate ? partnerData.registeredAt.toDate() : null,
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
 * @route   GET /api/partners/my-jobs
 * @desc    Lấy danh sách các công việc đã được gán cho đối tác đang đăng nhập
 * @access  Private (Partner only)
 */
router.get('/my-jobs', authMiddleware, async (req, res, next) => {
  try {
    const { uid: partnerId } = req.user;

    const myJobsQuery = db.collection('bookings') // Sử dụng tên collection đúng
      .where('partnerId', '==', partnerId)
      .orderBy('createdAt', 'desc');
      
    const snapshot = await myJobsQuery.get();

    if (snapshot.empty) {
      return res.status(200).json([]);
    }

    const jobsList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(jobsList);

  } catch (error) {
    console.error(`Error fetching jobs for partner ${req.user?.uid}:`, error);
    next(error);
  }
});

router.put('/:partnerId/status', [authMiddleware, adminMiddleware], async (req, res, next) => {
  try {
    const { partnerId } = req.params;
    const { status } = req.body;

    const validStatuses = ['active', 'suspended']; // Chỉ cho phép 2 trạng thái này
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).send({ message: 'Trạng thái không hợp lệ.' });
    }

    const partnerDocRef = db.collection('mm_partners').doc(partnerId);
    await partnerDocRef.update({ 'operational.status': status });

    res.status(200).send({ message: `Trạng thái đối tác đã được cập nhật.` });

  } catch (error) {
    console.error(`Lỗi khi cập nhật trạng thái đối tác ${req.params.partnerId}:`, error);
    next(error);
  }
});

module.exports = router;