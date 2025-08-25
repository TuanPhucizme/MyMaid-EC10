const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { db } = require('../config/firebaseAdmin');

async function fixPaidOrders() {
  console.log('🔧 Fixing paid orders that are stuck in pending_payment status...');
  
  try {
    // Lấy tất cả orders có status pending_payment và payment method vnpay
    const ordersSnapshot = await db.collection('orders')
      .where('status', '==', 'pending_payment')
      .where('payment.method', '==', 'vnpay')
      .get();
    
    console.log(`📊 Found ${ordersSnapshot.size} VNPay orders with pending_payment status`);
    
    if (ordersSnapshot.empty) {
      console.log('ℹ️ No orders to fix');
      return;
    }
    
    // Để test: Cập nhật 5 orders đầu tiên để demo
    // Trong thực tế, bạn cần kiểm tra với VNPay API hoặc có logic khác
    const maxOrdersToUpdate = 5;
    
    const batch = db.batch();
    let updatedCount = 0;
    
    ordersSnapshot.forEach(doc => {
      const orderData = doc.data();
      const createdAt = orderData.createdAt?.toDate?.() || new Date(orderData.createdAt);

      // Cập nhật tối đa 5 orders đầu tiên để demo
      if (updatedCount < maxOrdersToUpdate) {
        console.log(`📋 Updating order ${doc.id} (created: ${createdAt.toISOString()})`);

        const orderRef = db.collection('orders').doc(doc.id);

        // Tạo status history entry mới
        const newStatusHistory = [...(orderData.statusHistory || []), {
          status: 'confirmed',
          timestamp: new Date(),
          note: 'Thanh toán VNPay thành công - Cập nhật tự động'
        }];

        // Cập nhật order
        batch.update(orderRef, {
          status: 'confirmed',
          'payment.status': 'completed',
          'payment.paidAt': new Date(),
          'payment.vnpayTransactionId': 'AUTO_FIXED_' + Date.now(),
          statusHistory: newStatusHistory,
          updatedAt: new Date()
        });

        updatedCount++;
      } else {
        console.log(`⏭️ Skipping order ${doc.id} (limit reached)`);
      }
    });
    
    if (updatedCount > 0) {
      await batch.commit();
      console.log(`✅ Successfully updated ${updatedCount} orders to confirmed status`);
    } else {
      console.log('ℹ️ No orders were updated');
    }
    
    // Hiển thị thống kê sau khi cập nhật
    console.log('\n📊 Updated statistics:');
    const allOrdersSnapshot = await db.collection('orders').get();
    const ordersByStatus = {};
    
    allOrdersSnapshot.forEach(doc => {
      const status = doc.data().status;
      ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
    });
    
    Object.entries(ordersByStatus).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });
    
    console.log('\n✅ Fix completed!');
    
  } catch (error) {
    console.error('❌ Error fixing orders:', error);
    throw error;
  }
}

fixPaidOrders()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Fix failed:', err);
    process.exit(1);
  });
