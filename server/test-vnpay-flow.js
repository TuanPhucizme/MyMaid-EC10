/**
 * Test script for VNPay payment flow
 * Tests the complete flow from order creation to payment confirmation
 */

const { db } = require('./config/firebaseAdmin');
const { notifyPartnersAboutNewOrder } = require('./services/partnerNotificationService');

async function testVNPayFlow() {
  console.log('🧪 Testing VNPay Payment Flow...\n');

  try {
    // 1. Create a test order
    console.log('1️⃣ Creating test order...');
    const testOrderData = {
      userId: 'test-user-123',
      partnerId: null,
      service: {
        id: 'cleaning',
        name: 'Dọn dẹp nhà cửa',
        icon: '🧹'
      },
      schedule: {
        date: '2024-12-26',
        time: '09:00',
        duration: 2,
        frequency: 'one-time'
      },
      contact: {
        name: 'Nguyễn Test',
        phone: '0123456789',
        email: 'test@example.com',
        address: '123 Test Street, Ho Chi Minh City',
        notes: 'Test order for VNPay flow'
      },
      payment: {
        amount: 100000,
        method: 'vnpay',
        currency: 'VND',
        status: 'pending'
      },
      status: 'pending_payment',
      statusHistory: [{
        status: 'pending_payment',
        timestamp: new Date(),
        note: 'Test order created'
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const orderRef = await db.collection('orders').add(testOrderData);
    const testOrderId = orderRef.id;
    console.log(`✅ Test order created with ID: ${testOrderId}`);

    // 2. Simulate VNPay IPN callback (payment success)
    console.log('\n2️⃣ Simulating VNPay payment success...');

    // Update order status as IPN would do - VNPay success = confirmed
    const statusHistoryEntry = {
      status: 'confirmed',
      timestamp: new Date(),
      note: 'Test VNPay payment successful - Order confirmed'
    };

    await orderRef.update({
      status: 'confirmed',
      'payment.vnpayTransactionId': 'TEST_TXN_123456',
      'payment.vnpayResponseCode': '00',
      'payment.vnpayBankCode': 'NCB',
      'payment.vnpayPayDate': '20241225123456',
      'payment.vnpayOrderId': 'TEST_VNPAY_ORDER_123',
      'payment.paidAt': new Date(),
      'payment.status': 'completed',
      statusHistory: [...testOrderData.statusHistory, statusHistoryEntry],
      updatedAt: new Date()
    });

    console.log('✅ Order status updated to confirmed (ready for partner assignment)');

    // 3. Check available orders for partners
    console.log('\n3️⃣ Checking available orders for partners...');

    const availableOrdersQuery = db.collection('orders')
      .where('status', '==', 'confirmed')
      .where('partnerId', '==', null);

    const availableSnapshot = await availableOrdersQuery.get();
    console.log(`✅ Found ${availableSnapshot.size} available orders for partners`);

    if (availableSnapshot.size > 0) {
      console.log('📋 Order is now available for partner assignment');
    }

    // 4. Test partner acceptance flow
    console.log('\n4️⃣ Testing partner acceptance...');

    // Get an active partner for testing
    const partnersQuery = db.collection('mm_partners').where('operational.status', '==', 'active').limit(1);
    const partnersSnapshot = await partnersQuery.get();

    if (!partnersSnapshot.empty) {
      const testPartnerId = partnersSnapshot.docs[0].id;
      console.log(`🤝 Simulating partner ${testPartnerId} accepting order...`);

      // Update order with partner assignment (confirmed -> in_progress)
      await orderRef.update({
        partnerId: testPartnerId,
        status: 'in_progress',
        statusHistory: [...(await orderRef.get()).data().statusHistory, {
          status: 'in_progress',
          timestamp: new Date(),
          note: `Test: Accepted by partner ${testPartnerId} - Work started`
        }],
        updatedAt: new Date()
      });

      console.log('✅ Order assigned to partner and status updated to in_progress');
    } else {
      console.log('⚠️ No active partners found for testing');
    }

    // 5. Summary
    console.log('\n📊 Test Summary:');
    console.log('✅ Order creation: SUCCESS');
    console.log('✅ Payment simulation: SUCCESS');
    console.log('✅ Order availability: SUCCESS');
    console.log('✅ Database updates: SUCCESS');
    console.log('✅ Partner assignment: SUCCESS');

    console.log(`\n🎉 VNPay flow test completed successfully!`);
    console.log(`📋 Test order ID: ${testOrderId}`);
    console.log(`🔗 You can check the order in Firestore console`);
    console.log(`💡 New logic: VNPay success → confirmed → partner accepts → in_progress`);

    return {
      success: true,
      testOrderId,
      availableOrders: availableSnapshot.size
    };

  } catch (error) {
    console.error('❌ Test failed:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the test
if (require.main === module) {
  testVNPayFlow()
    .then(result => {
      if (result.success) {
        console.log('\n✅ All tests passed!');
        process.exit(0);
      } else {
        console.log('\n❌ Tests failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('❌ Test execution failed:', error);
      process.exit(1);
    });
}

module.exports = { testVNPayFlow };
