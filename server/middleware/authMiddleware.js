// server/middleware/authMiddleware.js

const { auth } = require('../config/firebaseAdmin');

const authMiddleware = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Unauthorized: No token provided.' });
  }

  const idToken = authorization.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    req.user = decodedToken; // Gắn thông tin user đã giải mã vào request
    next(); // Cho phép request đi tiếp
  } catch (error) {
    console.error('Error verifying token:', error);
    return res.status(403).send({ message: 'Forbidden: Invalid token.' });
  }
};

module.exports = authMiddleware;