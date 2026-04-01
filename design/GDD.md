# Game Design Document — Dash & Collect

## Document Control
- **Project:** Dash & Collect
- **Feature / Product:** Full game
- **Owner:** TBD
- **Contributors:** TBD
- **Version:** 0.1
- **Status:** Draft
- **Last Updated:** 2026-03-29
- **Related Docs:** `design/` (this folder), `contexts/ideation.md`

---

## 1. Executive Summary

### 1.1 Elevator Pitch
Dash & Collect is a 2D endless runner for casual players on PC and mobile. The player dashes through a scrolling world, deliberately targeting collectibles that modify the obstacles ahead — turning collection from a passive score mechanic into an active decision made every second.

### 1.2 Product Pillars
- **Instant Readability** — Any obstacle, collectible, or hazard is understood in under one second. No tutorial required.
- **One More Run** — Each run ends with a clear signal of *why* you died and *what you almost had*. Death motivates retry, not frustration.
- **Earned Progression** — Collecting items unlocks something visible and meaningful. Players feel rewarded for sustained play without grinding.

### 1.3 Player Promise
> "I want to feel in the zone — reacting fast, collecting things that feel rewarding, and always believing my next run will go further."

The player should consistently:
- **Feel** — in flow, in control, and briefly devastated at death
- **Do** — read the screen ahead, decide which collectible to chase, and react to what spawns as a result
- **Understand** — what they collected, what it changed, and what they need to do next

---

## 2. Audience and Positioning

### 2.1 Target Audience
- **Primary:** Casual players, ages 16–40, PC and mobile. Short-session escapism with a progress hook. Typical play window: 3–5 minutes.
- **Secondary:** Score-chasers who replay for leaderboard position and optimal collection chains.
- **Platform assumptions:** PC (keyboard + mouse) and mobile (touch). Input must feel native on both — tap-first design, keyboard must be equally responsive.
- **Session length assumptions:** Target 90-second average run. Meta session (multiple runs) target: 10–15 minutes.

### 2.2 Market Positioning
- **Comparable titles:** Subway Surfers, Jetpack Joyride, Alto's Odyssey, Temple Run 2
- **Genre expectations to meet:** Auto-running movement, obstacle avoidance, persistent meta progression, instant restart
- **Genre expectations to subvert:** Collection is active skill expression, not passive sweeping. What you collect changes what you face next — players who read ahead gain a measurable advantage.

---

## 3. Core Experience

### 3.1 Core Fantasy
The player is always in motion. They are not reacting to a random obstacle course — they are *shaping* the run by choosing which items to grab. A skilled player reads two beats ahead: dodge the hazard, grab the modifier, watch the path change. A casual player just grabs what they can reach and still has fun.

### 3.2 Core Loop
1. **Player action** — Dash left/right (or tap lane) to intercept a collectible or avoid a hazard
2. **System response** — Collectible type is registered; the upcoming obstacle set shifts based on what was grabbed
3. **Reward / pressure** — Score increases; a run modifier activates (positive or negative); speed may increase
4. **New decision** — The changed obstacle layout presents a new set of collectibles to evaluate

### 3.3 Supporting Loops

**Session loop (within one run):**
- Collect → modifier activates → difficulty adjusts → new collectibles appear → collect again
- Chains of matching collectibles build a score multiplier
- Run ends on collision; death screen shows distance, score, and the chain that was almost complete

**Meta progression loop (across runs):**
- Collected currency unlocks cosmetic or convenience items (run modifiers visible earlier, slightly wider collection radius)
- Daily missions layer a secondary goal over each run — reduces "what's the point" dropout
- Personal best and optional leaderboard provide replayability for secondary audience

**Long-term mastery loop:**
- Players learn which collectible combinations produce favorable obstacle layouts
- This knowledge compounds over time without gating casual players who ignore it

---

## 4. Game Structure

### 4.1 Modes
- **Endless Run** — primary mode; single continuous run until collision
- **Daily Challenge** — fixed seed run, same for all players on that date; optional
- **Main Menu / Meta Hub** — run history, progression, settings

### 4.2 Session Structure
1. Player opens game → sees personal best and active daily mission on hub screen
2. Taps/clicks Start → immediate run begins, no loading screen if possible
3. Run ends → death screen: distance, score, chain broken, mission progress
4. One-tap restart → new run begins immediately

### 4.3 Progression Structure
- **Unlocks:** Meta currency (collected in-run) unlocks cosmetic character variants and minor convenience upgrades. No pay-to-win path.
- **Difficulty curve:** Speed increases at fixed distance intervals. Collectible density increases proportionally. Obstacle pattern complexity increases in steps, not continuously.
- **Content gating:** None for core gameplay. All obstacle types visible from run one. Cosmetics gated by currency accumulation.
- **Failure / retry structure:** Instant restart. No lives, no wait timers. Death screen shows exactly what the player hit and the score delta from their best run.

