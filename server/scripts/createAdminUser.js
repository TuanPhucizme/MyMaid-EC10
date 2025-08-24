const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const { db } = require('../config/firebaseAdmin');

async function createAdminUser() {
  console.log('🔧 Creating admin user...');
  
  try {
    // Admin user data
    const adminUserId = 'admin-user-uid'; // You can change this to any UID
    const adminData = {
      firstName: 'Admin',
      lastName: 'System',
      name: 'Admin System',
      email: 'admin@mymaid.com',
      role: 'admin',
      status: 'active',
      phone: '0900000000',
      address: {
        street: 'Admin Office',
        ward: 'Admin Ward',
        district: 'Admin District',
        city: 'Admin City',
        fullAddress: 'Admin Office, Admin Ward, Admin District, Admin City'
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Create admin user document
    const adminDocRef = db.collection('mm_users').doc(adminUserId);
    await adminDocRef.set(adminData, { merge: true });
    
    console.log(`✅ Admin user created with ID: ${adminUserId}`);
    console.log('📧 Email: admin@mymaid.com');
    console.log('🔑 Role: admin');
    console.log('');
    console.log('⚠️  Note: You need to create this user in Firebase Auth manually with the same email.');
    console.log('   Then you can login with this email and any password you set.');
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  }
}

// Run the script
createAdminUser()
  .then(() => {
    console.log('✅ Admin user creation completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
