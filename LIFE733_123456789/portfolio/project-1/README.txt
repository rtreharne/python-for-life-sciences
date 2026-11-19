LIFE733 Portfolio Project 1
Dataset version: 1
Student ID: 123456789

START HERE
1. Extract this ZIP into a new folder, for example LIFE733/portfolio/project-1.
2. In VS Code choose File > Open Folder and select the extracted project-1 folder.
3. Open Terminal > New Terminal. Use pwd and ls to confirm the location.
4. Work through part-a-dna, part-b-counts, part-c-replicates, and part-d-sequences separately.
5. Open the Python script in one part folder, read its TODO comment, and complete the task using the data file beside it.
6. Run the script from that part folder. Use python script_name.py (or python3 script_name.py if that is the command configured on your computer).
7. Check your output against the expected format in the book. Your values should come from this generated dataset, not from copied practice values.
8. Run test_project1.py from the project-1 folder after all four result files have been created.
9. Save the generated project1_test_transcript.txt alongside your scripts as evidence. Do not rename or edit the generated data files.

FOLDER CONTENTS
Each part folder contains exactly one recommended script and one generated data file:
- part-a-dna/part_a.py reads project1_<student-id>_part-a_fragments.txt
- part-b-counts/part_b.py reads project1_<student-id>_part-b_counts.txt
- part-c-replicates/part_c.py reads project1_<student-id>_part-c_replicates.tsv
- part-d-sequences/part_d.py reads project1_<student-id>_part-d_sequences.fasta
The root also contains test_project1.py, which checks the four result files and writes a scored transcript.

PATHS
Run a part script while the terminal is inside the folder containing that script and its data file. Run the test script only while the terminal is inside the extracted project-1 folder. If Python reports FileNotFoundError, run pwd and ls, then open the correct folder.

GAI USE
Use gai_log.txt at the project root to record any meaningful GAI use. It includes examples for Microsoft Copilot and ChatGPT. GAI can support your learning, but must not generate your project code, pseudocode, algorithm, or a solution directly.

SUBMISSION
Complete all four parts. Keep the student ID comment in each script. Test your logic with the practice snippets in the book, then run the finished script on these generated files. The generated values are your individual portfolio dataset.

RESULT FILES
Run each script while the terminal is inside its own part folder. Each script must print its result and save it with this exact name beside the script and generated input:
- part-a-dna: run python part_a.py and save part_a_results.txt
- part-b-counts: run python part_b.py and save part_b_results.txt
- part-c-replicates: run python part_c.py and save part_c_results.txt
- part-d-sequences: run python part_d.py and save part_d_results.txt
Do not call these files results.txt or put them in a different folder: test_project1.py checks these exact paths. After creating all four files, run python test_project1.py from the project-1 folder. It writes project1_test_transcript.txt.
