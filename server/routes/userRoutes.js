// server/routes/userRoutes.js
const express = require('express');
const router = express.Router();
const { db, storage } = require('../config/firebaseAdmin');

const { v4: uuidv4 } = require('uuid');
const authMiddleware = require('../middleware/authMiddleware');
const { ensureStorageBucket } = require('../middleware/storageMiddleware');

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
router.post('/avatar', [authMiddleware, ensureStorageBucket, upload.single('avatar')], async (req, res) => {
  try {
    console.log('🚀 [AVATAR UPLOAD] Starting avatar upload process...');
    console.log('📋 [AVATAR UPLOAD] Request details:', {
      user: req.user?.uid,
      hasFile: !!req.file,
      fileSize: req.file?.size,
      fileMimetype: req.file?.mimetype,
      fileOriginalname: req.file?.originalname,
      workingBucket: req.workingBucket
    });

    if (!req.file) {
      console.log('❌ [AVATAR UPLOAD] No file provided in request');
      return res.status(400).send({ message: 'Vui lòng chọn một file ảnh.' });
    }

    const user = req.user;
    console.log('👤 [AVATAR UPLOAD] User authenticated:', user.uid);

    // Sử dụng bucket đã được verify bởi middleware
    const bucketName = req.workingBucket;
    const bucket = storage.bucket(bucketName);
    console.log('🪣 [AVATAR UPLOAD] Using verified bucket:', bucketName);

    const filename = `avatars/${user.uid}/avatar-${uuidv4()}`;
    console.log('📁 [AVATAR UPLOAD] Target filename:', filename);

    const fileUpload = bucket.file(filename);
    console.log('📤 [AVATAR UPLOAD] File upload object created');

    // Sử dụng Promise để handle upload
    const publicUrl = await new Promise((resolve, reject) => {
      const blobStream = fileUpload.createWriteStream({
        metadata: { contentType: req.file.mimetype },
      });

      blobStream.on('error', (error) => {
        console.error('❌ [AVATAR UPLOAD] Blob stream error:', error);
        reject(error);
      });

      blobStream.on('finish', async () => {
        console.log('✅ [AVATAR UPLOAD] File upload completed');
        const url = `https://storage.googleapis.com/${bucketName}/${filename}`;
        console.log('🔗 [AVATAR UPLOAD] Public URL generated:', url);
        resolve(url);
      });

      blobStream.end(req.file.buffer);
      console.log('📝 [AVATAR UPLOAD] Blob stream ended, waiting for completion...');
    });

    // Cập nhật URL avatar trong document của user
    await db.collection('mm_users').doc(user.uid).update({
      avatarUrl: publicUrl,
    });
    console.log('💾 [AVATAR UPLOAD] Firestore updated successfully');

    res.status(200).send({ 
      message: 'Cập nhật ảnh đại diện thành công!', 
      avatarUrl: publicUrl,
      bucketUsed: bucketName
    });
    console.log('🎉 [AVATAR UPLOAD] Response sent successfully');

  } catch (error) {
    console.error('💥 [AVATAR UPLOAD] Critical error:', {
      message: error.message,
      code: error.code,
      status: error.status,
      stack: error.stack
    });
    res.status(500).send({ message: 'Lỗi server khi upload ảnh.', error: error.message });
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