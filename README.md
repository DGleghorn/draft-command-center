# Draft Command Center v34.0 — Mobile-First Weekly Manager

DCC v34 is a mobile-first, local-first fantasy football manager for iPhone/iPad.

## What changed in v34
- Fixed the missing ESPN Bridge handoff: the GitHub Pages dashboard now accepts the normalized payload emitted by the DCC ESPN browser extension.
- Preserves the existing mobile-first direct ESPN path as a fallback.
- Stores bridge-delivered league/roster state in the existing DCC local persistence flow.
- Accepts the older v23/v25 bridge message formats for compatibility.
- Fixed the service-worker asset list so the PWA cache only references files that actually exist.

## GitHub Pages upload
Upload the **contents** of this ZIP to the repository root:
- `index.html`
- `manifest.json`
- `sw.js`
- `icon-192.png`
- `icon-512.png`
- `README.md`

Do not upload the ZIP itself as `index.html`, and do not place these files inside an extra `v34` folder.

## ESPN Bridge
The companion extension reads the authenticated ESPN session in the browser and sends a normalized snapshot to the open DCC GitHub Pages tab. DCC never asks for ESPN passwords or session cookies.

Keep the DCC page open when pressing Sync in the extension. After replacing the dashboard, refresh the DCC page once so the new bridge listener is loaded.

## Mobile use
Open the HTTPS GitHub Pages URL in Safari/Orion rather than the iOS Files preview.
