# Web Telemetry

## Purpose
Define telemetry, analytics, logging, and diagnostics expectations for web projects.

## Scope
Applies to gameplay analytics, error reporting, debug logging, performance counters, and release diagnostics.

## Telemetry Rules
- Track events that answer product, QA, or operational questions, not vanity metrics.
- Batch events client-side and deliver via `fetch`; use `sendBeacon` for page-unload flushes so final events are not lost.
- Every event schema must carry a version field; schema changes require a version bump and migration notes on the receiving side.
- Telemetry must never block or degrade gameplay; failed sends are dropped or retried in the background.

## Privacy Rules
- Default to privacy-respecting behavior: no personal data, no fingerprinting, and minimal identifiers.
- Document exactly what is collected and why; provide an opt-out where policy or platform requires one.

## Logging Rules
- Logs should help diagnose boot failures, asset loading, save issues, and deploy-only bugs.
- Debug logging must be controllable per build type and silent in release output.

## Done Criteria
Web telemetry is useful when it supports player-behavior analysis and runtime diagnosis without becoming noisy, invasive, or ambiguous.
