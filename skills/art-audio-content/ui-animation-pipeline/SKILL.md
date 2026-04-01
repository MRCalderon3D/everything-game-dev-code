---
name: ui-animation-pipeline
description: Define transition, feedback, and state-driven animation rules for UI elements.
origin: everything-game-dev-code
category: art-audio-content
---

# UI Animation Pipeline

## Purpose
Define transition, feedback, and state-driven animation rules for UI elements so interactions feel responsive, screens transition smoothly, and animations stay within performance budgets.

## Use When
- UI elements need hover, press, focus, or disabled state feedback
- screen transitions need standardization (fade, slide, scale)
- UI animations are inconsistent in timing, easing, or direction across screens
- new UI screens are being added and need animation behavior that follows project conventions

## Inputs
- UI flow map (screens, transitions, popups)
- interaction states per element type (normal, hover, pressed, focused, disabled)
- target frame rate and animation budget
- accessibility requirements (reduced motion preference)

## Process
1. define animation categories: state feedback (hover, press), screen transitions (in/out), attention (pulse, bounce), progress (fill, count)
2. set duration, easing curve, and delay rules per category
3. establish a reduced-motion fallback for each animation (instant cut or opacity-only)
4. configure animation via code (tweens, coroutines, or animation system) — not baked sprite sheets
5. validate animation timing, overlap behavior, and cancellation safety

## Outputs
- UI animation convention document (durations, easings, directions per category)
- state feedback specification per element type
- screen transition specification (in/out pairs)
- reduced-motion fallback map
- validation checklist for new UI animations

## Quality Bar
- every UI animation has a defined duration and easing — no magic numbers in code
- state feedback is immediate (under 100ms response time)
- screen transitions do not block input for more than 300ms
- reduced-motion fallback exists for every animation
- animations cancel cleanly when interrupted (no stuck states)

## Common Failure Modes
- inconsistent easing curves that make the UI feel disjointed
- animations that block input, making the UI feel sluggish
- missing cancellation logic that leaves elements in mid-animation state
- no reduced-motion fallback, failing accessibility requirements
- overlapping animations that compete for the same element

## Related Agents
- 2d-artist
- ui-programmer
- ui-ux-designer
- accessibility-reviewer

## Related Commands
- ui-asset-pass
- ui-flow-review
- verify

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
- Prefer code-driven animations (tweens, coroutines, DOTween, Animator triggers) over baked sprite sheet animations for UI. Code-driven animations are resolution-independent and easier to tune.
