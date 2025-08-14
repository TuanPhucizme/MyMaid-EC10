// server/scripts/testFirebaseStorage.js
const { storage } = require('../config/firebaseAdmin');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function testFirebaseStorage() {
  console.log('🧪 [STORAGE TEST] Starting Firebase Storage connection test...');
  
  const bucketNames = [
    'factcheck-1d6e8.firebasestorage.app',
    'factcheck-1d6e8.appspot.com',
    `${process.env.FIREBASE_PROJECT_ID}.firebasestorage.app`,
    `${process.env.FIREBASE_PROJECT_ID}.appspot.com`
  ];

  for (const bucketName of bucketNames) {
    try {
      console.log(`\n🔍 [STORAGE TEST] Testing bucket: ${bucketName}`);
      
      const bucket = storage.bucket(bucketName);
      
      // Test 1: Get bucket metadata
      try {
        const [metadata] = await bucket.getMetadata();
        console.log(`✅ [STORAGE TEST] Bucket metadata retrieved successfully`);
        console.log(`   - Location: ${metadata.location}`);
        console.log(`   - Storage class: ${metadata.storageClass}`);
      } catch (error) {
        console.log(`❌ [STORAGE TEST] Cannot get metadata: ${error.message}`);
        continue;
      }

      // Test 2: Test upload permission
      try {
        const testFileName = `test-upload-${Date.now()}.txt`;
        const testFile = bucket.file(testFileName);
        
        await testFile.save('Test content for upload permission', {
          metadata: { contentType: 'text/plain' }
        });
        
        console.log(`✅ [STORAGE TEST] Upload test successful`);
        
        // Clean up test file
        await testFile.delete();
        console.log(`🗑️ [STORAGE TEST] Test file cleaned up`);
        
        console.log(`🎉 [STORAGE TEST] Bucket ${bucketName} is fully functional!`);
        return bucketName; // Return first working bucket
        
      } catch (error) {
        console.log(`❌ [STORAGE TEST] Upload test failed: ${error.message}`);
      }

    } catch (error) {
      console.log(`💥 [STORAGE TEST] Critical error with ${bucketName}: ${error.message}`);
    }
  }

  console.log(`\n❌ [STORAGE TEST] No working storage bucket found!`);
  return null;
}

// Chạy test nếu được gọi trực tiếp
if (require.main === module) {
  testFirebaseStorage()
    .then(workingBucket => {
      if (workingBucket) {
        console.log(`\n🎯 [RESULT] Working bucket found: ${workingBucket}`);
        process.exit(0);
      } else {
        console.log(`\n💀 [RESULT] No working bucket found`);
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 [STORAGE TEST] Test failed:', error);
      process.exit(1);
    });
}

module.exports = { testFirebaseStorage };
