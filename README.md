# Draft Command Center v37.0 — Stable ESPN Roster Sync

This is the stable mobile-first season manager release.

## ESPN bridge architecture
- Accepts the Orion ESPN normalized snapshot with `league` metadata plus top-level `teams`.
- Replaces DCC's complete `teams[]` state directly from the normalized snapshot.
- Does **not** assume ESPN team IDs are array indexes.
- Requires 12 teams and at least one rostered player per team before replacing the saved league state.
- Persists the normalized snapshot locally and restores it after reload.
- Shows an explicit team/player count after sync.
- Uses a v37 service-worker cache namespace to prevent stale v29/v30/v35/v36 assets from masking the release.

## Upload
Replace the GitHub Pages root files with the contents of this package. Then install the paired v37 Orion extension once.
