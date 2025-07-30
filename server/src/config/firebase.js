/**
 * Firebase Configuration
 * @desc Initializes Firebase Admin SDK for server-side operations
 * Provides database, authentication, and collection references
 */

const admin = require('firebase-admin');
const path = require('path');

// Load environment variables from root directory
require('dotenv').config({ path: path.join(__dirname, '../../../.env') });

// Initialize Firebase Admin SDK with service account credentials
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`
};

// Validate required environment variables
const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL'
];

const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
  console.error('❌ Missing required Firebase environment variables:', missingVars);
  console.error('💡 Make sure your .env file is in the root directory and contains all required Firebase variables');
  process.exit(1);
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    console.log('✅ Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    process.exit(1);
  }
}

// Initialize Firebase services
const db = admin.firestore();
const auth = admin.auth();

// Firestore collections configuration
const collections = {
  USERS: 'users',
  LINKS: 'links',
  VERIFICATION_TOKENS: 'verification_tokens',
  PASSWORD_RESET_TOKENS: 'password_reset_tokens',
  USER_SESSIONS: 'user_sessions'
};

// Firebase Authentication utilities
const firebaseAuth = {
  // Verify Firebase ID token
  async verifyIdToken(idToken) {
    try {
      const decodedToken = await auth.verifyIdToken(idToken);
      return { success: true, decodedToken };
    } catch (error) {
      console.error('Firebase token verification failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Create custom token for client
  async createCustomToken(uid, additionalClaims = {}) {
    try {
      const customToken = await auth.createCustomToken(uid, additionalClaims);
      return { success: true, customToken };
    } catch (error) {
      console.error('Custom token creation failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Get user by UID
  async getUserByUid(uid) {
    try {
      const userRecord = await auth.getUser(uid);
      return { success: true, userRecord };
    } catch (error) {
      console.error('Get user by UID failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Create user in Firebase Auth
  async createUser(userData) {
    try {
      const userRecord = await auth.createUser({
        email: userData.email,
        password: userData.password,
        displayName: `${userData.firstName} ${userData.lastName}`,
        emailVerified: false
      });
      return { success: true, userRecord };
    } catch (error) {
      console.error('Create Firebase user failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Update user in Firebase Auth
  async updateUser(uid, updateData) {
    try {
      const userRecord = await auth.updateUser(uid, updateData);
      return { success: true, userRecord };
    } catch (error) {
      console.error('Update Firebase user failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Delete user from Firebase Auth
  async deleteUser(uid) {
    try {
      await auth.deleteUser(uid);
      return { success: true };
    } catch (error) {
      console.error('Delete Firebase user failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Send email verification
  async sendEmailVerification(uid) {
    try {
      const actionCodeSettings = {
        url: `${process.env.FRONTEND_URL}/verify-email`,
        handleCodeInApp: true
      };
      
      const link = await auth.generateEmailVerificationLink(
        (await auth.getUser(uid)).email,
        actionCodeSettings
      );
      
      return { success: true, link };
    } catch (error) {
      console.error('Send email verification failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Send password reset email
  async sendPasswordResetEmail(email) {
    try {
      const actionCodeSettings = {
        url: `${process.env.FRONTEND_URL}/reset-password`,
        handleCodeInApp: true
      };
      
      const link = await auth.generatePasswordResetLink(email, actionCodeSettings);
      
      return { success: true, link };
    } catch (error) {
      console.error('Send password reset email failed:', error);
      return { success: false, error: error.message };
    }
  }
};

// Database utilities
const dbUtils = {
  // Get user from Firestore by Firebase UID
  async getUserByFirebaseUid(firebaseUid) {
    try {
      const userQuery = await db.collection(collections.USERS)
        .where('firebaseUid', '==', firebaseUid)
        .get();
      
      if (userQuery.empty) {
        return { success: false, error: 'User not found' };
      }
      
      const userDoc = userQuery.docs[0];
      return { 
        success: true, 
        user: { id: userDoc.id, ...userDoc.data() } 
      };
    } catch (error) {
      console.error('Get user by Firebase UID failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Create or update user session
  async createUserSession(userId, sessionData) {
    try {
      const sessionRef = await db.collection(collections.USER_SESSIONS).add({
        userId,
        ...sessionData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      
      return { success: true, sessionId: sessionRef.id };
    } catch (error) {
      console.error('Create user session failed:', error);
      return { success: false, error: error.message };
    }
  },

  // Clean up expired sessions
  async cleanupExpiredSessions() {
    try {
      const expiredSessions = await db.collection(collections.USER_SESSIONS)
        .where('expiresAt', '<', new Date().toISOString())
        .get();
      
      const batch = db.batch();
      expiredSessions.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      return { success: true, deletedCount: expiredSessions.docs.length };
    } catch (error) {
      console.error('Cleanup expired sessions failed:', error);
      return { success: false, error: error.message };
    }
  }
};

module.exports = {
  admin,
  db,
  auth,
  collections,
  firebaseAuth,
  dbUtils
};
