# Draft Command Center v47.0.0

Consolidated mobile-first in-season fantasy football manager baseline.

## Release contract
- Dashboard version: 47.0.0
- Service worker cache: dcc-v47-0
- ESPN bridge protocol: DCC_ESPN_BRIDGE_V43
- ESPN remains authoritative for league/roster/matchup state.
- DCC is the decision/analytics engine; external projection feeds are supplemental.
- No paid FantasyPros API is required.

## v47.0.0 audit/rebaseline
- One authoritative build version across dashboard, manifest, service worker and runtime metadata.
- Removed obsolete League Analyzer / League Room Integrity presentation.
- League Player Rankings limited to Top 10.
- League Activity reports missing ESPN transaction rows as a data-availability state, not a dashboard error.
- Weekly PowerScore retained in League standings.
- Commissioner Weekly Callouts / team roasts retained.
- My Team health callouts and QB/RB/WR/TE-only roster snapshot retained.
- ESPN fantasy matchup schedule is preferred when supplied by the bridge; NFL schedule remains the player-opponent fallback.
- Cached-first startup and background ESPN refresh retained.
- Added DCC Data Health surface.
- Removed misleading FantasyPros-only warning language from the primary app surfaces.

Upload all files in this folder to the GitHub Pages repository root.
