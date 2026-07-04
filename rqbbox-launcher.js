#!/usr/bin/env node

/**
 * RQBBOX MODE - Entry Point
 * Console Gaming Experience for PC
 * Version 1.0.0
 */

const { execFileSync, execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const PORT = 19778;
const DASHBOARD_URL = `http://localhost:${PORT}/dashboard`;

function buildLaunchCommand(url, options = {}) {
  const browser = options.browser || findPreferredBrowser();
  const fullscreen = options.fullscreen !== false;

  if (browser) {
    const lower = browser.toLowerCase();
    if (lower.includes('msedge') || lower.includes('chrome') || lower.includes('brave')) {
      const args = [`--app=${url}`];
      if (fullscreen) args.push('--start-fullscreen');
      return { command: browser, args, useSpawn: true };
    }
  }

  return {
    command: process.platform === 'win32' ? 'cmd.exe' : 'xdg-open',
    args: process.platform === 'win32' ? ['/c', 'start', '', url] : [url],
    useSpawn: false,
  };
}

function findPreferredBrowser() {
  const candidates = [
    process.env.RQBBOX_BROWSER,
    'msedge.exe',
    'chrome.exe',
    'brave.exe',
  ].filter(Boolean);

  for (const candidate of candidates) {
    try {
      const result = execFileSync('where.exe', [candidate], { stdio: ['ignore', 'pipe', 'ignore'] });
      const first = result.toString().split(/\r?\n/).find(Boolean);
      if (first) return first.trim();
    } catch {}
  }
  return null;
}

function openDashboard(url, options = {}) {
  const launch = buildLaunchCommand(url, options);

  if (launch.useSpawn) {
    const child = spawn(launch.command, launch.args, { detached: true, stdio: 'ignore' });
    child.unref();
    return child;
  }

  if (process.platform === 'win32') {
    execSync(`"${launch.command}" ${launch.args.map(arg => `"${arg}"`).join(' ')}`);
  } else if (process.platform === 'darwin') {
    execSync(`open "${url}"`);
  } else {
    execSync(`xdg-open "${url}"`);
  }
}

function main() {
  console.log('');
  console.log('  ==============================');
  console.log('   RQBBOX MODE - Gaming Console');
  console.log('   Version 1.0.0');
  console.log('  ==============================');
  console.log('');

  const appDir = path.dirname(process.execPath);
  const serverPath = path.join(appDir, 'server.js');

  if (!fs.existsSync(serverPath)) {
    console.error('[ERROR] server.js not found in:', appDir);
    console.error('Please make sure all files are in the same folder as RQBBOX.EXE');
    process.exit(1);
  }

  const fullscreen = process.argv.includes('--fullscreen') || process.env.RQBBOX_FULLSCREEN === '1';

  console.log('[1/3] Starting RQBBOX MODE server...');
  const server = spawn('node', [serverPath], { detached: true, stdio: 'ignore' });
  server.unref();
  console.log('[2/3] Server started (PID:', server.pid, ')');

  setTimeout(() => {
    console.log('[3/3] Opening RQBBOX MODE dashboard...');
    const url = `${DASHBOARD_URL}${fullscreen ? '?fullscreen=1' : ''}`;
    openDashboard(url, { fullscreen });

    console.log('');
    console.log('  RQBBOX MODE is running!');
    console.log('  Dashboard:', url);
    console.log('  Press Ctrl+C to stop.');
    console.log('');
  }, 2000);

  process.on('SIGINT', () => {
    console.log('\nShutting down RQBBOX MODE...');
    server.kill();
    process.exit(0);
  });

  process.on('SIGTERM', () => {
    server.kill();
    process.exit(0);
  });
}

if (require.main === module) {
  main();
}

module.exports = { buildLaunchCommand, openDashboard, findPreferredBrowser };
