"""Crops the picked frames (black letterbox bars, plus a manual crop where a caption sits)
and builds one contact sheet per category for review.

    python -P scripts/media/build_picks.py <frames_dir> <picks.json> <out_dir>

picks.json: [{"n": 132, "category": "steps", "crop": {"top": 0.15}, "pair": "gravel-before"}, ...]
Crop values are fractions of the image after the letterbox is removed.
Writes <out_dir>/<category>/<n>.jpg, <out_dir>/picks.csv and <out_dir>/sheet_<category>.jpg.
"""
import csv
import json
import sys
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw, ImageFont


def content_box(image: Image.Image) -> tuple[int, int, int, int]:
    """Bounding box of the non-black area, pulled in a little so skewed edges drop out."""
    gray = np.asarray(image.convert("L"), dtype=np.float32)
    rows = np.where(gray.mean(axis=1) > 18)[0]
    cols = np.where(gray.mean(axis=0) > 18)[0]
    if len(rows) == 0 or len(cols) == 0:
        return 0, 0, image.width, image.height
    top, bottom, left, right = rows[0], rows[-1] + 1, cols[0], cols[-1] + 1
    trimmed = (top > 4 or bottom < image.height - 4) or (left > 4 or right < image.width - 4)
    inset = 0.02 if trimmed else 0
    dy, dx = int((bottom - top) * inset), int((right - left) * inset)
    return left + dx, top + dy, right - dx, bottom - dy


def main(frames_dir: Path, picks_file: Path, out_dir: Path) -> None:
    candidates = {int(r["n"]): r for r in csv.DictReader(open(frames_dir / "candidates.csv", encoding="utf-8"))}
    picks = json.loads(picks_file.read_text(encoding="utf-8"))
    out_dir.mkdir(parents=True, exist_ok=True)
    rows, by_category = [], {}

    for pick in picks:
        source = candidates[pick["n"]]
        image = Image.open(source["path"]).convert("RGB")
        image = image.crop(content_box(image))
        crop = pick.get("crop", {})
        w, h = image.size
        image = image.crop((
            int(w * crop.get("left", 0)), int(h * crop.get("top", 0)),
            int(w * (1 - crop.get("right", 0))), int(h * (1 - crop.get("bottom", 0))),
        ))
        target = out_dir / pick["category"] / f"{pick['n']}.jpg"
        target.parent.mkdir(exist_ok=True)
        image.save(target, quality=95)
        row = {
            "n": pick["n"], "category": pick["category"], "pair": pick.get("pair", ""),
            "video_id": source["video_id"], "time_s": source["time_s"],
            "width": image.width, "height": image.height, "file": str(target),
        }
        rows.append(row)
        by_category.setdefault(pick["category"], []).append((row, image))

    with open(out_dir / "picks.csv", "w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=list(rows[0]))
        writer.writeheader()
        writer.writerows(rows)

    font = ImageFont.load_default(size=20)
    for category, items in by_category.items():
        columns, cell = 5, 340
        sheet = Image.new("RGB", (columns * cell, ((len(items) + columns - 1) // columns) * (cell + 34) + 50), "white")
        draw = ImageDraw.Draw(sheet)
        draw.text((8, 10), f"{category} ({len(items)})", fill="black", font=ImageFont.load_default(size=28))
        for i, (row, image) in enumerate(items):
            thumb = image.copy()
            thumb.thumbnail((cell - 10, cell - 10))
            x, y = (i % columns) * cell, 50 + (i // columns) * (cell + 34)
            sheet.paste(thumb, (x + 5, y + 30))
            label = f"#{row['n']} {row['width']}x{row['height']}" + (f" {row['pair']}" if row["pair"] else "")
            draw.text((x + 6, y + 4), label, fill="black", font=font)
        sheet.save(out_dir / f"sheet_{category}.jpg", quality=85)

    print({category: len(items) for category, items in by_category.items()}, "total", len(rows))


if __name__ == "__main__":
    main(Path(sys.argv[1]), Path(sys.argv[2]), Path(sys.argv[3]))
