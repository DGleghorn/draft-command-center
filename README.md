# Draft Command Center v25.1 — Ultimate Fantasy Football Toolkit

## What changed
- **Actual lineup configuration is now FLEX-aware:** QB / RB / RB / WR / WR / TE / FLEX / K / DEF.
- League configuration is editable and persisted so roster rules cannot drift between builds.
- Manual rosters remain the **league-of-record**. There is no ESPN sync, ESPN League ID, or ESPN backend dependency.
- FantasyPros is the expert/projection layer. Weekly projections accept only explicit PPR fields such as `stats.points_ppr` from the official API/import workflow.
- Projection states are explicit: **LIVE**, **EST**, or **OUT/BYE**. Missing FantasyPros matches are never labeled as live points.
- Added a **Projection/Data Health** audit with roster match coverage and opponent-schedule status.
- Added **FLEX-aware lineup optimization** for weekly Start/Sit, Matchups, Manager, roster completeness, VOR/replacement logic, Team Analytics, and trade evaluation.
- Added a **manual fantasy matchup schedule editor**. The app will not invent a fantasy opponent; a round-robin seed is available only as an explicit helper and must be verified.
- Added **manual standings/record/PF/PA entry** for league power rankings without external league sync.
- Added a **scoring/projection contract** so the league's scoring rules are documented and differences from FantasyPros PPR are visible.
- Added **post-trade optimized starter delta** and mutually beneficial trade suggestions instead of relying only on raw player totals.
- Added mobile-friendly **player detail** cards with projection source, ADP/ECR, VOR, availability, and projection state.
- Added automatic local-state backup on save and a v24.x → v25 migration path.
- Added service-worker versioning and an in-app update notice.
- Removed the legacy v21 Manager Intelligence layer and its conflicting FantasyPros/API messaging.
- Consolidated **Rosters + Roster Builder** into one ongoing league-management screen for adds/drops, team renames, custom players, and activity logging.
- Removed the standalone **Players** tab; player intelligence is surfaced contextually through Manager, Waivers, Trades, Matchups, and Settings/Data Health.
- Added a **FantasyPros weekly projection URL reference** field. The app parses the URL for week/scoring/position, attempts a direct read when browser CORS permits it, and refuses to silently treat blocked/stale data as live. If direct page access is blocked, use the official API or JSON/CSV import.
- Fixed the v25 fallback projection bug that treated roster records without an explicit `expert` field as rank 180. Elite players such as Bijan were therefore being shown around 13.9 EST; the fallback now uses the embedded FantasyPros/Walter expert ranks first and removes the artificial weekly variance.

## Current default league setup
- 12 teams
- PPR
- 16 roster spots
- QB 1 / RB 2 / WR 2 / TE 1 / FLEX 1 / K 1 / DEF 1
- Draft position #2
- DEF in Round 15 / K in Round 16 remains the draft policy

## FantasyPros API
The app supports the official FantasyPros API and manual JSON/CSV imports. The PPR projection parser is intentionally strict and uses the PPR projection field rather than standard-scoring `stats.points`.

For a static personal PWA, an API key is stored locally in the browser. For a shared/public deployment, a server-side proxy is safer because it keeps the key off the client.

## Data philosophy
1. Manual league roster data = league source of truth.
2. FantasyPros = expert rankings / ADP / PPR projection layer.
3. NFL/Sleeper schedule/injury data = availability support when available.
4. Fallback estimates are labeled **EST** and should not be treated as live FantasyPros projections.
5. The dashboard prefers an explicit “missing” state over fabricated precision.

## GitHub Pages / iPhone
Upload the **contents** of this folder to the repository root, not the ZIP file. Serve the app through HTTPS/GitHub Pages. On iPhone, open the HTTPS site and use **Share → Add to Home Screen → Open as Web App**.

## Backup / recovery
Use the existing League Activity & Snapshots export/import controls to preserve complete point-in-time league state. v25 also keeps a local previous-state backup before successful saves.
