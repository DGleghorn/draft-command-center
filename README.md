# Draft Command Center v50.6.0 — Orion Stability Patch

Dashboard-only patch based on v50.5.0. Bridge v44.3 source was unavailable.

- Ignore unsolicited ESPN payloads while browsing tabs.
- Permit one bridge payload only after manually pressing Refresh ESPN Data.
- Reject overlapping syncs and mismatched request IDs.
- Time out the manual sync window after 30 seconds.
- Preserve IndexedDB saved snapshot and existing storage key.
- Update cache and displayed build version.

IMPORTANT: This cannot stop an extension's own background scripts from consuming memory. If Orion still freezes when the extension is enabled, disable it and obtain the extension source for repair.

Deployment: Upload all files into the GitHub Pages repository root, replacing existing files. Keep the bridge disabled for first-load verification, then enable and test one manual sync.
