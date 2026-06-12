---
name: 3d-animation-pipeline
description: Define authoring, export, root motion, and retargeting rules for skeletal 3D animation clips.
origin: everything-game-dev-code
category: art-audio-content
---

# 3D Animation Pipeline

## Purpose
Define authoring, export, root motion, and retargeting rules for skeletal 3D animation clips so they play correctly, blend cleanly, and stay within budgets.

## Use When
- the project uses skeletal 3D animation and clip conventions are undefined
- root motion versus in-place locomotion has not been decided explicitly
- clips from different animators or sources blend badly or drift

## Inputs
- animation list per character (locomotion set, actions, reactions, deaths)
- the rig conventions from the rigging pipeline
- root motion policy needs (gameplay-driven vs animation-driven movement)
- target runtime's clip, compression, and blending capabilities

## Process
1. define clip naming and organization per character/family (entity_action_variant), with loop flags and frame ranges documented
2. decide the root motion policy explicitly per locomotion type — animation-driven (root motion) or gameplay-driven (in-place plus speed sync) — and keep it consistent; mixed policies are the main source of foot sliding
3. standardize authoring rules: frame rate, keyed rest pose at frame 0, no scale keys unless agreed, and consistent root bone treatment on export
4. define blend and transition expectations per clip type (sync markers for locomotion cycles, exit windows for actions) so state machines can rely on them
5. set retargeting rules for shared clips: which clips are family-shared, which are character-specific, and the validation pose to verify after retarget
6. budget clip memory and choose compression settings per category; validate that compression does not visibly damage contact points (feet, hands)
7. validate every clip batch in the runtime — playback, loops, blends, root motion distance — before integration is considered done

## Outputs
- clip naming/organization convention with loop and range metadata
- root motion policy per locomotion/action category
- blend/transition contract (sync markers, exit windows)
- compression and memory budgets plus the clip validation checklist

## Quality Bar
- locomotion shows no foot sliding: root motion or speed sync matches clip distance
- loops are seamless and sync markers keep blended cycles in phase
- retargeted shared clips pass the validation pose on every family member
- clip memory stays within budget at shipping compression settings

## Common Failure Modes
- mixed root-motion and in-place clips driving the same character, causing drift and sliding
- loop frames duplicated or missing, popping at every cycle
- compression applied globally until contacts visibly swim, then disabled globally
- clips authored against a stale rig and exported with silent bone mismatches

## Related Agents
- animation-programmer
- technical-artist

## Related Commands
- art-3d-pass
- animation-pass
- perf-budget

## Related Skills
- rigging-skinning-pipeline
- animation-state-patterns
- 2d-animation-pipeline

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
- Boundary: this skill owns clip authoring/export conventions; `animation-state-patterns` owns runtime state-machine architecture; `2d-animation-pipeline` owns sprite and skeletal-2D equivalents.
