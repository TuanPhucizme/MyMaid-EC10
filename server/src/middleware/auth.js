const { db, collections, firebaseAuth, dbUtils } = require('../config/firebase');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Firebase ID token required',
        code: 'TOKEN_MISSING'
      });
    }

    // Verify Firebase ID token
    const firebaseResult = await firebaseAuth.verifyIdToken(token);
    
    if (!firebaseResult.success) {
      return res.status(401).json({ 
        error: 'Invalid Firebase token',
        code: 'INVALID_FIREBASE_TOKEN'
      });
    }

    const { decodedToken } = firebaseResult;
    const { uid, email, email_verified } = decodedToken;

    // Kiểm tra email đã được xác thực
    if (!email_verified) {
      return res.status(401).json({ 
        error: 'Email not verified',
        code: 'EMAIL_NOT_VERIFIED'
      });
    }

    // Tạo hoặc cập nhật user trong Firestore nếu cần
    let userResult = await dbUtils.getUserByFirebaseUid(uid);
    
    if (!userResult.success) {
      // User chưa tồn tại trong Firestore, tạo mới
      const userData = {
        firebaseUid: uid,
        email: email,
        firstName: decodedToken.name?.split(' ')[0] || '',
        lastName: decodedToken.name?.split(' ').slice(1).join(' ') || '',
        isVerified: email_verified,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profile: {
          bio: '',
          avatar: decodedToken.picture || null
        },
        stats: {
          linksChecked: 0,
          joinedAt: new Date().toISOString()
        }
      };

      const userRef = await db.collection(collections.USERS).add(userData);
      
      userResult = {
        success: true,
        user: { id: userRef.id, ...userData }
      };
    }

    const user = userResult.user;

    // Add user info to request
    req.user = {
      userId: user.id,
      firebaseUid: uid,
      email: user.email,
      ...user
    };

    next();

  } catch (error) {
    console.error('Firebase auth middleware error:', error);
    res.status(500).json({ 
      error: 'Firebase authentication failed',
      code: 'FIREBASE_AUTH_ERROR'
    });
  }
};

const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    // Verify Firebase ID token
    const firebaseResult = await firebaseAuth.verifyIdToken(token);
    
    if (firebaseResult.success) {
      const { decodedToken } = firebaseResult;
      const { uid, email, email_verified } = decodedToken;

      if (email_verified) {
        // Get user from Firestore
        const userResult = await dbUtils.getUserByFirebaseUid(uid);
        
        if (userResult.success) {
          req.user = {
            userId: userResult.user.id,
            firebaseUid: uid,
            email: userResult.user.email,
            ...userResult.user
          };
        } else {
          req.user = null;
        }
      } else {
        req.user = null;
      }
    } else {
      req.user = null;
    }

    next();

  } catch (error) {
    req.user = null;
    next();
  }
};

// Middleware chỉ yêu cầu Firebase authentication (alias cho authenticateToken)
const requireFirebaseAuth = authenticateToken;



module.exports = {
  authenticateToken,
  optionalAuth,
  requireFirebaseAuth
};
