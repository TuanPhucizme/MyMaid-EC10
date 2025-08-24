#!/usr/bin/env node

/**
 * Script deploy tự động lên Render
 * Sử dụng: node scripts/deploy-render.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 MyMaid-EC10 Render Deploy Script');
console.log('=====================================\n');

// Kiểm tra các file cần thiết
function checkRequiredFiles() {
  console.log('📋 Kiểm tra files cần thiết...');
  
  const requiredFiles = [
    'package.json',
    'client/package.json',
    'server/package.json',
    'render.yaml',
    '.env.example'
  ];
  
  const missingFiles = [];
  
  requiredFiles.forEach(file => {
    if (fs.existsSync(file)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - KHÔNG TÌM THẤY`);
      missingFiles.push(file);
    }
  });
  
  if (missingFiles.length > 0) {
    console.log(`\n❌ Thiếu ${missingFiles.length} file(s) cần thiết!`);
    return false;
  }
  
  console.log('✅ Tất cả files cần thiết đã có\n');
  return true;
}

// Kiểm tra environment variables
function checkEnvironmentVariables() {
  console.log('🔧 Kiểm tra environment variables...');
  
  if (!fs.existsSync('.env')) {
    console.log('⚠️  File .env không tồn tại');
    console.log('   Tạo file .env từ .env.example và điền các giá trị thực tế');
    return false;
  }
  
  const envContent = fs.readFileSync('.env', 'utf8');
  const requiredVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_PRIVATE_KEY',
    'FIREBASE_CLIENT_EMAIL',
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_MAPBOX_ACCESS_TOKEN'
  ];
  
  const missingVars = [];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName + '=')) {
      console.log(`✅ ${varName}`);
    } else {
      console.log(`❌ ${varName} - CHƯA ĐƯỢC CẤU HÌNH`);
      missingVars.push(varName);
    }
  });
  
  if (missingVars.length > 0) {
    console.log(`\n❌ Thiếu ${missingVars.length} environment variable(s)!`);
    return false;
  }
  
  console.log('✅ Tất cả environment variables đã được cấu hình\n');
  return true;
}

// Kiểm tra Git status
function checkGitStatus() {
  console.log('📝 Kiểm tra Git status...');
  
  try {
    const gitStatus = execSync('git status --porcelain', { encoding: 'utf8' });
    
    if (gitStatus.trim()) {
      console.log('⚠️  Có thay đổi chưa commit:');
      console.log(gitStatus);
      console.log('\n💡 Commit tất cả thay đổi trước khi deploy');
      return false;
    } else {
      console.log('✅ Không có thay đổi chưa commit\n');
      return true;
    }
  } catch (error) {
    console.log('❌ Không thể kiểm tra Git status');
    return false;
  }
}

// Build production
function buildProduction() {
  console.log('🔨 Building production...');
  
  try {
    console.log('📦 Installing dependencies...');
    execSync('npm run install:all', { stdio: 'inherit' });
    
    console.log('🏗️  Building client...');
    execSync('npm run build:production', { stdio: 'inherit' });
    
    console.log('✅ Build production thành công!\n');
    return true;
  } catch (error) {
    console.log('❌ Build production thất bại!');
    return false;
  }
}

// Test production build
function testProductionBuild() {
  console.log('🧪 Testing production build...');
  
  try {
    console.log('🚀 Starting production server...');
    const server = execSync('npm run start:production', { 
      stdio: 'pipe',
      timeout: 30000 // 30 seconds timeout
    });
    
    console.log('✅ Production build test thành công!\n');
    return true;
  } catch (error) {
    console.log('❌ Production build test thất bại!');
    console.log('   Kiểm tra logs để debug');
    return false;
  }
}

// Deploy instructions
function showDeployInstructions() {
  console.log('🎯 HƯỚNG DẪN DEPLOY LÊN RENDER');
  console.log('================================\n');
  
  console.log('1️⃣  Đăng ký tài khoản tại [render.com](https://render.com)');
  console.log('2️⃣  Kết nối với GitHub account');
  console.log('3️⃣  Tạo Web Service cho Backend API:');
  console.log('   - Name: mymaid-ec10-api');
  console.log('   - Environment: Node');
  console.log('   - Build Command: cd server && npm install');
  console.log('   - Start Command: cd server && npm start');
  console.log('   - Health Check: /api/health');
  console.log('');
  console.log('4️⃣  Tạo Static Site cho Frontend Client:');
  console.log('   - Name: mymaid-ec10-client');
  console.log('   - Build Command: cd client && npm install && npm run build');
  console.log('   - Publish Directory: client/build');
  console.log('');
  console.log('5️⃣  Setup Environment Variables (xem file .env.example)');
  console.log('6️⃣  Deploy và test');
  console.log('');
  console.log('📚 Chi tiết xem file: DEPLOY_CHECKLIST.md');
}

// Main function
function main() {
  console.log('🔍 Bắt đầu kiểm tra deploy...\n');
  
  const checks = [
    checkRequiredFiles,
    checkEnvironmentVariables,
    checkGitStatus
  ];
  
  let allChecksPassed = true;
  
  for (const check of checks) {
    if (!check()) {
      allChecksPassed = false;
      break;
    }
  }
  
  if (!allChecksPassed) {
    console.log('❌ Một số kiểm tra không thành công. Sửa lỗi trước khi deploy.\n');
    process.exit(1);
  }
  
  console.log('✅ Tất cả kiểm tra cơ bản đã thành công!\n');
  
  // Hỏi user có muốn build production không
  console.log('🔨 Bạn có muốn build production để test không? (y/n)');
  process.stdin.once('data', (data) => {
    const answer = data.toString().trim().toLowerCase();
    
    if (answer === 'y' || answer === 'yes') {
      if (buildProduction()) {
        console.log('🧪 Bạn có muốn test production build không? (y/n)');
        process.stdin.once('data', (testData) => {
          const testAnswer = testData.toString().trim().toLowerCase();
          
          if (testAnswer === 'y' || testAnswer === 'yes') {
            testProductionBuild();
          }
          
          showDeployInstructions();
          process.exit(0);
        });
      } else {
        showDeployInstructions();
        process.exit(1);
      }
    } else {
      showDeployInstructions();
      process.exit(0);
    }
  });
}

// Run script
if (require.main === module) {
  main();
}

module.exports = {
  checkRequiredFiles,
  checkEnvironmentVariables,
  checkGitStatus,
  buildProduction,
  testProductionBuild
};
