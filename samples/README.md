# Samples

Complete, playable games generated entirely by the `/full-game` command from this scaffold. No manual coding involved — each game was produced end-to-end from a single natural-language prompt.

These samples demonstrate the scaffold's ability to take a game idea and deliver a fully wired project with gameplay, UI, audio, and assets.

---

## PirateInvaders

**Genre:** 2D Arcade Shooter (Space Invaders variant)
**Platform:** Web (HTML5 — Phaser 3)
**Features:** Pirate-themed waves, power-ups, online leaderboard

```
/full-game a pirate-themed Space Invaders game for HTML
```

**Run:** `cd samples/PirateInvaders && npm install && npm run dev`

---

## Tetris2DMutation

**Genre:** 2D Puzzle / Arcade (Tetris variant)
**Platform:** Web (HTML5 — Vanilla Canvas)
**Features:** Mid-fall piece mutation, 3-slot basket system, procedural audio, touch controls

```
/full-game a 2D Tetris-like game for HTML where sometimes the pieces mutate mid-fall and there
is a basket option where the player can store a piece they don't want to use, and on the next
turn they can use pieces from the basket to replace the one that is falling.
Put it in the Tetris2DMutation folder
```

**Run:** `cd samples/Tetris2DMutation && npx serve .`
