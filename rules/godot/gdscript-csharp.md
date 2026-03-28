# Godot GDScript and C# Boundaries

## Purpose
Define how projects should split work between GDScript and C# when both languages are present.

## Scope
Applies to gameplay systems, tools, UI, plugins, performance-sensitive logic, and integration seams.

## Boundary Principles
- Choose the language based on ownership, tooling needs, runtime constraints, maintainability, and team capability.
- Do not split a feature across both languages without a clear reason.
- Language choice should support iteration speed as well as long-term maintenance.

## Usage Guidance
- GDScript is often appropriate for rapid iteration, scene-local behavior, and designer-friendly workflows.
- C# may be justified for stronger typing preferences, existing team expertise, shared libraries, or specific performance/organizational needs.
- Mixed-language projects must document where the seam lives and who owns it.

## Integration Rules
- Public APIs between languages should be stable, minimal, and documented.
- Scene setup and node access conventions must remain clear across language boundaries.
- Avoid duplicate logic implemented once in GDScript and again in C#.

## Done Criteria
Language boundaries are healthy when the split is intentional, easy to understand, and does not create avoidable integration friction.
