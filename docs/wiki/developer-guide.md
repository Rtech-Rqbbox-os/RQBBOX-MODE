# Developer Guide

## Technology Stack

- **Server:** Node.js (HTTP, no frameworks)
- **Client:** Vanilla JavaScript
- **Games:** HTML5 Canvas
- **UI:** CSS3 with custom properties
- **Storage:** JSON files (config.json, profiles.json)

## Project Structure

```
RQBBOX_MODE/
  server.js            # Main server (all API endpoints + static files)
  dashboard.html       # Full-screen dashboard SPA
  index.html           # Launcher page
  config.json          # System configuration
  profiles.json        # User profiles, game states, messages
  assets/              # Static assets (SVGs, icons)
  css/
    main.css           # Dashboard styles
    themes/            # Theme CSS files
  games/               # HTML5 game directories
  apps/                # App catalog
  windows/             # Windows integration scripts
  docs/                # GitHub Pages + Wiki
```

## Adding a New Game

1. Create a directory: games/your-game/
2. Add index.html with your game code
3. Add icon.svg (512x512 recommended)
4. Add entry to games/catalog.json:

```json
{
  "id": "your-game",
  "title": "Your Game",
  "category": "Action",
  "icon": "icon-emoji",
  "iconSvg": "/games/your-game/icon.svg",
  "desc": "Game description",
  "price": "Free",
  "type": "web",
  "localPath": "/games/your-game/",
  "controls": "Arrow keys"
}
```

The individual API endpoint (/api/games/your-game) is automatically available.

## Adding a New App

1. Add entry to apps/catalog.json:

```json
{
  "id": "app-name",
  "title": "App Name",
  "icon": "icon-emoji",
  "category": "Category",
  "launchUrl": "protocol:// or https://url",
  "webUrl": "https://fallback-url",
  "desc": "Description"
}
```

The individual API endpoint (/api/apps/app-name) is automatically available.

## Adding a Theme

1. Create css/themes/your-theme.css
2. Define CSS custom properties:

```css
:root {
  --bg-primary: #your-color;
  --bg-secondary: #your-color;
  --accent: #your-color;
  --text: #your-color;
  --text-secondary: #your-color;
  --border: #your-color;
  --bg-card: #your-color;
  --hover: #your-color;
}
```

## Adding Achievements

Add achievements to profiles.json under the achievements array. Each achievement needs:
- id, title, description, icon
- Unlock via POST /api/achievements/unlock

## Plugin System (RQBBOX OS Creator)

Plugins are JavaScript files that can extend the dashboard. Place in the plugins/ directory and they auto-load on startup.

## Theme Engine (RQBBOX OS Creator)

Themes use CSS custom properties. Create a .css file in css/themes/ and it appears in the Settings panel automatically.
