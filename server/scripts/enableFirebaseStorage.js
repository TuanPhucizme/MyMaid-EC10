// server/scripts/enableFirebaseStorage.js
const admin = require('firebase-admin');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Import Firebase config (đã khởi tạo admin)
require('../config/firebaseAdmin');

async function enableFirebaseStorage() {
  try {
    console.log('🔧 [STORAGE ENABLE] Attempting to enable Firebase Storage...');
    
    const bucketName = `${process.env.FIREBASE_PROJECT_ID}.appspot.com`;
    console.log('🪣 [STORAGE ENABLE] Target bucket:', bucketName);
    
    // Thử access bucket để trigger tạo tự động
    const storage = admin.storage();
    const bucket = storage.bucket(bucketName);
    
    console.log('📋 [STORAGE ENABLE] Testing bucket access...');
    
    // Thử tạo một file test để trigger bucket creation
    const testFile = bucket.file('_test/enable-storage.txt');
    
    await testFile.save('Firebase Storage enabled successfully!', {
      metadata: {
        contentType: 'text/plain'
      }
    });
    
    console.log('✅ [STORAGE ENABLE] Test file uploaded successfully');
    
    // Xóa file test
    await testFile.delete();
    console.log('🗑️ [STORAGE ENABLE] Test file cleaned up');
    
    console.log('🎉 [STORAGE ENABLE] Firebase Storage is now enabled and accessible!');
    
    return bucketName;
    
  } catch (error) {
    console.error('💥 [STORAGE ENABLE] Error:', error.message);
    
    if (error.code === 404) {
      console.log('📝 [STORAGE ENABLE] Bucket does not exist. Please:');
      console.log('   1. Go to Firebase Console: https://console.firebase.google.com/');
      console.log(`   2. Select project: ${process.env.FIREBASE_PROJECT_ID}`);
      console.log('   3. Go to Storage section');
      console.log('   4. Click "Get Started" to enable Firebase Storage');
      console.log('   5. Choose production mode and location');
    }
    
    throw error;
  }
}

// Chạy nếu được gọi trực tiếp
if (require.main === module) {
  enableFirebaseStorage()
    .then(bucketName => {
      console.log(`\n🎯 [SUCCESS] Storage enabled for: ${bucketName}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('💀 [FAILED] Storage enable failed');
      process.exit(1);
    });
}

module.exports = { enableFirebaseStorage };
