const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const crypto = require('crypto');
const querystring = require('qs');

// Test VNPay IPN endpoint
async function testVNPayIPN() {
  console.log('🧪 Testing VNPay IPN endpoint...');
  
  try {
    // Lấy một order có status pending_payment để test
    const { db } = require('../config/firebaseAdmin');
    
    const ordersSnapshot = await db.collection('orders')
      .where('status', '==', 'pending_payment')
      .where('payment.method', '==', 'vnpay')
      .limit(1)
      .get();
    
    if (ordersSnapshot.empty) {
      console.log('❌ No pending VNPay orders found for testing');
      return;
    }
    
    const testOrder = ordersSnapshot.docs[0];
    const orderData = testOrder.data();
    const orderId = testOrder.id;
    
    console.log(`📋 Testing with order: ${orderId}`);
    console.log(`💰 Amount: ${orderData.payment.amount} VND`);
    
    // Tạo mock VNPay IPN parameters
    const vnpayParams = {
      vnp_Amount: (orderData.payment.amount * 100).toString(), // VNPay amount in cents
      vnp_BankCode: 'NCB',
      vnp_BankTranNo: 'VNP14123456',
      vnp_CardType: 'ATM',
      vnp_OrderInfo: `Thanh toan don hang ${orderId}`,
      vnp_PayDate: '20250825140530',
      vnp_ResponseCode: '00', // Success code
      vnp_TmnCode: '6VGCX6IG',
      vnp_TransactionNo: '14123456',
      vnp_TransactionStatus: '00',
      vnp_TxnRef: '25140530', // VNPay order ID
      vnp_SecureHashType: 'SHA512'
    };
    
    // Tạo secure hash
    const secretKey = 'NKJVPM3E4KFJWIQSF0QTYOR5X75OIOSP';
    
    // Sort parameters (exact same as server logic)
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

    // Create signature (same as server logic)
    const signData = querystring.stringify(sortedParams, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");
    
    // Add signature to params
    const finalParams = {
      ...vnpayParams,
      vnp_SecureHash: signed
    };
    
    console.log('📤 Sending IPN request with params:');
    console.log(JSON.stringify(finalParams, null, 2));
    
    // Call IPN endpoint using http module
    const http = require('http');
    const url = require('url');

    const ipnUrl = 'http://localhost:5000/api/payment/vnpay_ipn';
    const queryString = querystring.stringify(finalParams);
    const fullUrl = `${ipnUrl}?${queryString}`;

    console.log(`🔗 IPN URL: ${fullUrl}`);

    const result = await new Promise((resolve, reject) => {
      const parsedUrl = url.parse(fullUrl);
      const options = {
        hostname: parsedUrl.hostname,
        port: parsedUrl.port,
        path: parsedUrl.path,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const req = http.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve({ error: 'Invalid JSON response', data });
          }
        });
      });

      req.on('error', (e) => {
        reject(e);
      });

      req.end();
    });

    console.log('📥 IPN Response:', result);
    
    // Verify order was updated
    const updatedOrder = await db.collection('orders').doc(orderId).get();
    const updatedData = updatedOrder.data();
    
    console.log('\n📊 Order status after IPN:');
    console.log(`   Status: ${updatedData.status}`);
    console.log(`   Payment Status: ${updatedData.payment?.status}`);
    console.log(`   VNPay Transaction ID: ${updatedData.payment?.vnpayTransactionId}`);
    console.log(`   Paid At: ${updatedData.payment?.paidAt?.toDate?.() || updatedData.payment?.paidAt}`);
    
    if (updatedData.status === 'confirmed') {
      console.log('✅ IPN test successful - Order status updated correctly!');
    } else {
      console.log('❌ IPN test failed - Order status not updated');
    }
    
  } catch (error) {
    console.error('❌ Error testing VNPay IPN:', error);
    throw error;
  }
}

testVNPayIPN()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Test failed:', err);
    process.exit(1);
  });
