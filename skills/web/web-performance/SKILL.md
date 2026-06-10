---
name: web-performance
description: Keep a browser game inside its frame budget through allocation discipline, pooling, and devtools-driven profiling.
origin: everything-game-dev-code
category: web
---

# Web Performance

## Purpose
Keep a browser game inside its frame budget through allocation discipline, pooling, and devtools-driven profiling.

## Use When
- the game stutters, hitches, or misses its frame budget on target devices
- defining performance budgets before heavy content lands
- reviewing per-frame code for allocation and GC pressure

## Inputs
- frame budget per target (typically 16.7 ms at 60 Hz) split across simulation, rendering, and headroom
- target device list, including a representative low-end phone
- current profiler captures, if any
- list of high-churn entities (bullets, particles, enemies, popups)

## Process
1. set explicit budgets per system and measure before optimizing: capture a browser devtools performance profile during real gameplay, not menus
2. read the profile for long tasks, dropped frames, and minor-GC markers; use the allocation profiler to find per-frame garbage sources
3. remove steady-state allocation from hot paths: reuse scratch vectors and arrays, avoid per-frame closures, string building, and array methods that allocate
4. pool high-churn entities with explicit acquire, release, and reset rules so gameplay spikes do not become GC pauses
5. cull and throttle: skip offscreen work, cap particle and entity counts, stop or reduce work when the page is hidden, and re-verify on the low-end device after each change

## Outputs
- frame budget table per system and device tier
- profiling findings with attributed costs
- pooling and allocation rules for hot paths
- before/after measurements for each optimization

## Quality Bar
- every optimization is justified by a profile capture, not intuition
- steady-state gameplay shows near-zero allocation in the heap timeline; GC activity is rare and short
- pooled entities reset fully on release, so reuse never leaks stale state into gameplay
- the frame budget holds on the weakest target device, not just the development machine
- background tabs stop burning CPU and battery

## Common Failure Modes
- optimizing unprofiled code while the actual cost sits in an unbatched draw path or a layout-triggering DOM read
- per-frame closures, spreads, and temporary arrays creating a sawtooth heap and periodic GC hitches
- pools that grow without bounds or hand out objects still referenced by live gameplay
- profiling only on a high-end desktop and shipping a game that drops to 20 fps on mid-range phones
- death-by-a-thousand-cuts entity logic where per-entity virtual calls and lookups exceed the simulation budget at peak counts

## Related Agents
- performance-reviewer
- gameplay-programmer
- web-reviewer

## Related Commands
- perf-budget
- web-review
- verify

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- Framework internals (renderer batching, tween pools) count against the same budgets; profile through the framework rather than assuming it is free.
