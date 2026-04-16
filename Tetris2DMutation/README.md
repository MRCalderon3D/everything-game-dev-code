# Tetris 2D Mutation

A Tetris-like 2D puzzle game for HTML5 with two unique mechanics: pieces can **mutate** into different shapes mid-fall, and players manage a **basket** to store and swap unwanted pieces.

## How This Game Was Made

This entire game was created in a single pass using the `/full-game` command from the [everything-game-dev-code](https://github.com/mrcalderon3d/everything-game-dev-code) scaffold, with the following prompt:

```
/full-game un juego tipo tetris en 2D para HTML donde aveces las piezas mutan en mitad de caida y tiene una opcion de cesta donde el usuario puede guardar la pieza que no quiere utilizar y para la siguiente jugada puede usar piezas de la cesta para remplazar la que esta cayendo.  metelo en la carpeta Tetris2DMutation
```

No manual coding was involved. Every file — game logic, UI, audio, rendering — was generated end-to-end by the command pipeline.

## How to Run

```bash
cd Tetris2DMutation
npx serve .
```

Open `http://localhost:3000` in your browser.

## Controls

| Key | Action |
|-----|--------|
| Arrow Keys / WASD | Move & Rotate |
| Z | Rotate counter-clockwise |
| Space | Hard drop |
| C | Send piece to basket |
| X + 1/2/3 | Swap piece from basket |
| Esc / P | Pause |
