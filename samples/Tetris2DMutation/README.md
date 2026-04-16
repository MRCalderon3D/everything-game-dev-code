# Tetris 2D Mutation

A Tetris-like 2D puzzle game for HTML5 with two unique mechanics: pieces can **mutate** into different shapes mid-fall, and players manage a **basket** to store and swap unwanted pieces.

## How This Game Was Made

This entire game was created in a single pass using the `/full-game` command from the [everything-game-dev-code](https://github.com/mrcalderon3d/everything-game-dev-code) scaffold, with the following prompt:

```
/full-game a 2D Tetris-like game for HTML where sometimes the pieces mutate mid-fall and there is a basket option where the player can store a piece they don't want to use, and on the next turn they can use pieces from the basket to replace the one that is falling. Put it in the Tetris2DMutation folder
```

No manual coding was involved. Every file — game logic, UI, audio, rendering — was generated end-to-end by the command pipeline.

## How to Run

```bash
cd Tetris2DMutation
npx serve .
```

Open the URL shown in your terminal (usually `http://localhost:3000`).

## Controls

| Key | Action |
|-----|--------|
| Arrow Keys / WASD | Move & Rotate |
| Z | Rotate counter-clockwise |
| Space | Hard drop |
| C | Send piece to basket |
| X + 1/2/3 | Swap piece from basket |
| Esc / P | Pause |
