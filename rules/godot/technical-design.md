# Godot Technical Design

## Purpose
Define what a good Godot technical design must capture before implementation begins.

## Scope
Applies to feature TDDs, architecture notes, ADRs, integration plans, and major refactor proposals.

## Required Design Content
- Identify authoritative scenes, scripts, autoloads, resources, and plugins involved.
- Define runtime ownership, signal flow, data boundaries, persistence implications, and platform assumptions.
- Capture failure modes around scene loading, missing dependencies, save compatibility, and export behavior.

## Design Expectations
- Designs must explain why a Godot-native approach was chosen.
- Tradeoffs between scene composition, autoloads, resources, and language choice must be explicit.
- Testing and profiling strategy must be included for risky systems.

## Done Criteria
A Godot technical design is complete when another contributor can implement, review, and test the feature without guessing at scene flow or engine-specific assumptions.
