// RQBBOX Experience OS 1.0 — Windows Game Mode Integration
// System tray icon and Game Mode controller

const http = require('http');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const ROOT = path.resolve(__dirname, '..');
const PORT = 19779;
const URL_BASE = `http://127.0.0.1:${PORT}`;

function openDashboard() {
  exec(`start "" "${URL_BASE}/dashboard"`, { timeout: 2000 });
}

function activateGameMode() {
  // Enable Windows Game Mode
  try {
    exec('reg add "HKCU\\Software\\Microsoft\\GameBar" /v AutoGameModeEnabled /t REG_DWORD /d 1 /f', { timeout: 2000 });
    // Set RQBBOX task profile
    exec('reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\RQBBOXMode" /v "GPU Priority" /t REG_DWORD /d 8 /f', { timeout: 2000 });
    exec('reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\RQBBOXMode" /v "Scheduling Category" /t REG_SZ /d "High" /f', { timeout: 2000 });
  } catch {}
}

function deactivateGameMode() {
  try {
    exec('reg add "HKCU\\Software\\Microsoft\\GameBar" /v AutoGameModeEnabled /t REG_DWORD /d 0 /f', { timeout: 2000 });
  } catch {}
}

function getStatus() {
  return new Promise(resolve => {
    http.get(`${URL_BASE}/api/performance`, { timeout: 2000 }, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); }
        catch { resolve({ ok: false }); }
      });
    }).on('error', () => resolve({ ok: false, error: 'Server offline' }));
  });
}

// Parse command line args
const action = process.argv[2] || 'launch';

switch (action) {
  case 'launch':
    activateGameMode();
    openDashboard();
    break;

  case 'status':
    getStatus().then(status => {
      console.log(JSON.stringify(status, null, 2));
    });
    break;

  case 'gamemode-on':
    activateGameMode();
    console.log('Game Mode: ON');
    break;

  case 'gamemode-off':
    deactivateGameMode();
    console.log('Game Mode: OFF');
    break;

  case 'open':
    openDashboard();
    break;

  default:
    console.log('RQBBOX Experience OS 1.0 v1.0.0');
    console.log('Usage: rqbbox-mode.exe [launch|status|gamemode-on|gamemode-off|open]');
}
