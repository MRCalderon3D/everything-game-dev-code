# unity/networking

Extends `../common/technical-design.md` with Unity-specific content.

## Scope
Applies when the Unity project contains multiplayer, online state sync, backend-driven gameplay, or network-adjacent systems.

## Rules
- Client input must be treated as untrusted where authority matters.
- Network ownership, replication strategy, rollback or prediction strategy, and disconnect behavior must be documented.
- Scene flow, spawn flow, save flow, and UI flow must account for online and offline states explicitly.
- Third-party networking packages must be wrapped or documented well enough to replace or upgrade safely.

## Done Criteria
Unity networking is acceptable when authority, ownership, sync, and failure handling are explicit and testable.
