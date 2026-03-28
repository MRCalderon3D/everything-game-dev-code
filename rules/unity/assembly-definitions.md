# Unity Assembly Definitions

## Purpose
Define how Assembly Definition Files (asmdefs) are used to control compilation boundaries, dependency direction, testability, and iteration speed.

## Scope
Applies to all Unity projects that use asmdefs or should adopt them due to project size and compile-time needs.

## Core Rules
- Use asmdefs to create explicit module boundaries.
- Organize assemblies by domain and runtime responsibility, not by arbitrary technical layering alone.
- Dependencies must flow inward toward stable foundations, not outward toward volatile feature code.
- Avoid cyclic references under all circumstances.

## Assembly Types
- Separate runtime, editor, and test assemblies.
- Shared abstractions may live in a dedicated core or contracts assembly when justified.
- Platform-specific code should be isolated where it reduces preprocessor sprawl and build risk.

## Dependency Rules
- Reference only what is needed.
- UI, gameplay, tools, networking, analytics, and platform integrations should not all depend on a single mega-assembly.
- Editor assemblies must never leak into player builds.
- Avoid making one assembly a dumping ground for miscellaneous helpers.

## Naming Rules
- Use stable names that reflect ownership and purpose.
- Assembly names should map cleanly to folders and module docs.
- Test assemblies should clearly identify which runtime assembly they validate.

## Review Rules
- New asmdefs require a short justification of ownership and dependency direction.
- Broad new references require architectural review.
- When compile errors propagate widely after a change, re-evaluate module boundaries instead of only patching symptoms.

## Deliverables
- Assembly map.
- Dependency direction guide.
- Runtime/editor/test separation plan.

## Done Criteria
Asmdef architecture is healthy when compile boundaries are explicit, dependency direction is intentional, and changes do not force unnecessary recompilation across unrelated domains.
