const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { db } = require('../config/firebaseAdmin');

async function fixAllVNPayOrders() {
  console.log('🔧 Fixing all VNPay orders stuck in pending_payment...');
  
  try {
    // Lấy tất cả orders VNPay đang pending_payment
    const ordersSnapshot = await db.collection('orders')
      .where('status', '==', 'pending_payment')
      .where('payment.method', '==', 'vnpay')
      .get();
    
    console.log(`📊 Found ${ordersSnapshot.size} VNPay orders stuck in pending_payment`);
    
    if (ordersSnapshot.empty) {
      console.log('✅ No orders to fix');
      return;
    }
    
    const batch = db.batch();
    let fixedCount = 0;
    
    console.log('\n📋 Orders to be fixed:');
    
    ordersSnapshot.forEach(doc => {
      const orderData = doc.data();
      const displayId = '#' + doc.id.slice(-8);
      const createdAt = orderData.createdAt?.toDate?.() || new Date(orderData.createdAt);
      
      console.log(`   ${displayId} - ${orderData.service?.name} - ${orderData.payment?.amount?.toLocaleString()} VND - ${createdAt.toISOString()}`);
      
      const orderRef = db.collection('orders').doc(doc.id);
      
      // Tạo status history entry mới
      const newStatusHistory = [...(orderData.statusHistory || []), {
        status: 'confirmed',
        timestamp: new Date(),
        note: 'Thanh toán VNPay thành công - Cập nhật hàng loạt sau khi xác nhận với users'
      }];
      
      // Cập nhật order
      batch.update(orderRef, {
        status: 'confirmed',
        'payment.status': 'completed',
        'payment.paidAt': new Date(),
        'payment.vnpayTransactionId': 'BATCH_FIX_' + Date.now() + '_' + fixedCount,
        'payment.vnpayResponseCode': '00',
        'payment.vnpayBankCode': 'BATCH_FIX',
        statusHistory: newStatusHistory,
        updatedAt: new Date(),
        // Thêm note về việc fix hàng loạt
        batchFix: {
          fixedAt: new Date(),
          reason: 'VNPay IPN callback không hoạt động - Cập nhật hàng loạt sau khi xác nhận với users',
          fixedBy: 'admin_batch_script',
          batchId: 'VNPAY_FIX_' + Date.now()
        }
      });
      
      fixedCount++;
    });
    
    if (fixedCount > 0) {
      console.log(`\n🔧 Applying batch update for ${fixedCount} orders...`);
      await batch.commit();
      console.log(`✅ Successfully updated ${fixedCount} orders to confirmed status`);
    }
    
    // Hiển thị thống kê sau khi cập nhật
    console.log('\n📊 Updated statistics:');
    const allOrdersSnapshot = await db.collection('orders').get();
    const ordersByStatus = {};
    const vnpayOrdersByStatus = {};
    
    allOrdersSnapshot.forEach(doc => {
      const data = doc.data();
      const status = data.status;
      ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
      
      if (data.payment?.method === 'vnpay') {
        vnpayOrdersByStatus[status] = (vnpayOrdersByStatus[status] || 0) + 1;
      }
    });
    
    console.log('\n   All Orders:');
    Object.entries(ordersByStatus).forEach(([status, count]) => {
      console.log(`     ${status}: ${count}`);
    });
    
    console.log('\n   VNPay Orders:');
    Object.entries(vnpayOrdersByStatus).forEach(([status, count]) => {
      console.log(`     ${status}: ${count}`);
    });
    
    console.log('\n🎉 Batch fix completed successfully!');
    console.log('📝 Next steps:');
    console.log('   1. Deploy the updated payment.js with IPN URL fix');
    console.log('   2. Test new VNPay payments to ensure IPN works');
    console.log('   3. Monitor payment flow for future orders');
    console.log('   4. Users should now see correct order status in /my-orders');
    
  } catch (error) {
    console.error('❌ Error fixing orders:', error);
    throw error;
  }
}

fixAllVNPayOrders()
  .then(() => {
    console.log('\n✅ All VNPay orders fixed successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Batch fix failed:', err);
    process.exit(1);
  });
