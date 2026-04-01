# Audio Bible — Dash & Collect

## Document Control
- **Project:** Dash & Collect
- **Owner:** TBD
- **Version:** 0.1
- **Status:** Draft
- **Last Updated:** 2026-03-30
- **Related Docs:** `design/GDD.md` §8, `design/TDD.md`

---

## 1. Audio Vision

- **Emotional goal:** Keep the player in a state of flow — energised during a clean run, briefly devastated at death, immediately ready to retry. Audio must feel rewarding without becoming fatiguing across repeated short sessions (target: 90-second runs, 10–15 minute meta sessions).
- **Functional goal:** Every gameplay-critical event (lane dash, collectible pickup, chain completion, death) has an unambiguous audio signature. Players can read the run state by ear alone.
- **What audio must help the player understand:** Which collectible type was just grabbed; whether a chain is building or broken; that death was their fault, not the game's. Nothing critical is audio-only — every cue has a visual counterpart (GDD §7.3).

---

## 2. Pillars

- **Readable** — Distinct timbral families per event category. No two critical events share a perceptual space (pitch range, texture, transient shape).
- **Energetic but not noisy** — Lo-fi chiptune aesthetic gives warmth and retro energy without frequency clutter. Music sits under gameplay, not over it.
- **Instant reset** — Death audio is brief and non-punishing. It must not linger into the retry screen. Players should feel the sting for under two seconds.

---

## 3. Music Direction

- **Role of music:** Continuous motivational backdrop. The track signals pace and session energy; it does not narrate or interrupt.
- **Dynamic behaviour:** Single adaptive loop. Intensity layer (percussion, arp density) crossfades upward as `WorldSpeed` increases. Calm baseline at run start; full intensity at max speed. Transition between layers must be seamless (bar-length crossfade, not immediate cut).
- **Tension / calm / reward states:**
  - *Calm (start of run):* Sparse melody, minimal percussion. Player is reading the environment.
  - *Building (mid run):* Added bass line and hi-hat layer. Collectible chains feel more urgent.
  - *Peak (high speed):* Full chiptune texture. Survival feels like an achievement.
  - *Death / menu:* Music ducks immediately on death, resumes from calm baseline on restart.
- **Silence usage:** No intentional silence during gameplay. Brief natural gap (< 0.5 s) acceptable at loop point only.

### BGM: `bgm_loop`
| Property | Value |
|---|---|
| Style | Lo-fi chiptune |
| Tempo | 128–140 BPM (adaptive) |
| Key | Minor pentatonic (to allow easy layer blending) |
| Loop point | Bar-accurate, seamless |
| Format (target) | OGG, 44.1 kHz, stereo |
| Streaming | Yes — stream from disk; do not load into memory |

---

## 4. SFX Direction

- **Interaction language:** Short, punchy transients. Every player-initiated action (lane dash) has immediate audio confirmation — latency between input and sound must feel synchronous (< 1 frame).
- **Collectible language:** Bright, pitched, type-distinct. Coin is highest pitch and most neutral. Dash/Shield/Surge have progressively more character. Chain completion adds a resolution chord or stinger on top of the pickup sound.
- **UI language:** Minimal. Death screen and restart use the same SFX vocabulary as gameplay, not a separate UI tone set.
- **Reward language:** Chain completion stinger is the primary reward cue. It must feel satisfying but not longer than 0.4 s.
- **Failure / damage language:** Death is percussive and final. No lingering reverb tail into the death screen.

### Sound Event Catalogue

| Event ID | Description | Trigger | Design Spec | Duration |
|---|---|---|---|---|
| `sfx_dash` | Player lane-change (left or right) | `PlayerController.OnLaneChanged` | Quick whoosh — short noise burst with slight pitch sweep upward; dry, no reverb tail. Panned subtly toward the direction of travel. | 80–120 ms |
| `sfx_coin_collect` | Coin (meta currency) picked up | `CollisionHandler.OnCollectiblePickedUp` (type = Coin) | Bright, high-pitched ding. Single triangle/sine tone, fast attack, short decay (~150 ms). Friendly and neutral — not as characterful as chain collectibles. | 150–200 ms |
| `sfx_death` | Player collides with hazard and run ends | `GameManager.OnGameOver` | Impact crunch — low-mid percussive hit (snare + noise layer), fast decay, no reverb. Brief and final; must resolve within 0.5 s so it doesn't bleed into the death screen. | 300–500 ms |
| `bgm_loop` | Background music — continuous during run | `GameManager.OnGameStart` / `OnGameRestart` | Lo-fi chiptune loop. See §3. | Loop |

> **Note on `sfx_dash` / "jump" naming:** The GDD defines no vertical jump mechanic (§5.1, §14 — resolved 2026-03-30: 3-lane snap dash). The "jump" sound event in the original spec maps to the lane-dash action. Event ID is `sfx_dash` in this document. If a jump mechanic is added post-M2, create a new `sfx_jump` event and retain `sfx_dash` for lateral movement.

### Stretch events (not in M2 scope)
| Event ID | Trigger | Notes |
|---|---|---|
| `sfx_chain_complete` | 3× same collectible in sequence | Resolution stinger, type-coloured (blue / gold / red). |
| `sfx_collectible_dash` | Dash-type collectible pickup | Swoosh with blue pitch character. |
| `sfx_collectible_shield` | Shield-type collectible pickup | Soft bell/shield resonance, gold character. |
| `sfx_collectible_surge` | Surge-type collectible pickup | Electric crackle, red energy feel. |
| `sfx_modifier_expiry` | Modifier expires (2 s warning) | Subtle descending tone — warns without startling. |
| `sfx_shield_absorb` | Shield absorbs a hit | Short metallic clank. |

