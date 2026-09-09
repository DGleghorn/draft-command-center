# Draft Command Center v24.2 — Mobile Team Manager

## v24.2 changes
- Removed the ESPN sync UI, League ID/backend/bridge settings, ESPN sync buttons, and ESPN connector workflow from the mobile app.
- Settings now has an explicit **Save All Team Names** control.
- Roster Builder remains the source of truth for all 12 teams.
- Added League Activity & Snapshots: manual adds, drops, team renames, export/import snapshots, and a timestamped activity log.
- Reworked Data Integrity Rules to validate the things the app can actually verify instead of reporting missing ESPN connectivity as an error.
- Reworked FantasyPros integration: direct official API support using a user-entered key stored locally in the browser, plus JSON/CSV projection import fallback.
- FantasyPros weekly projections are parsed from the documented `stats.points_ppr` field and drive the Matchups/Team Analytics logic when loaded.
- New service-worker cache name `dcc-v24-1-mobile` prevents the old v23/v24 service worker from being treated as the current build after deployment.

## GitHub Pages
Upload the contents of this folder to the repository root. Do not upload the ZIP itself. Open the GitHub Pages URL over HTTPS. On iPhone, use Share → Add to Home Screen → Open as Web App.

## FantasyPros
FantasyPros documents the NFL projections endpoint as `/nfl/{season}/projections`, with `week`, `position/positions`, and `scoring` parameters. HOF includes personal production API access; if the API key is not enabled for the account, use the JSON/CSV import buttons instead.

## League activity
Use Roster Builder for all adds/drops. Every manual change is timestamped. Use League Analyzer → League Activity & Snapshots to export a complete point-in-time league JSON file before/after waiver claims, trades, or other roster changes.
