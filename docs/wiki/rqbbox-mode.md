# RQBBOX Experience OS 1.0 Overview

**Version:** 1.0.0 | **Server:** Node.js | **Platform:** Windows

## Description

Console Gaming Experience for PC — Full-screen Xbox-like dashboard with controller navigation, Game Mode, Quick Resume, 6 built-in games, and more. Transforms any Windows PC into a gaming console experience.

## Key Features

| Feature | Description |
|---------|-------------|
| Full-Screen Dashboard | Console-style UI with sidebar, topbar, and game carousel |
| Controller Navigation | D-pad navigation, A/B/X/Y buttons, Guide button overlay |
| Performance Mode | One-click optimization — reduces effects, frees memory, maximizes FPS |
| Quick Resume | Save and restore game sessions instantly |
| Game Library | 6 built-in HTML5 games with launcher |
| 16 App Integrations | Steam, Xbox, Discord, Spotify, YouTube, Netflix, and more |
| Achievement System | 12 achievements with popup notifications |
| Chat System | Text chat with rooms, WebRTC voice chat |
| Theme Engine | 4 themes: Default (cyan), Dark (purple), Neon (magenta), Xbox Green |
| Profile System | Multi-user support with PIN auth |
| Windows Integration | Game Mode, GameDVR, Start Menu shortcut |
| Boot Animation | Console-style boot sequence |

## Editions

- **RQBBOX OS Lite** — Basic gaming launcher
- **RQBBOX OS Pro** — Full features including RQBBOX Experience OS 1.0
- **RQBBOX OS Creator** — Pro + SDK, plugin/theme editor

## Architecture

```
RQBBOX_MODE/
  server.js             # Node.js HTTP server (API + static files)
  dashboard.html        # Main full-screen dashboard
  index.html            # Launch page
  config.json           # User configuration
  profiles.json         # User profiles, achievements, sessions
  assets/               # Images, icons, logos
    icons/              # 50+ SVG feature icons
  css/
    main.css            # Core styles
    themes/             # Theme CSS files
  games/                # 6 built-in HTML5 games
  apps/                 # 16 app integrations
  windows/              # Windows integration scripts
  docs/                 # GitHub Pages documentation
```

## API Endpoints

| Icon | Endpoint | Method | Description |
|------|----------|--------|-------------|
| Config | /api/config | GET/POST | System configuration |
| Profile | /api/profiles | GET/POST | User profiles |
| Games | /api/games | GET | Game library catalog |
| Apps | /api/apps | GET | Apps catalog |
| Achievements | /api/achievements | GET | List achievements |
| Friends | /api/friends | GET | Friends list and requests |
| Quick Resume | /api/quick-resume | GET/POST | Quick Resume sessions |
| Performance | /api/performance | GET | Performance stats |
| Themes | /api/themes | GET | Available themes |
| Screenshot | /api/screenshot | POST | Save screenshot |
| Captures | /api/captures | GET | Captures list |
| Launch | /api/launch | POST | Launch a game |
| Auth | /api/auth | POST | Sign in |
| Register | /api/register | POST | Create account |
| Game Mode | /api/gamemode | POST | Toggle Windows Game Mode |
| System Info | /api/sysinfo | GET | System information |
| Chat Send | /api/chat/send | POST | Send chat message |
| Chat Messages | /api/chat/messages | GET | Get chat messages |

Each individual game and app also has its own API endpoint:
- /api/games/{gameId} — GET game details + stats, POST to track scores/states
- /api/apps/{appId} — GET app details + stats, POST to track launches

## Controller Bindings

| Button | Action |
|--------|--------|
| D-pad | Navigate UI |
| A (Bottom) | Select / Activate |
| B (Right) | Back / Close |
| X (Left) | Menu |
| Y (Top) | Guide |
| Guide (Xbox) | Open Guide overlay |
| Start/Menu | Context menu |

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| Ctrl+Shift+F | Toggle fullscreen |
| Ctrl+Shift+P | Toggle performance mode |
| Ctrl+Shift+S | Take screenshot |
| Ctrl+Shift+R | Clear Quick Resume |
| Ctrl+Tab | Task Switcher |
| Escape | Back / Close overlay |
| Ctrl+1-7 | Navigate pages |
