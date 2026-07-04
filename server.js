const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 19778;
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.wav': 'audio/wav',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon',
  '.webmanifest': 'application/manifest+json',
};

function mime(p) {
  const ext = path.extname(p).toLowerCase();
  return MIME[ext] || 'application/octet-stream';
}

function readJson(rel) {
  try {
    return JSON.parse(fs.readFileSync(path.join(ROOT, rel), 'utf-8'));
  } catch { return null; }
}

function writeJson(rel, obj) {
  const p = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, JSON.stringify(obj, null, 2), 'utf-8');
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function getSysInfo() {
  const cpus = os.cpus();
  return {
    platform: os.platform(),
    release: os.release(),
    hostname: os.hostname(),
    arch: os.arch(),
    cpuModel: cpus[0]?.model || 'Unknown',
    cpuCores: cpus.length,
    cpuLoad: os.loadavg ? Math.round((os.loadavg()[0] / cpus.length) * 100) / 100 : 0,
    memoryTotal: os.totalmem(),
    memoryFree: os.freemem(),
    memoryUsed: os.totalmem() - os.freemem(),
    memoryPct: Math.round(((os.totalmem() - os.freemem()) / os.totalmem()) * 100),
    uptime: os.uptime(),
    nodeVersion: process.version,
  };
}

