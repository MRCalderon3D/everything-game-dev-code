# unity/performance

Extends `../common/performance.md` with Unity-specific content.

## Scope
Extends the common performance policy for Unity runtime, content, and rendering behavior.

## Profiling Rules
- Optimize based on profiling evidence from representative hardware.
- Distinguish editor performance from player-build performance.
- Profile CPU, GPU, memory, load time, GC, and asset lifetime according to project risk areas.
- Record the build configuration and scene or flow used during profiling.

## Budget Rules
- Establish performance budgets per target platform and major game mode.
- Budgets should cover frame time, memory, loading, shader variants where relevant, and content footprint.
- Performance expectations for menus, gameplay, streaming, and background systems may differ and should be explicit.

## Runtime Rules
- High-frequency systems must minimize allocations, expensive object searches, broad event fan-out, and hidden synchronization work.
- Use pooling only when it reduces measured cost and does not create lifecycle bugs.
- Reduce per-frame work by choosing event-driven or batched approaches when appropriate.

## Rendering Rules
- Render pipeline choices must align with target platforms and team capacity.
- Shader complexity, overdraw, lighting strategy, post-processing, and texture memory must be budgeted.
- Scene or prefab authoring patterns that harm batching, culling, or memory residency should be identified early.

## Content Rules
- Asset import settings, atlasing, animation usage, audio loading, and Addressables strategy all affect performance and must be coordinated.
- Performance ownership is shared across engineering, art, technical art, and design.

## Validation
- Performance regressions should be caught during development, not only before release.
- Reproducible benchmark scenes or flows should exist for high-risk systems.

## Done Criteria
Unity performance work is ready when budgets are explicit, profiling is evidence-based, and optimization changes are validated on target hardware.
