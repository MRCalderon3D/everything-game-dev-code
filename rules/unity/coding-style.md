# unity/coding-style

Extends `../common/coding-style.md` with Unity-specific content.

## Core Rules
- Prefer thin `MonoBehaviour` classes and keep domain logic in plain C# where practical.
- Use Unity lifecycle methods intentionally; avoid spreading ownership across `Awake`, `Start`, `OnEnable`, and `Update` without documented responsibility.
- Keep serialized fields minimal, explicit, and grouped for authoring clarity.
- Never let inspector wiring become the only place where architecture can be understood.

## Runtime Boundaries
- Separate runtime code, editor code, and tests.
- Runtime code must not depend on `UnityEditor` namespaces.
- Avoid global state unless lifetime, initialization order, and teardown are clearly defined.

## Performance-Sensitive Style
- Avoid avoidable allocations in hot paths.
- Be careful with LINQ, reflection, string churn, and closure capture in frequently called code.
- Cache expensive lookups only when profiling shows value and lifecycle remains safe.

## Done Criteria
Unity code is acceptable when architecture is readable, authoring is manageable, and runtime risk is controlled.
