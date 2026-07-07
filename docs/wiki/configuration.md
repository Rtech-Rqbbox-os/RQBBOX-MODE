# Configuration

## config.json

The main configuration file stored in the root directory. Access via /api/config:

```json
{
  "display": {
    "theme": "default",
    "fps": true,
    "blur": true,
    "clock24h": true,
    "scale": 100
  },
  "audio": {
    "masterVolume": 80,
    "uiSounds": true,
    "vibration": true
  },
  "controller": {
    "enabled": true,
    "vibration": true,
    "deadzone": 0.15
  },
  "performance": {
    "mode": "balanced",
    "fpsCap": 60,
    "backgroundSuppression": true,
    "gameOptimizations": true
  },
  "startup": {
    "autoLaunch": false,
    "fullscreen": true,
    "lastProfile": ""
  },
  "capture": {
    "screenshotFormat": "png",
    "recordingQuality": "medium",
    "maxRecordingLength": 300
  }
}
```

## profiles.json

Stores user profiles, game states, app stats, and messages:

```json
{
  "users": [
    {
      "id": "user-...",
      "name": "Player1",
      "username": "player1",
      "avatar": "P",
      "theme": "default",
      "achievements": [],
      "friends": [],
      "friendRequests": [],
      "stats": {
        "gamesLaunched": 0,
        "playTime": 0,
        "captures": 0
      }
    }
  ],
  "gameData": {
    "neon-drift-racing": {
      "playCount": 0,
      "highScores": [],
      "sessions": [],
      "state": {}
    }
  },
  "appData": {
    "steam": {
      "launchCount": 0,
      "lastLaunched": null
    }
  },
  "messages": [],
  "stars": []
}
```

## Themes

Available themes:
- **default** — Cyan/blue gaming theme
- **dark** — Purple dark theme
- **neon** — Magenta neon theme
- **xbox** — Xbox green theme
