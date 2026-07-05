const { app, BrowserWindow, Tray, Menu, nativeImage, globalShortcut, dialog } = require('electron');
const path = require('path');
const http = require('http');

const PORT = 19778;
const DASHBOARD_URL = `http://127.0.0.1:${PORT}/dashboard?fullscreen=1`;
let mainWindow = null;
let tray = null;
let isQuitting = false;

function getAssetPath(file) {
  // In development: path.join(__dirname, file)
  // In packaged: __dirname points to app.asar, files are inside
  return path.join(__dirname, file);
}

function waitForServer(retries = 30) {
  return new Promise((resolve) => {
    const check = (remaining) => {
      const req = http.get(`http://127.0.0.1:${PORT}/api/sysinfo`, (res) => {
        if (res.statusCode === 200) resolve(true);
        else if (remaining > 0) setTimeout(() => check(remaining - 1), 500);
        else resolve(false);
      });
      req.on('error', () => {
        if (remaining > 0) setTimeout(() => check(remaining - 1), 500);
        else resolve(false);
      });
      req.setTimeout(2000, () => {
        req.destroy();
        if (remaining > 0) setTimeout(() => check(remaining - 1), 500);
        else resolve(false);
      });
    };
    check(retries);
  });
}

function createWindow() {
  const iconPath = getAssetPath(path.join('assets', 'favicon.svg'));
  const iconExists = require('fs').existsSync(iconPath);

  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    fullscreen: true,
    autoHideMenuBar: true,
    frame: false,
    resizable: false,
    icon: iconExists ? iconPath : undefined,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
    backgroundColor: '#000000',
    show: false,
    title: 'RQBBOX MODE',
  });

  mainWindow.loadURL(DASHBOARD_URL);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.on('did-finish-load', () => {
    try { mainWindow.setFullScreen(true); } catch {}
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    require('electron').shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('close', (e) => {
    if (!isQuitting) {
      e.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  const iconPath = getAssetPath(path.join('assets', 'favicon.svg'));
  let trayIcon;
  try {
    trayIcon = nativeImage.createFromPath(iconPath);
    if (trayIcon.isEmpty()) {
      // Try PNG fallback
      const pngPath = getAssetPath(path.join('assets', 'rqbbox-icon.svg'));
      if (require('fs').existsSync(pngPath)) {
        trayIcon = nativeImage.createFromPath(pngPath);
      }
    }
    if (trayIcon.isEmpty()) trayIcon = nativeImage.createEmpty();
  } catch {
    trayIcon = nativeImage.createEmpty();
  }
  tray = new Tray(trayIcon);
  tray.setToolTip('RQBBOX MODE');

  const contextMenu = Menu.buildFromTemplate([
    { label: 'Show RQBBOX MODE', click: () => { if (mainWindow) { mainWindow.show(); mainWindow.setFullScreen(true); } } },
    { type: 'separator' },
    { label: 'Open Dashboard', click: () => { if (mainWindow) { mainWindow.loadURL(DASHBOARD_URL); } } },
    { type: 'separator' },
    { label: 'Quit RQBBOX MODE', click: () => { isQuitting = true; app.quit(); } },
  ]);
  tray.setContextMenu(contextMenu);
  tray.on('double-click', () => { if (mainWindow) { mainWindow.show(); mainWindow.setFullScreen(true); } });
}

function registerShortcuts() {
  globalShortcut.register('F11', () => {
    if (mainWindow) {
      try { mainWindow.setFullScreen(!mainWindow.isFullScreen()); } catch {}
    }
  });
  globalShortcut.register('CommandOrControl+G', () => {
    if (mainWindow) {
      mainWindow.webContents.executeJavaScript('showGameBarOverlay()').catch(() => {});
    }
  });
}

app.whenReady().then(async () => {
  console.log('Starting RQBBOX MODE...');
  try {
    // Check if server is already running (from a previous session)
    const alreadyRunning = await new Promise(resolve => {
      const req = http.get(`http://127.0.0.1:${PORT}/api/sysinfo`, (res) => {
        resolve(res.statusCode === 200);
      });
      req.on('error', () => resolve(false));
      req.setTimeout(1500, () => { req.destroy(); resolve(false); });
    });

    if (alreadyRunning) {
      console.log('Server already running on port ' + PORT + ', reusing...');
    } else {
      // Kill any stale process on the port before starting
      try {
        const { execSync } = require('child_process');
        execSync(`taskkill /f /im node.exe /fi "WINDOWTITLE eq RQBBOX*" 2>nul`, { timeout: 3000 });
      } catch {}

      // Start the HTTP server directly in Electron's Node.js process
      require('./server.js');

      const ready = await waitForServer();
      if (!ready) {
        dialog.showErrorBox('RQBBOX MODE', 'Failed to start the RQBBOX server.');
        app.quit();
        return;
      }
    }

    console.log('Server ready, launching dashboard...');
    createWindow();
    createTray();
    registerShortcuts();
  } catch (err) {
    dialog.showErrorBox('RQBBOX MODE Error', err.message);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  if (!isQuitting) {
    isQuitting = true;
  }
  app.quit();
});

app.on('before-quit', () => {
  isQuitting = true;
  globalShortcut.unregisterAll();
});

app.on('activate', () => {
  if (!mainWindow) createWindow();
  else {
    mainWindow.show();
    mainWindow.setFullScreen(true);
  }
});
