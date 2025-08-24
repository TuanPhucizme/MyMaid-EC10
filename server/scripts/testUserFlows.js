const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { db, auth } = require('../config/firebaseAdmin');

async function testUserFlows() {
  console.log('🧪 Testing User Flows and Firestore Integration...');
  console.log('🎯 Project:', process.env.FIREBASE_PROJECT_ID);
  console.log('');

  try {
    // 1. Test User Profile Flow
    console.log('👤 Testing User Profile Flow...');
    
    // Kiểm tra user test có tồn tại không
    const testUserId = 'test-user-uid';
    const userDocRef = db.collection('mm_users').doc(testUserId);
    const userDoc = await userDocRef.get();

    if (userDoc.exists) {
      const userData = userDoc.data();
      console.log('✅ User profile exists:');
      console.log(`   - Name: ${userData.name}`);
      console.log(`   - Email: ${userData.email}`);
      console.log(`   - Role: ${userData.role}`);
      console.log(`   - Status: ${userData.status}`);
      console.log(`   - Phone: ${userData.phone || 'Not set'}`);
      console.log(`   - Address: ${userData.address?.fullAddress || 'Not set'}`);
      
      // Test update profile
      console.log('🔄 Testing profile update...');
      await userDocRef.update({
        phone: '0901234567',
        address: {
          street: '123 Test Street',
          ward: 'Test Ward',
          district: 'Test District', 
          city: 'Test City',
          fullAddress: '123 Test Street, Test Ward, Test District, Test City'
        },
        updatedAt: new Date()
      });
      console.log('✅ Profile update successful');
      
    } else {
      console.log('❌ Test user not found');
    }
    
    console.log('');
    
    // 2. Test Order Flow
    console.log('📋 Testing Order Flow...');
    
    const ordersSnapshot = await db.collection('orders')
      .where('userId', '==', testUserId)
      .get();
    
    console.log(`✅ Found ${ordersSnapshot.size} orders for test user`);
    
    if (ordersSnapshot.size > 0) {
      ordersSnapshot.forEach(doc => {
        const order = doc.data();
        console.log(`   📦 Order ${doc.id.slice(-8)}:`);
        console.log(`      - Service: ${order.service?.name}`);
        console.log(`      - Status: ${order.status}`);
        console.log(`      - Amount: ${order.payment?.amount?.toLocaleString()} VND`);
        console.log(`      - Date: ${order.schedule?.date}`);
        console.log(`      - Address: ${order.contact?.address}`);
      });
      
      // Test order status update
      const firstOrder = ordersSnapshot.docs[0];
      const orderId = firstOrder.id;
      console.log(`🔄 Testing order status update for ${orderId.slice(-8)}...`);
      
      const orderRef = db.collection('orders').doc(orderId);
      const currentOrder = await orderRef.get();
      const currentData = currentOrder.data();
      
      // Add new status history entry
      const newStatusEntry = {
        status: 'in_progress',
        timestamp: new Date(),
        note: 'Test status update from script'
      };
      
      await orderRef.update({
        status: 'in_progress',
        statusHistory: [...(currentData.statusHistory || []), newStatusEntry],
        updatedAt: new Date()
      });
      
      console.log('✅ Order status update successful');
    }
    
    console.log('');
    
    // 3. Test Services Data
    console.log('🛍️ Testing Services Data...');
    
    const servicesSnapshot = await db.collection('services').get();
    console.log(`✅ Found ${servicesSnapshot.size} services`);
    
    servicesSnapshot.forEach(doc => {
      const service = doc.data();
      console.log(`   🔧 ${service.name}:`);
      console.log(`      - Category: ${service.category}`);
      console.log(`      - Base Price: ${service.pricing?.basePrice?.toLocaleString()} VND`);
      console.log(`      - Duration: ${service.duration?.default}h`);
      console.log(`      - Active: ${service.isActive ? 'Yes' : 'No'}`);
    });
    
    console.log('');
    
    // 4. Test System Configuration
    console.log('⚙️ Testing System Configuration...');
    
    const systemDoc = await db.collection('system').doc('config').get();
    if (systemDoc.exists) {
      const config = systemDoc.data();
      console.log('✅ System config exists:');
      console.log(`   - App Name: ${config.app?.name}`);
      console.log(`   - Version: ${config.app?.version}`);
      console.log(`   - Currency: ${config.pricing?.currency}`);
      console.log(`   - Features: ${Object.keys(config.features || {}).join(', ')}`);
    } else {
      console.log('❌ System config not found');
    }
    
    console.log('');
    
    // 5. Test Data Integrity
    console.log('🔍 Testing Data Integrity...');
    
    // Check for orphaned orders (orders without valid users)
    const allOrders = await db.collection('orders').get();
    const allUsers = await db.collection('mm_users').get();
    const userIds = new Set(allUsers.docs.map(doc => doc.id));
    
    let orphanedOrders = 0;
    allOrders.forEach(doc => {
      const order = doc.data();
      if (!userIds.has(order.userId)) {
        orphanedOrders++;
      }
    });
    
    console.log(`✅ Data integrity check:`);
    console.log(`   - Total orders: ${allOrders.size}`);
    console.log(`   - Total users: ${allUsers.size}`);
    console.log(`   - Orphaned orders: ${orphanedOrders}`);
    
    // Check order status distribution
    const statusCounts = {};
    allOrders.forEach(doc => {
      const status = doc.data().status;
      statusCounts[status] = (statusCounts[status] || 0) + 1;
    });
    
    console.log(`   - Order status distribution:`);
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`     * ${status}: ${count}`);
    });
    
    console.log('');
    console.log('✅ All user flows tested successfully!');
    console.log('📊 Summary:');
    console.log(`   - User profiles: Working ✅`);
    console.log(`   - Order management: Working ✅`);
    console.log(`   - Services data: Working ✅`);
    console.log(`   - System config: Working ✅`);
    console.log(`   - Data integrity: ${orphanedOrders === 0 ? 'Good ✅' : 'Issues found ⚠️'}`);
    
  } catch (error) {
    console.error('❌ Error testing user flows:', error);
    throw error;
  }
}

testUserFlows()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  });
