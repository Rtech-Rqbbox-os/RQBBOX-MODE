#!/usr/bin/env node

/**
 * RQBBOX MODE - Entry Point
 * Console Gaming Experience for PC
 * Version 1.0.0
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = 19778;
const DASHBOARD_URL = `http://localhost:${PORT}/`;

console.log('');
console.log('  ==============================');
console.log('   RQBBOX MODE - Gaming Console');
console.log('   Version 1.0.0');
console.log('  ==============================');
console.log('');

// Get the directory where this script/executable is located
const appDir = path.dirname(process.execPath);
const serverPath = path.join(appDir, 'server.js');

// Check if server.js exists
if (!fs.existsSync(serverPath)) {
  console.error('[ERROR] server.js not found in:', appDir);
  console.error('Please make sure all files are in the same folder as RQBBOX.EXE');
  process.exit(1);
}

console.log('[1/3] Starting RQBBOX MODE server...');

// Start the server
const server = spawn('node', [serverPath], {
  detached: true,
  stdio: 'ignore'
});

server.unref();

console.log('[2/3] Server started (PID:', server.pid, ')');

// Wait for server to be ready, then open browser
setTimeout(() => {
  console.log('[3/3] Opening RQBBOX MODE dashboard...');
  
  const url = DASHBOARD_URL;
  
  // Open in default browser
  if (process.platform === 'win32') {
    execSync(`start ${url}`);
  } else if (process.platform === 'darwin') {
    execSync(`open ${url}`);
  } else {
    execSync(`xdg-open ${url}`);
  }
  
  console.log('');
  console.log('  RQBBOX MODE is running!');
  console.log('  Dashboard:', DASHBOARD_URL);
  console.log('  Press Ctrl+C to stop.');
  console.log('');
}, 2000);

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down RQBBOX MODE...');
  server.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  server.kill();
  process.exit(0);
});
