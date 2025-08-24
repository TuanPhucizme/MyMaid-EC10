#!/usr/bin/env node

/**
 * Script test production build
 * Sử dụng: node scripts/test-production.js
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🧪 MyMaid-EC10 Production Build Test');
console.log('=====================================\n');

// Kiểm tra build production
function testProductionBuild() {
  console.log('🔨 Testing production build...');
  
  try {
    // Kiểm tra client build
    if (!fs.existsSync('client/build')) {
      console.log('❌ Client build không tồn tại. Chạy build trước:');
      console.log('   npm run build:production');
      return false;
    }
    
    console.log('✅ Client build đã tồn tại');
    
    // Kiểm tra server dependencies
    if (!fs.existsSync('server/node_modules')) {
      console.log('⚠️  Server dependencies chưa được install');
      console.log('   Chạy: npm run install:all');
      return false;
    }
    
    console.log('✅ Server dependencies đã được install');
    
    return true;
  } catch (error) {
    console.log('❌ Lỗi khi kiểm tra build:', error.message);
    return false;
  }
}

// Test production server
function testProductionServer() {
  return new Promise((resolve) => {
    console.log('🚀 Testing production server...');
    
    try {
      // Start production server
      const server = spawn('npm', ['run', 'start:production'], {
        stdio: 'pipe',
        shell: true
      });
      
      let serverStarted = false;
      let serverOutput = '';
      
      server.stdout.on('data', (data) => {
        const output = data.toString();
        serverOutput += output;
        console.log(`[SERVER] ${output.trim()}`);
        
        // Kiểm tra server đã start
        if (output.includes('Server is running') || output.includes('listening')) {
          serverStarted = true;
          console.log('✅ Server đã start thành công');
        }
      });
      
      server.stderr.on('data', (data) => {
        console.log(`[SERVER ERROR] ${data.toString().trim()}`);
      });
      
      // Timeout sau 30 giây
      const timeout = setTimeout(() => {
        if (!serverStarted) {
          console.log('⏰ Timeout: Server không start trong 30 giây');
          server.kill();
          resolve(false);
        }
      }, 30000);
      
      // Kiểm tra health endpoint sau 10 giây
      setTimeout(() => {
        if (serverStarted) {
          testHealthEndpoint().then((healthOk) => {
            clearTimeout(timeout);
            server.kill();
            resolve(healthOk);
          });
        }
      }, 10000);
      
    } catch (error) {
      console.log('❌ Lỗi khi start server:', error.message);
      resolve(false);
    }
  });
}

// Test health endpoint
function testHealthEndpoint() {
  return new Promise((resolve) => {
    console.log('🏥 Testing health endpoint...');
    
    try {
      // Sử dụng curl hoặc fetch để test health endpoint
      const healthCheck = spawn('curl', ['http://localhost:5000/api/health'], {
        stdio: 'pipe',
        shell: true
      });
      
      let response = '';
      
      healthCheck.stdout.on('data', (data) => {
        response += data.toString();
      });
      
      healthCheck.on('close', (code) => {
        if (code === 0 && response.includes('"status":"OK"')) {
          console.log('✅ Health endpoint hoạt động tốt');
          console.log('Response:', response.trim());
          resolve(true);
        } else {
          console.log('❌ Health endpoint không hoạt động');
          console.log('Response:', response.trim());
          resolve(false);
        }
      });
      
      healthCheck.on('error', (error) => {
        console.log('❌ Lỗi khi test health endpoint:', error.message);
        resolve(false);
      });
      
    } catch (error) {
      console.log('❌ Lỗi khi test health endpoint:', error.message);
      resolve(false);
    }
  });
}

// Test client build
function testClientBuild() {
  console.log('🌐 Testing client build...');
  
  try {
    const buildPath = 'client/build';
    const requiredFiles = [
      'index.html',
      'static/js/main.js',
      'static/css/main.css'
    ];
    
    const missingFiles = [];
    
    requiredFiles.forEach(file => {
      const filePath = path.join(buildPath, file);
      if (fs.existsSync(filePath)) {
        console.log(`✅ ${file}`);
      } else {
        console.log(`❌ ${file} - KHÔNG TÌM THẤY`);
        missingFiles.push(file);
      }
    });
    
    if (missingFiles.length > 0) {
      console.log(`\n❌ Thiếu ${missingFiles.length} file(s) trong build`);
      return false;
    }
    
    // Kiểm tra file sizes
    const indexHtmlPath = path.join(buildPath, 'index.html');
    const indexHtmlStats = fs.statSync(indexHtmlPath);
    const indexHtmlSize = (indexHtmlStats.size / 1024).toFixed(2);
    
    console.log(`📊 index.html size: ${indexHtmlSize} KB`);
    
    if (indexHtmlSize < 1) {
      console.log('⚠️  index.html quá nhỏ, có thể build bị lỗi');
      return false;
    }
    
    console.log('✅ Client build test thành công\n');
    return true;
    
  } catch (error) {
    console.log('❌ Lỗi khi test client build:', error.message);
    return false;
  }
}

// Main function
async function main() {
  console.log('🔍 Bắt đầu test production build...\n');
  
  // Test 1: Kiểm tra build
  if (!testProductionBuild()) {
    console.log('❌ Build test thất bại. Sửa lỗi trước khi tiếp tục.\n');
    process.exit(1);
  }
  
  // Test 2: Test client build
  if (!testClientBuild()) {
    console.log('❌ Client build test thất bại.\n');
    process.exit(1);
  }
  
  // Test 3: Test production server
  console.log('🔄 Bắt đầu test production server...\n');
  const serverTestResult = await testProductionServer();
  
  if (serverTestResult) {
    console.log('\n🎉 TẤT CẢ TESTS ĐÃ THÀNH CÔNG!');
    console.log('✅ Production build sẵn sàng deploy');
    console.log('✅ Server hoạt động bình thường');
    console.log('✅ Health endpoint hoạt động');
    console.log('\n🚀 Bạn có thể deploy lên Render!');
  } else {
    console.log('\n❌ MỘT SỐ TESTS THẤT BẠI');
    console.log('🔧 Kiểm tra logs và sửa lỗi trước khi deploy');
    process.exit(1);
  }
}

// Run script
if (require.main === module) {
  main().catch((error) => {
    console.error('❌ Lỗi không mong muốn:', error);
    process.exit(1);
  });
}

module.exports = {
  testProductionBuild,
  testProductionServer,
  testHealthEndpoint,
  testClientBuild
};
