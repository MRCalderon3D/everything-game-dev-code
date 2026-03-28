# unity/patterns

Extends `../common/documentation.md` with Unity-specific content.

## Approved Direction
- Use explicit composition over ad hoc object graphs.
- Keep authored data, runtime state, and presentation concerns separate where complexity warrants it.
- Choose one clear strategy for scene flow, system lifetime, and service ownership.

## Common Patterns
- Use `ScriptableObject` for authored data and configuration when it improves iteration.
- Use prefabs as reusable composition units, not as hidden architecture containers.
- Use asmdefs to enforce module boundaries.
- Use event-driven communication carefully; document ownership and unsubscribe behavior.

## Anti-Patterns
- giant manager objects with overlapping responsibility
- hidden singleton sprawl
- relying on `Find*` APIs as composition strategy
- using mutable ScriptableObjects as accidental global runtime state
- deep prefab nesting that makes overrides fragile

## Done Criteria
A Unity pattern is acceptable when it clarifies ownership, scales with content, and remains testable and debuggable.
