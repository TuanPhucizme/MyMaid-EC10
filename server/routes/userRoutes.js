// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { db, storage } = require('../config/firebaseAdmin');

const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/authMiddleware');

const multer = require('multer');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

/**
 * @route   POST /api/users/avatar
 * @desc    Upload avatar cho người dùng đang đăng nhập
 * @access  Private
 */
router.post('/avatar', [authMiddleware, upload.single('avatar')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: 'Vui lòng chọn một file ảnh.' });
    }
    const user = req.user;
    const bucket = storage.bucket();
    const filename = `avatars/${user.uid}/avatar-${uuidv4()}`;
    const fileUpload = bucket.file(filename);

    const blobStream = fileUpload.createWriteStream({
      metadata: { contentType: req.file.mimetype },
    });

    blobStream.on('error', (error) => {
      throw error;
    });

    blobStream.on('finish', async () => {
      const publicUrl = `https://storage.googleapis.com/${bucket.name}/${filename}`;
      // Cập nhật URL avatar trong document của user
      await db.collection('mm_users').doc(user.uid).update({
        avatarUrl: publicUrl,
      });
      res.status(200).send({ message: 'Cập nhật ảnh đại diện thành công!', avatarUrl: publicUrl });
    });

    blobStream.end(req.file.buffer);

  } catch (error) {
    console.error('Lỗi khi upload avatar:', error);
    res.status(500).send({ message: 'Lỗi server khi upload ảnh.' });
  }
});

router.get('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { uid } = req.user;
    const userDocRef = db.collection('mm_users').doc(uid);
    const userDoc = await userDocRef.get();

    if (!userDoc.exists) {
      return res.status(404).send({ message: 'User not found.' });
    }

    res.status(200).send({ 
      message: 'Profile retrieved successfully!', 
      data: userDoc.data() 
    });
  } catch (error) {
    console.error('Error retrieving profile:', error);
    // Sử dụng next(error) để chuyển cho global error handler
    next(error); 
  }
});

router.put('/profile', authMiddleware, async (req, res, next) => {
  try {
    const { uid } = req.user;
    // ✅ 1. NHẬN VỀ firstName VÀ lastName TỪ req.body
    const { firstName, lastName, phone, address, gender } = req.body;

    // ✅ 2. CẬP NHẬT VALIDATION
    if (!firstName || firstName.trim() === '' || !lastName || lastName.trim() === '') {
      return res.status(400).send({ message: 'Họ và Tên là bắt buộc.' });
    }

    const userDocRef = db.collection('mm_users').doc(uid);

    // ✅ 3. CẬP NHẬT ĐỐI TƯỢNG GỬI LÊN FIRESTORE
    const dataToUpdate = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      // Tạo một trường 'name' tổng hợp để tiện cho việc tìm kiếm/hiển thị sau này
      name: `${firstName.trim()} ${lastName.trim()}`, 
      phone: phone || "",
      address: address || "",
      gender: gender || ""
    };

    await userDocRef.update(dataToUpdate);

    // Đọc lại dữ liệu mới nhất để trả về
    const updatedDoc = await userDocRef.get();

    console.log(`Profile for user ${uid} updated successfully.`);
    // Trả về dữ liệu đã được cập nhật để frontend có thể làm mới state
    res.status(200).send({ message: 'Profile updated successfully!', data: updatedDoc.data() });

  } catch (error) {
    console.error(`Error updating profile for user ${req.user?.uid}:`, error);
    // Chuyển lỗi cho global error handler để có log chi tiết
    next(error);
  }
});

module.exports = router;