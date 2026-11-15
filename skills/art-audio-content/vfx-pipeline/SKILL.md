---
name: vfx-pipeline
description: Create VFX authoring and integration rules that preserve readability, style fit, and performance.
origin: everything-game-dev-code
category: art-audio-content
---

# VFX Pipeline

## Purpose
Create VFX authoring and integration rules that preserve readability, style fit, and performance.

## Use When
- combat or interaction effects are being built
- VFX cost is escalating
- readability is poor

## Inputs
- art bible
- combat readability needs
- engine constraints
- performance budget

## Process
1. define effect categories and quality bars
2. separate gameplay-critical clarity from decorative layers
3. set cost expectations for particles, materials, lights, and post-process
4. create review checkpoints for style and readability
5. test effects under combat or stress conditions

## Heuristics
Defaults to start from; verify each one in play.

- do not rely on soft additive glow alone: lead with clearly drawn shapes and include dark values so the effect survives a bright background
- a hit mark should match the size of the result, originate where the volumes overlap, combine several elements (shockwave, sparks), avoid hiding the characters, clear quickly, and read on both light and dark backgrounds
- keep hit effects animating during hit-stop
- stage an explosion as flash, fireball, dark smoke, settle; too short and it has no weight — add screen flash and shake
- give screen shake different patterns per intensity, not only different amplitudes (a small shake may be vertical only); start strong, settle, add slight randomness, and correct for camera distance
- a full-white additive flash lowers contrast: alternate light and dark, and weaken it as the camera gets closer
- use character blinking to communicate state such as invulnerability
- weapon trails change perceived impact a great deal; vary their shape and colour by the weapon's character
- never bury the character: manage draw priority, leave a gap in the centre of large effects, or outline the character
- keep effect scale consistent with the world, or large objects read as miniatures
- for particle cost, prefer short lifetimes, low counts, little overdraw, and one larger well-drawn sprite over many small ones

## Outputs
- VFX guide
- cost tiers
- readability checklist
- integration notes

## Quality Bar
- is usable by content creators without tribal knowledge
- respects quality bars and runtime constraints together
- defines validation and ownership for content flow

## Common Failure Modes
- style consistency that ignores gameplay readability
- manual pipeline steps that create drift
- content that cannot be validated before release

## Related Agents
- technical-artist
- combat-designer
- performance-reviewer

## Related Commands
- combat-design
- verify
- perf-budget

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
- The Heuristics section is distilled, in our own words, from Masahiro Sakurai's "Creating Games" video series (via the unofficial community summary `kociden/sakurai-skill`). It reflects large-scale action-game experience: treat each point as a default to test against the player's enjoyment, and adapt it for other genres and project sizes.