---

## 5. Systems Overview

### 5.1 Movement / Traversal
- **Purpose:** Give the player spatial agency within a constrained auto-running world
- **Player goal:** Position the character to intercept target collectibles and avoid hazards
- **Inputs:** Tap/swipe left–right (mobile); arrow keys or A/D (PC). Single dash action per input.
- **Rules:**
  - Character runs automatically at a base speed that escalates over time
  - Player controls left/right lane position (3 lanes) or continuous horizontal movement — *TBD: see Open Questions*
  - A "dash" input moves the character one lane instantly with a short recovery frame
- **Feedback:** Dash has a visual snap and audio click. Collectible pickup has distinct audio per type. Hazard hit triggers screen flash and death state.
- **Failure states:** Collision with hazard = run ends. No partial damage.
- **Edge cases:** Simultaneous input on both directions = neutral (no movement). Input during recovery frame = queued for one frame only.

### 5.2 Collectible Interaction
- **Purpose:** Make collection the primary skill expression; feed the modifier system
- **Player goal:** Intercept target collectible types to build chains and trigger favorable modifiers
- **Inputs:** Position (collision-based); no separate collect button
- **Rules:**
  - Three collectible types: **Dash** (blue), **Shield** (gold), **Surge** (red)
  - Collecting 3 of the same type in sequence triggers a modifier (see §5.3)
  - Collecting mismatched types resets the chain counter; still scores points
  - Collectible layout is seeded by the *previous* collectible picked up — creates cause-and-effect readability
- **Resources:** Score (display only), Chain Counter (1–3 per type), Meta Currency (persists across runs)
- **Feedback:** Chain counter displayed near character (not HUD corner). Type icon pulses at 2/3 progress. Chain completion triggers screen-edge color flash.
- **Failure states:** Broken chain = counter resets; no punishment beyond lost multiplier opportunity
- **Edge cases:** Two collectibles in same lane = player grabs whichever hitbox is entered first

### 5.3 Modifier System
- **Purpose:** Translate collection choices into tangible run consequences; create the differentiator
- **Player goal:** Trigger favorable modifiers; survive unfavorable ones triggered by poor chains
- **Rules:**

  | Chain Complete | Modifier | Duration |
  |----------------|----------|----------|
  | 3× Dash (blue) | Obstacle density reduces for 5 seconds | 5s |
  | 3× Shield (gold) | Next collision is absorbed (one-hit shield) | Until used or 15s |
  | 3× Surge (red) | Speed increases + score multiplier ×2 | 8s |
  | Mixed (no chain) | No modifier; speed increases slightly (standard escalation) | Permanent |

- **Feedback:** Active modifier shown as a pulsing icon near the character (not HUD). Modifier expiry warned with audio cue 2 seconds before.
- **Failure states:** Shield absorbs one hit, then is consumed. Surge increases collision risk — player opted into the risk.
- **Telemetry implications:** Log chain type, chain completion rate, modifier active at time of death.

### 5.4 Progression / Meta Upgrades
- **Purpose:** Give casual players a reason to return across multiple sessions
- **Player goal:** Accumulate meta currency to unlock cosmetics and minor run aids
- **Rules:**
  - Meta currency earned per run based on distance + chain completions
  - Unlocks: character skins (cosmetic), trail effects (cosmetic), "chain preview" indicator (convenience — shows next collectible type one beat earlier)
  - No upgrade increases base speed cap, damage resistance (beyond shield collectible), or score multiplier cap
- **Failure states:** Nothing is locked behind paywall at this stage. Economy design deferred.

### 5.5 Objectives / Daily Missions
- **Purpose:** Provide a secondary goal that reduces dropout after death
- **Player goal:** Complete 3 daily missions per day for bonus meta currency
- **Rules:** Missions are procedurally selected from a fixed pool (e.g., "Complete a Dash chain twice in one run", "Reach 1000m", "Collect 15 Shield items")
- **Failure states:** Mission resets if run ends before completion; progress does not persist mid-run

### 5.6 Obstacle / Encounter Generation
- **Purpose:** Provide challenge that escalates without becoming unfair
- **Rules:**
  - Obstacles spawn in pre-authored patterns ("chunks"), selected pseudo-randomly
  - Active modifier biases chunk selection (Dash modifier filters out dense chunks)
  - Chunk pool expands at distance milestones (new obstacle types introduced gradually)
- **Failure states:** If chunk system produces an impossible gap (e.g., hazard in all 3 lanes simultaneously), a safety pass replaces the center lane hazard with a collectible

