#!/usr/bin/env node

/**
 * MyMaid EC10 Process Manager
 * @desc Quản lý việc start/stop các process một cách chính xác
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

// Store process references and PIDs
let processes = [];
const PID_FILE = path.join(__dirname, '.mymaid-pids.json');

// Save PIDs to file
function savePIDs() {
  const pids = processes.map(p => ({
    pid: p.pid,
    name: p.name,
    port: p.port
  }));
  fs.writeFileSync(PID_FILE, JSON.stringify(pids, null, 2));
}

// Load PIDs from file
function loadPIDs() {
  if (fs.existsSync(PID_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(PID_FILE, 'utf8'));
    } catch (error) {
      log('Error loading PID file', 'red');
      return [];
    }
  }
  return [];
}

// Kill process on specific port
function killProcessOnPort(port) {
  return new Promise((resolve) => {
    const command = `netstat -ano | findstr :${port} | findstr LISTENING`;
    const findProcess = spawn('cmd', ['/c', command], {
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
        for (const line of lines) {
          const parts = line.trim().split(/\s+/);
          if (parts.length >= 5) {
            const pid = parts[4];
            logWithPrefix('KILL', `Killing process ${pid} on port ${port}`, 'red');
            await killProcessByPID(parseInt(pid));
          }
        }
        // Wait a bit more to ensure process is fully killed
        setTimeout(() => {
          resolve();
        }, 1000);
      } else {
        logWithPrefix('KILL', `No process found on port ${port}`, 'green');
        resolve();
      }
    });
  });
}

// Kill process by PID with better error handling
function killProcessByPID(pid) {
  return new Promise((resolve) => {
    try {
      // First try SIGTERM
      process.kill(pid, 'SIGTERM');
      logWithPrefix('KILL', `Sent SIGTERM to PID ${pid}`, 'yellow');
      
      // Wait 2 seconds then try SIGKILL if needed
      setTimeout(() => {
        try {
          process.kill(pid, 'SIGKILL');
          logWithPrefix('KILL', `Sent SIGKILL to PID ${pid}`, 'red');
        } catch (e) {
          // Process already dead
          logWithPrefix('KILL', `Process ${pid} already terminated`, 'green');
        }
        resolve();
      }, 2000);
    } catch (error) {
      // If SIGTERM fails, try using taskkill (Windows)
      logWithPrefix('KILL', `SIGTERM failed for PID ${pid}, trying taskkill`, 'yellow');
      const taskkill = spawn('taskkill', ['/f', '/pid', pid.toString()], {
        stdio: 'pipe',
        shell: true
      });
      
      taskkill.on('close', (code) => {
        if (code === 0) {
          logWithPrefix('KILL', `Successfully killed PID ${pid} with taskkill`, 'green');
        } else {
          logWithPrefix('KILL', `Failed to kill PID ${pid} with taskkill`, 'red');
        }
        resolve();
      });
    }
  });
}

// Start a process
function startProcess(command, args, cwd, name, port) {
  return new Promise((resolve, reject) => {
    logWithPrefix(name, `Starting ${name} on port ${port}...`, 'cyan');
    
    const process = spawn(command, args, {
      cwd: cwd,
      stdio: 'inherit',
      shell: true
    });

    // Store process reference
    process.name = name;
    process.port = port;
    processes.push(process);
    savePIDs();

    process.on('close', (code) => {
      logWithPrefix(name, `${name} stopped with code ${code}`, code === 0 ? 'green' : 'red');
      // Remove from processes array
      const index = processes.findIndex(p => p.pid === process.pid);
      if (index > -1) {
        processes.splice(index, 1);
        savePIDs();
      }
    });

    process.on('error', (error) => {
      logWithPrefix(name, `Error starting ${name}: ${error.message}`, 'red');
      reject(error);
    });

    // Wait a bit to ensure process started
    setTimeout(() => {
      resolve(process);
    }, 1000);
  });
}

// Stop all processes
async function stopAllProcesses() {
  log('🛑 Stopping all MyMaid processes...', 'yellow');
  
  // Kill current processes
  for (const process of processes) {
    if (process && !process.killed) {
      logWithPrefix(process.name, 'Terminating process...', 'yellow');
      process.kill('SIGTERM');
    }
  }

  // Kill processes on specific ports
  await killProcessOnPort(3000);
  await killProcessOnPort(5000);

  // Kill any remaining processes from PID file
  const savedPIDs = loadPIDs();
  for (const savedPID of savedPIDs) {
    await killProcessByPID(savedPID.pid);
  }

  // Clear PID file
  if (fs.existsSync(PID_FILE)) {
    fs.unlinkSync(PID_FILE);
  }

  log('✅ All processes stopped', 'green');
}

// Start all processes
async function startAllProcesses() {
  try {
    log('🚀 Starting MyMaid EC10...', 'bright');
    
    // Check if ports are available and kill any existing processes
    log('🔍 Checking and clearing ports...', 'cyan');
    await killProcessOnPort(3000);
    await killProcessOnPort(5000);
    
    // Wait a bit more to ensure ports are fully released
    log('⏳ Waiting for ports to be fully released...', 'yellow');
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Double check ports are free
    const checkPort = (port) => {
      return new Promise((resolve) => {
        const command = `netstat -ano | findstr :${port} | findstr LISTENING`;
        const check = spawn('cmd', ['/c', command], {
          stdio: 'pipe',
          shell: true
        });
        
        let output = '';
        check.stdout.on('data', (data) => {
          output += data.toString();
        });
        
        check.on('close', () => {
          if (output.trim()) {
            logWithPrefix('CHECK', `Port ${port} is still in use!`, 'red');
            resolve(false);
          } else {
            logWithPrefix('CHECK', `Port ${port} is free`, 'green');
            resolve(true);
          }
        });
      });
    };
    
    const port3000Free = await checkPort(3000);
    const port5000Free = await checkPort(5000);
    
    if (!port3000Free || !port5000Free) {
      log('❌ Ports are still in use, trying to force kill...', 'red');
      await killProcessOnPort(3000);
      await killProcessOnPort(5000);
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Start server and client
    log('🎯 Starting services...', 'cyan');
    await startProcess('npm', ['run', 'dev'], 'server', 'SERVER', 5000);
    await startProcess('npm', ['run', 'start:3000'], 'client', 'CLIENT', 3000);

    log('✅ All processes started successfully!', 'green');
    log('🌐 Frontend: http://localhost:3000', 'cyan');
    log('🔧 Backend: http://localhost:5000', 'cyan');
    log('💡 Press Ctrl+C to stop all services', 'yellow');

  } catch (error) {
    log(`❌ Startup failed: ${error.message}`, 'red');
    await stopAllProcesses();
  }
}

// Check status
function checkStatus() {
  log('📊 MyMaid EC10 Status', 'bright');
  log('====================', 'cyan');
  
  const savedPIDs = loadPIDs();
  if (savedPIDs.length === 0) {
    log('❌ No processes found', 'red');
    return;
  }

  savedPIDs.forEach(savedPID => {
    try {
      process.kill(savedPID.pid, 0);
      logWithPrefix(savedPID.name, `✅ Running (PID: ${savedPID.pid}, Port: ${savedPID.port})`, 'green');
    } catch (error) {
      logWithPrefix(savedPID.name, `❌ Not running (PID: ${savedPID.pid})`, 'red');
    }
  });
}

// Handle process termination
process.on('SIGINT', async () => {
  await stopAllProcesses();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await stopAllProcesses();
  process.exit(0);
});

// Main function
async function main() {
  const command = process.argv[2];

  switch (command) {
    case 'start':
      await startAllProcesses();
      break;
    case 'stop':
      await stopAllProcesses();
      break;
    case 'status':
      checkStatus();
      break;
    case 'restart':
      await stopAllProcesses();
      setTimeout(async () => {
        await startAllProcesses();
      }, 2000);
      break;
    default:
      log('Usage: node process-manager.js [start|stop|status|restart]', 'yellow');
      log('  start   - Start all services', 'cyan');
      log('  stop    - Stop all services', 'cyan');
      log('  status  - Check service status', 'cyan');
      log('  restart - Restart all services', 'cyan');
      break;
  }
}

main(); 