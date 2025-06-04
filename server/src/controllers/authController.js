const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { db, collections } = require('../config/firebase');
const emailService = require('../services/emailService');

class AuthController {
  // Register new user
  async register(req, res, next) {
    try {
      const { email, password, firstName, lastName } = req.body;

      // Check if user already exists
      const existingUser = await db.collection(collections.USERS)
        .where('email', '==', email.toLowerCase())
        .get();

      if (!existingUser.empty) {
        return res.status(400).json({
          error: 'Email already registered',
          code: 'EMAIL_EXISTS'
        });
      }

      // Hash password
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');

      // Create user document
      const userData = {
        email: email.toLowerCase(),
        password: hashedPassword,
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

      // Save verification token
      await db.collection(collections.VERIFICATION_TOKENS).add({
        userId: userRef.id,
        token: verificationToken,
        email: email.toLowerCase(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
        createdAt: new Date().toISOString()
      });

      // Send verification email
      await emailService.sendVerificationEmail(email, verificationToken, firstName);

      res.status(201).json({
        message: 'Registration successful. Please check your email to verify your account.',
        userId: userRef.id
      });

    } catch (error) {
      next(error);
    }
  }

  // Login user
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

      // Check password
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

      // Generate JWT token
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

  // Verify email
  async verifyEmail(req, res, next) {
    try {
      const { token } = req.body;

      // Find verification token
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

  // Forgot password
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

      // Generate reset token
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

      // Find reset token
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
}

module.exports = new AuthController();
