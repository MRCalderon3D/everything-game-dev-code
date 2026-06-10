# Web QA

## Purpose
Define web-specific QA expectations for browser coverage, device behavior, performance floors, and release acceptance.

## Scope
Applies to functional testing, exploratory testing, regression coverage, bug reporting, and release evaluation.

## QA Priorities
- Maintain a browser and device matrix: current Chrome, Firefox, and Safari on desktop, plus at least one Android and one iOS device.
- Run dedicated touch passes covering gesture targets, multi-touch, viewport scaling, orientation changes, and on-screen control usability.
- Verify the performance floor on the weakest supported device: stable frame rate, acceptable load time, and no memory growth over a full session.
- Treat a console free of errors and unhandled promise rejections as an acceptance requirement.

## Bug Reporting Rules
- Reports must identify browser, version, device, input method, expected behavior, actual behavior, and reproduction steps.
- Capture whether failures appear in the dev server, the built output, the deployed host, or all three.
- Note whether a bug is deterministic, timing-sensitive, or device-specific.

## Release Checks
- Validate cold load, mid-game reload, save persistence across sessions, audio unlock, fullscreen, and tab-blur pause behavior on target browsers.
- Verify the deployed build, not just local output, before sign-off.

## Done Criteria
Web QA is effective when bugs are reproducible, device-specific risk is visible, and release decisions are grounded in real-browser evidence.
