# Draft Command Center v25.3 — Ultimate Fantasy Toolkit

Mobile-first PWA for a 12-team PPR fantasy football league. Manual league rosters are the source of truth; FantasyPros is the projection/expert layer. No ESPN dependency.

## v25.3 Stability & Data Integrity
- Correct QB/RB/RB/WR/WR/TE/FLEX/K/DEF lineup model.
- Data Health panel for projections, schedule, injury/roster sync, rostered-player projection matching, schema, and app version.
- FantasyPros PPR projections are explicitly LIVE or EST; stale live caches expire after 6 hours.
- Player metadata is hydrated from the embedded player pool when older roster records are incomplete.
- Automatic local snapshots are created before saved state changes; latest snapshot can be restored.
- Versioned state schema and migration support.
- Service worker cache is versioned as v25.3 and navigation is network-first to reduce stale PWA builds.
- Visible app version is v25.3.
- FantasyPros URL remains a source reference / optional direct-read path; official API or JSON/CSV import is preferred because browser CORS may block page reads.

## GitHub Pages
Upload the contents of this ZIP to the repository root. The entry point is `index.html`.

## Data policy
The app never labels a fallback estimate as FantasyPros. If live PPR projection data is missing or stale, the UI shows EST and recommends a refresh/import.
