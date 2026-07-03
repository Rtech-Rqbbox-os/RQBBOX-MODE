<p align="center">
  <img src="assets/banner.svg" alt="RQBBOX MODE" width="100%">
</p>

<h1 align="center">RQBBOX MODE ®</h1>

<p align="center">
  <strong>Plug Into Gaming. ®</strong><br>
  A full-screen, controller-optimized gaming mode for PC, inspired by Xbox Mode on Windows 11.
</p>

<p align="center">
  <a href="https://rtech-rqbbox-os.github.io/RQBBOX-MODE">
    <img src="https://img.shields.io/badge/GitHub-Pages-blue?style=for-the-badge&logo=github" alt="GitHub Pages">
  </a>
  <a href="https://github.com/Rtech-Rqbbox-os/RQBBOX-MODE/blob/master/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License">
  </a>
  <a href="https://github.com/Rtech-Rqbbox-os/RQBBOX-MODE">
    <img src="https://img.shields.io/badge/Version-1.0.0-107c10?style=for-the-badge" alt="Version">
  </a>
</p>

---

Turn any PC into a console-like gaming experience. Full controller navigation, Quick Resume, performance optimization, achievements, game DVR, cloud gaming, and 6 built-in games.

## Features

| Feature | Description |
|---------|-------------|
| **Fullscreen Dashboard** | Console-style full-screen gaming interface with horizontal scrolling rows, hero banners, and tile-based navigation |
| **Controller Navigation** | Full gamepad support — D-pad navigate, A select, B back, Guide button for menu. Vibration feedback. |
| **Quick Resume** | Suspend games and resume instantly (up to 3 slots). Inspired by Xbox Quick Resume technology. |
| **Performance Mode** | One-click performance optimization — reduces visual effects, frees memory, maximizes FPS. Balanced/Maximum/Quality modes. |
| **Game Library** | Unified game catalog with installed, recent, and favorites tracking. Launch HTML5 games directly. |
| **Achievement System** | 12 achievements to unlock with popup notifications and vibration feedback. |
| **Game DVR & Captures** | Screenshot capture and screen recording (Game DVR). Capture your gaming moments. |
| **Social Features** | Friends list, friend requests, online status, activity feed. |
| **Theme Engine** | 4 built-in themes: Default (cyan), Dark (purple), Neon (magenta), Xbox Green. |
| **Settings Panel** | Full settings UI with General, Display, Controller, Performance, Audio, Capture, Theme, Social, Startup tabs. |
| **FPS Monitor** | Real-time FPS overlay with performance stats. |
| **Boot Animation** | Console-style boot sequence with loading bar. |
| **Guide Overlay** | Quick access menu (Guide button) for navigation. |

---

## Quick Start

### Windows
```
1. Double-click "Launch RQBBOX MODE.bat"
2. Server starts at http://127.0.0.1:19778/
3. Opens dashboard automatically
```

### Manual Start
```sh
npm start
# or
node server.js
# Then open http://127.0.0.1:19778/dashboard
```

---

## Architecture

```
RQBBOX_MODE/
├── server.js                 # Node.js HTTP server (API + static files)
├── dashboard.html             # Main full-screen dashboard
├── index.html                 # Launch page
├── config.json                # User configuration
├── profiles.json              # User profiles, achievements, sessions
├── css/
│   ├── main.css               # Core styles
│   └── themes/                # Theme CSS files
│       ├── default.css
│       ├── dark.css
│       ├── neon.css
│       └── xbox.css
├── js/
│   ├── core.js                # Core engine & utilities
│   ├── app.js                 # Main app initialization
│   ├── controller.js          # Gamepad navigation & polling
│   ├── performance.js         # Performance optimization engine
│   ├── library.js             # Game library manager
│   ├── quick-resume.js        # Quick Resume system
│   ├── settings.js            # Settings UI panels
│   ├── overlay.js             # Guide overlay & notifications
│   ├── capture.js             # Screenshot & Game DVR
│   ├── achievements.js        # Achievement system
│   ├── social.js              # Friends & social features
│   ├── store.js               # Game store/catalog
│   └── themes.js              # Theme switcher
├── games/
│   ├── catalog.json           # Game library manifest
│   ├── neon-drift-racing/     # Playable HTML5 game
│   ├── pixel-quest/           # Playable HTML5 game
│   ├── star-fighter-x/        # Playable HTML5 game
│   ├── void-craft-sandbox/    # Playable HTML5 game
│   ├── retro-zone/            # Playable HTML5 game
│   └── cube-runner-3d/        # Playable HTML5 game
├── apps/
│   └── catalog.json           # Web app integrations
└── captures/                  # Screenshots & recordings
```

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/config` | GET/POST | System configuration |
| `/api/profiles` | GET/POST | User profiles |
| `/api/games` | GET | Game library catalog |
| `/api/apps` | GET | Apps catalog |
| `/api/achievements` | GET | List achievements |
| `/api/achievements/unlock` | POST | Unlock achievement |
| `/api/friends` | GET | Friends list & requests |
| `/api/quick-resume` | GET/POST | Quick Resume sessions |
| `/api/performance` | GET | Performance stats |
| `/api/themes` | GET | Available themes |
| `/api/screenshot` | POST | Save screenshot |
| `/api/captures` | GET | Captures list |
| `/api/launch` | POST | Launch a game |
| `/api/auth` | POST | Sign in |
| `/api/register` | POST | Create account |

---

## Controller Bindings

| Button | Action |
|--------|--------|
| D-pad Up/Down/Left/Right | Navigate UI |
| A (Bottom) | Select / Activate |
| B (Right) | Back / Close |
| X (Left) | Menu |
| Y (Top) | Guide |
| Guide (Xbox) | Open Guide overlay |
| Start/Menu | Context menu |

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+F` | Toggle fullscreen |
| `Ctrl+Shift+P` | Toggle performance mode |
| `Ctrl+Shift+S` | Take screenshot |
| `Ctrl+Shift+R` | Clear Quick Resume |
| `Escape` | Back / Close overlay |
| `Ctrl+1-7` | Navigate pages |

---

## Editions

RQBBOX MODE is part of the RQBBOX OS ecosystem by RhysTech.

- **RQBBOX OS Lite** — Basic gaming launcher
- **RQBBOX OS Pro** — Full features including RQBBOX MODE
- **RQBBOX OS Creator** — Pro + SDK, plugin/theme editor

---

## Development

Technologies: **Node.js** (server), **Vanilla JS** (client), **HTML5 Canvas** (games), **CSS3** (UI)

Built as a standalone project that integrates with RQBBOX OS.

---

## License

MIT License — © 2026 RhysTech

RQBBOX® is a trademark of RhysTech. All rights reserved.

---

*Plug Into Gaming. ®*
