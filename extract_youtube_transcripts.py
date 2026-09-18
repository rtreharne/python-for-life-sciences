"""Extract available English YouTube captions from Canvas-exported pages."""

from __future__ import annotations

import argparse
import html
import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qs, urlsplit


YOUTUBE_HOSTS = {"youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be", "www.youtube-nocookie.com", "youtube-nocookie.com"}
VIDEO_ID_RE = re.compile(r"^[A-Za-z0-9_-]{11}$")
VTT_TIME_RE = re.compile(r"^(?:\d{2}:)?\d{2}:\d{2}[.,]\d{3}\s+-->\s+")


class MediaLinkParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.links: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag.lower() not in {"iframe", "a", "source", "video"}:
            return
        for name, value in attrs:
            if name.lower() in {"src", "href"} and value:
                self.links.append(value.strip())


def canonical_youtube_urls(url: str) -> list[str]:
    url = html.unescape(url.strip())
    if url.startswith("//"):
        url = "https:" + url
    parts = urlsplit(url)
    host = (parts.hostname or "").lower()
    if host not in YOUTUBE_HOSTS:
        return []
    query = parse_qs(parts.query)
    video_id: str | None = None
    if host.endswith("youtu.be"):
        video_id = parts.path.strip("/").split("/")[0]
    elif parts.path.rstrip("/") in {"/watch", "/watch/"}:
        video_id = (query.get("v") or [None])[0]
    elif parts.path.startswith(("/embed/", "/shorts/", "/live/")):
        tail = parts.path.split("/", 2)[2] if parts.path.count("/") >= 2 else ""
        video_id = tail.split("/", 1)[0]

    playlist_id = (query.get("list") or [None])[0]
    playlist_embed = parts.path.rstrip("/") == "/embed/videoseries"
    if playlist_id and (playlist_embed or parts.path.rstrip("/") == "/playlist"):
        return [f"https://www.youtube.com/playlist?list={playlist_id}"]

    results: list[str] = []
    if video_id and VIDEO_ID_RE.fullmatch(video_id):
        results.append(f"https://www.youtube.com/watch?v={video_id}")
    if playlist_id:
        playlist_url = f"https://www.youtube.com/playlist?list={playlist_id}"
        if playlist_url not in results:
            results.append(playlist_url)
    return results


def discover_links(course_dir: Path) -> dict[str, list[str]]:
    sources: dict[str, list[str]] = {}
    for page_path in sorted(course_dir.rglob("*.html")):
        parser = MediaLinkParser()
        try:
            parser.feed(page_path.read_text(encoding="utf-8", errors="replace"))
        except OSError:
            continue
        for raw_url in parser.links:
            for url in canonical_youtube_urls(raw_url):
                page = str(page_path.relative_to(course_dir))
                sources.setdefault(url, [])
                if page not in sources[url]:
                    sources[url].append(page)
    return sources


def vtt_to_text(vtt_text: str) -> str:
    cues: list[str] = []
    current: list[str] = []
    for raw_line in vtt_text.lstrip("\ufeff").splitlines():
        line = raw_line.strip()
        if not line or line == "WEBVTT" or line.startswith(("NOTE", "STYLE", "REGION", "X-TIMESTAMP-MAP")):
            if current:
                cues.append(" ".join(current))
                current = []
            continue
        if VTT_TIME_RE.match(line) or re.fullmatch(r"\d+", line):
            if current:
                cues.append(" ".join(current))
                current = []
            continue
        # Drop inline WebVTT tags, including speaker tags, while keeping their text.
        line = re.sub(r"</?(?:c(?:\.[^ >]+)?|v(?:\s+[^>]*)?|lang(?:\s+[^>]*)?|i|b|u|ruby|rt)(?:\s[^>]*)?>", "", line)
        line = html.unescape(re.sub(r"<[^>]+>", "", line)).strip()
        if line:
            current.append(line)
    if current:
        cues.append(" ".join(current))
    return "\n".join(cue for cue in cues if cue).strip() + "\n"


def write_plain_text_transcripts(course_dir: Path) -> list[dict[str, str]]:
    records: list[dict[str, str]] = []
    for vtt_path in sorted((course_dir / "Transcripts").rglob("*.vtt")):
        try:
            text = vtt_to_text(vtt_path.read_text(encoding="utf-8", errors="replace"))
        except OSError:
            continue
        if not text.strip():
            continue
        text_path = vtt_path.with_suffix(".txt")
        text_path.write_text(text, encoding="utf-8")
        records.append({
            "vtt": str(vtt_path.relative_to(course_dir)),
            "text": str(text_path.relative_to(course_dir)),
        })
    return records


