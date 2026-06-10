# Web Save and Persistence

## Purpose
Define save and persistence rules for browser games using client-side storage.

## Scope
Applies to localStorage, IndexedDB, save schemas, migrations, and storage failure handling.

## Storage Rules
- Use localStorage for small synchronous saves such as settings and scores; use IndexedDB for large, structured, or binary data.
- Wrap storage access behind a single save module; gameplay code must not touch storage APIs directly.
- Treat all storage as evictable and failable: handle quota errors, privacy modes, and disabled storage gracefully.

## Schema Rules
- Version every save schema and migrate old saves forward explicitly; never silently discard player data.
- Validate loaded data before use; corrupt or unknown saves must fall back to a safe default, not crash.
- Document what is persisted, when writes happen, and what loss the game tolerates.

## Done Criteria
Persistence is healthy when storage choice is justified, schemas are versioned, and failures degrade safely.
