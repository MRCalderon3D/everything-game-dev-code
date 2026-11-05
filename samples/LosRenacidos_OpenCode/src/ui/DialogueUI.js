import { COLORS } from '../utils/Constants.js';

export const DialogueUI = {
  render(ctx, lines, currentIndex, width, height) {
    const boxX = 40;
    const boxW = width - 80;
    const boxH = 100;
    const boxY = height - boxH - 30;

    ctx.fillStyle = COLORS.DIALOG_BG;
    ctx.fillRect(boxX, boxY, boxW, boxH);
    ctx.strokeStyle = '#446688';
    ctx.lineWidth = 1;
    ctx.strokeRect(boxX, boxY, boxW, boxH);

    if (lines && lines[currentIndex]) {
      const line = lines[currentIndex];

      ctx.fillStyle = COLORS.TEXT_GOLD;
      ctx.font = '12px monospace';
      ctx.textAlign = 'left';
      ctx.fillText(line.speaker, boxX + 15, boxY + 20);

      ctx.fillStyle = COLORS.TEXT_WHITE;
      ctx.font = '13px monospace';
      ctx.fillText(line.text, boxX + 15, boxY + 50);
    }

    if (currentIndex < lines.length - 1 || (lines[currentIndex] && !lines[currentIndex].action)) {
      const alpha = Math.sin(Date.now() / 400) * 0.5 + 0.5;
      ctx.globalAlpha = alpha;
      ctx.fillStyle = COLORS.TEXT_DIM;
      ctx.font = '10px monospace';
      ctx.textAlign = 'right';
      ctx.fillText('[Click/Space/E para continuar]', width - 60, height - 42);
      ctx.globalAlpha = 1;
    }
  },
};
