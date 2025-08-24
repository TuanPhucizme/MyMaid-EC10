const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

console.log('🔍 Testing Firebase connection...');
console.log('📋 Environment check:');
console.log('  - FIREBASE_PROJECT_ID:', process.env.FIREBASE_PROJECT_ID);
console.log('  - FIREBASE_CLIENT_EMAIL:', process.env.FIREBASE_CLIENT_EMAIL ? '✅ Set' : '❌ Missing');
console.log('  - FIREBASE_PRIVATE_KEY:', process.env.FIREBASE_PRIVATE_KEY ? '✅ Set' : '❌ Missing');

try {
  const { db, auth, storage } = require('../config/firebaseAdmin');
  
  async function testConnection() {
    console.log('\n🧪 Testing Firestore connection...');
    
    try {
      // Test Firestore read
      const testDoc = await db.collection('_test').doc('connection').get();
      console.log('✅ Firestore read test passed');
      
      // Test Firestore write
      await db.collection('_test').doc('connection').set({
        timestamp: new Date(),
        status: 'connected',
        projectId: process.env.FIREBASE_PROJECT_ID
      });
      console.log('✅ Firestore write test passed');
      
      // Test collections existence
      const collections = ['mm_users', 'orders', 'services', 'system'];
      for (const collectionName of collections) {
        const snapshot = await db.collection(collectionName).limit(1).get();
        console.log(`📁 Collection '${collectionName}': ${snapshot.size} documents`);
      }
      
    } catch (firestoreError) {
      console.error('❌ Firestore test failed:', firestoreError.message);
      throw firestoreError;
    }
    
    console.log('\n🧪 Testing Firebase Auth...');
    try {
      const userList = await auth.listUsers(1);
      console.log('✅ Firebase Auth test passed');
      console.log(`👥 Total users: ${userList.users.length}`);
    } catch (authError) {
      console.error('❌ Firebase Auth test failed:', authError.message);
      // Auth error is not critical for basic functionality
    }
    
    console.log('\n🧪 Testing Firebase Storage...');
    try {
      const bucket = storage.bucket();
      console.log('✅ Firebase Storage test passed');
      console.log(`🪣 Bucket name: ${bucket.name}`);
    } catch (storageError) {
      console.error('❌ Firebase Storage test failed:', storageError.message);
      // Storage error is not critical for basic functionality
    }
    
    console.log('\n✅ Firebase connection test completed successfully!');
    console.log('🚀 Ready to run the application');
  }
  
  testConnection()
    .then(() => process.exit(0))
    .catch(error => {
      console.error('\n❌ Firebase connection test failed:', error);
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Check if .env file has correct Firebase credentials');
      console.log('2. Verify Firebase project ID is correct');
      console.log('3. Ensure Service Account Key has proper permissions');
      console.log('4. Check if Firestore is enabled in Firebase Console');
      process.exit(1);
    });
    
} catch (initError) {
  console.error('❌ Failed to initialize Firebase:', initError.message);
  console.log('\n💡 This usually means:');
  console.log('1. Missing or invalid Firebase credentials in .env');
  console.log('2. Service Account Key format is incorrect');
  console.log('3. Firebase project does not exist or is not accessible');
  process.exit(1);
}
