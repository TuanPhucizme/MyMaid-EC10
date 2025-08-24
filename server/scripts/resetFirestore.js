const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { db } = require('../config/firebaseAdmin');

async function resetFirestore() {
  console.log('🧹 Resetting Firestore database...');
  console.log('⚠️  This will delete ALL data in the database!');
  
  // Danh sách các collections cần xóa
  const collectionsToDelete = [
    'mm_users',
    'orders', 
    'services',
    'system',
    '_test'
  ];
  
  try {
    for (const collectionName of collectionsToDelete) {
      console.log(`🗑️  Deleting collection: ${collectionName}`);
      
      // Lấy tất cả documents trong collection
      const snapshot = await db.collection(collectionName).get();
      
      if (snapshot.empty) {
        console.log(`   ℹ️  Collection '${collectionName}' is already empty`);
        continue;
      }
      
      console.log(`   📄 Found ${snapshot.size} documents to delete`);
      
      // Xóa từng document
      const batch = db.batch();
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`   ✅ Deleted ${snapshot.size} documents from '${collectionName}'`);
    }
    
    console.log('\n✅ Firestore reset completed successfully!');
    console.log('💡 You can now run "npm run seed" to populate with fresh data');
    
  } catch (error) {
    console.error('❌ Error resetting Firestore:', error);
    throw error;
  }
}

// Kiểm tra xem có flag --confirm không
const args = process.argv.slice(2);
const hasConfirm = args.includes('--confirm');

if (!hasConfirm) {
  console.log('⚠️  WARNING: This will delete ALL data in Firestore!');
  console.log('💡 To proceed, run: npm run reset-firestore -- --confirm');
  process.exit(0);
}

resetFirestore()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Reset failed:', err);
    process.exit(1);
  });
