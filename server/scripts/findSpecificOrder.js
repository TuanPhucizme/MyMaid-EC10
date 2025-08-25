const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { db } = require('../config/firebaseAdmin');

async function findSpecificOrder() {
  console.log('🔍 Finding order with display ID #M0dcGQ8q...');
  
  try {
    // Order display ID #M0dcGQ8q là 8 ký tự cuối của Firestore document ID
    // Cần tìm order có document ID kết thúc bằng "M0dcGQ8q"
    const targetSuffix = 'M0dcGQ8q';
    
    // Lấy tất cả orders
    const ordersSnapshot = await db.collection('orders').get();
    
    console.log(`📊 Searching through ${ordersSnapshot.size} orders...`);
    
    let foundOrder = null;
    
    ordersSnapshot.forEach(doc => {
      const docId = doc.id;
      const last8Chars = docId.slice(-8);
      
      if (last8Chars === targetSuffix) {
        foundOrder = { id: docId, ...doc.data() };
        console.log(`✅ Found matching order: ${docId}`);
      }
    });
    
    if (!foundOrder) {
      console.log('❌ No order found with display ID #M0dcGQ8q');
      
      // Hiển thị một số orders gần đây để tham khảo
      console.log('\n📋 Recent orders for reference:');
      const recentOrders = [];
      ordersSnapshot.forEach(doc => {
        const data = doc.data();
        recentOrders.push({
          id: doc.id,
          displayId: '#' + doc.id.slice(-8),
          status: data.status,
          createdAt: data.createdAt?.toDate?.() || data.createdAt,
          service: data.service?.name,
          amount: data.payment?.amount
        });
      });
      
      // Sort by creation date and show latest 10
      recentOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      recentOrders.slice(0, 10).forEach((order, index) => {
        console.log(`   ${index + 1}. ${order.displayId} - ${order.service} - ${order.status} - ${order.createdAt?.toISOString?.() || order.createdAt}`);
      });
      
      return;
    }
    
    // Hiển thị chi tiết order tìm được
    console.log('\n📋 Order Details:');
    console.log(`   Full ID: ${foundOrder.id}`);
    console.log(`   Display ID: #${foundOrder.id.slice(-8)}`);
    console.log(`   Status: ${foundOrder.status}`);
    console.log(`   Service: ${foundOrder.service?.name}`);
    console.log(`   Amount: ${foundOrder.payment?.amount?.toLocaleString()} VND`);
    console.log(`   Payment Method: ${foundOrder.payment?.method}`);
    console.log(`   Payment Status: ${foundOrder.payment?.status}`);
    console.log(`   VNPay Order ID: ${foundOrder.payment?.vnpayOrderId || 'N/A'}`);
    console.log(`   VNPay Transaction ID: ${foundOrder.payment?.vnpayTransactionId || 'N/A'}`);
    console.log(`   Paid At: ${foundOrder.payment?.paidAt?.toDate?.() || foundOrder.payment?.paidAt || 'N/A'}`);
    console.log(`   Created At: ${foundOrder.createdAt?.toDate?.() || foundOrder.createdAt}`);
    console.log(`   Schedule: ${foundOrder.schedule?.date} ${foundOrder.schedule?.time}`);
    console.log(`   User ID: ${foundOrder.userId}`);
    
    // Hiển thị status history
    console.log('\n📚 Status History:');
    if (foundOrder.statusHistory && foundOrder.statusHistory.length > 0) {
      foundOrder.statusHistory.forEach((entry, index) => {
        const timestamp = entry.timestamp?.toDate?.() || entry.timestamp;
        console.log(`   ${index + 1}. ${entry.status} - ${entry.note} (${timestamp?.toISOString?.() || timestamp})`);
      });
    } else {
      console.log('   No status history found');
    }
    
    // Kiểm tra xem order này có phải là VNPay và đã thanh toán chưa
    if (foundOrder.payment?.method === 'vnpay') {
      console.log('\n🔍 VNPay Payment Analysis:');
      
      if (foundOrder.status === 'pending_payment') {
        console.log('   ❌ Order is stuck in pending_payment status');
        console.log('   💡 This order needs to be fixed');
        
        // Đề xuất fix
        console.log('\n🔧 Suggested Fix:');
        console.log('   1. Check if payment was actually completed in VNPay');
        console.log('   2. Update status to "confirmed" if payment was successful');
        console.log('   3. Add payment completion details');
        
        return foundOrder;
      } else {
        console.log('   ✅ Order status looks correct');
      }
    }
    
    return foundOrder;
    
  } catch (error) {
    console.error('❌ Error finding order:', error);
    throw error;
  }
}

findSpecificOrder()
  .then((order) => {
    if (order && order.status === 'pending_payment' && order.payment?.method === 'vnpay') {
      console.log('\n🚨 FOUND PROBLEMATIC ORDER - Ready for manual fix');
    }
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Search failed:', err);
    process.exit(1);
  });
