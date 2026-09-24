# Draft Command Center v49.3.0

Mobile-first fantasy football manager for ESPN leagues.

## v49.3 dashboard/bridge reliability hotfix
- Keeps ESPN Bridge V43 unchanged.
- Reconciles `ESPN_SYNC_RESULT` from either `payload` or `result`.
- If a valid ESPN snapshot arrives, a later bridge error cannot overwrite or falsely replace the successful sync state.
- Adds a short race-protection window so a stale “open your ESPN fantasy league page first” error does not mask a snapshot that was already delivered.
- Stores the ESPN player pool in DCC state when supplied by the bridge so Opportunities/Waivers can use the same authoritative player universe.
- Sleeper remains supplemental and cannot override ESPN ownership.
- Fresh `dcc_v49_3_state` storage namespace and `dcc-v49-3` service-worker cache.
- Build/version references are synchronized to v49.3.0.

## Deployment
Upload the contents of this ZIP to the root of the GitHub Pages repository and replace the existing files. Keep the existing ESPN Orion Bridge V43 installed.

After publishing, open:
`https://dgleghorn.github.io/draft-command-center/?v4930`

Confirm the header reads `v49.3.0 · ESPN Bridge V43` before testing sync.
