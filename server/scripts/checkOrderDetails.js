const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { db } = require('../config/firebaseAdmin');

async function checkOrderDetails() {
  console.log('🔍 Checking specific order details...');
  
  try {
    // Lấy một order có status pending_payment để kiểm tra
    const ordersSnapshot = await db.collection('orders')
      .where('status', '==', 'pending_payment')
      .limit(5)
      .get();
    
    console.log(`📊 Found ${ordersSnapshot.size} orders with pending_payment status`);
    
    ordersSnapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`\n📋 Order ${index + 1} (${doc.id}):`);
      console.log(`   Status: ${data.status}`);
      console.log(`   User ID: ${data.userId}`);
      console.log(`   Service: ${data.service?.name}`);
      console.log(`   Amount: ${data.payment?.amount?.toLocaleString()} VND`);
      console.log(`   Payment Method: ${data.payment?.method}`);
      console.log(`   Payment Status: ${data.payment?.status}`);
      console.log(`   VNPay Order ID: ${data.payment?.vnpayOrderId || 'N/A'}`);
      console.log(`   VNPay Transaction ID: ${data.payment?.vnpayTransactionId || 'N/A'}`);
      console.log(`   Paid At: ${data.payment?.paidAt || 'N/A'}`);
      console.log(`   Created At: ${data.createdAt?.toDate?.() || data.createdAt}`);
      
      // Kiểm tra status history
      console.log(`   Status History (${data.statusHistory?.length || 0} entries):`);
      if (data.statusHistory && data.statusHistory.length > 0) {
        data.statusHistory.forEach((entry, i) => {
          console.log(`     ${i + 1}. ${entry.status} - ${entry.note} (${entry.timestamp?.toDate?.() || entry.timestamp})`);
        });
      } else {
        console.log(`     No status history found`);
      }
    });
    
    // Kiểm tra orders đã thanh toán thành công
    console.log('\n🔍 Checking orders with confirmed/completed status...');
    const paidOrdersSnapshot = await db.collection('orders')
      .where('status', 'in', ['confirmed', 'completed', 'pending_confirmation'])
      .limit(3)
      .get();
    
    console.log(`📊 Found ${paidOrdersSnapshot.size} orders with paid status`);
    
    paidOrdersSnapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`\n✅ Paid Order ${index + 1} (${doc.id}):`);
      console.log(`   Status: ${data.status}`);
      console.log(`   Payment Status: ${data.payment?.status}`);
      console.log(`   VNPay Transaction ID: ${data.payment?.vnpayTransactionId || 'N/A'}`);
      console.log(`   Paid At: ${data.payment?.paidAt?.toDate?.() || data.payment?.paidAt || 'N/A'}`);
    });
    
    console.log('\n✅ Order details check completed!');
    
  } catch (error) {
    console.error('❌ Error checking order details:', error);
    throw error;
  }
}

checkOrderDetails()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Check failed:', err);
    process.exit(1);
  });
