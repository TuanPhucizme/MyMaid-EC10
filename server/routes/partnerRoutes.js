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

/**
 * @route   GET /api/partners/stats
 * @desc    Tính toán và lấy dữ liệu thống kê cho dashboard của Partner
 * @access  Private (Partner only)
 */
router.get('/stats', authMiddleware, async (req, res, next) => {
  try {
    const { uid: partnerId } = req.user;

    // ✅ 1. LẤY DỮ LIỆU TỪ HỒ SƠ PARTNER TRƯỚC
    const partnerDocRef = db.collection('mm_partners').doc(partnerId);
    const partnerDoc = await partnerDocRef.get();

    let ratingAverage = 0;
    let ratingCount = 0;

    if (partnerDoc.exists) {
      const partnerData = partnerDoc.data();
      ratingAverage = partnerData.operational?.rating?.average || 0;
      ratingCount = partnerData.operational?.rating?.count || 0;
    }

    // 1. LẤY CÁC CÔNG VIỆC CỦA ĐỐI TÁC
    const myJobsQuery = db.collection('orders').where('partnerId', '==', partnerId);
    const snapshot = await myJobsQuery.get();

    if (snapshot.empty) {
      console.log('No jobs found for this partner.');
      return res.status(200).json({
        revenueThisMonth: 0,
        completedJobsThisMonth: 0,
        newJobsCount: 0,
        ratingAverage, // Trả về rating đã có
        ratingCount
      });
    }

    // 2. TÍNH TOÁN THỐNG KÊ TRÊN SERVER
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    let revenue = 0;
    let completedCount = 0;
    let newJobsCount = 0;

    snapshot.forEach(doc => {
      const job = doc.data();
      const jobDate = job.createdAt.toDate(); // Dữ liệu ở backend là Timestamp object

      console.log(`Processing job ID: ${doc.id}, Status: ${job.status}, Date: ${jobDate.toISOString()}`);
      // Tính số việc mới được giao
      if (job.status === 'confirmed') {
        newJobsCount++;
      }

      // Tính doanh thu và số việc hoàn thành trong tháng
      if (job.status === 'completed' && jobDate >= startOfMonth) {
        const commissionRate = 0.8; 
        revenue += (job.payment?.amount || 0) * commissionRate;
        completedCount++;
        console.log(`  -> COUNTED! Status is 'completed' and date is in this month. Adding ${revenue * commissionRate} to revenue.`);
      }
    });

    // 3. TRẢ VỀ KẾT QUẢ ĐÃ TÍNH TOÁN
    res.status(200).json({
      revenueThisMonth: revenue,
      completedJobsThisMonth: completedCount,
      newJobsCount: newJobsCount,
      ratingAverage,
      ratingCount
    });

  } catch (error) {
    console.error(`Error fetching stats for partner ${req.user?.uid}:`, error);
    next(error);
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

      if (userDoc.exists && partnerData) {
        return {
          uid: pDoc.id,
          name: userDoc.data().name || 'N/A',
          email: userDoc.data().email || 'N/A',
          phone: userDoc.data().phone || 'N/A',
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

    const myJobsQuery = db.collection('orders') // Sử dụng tên collection đúng
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