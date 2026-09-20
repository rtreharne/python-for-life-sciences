# Canvas course exporter

This repository also contains a public, static Jupyter Book for the first five weeks of LIFE733. See the **Build the teaching book** section below.

Export a Canvas course's pages and assignments into folders named and ordered by module. The exporter uses only Python's standard library.

## Setup

The project `.env` file should contain:

```dotenv
CANVAS_URL=https://your-school.instructure.com
CANVAS_API_TOKEN=your_canvas_api_token
```

Keep `.env` private; it is ignored by Git.

## Run

From the project folder, activate the virtual environment if you use it, then run:

```powershell
python export_canvas_course.py
```

Choose a course from the list. You can also select by ID or exact course name:

```powershell
python export_canvas_course.py 12345
python export_canvas_course.py "Introduction to Python"
python export_canvas_course.py --list-courses
python export_canvas_course.py 12345 --output .\exports
```

The default output is `canvas_export/<course ID> - <course name>/`. Each module gets a numbered folder. Page and assignment HTML files are numbered in the order they appear within that module. Pages and assignments that are not in a module go into `Unassigned items`. `manifest.json` records the exported order and any items the script could not match.

Canvas rich text and links are preserved in HTML. Linked Canvas files and external resources remain links and are not downloaded.

Download the text files used by the Week 4 chapter into the book's data folder with the Canvas API credentials in `.env`:

```powershell
python download_canvas_files.py
```

The script reads `CANVAS_API_URL` (or `CANVAS_URL`), `CANVAS_API_TOKEN`, and `COURSE_ID` from `.env`. It searches the course Files API for `quotes.txt`, `dna.txt`, `grades.txt`, `perfect_sunday.txt`, and `system.log`, then writes exact copies to `book/data/week-4/`. The chapter links to those committed copies through GitHub's raw file URLs.

## Extract YouTube captions

Install the caption extraction dependencies inside the virtual environment:

```powershell
.\.venv\Scripts\python.exe -m pip install -r requirements.txt
```

After exporting a course, extract available English captions from YouTube videos and playlists embedded in its pages:

```powershell
.\.venv\Scripts\python.exe extract_youtube_transcripts.py ".\canvas_export\84673 - 202526-LIFE733 - CODING FOR LIFE SCIENCES"
```

The script saves readable `.txt` transcripts and timestamped `.vtt` captions under the course's `Transcripts` folder, grouped by the page that linked each video. It does not download video or audio. Videos without captions or with access restrictions are recorded in `youtube_transcripts.json`.

## Build the teaching book

The `book/` folder contains five teaching chapters, two optional integrated projects, and worked solutions. Examples in the book use Python's standard library and execute during the build.

Create or activate the project virtual environment, then install the book tool:

```bash
python3 -m venv .venv
.venv/bin/python -m pip install -r requirements-book.txt
```

Build and check all examples and internal references:

```bash
(cd book && PATH="../.venv/bin:$PATH" BASE_URL=/python-for-life-sciences JB_ALLOW_NODEENV=yes ../.venv/bin/jupyter book build --html --strict --execute)
```

The static site is written to `book/_build/html/`. GitHub Actions builds and deploys it to GitHub Pages when changes are pushed to `main`. In the repository settings, configure Pages to use **GitHub Actions** as its source.
