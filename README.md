# Draft Command Center v29.0 — Mobile-First Weekly Manager

DCC v29 is a mobile-first, local-first fantasy football manager designed for iPhone/iPad PWA use.

## Architecture
- GitHub Pages PWA is the primary app.
- IndexedDB is the durable local application store; localStorage remains as a compatibility cache and migration path.
- ESPN is the league-of-record when the mobile browser permits authenticated ESPN read requests.
- Sleeper public data supplements player/injury/team metadata.
- DCC normalizes source data before the weekly manager/intelligence layer consumes it.
- No Cloudflare Worker, desktop bridge, or browser extension is required.
- No FantasyPros API key or direct FantasyPros URL scraping is required.

## ESPN
Enter your ESPN League ID and Team ID in Settings. DCC uses `credentials: include` for direct ESPN read requests. Do not paste passwords or session cookies into DCC or ChatGPT.

Some iOS/browser privacy policies can prevent a GitHub Pages origin from reusing an ESPN authenticated session. If ESPN returns 401/403, DCC keeps the last successful local snapshot and clearly reports the feed as unavailable rather than fabricating fresh data.

## GitHub Pages upload
Upload these files to the repository root:
- index.html
- manifest.json
- sw.js
- icon-192.png
- icon-512.png
- README.md

Do not upload any bridge or extension folders; v29 intentionally removes them.

## Mobile use
Open the GitHub Pages HTTPS address in Safari and use Share → Add to Home Screen. Do not open the HTML from the Files app; local `file://` pages cannot reliably run the app's network/data features.

## Data behavior
- Local roster/league state survives offline use.
- IndexedDB keeps a durable snapshot of the dashboard state.
- Live source timestamps are retained and displayed.
- ESPN projections are preferred when a fresh ESPN player feed is available; otherwise DCC estimates remain explicitly labeled as estimates.
