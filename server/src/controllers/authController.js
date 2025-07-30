const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { db, collections, firebaseAuth, dbUtils } = require('../config/firebase');
const emailService = require('../services/emailService');

class AuthController {
  // Register new user with Firebase
  async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Check if user already exists in Firestore
      const existingUser = await db.collection(collections.USERS)
        .where('email', '==', email.toLowerCase())
        .get();

      if (!existingUser.empty) {
        return res.status(400).json({
          error: 'Email already registered',
          code: 'EMAIL_EXISTS'
        });
      }

      // Create user in Firebase Auth
      const firebaseUserResult = await firebaseAuth.createUser({
        email: email.toLowerCase(),
        password,
        firstName,
        lastName
      });

      if (!firebaseUserResult.success) {
        return res.status(400).json({
          error: firebaseUserResult.error,
          code: 'FIREBASE_CREATE_FAILED'
        });
      }

      const firebaseUser = firebaseUserResult.userRecord;

      // Create user document in Firestore
      const userData = {
        firebaseUid: firebaseUser.uid,
        email: email.toLowerCase(),
        firstName,
        lastName,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        profile: {
          bio: '',
          avatar: null
        },
        stats: {
          linksChecked: 0,
          joinedAt: new Date().toISOString()
        }
      };

      // Save user to Firestore
      const userRef = await db.collection(collections.USERS).add(userData);

      // Send email verification using Firebase
      const verificationResult = await firebaseAuth.sendEmailVerification(firebaseUser.uid);
      
      if (verificationResult.success) {
        // Also send our custom verification email as backup
        await emailService.sendVerificationEmail(email, firebaseUser.uid, firstName);
      }

