from __future__ import annotations

from collections import deque
from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parent.parent
ASSET_DIR = ROOT / "public" / "assets" / "images"
TARGETS = [
    "player.png",
    "sloop.png",
    "brigantine.png",
    "galleon.png",
    "player-bullet.png",
    "enemy-bullet.png",
    "powerup.png",
    "life-icon.png",
    "button.png",
    "button-hover.png",
    "ui-bar-frame.png",
    "ui-bar-fill.png",
]
PADDING = 4
EDGE_TOLERANCE = 26


def similar(a: tuple[int, int, int, int], b: tuple[int, int, int, int], tolerance: int) -> bool:
    return all(abs(a[i] - b[i]) <= tolerance for i in range(3))


def remove_edge_background(image: Image.Image) -> Image.Image:
    img = image.convert("RGBA")
    width, height = img.size
    pixels = img.load()

    seed_points = [
        (0, 0),
        (width - 1, 0),
        (0, height - 1),
        (width - 1, height - 1),
        (width // 2, 0),
        (width // 2, height - 1),
        (0, height // 2),
        (width - 1, height // 2),
    ]
    seed_colors = [pixels[x, y] for x, y in seed_points]

    visited: set[tuple[int, int]] = set()
    queue: deque[tuple[int, int]] = deque()

    for x in range(width):
        queue.append((x, 0))
        queue.append((x, height - 1))
    for y in range(height):
        queue.append((0, y))
        queue.append((width - 1, y))

    while queue:
        x, y = queue.popleft()
        if (x, y) in visited:
            continue
        visited.add((x, y))

        pixel = pixels[x, y]
        if pixel[3] == 0:
            continue

        if not any(similar(pixel, seed, EDGE_TOLERANCE) for seed in seed_colors):
            continue

        pixels[x, y] = (pixel[0], pixel[1], pixel[2], 0)
        if x > 0:
            queue.append((x - 1, y))
        if x < width - 1:
            queue.append((x + 1, y))
        if y > 0:
            queue.append((x, y - 1))
        if y < height - 1:
            queue.append((x, y + 1))

    bbox = img.getbbox()
    if not bbox:
        return img

    left, top, right, bottom = bbox
    crop = (
        max(0, left - PADDING),
        max(0, top - PADDING),
        min(width, right + PADDING),
        min(height, bottom + PADDING),
    )
    return img.crop(crop)


def main() -> None:
    for name in TARGETS:
        path = ASSET_DIR / name
        cleaned = remove_edge_background(Image.open(path))
        cleaned.save(path)
        print(f"cleaned {name}: {cleaned.size}")


if __name__ == "__main__":
    main()
