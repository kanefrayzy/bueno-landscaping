"""Scores and filters extracted frames, drops near duplicates, and builds review sheets.

    python -P scripts/media/filter_frames.py <frames_dir>

Reads <frames_dir>/frames.csv, writes <frames_dir>/candidates.csv (kept frames with scores),
<frames_dir>/rejected.csv (with the reason) and <frames_dir>/review/sheet_XX.jpg, numbered
grids of the kept frames for a visual pass.
"""
import csv
import sys
from pathlib import Path

import cv2
import imagehash
import numpy as np
from PIL import Image, ImageDraw, ImageFont

MIN_SHARPNESS = 70.0
MIN_BRIGHTNESS, MAX_BRIGHTNESS = 45, 225
MAX_FACE_SHARE = 0.03
HASH_DISTANCE = 10

face_detector = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")


def load(path: str) -> np.ndarray:
    data = np.fromfile(path, dtype=np.uint8)
    return cv2.imdecode(data, cv2.IMREAD_COLOR)


def sharpness(gray: np.ndarray) -> float:
    scale = 720 / max(gray.shape)
    small = cv2.resize(gray, None, fx=scale, fy=scale, interpolation=cv2.INTER_AREA)
    return float(cv2.Laplacian(small, cv2.CV_64F).var())


def face_share(gray: np.ndarray) -> float:
    scale = 640 / max(gray.shape)
    small = cv2.resize(gray, None, fx=scale, fy=scale)
    faces = face_detector.detectMultiScale(small, scaleFactor=1.1, minNeighbors=6, minSize=(40, 40))
    if len(faces) == 0:
        return 0.0
    largest = max(w * h for (_, _, w, h) in faces)
    return largest / (small.shape[0] * small.shape[1])


def text_lines(gray: np.ndarray) -> int:
    """Counts rows of letter-like blobs: bright or dark strokes in tight horizontal runs."""
    scale = 720 / max(gray.shape)
    small = cv2.resize(gray, None, fx=scale, fy=scale)
    h, w = small.shape
    kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (9, 3))
    strokes = cv2.max(cv2.morphologyEx(small, cv2.MORPH_TOPHAT, kernel), cv2.morphologyEx(small, cv2.MORPH_BLACKHAT, kernel))
    _, mask = cv2.threshold(strokes, 90, 255, cv2.THRESH_BINARY)
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_RECT, (15, 3)))
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    boxes = [cv2.boundingRect(c) for c in contours]
    words = [b for b in boxes if 0.015 * h < b[3] < 0.07 * h and b[2] > 2.5 * b[3] and b[2] < 0.9 * w]
    rows = {}
    for x, y, bw, bh in words:
        rows.setdefault(round((y + bh / 2) / (0.02 * h)), []).append(bw)
    return sum(1 for widths in rows.values() if sum(widths) > 0.35 * w)


def main(frames_dir: Path) -> None:
    with open(frames_dir / "frames.csv", encoding="utf-8") as handle:
        frames = list(csv.DictReader(handle))

    kept, rejected = [], []
    for row in frames:
        image = load(row["path"])
        if image is None:
            rejected.append({**row, "reason": "unreadable"})
            continue
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        scores = {
            "sharpness": round(sharpness(gray), 1),
            "brightness": round(float(gray.mean()), 1),
            "faces": round(face_share(gray), 3),
            "text": text_lines(gray),
            "width": image.shape[1],
            "height": image.shape[0],
        }
        reason = None
        if scores["sharpness"] < MIN_SHARPNESS:
            reason = "blurry"
        elif not MIN_BRIGHTNESS <= scores["brightness"] <= MAX_BRIGHTNESS:
            reason = "exposure"
        elif scores["faces"] > MAX_FACE_SHARE:
            reason = "face"
        elif scores["text"] >= 2:
            reason = "text overlay"
        if reason:
            rejected.append({**row, **scores, "reason": reason})
        else:
            kept.append({**row, **scores, "hash": imagehash.phash(Image.open(row["path"]), hash_size=8)})

    kept.sort(key=lambda r: -r["sharpness"])
    unique = []
    for row in kept:
        duplicate = next((u for u in unique if row["hash"] - u["hash"] <= HASH_DISTANCE), None)
        if duplicate:
            rejected.append({**{k: v for k, v in row.items() if k != "hash"}, "reason": f"duplicate of {Path(duplicate['path']).name}"})
        else:
            unique.append(row)
    unique.sort(key=lambda r: (r["video_id"], float(r["time_s"]) if r["time_s"].replace(".", "").isdigit() else 0))

    fields = ["n", "video_id", "time_s", "kind", "path", "sharpness", "brightness", "faces", "text", "width", "height"]
    with open(frames_dir / "candidates.csv", "w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=fields)
        writer.writeheader()
        for n, row in enumerate(unique, 1):
            row["n"] = n
            writer.writerow({k: row[k] for k in fields})
    with open(frames_dir / "rejected.csv", "w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=["video_id", "time_s", "kind", "path", "reason"], extrasaction="ignore")
        writer.writeheader()
        writer.writerows(rejected)

    review_dir = frames_dir / "review"
    review_dir.mkdir(exist_ok=True)
    for old in review_dir.glob("sheet_*.jpg"):
        old.unlink()
    font = ImageFont.load_default(size=22)
    columns, cell_w, cell_h, per_sheet = 6, 300, 400, 30
    for sheet_index in range(0, len(unique), per_sheet):
        batch = unique[sheet_index:sheet_index + per_sheet]
        rows_count = (len(batch) + columns - 1) // columns
        sheet = Image.new("RGB", (columns * cell_w, rows_count * cell_h), "white")
        draw = ImageDraw.Draw(sheet)
        for i, row in enumerate(batch):
            thumb = Image.open(row["path"]).convert("RGB")
            thumb.thumbnail((cell_w - 8, cell_h - 34))
            x, y = (i % columns) * cell_w, (i // columns) * cell_h
            sheet.paste(thumb, (x + 4, y + 30))
            draw.text((x + 6, y + 4), f"#{row['n']}", fill="black", font=font)
        sheet.save(review_dir / f"sheet_{sheet_index // per_sheet + 1:02d}.jpg", quality=80)

    reasons = {}
    for r in rejected:
        key = r["reason"].split(" of ")[0]
        reasons[key] = reasons.get(key, 0) + 1
    print(f"{len(frames)} frames -> {len(unique)} candidates; rejected: {reasons}")


if __name__ == "__main__":
    main(Path(sys.argv[1]))
