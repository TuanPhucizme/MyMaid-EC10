const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { db } = require('../config/firebaseAdmin');

async function fixSpecificOrder() {
  console.log('🔧 Fixing order #M0dcGQ8q (qQan8VUEwuhzM0dcGQ8q)...');
  
  try {
    const orderId = 'qQan8VUEwuhzM0dcGQ8q';
    
    // Lấy order hiện tại
    const orderRef = db.collection('orders').doc(orderId);
    const orderDoc = await orderRef.get();
    
    if (!orderDoc.exists) {
      console.log('❌ Order not found');
      return;
    }
    
    const orderData = orderDoc.data();
    
    console.log('📋 Current Order Status:');
    console.log(`   Status: ${orderData.status}`);
    console.log(`   Payment Status: ${orderData.payment?.status}`);
    console.log(`   Payment Method: ${orderData.payment?.method}`);
    console.log(`   Amount: ${orderData.payment?.amount?.toLocaleString()} VND`);
    console.log(`   Created: ${orderData.createdAt?.toDate?.() || orderData.createdAt}`);
    console.log(`   Schedule: ${orderData.schedule?.date} ${orderData.schedule?.time}`);
    
    // Kiểm tra xem order có phải VNPay và đang pending không
    if (orderData.status !== 'pending_payment' || orderData.payment?.method !== 'vnpay') {
      console.log('❌ Order is not in pending_payment status or not VNPay payment');
      return;
    }
    
    console.log('\n🔧 Applying fix...');
    
    // Tạo status history entry mới
    const newStatusHistory = [...(orderData.statusHistory || []), {
      status: 'confirmed',
      timestamp: new Date(),
      note: 'Thanh toán VNPay thành công - Cập nhật thủ công sau khi xác nhận với user'
    }];
    
    // Cập nhật order với thông tin thanh toán đã hoàn thành
    const updateData = {
      status: 'confirmed',
      'payment.status': 'completed',
      'payment.paidAt': new Date(),
      'payment.vnpayTransactionId': 'MANUAL_FIX_' + Date.now(),
      'payment.vnpayResponseCode': '00',
      'payment.vnpayBankCode': 'MANUAL',
      statusHistory: newStatusHistory,
      updatedAt: new Date(),
      // Thêm note về việc fix thủ công
      manualFix: {
        fixedAt: new Date(),
        reason: 'User confirmed VNPay payment completed but order stuck in pending_payment',
        fixedBy: 'admin_manual_script'
      }
    };
    
    await orderRef.update(updateData);
    
    console.log('✅ Order updated successfully!');
    
    // Verify update
    const updatedOrderDoc = await orderRef.get();
    const updatedOrderData = updatedOrderDoc.data();
    
    console.log('\n📋 Updated Order Status:');
    console.log(`   Status: ${updatedOrderData.status}`);
    console.log(`   Payment Status: ${updatedOrderData.payment?.status}`);
    console.log(`   VNPay Transaction ID: ${updatedOrderData.payment?.vnpayTransactionId}`);
    console.log(`   Paid At: ${updatedOrderData.payment?.paidAt?.toDate?.()}`);
    console.log(`   Manual Fix Applied: ${updatedOrderData.manualFix ? 'Yes' : 'No'}`);
    
    // Hiển thị status history mới
    console.log('\n📚 Updated Status History:');
    if (updatedOrderData.statusHistory && updatedOrderData.statusHistory.length > 0) {
      updatedOrderData.statusHistory.forEach((entry, index) => {
        const timestamp = entry.timestamp?.toDate?.() || entry.timestamp;
        console.log(`   ${index + 1}. ${entry.status} - ${entry.note} (${timestamp?.toISOString?.()})`);
      });
    }
    
    console.log('\n🎉 Order #M0dcGQ8q has been successfully fixed!');
    console.log('   - Status changed from "pending_payment" to "confirmed"');
    console.log('   - Payment marked as completed');
    console.log('   - Order is now ready for partner assignment');
    console.log('   - User should see the correct status in /my-orders');
    
  } catch (error) {
    console.error('❌ Error fixing order:', error);
    throw error;
  }
}

fixSpecificOrder()
  .then(() => {
    console.log('\n✅ Fix completed successfully!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Fix failed:', err);
    process.exit(1);
  });
