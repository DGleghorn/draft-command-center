# Draft Command Center v36.0

Mobile-first fantasy football weekly manager for GitHub Pages.

## v36 stable ESPN bridge release
- Accepts the existing Orion ESPN Bridge v35 snapshot format (`league` metadata + top-level `teams`).
- Persists imported ESPN rosters/settings/schedule into the main dashboard state.
- Restores the latest ESPN snapshot after a page refresh when the bridge cache is available.
- Uses a fresh v36 service-worker cache namespace to prevent stale v29/v30/v35 assets from masking the release.
- No background ESPN polling is required for the bridge; ESPN sync remains explicit.
- FantasyPros API remains optional rather than required.

## GitHub Pages upload
Upload the contents of this ZIP to the repository root and replace the existing `index.html`, `manifest.json`, `sw.js`, README, and icons as applicable.

After GitHub Pages publishes, open the dashboard in Orion and refresh once. The existing Orion v35 extension can remain installed; no extension replacement is required for this v36 dashboard release.
