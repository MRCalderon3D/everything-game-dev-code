# Web Testing

## Purpose
Define automated and manual testing expectations for web gameplay, rendering, persistence, input, and deployment.

## Scope
Applies to unit tests, headless browser tests, content validation, regression suites, and manual verification.

## Testing Strategy
- Keep game logic pure and decoupled from canvas, DOM, and audio so it can be unit tested in Node without a browser.
- Drive simulation through a fixed-timestep update function that accepts explicit time deltas so tests are deterministic and replayable.
- Use headless browser smoke tests to verify the page boots, assets load, the loop starts, and the console stays free of errors.
- Use manual playtest passes for game feel, input responsiveness, audio behavior, and visual correctness.

## Coverage Rules
- New systems should define how they will be verified before implementation is considered done.
- Save/load round trips, input mapping, and win/lose state transitions are minimum automated coverage targets.
- A written manual playtest checklist must exist and be updated when features change.

## Done Criteria
Web testing is adequate when pure logic is verified in Node, boot health is verified headlessly, and regressions can be caught before publishing.
