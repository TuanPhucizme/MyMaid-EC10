// server/scripts/createStorageBucket.js
const { Storage } = require('@google-cloud/storage');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function createStorageBucket() {
  try {
    console.log('🔧 [BUCKET SETUP] Starting storage bucket creation/verification...');
    
    const storage = new Storage({
      projectId: process.env.FIREBASE_PROJECT_ID,
      keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS, // Nếu có
    });

    const bucketNames = [
      'factcheck-1d6e8.firebasestorage.app',
      'factcheck-1d6e8.appspot.com'
    ];

    for (const bucketName of bucketNames) {
      try {
        console.log(`🔍 [BUCKET SETUP] Checking bucket: ${bucketName}`);
        
        const [bucket] = await storage.bucket(bucketName).get({ autoCreate: false });
        console.log(`✅ [BUCKET SETUP] Bucket ${bucketName} exists`);
        
        // Test upload permission
        const testFile = bucket.file('test-upload.txt');
        await testFile.save('Test upload content', {
          metadata: { contentType: 'text/plain' }
        });
        await testFile.delete();
        console.log(`✅ [BUCKET SETUP] Upload permission confirmed for ${bucketName}`);
        
      } catch (error) {
        if (error.code === 404) {
          console.log(`❌ [BUCKET SETUP] Bucket ${bucketName} does not exist`);
          
          // Thử tạo bucket mới
          try {
            await storage.createBucket(bucketName, {
              location: 'us-central1',
              storageClass: 'STANDARD',
            });
            console.log(`✅ [BUCKET SETUP] Created bucket: ${bucketName}`);
          } catch (createError) {
            console.log(`❌ [BUCKET SETUP] Cannot create bucket ${bucketName}:`, createError.message);
          }
        } else {
          console.log(`⚠️ [BUCKET SETUP] Error checking ${bucketName}:`, error.message);
        }
      }
    }

    console.log('🎉 [BUCKET SETUP] Bucket setup completed');
    
  } catch (error) {
    console.error('💥 [BUCKET SETUP] Critical error:', error);
  }
}

// Chạy script nếu được gọi trực tiếp
if (require.main === module) {
  createStorageBucket();
}

module.exports = { createStorageBucket };
