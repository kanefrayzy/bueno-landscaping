"""Extracts candidate frames from every video: scene changes plus evenly spaced frames.

    python -P scripts/media/extract_frames.py <videos_dir> <frames_dir>

Writes <frames_dir>/<video_id>/<video_id>_<ms>.jpg and <frames_dir>/frames.csv
(video_id, time_s, kind, path). Videos already extracted are skipped.
"""
import csv
import json
import re
import subprocess
import sys
from pathlib import Path

SCENE_THRESHOLD = 0.3
MAX_SCENE_FRAMES = 14
EVEN_FRAMES_MIN, EVEN_FRAMES_MAX = 3, 8


def duration(video: Path) -> float:
    out = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "json", str(video)],
        capture_output=True, text=True, check=True,
    ).stdout
    return float(json.loads(out)["format"]["duration"])


def scene_times(video: Path) -> list[float]:
    result = subprocess.run(
        ["ffmpeg", "-hide_banner", "-i", str(video), "-vf", f"select='gt(scene,{SCENE_THRESHOLD})',showinfo",
         "-vsync", "vfr", "-f", "null", "-"],
        capture_output=True, text=True,
    )
    return [float(t) for t in re.findall(r"pts_time:([0-9.]+)", result.stderr)]


def grab(video: Path, t: float, target: Path) -> bool:
    subprocess.run(
        ["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss", f"{t:.3f}", "-i", str(video),
         "-frames:v", "1", "-q:v", "2", str(target)],
        check=False,
    )
    return target.exists()


def spread(values: list[float], count: int) -> list[float]:
    if len(values) <= count:
        return values
    step = len(values) / count
    return [values[int(i * step)] for i in range(count)]


def main(videos_dir: Path, frames_dir: Path) -> None:
    frames_dir.mkdir(parents=True, exist_ok=True)
    rows = []
    videos = sorted(p for p in videos_dir.iterdir() if p.suffix.lower() in {".mp4", ".mov", ".webm", ".mkv"})

    for index, video in enumerate(videos, 1):
        video_id = video.stem
        out_dir = frames_dir / video_id
        if out_dir.exists() and any(out_dir.iterdir()):
            rows += [[video_id, f.stem.split("_")[-1], "existing", str(f)] for f in sorted(out_dir.glob("*.jpg"))]
            continue
        out_dir.mkdir(exist_ok=True)

        length = duration(video)
        even_count = max(EVEN_FRAMES_MIN, min(EVEN_FRAMES_MAX, round(length / 4)))
        even = [length * (i + 0.5) / even_count for i in range(even_count)]
        # Shift scene frames a little past the cut so the new shot has settled.
        scenes = [min(t + 0.25, length - 0.1) for t in spread(scene_times(video), MAX_SCENE_FRAMES)]

        for kind, times in (("scene", scenes), ("even", even)):
            for t in times:
                target = out_dir / f"{video_id}_{int(t * 1000):06d}.jpg"
                if not target.exists() and grab(video, t, target):
                    rows.append([video_id, f"{t:.2f}", kind, str(target)])

        print(f"[{index}/{len(videos)}] {video_id}: {length:.0f}s, {len(scenes)} scene + {even_count} even")

    with open(frames_dir / "frames.csv", "w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(["video_id", "time_s", "kind", "path"])
        writer.writerows(rows)
    print(f"{len(rows)} frames listed in {frames_dir / 'frames.csv'}")


if __name__ == "__main__":
    main(Path(sys.argv[1]), Path(sys.argv[2]))
