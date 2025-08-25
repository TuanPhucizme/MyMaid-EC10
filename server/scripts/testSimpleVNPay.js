const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { db } = require('../config/firebaseAdmin');

async function testSimpleVNPay() {
  console.log('🧪 Testing simplified VNPay flow...');
  
  try {
    // 1. Tạo test order
    console.log('\n1️⃣ Creating test order...');
    
    const testOrderData = {
      userId: 'IueWDlZHFBbIRj6nxB6NppwKX7A3',
      service: {
        id: 'house-cleaning',
        name: 'Dọn Dẹp Nhà Cửa Test Simple',
        icon: '🧹'
      },
      schedule: {
        date: '2025-08-30',
        time: '14:00',
        duration: 2
      },
      contact: {
        name: 'Test User Simple',
        phone: '0901234567',
        email: 'test@example.com',
        address: 'Test Address Simple'
      },
      payment: {
        amount: 150000,
        method: 'vnpay',
        currency: 'VND',
        status: 'pending'
      },
      status: 'pending_payment',
      statusHistory: [{
        status: 'pending_payment',
        timestamp: new Date(),
        note: 'Test order created for simplified VNPay flow'
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const orderRef = await db.collection('orders').add(testOrderData);
    const testOrderId = orderRef.id;
    
    console.log(`✅ Test order created: ${testOrderId}`);
    console.log(`   Display ID: #${testOrderId.slice(-8)}`);
    
    // 2. Test VNPay payment URL creation
    console.log('\n2️⃣ Testing VNPay payment URL creation...');
    
    const paymentResponse = await fetch('http://localhost:5000/api/payment/create_payment_url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderDbId: testOrderId,
        amount: 150000,
        language: 'vn'
      })
    });
    
    if (paymentResponse.ok) {
      const paymentResult = await paymentResponse.json();
      console.log('✅ Payment URL created successfully');
      console.log(`   URL contains IPN: ${paymentResult.paymentUrl.includes('vnp_IpnUrl') ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Failed to create payment URL');
      const errorText = await paymentResponse.text();
      console.log('   Error:', errorText);
    }
    
    // 3. Simulate simple VNPay IPN callback
    console.log('\n3️⃣ Simulating simple VNPay IPN callback...');
    
    const ipnUrl = `http://localhost:5000/api/payment/vnpay_ipn?vnp_ResponseCode=00&vnp_TransactionNo=TEST${Date.now()}&vnp_OrderInfo=Thanh%20toan%20don%20hang%20${testOrderId}`;
    
    console.log('📤 Calling simplified IPN endpoint...');
    console.log(`   URL: ${ipnUrl}`);
    
    const ipnResponse = await fetch(ipnUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const ipnResult = await ipnResponse.json();
    console.log('📥 IPN Response:', ipnResult);
    
    // 4. Verify order status after IPN
    console.log('\n4️⃣ Verifying order status after IPN...');
    
    const updatedOrderDoc = await db.collection('orders').doc(testOrderId).get();
    const updatedOrderData = updatedOrderDoc.data();
    
    console.log('📋 Order status after IPN:');
    console.log(`   Status: ${updatedOrderData.status}`);
    console.log(`   Payment Status: ${updatedOrderData.payment?.status}`);
    console.log(`   VNPay Transaction ID: ${updatedOrderData.payment?.vnpayTransactionId || 'N/A'}`);
    console.log(`   Paid At: ${updatedOrderData.payment?.paidAt?.toDate?.() || 'N/A'}`);
    
    // 5. Final verification
    console.log('\n5️⃣ Final verification...');
    
    if (updatedOrderData.status === 'confirmed' && updatedOrderData.payment?.status === 'completed') {
      console.log('\n🎉 SUCCESS: Simplified VNPay flow is working!');
      console.log('   ✅ Order status: confirmed');
      console.log('   ✅ Payment status: completed');
      console.log('   ✅ No complex retry logic needed');
      console.log('   ✅ Simple and reliable');
    } else {
      console.log('\n❌ FAILURE: Simplified VNPay flow has issues');
      console.log(`   Current status: ${updatedOrderData.status}`);
      console.log(`   Payment status: ${updatedOrderData.payment?.status}`);
    }
    
    // Cleanup
    console.log('\n🧹 Cleaning up test order...');
    await db.collection('orders').doc(testOrderId).delete();
    console.log('✅ Test order deleted');
    
  } catch (error) {
    console.error('❌ Error testing simplified VNPay flow:', error);
    throw error;
  }
}

testSimpleVNPay()
  .then(() => {
    console.log('\n✅ Simplified VNPay flow test completed!');
    console.log('\n📝 Summary:');
    console.log('   - VNPay success (response code 00) → Order confirmed immediately');
    console.log('   - No complex signature verification');
    console.log('   - No manual status check fallback');
    console.log('   - Simple and reliable payment flow');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Simplified VNPay flow test failed:', err);
    process.exit(1);
  });
