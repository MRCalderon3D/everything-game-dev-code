# unity/telemetry

Extends `../common/telemetry.md` with Unity-specific content.

## Scope
Extends common telemetry policy for Unity clients and tools.

## Instrumentation Rules
- Telemetry hooks should be added at stable gameplay or UX boundaries, not scattered arbitrarily across view code.
- Instrumentation must be resilient to scene flow, session restarts, offline states, and platform limitations.
- Event emission should avoid generating avoidable garbage or noisy duplicates in hot paths.

## Implementation Rules
- Analytics SDK usage should be wrapped behind project-owned interfaces when future replacement risk exists.
- Initialization, consent, environment routing, and failure handling must be explicit.
- Telemetry code must not block gameplay-critical flows.

## Validation
- Verify event timing across startup, menus, gameplay, pause, suspend/resume, and application quit flows where relevant.
- Validate behavior in development, QA, and production-like environments.
- Telemetry changes affecting dashboards, balancing, or live operations require documentation and stakeholder communication.

## Done Criteria
Unity telemetry is ready when instrumentation is intentional, low-risk, and robust against Unity lifecycle edge cases.
