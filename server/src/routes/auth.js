const express = require('express');
const router = express.Router();

/**
 * Auth Routes - Simplified for Firebase Auth
 * @desc Tất cả auth logic đã được chuyển sang Firebase Auth ở frontend
 * Backend chỉ cần verify Firebase ID token thông qua middleware
 */

// Tất cả các auth endpoints (register, login, forgot password) giờ đây
// được xử lý hoàn toàn bởi Firebase Auth ở frontend.
// Backend chỉ cần verify Firebase ID token thông qua middleware trong các protected routes.

module.exports = router;
