# Web Audio

## Purpose
Define audio architecture rules for browser games built on the WebAudio API.

## Scope
Applies to audio graph design, autoplay unlock, mixing buses, placeholder audio, and latency expectations.

## Playback Rules
- Create or resume the audio context on the first user gesture; browsers block autoplay until then.
- Design the audio graph with explicit mixing buses (master, music, effects) and route every source through them.
- Decode and cache short effects up front; stream long music tracks rather than buffering them whole.

## Production Rules
- Procedural placeholder audio (synthesized tones or noise) is acceptable until final assets land and must be generatable in-project.
- Expose volume and mute controls per bus and persist player preferences.
- Treat output latency as variable across browsers and devices; do not build gameplay that requires tight audio sync without measuring it.

## Done Criteria
Audio is healthy when playback unlocks reliably, mixing is centralized, and latency assumptions are explicit.
