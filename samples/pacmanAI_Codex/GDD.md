# Neon Maze Chase Game Design Document

## Concept
Neon Maze Chase is a browser arcade maze game inspired by PAC-MAN. The player guides a hungry yellow runner through a neon maze, collects pellets, uses power pellets to turn the tables on enemies, and clears levels while four ghosts pressure the route.

## Genre, Audience, And Platform
- Genre: 2D arcade maze chase.
- Audience: Players who understand classic arcade rules and want an immediate browser-playable game.
- Platform: Web, playable from a static HTML page or a lightweight local server.

## Core Loop
Every 30 seconds the player scans the maze, chooses a route, collects pellets, dodges ghosts, grabs power pellets when trapped, eats frightened ghosts for bonus points, and keeps moving toward a full maze clear. Clearing every pellet advances to a faster level.

## Player Mechanics
- Four-direction grid movement with buffered turns.
- Pellet pickup at tile centers.
- Power pellets trigger a temporary frightened state.
- Collision with a normal ghost costs one life.
- Collision with a frightened ghost awards escalating combo points and sends that ghost back to its home.

## Game Systems
- Score: 10 points per pellet, 50 per power pellet, 200/400/800/1600 for chained ghost captures.
- Lives: Three lives per run.
- Levels: Each cleared board reloads the maze and increases movement pressure.
- High score: Stored locally in browser storage.
- Ghost behavior: Four ghosts use distinct target preferences: direct chase, ambush, vector flank, and distance-sensitive chase/scatter.

## Level Structure
The game uses a compact symmetric maze with regular pellets, four power pellets, a central ghost house, and branching paths that create risk/reward route choices.

## UI Flow
- Main menu: title, controls, high score, start prompt.
- Gameplay HUD: score, high score, lives, level, active ghost mode or power timer.
- Pause overlay: resume and menu prompts.
- Game over overlay: final score, high score, restart prompt.
- Settings: Volume and mute are handled through a settings overlay and keyboard shortcuts, then persisted in local storage.

## Audio Direction
All audio is procedural through the Web Audio API:
- Pellet chirps alternate pitch for arcade rhythm.
- Power pellet uses a rising tone.
- Ghost capture uses an ascending arpeggio.
- Death uses a descending sawtooth sweep.
- Level clear uses a short victory motif.

## Art Direction
The visual style is neon arcade: deep black background, blue maze walls, yellow player, brightly colored ghosts, pulsing power pellets, and high-contrast HUD typography. All visuals are drawn with Canvas primitives.

## Scope Boundaries
In scope:
- Complete browser-playable maze chase game.
- Keyboard, touch button, and swipe input.
- Procedural visuals and audio.
- Persistent high score and audio settings.

Out of scope:
- Licensed PAC-MAN art, names, sounds, or exact maze reproduction.
- Network leaderboard.
- Complex cutscenes or fruit bonus tables.
- External asset pipeline.
