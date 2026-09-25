# Draft Command Center v50.0.0 — Production Snapshot Architecture

Mobile-first fantasy football manager for ESPN leagues.

## Production architecture
- ESPN/Orion Bridge is the **sync writer**: authenticate on ESPN, run the bridge sync, and save the validated snapshot to extension storage.
- DCC is the **read/analysis client**: when DCC opens or refreshes, it asks the bridge for the latest saved snapshot. It never asks the dashboard tab to find an active ESPN tab.
- A valid snapshot is retained if a later request fails. Empty/incomplete league snapshots are rejected.
- ESPN remains the authority for roster ownership and availability when supplied; DCC intelligence is layered on top.
- Sleeper is supplemental only.

## iPhone workflow
1. Open your ESPN Fantasy league in Orion.
2. Open the DCC ESPN Bridge extension and tap **SYNC ESPN → DCC**. Wait for the successful league/team confirmation.
3. Open a new Orion tab for DCC: https://dgleghorn.github.io/draft-command-center/
4. DCC automatically loads the latest validated ESPN snapshot.
5. If DCC was already open, tap **LOAD LATEST ESPN** or refresh the page.

You no longer need to keep the ESPN tab active while using the DCC dashboard.

## Deployment
Upload the five files in this package to the root of the GitHub Pages repository and replace the existing versions: index.html, sw.js, manifest.json, dcc-build.json, README.md.

Confirm the dashboard header reads `v50.0.0 · Production · ESPN Bridge V43`.
