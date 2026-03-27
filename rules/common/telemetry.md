# Telemetry

## Purpose
Define shared rules for instrumentation, event design, KPI mapping, experimentation support, and data responsibility.

## Scope
Applies to analytics, balancing telemetry, funnels, QA instrumentation, and live-ops measurement.

## Telemetry Principles
- Instrumentation exists to answer product, design, operational, and quality questions.
- Track only what has a clear consumer and decision path.
- Event names and payloads must be stable, documented, and privacy-aware.
- Telemetry without ownership or interpretation plans creates noise.

## Planning Rules
- Define telemetry requirements during feature design, not after release.
- Map each important event to a question, KPI, or alerting need.
- High-risk flows such as onboarding, progression, economy, matchmaking, crashes, and store interactions require explicit instrumentation planning.

## Event Rules
- Use a clear naming convention and event taxonomy.
- Event payloads must define required fields, optional fields, types, and versioning expectations.
- Avoid sending redundant data that can be derived downstream.
- Instrument outcomes, not only button presses.

## Privacy and Compliance Rules
- Do not collect sensitive personal data unless there is explicit product and compliance justification.
- Respect platform, regional, and policy requirements for data collection and consent.
- Document retention and access expectations for telemetry data.

## Quality Rules
- Telemetry must be testable in development and staging contexts.
- Schema changes require downstream compatibility review.
- Broken or noisy events should be treated as defects when they affect decisions or reporting.

## Collaboration Rules
- Design, production, analytics, QA, and engineering should agree on key events and definitions.
- Telemetry plans should connect to dashboards, alerts, experiments, or reports, not stop at event emission.

## Deliverables
- Telemetry plan.
- Event catalog.
- KPI mapping.
- Dashboard or reporting ownership notes.
- Validation checklist.

## Done Criteria
Telemetry is ready when questions, events, schemas, consumers, and validation paths are all explicit and maintainable.
