# Web Performance

## Purpose
Define performance expectations for browser games across rendering, simulation, loading, and memory-sensitive systems.

## Scope
Applies to frame budgets, garbage-collection pressure, allocation discipline, object pooling, and profiling.

## Performance Rules
- Define the frame budget against the weakest supported target device and browser, not the development machine.
- Avoid optimizing blindly; measure with browser devtools profilers before and after meaningful changes.
- Draw calls, per-frame allocations, layout thrash, and asset memory must be visible performance concerns.

## Allocation Rules
- Avoid allocating objects, arrays, or closures inside the frame loop; garbage-collection pauses cause hitches.
- Pool frequently created entities such as bullets, particles, and effects, and reuse scratch objects for math.
- Separate always-on per-frame systems from event-driven systems where practical.

## Review Triggers
Escalate when:
- frame time exceeds budget on the weakest target device
- devtools show recurring garbage-collection pauses during gameplay
- loading or scene switches cause visible hitching

## Done Criteria
Performance work is complete when budgets are defined, bottlenecks are measurable, and mitigation strategies are documented.
