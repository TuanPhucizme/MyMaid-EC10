/**
 * Firebase Configuration
 * @desc Initializes Firebase Admin SDK for server-side operations
 * Provides database, authentication, and collection references
 */

const admin = require('firebase-admin');

// TODO: Add environment validation to ensure all required Firebase env vars are set
// TODO: Add connection health check function
// TODO: Add retry logic for Firebase initialization

// Initialize Firebase Admin SDK with service account credentials
// TODO: Move service account configuration to a separate secure config file
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: `https://www.googleapis.com/oauth2/v1/certs`,
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
};

// TODO: Add validation for service account configuration
// TODO: Add error handling for initialization failures
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
      // TODO: Add additional configuration options:
      // - databaseURL for Realtime Database
      // - storageBucket for Cloud Storage
    });
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    // TODO: Implement proper error handling and fallback mechanisms
  }
}

// Initialize Firebase services
// TODO: Add connection pooling configuration
const db = admin.firestore();
const auth = admin.auth();

// TODO: Add Cloud Storage and other Firebase services as needed
// const storage = admin.storage();
// const messaging = admin.messaging();

// Firestore collections configuration
// TODO: Move to a separate constants file for better organization
// TODO: Add collection validation and indexing configuration
const collections = {
  USERS: 'users',
  LINKS: 'links',
  VERIFICATION_TOKENS: 'verification_tokens',
  PASSWORD_RESET_TOKENS: 'password_reset_tokens'
  // TODO: Add additional collections:
  // ADMIN_LOGS: 'admin_logs',
  // USER_SESSIONS: 'user_sessions',
  // ANALYTICS: 'analytics'
};

// TODO: Add database helper functions:
// - Connection health check
// - Batch operation helpers
// - Transaction helpers
// - Query optimization utilities

// TODO: Add Firebase security rules validation
// TODO: Add backup and restore utilities

module.exports = {
  admin,
  db,
  auth,
  collections
  // TODO: Export additional services and utilities
};
