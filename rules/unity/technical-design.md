# unity/technical-design

Extends `../common/technical-design.md` with Unity-specific content.

## Scope
Extends the common technical-design rule for Unity implementation work.

## Required Sections
- Unity version and key package dependencies
- module and asmdef impact
- scene, prefab, and data ownership
- runtime lifecycle and initialization strategy
- save/load or serialization impact
- input, UI, and platform implications
- performance considerations
- testing and validation plan
- editor tooling or authoring workflow changes
- migration and rollout strategy when relevant

## Architecture Rules
- Technical designs must explain why the chosen Unity pattern fits the feature.
- Document whether logic lives in plain C#, MonoBehaviours, ScriptableObjects, services, jobs, ECS, or hybrid patterns where relevant.
- Make the boundary between authored content and runtime logic explicit.

## Risk Rules
- Identify Unity-specific risks such as scene coupling, package conflicts, prefab sprawl, serialization breakage, or platform build drift.
- Technical designs must call out any assumptions that would be expensive to reverse later.

## Done Criteria
A Unity technical design is ready when another Unity engineer can implement, review, test, and support the feature without relying on unstated engine knowledge.
