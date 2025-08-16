// server/scripts/createFirebaseBucket.js
const admin = require('firebase-admin');
const path = require('path');

// Load environment variables từ root directory
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function createFirebaseBucket() {
  try {
    console.log('🔧 [BUCKET CREATION] Starting Firebase Storage bucket creation...');
    
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const bucketName = `${projectId}.appspot.com`;
    
    console.log('📋 [BUCKET CREATION] Project ID:', projectId);
    console.log('🪣 [BUCKET CREATION] Target bucket name:', bucketName);
    
    // Khởi tạo Firebase Admin nếu chưa khởi tạo
    if (!admin.apps.length) {
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
      };

      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: bucketName
      });
      
      console.log('✅ [BUCKET CREATION] Firebase Admin initialized');
    }

    const storage = admin.storage();
    const bucket = storage.bucket(bucketName);
    
    console.log('🔍 [BUCKET CREATION] Checking if bucket exists...');

    try {
      // Thử tạo một file test để trigger bucket creation
      const testFile = bucket.file('test/bucket-creation-test.txt');
      const testContent = `Bucket creation test at ${new Date().toISOString()}`;
      
      console.log('📤 [BUCKET CREATION] Attempting to create test file...');
      
      await testFile.save(testContent, {
        metadata: {
          contentType: 'text/plain'
        }
      });
      
      console.log('✅ [BUCKET CREATION] Test file created successfully!');
      console.log('🎉 [BUCKET CREATION] Firebase Storage bucket is ready!');
      
      // Xóa file test
      await testFile.delete();
      console.log('🗑️ [BUCKET CREATION] Test file cleaned up');
      
      return bucketName;
      
    } catch (error) {
      if (error.code === 404 || error.message.includes('does not exist')) {
        console.log('❌ [BUCKET CREATION] Bucket does not exist');
        console.log('📝 [BUCKET CREATION] Manual steps required:');
        console.log('   1. Go to Firebase Console: https://console.firebase.google.com/');
        console.log('   2. Select project: factcheck-1d6e8');
        console.log('   3. Navigate to Storage in the left sidebar');
        console.log('   4. Click "Get started" button');
        console.log('   5. Choose "Start in production mode"');
        console.log('   6. Select a location (recommend: us-central1 or asia-southeast1)');
        console.log('   7. Click "Done"');
        console.log('\n🔗 Direct link: https://console.firebase.google.com/project/factcheck-1d6e8/storage');
        
        throw new Error('Firebase Storage not enabled. Please enable it manually in Firebase Console.');
      } else {
        throw error;
      }
    }

  } catch (error) {
    console.error('💥 [BUCKET CREATION] Error:', error.message);
    throw error;
  }
}

// Chạy nếu được gọi trực tiếp
if (require.main === module) {
  createFirebaseBucket()
    .then(bucketName => {
      console.log(`\n� [SUCCESS] Firebase Storage bucket ready: ${bucketName}`);
      console.log('🔗 [INFO] You can now upload files to this bucket');
      process.exit(0);
    })
    .catch(error => {
      console.error('💀 [FAILED] Bucket creation failed');
      process.exit(1);
    });
}

module.exports = { createFirebaseBucket };
