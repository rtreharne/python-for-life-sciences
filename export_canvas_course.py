"""Export Canvas course pages and assignments into module-ordered folders."""

from __future__ import annotations

import argparse
import html
import json
import os
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from urllib.error import HTTPError, URLError
from urllib.parse import quote, urlencode, urljoin, urlsplit
from urllib.request import Request, urlopen


class CanvasError(Exception):
    """A readable error returned by the Canvas API or exporter."""


def read_env_file(path: Path) -> dict[str, str]:
    """Read the small KEY=value subset of dotenv syntax used by this project."""
    values: dict[str, str] = {}
    if not path.is_file():
        return values
    for line in path.read_text(encoding="utf-8-sig").splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if stripped.startswith("export "):
            stripped = stripped[7:].lstrip()
        key, separator, value = stripped.partition("=")
        if not separator:
            continue
        value = value.strip()
        if len(value) >= 2 and value[0] == value[-1] and value[0] in "\"'":
            value = value[1:-1]
        values[key.strip()] = value
    return values


def safe_name(value: Any, limit: int = 90) -> str:
    """Make a readable filename that is safe on Windows, macOS and Linux."""
    name = str(value or "Untitled")
    name = re.sub(r'[<>:"/\\|?*\x00-\x1f]', "-", name)
    name = re.sub(r"\s+", " ", name).strip(" .")
    name = name[:limit].rstrip(" .")
    if not name or name in {".", ".."}:
        name = "Untitled"
    # Windows reserves these names even when they have an extension.
    if re.match(r"^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\.|$)", name, re.I):
        name = f"_{name}"
    return name


class CanvasClient:
    def __init__(self, canvas_url: str, token: str, timeout: int = 45):
        parts = urlsplit(canvas_url.strip().rstrip("/"))
        if parts.scheme not in {"https", "http"} or not parts.netloc:
            raise CanvasError("CANVAS_URL must be a full URL, such as https://school.instructure.com")
        if parts.query or parts.fragment:
            raise CanvasError("CANVAS_URL must not include a query string or fragment")
        path = parts.path.rstrip("/")
        if path.endswith("/api/v1"):
            path = path[:-7].rstrip("/")
        self.base_url = f"{parts.scheme}://{parts.netloc}{path}"
        self.api_root = f"{self.base_url}/api/v1"
        self.origin = (parts.scheme.lower(), parts.hostname.lower() if parts.hostname else "", parts.port)
        self.token = token
        self.timeout = timeout

    def _request_json(self, url: str) -> tuple[Any, str | None]:
        parts = urlsplit(url)
        request_origin = (parts.scheme.lower(), parts.hostname.lower() if parts.hostname else "", parts.port)
        if request_origin != self.origin:
            raise CanvasError("Canvas returned a pagination link to a different host; stopping for safety.")

        for attempt in range(5):
            request = Request(
                url,
                headers={
                    "Authorization": f"Bearer {self.token}",
                    "Accept": "application/json",
                    "User-Agent": "python-for-life-sciences-canvas-export/1.0",
                },
            )
            try:
                with urlopen(request, timeout=self.timeout) as response:
                    payload = json.loads(response.read().decode("utf-8"))
                    return payload, response.headers.get("Link")
            except HTTPError as exc:
                if exc.code == 429 or 500 <= exc.code < 600:
                    if attempt < 4:
                        retry_after = exc.headers.get("Retry-After", "")
                        try:
                            delay = min(max(float(retry_after), 1), 60)
                        except ValueError:
                            delay = min(2**attempt, 16)
                        time.sleep(delay)
                        continue
                if exc.code == 401:
                    raise CanvasError("Canvas rejected the API token (HTTP 401). Check CANVAS_API_TOKEN.") from None
                if exc.code == 403:
                    raise CanvasError("Canvas denied access (HTTP 403). The token may lack course permissions.") from None
                if exc.code == 404:
                    raise CanvasError("Canvas could not find a requested course item (HTTP 404).") from None
                raise CanvasError(f"Canvas API request failed with HTTP {exc.code}.") from None
            except (URLError, TimeoutError, json.JSONDecodeError) as exc:
                if attempt < 4 and isinstance(exc, (URLError, TimeoutError)):
                    time.sleep(min(2**attempt, 16))
                    continue
                reason = "network error" if isinstance(exc, (URLError, TimeoutError)) else "invalid JSON response"
                raise CanvasError(f"Canvas request failed: {reason}.") from None
        raise CanvasError("Canvas request failed after several retries.")

    def get(self, endpoint: str, params: dict[str, Any] | None = None) -> Any:
        query = urlencode(params or {}, doseq=True)
        url = f"{self.api_root}/{endpoint.lstrip('/')}"
        if query:
            url = f"{url}?{query}"
        payload, _ = self._request_json(url)
        return payload

    def get_all(self, endpoint: str, params: dict[str, Any] | None = None) -> list[dict[str, Any]]:
        query = urlencode(params or {}, doseq=True)
        url = f"{self.api_root}/{endpoint.lstrip('/')}"
        if query:
            url = f"{url}?{query}"
        results: list[dict[str, Any]] = []
        while url:
            payload, link_header = self._request_json(url)
            if not isinstance(payload, list):
                raise CanvasError("Canvas returned an unexpected response while listing items.")
            results.extend(item for item in payload if isinstance(item, dict))
            match = re.search(r'<([^>]+)>\s*;\s*rel\s*=\s*"?next"?', link_header or "", re.I)
            url = urljoin(url, match.group(1)) if match else ""
        return results


