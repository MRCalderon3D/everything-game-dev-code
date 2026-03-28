# godot/patterns

Extends `../common/documentation.md` with Godot-specific content.

## Approved Direction
- Use explicit gameplay architecture rather than accidental scene-tree coupling.
- Choose a clear strategy for autoloads, scene composition, signals, resources, and service ownership.
- Keep authoritative logic, runtime state, and presentation concerns distinct.

## Common Patterns
- Use scenes as reusable composition units when their boundaries are clear.
- Use resources and config assets intentionally for design iteration.
- Use signals for decoupling where they improve ownership clarity, but document signal ownership and lifecycle.
- Use autoloads sparingly and deliberately for systems with clear global lifetime.

## Anti-Patterns
- giant scene scripts with hidden ownership
- turning autoloads into catch-all global managers
- relying on per-frame processing for systems that should be event-driven
- scene setup being the only place where system architecture can be understood
- brittle node-path assumptions scattered throughout gameplay code

## Done Criteria
A Godot pattern is acceptable when it clarifies ownership, scales with project complexity, and remains reviewable by both engineering and design.
