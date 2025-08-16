// server/scripts/listBuckets.js
const { Storage } = require('@google-cloud/storage');
const admin = require('firebase-admin');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

async function listBuckets() {
  try {
    console.log('🔍 [BUCKET LIST] Checking available storage buckets...');
    
    // Initialize với project credentials
    const storage = new Storage({
      projectId: process.env.FIREBASE_PROJECT_ID,
      // Sử dụng service account key từ environment
      credentials: {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
      }
    });

    // List all buckets trong project
    const [buckets] = await storage.getBuckets();
    
    console.log(`✅ [BUCKET LIST] Found ${buckets.length} buckets:`);
    
    for (const bucket of buckets) {
      console.log(`  - ${bucket.name}`);
      
      try {
        const [metadata] = await bucket.getMetadata();
        console.log(`    Location: ${metadata.location}`);
        console.log(`    Storage class: ${metadata.storageClass}`);
        console.log(`    Created: ${metadata.timeCreated}`);
      } catch (error) {
        console.log(`    Error getting metadata: ${error.message}`);
      }
    }

    return buckets.map(bucket => bucket.name);
    
  } catch (error) {
    console.error('💥 [BUCKET LIST] Error:', error.message);
    throw error;
  }
}

// Chạy nếu được gọi trực tiếp
if (require.main === module) {
  listBuckets()
    .then(buckets => {
      console.log(`\n🎯 [RESULT] Available buckets: ${buckets.join(', ')}`);
      process.exit(0);
    })
    .catch(error => {
      console.error('💀 [RESULT] Failed to list buckets:', error);
      process.exit(1);
    });
}

module.exports = { listBuckets };
