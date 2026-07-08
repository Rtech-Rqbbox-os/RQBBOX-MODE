const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PORT = 19779;
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
  '.pdf': 'application/pdf',
  '.zip': 'application/zip',
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
    isPortable: fs.existsSync(path.join(ROOT, 'portable.txt')) || process.argv.includes('--portable'),
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
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Portable',
      'X-Powered-By': 'RQBBOX Experience by RhysTech',
    });
    res.end(data);
  };

  if (method === 'OPTIONS') { send(204, ''); return; }

  try {
    // == SYSTEM ==
    if (pathname === '/api/sysinfo') {
      send(200, JSON.stringify({ ok: true, ...getSysInfo() }));
    }
    else if (pathname === '/api/config') {
      if (method === 'GET') {
        send(200, JSON.stringify({ ok: true, data: readJson('config.json') }));
      } else {
        const b = await body(req);
        writeJson('config.json', b.data || b);
        send(200, JSON.stringify({ ok: true }));
      }
    }
    else if (pathname === '/api/profiles') {
      if (method === 'GET') {
        send(200, JSON.stringify({ ok: true, data: readJson('profiles.json') }));
      } else {
        const b = await body(req);
        writeJson('profiles.json', b.data || b);
        send(200, JSON.stringify({ ok: true }));
      }
    }

    // == GAMES ==
    else if (pathname === '/api/games') {
      const catalog = readJson('games/catalog.json') || { games: [] };
      send(200, JSON.stringify({ ok: true, data: catalog.games, total: catalog.games.length }));
    }
    else if (pathname.startsWith('/api/games/') && pathname !== '/api/games' && pathname !== '/api/games/scan') {
      const gameId = pathname.split('/')[3];
      const catalog = readJson('games/catalog.json') || { games: [] };
      const game = (catalog.games || []).find(g => g.id === gameId);
      if (!game) { send(404, JSON.stringify({ ok: false, error: 'Game not found' })); return; }
      const profiles = readJson('profiles.json') || {};
      if (!profiles.gameData) profiles.gameData = {};
      if (!profiles.gameData[gameId]) profiles.gameData[gameId] = { playCount: 0, highScores: [], sessions: [], state: {} };
      if (method === 'POST') {
        const b = await body(req);
        if (b.action === 'save-score') {
          profiles.gameData[gameId].highScores.push({ score: b.score, player: b.player || 'Anonymous', date: new Date().toISOString() });
        }
        if (b.action === 'save-state') {
          profiles.gameData[gameId].state = b.state || {};
        }
        if (b.action === 'save-session') {
          profiles.gameData[gameId].sessions.push({ duration: b.duration || 0, date: new Date().toISOString() });
        }
        if (b.action === 'launch') {
          profiles.gameData[gameId].playCount = (profiles.gameData[gameId].playCount || 0) + 1;
        }
        writeJson('profiles.json', profiles);
      }
      const fresh = readJson('profiles.json') || {};
      const gd = (fresh.gameData && fresh.gameData[gameId]) || profiles.gameData[gameId];
      send(200, JSON.stringify({ ok: true, game, stats: gd }));
    }
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

    // == APPS ==
    else if (pathname === '/api/apps') {
      const catalog = readJson('apps/catalog.json') || { apps: [] };
      send(200, JSON.stringify({ ok: true, data: catalog.apps, total: catalog.apps.length }));
    }
    else if (pathname.startsWith('/api/apps/') && pathname !== '/api/apps' && pathname !== '/api/apps/launch') {
      const appId = pathname.split('/')[3];
      const catalog = readJson('apps/catalog.json') || { apps: [] };
      const app = (catalog.apps || []).find(a => a.id === appId);
      if (!app) { send(404, JSON.stringify({ ok: false, error: 'App not found' })); return; }
      const profiles = readJson('profiles.json') || {};
      if (!profiles.appData) profiles.appData = {};
      if (!profiles.appData[appId]) profiles.appData[appId] = { launchCount: 0, lastLaunched: null };
      if (method === 'POST') {
        const b = await body(req);
        if (b.action === 'launch') {
          profiles.appData[appId].launchCount = (profiles.appData[appId].launchCount || 0) + 1;
          profiles.appData[appId].lastLaunched = new Date().toISOString();
        }
        writeJson('profiles.json', profiles);
      }
      const fresh = readJson('profiles.json') || {};
      const ad = (fresh.appData && fresh.appData[appId]) || profiles.appData[appId];
      send(200, JSON.stringify({ ok: true, app, stats: ad }));
    }
    else if (pathname === '/api/apps/launch') {
      const b = await body(req);
      const catalog = readJson('apps/catalog.json') || { apps: [] };
      const app = (catalog.apps || []).find(a => a.id === b.id);
      if (!app) { send(404, JSON.stringify({ ok: false, error: 'App not found' })); return; }
      const profiles = readJson('profiles.json') || {};
      if (!profiles.appData) profiles.appData = {};
      if (!profiles.appData[b.id]) profiles.appData[b.id] = { launchCount: 0, lastLaunched: null };
      profiles.appData[b.id].launchCount = (profiles.appData[b.id].launchCount || 0) + 1;
      profiles.appData[b.id].lastLaunched = new Date().toISOString();
      writeJson('profiles.json', profiles);
      const launchUrl = app.launchUrl || app.webUrl || '';
      send(200, JSON.stringify({ ok: true, app, launchUrl }));
    }
    else if (pathname === '/api/game/play') {
      const id = params.id;
      const catalog = readJson('games/catalog.json') || { games: [] };
      const game = (catalog.games || []).find(g => g.id === id);
      if (!game) { send(404, JSON.stringify({ ok: false, error: 'Game not found' })); return; }
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
    else if (pathname === '/api/launch') {
      const b = await body(req);
      const catalog = readJson('games/catalog.json') || { games: [] };
      const game = (catalog.games || []).find(g => g.id === b.id);
      if (!game) { send(404, JSON.stringify({ ok: false, error: 'Game not found' })); return; }
      const profiles = readJson('profiles.json') || {};
      if (!profiles.gameData) profiles.gameData = {};
      if (!profiles.gameData[b.id]) profiles.gameData[b.id] = { playCount: 0, highScores: [], sessions: [], state: {} };
      profiles.gameData[b.id].playCount = (profiles.gameData[b.id].playCount || 0) + 1;
      writeJson('profiles.json', profiles);
      const launchUrl = game.localPath ? (game.localPath.startsWith('http') ? game.localPath : 'http://127.0.0.1:' + PORT + game.localPath) : (game.launchUrl || game.path || '');
      send(200, JSON.stringify({ ok: true, game, launchUrl }));
    }

    // == AI ASSISTANT ==
    else if (pathname === '/api/ai/chat') {
      const b = await body(req);
      const message = (b.message || '').trim().toLowerCase();
      const conversations = readJson('profiles.json')?.aiConversations || [];
      conversations.push({ role: 'user', content: b.message, timestamp: new Date().toISOString() });

      let response = '';
      if (message.includes('hello') || message.includes('hi')) {
        response = 'Hello! I\'m your RQBBOX AI Assistant. How can I help you today?';
      } else if (message.includes('translate') && message.includes(' to ')) {
        const parts = message.split(' to ');
        const text = parts[0].replace(/translate\s*/i, '').trim();
        const lang = parts[1]?.trim() || 'spanish';
        response = `[Translation to ${lang}]: "${text}" — (Translation engine ready)`;
      } else if (message.includes('summarize') || message.includes('summarize')) {
        response = 'Please provide the text you\'d like me to summarize. I can create concise summaries of any content.';
      } else if (message.includes('code') || message.includes('write') || message.includes('program')) {
        response = 'I can help you write, debug, and review code. What language or project are you working on?';
      } else if (message.includes('debug') || message.includes('bug') || message.includes('error')) {
        response = 'I\'ll help you debug. Please share your code, the error message, and what you\'ve tried so far.';
      } else if (message.includes('create') || message.includes('write') || message.includes('content')) {
        response = 'I can help create content — articles, emails, stories, social posts, and more. What kind of content do you need?';
      } else if (message.includes('note') || message.includes('remember')) {
        response = 'I can help you take notes. Would you like to create a new note or organize your existing ones?';
      } else if (message.includes('workflow') || message.includes('automate')) {
        response = 'I can help design and automate workflows. What process would you like to streamline?';
      } else if (message.includes('productivity') || message.includes('task') || message.includes('todo')) {
        response = 'I can help manage your tasks and boost productivity. Would you like to create tasks, set reminders, or plan your schedule?';
      } else if (message.includes('weather') || message.includes('time')) {
        const now = new Date();
        response = `It's ${now.toLocaleString()}. You're running RQBBOX Experience on ${os.hostname()}. I can fetch weather data with internet connectivity enabled.`;
      } else if (message.includes('help') || message.includes('what can you do')) {
        response = 'I can: answer questions, write content, summarize documents, assist with coding, debug errors, translate text, manage workflows, track tasks, take notes, provide productivity tips, and help with file organization. What would you like help with?';
      } else {
        response = `I understand you're asking about "${b.message}". I'm your AI assistant integrated into RQBBOX Experience. I can help with questions, content creation, coding, translation, summarization, productivity, and more. How would you like me to assist?`;
      }

      conversations.push({ role: 'assistant', content: response, timestamp: new Date().toISOString() });
      if (conversations.length > 100) conversations.splice(0, conversations.length - 100);
      const profiles = readJson('profiles.json') || {};
      profiles.aiConversations = conversations;
      writeJson('profiles.json', profiles);

      send(200, JSON.stringify({ ok: true, response }));
    }
    else if (pathname === '/api/ai/history') {
      const profiles = readJson('profiles.json') || {};
      send(200, JSON.stringify({ ok: true, history: profiles.aiConversations || [] }));
    }
    else if (pathname === '/api/ai/clear') {
      const profiles = readJson('profiles.json') || {};
      profiles.aiConversations = [];
      writeJson('profiles.json', profiles);
      send(200, JSON.stringify({ ok: true }));
    }
    else if (pathname === '/api/ai/summarize') {
      const b = await body(req);
      const text = (b.text || '').trim();
      if (text.length < 10) { send(400, JSON.stringify({ ok: false, error: 'Text too short' })); return; }
      const words = text.split(/\s+/).length;
      const summary = text.length > 200 ? text.slice(0, Math.min(300, Math.floor(text.length / 3))) + '...' : text;
      send(200, JSON.stringify({ ok: true, originalLength: text.length, wordCount: words, summary }));
    }
    else if (pathname === '/api/ai/translate') {
      const b = await body(req);
      send(200, JSON.stringify({ ok: true, translated: `[${b.targetLang || 'en'}]: ${b.text}`, detectedLang: 'auto' }));
    }

    // == PRODUCTIVITY: NOTES ==
    else if (pathname === '/api/notes') {
      if (method === 'GET') {
        const profiles = readJson('profiles.json') || {};
        send(200, JSON.stringify({ ok: true, notes: profiles.notes || [] }));
      } else {
        const b = await body(req);
        const profiles = readJson('profiles.json') || {};
        if (!profiles.notes) profiles.notes = [];
        if (b.action === 'create') {
          profiles.notes.push({ id: generateId(), title: b.title || 'Untitled Note', content: b.content || '', tags: b.tags || [], pinned: false, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
        } else if (b.action === 'update') {
          const idx = profiles.notes.findIndex(n => n.id === b.id);
          if (idx >= 0) { profiles.notes[idx] = { ...profiles.notes[idx], ...b, updatedAt: new Date().toISOString() }; }
        } else if (b.action === 'delete') {
          profiles.notes = profiles.notes.filter(n => n.id !== b.id);
        } else if (b.action === 'pin') {
          const idx = profiles.notes.findIndex(n => n.id === b.id);
          if (idx >= 0) profiles.notes[idx].pinned = !profiles.notes[idx].pinned;
        }
        writeJson('profiles.json', profiles);
        send(200, JSON.stringify({ ok: true, notes: profiles.notes }));
      }
    }

    // == PRODUCTIVITY: TASKS ==
    else if (pathname === '/api/tasks') {
      if (method === 'GET') {
        const profiles = readJson('profiles.json') || {};
        send(200, JSON.stringify({ ok: true, tasks: profiles.tasks || [] }));
      } else {
        const b = await body(req);
        const profiles = readJson('profiles.json') || {};
        if (!profiles.tasks) profiles.tasks = [];
        if (b.action === 'create') {
          profiles.tasks.push({ id: generateId(), title: b.title || 'Untitled Task', description: b.description || '', priority: b.priority || 'medium', category: b.category || '', completed: false, dueDate: b.dueDate || null, createdAt: new Date().toISOString() });
        } else if (b.action === 'update') {
          const idx = profiles.tasks.findIndex(t => t.id === b.id);
          if (idx >= 0) profiles.tasks[idx] = { ...profiles.tasks[idx], ...b };
        } else if (b.action === 'toggle') {
          const idx = profiles.tasks.findIndex(t => t.id === b.id);
          if (idx >= 0) profiles.tasks[idx].completed = !profiles.tasks[idx].completed;
        } else if (b.action === 'delete') {
          profiles.tasks = profiles.tasks.filter(t => t.id !== b.id);
        }
        writeJson('profiles.json', profiles);
        send(200, JSON.stringify({ ok: true, tasks: profiles.tasks }));
      }
    }

    // == PRODUCTIVITY: CALENDAR ==
    else if (pathname === '/api/calendar') {
      if (method === 'GET') {
        const profiles = readJson('profiles.json') || {};
        send(200, JSON.stringify({ ok: true, events: profiles.calendarEvents || [] }));
      } else {
        const b = await body(req);
        const profiles = readJson('profiles.json') || {};
        if (!profiles.calendarEvents) profiles.calendarEvents = [];
        if (b.action === 'create') {
          profiles.calendarEvents.push({ id: generateId(), title: b.title || 'Event', date: b.date || new Date().toISOString(), description: b.description || '', category: b.category || 'default' });
        } else if (b.action === 'delete') {
          profiles.calendarEvents = profiles.calendarEvents.filter(e => e.id !== b.id);
        }
        writeJson('profiles.json', profiles);
        send(200, JSON.stringify({ ok: true, events: profiles.calendarEvents }));
      }
    }

    // == MEDIA: MUSIC ==
    else if (pathname === '/api/media/music') {
      if (method === 'GET') {
        const profiles = readJson('profiles.json') || {};
        send(200, JSON.stringify({ ok: true, playlist: profiles.musicPlaylist || [], currentTrack: profiles.currentTrack || null }));
      } else {
        const b = await body(req);
        const profiles = readJson('profiles.json') || {};
        if (!profiles.musicPlaylist) profiles.musicPlaylist = [];
        if (b.action === 'add') {
          profiles.musicPlaylist.push({ id: generateId(), title: b.title || 'Unknown', artist: b.artist || 'Unknown', url: b.url, cover: b.cover, duration: b.duration || 0 });
        } else if (b.action === 'remove') {
          profiles.musicPlaylist = profiles.musicPlaylist.filter(t => t.id !== b.id);
        } else if (b.action === 'play') {
          profiles.currentTrack = b.id;
        } else if (b.action === 'clear') {
          profiles.musicPlaylist = [];
          profiles.currentTrack = null;
        }
        writeJson('profiles.json', profiles);
        send(200, JSON.stringify({ ok: true, playlist: profiles.musicPlaylist, currentTrack: profiles.currentTrack }));
      }
    }

    // == CLOUD FEATURES ==
    else if (pathname === '/api/cloud/status') {
      const profiles = readJson('profiles.json') || {};
      send(200, JSON.stringify({ ok: true, cloud: profiles.cloud || { enabled: false, lastSync: null, storageUsed: 0, storageTotal: 1073741824, deviceName: os.hostname() } }));
    }
    else if (pathname === '/api/cloud/sync') {
      const profiles = readJson('profiles.json') || {};
      if (!profiles.cloud) profiles.cloud = { enabled: true, lastSync: null, storageUsed: 0, storageTotal: 1073741824, deviceName: os.hostname() };
      profiles.cloud.lastSync = new Date().toISOString();
      profiles.cloud.storageUsed = Math.floor(Math.random() * profiles.cloud.storageTotal);
      writeJson('profiles.json', profiles);
      send(200, JSON.stringify({ ok: true, cloud: profiles.cloud }));
    }

    // == FILE MANAGEMENT ==
    else if (pathname === '/api/files/list') {
      const targetPath = params.path || ROOT;
      const resolved = path.resolve(targetPath);
      if (!resolved.startsWith(path.resolve(ROOT)) && !resolved.startsWith('C:\\')) {
        if (!/^[A-Z]:\\/i.test(resolved)) { send(403, JSON.stringify({ ok: false, error: 'Access denied' })); return; }
      }
      try {
        const items = fs.readdirSync(resolved, { withFileTypes: true }).map(dirent => {
          const fullPath = path.join(resolved, dirent.name);
          let stat;
          try { stat = fs.statSync(fullPath); } catch { stat = { size: 0, mtime: new Date(), isDirectory: () => dirent.isDirectory() }; }
          return { name: dirent.name, path: fullPath, size: stat.size, modified: stat.mtime, isDirectory: dirent.isDirectory(), isFile: dirent.isFile(), ext: path.extname(dirent.name).toLowerCase() };
        }).sort((a, b) => {
          if (a.isDirectory !== b.isDirectory) return a.isDirectory ? -1 : 1;
          return a.name.localeCompare(b.name);
        });
        send(200, JSON.stringify({ ok: true, path: resolved, parent: path.dirname(resolved), items }));
      } catch (e) {
        send(500, JSON.stringify({ ok: false, error: e.message }));
      }
    }
    else if (pathname === '/api/files/info') {
      const targetPath = params.path;
      if (!targetPath) { send(400, JSON.stringify({ ok: false, error: 'No path provided' })); return; }
      try {
        const stat = fs.statSync(targetPath);
        send(200, JSON.stringify({ ok: true, name: path.basename(targetPath), path: targetPath, size: stat.size, modified: stat.mtime, created: stat.birthtime, isDirectory: stat.isDirectory(), isFile: stat.isFile() }));
      } catch (e) {
        send(404, JSON.stringify({ ok: false, error: 'File not found' }));
      }
    }
    else if (pathname === '/api/files/drives') {
      const { execSync } = require('child_process');
      let drives = [];
      try {
        const out = execSync('wmic logicaldisk get name,size,freespace,description /format:csv', { timeout: 3000, encoding: 'utf-8' });
        const lines = out.trim().split('\n').slice(1);
        drives = lines.map(l => {
          const parts = l.split(',');
          if (parts.length < 4) return null;
          return { drive: parts[0]?.trim(), description: parts[3]?.trim() || 'Local Disk', size: parseInt(parts[2]) || 0, free: parseInt(parts[1]) || 0 };
        }).filter(Boolean);
      } catch {}
      if (drives.length === 0) {
        drives = ['A','B','C','D','E','F','G','H','I','J'].map(d => {
          try {
            const s = fs.statSync(d + ':\\');
            if (s) return { drive: d + ':', description: 'Drive', size: 0, free: 0 };
          } catch {}
          return null;
        }).filter(Boolean);
      }
      send(200, JSON.stringify({ ok: true, drives }));
    }
    else if (pathname === '/api/files/read' && method === 'POST') {
      const b = await body(req);
      try {
        const content = fs.readFileSync(b.path, b.encoding || 'utf-8');
        send(200, JSON.stringify({ ok: true, content }));
      } catch (e) {
        send(500, JSON.stringify({ ok: false, error: e.message }));
      }
    }
    else if (pathname === '/api/files/write' && method === 'POST') {
      const b = await body(req);
      try {
        fs.mkdirSync(path.dirname(b.path), { recursive: true });
        fs.writeFileSync(b.path, b.content, b.encoding || 'utf-8');
        send(200, JSON.stringify({ ok: true }));
      } catch (e) {
        send(500, JSON.stringify({ ok: false, error: e.message }));
      }
    }
    else if (pathname === '/api/files/delete' && method === 'POST') {
      const b = await body(req);
      try {
        if (fs.statSync(b.path).isDirectory()) { fs.rmSync(b.path, { recursive: true, force: true }); }
        else { fs.unlinkSync(b.path); }
        send(200, JSON.stringify({ ok: true }));
      } catch (e) {
        send(500, JSON.stringify({ ok: false, error: e.message }));
      }
    }
    else if (pathname === '/api/files/move' && method === 'POST') {
      const b = await body(req);
      try {
        fs.mkdirSync(path.dirname(b.dest), { recursive: true });
        fs.renameSync(b.source, b.dest);
        send(200, JSON.stringify({ ok: true }));
      } catch (e) {
        send(500, JSON.stringify({ ok: false, error: e.message }));
      }
    }
    else if (pathname === '/api/files/compress' && method === 'POST') {
      const b = await body(req);
      try {
        const zipPath = b.output || (b.source + '.zip');
        const { execSync } = require('child_process');
        execSync(`powershell -NoProfile -Command "Compress-Archive -Path '${b.source}' -DestinationPath '${zipPath}' -Force"`, { timeout: 30000 });
        send(200, JSON.stringify({ ok: true, output: zipPath }));
      } catch (e) {
        send(500, JSON.stringify({ ok: false, error: e.message }));
      }
    }
    else if (pathname === '/api/files/extract' && method === 'POST') {
      const b = await body(req);
      try {
        const dest = b.destination || path.join(path.dirname(b.source), path.basename(b.source, '.zip'));
        const { execSync } = require('child_process');
        execSync(`powershell -NoProfile -Command "Expand-Archive -Path '${b.source}' -DestinationPath '${dest}' -Force"`, { timeout: 30000 });
        send(200, JSON.stringify({ ok: true, output: dest }));
      } catch (e) {
        send(500, JSON.stringify({ ok: false, error: e.message }));
      }
    }

    // == PORTABLE MODE ==
    else if (pathname === '/api/portable') {
      const isPortable = fs.existsSync(path.join(ROOT, 'portable.txt')) || process.argv.includes('--portable') || fs.existsSync(path.join(ROOT, '..', 'Portable'));
      const usbDrives = [];
      try {
        const drives = fs.readdirSync('/');
        drives.forEach(d => {
          if (/^[A-Z]$/i.test(d)) {
            const drivePath = d + ':\\';
            try {
              const stat = fs.statSync(drivePath);
              if (stat) {
                usbDrives.push({ drive: drivePath, label: d.toUpperCase() + ': Drive', isCurrentDrive: ROOT.startsWith(drivePath) });
              }
            } catch {}
          }
        });
      } catch {}
      send(200, JSON.stringify({ ok: true, isPortable, usbDrives, rootPath: ROOT }));
    }

    // == ACHIEVEMENTS ==
    else if (pathname === '/api/achievements') {
      const profiles = readJson('profiles.json') || {};
      const userId = params.userId || params.token;
      let achievements = profiles.achievements || [];
      if (userId) {
        const user = (profiles.users || []).find(u => u.id === userId || u.token === userId);
        if (user) achievements = (user.achievements || []);
      }
      send(200, JSON.stringify({ ok: true, data: achievements, total: achievements.length }));
    }
    else if (pathname === '/api/achievements/unlock') {
      const b = await body(req);
      const profiles = readJson('profiles.json') || {};
      const user = (profiles.users || []).find(u => u.token === b.token);
      if (!user) { send(401, JSON.stringify({ ok: false, error: 'Unauthorized' })); return; }
      if (!user.achievements) user.achievements = [];
      if (!user.achievements.find(a => a.id === b.id)) {
        user.achievements.push({ id: b.id, title: b.title, icon: b.icon, unlockedAt: new Date().toISOString() });
        writeJson('profiles.json', profiles);
      }
      send(200, JSON.stringify({ ok: true, achievements: user.achievements }));
    }

    // == PERFORMANCE ==
    else if (pathname === '/api/performance') {
      const info = getSysInfo();
      let fps = 60;
      send(200, JSON.stringify({
        ok: true,
        cpu: { model: info.cpuModel, cores: info.cpuCores, load: info.cpuLoad },
        memory: { total: info.memoryTotal, used: info.memoryUsed, free: info.memoryFree, pct: info.memoryPct },
        fps,
        mode: params.mode || 'performance',
      }));
    }

    // == QUICK RESUME ==
    else if (pathname === '/api/quick-resume') {
      if (method === 'GET') {
        const profiles = readJson('profiles.json') || {};
        send(200, JSON.stringify({ ok: true, sessions: profiles.quickResume || [] }));
      } else {
        const b = await body(req);
        const profiles = readJson('profiles.json') || {};
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

    // == FRIENDS ==
    else if (pathname === '/api/friends') {
      if (method === 'GET') {
        const profiles = readJson('profiles.json') || {};
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

    // == CHAT ==
    else if (pathname === '/api/chat/send' && method === 'POST') {
      const b = await body(req);
      const profiles = readJson('profiles.json') || {};
      if (!profiles.messages) profiles.messages = [];
      const msg = { id: generateId(), from: b.from || 'Anonymous', fromAvatar: b.fromAvatar || '?', text: b.text || '', room: b.room || 'general', timestamp: new Date().toISOString() };
      if (msg.text.trim()) { profiles.messages.push(msg); writeJson('profiles.json', profiles); }
      send(200, JSON.stringify({ ok: true, message: msg }));
    }
    else if (pathname === '/api/chat/messages') {
      const profiles = readJson('profiles.json') || {};
      const room = params.room || 'general';
      const limit = Math.min(parseInt(params.limit) || 50, 200);
      const messages = (profiles.messages || []).filter(m => m.room === room).slice(-limit);
      send(200, JSON.stringify({ ok: true, messages, total: (profiles.messages || []).filter(m => m.room === room).length }));
    }

    // == AUTH ==
    else if (pathname === '/api/auth') {
      const b = await body(req);
      const profiles = readJson('profiles.json') || {};
      const user = (profiles.users || []).find(u => u.username === b.username || u.name === b.username || u.email === b.username);
      if (!user) { send(401, JSON.stringify({ ok: false, error: 'User not found' })); return; }
      if (user.pin && user.pin !== b.password) { send(401, JSON.stringify({ ok: false, error: 'Invalid credentials' })); return; }
      const token = require('crypto').randomBytes(32).toString('hex');
      user.token = token;
      writeJson('profiles.json', profiles);
      send(200, JSON.stringify({ ok: true, user, token }));
    }
    else if (pathname === '/api/register') {
      const b = await body(req);
      const profiles = readJson('profiles.json') || {};
      if ((profiles.users || []).some(u => u.username === b.username)) { send(409, JSON.stringify({ ok: false, error: 'Username taken' })); return; }
      const token = require('crypto').randomBytes(32).toString('hex');
      const user = { id: 'user-' + Math.random().toString(36).slice(2, 10), name: b.name, username: b.username, token, avatar: b.name[0].toUpperCase(), theme: 'default', achievements: [], friends: [], friendRequests: [], stats: { gamesLaunched: 0, playTime: 0, captures: 0 }, createdAt: new Date().toISOString() };
      profiles.users.push(user);
      writeJson('profiles.json', profiles);
      send(200, JSON.stringify({ ok: true, user, token }));
    }

    // == CAPTURES ==
    else if (pathname === '/api/captures') {
      const dir = path.join(ROOT, 'captures');
      let files = [];
      try {
        files = fs.readdirSync(dir).filter(f => /\.(png|jpg|jpeg|webm|mp4)$/i.test(f)).map(name => {
          const stat = fs.statSync(path.join(dir, name));
          return { name, path: `captures/${name}`, size: stat.size, modified: stat.mtime };
        }).sort((a, b) => b.modified - a.modified);
      } catch {}
      send(200, JSON.stringify({ ok: true, captures: files }));
    }
    else if (pathname === '/api/screenshot') {
      const b = await body(req);
      const dir = path.join(ROOT, 'captures');
      fs.mkdirSync(dir, { recursive: true });
      const name = `screenshot-${new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')}.png`;
      if (b.base64) fs.writeFileSync(path.join(dir, name), Buffer.from(b.base64, 'base64'));
      send(200, JSON.stringify({ ok: true, path: `captures/${name}` }));
    }

    // == THEMES ==
    else if (pathname === '/api/themes') {
      const themesDir = path.join(ROOT, 'css', 'themes');
      let themes = [];
      try {
        themes = fs.readdirSync(themesDir).filter(f => f.endsWith('.css')).map(f => ({ id: f.replace('.css', ''), name: f.replace('.css', '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()), file: f }));
      } catch {}
      send(200, JSON.stringify({ ok: true, themes }));
    }

    // == SYSTEM OPTIMIZATION ==
    else if (pathname === '/api/system/optimize') {
      const b = method === 'POST' ? await body(req) : {};
      const { execSync } = require('child_process');
      let result = { ok: true, actions: [] };
      try {
        if (b.action === 'enable') {
          execSync('reg add "HKCU\\Software\\Microsoft\\GameBar" /v AutoGameModeEnabled /t REG_DWORD /d 1 /f 2>nul', { timeout: 2000 });
          result.mode = 'enabled';
          result.message = 'System optimized for performance';
        } else if (b.action === 'disable') {
          execSync('reg add "HKCU\\Software\\Microsoft\\GameBar" /v AutoGameModeEnabled /t REG_DWORD /d 0 /f 2>nul', { timeout: 2000 });
          result.mode = 'disabled';
          result.message = 'System restored to default';
        } else {
          const out = execSync('reg query "HKCU\\Software\\Microsoft\\GameBar" /v AutoGameModeEnabled 2>nul', { timeout: 2000, encoding: 'utf-8' });
          result.mode = out.includes('0x1') ? 'enabled' : 'disabled';
        }
      } catch (e) { result.mode = 'unknown'; result.error = e.message; }
      send(200, JSON.stringify(result));
    }
    else if (pathname === '/api/system/notifications') {
      const b = method === 'POST' ? await body(req) : {};
      const { execSync } = require('child_process');
      let result = { ok: true };
      try {
        if (b.action === 'suppress') {
          execSync('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Notifications\\Settings" /v "NOC_GLOBAL_SETTING_TOASTS_ENABLED" /t REG_DWORD /d 0 /f 2>nul', { timeout: 2000 });
          result.mode = 'suppressed';
        } else if (b.action === 'restore') {
          execSync('reg add "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Notifications\\Settings" /v "NOC_GLOBAL_SETTING_TOASTS_ENABLED" /t REG_DWORD /d 1 /f 2>nul', { timeout: 2000 });
          result.mode = 'restored';
        } else {
          const out = execSync('reg query "HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Notifications\\Settings" /v "NOC_GLOBAL_SETTING_TOASTS_ENABLED" 2>nul', { timeout: 2000, encoding: 'utf-8' });
          result.mode = out.includes('0x1') ? 'enabled' : 'suppressed';
        }
      } catch {}
      send(200, JSON.stringify(result));
    }

    // == PROCESSES ==
    else if (pathname === '/api/processes') {
      const { execSync } = require('child_process');
      try {
        const out = execSync('powershell -NoProfile -Command "Get-Process | Select-Object -First 50 Id,ProcessName,CPU,WorkingSet64 | ConvertTo-Json"', { timeout: 5000, encoding: 'utf-8' });
        const procs = JSON.parse(out || '[]');
        send(200, JSON.stringify({ ok: true, processes: Array.isArray(procs) ? procs : [procs] }));
      } catch (e) {
        send(200, JSON.stringify({ ok: true, processes: [], error: e.message }));
      }
    }

    // == GPU INFO ==
    else if (pathname === '/api/gpu') {
      const { execSync } = require('child_process');
      try {
        const out = execSync('powershell -NoProfile -Command "Get-CimInstance Win32_VideoController | Select-Object Name,AdapterRAM,DriverVersion,VideoProcessor | ConvertTo-Json"', { timeout: 5000, encoding: 'utf-8' });
        const gpus = JSON.parse(out || '[]');
        send(200, JSON.stringify({ ok: true, gpus: Array.isArray(gpus) ? gpus : [gpus] }));
      } catch (e) {
        send(200, JSON.stringify({ ok: true, gpus: [], error: e.message }));
      }
    }

    // == NETWORK STATS ==
    else if (pathname === '/api/network') {
      const { execSync } = require('child_process');
      try {
        const out = execSync('powershell -NoProfile -Command "Get-NetAdapter | Where-Object {$_.Status -eq \'Up\'} | Select-Object Name,InterfaceDescription,LinkSpeed,MacAddress | ConvertTo-Json"', { timeout: 5000, encoding: 'utf-8' });
        const adapters = JSON.parse(out || '[]');
        const info = getSysInfo();
        send(200, JSON.stringify({ ok: true, adapters: Array.isArray(adapters) ? adapters : [adapters], hostname: info.hostname, platform: info.platform }));
      } catch (e) {
        send(200, JSON.stringify({ ok: true, adapters: [], hostname: os.hostname(), platform: os.platform(), error: e.message }));
      }
    }

    // == STORAGE USAGE ==
    else if (pathname === '/api/storage') {
      const { execSync } = require('child_process');
      try {
        const out = execSync('wmic logicaldisk get name,size,freespace,filesystem /format:csv', { timeout: 5000, encoding: 'utf-8' });
        const lines = out.trim().split('\n').slice(1);
        const disks = lines.map(l => {
          const p = l.split(',');
          if (p.length < 4) return null;
          return { drive: p[0]?.trim(), filesystem: p[1]?.trim() || 'NTFS', free: parseInt(p[2]) || 0, size: parseInt(p[3]) || 0 };
        }).filter(d => d && d.size > 0);
        send(200, JSON.stringify({ ok: true, disks }));
      } catch (e) {
        send(200, JSON.stringify({ ok: true, disks: [], error: e.message }));
      }
    }

    // == TERMINAL ==
    else if (pathname === '/api/terminal/exec' && method === 'POST') {
      const b = await body(req);
      const cmd = (b.command || '').trim();
      if (!cmd) { send(400, JSON.stringify({ ok: false, error: 'No command' })); return; }
      const { execSync } = require('child_process');
      try {
        const out = execSync(cmd, { timeout: 10000, encoding: 'utf-8', shell: 'powershell.exe', maxBuffer: 1024 * 1024 });
        send(200, JSON.stringify({ ok: true, output: out.slice(0, 10000) }));
      } catch (e) {
        send(200, JSON.stringify({ ok: false, output: (e.stdout || '') + '\n' + (e.stderr || e.message), exitCode: e.status }));
      }
    }

    // == APP STORE ==
    else if (pathname === '/api/store') {
      const storeApps = [
        { id: 'store-vscode', title: 'Visual Studio Code', category: 'Development', rating: 4.8, downloads: '50M+', icon: '📝', description: 'Code editor by Microsoft', free: true },
        { id: 'store-discord', title: 'Discord', category: 'Communication', rating: 4.7, downloads: '100M+', icon: '💬', description: 'Voice, video and text chat', free: true },
        { id: 'store-obs', title: 'OBS Studio', category: 'Streaming', rating: 4.6, downloads: '20M+', icon: '🎬', description: 'Open Broadcaster Software', free: true },
        { id: 'store-blender', title: 'Blender', category: '3D Modeling', rating: 4.5, downloads: '10M+', icon: '🧊', description: '3D creation suite', free: true },
        { id: 'store-gimp', title: 'GIMP', category: 'Graphics', rating: 4.3, downloads: '15M+', icon: '🎨', description: 'Image manipulation program', free: true },
        { id: 'store-7zip', title: '7-Zip', category: 'Utilities', rating: 4.9, downloads: '100M+', icon: '📦', description: 'File archiver', free: true },
        { id: 'store-vlc', title: 'VLC Media Player', category: 'Media', rating: 4.7, downloads: '200M+', icon: '🎵', description: 'Multimedia player', free: true },
        { id: 'store-notepad', title: 'Notepad++', category: 'Development', rating: 4.6, downloads: '30M+', icon: '📄', description: 'Source code editor', free: true },
        { id: 'store-firefox', title: 'Mozilla Firefox', category: 'Browser', rating: 4.5, downloads: '500M+', icon: '🦊', description: 'Fast, private web browser', free: true },
        { id: 'store-brave', title: 'Brave Browser', category: 'Browser', rating: 4.4, downloads: '50M+', icon: '🦁', description: 'Privacy-focused browser', free: true },
        { id: 'store-handbrake', title: 'HandBrake', category: 'Media', rating: 4.5, downloads: '10M+', icon: '🎞', description: 'Video transcoder', free: true },
        { id: 'store-docker', title: 'Docker Desktop', category: 'Development', rating: 4.4, downloads: '20M+', icon: '🐳', description: 'Container platform', free: true },
        { id: 'store-github', title: 'GitHub Desktop', category: 'Development', rating: 4.3, downloads: '15M+', icon: '🐙', description: 'Git GUI client', free: true },
        { id: 'store-potplayer', title: 'PotPlayer', category: 'Media', rating: 4.6, downloads: '10M+', icon: '▶', description: 'Multimedia player', free: true },
        { id: 'store-obsidian', title: 'Obsidian', category: 'Productivity', rating: 4.8, downloads: '5M+', icon: '💎', description: 'Knowledge management', free: true },
        { id: 'store-logitech', title: 'Logitech G Hub', category: 'Gaming', rating: 4.2, downloads: '20M+', icon: '🖱', description: 'Peripheral management', free: true },
        { id: 'store-rainmeter', title: 'Rainmeter', category: 'Customization', rating: 4.7, downloads: '10M+', icon: '🌧', description: 'Desktop customization', free: true },
        { id: 'store-mpv', title: 'mpv player', category: 'Media', rating: 4.5, downloads: '5M+', icon: '🎥', description: 'Minimalist media player', free: true },
        { id: 'store-neovim', title: 'Neovim', category: 'Development', rating: 4.6, downloads: '3M+', icon: '🟢', description: 'Hyperextensible Vim-based text editor', free: true },
        { id: 'store-autohotkey', title: 'AutoHotkey', category: 'Utilities', rating: 4.5, downloads: '10M+', icon: '⌨', description: 'Automation scripting', free: true }
      ];
      const q = (params.q || '').toLowerCase();
      let filtered = storeApps;
      if (q) filtered = storeApps.filter(a => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q));
      send(200, JSON.stringify({ ok: true, apps: filtered, total: filtered.length }));
    }

    // == STREAMING ==
    else if (pathname === '/api/streaming/status') {
      const profiles = readJson('profiles.json') || {};
      send(200, JSON.stringify({ ok: true, streaming: profiles.streaming || { active: false, platform: null, startedAt: null, viewerCount: 0 } }));
    }
    else if (pathname === '/api/streaming/toggle' && method === 'POST') {
      const b = await body(req);
      const profiles = readJson('profiles.json') || {};
      if (!profiles.streaming) profiles.streaming = { active: false, platform: null, startedAt: null, viewerCount: 0 };
      profiles.streaming.active = !profiles.streaming.active;
      profiles.streaming.platform = b.platform || 'Twitch';
      if (profiles.streaming.active) profiles.streaming.startedAt = new Date().toISOString();
      else { profiles.streaming.startedAt = null; profiles.streaming.viewerCount = 0; }
      writeJson('profiles.json', profiles);
      send(200, JSON.stringify({ ok: true, streaming: profiles.streaming }));
    }

    // == NOTIFICATIONS ==
    else if (pathname === '/api/notifications') {
      const profiles = readJson('profiles.json') || {};
      send(200, JSON.stringify({ ok: true, notifications: profiles.notifications || [] }));
    }
    else if (pathname === '/api/notifications/push' && method === 'POST') {
      const b = await body(req);
      const profiles = readJson('profiles.json') || {};
      if (!profiles.notifications) profiles.notifications = [];
      const notif = { id: generateId(), title: b.title || 'Notification', message: b.message || '', type: b.type || 'info', timestamp: new Date().toISOString(), read: false };
      profiles.notifications.unshift(notif);
      if (profiles.notifications.length > 100) profiles.notifications = profiles.notifications.slice(0, 100);
      writeJson('profiles.json', profiles);
      send(200, JSON.stringify({ ok: true, notification: notif }));
    }
    else if (pathname === '/api/notifications/clear' && method === 'POST') {
      const profiles = readJson('profiles.json') || {};
      profiles.notifications = [];
      writeJson('profiles.json', profiles);
      send(200, JSON.stringify({ ok: true }));
    }

    // == WIDGETS ==
    else if (pathname === '/api/widgets') {
      if (method === 'GET') {
        const profiles = readJson('profiles.json') || {};
        send(200, JSON.stringify({ ok: true, widgets: profiles.widgets || { clock: true, weather: true, systemStats: true, calendar: true, notes: true } }));
      } else {
        const b = await body(req);
        const profiles = readJson('profiles.json') || {};
        profiles.widgets = b.widgets || profiles.widgets || {};
        writeJson('profiles.json', profiles);
        send(200, JSON.stringify({ ok: true, widgets: profiles.widgets }));
      }
    }

    // == ALARMS ==
    else if (pathname === '/api/alarms') {
      if (method === 'GET') {
        const profiles = readJson('profiles.json') || {};
        send(200, JSON.stringify({ ok: true, alarms: profiles.alarms || [] }));
      } else {
        const b = await body(req);
        const profiles = readJson('profiles.json') || {};
        if (!profiles.alarms) profiles.alarms = [];
        if (b.action === 'create') {
          profiles.alarms.push({ id: generateId(), time: b.time, label: b.label || 'Alarm', enabled: true, createdAt: new Date().toISOString() });
        } else if (b.action === 'toggle') {
          const alarm = profiles.alarms.find(a => a.id === b.id);
          if (alarm) alarm.enabled = !alarm.enabled;
        } else if (b.action === 'delete') {
          profiles.alarms = profiles.alarms.filter(a => a.id !== b.id);
        }
        writeJson('profiles.json', profiles);
        send(200, JSON.stringify({ ok: true, alarms: profiles.alarms }));
      }
    }

    // == HEALTH ==
    else if (pathname === '/api/health') {
      if (method === 'GET') {
        const profiles = readJson('profiles.json') || {};
        send(200, JSON.stringify({ ok: true, health: profiles.health || { screenTime: 0, breaks: 0, waterIntake: 0, lastBreak: null } }));
      } else {
        const b = await body(req);
        const profiles = readJson('profiles.json') || {};
        if (!profiles.health) profiles.health = { screenTime: 0, breaks: 0, waterIntake: 0, lastBreak: null };
        if (b.action === 'break') { profiles.health.breaks++; profiles.health.lastBreak = new Date().toISOString(); }
        if (b.action === 'water') profiles.health.waterIntake = (profiles.health.waterIntake || 0) + (b.amount || 250);
        if (b.action === 'screenTime') profiles.health.screenTime = (profiles.health.screenTime || 0) + (b.minutes || 1);
        if (b.action === 'reset') { profiles.health = { screenTime: 0, breaks: 0, waterIntake: 0, lastBreak: null }; }
        writeJson('profiles.json', profiles);
        send(200, JSON.stringify({ ok: true, health: profiles.health }));
      }
    }

    // == SCREEN RECORDER ==
    else if (pathname === '/api/recorder') {
      const profiles = readJson('profiles.json') || {};
      send(200, JSON.stringify({ ok: true, recorder: profiles.recorder || { recording: false, startedAt: null, duration: 0 } }));
    }
    else if (pathname === '/api/recorder/toggle' && method === 'POST') {
      const profiles = readJson('profiles.json') || {};
      if (!profiles.recorder) profiles.recorder = { recording: false, startedAt: null, duration: 0 };
      profiles.recorder.recording = !profiles.recorder.recording;
      if (profiles.recorder.recording) profiles.recorder.startedAt = new Date().toISOString();
      else profiles.recorder.startedAt = null;
      writeJson('profiles.json', profiles);
      send(200, JSON.stringify({ ok: true, recorder: profiles.recorder }));
    }

    // == VIRTUAL DESKTOPS ==
    else if (pathname === '/api/desktops') {
      if (method === 'GET') {
        const profiles = readJson('profiles.json') || {};
        send(200, JSON.stringify({ ok: true, desktops: profiles.desktops || [{ id: 1, name: 'Desktop 1', active: true, windows: [] }] }));
      } else {
        const b = await body(req);
        const profiles = readJson('profiles.json') || {};
        if (!profiles.desktops) profiles.desktops = [{ id: 1, name: 'Desktop 1', active: true, windows: [] }];
        if (b.action === 'create') {
          profiles.desktops.push({ id: profiles.desktops.length + 1, name: 'Desktop ' + (profiles.desktops.length + 1), active: false, windows: [] });
        } else if (b.action === 'switch') {
          profiles.desktops.forEach(d => d.active = d.id === b.id);
        } else if (b.action === 'delete') {
          profiles.desktops = profiles.desktops.filter(d => d.id !== b.id);
        }
        writeJson('profiles.json', profiles);
        send(200, JSON.stringify({ ok: true, desktops: profiles.desktops }));
      }
    }

    // == STATIC FILES ==
    else {
      let rel = pathname.replace(/^\//, '');
      if (rel === '' || rel === '/') rel = 'index.html';
      if (rel === 'dashboard') rel = 'dashboard.html';

      // Fix: files like index.html and dashboard.html are in docs/ folder
      let filePath = path.join(ROOT, rel);
      if (!fs.existsSync(filePath)) {
        const docsPath = path.join(ROOT, 'docs', rel);
        if (fs.existsSync(docsPath)) {
          filePath = docsPath;
        }
      }
      // Also try docs/games/ for game icon paths served from dashboard
      if (!fs.existsSync(filePath)) {
        const docsGamesPath = path.join(ROOT, 'docs', 'games', rel);
        if (fs.existsSync(docsGamesPath)) {
          filePath = docsGamesPath;
        }
      }
      const resolvedPath = path.resolve(filePath);

      if (!resolvedPath.startsWith(path.resolve(ROOT))) {
        send(403, '{"ok":false,"error":"Forbidden"}'); return;
      }

      if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
        const indexPath = path.join(resolvedPath, 'index.html');
        if (fs.existsSync(indexPath)) {
          const stat = fs.statSync(indexPath);
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Content-Length': stat.size, 'Cache-Control': 'no-cache', 'Access-Control-Allow-Origin': '*' });
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
      res.writeHead(200, { 'Content-Type': mime(resolvedPath), 'Content-Length': stat.size, 'Cache-Control': cacheControl, 'Access-Control-Allow-Origin': '*' });
      fs.createReadStream(resolvedPath).pipe(res);
    }
  } catch (err) {
    console.error(`[RQBBOX Experience] Error: ${err.message}`);
    send(500, JSON.stringify({ ok: false, error: err.message }));
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n  ╔═══════════════════════════════════╗`);
  console.log(`  ║     RQBBOX Experience OS 1.0    ║`);
  console.log(`  ║     by RhysTech                  ║`);
  console.log(`  ╚═══════════════════════════════════╝\n`);
  console.log(`  Server: http://127.0.0.1:${PORT}/`);
  console.log(`  Dashboard: http://127.0.0.1:${PORT}/dashboard\n`);
});
