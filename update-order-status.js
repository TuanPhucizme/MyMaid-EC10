// Script để update status của order từ pending_payment thành pending_confirmation
const admin = require('firebase-admin');

// Khởi tạo Firebase Admin
if (!admin.apps.length) {
  const serviceAccount = require('./config/serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

async function updateOrderStatus() {
  try {
    console.log('🔍 Finding orders with pending_payment status...');
    
    const ordersRef = db.collection('orders');
    const snapshot = await ordersRef.where('status', '==', 'pending_payment').get();
    
    console.log(`📊 Found ${snapshot.size} orders with pending_payment status`);
    
    if (snapshot.size === 0) {
      console.log('ℹ️ No orders to update');
      return;
    }
    
    const batch = db.batch();
    
    snapshot.forEach(doc => {
      const orderRef = ordersRef.doc(doc.id);
      const data = doc.data();
      
      console.log(`📋 Updating order ${doc.id} from pending_payment to pending_confirmation`);
      
      // Update status và statusHistory
      const newStatusHistory = [...(data.statusHistory || []), {
        status: 'pending_confirmation',
        timestamp: new Date(),
        note: 'Thanh toán thành công, chờ xác nhận'
      }];
      
      batch.update(orderRef, {
        status: 'pending_confirmation',
        statusHistory: newStatusHistory,
        updatedAt: new Date()
      });
    });
    
    await batch.commit();
    console.log('✅ Successfully updated all orders');
    
  } catch (error) {
    console.error('❌ Error updating orders:', error);
  }
  
  process.exit(0);
}

updateOrderStatus();
