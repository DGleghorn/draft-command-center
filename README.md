# Draft Command Center v13 PWA

Upload these files to the root of the GitHub Pages repository: index.html, manifest.json, sw.js, icon-192.png, and icon-512.png. GitHub Pages publishes static files from the configured branch/folder; `index.html` is the entry file.

Open the HTTPS GitHub Pages URL in Safari on iPhone, then use **Share -> Add to Home Screen -> Open as Web App**. The manifest, service worker and icons are included so v13 is packaged as a real installable web app rather than a raw HTML document.

v13 adds:
- Slot-aware draft decision engine for the #2 seat
- Dynamic Draft Game Plan using your future snake-draft turns
- More realistic simulated opponent personalities and roster construction
- Mock Draft Quality Report
- QB/TE timing guardrails and position ceilings
- ADP-first recommendations with risk/fallback context
- Existing DEF Round 15 / K Round 16 policy

ESPN private-league live sync still requires a secure server-side connector.
