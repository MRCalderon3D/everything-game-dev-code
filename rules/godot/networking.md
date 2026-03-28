# godot/networking

Extends `../common/technical-design.md` with Godot-specific content.

## Scope
Applies when the Godot project contains multiplayer, replicated gameplay, backend-driven gameplay, or network-adjacent systems.

## Rules
- Authority, multiplayer ownership, synchronization strategy, prediction or rollback strategy if used, and disconnect behavior must be documented.
- Client input must be treated as untrusted where authority matters.
- Node ownership, replicated state responsibilities, and scene-transition behavior under multiplayer conditions must be explicit.
- Third-party networking or backend integrations must be wrapped or documented well enough to replace or upgrade safely.

## Done Criteria
Godot networking is acceptable when authority, ownership, sync, and failure handling are explicit and testable.
