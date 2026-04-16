import { COLORS } from '../config.js';

export function generateTextures(scene) {
  // Player ship — brown hull with white sail triangle
  const pg = scene.make.graphics({ x: 0, y: 0, add: false });
  pg.fillStyle(COLORS.player);
  pg.fillRect(5, 15, 30, 15);
  pg.fillTriangle(20, 0, 10, 15, 30, 15);
  pg.fillStyle(COLORS.playerSail);
  pg.fillTriangle(20, 2, 12, 14, 28, 14);
  pg.generateTexture('player', 40, 30);
  pg.destroy();

  // Sloop — small green ship
  const sg = scene.make.graphics({ x: 0, y: 0, add: false });
  sg.fillStyle(COLORS.sloop);
  sg.fillRect(6, 8, 28, 14);
  sg.fillTriangle(20, 0, 6, 8, 34, 8);
  sg.fillStyle(0x1a7a42);
  sg.fillRect(10, 22, 20, 4);
  sg.generateTexture('sloop', 40, 30);
  sg.destroy();

  // Brigantine — medium blue ship
  const bg = scene.make.graphics({ x: 0, y: 0, add: false });
  bg.fillStyle(COLORS.brigantine);
  bg.fillRect(4, 8, 32, 16);
  bg.fillTriangle(20, 0, 4, 8, 36, 8);
  bg.fillStyle(0x2176ad);
  bg.fillRect(8, 24, 24, 4);
  bg.generateTexture('brigantine', 40, 30);
  bg.destroy();

  // Galleon — large red ship with extra detail
  const gg = scene.make.graphics({ x: 0, y: 0, add: false });
  gg.fillStyle(COLORS.galleon);
  gg.fillRect(2, 6, 36, 18);
  gg.fillTriangle(20, 0, 2, 6, 38, 6);
  gg.fillStyle(0xc0392b);
  gg.fillRect(6, 24, 28, 4);
  gg.fillStyle(0xffffff);
  gg.fillCircle(12, 14, 2);
  gg.fillCircle(20, 14, 2);
  gg.fillCircle(28, 14, 2);
  gg.generateTexture('galleon', 40, 30);
  gg.destroy();

  // Player bullet — dark grey cannonball
  const pb = scene.make.graphics({ x: 0, y: 0, add: false });
  pb.fillStyle(COLORS.playerBullet);
  pb.fillCircle(3, 5, 3);
  pb.generateTexture('playerBullet', 6, 10);
  pb.destroy();

  // Enemy bullet — yellow fireball
  const eb = scene.make.graphics({ x: 0, y: 0, add: false });
  eb.fillStyle(COLORS.enemyBullet);
  eb.fillCircle(3, 3, 3);
  eb.fillStyle(0xe67e22);
  eb.fillCircle(3, 3, 1.5);
  eb.generateTexture('enemyBullet', 6, 6);
  eb.destroy();

  // Power-up — gold diamond
  const pu = scene.make.graphics({ x: 0, y: 0, add: false });
  pu.fillStyle(COLORS.powerup);
  pu.fillTriangle(12, 0, 0, 12, 24, 12);
  pu.fillTriangle(0, 12, 24, 12, 12, 24);
  pu.fillStyle(0xffffff);
  pu.fillCircle(12, 12, 3);
  pu.generateTexture('powerup', 24, 24);
  pu.destroy();

  // Life icon — tiny ship
  const li = scene.make.graphics({ x: 0, y: 0, add: false });
  li.fillStyle(COLORS.player);
  li.fillRect(3, 7, 14, 7);
  li.fillTriangle(10, 0, 3, 7, 17, 7);
  li.generateTexture('lifeIcon', 20, 16);
  li.destroy();

  // Button background
  const btn = scene.make.graphics({ x: 0, y: 0, add: false });
  btn.fillStyle(COLORS.panelBg);
  btn.fillRoundedRect(0, 0, 200, 50, 8);
  btn.lineStyle(2, COLORS.uiGold);
  btn.strokeRoundedRect(0, 0, 200, 50, 8);
  btn.generateTexture('button', 200, 50);
  btn.destroy();

  // Button hover
  const btnh = scene.make.graphics({ x: 0, y: 0, add: false });
  btnh.fillStyle(0x1e3a5f);
  btnh.fillRoundedRect(0, 0, 200, 50, 8);
  btnh.lineStyle(2, COLORS.uiGold);
  btnh.strokeRoundedRect(0, 0, 200, 50, 8);
  btnh.generateTexture('buttonHover', 200, 50);
  btnh.destroy();
}
