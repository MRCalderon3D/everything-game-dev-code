---
name: verification-loop
description: Run a structured verification pass that checks behavior, edge cases, quality bars, and documentation alignment.
origin: everything-game-dev-code
category: workflow
---

# Verification Loop

## Purpose
Run a structured verification pass that checks behavior, edge cases, quality bars, and documentation alignment.

## Use When
- a feature claims to be done
- a risky fix needs confidence
- milestone integration is underway

## Inputs
- implemented change
- acceptance criteria
- test outputs
- docs and known risks

## Process
1. compare the implementation to the intended design and technical behavior
2. verify happy path, edge cases, and failure recovery
3. check docs, telemetry, and QA notes for drift
4. for risky, feel-critical, or player-facing work, run an independent review (see Heuristics)
5. record gaps and assign owners
6. close only when blockers or ambiguities are resolved

## Heuristics
**Independent review** — whoever built something reads it through their own intent and stops seeing its gaps.

- the reviewer must not be the author: use a different person, or a fresh agent with no memory of how the work was built
- give the reviewer the artifact and the criteria (acceptance criteria, the relevant skill's Quality Bar and Heuristics) — not the author's explanation of why it is fine
- every finding names the criterion it fails and a concrete fix; a complaint with no proposed change is not a finding
- the author answers each finding: accepted with the change made, or declined with the reason — nothing is dropped silently
- record the findings and their dispositions in the verification summary
- do not ask a reviewer to confirm a conclusion; ask them to look for what is wrong

## Outputs
- verification summary
- defect list
- independent review findings with a disposition for each (when a review was run)
- doc updates needed
- go/no-go recommendation

## Quality Bar
- produces a current source of truth, not disconnected notes
- names owners, risks, and next actions explicitly
- separates decisions from assumptions and open questions

## Common Failure Modes
- outdated docs that no longer match reality
- plans with no owner or no exit criteria
- hiding risks until they become schedule blockers

## Related Agents
- qa-lead
- code-reviewer
- performance-reviewer

## Related Commands
- verify
- qa-plan
- update-docs

## Notes
- Keep this skill aligned with the relevant rules layer and current project documentation.
- If engine-specific constraints materially change the workflow, hand off to the matching engine skill or engine-specific reviewer.
