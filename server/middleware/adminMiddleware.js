// server/middleware/adminMiddleware.js

const { db } = require('../config/firebaseAdmin');

// Middleware này phải được chạy SAU authMiddleware
const adminMiddleware = async (req, res, next) => {
  // Giả định rằng authMiddleware đã chạy trước và gắn req.user
  if (!req.user) {
    return res.status(401).send({ message: 'Authentication required.' });
  }

  const { uid } = req.user;

  try {
    const userDocRef = db.collection('mm_users').doc(uid);
    const doc = await userDocRef.get();

    if (!doc.exists) {
      // Gửi lỗi JSON, không phải JSX
      return res.status(403).send({ message: 'Forbidden: User profile not found.' });
    }

    const userData = doc.data();
    if (userData.role !== 'admin') {
      // Gửi lỗi JSON, không phải JSX
      return res.status(403).send({ message: 'Forbidden: Access denied. Admin role required.' });
    }

    // Nếu là admin, cho phép request đi tiếp đến hàm xử lý chính
    next();

  } catch (error) {
    console.error('Error in admin middleware:', error);
    // Gửi lỗi JSON, không phải JSX
    return res.status(500).send({ message: 'Internal Server Error' });
  }
};

module.exports = adminMiddleware;