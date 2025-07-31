#!/usr/bin/env node

/**
 * Force Kill Ports Script
 * @desc Force kill tất cả process trên port 3000 và 5000
 */

const { spawn } = require('child_process');

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

// Force kill process on specific port
function forceKillPort(port) {
  return new Promise((resolve) => {
    logWithPrefix('FORCE', `Force killing processes on port ${port}...`, 'red');
    
    // First, find all processes on the port
    const findCommand = `netstat -ano | findstr :${port} | findstr LISTENING`;
    const findProcess = spawn('cmd', ['/c', findCommand], {
      stdio: 'pipe',
      shell: true
    });

    let output = '';
    findProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    findProcess.on('close', async () => {
      if (output.trim()) {
        const lines = output.trim().split('\n');
        let killedCount = 0;
        
        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 5) {
            const pid = parts[4];
            logWithPrefix('KILL', `Force killing PID ${pid} on port ${port}`, 'red');
            
            // Use taskkill with /f flag for force kill
            const killProcess = spawn('taskkill', ['/f', '/pid', pid], {
              stdio: 'pipe',
              shell: true
            });
            
            killProcess.on('close', (code) => {
              if (code === 0) {
                logWithPrefix('KILL', `Successfully killed PID ${pid}`, 'green');
                killedCount++;
              } else {
                logWithPrefix('KILL', `Failed to kill PID ${pid}`, 'red');
              }
            });
          }
        }
        
        // Wait a bit for processes to be killed
        setTimeout(() => {
          logWithPrefix('FORCE', `Killed ${killedCount} processes on port ${port}`, 'green');
          resolve();
        }, 2000);
      } else {
        logWithPrefix('FORCE', `No processes found on port ${port}`, 'yellow');
        resolve();
      }
    });
  });
}

// Main function
async function main() {
  log('🔪 Force Kill Ports Script', 'bright');
  log('==========================', 'cyan');
  
  const port = process.argv[2];
  
  if (port) {
    // Kill specific port
    await forceKillPort(port);
  } else {
    // Kill both ports
    await forceKillPort(3000);
    await forceKillPort(5000);
  }
  
  log('✅ Force kill completed!', 'green');
}

main(); 