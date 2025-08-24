const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { db } = require('../config/firebaseAdmin');

async function checkFirestoreData() {
  console.log('📊 Checking Firestore data...');
  console.log(`🎯 Project: ${process.env.FIREBASE_PROJECT_ID}\n`);
  
  try {
    // Kiểm tra các collections
    const collections = [
      { name: 'mm_users', description: 'Users' },
      { name: 'services', description: 'Services' },
      { name: 'orders', description: 'Orders' },
      { name: 'system', description: 'System Config' }
    ];
    
    for (const collection of collections) {
      console.log(`📁 ${collection.description} (${collection.name}):`);
      
      const snapshot = await db.collection(collection.name).get();
      
      if (snapshot.empty) {
        console.log('   📭 Empty collection');
        continue;
      }
      
      console.log(`   📄 ${snapshot.size} documents`);
      
      // Hiển thị chi tiết cho từng collection
      if (collection.name === 'mm_users') {
        snapshot.forEach(doc => {
          const data = doc.data();
          console.log(`   👤 ${doc.id}: ${data.name} (${data.role}) - ${data.status}`);
        });
      }
      
      if (collection.name === 'services') {
        snapshot.forEach(doc => {
          const data = doc.data();
          const price = data.pricing?.basePrice?.toLocaleString() || 'N/A';
          console.log(`   🛍️  ${doc.id}: ${data.name} - ${price} VND`);
        });
      }
      
      if (collection.name === 'orders') {
        snapshot.forEach(doc => {
          const data = doc.data();
          const amount = data.payment?.amount?.toLocaleString() || 'N/A';
          console.log(`   📋 ${doc.id}: ${data.service?.name} - ${data.status} - ${amount} VND`);
        });
      }
      
      if (collection.name === 'system') {
        snapshot.forEach(doc => {
          const data = doc.data();
          console.log(`   ⚙️  ${doc.id}: ${data.app?.name} v${data.app?.version}`);
        });
      }
      
      console.log('');
    }
    
    // Thống kê tổng quan
    console.log('📈 Summary:');
    const usersSnapshot = await db.collection('mm_users').get();
    const servicesSnapshot = await db.collection('services').get();
    const ordersSnapshot = await db.collection('orders').get();
    
    console.log(`   👥 Total users: ${usersSnapshot.size}`);
    console.log(`   🛍️  Total services: ${servicesSnapshot.size}`);
    console.log(`   📋 Total orders: ${ordersSnapshot.size}`);
    
    // Thống kê orders theo status
    const ordersByStatus = {};
    ordersSnapshot.forEach(doc => {
      const status = doc.data().status;
      ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
    });
    
    console.log('\n📊 Orders by status:');
    Object.entries(ordersByStatus).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });
    
    // Tính tổng doanh thu
    let totalRevenue = 0;
    ordersSnapshot.forEach(doc => {
      const amount = doc.data().payment?.amount || 0;
      if (doc.data().status === 'completed') {
        totalRevenue += amount;
      }
    });
    
    console.log(`\n💰 Total completed revenue: ${totalRevenue.toLocaleString()} VND`);
    
    console.log('\n✅ Data check completed!');
    
  } catch (error) {
    console.error('❌ Error checking data:', error);
    throw error;
  }
}

checkFirestoreData()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Check failed:', err);
    process.exit(1);
  });
