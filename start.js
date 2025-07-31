#!/usr/bin/env node

/**
 * MyMaid EC10 Startup Script
 * @desc Khởi động cả frontend và backend với kiểm tra dependencies
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logWithPrefix(prefix, message, color = 'reset') {
  console.log(`${colors[color]}[${prefix}]${colors.reset} ${message}`);
}

// Store process references for cleanup
let processes = [];

// Check if directory exists
function checkDirectory(dir) {
  return fs.existsSync(dir);
}

// Check if package.json exists
function checkPackageJson(dir) {
  return fs.existsSync(path.join(dir, 'package.json'));
}

// Check if node_modules exists
function checkNodeModules(dir) {
  return fs.existsSync(path.join(dir, 'node_modules'));
}

// Check if .env file exists
function checkEnvFile() {
  return fs.existsSync('.env');
}

// Install dependencies for a directory
function installDependencies(dir, name) {
  return new Promise((resolve, reject) => {
    logWithPrefix(name, 'Installing dependencies...', 'yellow');
    
    const install = spawn('npm', ['install'], {
      cwd: dir,
      stdio: 'inherit',
      shell: true
    });

    install.on('close', (code) => {
      if (code === 0) {
        logWithPrefix(name, 'Dependencies installed successfully!', 'green');
        resolve();
      } else {
        logWithPrefix(name, `Failed to install dependencies (exit code: ${code})`, 'red');
        reject(new Error(`Installation failed with code ${code}`));
      }
    });

    install.on('error', (error) => {
      logWithPrefix(name, `Error installing dependencies: ${error.message}`, 'red');
      reject(error);
    });
  });
}

// Start a process
function startProcess(command, args, cwd, name, color) {
  return new Promise((resolve, reject) => {
    logWithPrefix(name, `Starting ${name}...`, color);
    
    const process = spawn(command, args, {
      cwd: cwd,
      stdio: 'inherit',
      shell: true
    });

    // Store process reference for cleanup
    process.name = name;
    process.color = color;
    processes.push(process);

    process.on('close', (code) => {
      if (code === 0) {
        logWithPrefix(name, `${name} stopped normally`, color);
        resolve();
      } else {
        logWithPrefix(name, `${name} stopped with code ${code}`, 'red');
        reject(new Error(`${name} stopped with code ${code}`));
      }
    });

    process.on('error', (error) => {
      logWithPrefix(name, `Error starting ${name}: ${error.message}`, 'red');
      reject(error);
    });

    resolve(process);
  });
}

// Cleanup function to kill all processes
function cleanup() {
  log('\n🛑 Shutting down MyMaid EC10...', 'yellow');
  
  processes.forEach(process => {
    if (process && !process.killed) {
      logWithPrefix(process.name, 'Terminating process...', process.color);
      process.kill('SIGTERM');
    }
  });

  // Force kill any remaining processes on ports 3000 and 5000
  const killPort = (port) => {
    const killProcess = spawn('cmd', ['/c', `netstat -ano | findstr :${port} | findstr LISTENING >nul && for /f "tokens=5" %a in ('netstat -ano ^| findstr :${port} ^| findstr LISTENING') do taskkill /f /pid %a 2>nul && echo "Cleared port ${port}" || echo "Port ${port} is free"`], {
      stdio: 'inherit',
      shell: true
    });
  };

  killPort(3000);
  killPort(5000);

  process.exit(0);
}

// Main startup function
async function startApplication() {
  try {
    log('🚀 MyMaid EC10 Startup Script', 'bright');
    log('==============================', 'cyan');
    
    // Check if we're in the right directory
    if (!checkDirectory('server') || !checkDirectory('client')) {
      log('❌ Error: server/ or client/ directory not found!', 'red');
      log('💡 Make sure you are in the root directory of the project', 'yellow');
      process.exit(1);
    }

    // Check .env file
    if (!checkEnvFile()) {
      log('⚠️  Warning: .env file not found in root directory', 'yellow');
      log('💡 Please create .env file with Firebase configuration', 'yellow');
      log('📖 See FIREBASE_SETUP.md for instructions', 'cyan');
    }

    // Check server dependencies
    if (!checkPackageJson('server')) {
      log('❌ Error: server/package.json not found!', 'red');
      process.exit(1);
    }

    if (!checkNodeModules('server')) {
      log('📦 Installing server dependencies...', 'yellow');
      await installDependencies('server', 'SERVER');
    }

    // Check client dependencies
    if (!checkPackageJson('client')) {
      log('❌ Error: client/package.json not found!', 'red');
      process.exit(1);
    }

    if (!checkNodeModules('client')) {
      log('📦 Installing client dependencies...', 'yellow');
      await installDependencies('client', 'CLIENT');
    }

    // Check environment variables
    log('🔍 Checking environment variables...', 'cyan');
    const checkEnv = spawn('npm', ['run', 'check-env'], {
      cwd: 'server',
      stdio: 'pipe',
      shell: true
    });

    let envOutput = '';
    checkEnv.stdout.on('data', (data) => {
      envOutput += data.toString();
    });

    checkEnv.stderr.on('data', (data) => {
      envOutput += data.toString();
    });

    await new Promise((resolve) => {
      checkEnv.on('close', (code) => {
        if (code !== 0) {
          log('⚠️  Environment check failed:', 'yellow');
          log(envOutput, 'yellow');
          log('💡 Please check your .env file configuration', 'yellow');
        } else {
          log('✅ Environment variables check passed!', 'green');
        }
        resolve();
      });
    });

    log('🎯 Starting MyMaid EC10...', 'bright');
    log('========================', 'cyan');

    // Start server and client concurrently
    const serverProcess = await startProcess('npm', ['run', 'dev'], 'server', 'SERVER', 'blue');
    const clientProcess = await startProcess('npm', ['run', 'start:3000'], 'client', 'CLIENT', 'magenta');

    log('✅ Both server and client started successfully!', 'green');
    log('🌐 Frontend: http://localhost:3000', 'cyan');
    log('🔧 Backend: http://localhost:5000', 'cyan');
    log('💡 Press Ctrl+C to stop all services', 'yellow');

  } catch (error) {
    log(`❌ Startup failed: ${error.message}`, 'red');
    cleanup();
  }
}

// Handle process termination
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start the application
startApplication(); 