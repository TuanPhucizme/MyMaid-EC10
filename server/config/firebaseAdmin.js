// server/config/firebaseAdmin.js

const admin = require('firebase-admin');
const path = require('path');

// Load environment variables từ root directory
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Kiểm tra các biến môi trường Firebase cần thiết
const requiredEnvVars = [
  "FIREBASE_PROJECT_ID",
  "FIREBASE_PRIVATE_KEY",
  "FIREBASE_CLIENT_EMAIL"
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
if (missingEnvVars.length > 0) {
  throw new Error(`Missing required Firebase environment variables: ${missingEnvVars.join(', ')}`);
}

// Tạo service account object từ environment variables
const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.FIREBASE_CLIENT_EMAIL}`,
  universe_domain: "googleapis.com"
};

// Debug: Log các biến môi trường
console.log('🔍 [DEBUG] Environment variables:');
console.log('  - FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('  - REACT_APP_FIREBASE_STORAGE_BUCKET:', process.env.REACT_APP_FIREBASE_STORAGE_BUCKET);

// Sử dụng bucket default của Firebase project
const defaultBucket = `${process.env.FIREBASE_PROJECT_ID}.appspot.com`;
console.log('  - Using default Firebase Storage bucket:', defaultBucket);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: defaultBucket
});

const db = admin.firestore();
const auth = admin.auth();
const storage = admin.storage();

console.log('✅ Firebase Admin SDK initialized successfully');
console.log('🪣 [DEBUG] Storage bucket name:', storage.bucket().name);

module.exports = { db, auth, storage };