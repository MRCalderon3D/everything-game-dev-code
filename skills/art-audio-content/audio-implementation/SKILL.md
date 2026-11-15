---
name: audio-implementation
description: Integrate music, SFX, VO, mixing, and reactive audio behavior so audio supports gameplay and UX.
origin: everything-game-dev-code
category: art-audio-content
---

# Audio Implementation

## Purpose
Integrate music, SFX, VO, mixing, and reactive audio behavior so audio supports gameplay and UX.

## Use When
- audio content is entering implementation
- mixing is unclear
- audio cues matter for gameplay or accessibility

## Inputs
- audio design goals
- event map
- platform constraints
- subtitle or accessibility requirements

## Process
1. define event-driven audio behaviors and ownership
2. set category mixing and ducking rules
3. handle looping, transitions, and interrupt behavior deliberately
4. ensure critical information is not audio-only without backup
5. test audio in representative gameplay contexts

## Heuristics
Defaults to start from; verify each one in play.

- rank sound effects by how much they affect the player's decisions and resolve conflicts in that order — outcome and hit confirmation first, then actions, movement, and ambience last
- shape hit sounds with a strong attack and modest tail; for a heavy hit the main body of the sound should finish within the hit-stop
- vary footsteps and split them by surface; keep ambience low but never silent
- decide the mix of exaggerated and realistic sound from the genre and the visual style; realistic sound adds material information
- match music tempo to the speed of play
- keep the number of tracks modest and reuse arrangements of the main theme; an arrangement must keep the melody recognisable
- keep voice lines during action short and restrained
- check the mix on headphones, small computer speakers, and a cheap television
- brief sound work with concrete descriptions, comparisons to familiar things, and reference clips that say what is wanted from them; judge results by whether they serve the game, not by whether they match the sound imagined beforehand

## Outputs
- audio implementation map
- mixing rules
- event-trigger notes
- accessibility follow-up items

## Quality Bar
- is usable by content creators without tribal knowledge
- respects quality bars and runtime constraints together
- defines validation and ownership for content flow

## Common Failure Modes
- style consistency that ignores gameplay readability
- manual pipeline steps that create drift
- content that cannot be validated before release

## Related Agents
- audio-designer
- ui-ux-designer
- accessibility-reviewer

## Related Commands
- audio-pass
- verify
- update-docs

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
- The Heuristics section is distilled, in our own words, from Masahiro Sakurai's "Creating Games" video series (via the unofficial community summary `kociden/sakurai-skill`). It reflects large-scale action-game experience: treat each point as a default to test against the player's enjoyment, and adapt it for other genres and project sizes.
