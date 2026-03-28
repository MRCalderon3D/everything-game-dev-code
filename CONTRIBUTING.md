# CONTRIBUTING.md

Thank you for contributing to this scaffold.

## Purpose

This repository is intended to be a reusable foundation for AI-assisted game development workflows.
Contributions should improve clarity, consistency, reusability, engine isolation, and production usefulness.

## What Good Contributions Look Like

Strong contributions usually do one or more of the following:

- improve an existing rule, skill, command, or template
- add a reusable workflow pattern
- improve engine-specific guidance without polluting common layers
- strengthen install profiles, schemas, tests, or examples
- make the scaffold safer to use in real production contexts

## Contribution Principles

### 1. Preserve structure
Do not introduce new folders, naming schemes, or hierarchy changes unless there is a strong architectural reason.
The repository relies on consistent naming and predictable routing.

### 2. Respect engine isolation
Do not mix Unity, Unreal, and Godot implementation details inside common layers.
If guidance is engine-specific, it belongs in the relevant engine pack.

### 3. Keep files purposeful
Every file should have a clear job.
Avoid bloated documents that combine unrelated concerns.
If a concept needs a separate reusable home, create it intentionally and wire it into the system.

### 4. Prefer reusable patterns over one-off advice
A contribution is more valuable when it helps future tasks as well as the current one.

### 5. Maintain operational quality
Contributions should be:

- clear
- structured
- internally consistent
- realistic for game production
- aligned with existing docs, manifests, and schemas

## Areas You Can Contribute To

- `rules/`
- `agents/`
- `commands/`
- `skills/`
- `docs/templates/`
- `docs/orchestration/`
- `manifests/`
- `schemas/`
- `tests/`
- `examples/`
- adapters, MCP configs, and scripts

## Before You Add Something New

Ask:

- does this already exist elsewhere in the repo?
- should this extend an existing file instead?
- is it common, or engine-specific?
- does it need schema/test coverage?
- does it affect install profiles or orchestration docs?

## Style Expectations

### Writing
- be concrete
- avoid vague placeholder language
- separate principles, process, deliverables, and done criteria where useful
- write for execution, not just inspiration

### Structure
- follow the existing naming pattern
- keep one clear responsibility per file
- use predictable headings and stable terminology

### JSON and machine-readable files
- keep shapes consistent with schemas
- update tests when validation expectations change
- avoid speculative config keys without usage intent

## Required Updates When Relevant

If your change affects behavior, you may also need to update:

- documentation templates
- orchestration docs
- manifests
- schemas
- tests
- examples

## Pull Request Guidance

A strong change submission should explain:

- what changed
- why it changed
- which layer(s) it affects
- whether it is engine-neutral or engine-specific
- whether tests, schemas, or manifests were updated
- whether install-profile behavior changed

## Things to Avoid

- adding engine-specific detail to common docs
- changing names or folder structure casually
- adding commands or agents without routing rationale
- adding skills that duplicate other skills
- adding docs that look polished but are not operationally useful
- weakening validation or tests without clear justification

## Final Rule

Contribute in ways that make the scaffold more usable for real game teams, not just more impressive on paper.
