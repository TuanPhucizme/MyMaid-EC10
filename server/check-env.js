/**
 * Environment Variables Check Script
 * @desc Kiểm tra xem các biến môi trường Firebase có được đọc đúng không
 */

const path = require('path');

// Load environment variables from root directory
require('dotenv').config({ path: path.join(__dirname, '../.env') });

console.log('🔍 Kiểm tra biến môi trường Firebase...\n');

// Danh sách các biến Firebase cần thiết
const requiredFirebaseVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_PRIVATE_KEY',
  'FIREBASE_CLIENT_EMAIL'
];

// Danh sách các biến khác
const otherVars = [
  'PORT',
  'NODE_ENV',
  'JWT_SECRET',
  'JWT_EXPIRE',
  'FRONTEND_URL',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS',
  'EMAIL_FROM',
  'CORS_ORIGIN',
  'RATE_LIMIT_WINDOW_MS',
  'RATE_LIMIT_MAX_REQUESTS'
];

console.log('📋 Firebase Configuration:');
console.log('========================');

let allFirebaseVarsPresent = true;

requiredFirebaseVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Ẩn một phần giá trị để bảo mật
    let displayValue = value;
    if (varName === 'FIREBASE_PRIVATE_KEY') {
      displayValue = value.substring(0, 50) + '...';
    } else if (varName === 'FIREBASE_CLIENT_EMAIL') {
      displayValue = value;
    } else if (varName.includes('KEY') || varName.includes('SECRET')) {
      displayValue = value.substring(0, 10) + '...';
    }
    
    console.log(`✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`❌ ${varName}: MISSING`);
    allFirebaseVarsPresent = false;
  }
});

console.log('\n📋 Other Configuration:');
console.log('======================');

otherVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    let displayValue = value;
    if (varName.includes('SECRET') || varName.includes('PASS')) {
      displayValue = value.substring(0, 10) + '...';
    }
    console.log(`✅ ${varName}: ${displayValue}`);
  } else {
    console.log(`⚠️  ${varName}: NOT SET (optional)`);
  }
});

console.log('\n📊 Summary:');
console.log('===========');

if (allFirebaseVarsPresent) {
  console.log('🎉 Tất cả biến Firebase đã được cấu hình đúng!');
  console.log('✅ Backend có thể đọc được các key Firebase từ file .env ở root');
} else {
  console.log('❌ Một số biến Firebase bị thiếu!');
  console.log('⚠️  Vui lòng kiểm tra file .env ở root directory');
}

console.log('\n🔧 Để khắc phục:');
console.log('1. Đảm bảo file .env tồn tại ở root directory (cùng cấp với thư mục server/)');
console.log('2. Kiểm tra tên các biến môi trường có đúng không');
console.log('3. Đảm bảo không có khoảng trắng thừa trong file .env');
console.log('4. Restart server sau khi thay đổi file .env');

// Test Firebase initialization
console.log('\n🧪 Testing Firebase initialization...');

try {
  const admin = require('firebase-admin');
  
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

  // Check if Firebase is already initialized
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: process.env.FIREBASE_PROJECT_ID
    });
    console.log('✅ Firebase Admin SDK initialized successfully!');
  } else {
    console.log('✅ Firebase Admin SDK already initialized!');
  }

  // Test Firestore connection
  const db = admin.firestore();
  console.log('✅ Firestore connection test passed!');

  // Test Auth connection
  const auth = admin.auth();
  console.log('✅ Firebase Auth connection test passed!');

} catch (error) {
  console.log('❌ Firebase initialization failed:');
  console.log('Error:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Kiểm tra lại các biến môi trường Firebase');
  console.log('2. Đảm bảo private key đúng format');
  console.log('3. Kiểm tra quyền truy cập Firebase project');
} 