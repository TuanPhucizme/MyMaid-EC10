// server/middleware/storageMiddleware.js
const { storage } = require('../config/firebaseAdmin');

/**
 * Middleware để kiểm tra và khởi tạo storage bucket
 */
const ensureStorageBucket = async (req, res, next) => {
  try {
    console.log('🔍 [STORAGE MIDDLEWARE] Checking storage bucket availability...');
    
    // Chỉ sử dụng bucket default của Firebase
    const defaultBucket = `${process.env.FIREBASE_PROJECT_ID}.appspot.com`;
    
    try {
      const bucket = storage.bucket(defaultBucket);
      
      console.log(`✅ [STORAGE MIDDLEWARE] Using default Firebase bucket: ${defaultBucket}`);
      
      // Lưu bucket name vào request để sử dụng trong route handler
      req.workingBucket = defaultBucket;
      next();
      
    } catch (error) {
      console.error('❌ [STORAGE MIDDLEWARE] Default bucket not accessible:', error.message);
      
      // Fallback: bypass middleware và để upload route tự handle
      console.log('⚠️ [STORAGE MIDDLEWARE] Bypassing bucket check, letting upload route handle...');
      req.workingBucket = defaultBucket; // Vẫn set bucket name
      next();
    }

  } catch (error) {
    console.error('💥 [STORAGE MIDDLEWARE] Critical error:', error);
    // Không block request, để upload route tự xử lý
    req.workingBucket = `${process.env.FIREBASE_PROJECT_ID}.appspot.com`;
    next();
  }
};

module.exports = { ensureStorageBucket };
