# Draft Command Center v39.0 — Fantasy Manager Core

Dashboard-only release. The Orion ESPN Bridge v38 remains compatible and does not need to be replaced for this dashboard update.

## What changed
- Reworked primary navigation around Home, My Team, Matchup, Waivers, Trades, League, and More.
- Removed manual roster-builder workflow from the primary manager experience.
- ESPN is the source of truth for league/team/roster state.
- Merged League Analyzer / League Room into the League destination.
- Added read-only My Team roster analysis and team-needs view.
- Reworked projections into a multi-source ensemble.
- ESPN is never treated as the sole projection authority.
- Sleeper weekly PPR projections are fetched automatically when available.
- FantasyPros remains an optional independent projection source through the existing import/cache workflow.
- A live ensemble requires at least two fresh independent sources; a single source is secondary reference only and DCC falls back to its model.
- Trade value now blends market ADP, multi-site expert consensus, and current-week projection context.
- Waiver actions are recommendation/target actions rather than manual roster mutations.
- Updated service worker/cache to v39.

## Extension
Use the existing **DCC ESPN Orion Bridge v38**. A new extension is not required for dashboard-only updates. The extension should only be updated when ESPN acquisition/parsing, permissions, or the bridge contract changes.
