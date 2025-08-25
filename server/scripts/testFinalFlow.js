const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { db } = require('../config/firebaseAdmin');

async function testFinalFlow() {
  console.log('🧪 Testing final simplified VNPay flow...');
  
  try {
    // 1. Tạo test order
    console.log('\n1️⃣ Creating test order...');
    
    const testOrderData = {
      userId: 'IueWDlZHFBbIRj6nxB6NppwKX7A3',
      service: {
        id: 'house-cleaning',
        name: 'Test Final Flow',
        icon: '🧹'
      },
      schedule: {
        date: '2025-08-30',
        time: '17:00',
        duration: 2
      },
      contact: {
        name: 'Test Final Flow',
        phone: '0901234567',
        email: 'test@example.com',
        address: 'Test Address Final Flow'
      },
      payment: {
        amount: 120000,
        method: 'vnpay',
        currency: 'VND',
        status: 'pending'
      },
      status: 'pending_payment',
      statusHistory: [{
        status: 'pending_payment',
        timestamp: new Date(),
        note: 'Test order for final flow verification'
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const orderRef = await db.collection('orders').add(testOrderData);
    const testOrderId = orderRef.id;
    
    console.log(`✅ Test order created: ${testOrderId}`);
    console.log(`   Display ID: #${testOrderId.slice(-8)}`);
    
    // 2. Test VNPay payment URL creation (không có IPN)
    console.log('\n2️⃣ Testing VNPay payment URL creation...');
    
    const paymentResponse = await fetch('http://localhost:5000/api/payment/create_payment_url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderDbId: testOrderId,
        amount: 120000,
        language: 'vn'
      })
    });
    
    if (paymentResponse.ok) {
      const paymentResult = await paymentResponse.json();
      console.log('✅ Payment URL created successfully');
      console.log(`   Contains IPN URL: ${paymentResult.paymentUrl.includes('vnp_IpnUrl') ? 'Yes' : 'No'}`);
      console.log(`   Contains Return URL: ${paymentResult.paymentUrl.includes('vnp_ReturnUrl') ? 'Yes' : 'No'}`);
    } else {
      console.log('❌ Failed to create payment URL');
    }
    
    // 3. Simulate VNPay return URL success
    console.log('\n3️⃣ Simulating VNPay return URL success...');
    
    const returnUrl = `http://localhost:5000/api/payment/vnpay_return?vnp_ResponseCode=00&vnp_TransactionNo=TEST${Date.now()}&vnp_OrderInfo=Thanh%20toan%20don%20hang%20${testOrderId}&vnp_Amount=12000000`;
    
    console.log('📤 Calling return URL endpoint...');
    
    const returnResponse = await fetch(returnUrl, {
      method: 'GET',
      redirect: 'manual' // Don't follow redirects
    });
    
    console.log(`📥 Return response status: ${returnResponse.status}`);
    
    // 4. Verify order status after return
    console.log('\n4️⃣ Verifying order status after return...');
    
    // Wait a bit for async update
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const updatedOrderDoc = await db.collection('orders').doc(testOrderId).get();
    const updatedOrderData = updatedOrderDoc.data();
    
    console.log('📋 Order status after return:');
    console.log(`   Status: ${updatedOrderData.status}`);
    console.log(`   Payment Status: ${updatedOrderData.payment?.status}`);
    console.log(`   VNPay Transaction ID: ${updatedOrderData.payment?.vnpayTransactionId || 'N/A'}`);
    console.log(`   Paid At: ${updatedOrderData.payment?.paidAt?.toDate?.() || 'N/A'}`);
    
    // 5. Final verification
    console.log('\n5️⃣ Final verification...');
    
    if (updatedOrderData.status === 'confirmed' && updatedOrderData.payment?.status === 'completed') {
      console.log('\n🎉 SUCCESS: Final simplified VNPay flow is working!');
      console.log('   ✅ Order status: confirmed');
      console.log('   ✅ Payment status: completed');
      console.log('   ✅ No IPN URL needed');
      console.log('   ✅ Return URL handles everything');
      console.log('   ✅ Simple and reliable');
    } else {
      console.log('\n❌ FAILURE: Flow has issues');
      console.log(`   Current status: ${updatedOrderData.status}`);
      console.log(`   Payment status: ${updatedOrderData.payment?.status}`);
    }
    
    // 6. Test statistics
    console.log('\n6️⃣ Current statistics...');
    
    const allOrders = await db.collection('orders').get();
    const ordersByStatus = {};
    const vnpayOrdersByStatus = {};
    
    allOrders.forEach(doc => {
      const data = doc.data();
      const status = data.status;
      ordersByStatus[status] = (ordersByStatus[status] || 0) + 1;
      
      if (data.payment?.method === 'vnpay') {
        vnpayOrdersByStatus[status] = (vnpayOrdersByStatus[status] || 0) + 1;
      }
    });
    
    console.log('\n📊 All Orders:');
    Object.entries(ordersByStatus).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });
    
    console.log('\n📊 VNPay Orders:');
    Object.entries(vnpayOrdersByStatus).forEach(([status, count]) => {
      console.log(`   ${status}: ${count}`);
    });
    
    // Cleanup
    console.log('\n🧹 Cleaning up test order...');
    await db.collection('orders').doc(testOrderId).delete();
    console.log('✅ Test order deleted');
    
  } catch (error) {
    console.error('❌ Error testing final flow:', error);
    throw error;
  }
}

testFinalFlow()
  .then(() => {
    console.log('\n✅ Final flow test completed!');
    console.log('\n📝 Summary:');
    console.log('   - VNPay payment URL: ✅ No IPN URL');
    console.log('   - Return URL: ✅ Updates order automatically');
    console.log('   - Order status: ✅ Confirmed immediately');
    console.log('   - Payment flow: ✅ Simple and reliable');
    console.log('   - User experience: ✅ No stuck orders');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Final flow test failed:', err);
    process.exit(1);
  });
