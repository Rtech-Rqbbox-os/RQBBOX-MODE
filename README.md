<p align="center">
  <img src="assets/banner.svg" alt="RQBBOX Experience OS 1.0" width="100%">
</p>

<div align="center">

# RQBBOX Experience OS 1.0

**Next-generation desktop gaming console hybrid by RhysTech**

[![GitHub Release](https://img.shields.io/badge/Release-v1.0.0-cyan?style=for-the-badge)](https://github.com/rtech-rqbbox-os/RQBBOX-Experience/releases/latest)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](https://github.com/rtech-rqbbox-os/RQBBOX-Experience/blob/master/LICENSE)
[![Version](https://img.shields.io/badge/Version-1.0.0-cyan?style=for-the-badge)](https://github.com/rtech-rqbbox-os/RQBBOX-Experience)
[![Electron](https://img.shields.io/badge/Electron-33-purple?style=for-the-badge&logo=electron)](https://electronjs.org)

</div>

---

## What is RQBBOX Experience OS 1.0?

RQBBOX Experience OS 1.0 is a **full-screen desktop platform** that combines gaming, AI, productivity, media, file management, cloud services, and a built-in web browser into one unified experience. Think **Xbox Dashboard meets Windows Desktop** — a controller-optimized, console-like interface for your PC.

### Key Features

- **🎮 Gaming Hub** — 24+ built-in web games, game launcher, achievements, quick resume, performance overlay
- **✦ AI Assistant** — Built-in AI chat for questions, coding, translation, summarization
- **🛒 App Store** — 40+ apps with search and categories
- **📊 System Monitor** — Real-time CPU, RAM, process list, GPU info, uptime
- **>_ Terminal** — Full PowerShell command interface with quick commands
- **👥 Social Hub** — Friends list, real-time chat, party system
- **📝 Code Editor** — Multi-language editor with line numbers
- **🎨 Paint Studio** — Full canvas painting app with tools
- **🕐 Clock & Timers** — Alarms, countdown, stopwatch, pomodoro, world clocks
- **❤ Health & Wellness** — Break reminders, hydration tracker, screen time
- **🌤 Weather** — Current conditions and 7-day forecast
- **🎵 Music Visualizer** — Audio visualization with 4 styles
- **🕹 Emulator Hub** — Retro gaming ROM management
- **🔧 Developer Tools** — JSON formatter, color picker, hash generator, regex tester, Base64, UUID, CSS units
- **⊞ File Explorer** — Browse and manage files with drive support
- **🌐 Web Browser** — Built-in browser with quick links
- **☁ Cloud Services** — Sync and backup
- **♫ Media Center** — Music player, video, images
- **◷ Productivity** — Notes, tasks, calendar, calculator, whiteboard, text editor
- **⚙ Settings** — 12 setting categories including themes, audio, gaming, accessibility

## Quick Start

### Prerequisites
- Windows 10/11 (x64)
- Node.js 16+ (for development)

### Installation

**Option 1: Download the Installer**
1. Download `RQBBOX-Experience-Setup-1.0.0.exe` from [Releases](https://github.com/rtech-rqbbox-os/RQBBOX-Experience/releases/latest)
2. Run the installer
3. Choose installation directory
4. Launch RQBBOX Experience OS 1.0

**Option 2: Run from Source**
```bash
git clone https://github.com/rtech-rqbbox-os/RQBBOX-Experience.git
cd RQBBOX-Experience
npm install
npm start
```

### Development
```bash
npm run dev          # Start server in development mode
npm run build:exe    # Build Windows installer
```

## Architecture

```
RQBBOX Experience OS 1.0/
├── electron-main.js      # Electron main process (frameless, fullscreen)
├── server.js             # Node.js HTTP server (port 19779)
├── dashboard.html         # Single-page app dashboard (22 pages)
├── index.html             # Landing page
├── css/main.css           # Full theme system (cyan/purple neon)
├── js/                    # Client-side modules (20+ files)
│   ├── app.js             # Main app logic
│   ├── settings.js        # Settings management
│   ├── controller.js      # Gamepad support
│   ├── library.js         # Game/app library
│   └── ...                # More modules
├── games/                 # 24+ built-in web games
├── apps/                  # App catalog (40+ apps)
├── assets/                # SVG icons, logos, banners
├── docs/                  # Documentation and wiki
└── build-scripts/         # Build utilities
```

## API Endpoints

The server exposes **50+ REST API endpoints**:

| Category | Endpoints |
|----------|-----------|
| System | `/api/sysinfo`, `/api/performance`, `/api/processes`, `/api/gpu`, `/api/network`, `/api/storage` |
| Games | `/api/games`, `/api/launch`, `/api/game/play`, `/api/games/scan` |
| Apps | `/api/apps`, `/api/apps/launch`, `/api/store` |
| AI | `/api/ai/chat`, `/api/ai/history`, `/api/ai/summarize`, `/api/ai/translate` |
| Productivity | `/api/notes`, `/api/tasks`, `/api/calendar` |
| Media | `/api/media/music`, `/api/captures`, `/api/screenshot` |
| Social | `/api/friends`, `/api/chat/send`, `/api/chat/messages` |
| Files | `/api/files/list`, `/api/files/read`, `/api/files/write`, `/api/files/drives` |
| Cloud | `/api/cloud/status`, `/api/cloud/sync` |
| Health | `/api/health`, `/api/alarms`, `/api/notifications` |
| System | `/api/system/optimize`, `/api/terminal/exec`, `/api/streaming/status` |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `F11` | Toggle fullscreen |
| `F1` | Open AI Assistant |
| `Ctrl+Shift+G` | Gaming Hub |
| `Ctrl+B` | Web Browser |
| `Ctrl+N` | Notes |
| `Ctrl+K` | Focus AI input |
| `F5` | Refresh browser |
| `Escape` | Close modals |

## Built-in Games

| Game | Category |
|------|----------|
| Neon Drift Racing | Racing |
| Pixel Quest | Adventure |
| Star Fighter X | Action |
| Void Craft Sandbox | Sandbox |
| Retro Zone | Arcade |
| Cube Runner 3D | Action |
| RQBBOX LIFE | Simulation |
| PlayTree Chapter 1 | Platformer |
| Snake Neon | Arcade |
| Tetris Blitz | Puzzle |
| Space Invaders Redux | Arcade |
| Flappy Neon | Arcade |
| 2048 Neon | Puzzle |
| Chess vs AI | Strategy |
| And 10+ more... | Various |

## Tech Stack

- **Frontend:** Vanilla JS SPA, CSS3 with custom properties, HTML5
- **Backend:** Node.js HTTP server (no Express dependency)
- **Desktop:** Electron 33 (frameless, fullscreen, system tray)
- **Build:** electron-builder (NSIS installer)
- **Storage:** JSON flat files (profiles.json, config.json)

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

**RhysTech** - [GitHub](https://github.com/RhysTech) - [Website](https://rhystech.io)

---

<p align="center">
  <img src="assets/rqbbox-os-logo.svg" alt="RQBBOX Experience OS 1.0" width="200">
  <br>
  <strong>RQBBOX Experience OS 1.0</strong>
  <br>
  <em>Plug Into Gaming. Next-gen desktop experience by RhysTech.</em>
  <br><br>
  &copy; 2026 RhysTech. All rights reserved.
</p>
