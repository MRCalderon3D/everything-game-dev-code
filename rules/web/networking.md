# web/networking

Extends `../common/technical-design.md` with web-specific content.

## Scope
Applies when the web project calls backends, leaderboards, telemetry endpoints, multiplayer relays, or any network-adjacent service.

## Rules
- Use `fetch` for request-response calls and WebSocket for persistent or low-latency channels; document which transport each system uses and why.
- Every network call must define a timeout, a bounded retry policy with backoff, and user-visible failure behavior.
- Leaderboard and backend submissions must be treated as untrusted on the server side and must tolerate rejection gracefully on the client.
- The game must remain playable offline or degrade gracefully when requests fail; never block the core loop on network availability.
- Third-party backend SDKs must be wrapped or documented well enough to replace or upgrade safely.

## Done Criteria
Web networking is acceptable when transports, timeouts, retries, and offline behavior are explicit and testable.
