---
name: rigging-skinning-pipeline
description: Define skeleton, skinning, and attachment conventions so rigs deform well, share animations, and stay within budgets.
origin: everything-game-dev-code
category: art-audio-content
---

# Rigging and Skinning Pipeline

## Purpose
Define skeleton, skinning, and attachment conventions so rigs deform well, share animations, and stay within budgets.

## Use When
- characters or creatures need skeletal animation and no rig convention exists
- animations must be shared or retargeted across multiple characters
- deformation artifacts, bone-count costs, or attachment offsets keep recurring

## Inputs
- character/creature inventory and their animation needs
- target runtime's skinning limits (bone count, influences per vertex)
- shared-animation and retargeting requirements
- attachment needs (weapons, props, cloth, accessories)

## Process
1. define the canonical skeleton per character family: bone naming, hierarchy, orientation conventions, and a documented rest pose (T or A)
2. budget bones and influences per vertex (typically 4) against the weakest target; separate deform bones from control/helper bones and export only deform bones
3. standardize skinning quality rules: clean weights at deformation hotspots (shoulders, hips, spine), no influences from non-deform bones, normalized weights
4. make rigs retarget-friendly: consistent proportions of the core hierarchy, humanoid-standard naming where the runtime supports retargeting
5. define attachment sockets/bones (hands, back, hips) with documented orientation so props attach without per-prop offsets
6. validate every new rig with a standard pose/animation set before production animations are authored on it

## Outputs
- skeleton convention sheet per character family (naming, hierarchy, rest pose)
- bone and influence budgets
- skinning quality checklist and validation pose set
- attachment socket map

## Quality Bar
- any animator can open any character and find the same skeleton conventions
- shared animations retarget across the family without per-character cleanup
- deformation passes the validation pose set at the budgeted influence count
- props attach to sockets correctly without per-prop offset hacks

## Common Failure Modes
- every character rigged ad hoc, so nothing retargets and every animation is single-use
- control rigs exported into the runtime, doubling bone counts silently
- skin weights tweaked per animation instead of fixing the rig once
- attachment points eyeballed per prop, drifting as characters change

## Related Agents
- technical-artist
- animation-programmer

## Related Commands
- art-3d-pass
- perf-budget

## Related Skills
- 3d-animation-pipeline
- 3d-asset-pipeline

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
- Boundary: this skill owns the rig and deformation; `3d-animation-pipeline` owns the clips authored on it.
