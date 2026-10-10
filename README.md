# Draft Command Center v50.7.0 — Bridge ACK compatibility

Dashboard-side patch for extension-initiated syncs. V50.6 ignored payloads unless the dashboard initiated the request; v50.7 accepts extension-initiated V44 messages, validates and writes the snapshot to IndexedDB, verifies the readback, then emits `DCC_V44_ACK` and `DCC_ACK` and saves ACK metadata. Includes a single-ingest lock and short unsolicited push throttle.

**Limitations:** The v44.3 extension source was unavailable. Its exact acknowledgment schema and storage location cannot be confirmed, so this is a compatibility attempt, not a verified end-to-end fix. iOS Orion testing is required.

Upload the five files to the GitHub Pages repo root. Confirm the About panel says v50.7.0 before testing.