def main() -> int:
    parser = argparse.ArgumentParser(description="Extract available English YouTube captions from exported Canvas pages.")
    parser.add_argument("course_export", type=Path, help="Folder created by export_canvas_course.py")
    parser.add_argument("--languages", default="en.*,en-orig", help="yt-dlp language selector (default: English captions)")
    args = parser.parse_args()

    course_dir = args.course_export.resolve()
    if not course_dir.is_dir():
        print(f"Course export folder not found: {course_dir}", file=sys.stderr)
        return 2

    try:
        import yt_dlp  # noqa: F401 - provides the downloader invoked below
    except ImportError:
        print("Install project dependencies first: .venv\\Scripts\\python.exe -m pip install -r requirements.txt", file=sys.stderr)
        return 2

    links = discover_links(course_dir)
    if not links:
        print("No YouTube video or playlist links were found in the exported HTML pages.")
        return 0

    script_dir = Path(sys.executable).resolve().parent
    env = os.environ.copy()
    env["PATH"] = str(script_dir) + os.pathsep + env.get("PATH", "")
    transcripts_root = course_dir / "Transcripts"
    transcripts_root.mkdir(parents=True, exist_ok=True)
    records: list[dict[str, object]] = []

    for index, (url, source_pages) in enumerate(links.items(), 1):
        for source_page in source_pages:
            page_path = Path(source_page)
            page_transcripts = transcripts_root / page_path.parent / page_path.stem
            page_transcripts.mkdir(parents=True, exist_ok=True)
            template = str(page_transcripts / "%(title)s [%(id)s].%(ext)s")
            command = [
                sys.executable,
                "-m",
                "yt_dlp",
                "--skip-download",
                "--write-subs",
                "--write-auto-subs",
                "--sub-langs",
                args.languages,
                "--sub-format",
                "vtt/best",
                "--convert-subs",
                "vtt",
                "--no-overwrites",
                "--no-progress",
                "--ignore-errors",
                "--js-runtimes",
                "deno",
                "--sleep-requests",
                "0.5",
                "--output",
                template,
                url,
            ]
            print(f"[{index}/{len(links)}] Checking {url}", flush=True)
            try:
                result = subprocess.run(command, env=env, text=True, capture_output=True, check=False)
            except OSError as exc:
                records.append({"url": url, "source_page": source_page, "status": "error", "message": str(exc)})
                continue
            status = "ok" if result.returncode == 0 else "error"
            messages = [line.strip() for line in (result.stderr + "\n" + result.stdout).splitlines() if line.strip()]
            error_message = next((line for line in messages if re.search(r"\bERROR:", line, re.I)), "")
            records.append({
                "url": url,
                "source_page": source_page,
                "status": status,
                "return_code": result.returncode,
                "message": error_message or (messages[-1] if messages else ""),
            })
            if result.returncode and messages:
                print(f"  yt-dlp reported: {error_message or messages[-1]}")

    transcripts = write_plain_text_transcripts(course_dir)
    vtt_files = sorted(transcripts_root.rglob("*.vtt"))
    for record in records:
        source_page = Path(str(record["source_page"]))
        source_folder = str(source_page.parent / source_page.stem)
        video_match = re.search(r"[?&]v=([A-Za-z0-9_-]{11})", str(record["url"]))
        if video_match:
            video_id = video_match.group(1)
            matching_files = [
                path for path in vtt_files
                if str(path.parent.relative_to(transcripts_root)) == source_folder and f"[{video_id}]" in path.name
            ]
        else:
            matching_files = [path for path in vtt_files if str(path.parent.relative_to(transcripts_root)) == source_folder]
        record["caption_files"] = [str(path.relative_to(course_dir)) for path in matching_files]
        if not matching_files:
            if re.search(r"\bPrivate video\b", str(record.get("message", "")), re.I):
                record["status"] = "private_video"
            elif record["status"] == "ok":
                record["status"] = "no-captions"
                record["message"] = "No requested English captions were available."

    manifest = {
        "course": json.loads((course_dir / "manifest.json").read_text(encoding="utf-8")).get("course", {}),
        "extracted_at": datetime.now(timezone.utc).isoformat(),
        "language_selector": args.languages,
        "sources": records,
        "transcripts": transcripts,
    }
    (course_dir / "youtube_transcripts.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Created {len(transcripts)} transcript text file(s); WebVTT caption files are kept alongside them.")
    print(f"Transcript folder: {transcripts_root.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
