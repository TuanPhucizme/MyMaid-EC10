const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { validateRequest, schemas } = require('../middleware/validation');

// @route   GET /api/users/profile
// @desc    Get user profile - Retrieves the authenticated user's profile information
// @access  Private
// TODO: Implement authentication middleware to verify user token
// TODO: Return user profile data excluding sensitive information like passwords
router.get('/profile', userController.getProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile - Allows users to update their profile information
// @access  Private
// TODO: Validate request body using validation middleware
// TODO: Update user document in database with new profile data
// TODO: Return updated profile information
router.put('/profile',
  validateRequest(schemas.updateProfile),
  userController.updateProfile
);

// @route   GET /api/users/dashboard
// @desc    Get user dashboard data - Retrieves dashboard statistics and recent activity
// @access  Private
// TODO: Fetch user's recent link checks, statistics, and activity data
// TODO: Calculate credibility score averages and weekly statistics
// TODO: Return formatted dashboard data for frontend display
router.get('/dashboard', userController.getDashboard);

// @route   DELETE /api/users/account
// @desc    Delete user account - Permanently removes user account and associated data
// @access  Private
// TODO: Implement confirmation mechanism before deletion
// TODO: Delete all user's links and associated data
// TODO: Remove user document from database
// TODO: Invalidate all user sessions/tokens
router.delete('/account', userController.deleteAccount);

module.exports = router;
