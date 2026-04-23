import { GAME_HEIGHT, GAME_WIDTH } from '../config.js';

export const IMAGE_ASSETS = [
  { key: 'player', path: 'assets/images/player.png' },
  { key: 'sloop', path: 'assets/images/sloop.png' },
  { key: 'brigantine', path: 'assets/images/brigantine.png' },
  { key: 'galleon', path: 'assets/images/galleon.png' },
  { key: 'playerBullet', path: 'assets/images/player-bullet.png' },
  { key: 'enemyBullet', path: 'assets/images/enemy-bullet.png' },
  { key: 'powerup', path: 'assets/images/powerup.png' },
  { key: 'lifeIcon', path: 'assets/images/life-icon.png' },
  { key: 'button', path: 'assets/images/button.png' },
  { key: 'buttonHover', path: 'assets/images/button-hover.png' },
  { key: 'menuBackground', path: 'assets/images/menu-background.png' },
  { key: 'battleBackground', path: 'assets/images/battle-background.png' },
  { key: 'uiBarFrame', path: 'assets/images/ui-bar-frame.png' },
  { key: 'uiBarFill', path: 'assets/images/ui-bar-fill.png' },
];

const DISPLAY_SIZES = {
  player: { width: 52, height: 52 },
  sloop: { width: 48, height: 48 },
  brigantine: { width: 50, height: 50 },
  galleon: { width: 54, height: 54 },
  playerBullet: { width: 12, height: 12 },
  enemyBullet: { width: 14, height: 14 },
  powerup: { width: 28, height: 28 },
  lifeIcon: { width: 22, height: 18 },
  button: { width: 220, height: 60 },
  buttonHover: { width: 220, height: 60 },
};

export function applyDisplaySize(gameObject, key) {
  const size = DISPLAY_SIZES[key];
  if (size) {
    const sourceWidth = gameObject.width || gameObject.frame.realWidth;
    const sourceHeight = gameObject.height || gameObject.frame.realHeight;
    const scale = Math.min(size.width / sourceWidth, size.height / sourceHeight);
    gameObject.setDisplaySize(
      Math.max(1, Math.round(sourceWidth * scale)),
      Math.max(1, Math.round(sourceHeight * scale))
    );
  }
  return gameObject;
}

export function applyArcadeBodySize(gameObject, width, height) {
  if (!gameObject.body) {
    return gameObject;
  }

  const sourceWidth = width / gameObject.scaleX;
  const sourceHeight = height / gameObject.scaleY;
  gameObject.body.setSize(sourceWidth, sourceHeight, true);
  return gameObject;
}

export function addSceneBackground(scene, textureKey, alpha = 1) {
  return scene.add
    .image(GAME_WIDTH / 2, GAME_HEIGHT / 2, textureKey)
    .setDisplaySize(GAME_WIDTH, GAME_HEIGHT)
    .setScrollFactor(0)
    .setAlpha(alpha)
    .setDepth(-1000);
}

export function createImageBar(scene, x, y, frameWidth, fillWidth, initialValue = 1) {
  const frame = scene.add.image(x, y, 'uiBarFrame').setDisplaySize(frameWidth, 22);
  const fill = scene.add.image(x - fillWidth / 2, y, 'uiBarFill').setOrigin(0, 0.5);

  const api = {
    frame,
    fill,
    setValue(value) {
      const clamped = Math.max(0, Math.min(1, value));
      fill.setDisplaySize(Math.max(fillWidth * clamped, 1), 10);
      fill.setVisible(clamped > 0);
    },
    setVisible(visible) {
      frame.setVisible(visible);
      fill.setVisible(visible && fill.displayWidth > 0);
    },
  };

  api.setValue(initialValue);
  return api;
}