### 5.7 Save / Load / Persistence
- **Purpose:** Retain meta progression and personal bests across sessions
- **Rules:** Personal best distance and score saved locally. Meta currency balance saved locally. Daily mission state saved locally with date stamp.
- **Edge cases:** No cloud save in initial scope. Platform save API deferred.

### 5.8 Multiplayer / Online
- Out of scope for v1. Leaderboard (read-only, async) is optional stretch goal.

---

## 6. Content Structure

### 6.1 World / Level Structure
- Single continuous scrolling world. No discrete levels.
- Visual environment tiles cycle through 3 biome themes (e.g., city, forest, temple) at distance milestones to signal progress without loading screens.
- Biome transitions are visual only — no gameplay rule change per biome.

### 6.2 Content Taxonomy
- **Hazards:** Static blocks, moving barriers, gap sections (lane removed temporarily)
- **Collectibles:** Dash (blue), Shield (gold), Surge (red), Meta Currency coin (always present, no chain value)
- **Modifiers:** 3 active types (see §5.3)
- **Obstacles:** Chunk-based patterns, expanding pool at milestones

### 6.3 Content Scaling Rules
- Speed increases every 250m
- New obstacle chunk patterns introduced at 500m, 1000m, 2000m
- Collectible density scales with speed to keep decision rate constant, not overwhelming

---

## 7. UX, UI, and Accessibility

### 7.1 UX Goals
- **Clarity goals:** Player should understand what they collected and what changed within 1 second, without reading any text
- **Friction to avoid:** No interstitial ads, no loading screens between runs, no mandatory tutorial
- **Onboarding expectations:** First run teaches movement via collectible placement only — first 10 seconds has no hazards, only a collectible in the player's default path

### 7.2 UI Surfaces
- **HUD (in-run):** Distance counter (top center), score (top right), active modifier icon (near character), chain counter (near character). Nothing else.
- **Death screen:** Distance, score, personal best delta, chain that was in progress, one-tap restart
- **Meta hub:** Personal best, daily missions (3 cards), meta currency balance, unlock shop access
- **Settings:** Input sensitivity (mobile swipe), audio volume, colorblind mode

### 7.3 Accessibility Goals
- **Input:** All actions performable with one thumb (mobile). Keyboard-only fully supported (PC).
- **Visual:** Collectible types distinguishable by shape AND color (not color alone). High-contrast mode for HUD.
- **Cognitive:** No time-limited UI decisions outside of the run itself. Modifier icons use universally recognizable shapes.
- **Audio:** All critical feedback has a visual counterpart. Game fully playable on mute.

---

## 8. Narrative and Audio

### 8.1 Narrative Role
No narrative. The world is implied through visual theming only. No dialogue, no story beats.

### 8.2 Audio Direction
- **Music:** Looping, adaptive track that increases intensity with speed escalation. Calm baseline at run start.
- **SFX:** Each collectible type has a distinct audio signature (pitch, texture). Chain completion has a satisfying resolution sound. Death has a brief, non-punishing audio cue — not a failure fanfare.
- **Voice:** None.
- **Accessibility:** All critical gameplay feedback (collision, chain break, modifier expiry) has both audio and visual signals.

---

## 9. Art and Presentation

### 9.1 Visual Pillars
- **Readable first** — silhouette clarity over visual complexity. Hazards read as threats at a glance.
- **Colorful but not noisy** — limited palette per biome. Collectible colors are reserved and consistent across all biomes.
- **Satisfying in motion** — character movement, collection pickup, and death should all feel physically grounded.

### 9.2 Camera / Framing
- Fixed side-scroll camera. Character positioned at 30% from left edge. Camera does not react to player input.

### 9.3 Animation / VFX Role
- Collection pickup: brief particle burst, color-matched to collectible type
- Chain completion: screen-edge color pulse (1 frame flash)
- Death: character freeze-frame, brief screen shake, then cut to death screen

### 9.4 Readability Rules
- Hazards: always occupy full lane width, never blend with background
- Collectibles: always elevated above ground plane, never overlapping hazards visually
- Active modifier: pulsing outline on character model — no separate HUD element needed

---

## 10. Economy and Balance

### 10.1 Resource Model
- **Meta currency (coins):** Earned in-run. No cap. Spent in unlock shop.
- **Score:** Display and leaderboard only. Not spent.
- **Chain counter:** Ephemeral, resets on run end.

### 10.2 Reward Model
- Coins awarded per run: base (distance-scaled) + bonus (chain completions, missions)
- Death screen shows exact coin breakdown so players understand what drove their earnings

### 10.3 Sinks / Costs
- Cosmetic unlocks (skins, trails, chain preview indicator)
- No energy, no consumables, no premium currency in v1 scope

### 10.4 Tuning Hypotheses
- A player completing one Dash chain per run should earn enough coins to unlock a cosmetic within ~20 runs
- Speed escalation should make runs feel challenging at 500m for a new player, not 100m

