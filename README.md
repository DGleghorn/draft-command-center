# Draft Command Center v49.2.0

Mobile-first fantasy football manager for ESPN leagues.

## v49.2 hotfix
- Fixes the dashboard/bridge response-envelope mismatch: `ESPN_SYNC_RESULT` is now read from either `payload` or `result`.
- Real bridge error messages are surfaced instead of the generic “unknown error.”
- Successful bridge acknowledgements no longer masquerade as a completed snapshot; the dashboard waits for the actual ESPN snapshot.
- Uses a fresh `dcc_v49_2_state` storage namespace and `dcc-v49-2` service-worker cache.

## v49 priorities
- ESPN Bridge V43 compatibility preserved.
- ESPN roster/ownership authority with sync-lock protection.
- No silent first-team fallback.
- Player grades: current/week/ROS, trend, confidence and opportunity.
- ESPN-authoritative availability pool when bridge supplies it; Sleeper is supplemental only.
- Personalized waiver categories and roster upgrade paths.
- Trade Builder with team selector, two-sided player selection, before/after projection, depth, replacement value, partner fit and six-week outlook.
- League PowerScore, injury intelligence, trade map and commissioner callouts.
- Data Health, diagnostics, timestamps and decision log.
- Cache/version consistency: v49.2.0 and service-worker cache dcc-v49-2.

## Deploy
Upload the contents of this ZIP to the root of the GitHub Pages repository. Keep the existing ESPN Orion Bridge V43 installed; v49 does not require a new bridge unless a future bridge protocol change is explicitly announced.