def select_course(client: CanvasClient, requested: str | None) -> dict[str, Any]:
    courses = client.get_all("courses", {"per_page": 100})
    courses = [course for course in courses if course.get("id") is not None]
    if requested:
        matching_id = [course for course in courses if str(course["id"]) == requested]
        matches = matching_id or [course for course in courses if str(course.get("name", "")).casefold() == requested.casefold()]
        if not matches:
            raise CanvasError(f"No accessible course matched {requested!r}. Use --list-courses to see available courses.")
        if len(matches) == 1:
            return matches[0]
        courses = matches

    if not courses:
        raise CanvasError("No courses are visible to this Canvas API token.")
    print("Courses visible to this token:")
    for index, course in enumerate(courses, 1):
        print(f"  {index}. {course.get('name', 'Untitled')} (ID {course['id']})")
    while True:
        answer = input("Choose a course number: ").strip()
        if answer.isdigit() and 1 <= int(answer) <= len(courses):
            return courses[int(answer) - 1]
        print(f"Enter a number from 1 to {len(courses)}.")


def item_page_url(item: dict[str, Any], pages_by_url: dict[str, dict[str, Any]], pages_by_id: dict[str, dict[str, Any]]) -> str | None:
    for key in ("page_url", "content_id"):
        candidate = item.get(key)
        if candidate is not None and str(candidate) in pages_by_url:
            return str(candidate)
        if candidate is not None and str(candidate) in pages_by_id:
            return str(pages_by_id[str(candidate)].get("url", "")) or None
    title = str(item.get("title", "")).casefold()
    matches = [page for page in pages_by_url.values() if str(page.get("title", "")).casefold() == title]
    return str(matches[0].get("url")) if len(matches) == 1 else None


def write_html(path: Path, title: str, content: str, metadata: list[tuple[str, Any]], source_url: str = "") -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    rows = "".join(
        f"<dt>{html.escape(str(label))}</dt><dd>{html.escape(str(value))}</dd>"
        for label, value in metadata
        if value not in (None, "")
    )
    source = f'<p><a href="{html.escape(source_url, quote=True)}">Open in Canvas</a></p>' if source_url else ""
    document = (
        "<!doctype html>\n<html lang=\"en\"><head><meta charset=\"utf-8\">"
        f"<meta name=\"viewport\" content=\"width=device-width, initial-scale=1\"><title>{html.escape(title)}</title>"
        "<style>body{font:16px/1.55 system-ui,sans-serif;max-width:900px;margin:2rem auto;padding:0 1rem}"
        "header{border-bottom:1px solid #ccc;margin-bottom:2rem;padding-bottom:1rem}dt{font-weight:600}"
        "dd{margin:0 0 .5rem}</style></head><body>"
        f"<header><h1>{html.escape(title)}</h1><dl>{rows}</dl>{source}</header>\n"
        f"<main>{content or '<p><em>No description or page body was provided in Canvas.</em></p>'}</main>"
        "</body></html>\n"
    )
    path.write_text(document, encoding="utf-8")


