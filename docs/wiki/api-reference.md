# API Reference

RQBBOX MODE provides a comprehensive REST API. All endpoints return JSON.

## Base URL

http://127.0.0.1:19778/api/

## Endpoints

### System

GET /api/sysinfo — System information (platform, CPU, memory, uptime)
GET /api/health — Server health check

### Configuration

GET /api/config — Get configuration
POST /api/config — Update configuration

### Profiles

GET /api/profiles — Get profiles
POST /api/profiles — Update profiles

### Games

GET /api/games — List all games
GET /api/games/:id — Get individual game + stats
POST /api/games/:id — Update game stats (launch, save-score, save-state, save-session)
GET /api/games/scan — Scan Windows for installed games

### Apps

GET /api/apps — List all apps
GET /api/apps/:id — Get individual app + stats
POST /api/apps/:id — Update app stats (launch)
POST /api/apps/launch — Launch an app with tracking

### Launch

POST /api/launch — Launch a game with tracking

### Achievements

GET /api/achievements — List achievements
POST /api/achievements/unlock — Unlock an achievement

### Social

GET /api/friends — Get friends list and requests

### Chat

POST /api/chat/send — Send a chat message
GET /api/chat/messages — Get chat messages

### Quick Resume

GET /api/quick-resume — Get saved sessions
POST /api/quick-resume — Save/remove/clear sessions

### Game Mode

POST /api/gamemode — Toggle Windows Game Mode

### Captures

POST /api/screenshot — Save screenshot
GET /api/captures — List captures

### Stars

GET /api/stars — List STAR users

### Store

GET /api/store — Get store catalog

### Performance

GET /api/performance — Get performance stats

### Themes

GET /api/themes — List available themes
