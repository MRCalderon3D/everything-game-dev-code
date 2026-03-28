# Godot Testing

## Purpose
Define automated and manual testing expectations for Godot gameplay, tools, UI, save systems, and exports.

## Scope
Applies to unit-like tests, integration tests, content validation, regression suites, and manual verification.

## Testing Strategy
- Test the highest-risk seams: scene composition, signals, autoloads, save/load, input, localization, export startup, and platform-specific paths.
- Use automated coverage where it provides dependable signal; use manual passes for experiential and integration-heavy validation.
- Content validation scripts are encouraged when authoring mistakes are common and expensive.

## Coverage Rules
- New systems should define how they will be verified before implementation is considered done.
- Tests must be maintainable and aligned with the real ownership boundaries of scenes and systems.
- When editor tooling mutates project data, validation and rollback expectations must be testable.

## Done Criteria
Testing is adequate when risky systems have clear verification paths and regressions can be caught before release candidates.