function body(req) {
  return new Promise(resolve => {
    let d = '';
    req.on('data', c => { d += c; if (d.length > 1e7) { req.destroy(); resolve(null); } });
    req.on('end', () => { try { resolve(JSON.parse(d)); } catch { resolve(d); } });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const method = req.method;
  const pathname = url.pathname;
  const params = Object.fromEntries(url.searchParams);

  const send = (code, data, type) => {
    res.writeHead(code, {
      'Content-Type': type || 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    });
    res.end(data);
  };

  if (method === 'OPTIONS') { send(204, ''); return; }

  try {
    // API: Get system info
    if (pathname === '/api/sysinfo') {
      send(200, JSON.stringify({ ok: true, ...getSysInfo() }));
    }
    // API: Get/Update config
    else if (pathname === '/api/config') {
      if (method === 'GET') {
        send(200, JSON.stringify({ ok: true, data: readJson('config.json') }));
      } else {
        const b = await body(req);
        writeJson('config.json', b.data || b);
        send(200, JSON.stringify({ ok: true }));
      }
    }
    // API: Get/Update profiles
    else if (pathname === '/api/profiles') {
      if (method === 'GET') {
        send(200, JSON.stringify({ ok: true, data: readJson('profiles.json') }));
      } else {
        const b = await body(req);
        writeJson('profiles.json', b.data || b);
        send(200, JSON.stringify({ ok: true }));
      }
    }
    // API: Get game library
    else if (pathname === '/api/games') {
      const catalog = readJson('games/catalog.json') || { games: [] };
      send(200, JSON.stringify({ ok: true, data: catalog.games, total: catalog.games.length }));
    }
    // API: Scan for installed games
    else if (pathname === '/api/games/scan') {
      const { execSync } = require('child_process');
      try {
        const ps = `powershell -NoProfile -ExecutionPolicy Bypass -File "${path.join(ROOT, 'windows', 'game-scanner.ps1')}"`;
        const output = execSync(ps, { timeout: 10000, encoding: 'utf-8' });
        const installedGames = JSON.parse(output || '[]');
        send(200, JSON.stringify({ ok: true, games: installedGames, total: installedGames.length }));
      } catch (e) {
        send(200, JSON.stringify({ ok: true, games: [], total: 0, error: e.message }));
      }
    }
    // API: Get apps
    else if (pathname === '/api/apps') {
      const catalog = readJson('apps/catalog.json') || { apps: [] };
      send(200, JSON.stringify({ ok: true, data: catalog.apps, total: catalog.apps.length }));
    }
    // API: Get achievements
    else if (pathname === '/api/achievements') {
      const profiles = readJson('profiles.json') || { users: [], achievements: [] };
      const userId = params.userId || params.token;
      let achievements = profiles.achievements || [];
      if (userId) {
        const user = (profiles.users || []).find(u => u.id === userId || u.token === userId);
        if (user) achievements = (user.achievements || []);
      }
      send(200, JSON.stringify({ ok: true, data: achievements, total: achievements.length }));
    }
    // API: Unlock achievement
    else if (pathname === '/api/achievements/unlock') {
      const b = await body(req);
      const profiles = readJson('profiles.json') || { users: [], achievements: [] };
      const user = (profiles.users || []).find(u => u.token === b.token);
      if (!user) { send(401, JSON.stringify({ ok: false, error: 'Unauthorized' })); return; }
      if (!user.achievements) user.achievements = [];
      if (!user.achievements.find(a => a.id === b.id)) {
        user.achievements.push({ id: b.id, title: b.title, icon: b.icon, unlockedAt: new Date().toISOString() });
        writeJson('profiles.json', profiles);
      }
      send(200, JSON.stringify({ ok: true, achievements: user.achievements }));
    }
    // API: Friends
    else if (pathname === '/api/friends') {
      if (method === 'GET') {
        const profiles = readJson('profiles.json') || { users: [] };
        const userId = params.userId;
        const user = (profiles.users || []).find(u => u.id === userId);
        if (!user) { send(200, JSON.stringify({ ok: true, friends: [], requests: [] })); return; }
        const friends = (user.friends || []).map(f => {
          const fu = (profiles.users || []).find(u => u.id === f.id);
          return { ...f, online: !!fu?.token };
        });
        send(200, JSON.stringify({ ok: true, friends, requests: user.friendRequests || [] }));
      }
    }
    // API: Stars (special users)
    else if (pathname === '/api/stars') {
      const profiles = readJson('profiles.json') || {};
      const stars = profiles.stars || [];
      const users = (profiles.users || []).filter(u => u.role === 'star');
      send(200, JSON.stringify({ ok: true, stars, users }));
    }
    // API: Store catalog
    else if (pathname === '/api/store') {
      const store = readJson('games/catalog.json') || { games: [] };
      send(200, JSON.stringify({ ok: true, data: store, total: store.games?.length || 0 }));
    }
    // API: Quick Resume state
    else if (pathname === '/api/quick-resume') {
      if (method === 'GET') {
        const profiles = readJson('profiles.json') || { };
        send(200, JSON.stringify({ ok: true, sessions: profiles.quickResume || [] }));
      } else {
        const b = await body(req);
        const profiles = readJson('profiles.json') || { users: [], quickResume: [] };
        if (!profiles.quickResume) profiles.quickResume = [];
        if (b.action === 'save') {
          const existing = profiles.quickResume.findIndex(s => s.id === b.id);
          if (existing >= 0) profiles.quickResume[existing] = { ...b, savedAt: new Date().toISOString() };
          else profiles.quickResume.push({ ...b, savedAt: new Date().toISOString() });
        } else if (b.action === 'remove') {
          profiles.quickResume = profiles.quickResume.filter(s => s.id !== b.id);
        } else if (b.action === 'clear') {
          profiles.quickResume = [];
        }
        writeJson('profiles.json', profiles);
        send(200, JSON.stringify({ ok: true, sessions: profiles.quickResume }));
      }
    }
    // API: Performance stats
    else if (pathname === '/api/performance') {
      const info = getSysInfo();
      let fps = 60;
      let gpuInfo = { vendor: 'Unknown', renderer: 'Unknown' };
      send(200, JSON.stringify({
        ok: true,
        cpu: { model: info.cpuModel, cores: info.cpuCores, load: info.cpuLoad },
        memory: { total: info.memoryTotal, used: info.memoryUsed, free: info.memoryFree, pct: info.memoryPct },
        fps,
        gpu: gpuInfo,
        mode: params.mode || 'performance',
      }));
    }
    // API: Theme list
    else if (pathname === '/api/themes') {
      const themesDir = path.join(ROOT, 'css', 'themes');
      let themes = [];
      try {
        themes = fs.readdirSync(themesDir)
          .filter(f => f.endsWith('.css'))
          .map(f => ({ id: f.replace('.css', ''), name: f.replace('.css', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), file: f }));
      } catch {}
      send(200, JSON.stringify({ ok: true, themes }));
    }
    // API: Screenshot
    else if (pathname === '/api/screenshot') {
      const b = await body(req);
      const dir = path.join(ROOT, 'captures');
      fs.mkdirSync(dir, { recursive: true });
      const name = `screenshot-${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.png`;
      if (b.base64) fs.writeFileSync(path.join(dir, name), Buffer.from(b.base64, 'base64'));
      send(200, JSON.stringify({ ok: true, path: `captures/${name}` }));
    }
    // API: Recordings list
    else if (pathname === '/api/captures') {
      const dir = path.join(ROOT, 'captures');
      let files = [];
      try {
        files = fs.readdirSync(dir)
          .filter(f => /\.(png|jpg|jpeg|webm|mp4)$/i.test(f))
          .map(name => {
            const stat = fs.statSync(path.join(dir, name));
            return { name, path: `captures/${name}`, size: stat.size, modified: stat.mtime };
          }).sort((a, b) => b.modified - a.modified);
      } catch {}
      send(200, JSON.stringify({ ok: true, captures: files }));
    }
    // API: Play game (returns HTML page, launches in new window)
    else if (pathname === '/api/game/play') {
      const id = params.id;
      const catalog = readJson('games/catalog.json') || { games: [] };
      const game = (catalog.games || []).find(g => g.id === id);
      if (!game) { send(404, JSON.stringify({ ok: false, error: 'Game not found' })); return; }
      // Use localPath from catalog, or fall back to id as directory name
      const gameRel = game.localPath ? game.localPath.replace(/^\//, '') : ('games/' + id);
      const gameDir = path.join(ROOT, gameRel, 'index.html');
      if (fs.existsSync(gameDir)) {
        const html = fs.readFileSync(gameDir, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(html);
      } else {
        send(404, '{"ok":false,"error":"Game file not found"}');
      }
    }
    // API: Launch game
    else if (pathname === '/api/launch') {
      const b = await body(req);
      const catalog = readJson('games/catalog.json') || { games: [] };
      const game = (catalog.games || []).find(g => g.id === b.id);
      if (!game) { send(404, JSON.stringify({ ok: false, error: 'Game not found' })); return; }
      const profiles = readJson('profiles.json') || { users: [], quickResume: [] };
      const user = (profiles.users || []).find(u => u.token === b.token);
      if (user) {
        if (!user.stats) user.stats = { gamesLaunched: 0, playTime: 0 };
        user.stats.gamesLaunched = (user.stats.gamesLaunched || 0) + 1;
        user.stats.lastGame = game.title;
        user.stats.lastPlayed = new Date().toISOString();
        writeJson('profiles.json', profiles);
      }
      const launchUrl = game.localPath ? (game.localPath.startsWith('http') ? game.localPath : 'http://127.0.0.1:' + PORT + game.localPath) : (game.launchUrl || game.path || '');
      send(200, JSON.stringify({ ok: true, game, launchUrl }));
    }
    // API: Auth
    else if (pathname === '/api/auth') {
      const b = await body(req);
      const profiles = readJson('profiles.json') || { users: [] };
      const user = (profiles.users || []).find(u =>
        u.username === b.username || u.name === b.username || u.email === b.username
      );
      if (!user) { send(401, JSON.stringify({ ok: false, error: 'User not found' })); return; }
      if (user.pin && user.pin !== b.password) { send(401, JSON.stringify({ ok: false, error: 'Invalid credentials' })); return; }
      const token = require('crypto').randomBytes(32).toString('hex');
      user.token = token;
      writeJson('profiles.json', profiles);
      send(200, JSON.stringify({ ok: true, user, token }));
    }
    // API: Register
    else if (pathname === '/api/register') {
      const b = await body(req);
      const profiles = readJson('profiles.json') || { users: [], achievements: [], quickResume: [] };
      if ((profiles.users || []).some(u => u.username === b.username)) {
        send(409, JSON.stringify({ ok: false, error: 'Username taken' })); return;
      }
      const token = require('crypto').randomBytes(32).toString('hex');
      const user = {
        id: 'user-' + Math.random().toString(36).slice(2, 10),
        name: b.name,
        username: b.username,
        token,
        avatar: b.name[0].toUpperCase(),
        theme: 'default',
        achievements: [],
        friends: [],
        friendRequests: [],
        stats: { gamesLaunched: 0, playTime: 0, captures: 0 },
        createdAt: new Date().toISOString(),
      };
      profiles.users.push(user);
      writeJson('profiles.json', profiles);
      send(200, JSON.stringify({ ok: true, user, token }));
    }
    // API: Game Mode toggle
    else if (pathname === '/api/gamemode') {
      const b = method === 'POST' ? await body(req) : {};
      const { execSync } = require('child_process');
      let result = { ok: true };
      try {
        if (b.action === 'enable') {
          execSync('reg add "HKCU\\Software\\Microsoft\\GameBar" /v AutoGameModeEnabled /t REG_DWORD /d 1 /f', { timeout: 2000 });
          execSync('reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\RQBBOXMode" /v "GPU Priority" /t REG_DWORD /d 8 /f', { timeout: 2000 });
          execSync('reg add "HKLM\\SOFTWARE\\Microsoft\\Windows NT\\CurrentVersion\\Multimedia\\SystemProfile\\Tasks\\RQBBOXMode" /v "Scheduling Category" /t REG_SZ /d "High" /f', { timeout: 2000 });
          result.mode = 'enabled';
          result.message = 'Windows Game Mode enabled with RQBBOX profile';
        } else if (b.action === 'disable') {
          execSync('reg add "HKCU\\Software\\Microsoft\\GameBar" /v AutoGameModeEnabled /t REG_DWORD /d 0 /f', { timeout: 2000 });
          result.mode = 'disabled';
          result.message = 'Windows Game Mode disabled';
        } else {
          const out = execSync('reg query "HKCU\\Software\\Microsoft\\GameBar" /v AutoGameModeEnabled', { timeout: 2000, encoding: 'utf-8' });
          result.mode = out.includes('0x1') ? 'enabled' : 'disabled';
        }
      } catch (e) {
        result.mode = 'unknown';
        result.error = e.message;
      }
      send(200, JSON.stringify(result));
    }
    // API: Windows status
    else if (pathname === '/api/windows-status') {
      const { execSync } = require('child_process');
      let gameMode = 'unknown', gameBar = 'unknown';
      try {
        const gm = execSync('reg query "HKCU\\Software\\Microsoft\\GameBar" /v AutoGameModeEnabled 2>nul', { timeout: 2000, encoding: 'utf-8' });
        gameMode = gm.includes('0x1') ? 'enabled' : 'disabled';
      } catch {}
      try {
        const gb = execSync('reg query "HKCU\\Software\\Microsoft\GameBar" /v UseNexusForGameBarEnabled 2>nul', { timeout: 2000, encoding: 'utf-8' });
        gameBar = gb.includes('0x1') ? 'enabled' : 'disabled';
      } catch {}
      send(200, JSON.stringify({ ok: true, gameMode, gameBar, platform: process.platform }));
    }
    // Windows Settings page
    else if (pathname === '/windows-settings' || pathname === '/windows-settings.html') {
      const wsPath = path.join(ROOT, 'windows-settings.html');
      if (fs.existsSync(wsPath)) {
        const stat = fs.statSync(wsPath);
        res.writeHead(200, {
          'Content-Type': 'text/html; charset=utf-8',
          'Content-Length': stat.size,
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Access-Control-Allow-Origin': '*',
        });
        fs.createReadStream(wsPath).pipe(res);
        return;
      }
      send(404, '{"ok":false,"error":"Windows Settings page not found"}');
    }
    // Static files
    else {
      let rel = pathname.replace(/^\//, '');

      // Root paths: serve index.html (launcher)
      if (rel === '' || rel === '/') rel = 'index.html';
      // /dashboard → dashboard.html
      if (rel === 'dashboard') rel = 'dashboard.html';
      // /dashboard.html already fine

      // Resolve path safely
      const filePath = path.join(ROOT, rel);
      const resolvedPath = path.resolve(filePath);

      if (!resolvedPath.startsWith(path.resolve(ROOT))) {
        send(403, '{"ok":false,"error":"Forbidden"}'); return;
      }

      // If path is a directory, look for index.html inside
      if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
        const indexPath = path.join(resolvedPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          const stat = fs.statSync(indexPath);
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': stat.size,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Access-Control-Allow-Origin': '*',
          });
          fs.createReadStream(indexPath).pipe(res);
          return;
        }
      }

      if (!fs.existsSync(resolvedPath) || fs.statSync(resolvedPath).isDirectory()) {
        send(404, '{"ok":false,"error":"Not found"}'); return;
      }

      const stat = fs.statSync(resolvedPath);
      const ext = path.extname(resolvedPath).toLowerCase();
      const cacheControl = ['.html', '.htm'].includes(ext) ? 'no-cache, no-store, must-revalidate' : 'public, max-age=600';
      res.writeHead(200, {
        'Content-Type': mime(resolvedPath),
        'Content-Length': stat.size,
        'Cache-Control': cacheControl,
        'Access-Control-Allow-Origin': '*',
      });
      fs.createReadStream(resolvedPath).pipe(res);
    }
  } catch (err) {
    console.error(`[RQBBOX MODE] Error: ${err.message}`);
    send(500, JSON.stringify({ ok: false, error: err.message }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  ╔═══════════════════════════════════╗`);
  console.log(`  ║     RQBBOX MODE v1.0.0          ║`);
  console.log(`  ║   Plug Into Gaming. ®           ║`);
  console.log(`  ╚═══════════════════════════════════╝\n`);
  console.log(`  Server: http://127.0.0.1:${PORT}/`);
  console.log(`  Dashboard: http://127.0.0.1:${PORT}/dashboard\n`);
});
