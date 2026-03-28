# Godot Performance

## Purpose
Define performance expectations for gameplay, UI, rendering, loading, and memory-sensitive systems in Godot.

## Scope
Applies to CPU, GPU, memory, scene loading, script execution, physics, and platform-specific performance.

## Performance Rules
- Features must state expected budgets and risk areas when performance matters.
- Avoid optimizing blindly; measure before and after meaningful changes.
- Scene complexity, script update frequency, signal churn, draw calls, physics workload, and asset memory must be visible performance concerns.

## Architecture Rules
- Separate always-on systems from event-driven systems where practical.
- Avoid hidden per-frame work in many nodes when a smaller number of orchestrated systems would be clearer and cheaper.
- Loading and instancing strategies must be chosen intentionally for the project scale.

## Review Triggers
Escalate when:
- frame time is dominated by script updates or signal storms
- UI trees become expensive to update
- scene instancing or resource loading causes hitching
- memory usage grows without content budget tracking

## Done Criteria
Performance work is complete when budgets are defined, bottlenecks are measurable, and mitigation strategies are documented.
