# Web Export Platforms

## Purpose
Define deployment expectations for static hosts, embedded contexts, and mobile browsers in web projects.

## Scope
Applies to static-host configuration, PWA packaging, embed constraints, and runtime compatibility checks.

## Platform Rules
- Target hosts must be explicit; itch.io and GitHub Pages are the baseline static-host targets.
- Builds must work as a single deployable folder with relative asset paths and no server-side logic.
- itch.io iframe constraints such as sandboxing, sizing, fullscreen, and pointer lock must be tested, not assumed.
- Mobile browser constraints such as memory limits, touch-only input, viewport scaling, and audio unlock on first gesture must be documented per project.

## Configuration Rules
- Host configuration such as base paths and cache behavior must be versioned and documented where controllable.
- PWA additions such as a manifest, service worker, or offline cache must be justified; a stale service worker must never block players from receiving updates.

## Risk Areas
- WebGL support, codec availability, storage quotas, and gesture requirements vary across browsers and devices.
- Deploy-only failures such as path case sensitivity, missing MIME types, and blocked autoplay must be checked on the real host before release.

## Done Criteria
Web deployment support is ready when target hosts are documented, configuration is in source control, and the published build is validated on real devices.