def export_course(client: CanvasClient, course: dict[str, Any], output_root: Path) -> Path:
    course_id = str(course["id"])
    course_name = str(course.get("name") or f"Course {course_id}")
    course_dir = output_root / f"{course_id} - {safe_name(course_name)}"
    course_dir.mkdir(parents=True, exist_ok=True)

    pages = client.get_all(f"courses/{quote(course_id, safe='')}/pages", {"per_page": 100})
    assignments = client.get_all(f"courses/{quote(course_id, safe='')}/assignments", {"per_page": 100})
    modules = client.get_all(
        f"courses/{quote(course_id, safe='')}/modules",
        {"per_page": 100, "include[]": "items"},
    )
    pages_by_url = {str(page.get("url")): page for page in pages if page.get("url")}
    pages_by_id = {
        str(page.get("page_id", page.get("id"))): page
        for page in pages
        if page.get("page_id", page.get("id")) is not None
    }
    assignments_by_id = {str(assignment["id"]): assignment for assignment in assignments if assignment.get("id") is not None}
    exported_refs: set[tuple[str, str]] = set()
    manifest_modules: list[dict[str, Any]] = []
    exported = 0
    skipped: list[str] = []

    for module_index, module in enumerate(modules, 1):
        module_id = module.get("id")
        items = module.get("items")
        if not isinstance(items, list):
            items = client.get_all(
                f"courses/{quote(course_id, safe='')}/modules/{quote(str(module_id), safe='')}/items",
                {"per_page": 100},
            )
        module_dir = course_dir / f"{module_index:02d} - {safe_name(module.get('name'))}"
        module_entry: dict[str, Any] = {"name": module.get("name"), "id": module_id, "items": []}

        for item_index, item in enumerate(items, 1):
            item_type = item.get("type")
            if item_type == "Page":
                page_url = item_page_url(item, pages_by_url, pages_by_id)
                if not page_url:
                    skipped.append(f"{module.get('name')}: could not match page {item.get('title', '(untitled)')}")
                    continue
                key = ("Page", page_url)
                page = pages_by_url.get(page_url, {})
                # The detail endpoint returns the body; page URLs are slugs, not numeric IDs.
                detail = client.get(f"courses/{quote(course_id, safe='')}/pages/{quote(page_url, safe='')}")
                page = detail if isinstance(detail, dict) else page
                title = str(page.get("title") or item.get("title") or page_url)
                filename = f"{item_index:02d} - Page - {safe_name(title)}.html"
                write_html(
                    module_dir / filename,
                    title,
                    str(page.get("body") or ""),
                    [("Type", "Page"), ("Module", module.get("name")), ("Published", page.get("published")), ("Updated", page.get("updated_at"))],
                    str(page.get("html_url") or item.get("html_url") or ""),
                )
                exported_refs.add(key)
            elif item_type == "Assignment":
                assignment_id = str(item.get("content_id") or "")
                if not assignment_id:
                    skipped.append(f"{module.get('name')}: assignment {item.get('title', '(untitled)')} has no content ID")
                    continue
                key = ("Assignment", assignment_id)
                assignment = client.get(f"courses/{quote(course_id, safe='')}/assignments/{quote(assignment_id, safe='')}")
                if not isinstance(assignment, dict):
                    assignment = assignments_by_id.get(assignment_id, {})
                title = str(assignment.get("name") or item.get("title") or f"Assignment {assignment_id}")
                filename = f"{item_index:02d} - Assignment - {safe_name(title)}.html"
                write_html(
                    module_dir / filename,
                    title,
                    str(assignment.get("description") or ""),
                    [
                        ("Type", "Assignment"),
                        ("Module", module.get("name")),
                        ("Due", assignment.get("due_at")),
                        ("Points possible", assignment.get("points_possible")),
                        ("Submission types", ", ".join(assignment.get("submission_types", [])) if isinstance(assignment.get("submission_types"), list) else assignment.get("submission_types")),
                    ],
                    str(assignment.get("html_url") or item.get("html_url") or ""),
                )
                exported_refs.add(key)
            else:
                continue
            exported += 1
            module_entry["items"].append({"position": item.get("position", item_index), "type": item_type, "title": title, "file": str((module_dir / filename).relative_to(course_dir))})
        manifest_modules.append(module_entry)

    unassigned_dir = course_dir / "Unassigned items"
    unassigned_index = 1
    manifest_unassigned: list[dict[str, Any]] = []
    for page in pages:
        page_url = str(page.get("url") or "")
        key = ("Page", page_url)
        if not page_url or key in exported_refs:
            continue
        detail = client.get(f"courses/{quote(course_id, safe='')}/pages/{quote(page_url, safe='')}")
        if not isinstance(detail, dict):
            detail = page
        title = str(detail.get("title") or page_url)
        filename = f"{unassigned_index:02d} - Page - {safe_name(title)}.html"
        write_html(unassigned_dir / filename, title, str(detail.get("body") or ""), [("Type", "Page"), ("Published", detail.get("published")), ("Updated", detail.get("updated_at"))], str(detail.get("html_url") or ""))
        manifest_unassigned.append({"type": "Page", "title": title, "file": str((unassigned_dir / filename).relative_to(course_dir))})
        exported_refs.add(key)
        exported += 1
        unassigned_index += 1

    for assignment in assignments:
        assignment_id = str(assignment.get("id") or "")
        key = ("Assignment", assignment_id)
        if not assignment_id or key in exported_refs:
            continue
        title = str(assignment.get("name") or f"Assignment {assignment_id}")
        filename = f"{unassigned_index:02d} - Assignment - {safe_name(title)}.html"
        write_html(
            unassigned_dir / filename,
            title,
            str(assignment.get("description") or ""),
            [("Type", "Assignment"), ("Due", assignment.get("due_at")), ("Points possible", assignment.get("points_possible"))],
            str(assignment.get("html_url") or ""),
        )
        manifest_unassigned.append({"type": "Assignment", "title": title, "file": str((unassigned_dir / filename).relative_to(course_dir))})
        exported_refs.add(key)
        exported += 1
        unassigned_index += 1

    manifest = {
        "course": {"id": course_id, "name": course_name, "html_url": course.get("html_url")},
        "exported_at": datetime.now(timezone.utc).isoformat(),
        "modules": manifest_modules,
        "unassigned_items": manifest_unassigned,
        "skipped_items": skipped,
    }
    (course_dir / "manifest.json").write_text(json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (course_dir / "README.txt").write_text(
        f"Canvas export: {course_name} (course {course_id})\n"
        f"Exported {exported} page/assignment file(s).\n\n"
        "Files are HTML documents and retain Canvas rich text and links. Linked Canvas files and external resources are not downloaded.\n"
        "See manifest.json for module order, item details, and any skipped items.\n",
        encoding="utf-8",
    )
    if skipped:
        print(f"Note: skipped {len(skipped)} item(s) that could not be matched to course content.")
        for message in skipped:
            print(f"  - {message}")
    return course_dir


def main() -> int:
    parser = argparse.ArgumentParser(description="Export Canvas course pages and assignments, ordered by modules.")
    parser.add_argument("course", nargs="?", help="Course ID or exact course name. If omitted, choose from a list.")
    parser.add_argument("--output", type=Path, default=Path("canvas_export"), help="Output folder (default: ./canvas_export)")
    parser.add_argument("--list-courses", action="store_true", help="List accessible courses and exit")
    args = parser.parse_args()

    env = read_env_file(Path(__file__).with_name(".env"))
    canvas_url = os.environ.get("CANVAS_URL") or env.get("CANVAS_URL")
    token = os.environ.get("CANVAS_API_TOKEN") or env.get("CANVAS_API_TOKEN")
    if not canvas_url or not token:
        print("Set CANVAS_URL and CANVAS_API_TOKEN in the project .env file.", file=sys.stderr)
        return 2
    try:
        client = CanvasClient(canvas_url, token)
        if args.list_courses:
            for course in client.get_all("courses", {"per_page": 100}):
                if course.get("id") is not None:
                    print(f"{course['id']}\t{course.get('name', 'Untitled')}")
            return 0
        course = select_course(client, args.course)
        course_dir = export_course(client, course, args.output)
    except (CanvasError, OSError, KeyboardInterrupt) as exc:
        if isinstance(exc, KeyboardInterrupt):
            print("Export cancelled.", file=sys.stderr)
        else:
            print(f"Error: {exc}", file=sys.stderr)
        return 1
    print(f"Export complete: {course_dir.resolve()}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
