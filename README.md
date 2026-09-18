# Canvas course exporter

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
