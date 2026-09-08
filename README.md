# Draft Command Center v22 — ESPN League Integration

## PWA
Deploy the contents of this folder to GitHub Pages. Open the site in Chrome/Safari and add it to the Home Screen.

## ESPN connection modes
1. **Chrome Bridge (recommended for private leagues):** sign in to ESPN normally, install the v22 Chrome extension, and keep the ESPN league page plus DCC open. The extension polls ESPN and forwards normalized league data into DCC.
2. **Secure backend:** configure the connector URL in DCC settings. Keep ESPN authentication on the server; never put session cookies in this PWA.
3. **JSON import:** import a normalized ESPN JSON file for one-time snapshots/backups.

## Important
ESPN does not publish a general supported OAuth contract for third-party fantasy apps. v22 therefore does not ask for or store ESPN passwords/cookies in the browser UI.
