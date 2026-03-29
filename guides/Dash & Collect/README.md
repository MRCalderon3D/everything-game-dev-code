# Dash & Collect — Unity Game Guide (0 to 100)

A complete walkthrough for building a 2D endless runner using the **everything-game-dev-code** scaffold from concept to post-launch.

---

## Game Concept

**Dash & Collect** is a 2D side-scrolling endless runner.

- The player's character auto-runs forward
- Tap or press a button to jump over obstacles
- Collect coins for bonus score
- Game ends on obstacle collision
- Speed increases over time

**Design pillars:** instant restart, satisfying jump, escalating tension.

**Scope:** main menu, gameplay scene, game-over screen, local high-score, basic audio.

---

## Guide Structure

| Chapter | Title | Context Phase |
|---------|-------|--------------|
| [Chapter 0](./chapter-00-scaffold-onboarding.md) | Scaffold Onboarding | — |
| [Chapter 1](./chapter-01-ideation.md) | Ideation | `contexts/ideation.md` |
| [Chapter 2](./chapter-02-preproduction.md) | Pre-Production | `contexts/preproduction.md` |
| [Chapter 3](./chapter-03-core-systems.md) | Core Systems | `contexts/production.md` |
| [Chapter 4](./chapter-04-supporting-systems.md) | UI / Input / Audio / Save | `contexts/production.md` |
| [Chapter 5](./chapter-05-review.md) | Code Review & Scene Audit | `contexts/review.md` |
| [Chapter 6](./chapter-06-performance.md) | Performance Pass | `contexts/performance.md` |
| [Chapter 7](./chapter-07-qa.md) | QA & Testing | `contexts/qa.md` |
| [Chapter 8](./chapter-08-release.md) | Release | `contexts/release.md` |
| [Chapter 9](./chapter-09-liveops.md) | Post-Launch & Live Ops | `contexts/liveops.md` |

---

## How to Use This Guide

Each chapter maps a game development phase to the scaffold features that support it.
You do not need a running Unity project to follow along — every chapter includes example
outputs (GDD excerpts, TDD excerpts, test plans) so the scaffold workflow is clear without
running Unity.

**Read order:** Start at Chapter 0 if you are new to the scaffold. Jump to any chapter if
you already know the basics and want to see how a specific phase works.

---

## Scaffold Feature Coverage

| Scaffold Feature | Chapters |
|-----------------|---------|
| `agents/` | 1–9 |
| `commands/` | 0–9 |
| `skills/` | 1–9 |
| `rules/common/` | 0–9 |
| `rules/unity/` | 0, 2–9 |
| `contexts/` | 1–9 |
| `hooks/` | 0, 2–4, 7–8 |
| `manifests/` | 0 |
| `schemas/` | 0 |
| `docs/templates/` | 1, 2, 7–9 |
| `docs/orchestration/` | 5 |
