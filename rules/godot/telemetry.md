# Godot Telemetry

## Purpose
Define telemetry, analytics, logging, and diagnostics expectations for Godot projects.

## Scope
Applies to gameplay analytics, error reporting, debug logging, performance counters, and release diagnostics.

## Telemetry Rules
- Track events that answer product, QA, or operational questions, not vanity metrics.
- Telemetry points must map to design questions, progression checkpoints, funnel steps, or technical health signals.
- Event naming, payload shape, and privacy expectations must be documented.

## Logging Rules
- Logs should help diagnose scene flow, save/load issues, platform integration failures, and release-only bugs.
- Avoid noisy logging that obscures critical diagnostics.
- Debug logging paths must be controllable per build type.

## Done Criteria
Godot telemetry is useful when it supports player-behavior analysis and runtime diagnosis without becoming noisy, invasive, or ambiguous.
