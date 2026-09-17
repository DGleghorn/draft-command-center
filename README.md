# Draft Command Center v38.0 — ESPN My-Team Fix

This is the paired v38 dashboard release. ESPN team identity is determined from the authenticated ESPN team ID rather than draft position, so the dashboard can correctly identify **Devo’s Revenge** as the user team.

The package retains backward-compatible bridge handlers for older snapshots/protocols where needed. Those legacy identifiers are compatibility code, not the active release version.
