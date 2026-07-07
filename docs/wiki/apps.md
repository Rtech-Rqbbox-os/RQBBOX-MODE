# Apps Catalog

RQBBOX Experience OS 1.0 includes 16 app integrations:

| App | Category | Launch URL | Individual API |
|-----|----------|------------|----------------|
| Steam | Gaming | steam://open | /api/apps/steam |
| Xbox | Gaming | xbox:// | /api/apps/xbox |
| Google Play Games | Gaming | https://play.google.com/googleplaygames | /api/apps/google-play-games |
| Spotify | Music | spotify:// | /api/apps/spotify |
| YouTube | Media | https://youtube.com | /api/apps/youtube |
| Twitch | Streaming | https://twitch.tv | /api/apps/twitch |
| Netflix | Media | https://netflix.com | /api/apps/netflix |
| Discord | Social | discord:// | /api/apps/discord |
| Epic Games | Gaming | com.epicgames.launcher:// | /api/apps/epic-games |
| Battle.net | Gaming | battlenet:// | /api/apps/battlenet |
| Reddit | Social | https://reddit.com | /api/apps/reddit |
| X / Twitter | Social | https://x.com | /api/apps/x-twitter |
| GitHub | Dev | https://github.com | /api/apps/github |
| Prime Gaming | Gaming | https://gaming.amazon.com | /api/apps/prime-gaming |
| GOG Galaxy | Gaming | goggalaxy:// | /api/apps/gog-galaxy |
| itch.io | Gaming | https://itch.io | /api/apps/itch-io |

Apps with custom protocol URLs (steam://, discord://, etc.) attempt protocol launch and fall back to web URL.
