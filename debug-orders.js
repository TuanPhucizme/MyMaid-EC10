// Debug script để kiểm tra orders trong Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, orderBy, where } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBaa-Ea1fyaXg-jsRGdODbC8SVxBxHvPiU",
  authDomain: "my-maid-82d5e.firebaseapp.com",
  projectId: "my-maid-82d5e",
  storageBucket: "my-maid-82d5e.firebasestorage.app",
  messagingSenderId: "328007691262",
  appId: "1:328007691262:web:ef58eeabe5da04913aaeaf",
  measurementId: "G-RGBCE3GJ8N"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function debugOrders() {
  try {
    console.log('🔍 Debugging orders collection...');
    
    // 1. Lấy tất cả orders
    console.log('\n1. Getting all orders...');
    const allOrdersQuery = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const allOrdersSnapshot = await getDocs(allOrdersQuery);
    
    console.log(`📊 Total orders found: ${allOrdersSnapshot.size}`);
    
    if (allOrdersSnapshot.size > 0) {
      allOrdersSnapshot.forEach((doc, index) => {
        const data = doc.data();
        console.log(`\n📋 Order ${index + 1}:`);
        console.log(`   ID: ${doc.id}`);
        console.log(`   User ID: ${data.userId}`);
        console.log(`   Status: ${data.status}`);
        console.log(`   Created: ${data.createdAt?.toDate?.() || data.createdAt}`);
        console.log(`   Service: ${data.service?.name || 'N/A'}`);
        console.log(`   Payment Amount: ${data.payment?.amount || 'N/A'}`);
      });
    }
    
    // 2. Kiểm tra với userId cụ thể (thay bằng userId thực tế)
    console.log('\n2. Testing with specific userId...');
    const testUserId = 'IueWDlZHFBbIRj6nxB6NppwKX7A3'; // Thay bằng userId thực tế
    
    const userOrdersQuery = query(
      collection(db, 'orders'),
      where('userId', '==', testUserId),
      orderBy('createdAt', 'desc')
    );
    
    const userOrdersSnapshot = await getDocs(userOrdersQuery);
    console.log(`📊 Orders for user ${testUserId}: ${userOrdersSnapshot.size}`);
    
    userOrdersSnapshot.forEach((doc, index) => {
      const data = doc.data();
      console.log(`\n📋 User Order ${index + 1}:`);
      console.log(`   ID: ${doc.id}`);
      console.log(`   Status: ${data.status}`);
      console.log(`   Created: ${data.createdAt?.toDate?.() || data.createdAt}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

debugOrders();
