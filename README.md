# Draft Command Center v26.0 — GitHub Pages PWA

## New direction: Weekly Team Manager + Live Data Engine

Drafting is complete. DCC now prioritizes weekly start/sit, matchup, waiver, trade and roster-management decisions.

### Live data architecture
- **Sleeper public API:** free, no key, for active NFL player/team assignments, injury status, current NFL state and trending adds/drops. Player metadata is refreshed conservatively because Sleeper documents the full player map as a large daily-style dataset.
- **ESPN Fantasy API:** free/public read path when the league is publicly readable. DCC can pull league rosters, standings, matchup schedule, weekly PPR projections and live scoring data.
- **FantasyPros:** optional last resort. No FantasyPros API subscription is required for the new free-first engine.
- **DCC estimates:** only used when an external live source is unavailable and are explicitly labeled EST.

### Refresh behavior
- Manual **REFRESH ALL** is always available.
- Auto-refresh runs while the app is open.
- Normal refresh target: ~10 minutes.
- The app refreshes again when returning to the foreground.
- ESPN live-scoring data is requested during refreshes when configured.

### ESPN setup
In **Settings → Live Data Engine**, enter:
1. ESPN League ID
2. Your ESPN Team ID
3. Optionally paste your ESPN league URL

The app does **not** request or store an ESPN password. Private ESPN leagues may return HTTP 401 because ESPN requires account cookies. For a private league, use the future DCC Chrome extension/serverless bridge rather than exposing credentials in the GitHub Pages app.

### GitHub Pages upload
Upload the contents of this ZIP to the repository root. Keep `index.html`, `manifest.json`, `sw.js`, the icons, and all existing `script0.js`–`script3.js` files together.
