# Draft Command Center v48.0.0

Clean mobile-first in-season fantasy manager baseline.

- ESPN authenticated league/roster/matchup data via `DCC_ESPN_BRIDGE_V43`
- DCC analysis layer for lineup, waiver, trade and league decisions
- Sleeper public player feed as a free supplemental source
- No FantasyPros API dependency
- Cached-first mobile PWA behavior
- No manual league configuration or demo trade execution UI


## v48.1.0
Data-plumbing repair: ESPN roster entries are normalized to player objects, lineup slots are decoded, weekly projections/status are preserved, and standings/record parsing is corrected.
