// server/scripts/generateTestToken.js
const admin = require('firebase-admin');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Import Firebase config
require('../config/firebaseAdmin');

async function generateTestToken() {
  try {
    console.log('🔑 [TOKEN GENERATOR] Starting test token generation...');
    
    // Sử dụng user ID từ log error trước đó
    const testUserId = 'ZyESr5wCHIfnrgQPNAHUAurC1nA2';
    
    console.log(`👤 [TOKEN GENERATOR] Generating token for user: ${testUserId}`);
    
    // Tạo custom token
    const customToken = await admin.auth().createCustomToken(testUserId);
    
    console.log(`✅ [TOKEN GENERATOR] Custom token generated successfully`);
    console.log(`🔑 [TOKEN GENERATOR] Token: ${customToken}`);
    console.log(`\n📋 [USAGE] Copy the token above and paste it into the test page.`);
    
    return customToken;
    
  } catch (error) {
    console.error('💥 [TOKEN GENERATOR] Error generating token:', error);
    throw error;
  }
}

// Chạy nếu được gọi trực tiếp
if (require.main === module) {
  generateTestToken()
    .then(token => {
      console.log(`\n🎯 [RESULT] Token ready for testing`);
      process.exit(0);
    })
    .catch(error => {
      console.error('💀 [RESULT] Token generation failed:', error);
      process.exit(1);
    });
}

module.exports = { generateTestToken };
