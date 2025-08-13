// server/routes/userRoutes.js

const express = require('express');
const router = express.Router();
const { db } = require('../config/firebaseAdmin');
const authMiddleware = require('../middleware/authMiddleware');

// Route: PUT /api/users/profile
// Mục đích: Cập nhật hồ sơ của người dùng đã đăng nhập
// Bảo vệ: Yêu cầu xác thực (phải có token hợp lệ)
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { uid } = req.user; // Lấy uid từ middleware
    const { firstName, lastName, phone, address, gender } = req.body;

    // Server-side validation (bạn có thể thêm validation chi tiết hơn ở đây)
    if (!firstName || !lastName) {
      return res.status(400).send({ message: 'Firstname and Lastname are required.' });
    }

    const userDocRef = db.collection('mm_users').doc(uid);

    const dataToUpdate = {
      lastName,
      firstName,
      phone: phone || "",
      address: address || "",
      gender: gender || ""
    };

    await userDocRef.update(dataToUpdate);

    console.log(`Profile for user ${uid} updated successfully.`);
    res.status(200).send({ message: 'Profile updated successfully!', data: dataToUpdate });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).send({ message: 'Internal Server Error' });
  }
});

module.exports = router;