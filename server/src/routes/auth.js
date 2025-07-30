const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateRequest, schemas } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register new user with Firebase
// @access  Public
router.post('/register', 
  validateRequest(schemas.register),
  authController.register
);

// @route   POST /api/auth/login
// @desc    Traditional login (for backward compatibility)
// @access  Public
router.post('/login', 
  validateRequest(schemas.login),
  authController.login
);

// @route   POST /api/auth/login/firebase
// @desc    Login with Firebase ID token
// @access  Public
router.post('/login/firebase', 
  validateRequest(schemas.firebaseLogin),
  authController.loginWithFirebase
);

// @route   POST /api/auth/verify-email
// @desc    Verify user email (supports both Firebase and legacy tokens)
// @access  Public
router.post('/verify-email', 
  authController.verifyEmail
);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email (supports both Firebase and legacy)
// @access  Public
router.post('/forgot-password', 
  validateRequest(schemas.forgotPassword),
  authController.forgotPassword
);

// @route   POST /api/auth/reset-password
// @desc    Reset user password (supports both Firebase and legacy)
// @access  Public
router.post('/reset-password', 
  validateRequest(schemas.resetPassword),
  authController.resetPassword
);

// @route   POST /api/auth/refresh-token
// @desc    Refresh Firebase custom token
// @access  Public
router.post('/refresh-token', 
  validateRequest(schemas.refreshToken),
  authController.refreshToken
);

// @route   POST /api/auth/logout
// @desc    Logout user and clean up session
// @access  Private
router.post('/logout', 
  authenticateToken,
  authController.logout
);

module.exports = router;
