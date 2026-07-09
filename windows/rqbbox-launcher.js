// RQBBOX Experience OS 1.0 Protocol Handler
// This script runs when rqbbox:// protocol is triggered from Windows

const { exec, spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const PORT = 19779;
const URL_BASE = `http://127.0.0.1:${PORT}`;

function isServerRunning() {
  return new Promise(resolve => {
    http.get(`${URL_BASE}/api/sysinfo`, { timeout: 1000 }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve(true));
    }).on('error', () => resolve(false));
  });
}

function openBrowser(url) {
  const fullscreenUrl = url.includes('?') ? `${url}&fullscreen=1` : `${url}?fullscreen=1`;
  const cmd = process.platform === 'win32' ? `start "" "${fullscreenUrl}"` : `xdg-open "${fullscreenUrl}"`;
  exec(cmd, { timeout: 2000 }, () => {});
}

async function main() {
  const arg = process.argv[2] || 'rqbbox://dashboard';

  // Parse protocol URL: rqbbox://dashboard, rqbbox://game/neon-drift, etc.
  const urlPath = arg.replace(/^rqbbox:\/\//, '/').replace(/\/$/, '') || '/dashboard';

  const running = await isServerRunning();

  if (!running) {
    // Start the server
    const serverScript = path.join(ROOT, 'server.js');
    if (!fs.existsSync(serverScript)) {
      console.error('RQBBOX Experience OS 1.0: server.js not found at', serverScript);
      process.exit(1);
    }

    const child = spawn('node', [serverScript], {
      detached: true,
      stdio: 'ignore',
      cwd: ROOT,
    });
    child.unref();

    // Wait for server to start
    let retries = 20;
    while (retries > 0) {
      await new Promise(r => setTimeout(r, 300));
      try {
        await isServerRunning();
        break;
      } catch {}
      retries--;
    }
  }

  // Open the requested path in browser
  let targetUrl;
  if (urlPath === '/dashboard' || urlPath === '/') {
    targetUrl = `${URL_BASE}/dashboard`;
  } else if (urlPath.startsWith('/game/')) {
    const gameId = urlPath.replace('/game/', '');
    targetUrl = `${URL_BASE}/api/game/play?id=${gameId}`;
  } else {
    targetUrl = `${URL_BASE}${urlPath}`;
  }

  openBrowser(targetUrl);
}

main().catch(err => {
  console.error('RQBBOX Experience OS 1.0 Launcher Error:', err.message);
  process.exit(1);
});
