# D.I.L.D.O. v0.8.40 — Dalton’s Intelligent Learning Dashboard Optimizer

Production release candidate focused exclusively on Props data-source resilience.

## What changed
- ParlayAPI remains the primary DraftKings Props source.
- Optional SportsGameOdds fallback adapter added for NFL and NCAAF when ParlayAPI fails or returns no usable rows.
- Fallback is server-side only and requires a Cloudflare secret named `SGO_API_KEY`.
- Fallback accepts DraftKings only, full-game (`game`) player O/U markets only, and rejects rows older than 15 minutes.
- Existing browser last-known-good Props cache and circuit breaker remain in place.
- Diagnostics now separate Props Worker, primary provider, fallback provider, and DraftKings Props Feed health.
- No game recommendation, AI classification, settlement, PGA, or Props threshold mathematics were changed.

## Deployment
Upload the package to the existing GitHub Pages repository as usual. The existing `PROP_API_KEY` continues to power ParlayAPI.

To activate the secondary provider, create a SportsGameOdds API key and add it to the existing Cloudflare Worker as an encrypted secret named `SGO_API_KEY`. Do not put either API key in GitHub or client-side settings. The fallback remains inactive until that secret exists.

## Important
The fallback provider is optional. Without `SGO_API_KEY`, v0.8.40 still runs safely with ParlayAPI + cache and reports the fallback as not configured. A ParlayAPI HTTP 500 cannot be repaired by client code; live recovery during that outage requires either the fallback secret or a fresh cached feed.


## v0.8.40 additions
- Production Props endpoint is self-healing and no longer inherits stale localStorage URLs outside Developer Mode.
- Worker binding preflight confirms SGO_API_KEY presence without exposing the secret.
- Market Movement removed from normal UI.
- Snapshot display condensed to the single latest snapshot for the active sport.
- Diagnostics distinguish Worker reachability, fallback configuration, active provider, and DK feed health.


## v0.8.40 branding
- Product brand: **D.I.L.D.O.**
- Full name: **Dalton’s Intelligent Learning Dashboard Optimizer**
- Tagline: **Advanced Analytics for Questionable Decisions**
- This release intentionally preserves the v0.8.35 Props recovery and betting/model logic.


## v0.8.40 Production Refinement
- Today ranks official plays strongest-first.
- Betslip is now D.I.L.D.O.’s Final Card with human-readable rationale, risk, and playable line.
- Season Performance and Recent Bets moved to More so Betslip stays decision-focused.
- Production cache/version metadata advanced to v0.8.40.
- Betting/model math and Props recovery architecture remain frozen.


## v0.8.40 Production Refinement
- Adds a plain-English Pick Logic / threshold / controlled-learning card.
- Condenses Recent Bets to five rows plus expandable history.
- Fixes AI Analyst readability in the turf theme.
- Removes the legacy Market Movement UI from More.
- Keeps Season Performance and all frozen recommendation math intact.

## v0.8.40 Hotfix + Performance

- Fixed the v0.8.38 `renderSnapshots is not defined` refresh regression.
- Deterministic picks now render as soon as the verified market snapshot is available; AI context no longer gates the card.
- Props enrichment remains background work and no longer delays AI startup.
- Removed the redundant AI connectivity probe from normal refreshes.
- AI game batches now run with bounded concurrency (2 at a time) while preserving the existing one-retry recovery limit.
- All protected betting/model functions remain unchanged from v0.8.38.