### 10.5 Abuse / Exploit Risks
- Score manipulation via client-side storage: low risk for v1, relevant only if leaderboard is live
- Currency farming: no action required — no premium economy, no competitive advantage

---

## 11. Telemetry and Success Metrics

### 11.1 Design Questions
- Do players understand that collection changes what comes next?
- Which collectible type is grabbed most / least — and does that reflect preference or availability?
- At what distance do casual players most commonly die?
- Does the death screen reduce churn or do players close the game?
- Does the daily mission system increase return rate?

### 11.2 Key Metrics
- **Retention:** D1, D7, D30 return rate
- **Progression:** Average coins earned per session, unlock rate
- **Difficulty:** Death distance distribution; % of players reaching 500m, 1000m, 2000m
- **Core loop health:** Chain completion rate; modifier activation rate; % of runs with at least one chain
- **Session quality:** Average runs per session; session duration

### 11.3 Instrumentation Notes
- Events needed: `run_started`, `run_ended` (distance, score, death_cause), `collectible_grabbed` (type, chain_count_at_grab), `chain_completed` (type, modifier_triggered), `modifier_expired` (type, was_used), `mission_completed`, `unlock_purchased`
- Funnels: first-run → second-run; mission introduced → mission completed

---

## 12. Production Constraints

### 12.1 Scope Boundaries
- Single gameplay mode (Endless Run) must be complete before any optional mode ships
- Engine selection deferred until vertical slice scope is confirmed
- No multiplayer, cloud save, or monetization in v1

### 12.2 Dependencies
- Input system must be validated on both tap and keyboard before art production begins
- Chunk generation system must be in place before obstacle content is authored
- Modifier system must be playable before collectible art is final (type iconography depends on modifier legibility test)

### 12.3 Risks
| Risk | Severity | Mitigation |
|------|----------|-----------|
| Collect-modifies-world is not legible to casual players | High | Test in first prototype session; simplify or remove if not understood within 60 seconds of play |
| Cross-platform input parity | High | Prototype both input schemes before art lock |
| 2D art scope exceeds team capacity | Medium | Define style and asset reuse strategy before pre-production |
| Escalation curve feels unfair, not challenging | Medium | Playtest with target casual audience, not internal dev team |

### 12.4 Out of Scope
- Story, narrative, character backstory
- PvP or asynchronous multiplayer
- Crafting, inventory management, loot tables
- Procedural world generation beyond chunk shuffling
- Monetization design
- Cloud save
- Platform certification (deferred to pre-production)

---

## 13. Validation Plan

### 13.1 Prototype Questions
1. Does the collect-modifies-world mechanic read without explanation?
2. Does keyboard input feel as responsive as tap input?
3. Does the death screen motivate immediate retry?
4. Is the chain counter readable without reading any text?

### 13.2 Playtest Plan
- First test: internal, 5 participants, paper/grey-box prototype — validate core loop legibility only
- Second test: 10 casual players (target audience), playable build — validate collection readability and retry motivation
- Success threshold: 8/10 players understand that what they collect changes what comes next, without being told

### 13.3 QA Focus Areas
- Chunk safety pass (no impossible layouts)
- Modifier state edge cases (shield consumed on same frame as second hit)
- Input edge cases on both platforms

### 13.4 Release Risks
- Deferred. Engine and platform not yet selected.

---

## 14. Open Questions

| Question | Owner | Next Step |
|----------|-------|-----------|
| ~~Lane-based (3 lanes, discrete dash) or continuous horizontal movement?~~ | Design | **Resolved 2026-03-30 — 3 discrete lanes, snap dash** |
| Session length target: 90-second runs or longer? | Design | Validate with casual player playtests |
| Is the daily challenge mode in v1 scope? | Producer | Scope review at pre-production gate |
| Leaderboard: local only or async online? | Producer | Defer until engine and platform confirmed |
| ~~What is the visual/world theme for the initial biome?~~ | Art | **Resolved 2026-03-31 — Retro top-down racer: Coastal Highway (biome 1), City Night (biome 2), Desert Stretch (biome 3). See ART-BIBLE.md** |
| §9.2 camera: update "fixed side-scroll" to "fixed top-down" per art bible direction | Design / Art | Pending — ART-BIBLE.md §4.1 establishes top-down; GDD §9.2 still reads side-scroll |

---

## 15. Change Log

| Date | Change | Owner | Rationale |
|------|--------|-------|-----------|
| 2026-03-29 | v0.1 created | planner / gdd-designer | Initial ideation output from `/plan` and `/gdd` commands |
| 2026-03-30 | §14 lane model resolved | design | 3 discrete lanes with snap dash confirmed; continuous movement rejected |
