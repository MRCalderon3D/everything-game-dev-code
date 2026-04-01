# Playtest Report — M3 Vertical Slice
## Dash & Collect

- **Date:** 2026-03-31
- **Format:** Self-assessment (1 tester — developer)
- **Build:** Editor play mode, Unity 6000.3.12f1
- **Session length:** ~5 minutes
- **Analyst:** playtest-analyst role

---

## Proof Point Results

| # | Proof Point | Result | Tester Observation |
|---|---|---|---|
| P1 | Auto-run feels controlled, not helpless | **PASS** | Felt in control during the run |
| P2 | Dash input responsive (keyboard + touch) | **PASS** | No input delay or missed inputs reported |
| P3 | Dash chain → visible obstacle density change within 2 beats | **PASS** | Tester noticed the change |
| P4 | Core loop understandable without tutorial | **FAIL** | Tester did not read "collect to change what comes next" without prompting |
| P5 | Death is clear and motivates retry | **PASS** | Death clear; immediate desire to retry |
| P6 | New players reach 500m within 3 attempts | **FAIL** | Not reached in first 3 attempts |
| P7 | Chain counter readable without text | **PASS** | 3-dot display understood without explanation |
| P8 | 60fps sustained, no stutters | **PASS** | No framerate drops observed in editor |

**Score: 6/8 PASS**

---

## Critical Findings

### F1 — P4 FAIL: Modifier connection not legible (HIGH severity)
The tester observed the density change (P3 PASS) but did not connect it to the collect action. The cause–effect link between collecting Dash items and the world changing is not communicated clearly enough at the point of action.

**Root cause hypothesis:** The modifier activates silently. There is no moment of feedback that says "your collection caused this." The chain flash provides feedback at completion, but not at the point of individual collection. The player sees dots fill and a flash, but the causal link to upcoming spawns is not explicit.

**Recommended fix (pre-M4):**
- Add a brief on-screen label or icon that appears when modifier activates: e.g. a small "SPARSE" label near the chain dots for 1–2 seconds
- Or increase the contrast of the density change — make Sparse chunks visually distinct from Dense in a way that reads immediately

**Risk reference:** R1 — "Collect-modifies-world is not legible" (Medium prob, Critical impact)

---

### F2 — P6 FAIL: Casual players not reaching 500m (MEDIUM severity)
The tester did not reach 500m in 3 attempts. Given this is a developer self-assessment (not a casual audience), this is a meaningful signal.

**Root cause hypothesis:** Initial speed or obstacle density may be too high for a first session. The lack of a safe "breathing room" chunk at run start could be contributing.

**Recommended fix (pre-M4):**
- Review `SpawnConfig.initialSpeed` (currently 5) — consider whether 4 is more appropriate
- Guarantee the first 2 chunks are Safe-tagged to give the player time to orient
- Confirm `ChunkSafe` is weighted higher in the first 250m

---

## Passed Observations

- **Movement:** The 3-lane snap dash reads as controlled immediately. No adjustment needed.
- **Death & retry loop:** The loop is tight. Death screen readable. Retry motivation present.
- **Chain counter:** 3-dot display works without explanation. Colour differentiation is clear.
- **Performance:** No GC or frame issues observed in editor. Formal profiler run still required for player build.

---

## Go / No-Go Recommendation

| Criterion | Status |
|---|---|
| P1–P7 all pass (5-person formal playtest) | ❌ Not met — 1 tester, P4 + P6 fail |
| P3 + P4 both pass | ❌ P4 fails |
| 60fps in player build | ⚠️ Editor only — player build not profiled |
| Go/no-go recorded | Pending |

### Recommendation: **CONDITIONAL GO**

**Rationale:** This was a 1-person developer self-assessment, not a 5-person formal playtest. The data confidence is low. However, P4 (modifier legibility) is the highest-priority design risk and its failure is meaningful even with a single data point.

**Condition:** Add modifier activation feedback (F1 fix) before or at the start of M4. This is a small engineering + design task that does not require blocking M4 entirely.

**P6** is lower severity for a developer tester — casual players are expected to struggle more than a developer. Monitor at first external playtest.

**Formal 5-person playtest should be scheduled during M4** to validate the F1 fix and retire R1 properly.

---

## Follow-up Actions

| # | Action | Owner | Priority | Target |
|---|---|---|---|---|
| A1 | Add modifier activation feedback — label or icon when bias activates | engineer / design | **P0 — before M4** | M4 entry |
| A2 | Review initial speed and first-chunk safety guarantee | engineer | P1 | M4 entry |
| A3 | Schedule 5-person external playtest during M4 | producer | P1 | M4 mid-point |
| A4 | Profiler S1/S2/S5 runs on player build (PC + Android) | engineer | P1 | M4 entry |

---

## Data Limitations

- **Sample size:** 1 (developer self-assessment). All findings should be treated as hypotheses, not conclusions.
- **Audience bias:** Developer testers are not representative of casual players for P6.
- **Platform:** Editor only. P8 result is indicative, not definitive.
- **No formal observation protocol was run.** A structured 5-person playtest with an observation sheet is still required to formally close M3.
