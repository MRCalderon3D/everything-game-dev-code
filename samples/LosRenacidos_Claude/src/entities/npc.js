export class Npc {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.color = data.color;
    this.x = data.x;
    this.y = data.y;
    this.radius = 12;
    this.data = data;
  }

  isNearPlayer(player, threshold = 40) {
    return Math.hypot(player.x - this.x, player.y - this.y) <= threshold;
  }
}
