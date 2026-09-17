# Draft Command Center v35.0

## Fixes
- Fixed fatal `projPts()` metadata bug that prevented dashboard widgets from rendering.
- Fixed ESPN Bridge payload parsing when Orion sends the payload as a JSON string.
- Exposed a real dashboard-side ESPN bridge apply hook.
- ESPN roster and weekly projection data are applied directly to the active DCC state and persisted.
- Removed draft-only pages and obsolete live polling controls.
- Simplified Settings to season-management essentials.
- Versioned and cleaned the service-worker cache.
