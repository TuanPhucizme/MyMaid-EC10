const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { db } = require('../config/firebaseAdmin');
const crypto = require('crypto');
const querystring = require('qs');

async function testVNPayFlow() {
  console.log('🧪 Testing complete VNPay payment flow...');
  
  try {
    // 1. Tạo một test order
    console.log('\n1️⃣ Creating test order...');
    
    const testOrderData = {
      userId: 'IueWDlZHFBbIRj6nxB6NppwKX7A3',
      service: {
        id: 'house-cleaning',
        name: 'Dọn Dẹp Nhà Cửa Test',
        icon: '🧹'
      },
      schedule: {
        date: '2025-08-30',
        time: '10:00',
        duration: 2
      },
      contact: {
        name: 'Test User',
        phone: '0901234567',
        email: 'test@example.com',
        address: 'Test Address'
      },
      payment: {
        amount: 200000,
        method: 'vnpay',
        currency: 'VND',
        status: 'pending'
      },
      status: 'pending_payment',
      statusHistory: [{
        status: 'pending_payment',
        timestamp: new Date(),
        note: 'Test order created for VNPay flow testing'
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
        amount: 200000,
        language: 'vn'
      })
    });
    
    if (paymentResponse.ok) {
      const paymentResult = await paymentResponse.json();
      console.log('✅ Payment URL created successfully');
      console.log(`   URL contains IPN: ${paymentResult.paymentUrl.includes('vnp_IpnUrl') ? 'Yes' : 'No'}`);
      console.log(`   Payment URL: ${paymentResult.paymentUrl.substring(0, 200)}...`);
    } else {
      console.log('❌ Failed to create payment URL');
      const errorText = await paymentResponse.text();
      console.log('   Error:', errorText);
    }
    
    // 3. Simulate VNPay IPN callback
    console.log('\n3️⃣ Simulating VNPay IPN callback...');
    
    const vnpayParams = {
      vnp_Amount: '20000000', // 200,000 VND * 100
      vnp_BankCode: 'NCB',
      vnp_BankTranNo: 'VNP' + Date.now(),
      vnp_CardType: 'ATM',
      vnp_OrderInfo: `Thanh toan don hang ${testOrderId}`,
      vnp_PayDate: new Date().toISOString().replace(/[-:T]/g, '').slice(0, 14),
      vnp_ResponseCode: '00', // Success
      vnp_TmnCode: '6VGCX6IG',
      vnp_TransactionNo: Date.now().toString(),
      vnp_TransactionStatus: '00',
      vnp_TxnRef: Date.now().toString().slice(-8),
      vnp_SecureHashType: 'SHA512'
    };
    
    // Create signature
    function sortObject(obj) {
      let sorted = {};
      let str = [];
      let key;
      for (key in obj){
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
          str.push(encodeURIComponent(key));
        }
      }
      str.sort();
      for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
      }
      return sorted;
    }
    
    const sortedParams = sortObject(vnpayParams);
    const secretKey = 'NKJVPM3E4KFJWIQSF0QTYOR5X75OIOSP';
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    
    const finalParams = {
      ...vnpayParams,
      vnp_SecureHash: signed
    };
    
    // Call IPN endpoint
    const ipnUrl = 'http://localhost:5000/api/payment/vnpay_ipn';
    const queryString = querystring.stringify(finalParams);
    const fullUrl = `${ipnUrl}?${queryString}`;
    
    console.log('📤 Calling IPN endpoint...');
    
    const ipnResponse = await fetch(fullUrl, {
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
    
    // 5. Test manual status check endpoint
    console.log('\n5️⃣ Testing manual status check endpoint...');
    
    const statusCheckResponse = await fetch('http://localhost:5000/api/payment/check_status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        orderId: testOrderId,
        vnpayParams: {
          vnp_ResponseCode: '00',
          vnp_TransactionNo: vnpayParams.vnp_TransactionNo,
          vnp_BankCode: vnpayParams.vnp_BankCode,
          vnp_PayDate: vnpayParams.vnp_PayDate,
          vnp_Amount: vnpayParams.vnp_Amount
        }
      })
    });
    
    const statusCheckResult = await statusCheckResponse.json();
    console.log('📋 Status check result:', statusCheckResult);
    
    // 6. Final verification
    console.log('\n6️⃣ Final verification...');
    
    const finalOrderDoc = await db.collection('orders').doc(testOrderId).get();
    const finalOrderData = finalOrderDoc.data();
    
    console.log('📋 Final order status:');
    console.log(`   Status: ${finalOrderData.status}`);
    console.log(`   Payment Status: ${finalOrderData.payment?.status}`);
    
    if (finalOrderData.status === 'confirmed' && finalOrderData.payment?.status === 'completed') {
      console.log('\n🎉 SUCCESS: VNPay flow is working correctly!');
      console.log('   ✅ Order status updated to confirmed');
      console.log('   ✅ Payment marked as completed');
      console.log('   ✅ Ready for partner assignment');
    } else {
      console.log('\n❌ FAILURE: VNPay flow has issues');
      console.log('   Check IPN endpoint and signature verification');
    }
    
    // Cleanup: Delete test order
    console.log('\n🧹 Cleaning up test order...');
    await db.collection('orders').doc(testOrderId).delete();
    console.log('✅ Test order deleted');
    
  } catch (error) {
    console.error('❌ Error testing VNPay flow:', error);
    throw error;
  }
}

testVNPayFlow()
  .then(() => {
    console.log('\n✅ VNPay flow test completed!');
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ VNPay flow test failed:', err);
    process.exit(1);
  });
