"""Download selected Canvas course files for the published teaching book."""

from __future__ import annotations

import argparse
import os
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from export_canvas_course import CanvasClient, CanvasError, read_env_file


DEFAULT_NAMES = ("quotes.txt", "dna.txt", "grades.txt", "perfect_sunday.txt", "system.log")


def download_file(url: str, token: str, destination: Path) -> int:
    """Download one Canvas file and return its byte count."""
    request = Request(
        url,
        headers={
            "Authorization": f"Bearer {token}",
            "Accept": "application/octet-stream",
            "User-Agent": "python-for-life-sciences-canvas-files/1.0",
        },
    )
    try:
        with urlopen(request, timeout=60) as response:
            content = response.read()
    except (HTTPError, URLError, TimeoutError) as exc:
        raise CanvasError(f"Could not download Canvas file: {exc}") from None
    destination.parent.mkdir(parents=True, exist_ok=True)
    destination.write_bytes(content)
    return len(content)


def choose_files(files: list[dict[str, object]], names: tuple[str, ...]) -> dict[str, dict[str, object]]:
    """Match requested names, preferring an exact Canvas display name."""
    chosen: dict[str, dict[str, object]] = {}
    for name in names:
        display_matches = [item for item in files if str(item.get("display_name", "")) == name]
        filename_matches = [item for item in files if str(item.get("filename", "")) == name]
        matches = display_matches or filename_matches
        if not matches:
            raise CanvasError(f"Canvas course file not found: {name}")
        if len(matches) > 1:
            ids = ", ".join(str(item.get("id")) for item in matches)
            raise CanvasError(f"More than one Canvas file matched {name}: {ids}")
        chosen[name] = matches[0]
    return chosen


def main() -> int:
    parser = argparse.ArgumentParser(description="Download selected Canvas course files into the book data folder.")
    parser.add_argument("course", nargs="?", help="Canvas course ID (default: COURSE_ID from .env)")
    parser.add_argument("--output", type=Path, default=Path("book/data/week-4"), help="Destination folder")
    parser.add_argument("names", nargs="*", help="Exact Canvas display names; defaults to the five Week 4 files")
    args = parser.parse_args()

    env = read_env_file(Path(__file__).with_name(".env"))
    canvas_url = os.environ.get("CANVAS_URL") or os.environ.get("CANVAS_API_URL") or env.get("CANVAS_URL") or env.get("CANVAS_API_URL")
    token = os.environ.get("CANVAS_API_TOKEN") or env.get("CANVAS_API_TOKEN")
    course_id = args.course or os.environ.get("COURSE_ID") or env.get("COURSE_ID")
    if not canvas_url or not token or not course_id:
        print("Set CANVAS_API_URL (or CANVAS_URL), CANVAS_API_TOKEN, and COURSE_ID in .env.", file=sys.stderr)
        return 2

    try:
        client = CanvasClient(canvas_url, token)
        files = client.get_all(f"courses/{course_id}/files", {"per_page": 100})
        names = tuple(args.names) or DEFAULT_NAMES
        selected = choose_files(files, names)
        for name, item in selected.items():
            url = str(item.get("url") or "")
            if not url:
                raise CanvasError(f"Canvas file has no download URL: {name}")
            destination = args.output / Path(name).name
            size = download_file(url, token, destination)
            print(f"Downloaded {name} ({size} bytes) -> {destination}")
    except (CanvasError, OSError, KeyboardInterrupt) as exc:
        if isinstance(exc, KeyboardInterrupt):
            print("Download cancelled.", file=sys.stderr)
        else:
            print(f"Error: {exc}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