---

## 5. Voice Direction

- **VO role:** None. Game has no narrative (GDD §8.1). No character voice, no announcer, no tutorial VO.
- **Performance style:** N/A
- **Subtitle implications:** No subtitles required for audio content. UI text remains accessible via visual design (GDD §7.3).
- **Localization implications:** None — no spoken audio to localize.

---

## 6. Mix Priorities

- **Must-hear categories (in priority order):**
  1. `sfx_death` — player must always hear this clearly
  2. `sfx_coin_collect` — collectible feedback is core to the loop
  3. `sfx_dash` — movement confirmation
  4. `bgm_loop` — backdrop; always present but never dominant
- **Ducking rules:**
  - `bgm_loop` ducks –6 dB on `sfx_death`, recovers over 1 s on restart
  - No ducking on `sfx_dash` or `sfx_coin_collect` — they must sit above music naturally via level design
- **Accessibility needs:**
  - Game must be fully playable with audio off (GDD §7.3). No gameplay-critical information is audio-only.
  - All SFX must have a visual counterpart: dash → lane snap animation; coin → pickup particle; death → screen flash + freeze frame.
  - Future: consider haptic feedback on mobile as a third channel alongside audio + visual.
- **Platform / device caveats:**
  - Mobile: default volume may be low; SFX must read at low speaker volumes. Avoid sub-bass content that phones cannot reproduce.
  - PC: headphone and speaker both valid. Panning on `sfx_dash` adds directionality on headphones; must not feel broken on mono speakers.

---

## 7. System Behaviours

- **Spatialization rules:** 2D game — no 3D positional audio. `sfx_dash` uses subtle stereo panning only. All other events are centre-channel (mono-safe).
- **Music transitions:**
  - Start of run: `bgm_loop` fades in over 0.5 s from silence.
  - Death: immediate –6 dB duck, no fade-out — the abrupt cut reinforces the death feel.
  - Restart: resume from calm intensity layer at loop start (do not continue from where the track was).
- **Layering rules:** Maximum 3 simultaneous SFX voices during normal gameplay (dash + collect + possible chain stinger). Death is isolated — all other SFX stop on `OnGameOver`.
- **Interrupt rules:** `sfx_death` interrupts any in-flight `sfx_dash` or `sfx_coin_collect` immediately. No overlap.
- **Loop handling:** `bgm_loop` is a seamless loop. No gap at loop point. Unity AudioSource `loop = true`.

---

## 8. Technical Constraints

- **Memory guidance:** All SFX loaded into memory (short files, < 0.5 s each). `bgm_loop` streamed from disk. Total SFX memory budget: < 512 KB uncompressed for M2 scope.
- **Streaming guidance:** Only `bgm_loop` streamed. All gameplay SFX must be pre-loaded to avoid latency on first trigger.
- **Compression guidance:**
  - SFX: PCM or ADPCM (no lossy compression for short transients — artefacts on fast transients are audible).
  - BGM: OGG Vorbis quality 5–7. Acceptable for looping music; avoids lossy artefacts on music content.
- **Platform-specific concerns:**
  - iOS/Android: AudioSource requires the application to handle audio session interruption (phone calls). Pause/resume audio on `OnApplicationPause`.
  - WebGL (future): AudioContext requires a user gesture before audio can start. First click/tap unlocks audio — handle gracefully.
- **Stub assets (M2):** Placeholder silent WAV files are acceptable in `Assets/Audio/SFX/` and `Assets/Audio/Music/` for M2 compile and scene bootstrap. Replace before vertical slice playtest.

---

## 9. Review Criteria

| Criterion | Pass condition |
|---|---|
| **Clarity** | Each event is identifiable in isolation and in context of other simultaneous sounds |
| **Consistency** | All SFX share the same lo-fi / chiptune aesthetic; no asset feels out of place |
| **Emotional fit** | Death feels impactful but not punishing; collection feels rewarding; music stays energising without fatiguing |
| **Fatigue risk** | No SFX triggers more than ~3×/second at peak; music does not have a piercing high-frequency element that fatigues on loop |
| **Accessibility fit** | All critical feedback has a visual counterpart; game is testably playable at 0% volume |

---

## 10. Open Questions / Change Log

| # | Question | Owner | Status |
|---|---|---|---|
| 1 | Is a jump mechanic being added post-M2? If yes, `sfx_jump` and `sfx_dash` must be differentiated. | Design | Open |
| 2 | Should chain collectibles (`sfx_collectible_dash/shield/surge`) be in M2 scope or deferred to M3? | Audio / Producer | Open |
| 3 | Confirm `bgm_loop` BPM — does 128 BPM feel right for the target 90-second run pace? | Audio / Design | Open (playtest gate) |
| 4 | Mobile haptics: add as a third feedback channel alongside audio + visual? | Design / Accessibility | Deferred — post-M2 |

| Date | Change | Author | Rationale |
|---|---|---|---|
| 2026-03-30 | v0.1 created | planner / audio-designer | Initial audio direction from `/plan` command; seeded from GDD §8 |
