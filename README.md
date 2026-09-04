Draft Command Center v17 — Draft Slot #2 PWA

Upload these six files DIRECTLY to the ROOT of your GitHub Pages repository:
- index.html
- manifest.json
- sw.js
- icon-192.png
- icon-512.png
- README.md (optional)

What changed in v17:
- ADP-first decision engine now recognizes material tier cliffs.
- Next-pick loss estimates how much you risk by waiting until your next #2 turn.
- QB/TE timing is tier-based instead of a rigid round checkpoint.
- QB2/TE2 are strongly deferred until the late rounds unless an elite player falls materially.
- Roster need, scarcity, position runs, injury status, bye clustering and light QB/skill-player correlation are used as context — never as a blanket replacement for ADP.
- The engine explicitly compares the Best Pick with the next-best option and explains the difference.
- Draft slot #2 snake-turn structure is respected: #2, #23, #26, #47, #50, etc.
- Full-draft simulation was stress-tested for completion and roster guardrails.
- v17 restores/migrates v16 saved state automatically.
- iOS home-screen icon path is fixed for the flat GitHub Pages package.

Before draft night:
1. Upload the files above to the repository ROOT (not inside another folder).
2. Confirm GitHub Pages is serving the branch/folder containing index.html.
3. Open the HTTPS GitHub Pages URL in Safari on iPhone.
4. Share → Add to Home Screen → Open as Web App.
5. Sync live ADP before drafting when possible. The embedded player data is a fallback snapshot; live ADP should be treated as the authoritative market input.
6. If you use a FantasyPros-compatible proxy, keep the API key on the server — never in this client-side PWA.

The app still uses the real 2026 NFL schedule feed when online and does not invent player opponents when that feed is unavailable.