      res.status(201).json({
        message: 'Registration successful. Please check your email to verify your account.',
        userId: userRef.id,
        firebaseUid: firebaseUser.uid
      });

    } catch (error) {
      next(error);
    }
  }

  // Login with Firebase ID token
  async loginWithFirebase(req, res, next) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({
          error: 'Firebase ID token is required',
          code: 'ID_TOKEN_MISSING'
        });
      }

      // Verify Firebase ID token
      const tokenResult = await firebaseAuth.verifyIdToken(idToken);
      
      if (!tokenResult.success) {
        return res.status(401).json({
          error: 'Invalid Firebase token',
          code: 'INVALID_FIREBASE_TOKEN'
        });
      }

      const { decodedToken } = tokenResult;
      const { uid, email } = decodedToken;

      // Get user from Firestore
      const userResult = await dbUtils.getUserByFirebaseUid(uid);
      
      if (!userResult.success) {
        return res.status(404).json({
          error: 'User not found in database',
          code: 'USER_NOT_FOUND'
        });
      }

      const user = userResult.user;

      // Check if email is verified
      if (!user.isVerified) {
        return res.status(401).json({
          error: 'Please verify your email before logging in',
          code: 'EMAIL_NOT_VERIFIED'
        });
      }

      // Create custom token for client
      const customTokenResult = await firebaseAuth.createCustomToken(uid, {
        userId: user.id,
        email: user.email
      });

      if (!customTokenResult.success) {
        return res.status(500).json({
          error: 'Failed to create custom token',
          code: 'CUSTOM_TOKEN_FAILED'
        });
      }

      // Create session
      await dbUtils.createUserSession(user.id, {
        firebaseUid: uid,
        userAgent: req.headers['user-agent'],
        ipAddress: req.ip,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      });

      // Update last login
      await db.collection(collections.USERS).doc(user.id).update({
        lastLoginAt: new Date().toISOString()
      });

      // Return user data (excluding sensitive fields)
      const { password: _, ...userResponse } = user;

      res.json({
        message: 'Login successful',
        customToken: customTokenResult.customToken,
        user: {
          id: user.id,
          ...userResponse
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Traditional login (for backward compatibility)
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      // Find user by email
      const userQuery = await db.collection(collections.USERS)
        .where('email', '==', email.toLowerCase())
        .get();

      if (userQuery.empty) {
        return res.status(401).json({
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
      }

      const userDoc = userQuery.docs[0];
      const userData = userDoc.data();

      // Check if user has Firebase UID (newer users)
      if (userData.firebaseUid) {
        return res.status(400).json({
          error: 'Please use Firebase authentication',
          code: 'USE_FIREBASE_AUTH'
        });
      }

      // Check password for legacy users
      if (!userData.password) {
        return res.status(401).json({
          error: 'Invalid credentials - no password found',
          code: 'INVALID_CREDENTIALS'
        });
      }

      const isPasswordValid = await bcrypt.compare(password, userData.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          error: 'Invalid credentials',
          code: 'INVALID_CREDENTIALS'
        });
      }

      // Check if email is verified
      if (!userData.isVerified) {
        return res.status(401).json({
          error: 'Please verify your email before logging in',
          code: 'EMAIL_NOT_VERIFIED'
        });
      }

      // Generate JWT token for legacy users
      const token = jwt.sign(
        { userId: userDoc.id, email: userData.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
      );

      // Update last login
      await userDoc.ref.update({
        lastLoginAt: new Date().toISOString()
      });

      // Return user data (excluding password)
      const { password: _, ...userResponse } = userData;

      res.json({
        message: 'Login successful',
        token,
        user: {
          id: userDoc.id,
          ...userResponse
        }
      });

    } catch (error) {
      next(error);
    }
  }

  // Verify email with Firebase
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.body;

      // Try to verify with Firebase first
      try {
        const userRecord = await firebaseAuth.auth.getUser(token);
        
        if (userRecord.emailVerified) {
          // Update user verification status in Firestore
          const userResult = await dbUtils.getUserByFirebaseUid(token);
          
          if (userResult.success) {
            await db.collection(collections.USERS).doc(userResult.user.id).update({
              isVerified: true,
              verifiedAt: new Date().toISOString(),
              updatedAt: new Date().toISOString()
            });
          }

          return res.json({
            message: 'Email verified successfully'
          });
        }
      } catch (firebaseError) {
        // If Firebase verification fails, try legacy token verification
        console.log('Firebase verification failed, trying legacy method');
      }

      // Legacy token verification
      const tokenQuery = await db.collection(collections.VERIFICATION_TOKENS)
        .where('token', '==', token)
        .get();

      if (tokenQuery.empty) {
        return res.status(400).json({
          error: 'Invalid or expired verification token',
          code: 'INVALID_TOKEN'
        });
      }

      const tokenDoc = tokenQuery.docs[0];
      const tokenData = tokenDoc.data();

      // Check if token is expired
      if (new Date(tokenData.expiresAt) < new Date()) {
        await tokenDoc.ref.delete();
        return res.status(400).json({
          error: 'Verification token has expired',
          code: 'TOKEN_EXPIRED'
        });
      }

      // Update user verification status
      await db.collection(collections.USERS).doc(tokenData.userId).update({
        isVerified: true,
        verifiedAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      // Delete verification token
      await tokenDoc.ref.delete();

      res.json({
        message: 'Email verified successfully'
      });

    } catch (error) {
      next(error);
    }
  }

  // Forgot password with Firebase
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;

      // Find user by email
      const userQuery = await db.collection(collections.USERS)
        .where('email', '==', email.toLowerCase())
        .get();

      if (userQuery.empty) {
        // Don't reveal if email exists or not for security
        return res.json({
          message: 'If an account with that email exists, a password reset link has been sent.'
        });
      }

      const userDoc = userQuery.docs[0];
      const userData = userDoc.data();

      // If user has Firebase UID, use Firebase password reset
      if (userData.firebaseUid) {
        const resetResult = await firebaseAuth.sendPasswordResetEmail(email);
        
        if (resetResult.success) {
          return res.json({
            message: 'If an account with that email exists, a password reset link has been sent.'
          });
        }
      }

      // Legacy password reset for users without Firebase UID
      const resetToken = crypto.randomBytes(32).toString('hex');

      // Save reset token
      await db.collection(collections.PASSWORD_RESET_TOKENS).add({
        userId: userDoc.id,
        token: resetToken,
        email: email.toLowerCase(),
        expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 1 hour
        createdAt: new Date().toISOString()
      });

      // Send reset email
      await emailService.sendPasswordResetEmail(email, resetToken, userData.firstName);

      res.json({
        message: 'If an account with that email exists, a password reset link has been sent.'
      });

    } catch (error) {
      next(error);
    }
  }

  // Reset password
  async resetPassword(req, res, next) {
    try {
      const { token, newPassword } = req.body;

      // Try Firebase password reset first
      try {
        const actionCode = token;
        const email = await firebaseAuth.auth.verifyPasswordResetCode(actionCode);
        
        // Update password in Firebase
        await firebaseAuth.auth.confirmPasswordReset(actionCode, newPassword);
        
        // Update user in Firestore
        const userQuery = await db.collection(collections.USERS)
          .where('email', '==', email)
          .get();
        
        if (!userQuery.empty) {
          const userDoc = userQuery.docs[0];
          await userDoc.ref.update({
            updatedAt: new Date().toISOString()
          });
        }

        return res.json({
          message: 'Password reset successfully'
        });
      } catch (firebaseError) {
        // If Firebase reset fails, try legacy token reset
        console.log('Firebase password reset failed, trying legacy method');
      }

      // Legacy token reset
      const tokenQuery = await db.collection(collections.PASSWORD_RESET_TOKENS)
        .where('token', '==', token)
        .get();

      if (tokenQuery.empty) {
        return res.status(400).json({
          error: 'Invalid or expired reset token',
          code: 'INVALID_TOKEN'
        });
      }

      const tokenDoc = tokenQuery.docs[0];
      const tokenData = tokenDoc.data();

      // Check if token is expired
      if (new Date(tokenData.expiresAt) < new Date()) {
        await tokenDoc.ref.delete();
        return res.status(400).json({
          error: 'Reset token has expired',
          code: 'TOKEN_EXPIRED'
        });
      }

      // Hash new password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update user password
      await db.collection(collections.USERS).doc(tokenData.userId).update({
        password: hashedPassword,
        updatedAt: new Date().toISOString()
      });

      // Delete reset token
      await tokenDoc.ref.delete();

      res.json({
        message: 'Password reset successfully'
      });

    } catch (error) {
      next(error);
    }
  }

  // Refresh Firebase custom token
  async refreshToken(req, res, next) {
    try {
      const { firebaseUid } = req.body;

      if (!firebaseUid) {
        return res.status(400).json({
          error: 'Firebase UID is required',
          code: 'UID_MISSING'
        });
      }

      // Get user from Firestore
      const userResult = await dbUtils.getUserByFirebaseUid(firebaseUid);
      
      if (!userResult.success) {
        return res.status(404).json({
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        });
      }

      // Create new custom token
      const customTokenResult = await firebaseAuth.createCustomToken(firebaseUid, {
        userId: userResult.user.id,
        email: userResult.user.email
      });

      if (!customTokenResult.success) {
        return res.status(500).json({
          error: 'Failed to create custom token',
          code: 'CUSTOM_TOKEN_FAILED'
        });
      }

      res.json({
        message: 'Token refreshed successfully',
        customToken: customTokenResult.customToken
      });

    } catch (error) {
      next(error);
    }
  }

  // Logout (clean up session)
  async logout(req, res, next) {
    try {
      const { userId } = req.user;

      if (userId) {
        // Clean up user sessions
        const sessionsQuery = await db.collection(collections.USER_SESSIONS)
          .where('userId', '==', userId)
          .get();
        
        const batch = db.batch();
        sessionsQuery.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
        
        await batch.commit();
      }

      res.json({
        message: 'Logout successful'
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = new AuthController();
