#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 MyMaid-EC10 Firebase Setup Script');
console.log('=====================================\n');

// Kiểm tra file .env
const envPath = path.join(__dirname, '.env');
if (!fs.existsSync(envPath)) {
  console.error('❌ File .env không tồn tại!');
  console.log('💡 Vui lòng tạo file .env từ .env.example');
  process.exit(1);
}

// Đọc và kiểm tra các biến môi trường cần thiết
require('dotenv').config();

const requiredEnvVars = [
  'FIREBASE_PROJECT_ID',
  'FIREBASE_CLIENT_EMAIL', 
  'FIREBASE_PRIVATE_KEY',
  'REACT_APP_FIREBASE_API_KEY',
  'REACT_APP_FIREBASE_PROJECT_ID'
];

console.log('🔍 Checking environment variables...');
const missingVars = [];

requiredEnvVars.forEach(varName => {
  if (!process.env[varName]) {
    missingVars.push(varName);
    console.log(`❌ ${varName}: Missing`);
  } else {
    console.log(`✅ ${varName}: Set`);
  }
});

if (missingVars.length > 0) {
  console.error('\n❌ Missing required environment variables!');
  console.log('💡 Please update your .env file with the following variables:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n📖 See FIREBASE_NEW_PROJECT_SETUP.md for detailed instructions');
  process.exit(1);
}

console.log('\n✅ All environment variables are set!');

// Kiểm tra project ID có khớp không
if (process.env.FIREBASE_PROJECT_ID !== process.env.REACT_APP_FIREBASE_PROJECT_ID) {
  console.error('❌ Firebase Project ID mismatch!');
  console.log(`   Server: ${process.env.FIREBASE_PROJECT_ID}`);
  console.log(`   Client: ${process.env.REACT_APP_FIREBASE_PROJECT_ID}`);
  process.exit(1);
}

console.log(`🎯 Target Firebase Project: ${process.env.FIREBASE_PROJECT_ID}`);

function runCommand(command, description) {
  console.log(`\n🔧 ${description}...`);
  try {
    execSync(command, { stdio: 'inherit', cwd: __dirname });
    console.log(`✅ ${description} completed`);
  } catch (error) {
    console.error(`❌ ${description} failed:`, error.message);
    throw error;
  }
}

async function main() {
  try {
    // 1. Test Firebase connection
    runCommand('cd server && npm run test-firebase', 'Testing Firebase connection');
    
    // 2. Install dependencies if needed
    if (!fs.existsSync(path.join(__dirname, 'server/node_modules'))) {
      runCommand('cd server && npm install', 'Installing server dependencies');
    }
    
    if (!fs.existsSync(path.join(__dirname, 'client/node_modules'))) {
      runCommand('cd client && npm install', 'Installing client dependencies');
    }
    
    // 3. Reset and seed Firestore
    console.log('\n🌱 Setting up Firestore database...');
    console.log('⚠️  This will reset all data in Firestore!');
    
    // Hỏi xác nhận từ user
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    const answer = await new Promise(resolve => {
      rl.question('Continue? (y/N): ', resolve);
    });
    rl.close();
    
    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
      console.log('❌ Setup cancelled by user');
      process.exit(0);
    }
    
    runCommand('cd server && npm run fresh-start', 'Resetting and seeding Firestore');
    
    console.log('\n🎉 Firebase setup completed successfully!');
    console.log('\n📋 Next steps:');
    console.log('1. Start the server: cd server && npm run dev');
    console.log('2. Start the client: cd client && npm start');
    console.log('3. Open http://localhost:3000 in your browser');
    console.log('\n📖 For more information, see FIREBASE_NEW_PROJECT_SETUP.md');
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('1. Check your .env file configuration');
    console.log('2. Verify Firebase project permissions');
    console.log('3. See FIREBASE_NEW_PROJECT_SETUP.md for detailed setup guide');
    process.exit(1);
  }
}

main();
