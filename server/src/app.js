/**
 * Main Express Application
 * @desc Entry point for the FactCheck backend API server
 * Sets up middleware, routes, and error handling
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// TODO: Add environment validation to ensure required env vars are set
// TODO: Add graceful shutdown handling
// TODO: Add database connection health checks

// Import routes - TODO: Implement lazy loading for better performance
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const linkRoutes = require('./routes/links');

// Import middleware - TODO: Add request ID middleware for better logging
const errorHandler = require('./middleware/errorHandler');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// TODO: Add request logging with unique request IDs
// TODO: Add performance monitoring middleware

// Security middleware - TODO: Configure CSP headers for production
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
  // TODO: Add more specific CORS configuration for production
}));

// Rate limiting - TODO: Implement different limits for different endpoints
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  // TODO: Add custom rate limit messages
  // TODO: Implement Redis store for distributed rate limiting
});
app.use(limiter);

// Logging - TODO: Add structured logging with Winston
app.use(morgan('combined'));

// Body parsing middleware - TODO: Add request size validation
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check endpoint - TODO: Add database connectivity check
app.get('/health', (req, res) => {
  // TODO: Check database connection status
  // TODO: Check external service dependencies
  // TODO: Add memory and CPU usage metrics
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes - TODO: Add API versioning (e.g., /api/v1/)
app.use('/api/auth', authRoutes);
app.use('/api/users', authenticateToken, userRoutes);
app.use('/api/links', authenticateToken, linkRoutes);

// TODO: Add additional routes:
// - Admin routes for user management
// - Analytics routes for usage statistics
// - Webhook routes for external integrations

// 404 handler - TODO: Add request logging for 404s
app.use('*', (req, res) => {
  // TODO: Log 404 attempts for security monitoring
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware - TODO: Add error reporting service integration
app.use(errorHandler);

// Start server - TODO: Add graceful shutdown handling
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);

  // TODO: Add startup checks:
  // - Database connectivity
  // - External service availability
  // - Configuration validation
});

// TODO: Add graceful shutdown handling
// process.on('SIGTERM', gracefulShutdown);
// process.on('SIGINT', gracefulShutdown);

module.exports = app;
