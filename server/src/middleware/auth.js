const jwt = require('jsonwebtoken');
const { db, collections, firebaseAuth, dbUtils } = require('../config/firebase');

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        code: 'TOKEN_MISSING'
      });
    }

    // Try Firebase ID token first
    const firebaseResult = await firebaseAuth.verifyIdToken(token);
    
    if (firebaseResult.success) {
      const { decodedToken } = firebaseResult;
      const { uid, email } = decodedToken;

      // Get user from Firestore
      const userResult = await dbUtils.getUserByFirebaseUid(uid);
      
      if (!userResult.success) {
        return res.status(404).json({ 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      const user = userResult.user;
      
      // Check if user is verified
      if (!user.isVerified) {
        return res.status(401).json({ 
          error: 'Email not verified',
          code: 'EMAIL_NOT_VERIFIED'
        });
      }

      // Add user info to request
      req.user = {
        userId: user.id,
        firebaseUid: uid,
        email: user.email,
        ...user
      };

      return next();
    }

    // If Firebase token fails, try JWT token (for legacy users)
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Check if user still exists in database
      const userDoc = await db.collection(collections.USERS).doc(decoded.userId).get();
      
      if (!userDoc.exists) {
        return res.status(401).json({ 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      const userData = userDoc.data();
      
      // Check if user is verified
      if (!userData.isVerified) {
        return res.status(401).json({ 
          error: 'Email not verified',
          code: 'EMAIL_NOT_VERIFIED'
        });
      }

      // Add user info to request
      req.user = {
        userId: decoded.userId,
        email: userData.email,
        ...userData
      };

      next();
    } catch (jwtError) {
      // Both Firebase and JWT tokens failed
      if (jwtError.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          error: 'Invalid token',
          code: 'INVALID_TOKEN'
        });
      }
      
      if (jwtError.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          error: 'Token expired',
          code: 'TOKEN_EXPIRED'
        });
      }

      throw jwtError;
    }

  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      code: 'AUTH_ERROR'
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

    // Try Firebase ID token first
    const firebaseResult = await firebaseAuth.verifyIdToken(token);
    
    if (firebaseResult.success) {
      const { decodedToken } = firebaseResult;
      const { uid } = decodedToken;

      // Get user from Firestore
      const userResult = await dbUtils.getUserByFirebaseUid(uid);
      
      if (userResult.success) {
        req.user = {
          userId: userResult.user.id,
          firebaseUid: uid,
          ...userResult.user
        };
      } else {
        req.user = null;
      }

      return next();
    }

    // If Firebase token fails, try JWT token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userDoc = await db.collection(collections.USERS).doc(decoded.userId).get();
      
      if (userDoc.exists) {
        req.user = {
          userId: decoded.userId,
          ...userDoc.data()
        };
      } else {
        req.user = null;
      }

      next();
    } catch (error) {
      req.user = null;
      next();
    }

  } catch (error) {
    req.user = null;
    next();
  }
};

// Middleware to require Firebase authentication only
const requireFirebaseAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        error: 'Firebase ID token required',
        code: 'FIREBASE_TOKEN_MISSING'
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
    const { uid, email } = decodedToken;

    // Get user from Firestore
    const userResult = await dbUtils.getUserByFirebaseUid(uid);
    
    if (!userResult.success) {
      return res.status(404).json({ 
        error: 'User not found',
        code: 'USER_NOT_FOUND'
      });
    }

    const user = userResult.user;
    
    // Check if user is verified
    if (!user.isVerified) {
      return res.status(401).json({ 
        error: 'Email not verified',
        code: 'EMAIL_NOT_VERIFIED'
      });
    }

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

module.exports = {
  authenticateToken,
  optionalAuth,
  requireFirebaseAuth
};
