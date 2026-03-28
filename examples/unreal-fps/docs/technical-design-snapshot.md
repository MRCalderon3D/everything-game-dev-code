# Shardline Zero Technical Design Snapshot

## Design Goal

Support a 6v6 match flow with authoritative weapon fire, predictable respawn timing, and clear ownership boundaries between server and clients.

## System Boundaries

- Match state authority lives on the server
- Weapon validation is server-authoritative with client-side responsiveness support
- HUD state mirrors replicated match and weapon state but does not own gameplay truth
- Menu-to-match transitions must be recoverable after failed travel or asset load delay

## Review Triggers

- Any Blueprint that changes authority-sensitive weapon flow
- Any replicated variable added to high-frequency combat actors
- Any plugin or engine upgrade that touches packaging or networking

## Validation Focus

- Join-in-progress stability
- Respawn consistency across latency bands
- Hit confirmation clarity under packet loss simulation
- Packaged build parity versus editor behavior
