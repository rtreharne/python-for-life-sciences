---
kernelspec:
  name: python3
  display_name: Python 3
---

# Week 5: Dictionaries, patterns, and modules

In Week 4, you wrote functions that read files and return useful results. This week, you will use dictionaries to store named data, regular expressions to check text, and modules to reuse functions across scripts.

Work through the questions in order. Start with a small lookup, then check a sequence, then read a file. By the end of the chapter, you will combine these steps in a small sequence-analysis program.

## Organise your Week 5 work

Create `week-5` alongside your earlier weekly folders and open it in VS Code. Use `practice.py` for the short examples. Create a separate answer file for each question.

```text
LIFE733/
└── week-5/             ← Open this folder in VS Code
    ├── practice.py     ← Run and change the worked examples
    ├── q1.py … q10.py  ← Create answer scripts as you need them
    ├── sequtils.py     ← Your reusable sequence functions
    ├── main.py         ← Try importing and calling those functions
    ├── make_examples.py ← Create the small datasets in Question 6
    ├── examples.fasta  ← Created by make_examples.py
    └── examples.gff    ← Created by make_examples.py
```

This is a folder diagram. Do not create a file literally named `q1.py … q10.py`. Question 5 is an explanation activity. Create the other files when you reach them. All starter data appears below, so you do not need a student ID or an extra download.

Run scripts with the Python command that worked in earlier weeks, such as `python practice.py` or `python3 practice.py`. If a file cannot be found, use `pwd` and `ls` in the integrated terminal to check that you are in `week-5` and that the file has been saved there. Keep imported files in this folder too.

For each example, **predict → edit → save → run → check**. Change one value and explain why the output changes.

## Look up values by name with a dictionary

A list stores items in order. A **dictionary** stores values under **keys**, such as sample names. You met dictionaries while counting words in Week 4. Here, you will use them to connect biological identifiers with data.

```{code-cell} python
lengths = {"sample_A": 12, "sample_B": 9}  # Connect each name to a length.
print(lengths["sample_A"])                # Retrieve the value for this key.
lengths["sample_C"] = 15                  # Add a key that is not present yet.
lengths["sample_A"] = 18                  # Replace the value for an existing key.
print(lengths)
```

Curly braces `{}` create the dictionary. Each colon separates a key from its value; commas separate the pairs. Here the keys are strings and the values are integers. Square brackets look up a key, so `lengths["sample_A"]` returns `12` on the first line of output. After the assignments, the dictionary contains lengths `18`, `9`, and `15` for samples A, B, and C.

A key can appear only once. Assigning to an existing key changes its value. This is useful when correcting a record, but it can overwrite data if two samples have the same name.

**Try it:** add `sample_D`, then change its length. Predict whether the dictionary will have four entries or five. Use `len(lengths)` to check.

### Handle missing keys and visit every pair

Looking up a missing key with square brackets raises `KeyError`. Sometimes that is a useful signal; sometimes you want a fallback value instead.

```{code-cell} python
lengths = {"sample_A": 12, "sample_B": 9}  # Start with two known samples.
print(lengths.get("sample_X", "Not found"))  # Supply a fallback for a missing key.
for name, length in lengths.items():     # Retrieve one key/value pair per iteration.
    print(f"{name}: {length} bases")     # Display both parts of the pair.
```

`.get(key, fallback)` returns the fallback when the key is absent; it does not add that key. `.items()` supplies pairs, and `name, length` assigns their two parts to separate variables. The output is `Not found`, followed by `sample_A: 12 bases` and `sample_B: 9 bases`.

That same lookup can connect a three-base codon to an amino-acid symbol. Try building a small translation table before you use a larger one.

### Question 1 — Dictionary basics

In `q1.py`, create a dictionary containing `ATG` → `M`, `GCT` → `A`, and `TAA` → `*`. The letters are amino-acid symbols; `*` marks a stop codon.

1. Look up `ATG` and print its value. Expect `M`.
2. Add `TTT` → `F` and check that the dictionary now has four entries.
3. Loop over all key/value pairs and print one pair per line.
4. Try looking up `CCC` using `.get()` with `"Unknown"` as the fallback. Explain why the dictionary still has four entries afterwards.

Attempt the question before watching the walkthrough.

<iframe title="Question 1 walkthrough" width="560" height="315" src="https://www.youtube-nocookie.com/embed/jl4--IxJMOk" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

A dictionary answers “What value belongs to this key?” Next, ask a different question: “Does this text follow the rules I expect?”

## Check text with a regular expression

A **regular expression**, often shortened to *regex*, describes a text pattern. Python's `re` module provides functions for using these patterns. A module is a file of reusable code. `import re` makes its functions available in your script.

```{code-cell} python
import re                                   # Load Python's pattern-matching module.
sequence = "atgc"                            # Try lowercase input first.
match = re.fullmatch(r"[ACGT]+", sequence.upper())  # Check the entire uppercase string.
print(bool(match))                          # Convert a match or None into True or False.
```

The output is `True`. `re.fullmatch(pattern, text)` returns a match object when the **whole** text fits the pattern, or `None` when it does not. `bool()` turns those two outcomes into `True` or `False`.

Read `r"[ACGT]+"` in parts:

- `r` marks a raw Python string. It keeps backslashes available for regex syntax rather than Python escape sequences. This pattern has no backslashes, but the convention is useful as patterns grow.
- `[ACGT]` allows **one** character chosen from A, C, G, or T.
- `+` repeats that choice **one or more times**. It therefore rejects an empty string.
- The quotation marks delimit the Python string; they are not part of the pattern being matched.

This pattern accepts only the four DNA bases. Some biological files use ambiguity codes such as `N`. For this exercise, report them rather than deleting them.

**Try it:** change `sequence` to `"AXTG"`, then `""`, then `"AT GC"`. All three should fail. Calling `.upper()` changes case; it does not remove invalid characters or internal spaces.

### Question 2 — Validate a DNA sequence

Write `is_dna(sequence)` in `q2.py`. Return a Boolean using `re.fullmatch()` after converting the input to uppercase. Test `"ATCGTT"`, `"AXTG"`, `"atgc"`, and `""`; expect `True`, `False`, `True`, and `False` respectively.

Keep the function's return separate from printing. Use a loop outside the function to display each test input and its result. Add `"NNN"` to show that your rule rejects ambiguity codes. Later, this check will help you decide which FASTA records can be analysed.

<iframe title="Question 2 walkthrough" width="560" height="315" src="https://www.youtube-nocookie.com/embed/gBAfQFRxjhw" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You have already imported a module to avoid writing your own pattern matcher. Python supplies many other modules; try one whose results are easy to check by hand.

## Use code from a standard library module

The **standard library** comes with Python. Its `math` module provides mathematical functions and constants. You do not need to install anything extra.

```{code-cell} python
import math                        # Make the module available by name.
root = math.sqrt(81)                # Call its square-root function.
print(root)                        # Display a floating-point result.
print(f"Pi to two places: {math.pi:.2f}")  # Format a constant for display.
```

The output is `9.0` and `Pi to two places: 3.14`. The dot in `math.sqrt` selects a name inside the module. Parentheses call the function. `math.pi` is a value, so it has no call parentheses. As in Week 2, `:.2f` changes the displayed precision, not the stored constant.

**Try it:** calculate the square root of `2` and display it to three decimal places. Then remove the formatting to see more of the stored value.

### Question 3 — Explore `math`

In `q3.py`, import `math`, calculate the square root of `144`, print π, and calculate `10!` with `math.factorial(10)`. Factorial means `10 × 9 × … × 1`; expect `3628800`. The square root should be `12.0`.

Give the printed results labels. Then ask a partner or an AI tool to suggest one readability improvement, or review the names and layout yourself. Check that the revised script produces the same numbers.

<iframe title="Question 3 walkthrough" width="560" height="315" src="https://www.youtube-nocookie.com/embed/sBE8iQAbe9g" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You can also put your own functions in a module. This lets several scripts use the same code.

## Put your own functions in a module

Create `sequtils.py` and save the following function in it:

```python
# sequtils.py: keep reusable sequence operations in this file.
def transcribe(sequence):
    """Return uppercase RNA for a DNA string."""
    return sequence.upper().replace("T", "U")  # Normalise case, then replace T.
```

This file defines a function but does not run it. The triple-quoted line inside the function is a **docstring**. It describes what the function does. For now, the function assumes its input is valid DNA.

Next, create a separate `main.py` in the same folder:

```python
# main.py: run an analysis using the functions in sequtils.py.
import sequtils                           # Import the file without the .py extension.
print(sequtils.transcribe("atgc"))        # Call the function through its module name.
```

Run `main.py`. Expect `AUGC`. Python finds `sequtils.py` because it is beside the running script. `sequtils.transcribe` means “the function named `transcribe` inside `sequtils`”. Keep the two files separate and save both before running again.

Avoid naming your own files `re.py`, `math.py`, or `random.py`: Python might import your file when you intended to use the standard library. Also keep demonstration calls in `main.py`; top-level statements in a module run when it is first imported.

**Try it:** change the input in `main.py` to `"TTAC"`. You should get `UUAC` without editing the function. This is the benefit of reusing code: the calculation stays in one place while the input changes.

### Question 4 — Build `sequtils.py`

Keep `transcribe(sequence)` and add `rev_comp(sequence)`, which returns an uppercase reverse complement. Use the mapping A → T, T → A, C → G, and G → C. Build the complement with a loop and reverse the completed string using `[::-1]`.

Call both functions from `main.py`. For `"atgc"`, expect RNA `AUGC` and reverse complement `GCAT`. Also check `"A"` → `"T"` and `""` → `""` for `rev_comp`. At this stage, assume only A, C, G, and T; later, validate data before calling the function.

<iframe title="Question 4 walkthrough" width="560" height="315" src="https://www.youtube-nocookie.com/embed/iek0ZhnYm2s" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Keep `sequtils.py` open. You will add a file reader to it later. First, practise explaining what a pattern will and will not match.

## Find a pattern within a longer string

Validation and searching do different jobs. `fullmatch` checks an entire input. `findall` returns non-overlapping matches within it.

```{code-cell} python
import re                              # Use the same module for a different operation.
text = "ATG---CCA---T"                  # Separators break up runs of DNA bases.
hits = re.findall(r"[ACGT]{3}", text)   # Find groups containing exactly three bases.
print(hits)                            # Display the list of matching strings.
```

The output is `['ATG', 'CCA']`. `{3}` means exactly three repetitions of the preceding character choice. The final `T` is too short. This pattern does not say that a match must be an isolated group: in `ATGC`, `findall` finds `ATG`, whereas `fullmatch` rejects the four-character string.

**Try it:** use `"ATGCCA"`. Expect two non-overlapping matches. Then use `"ATGC"` and compare `findall` with `fullmatch`. Choosing the matching operation is part of specifying the task.

### Question 5 — Explain a regex

Write down your explanation of `r"[ACGT]{3}"` before running it. Describe the brackets, the repetition count, and the difference between searching within a string and checking the whole string.

Ask a partner or an AI tool to explain the same pattern, then compare the explanations against tests with `"ATG"`, `"ATGC"`, `"AXG"`, and `""`. If studying alone, predict each result on paper and check it in `practice.py`. Correct any explanation that says this pattern alone guarantees the entire input has three characters.

<iframe title="Question 5 walkthrough" width="560" height="315" src="https://www.youtube-nocookie.com/embed/5h3cdH7A6jI" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You can now store named values, check text, and share functions. The remaining questions use those skills with biological file formats.

## Meet FASTA and GFF files

A **FASTA** record has a header beginning with `>`, followed by its sequence on one or more lines. A file can contain several records:

```text
>gene_A
ATGAAC
TCTTAA
>gene_B
GGCC
```

The header identifies the sequence. It is not part of the sequence itself. The two lines for `gene_A` join to make `ATGAACTCTTAA`, with length `12`. Use headers as dictionary keys and join the sequence lines as values.

A **GFF3** file describes features at positions along those sequences. Its nine columns are separated by tabs. Start and end positions are 1-based and both endpoints are included. The strand is `+` or `-`; a CDS row also has a phase describing where the next complete codon begins. These conventions are defined in the [GFF3 specification](https://github.com/The-Sequence-Ontology/Specifications/blob/master/gff3.md).

| Column | Python index | Meaning |
| --- | --- | --- |
| seqid | `0` | Identifier of the FASTA sequence |
| source | `1` | Where the annotation came from |
| type | `2` | Feature type, such as `CDS` or `exon` |
| start | `3` | First coordinate, inclusive |
| end | `4` | Last coordinate, inclusive |
| score | `5` | Numeric score, or `.` when absent |
| strand | `6` | Forward `+` or reverse `-` strand |
| phase | `7` | CDS phase `0`, `1`, or `2`; `.` for other features |
| attributes | `8` | Named details such as `ID` and `Parent` |

FASTA gives you the sequence. GFF tells you where a feature lies in that sequence. Questions 8 and 9 are optional. You can move from Question 7 straight to Question 10.

### Question 6 — Create and inspect your example files

Save the following as `make_examples.py`. This setup script creates small synthetic files for the remaining activities; run it from your `week-5` folder. Rerunning it replaces these two example files.

```python
# make_examples.py: write shared practice data without a personalised identifier.
fasta = ">gene_A\nATGAAC\nTCTTAA\n>gene_B\nTTAGGA\nCAT\n>gene_bad\nATGNNA\n"
with open("examples.fasta", "w", encoding="utf-8") as handle:
    handle.write(fasta)                  # Save three records, including invalid DNA.

# Each string is one feature row; \t creates real tab separators.
rows = [
    "gene_A\tpractice\texon\t1\t12\t.\t+\t.\tID=exon_A;Parent=tx_A",
    "gene_A\tpractice\tCDS\t7\t12\t.\t+\t0\tID=cds_A2;Parent=tx_A",
    "gene_A\tpractice\tCDS\t1\t6\t.\t+\t0\tID=cds_A1;Parent=tx_A",
    "gene_B\tpractice\tCDS\t1\t3\t.\t-\t0\tID=cds_B1;Parent=tx_B",
    "gene_B\tpractice\tCDS\t7\t9\t.\t-\t0\tID=cds_B2;Parent=tx_B",
]
with open("examples.gff", "w", encoding="utf-8") as handle:
    handle.write("##gff-version 3\n")    # Mark the file format version.
    for row in rows:
        handle.write(row + "\n")        # Keep each feature on its own line.
```

`\n` starts a new line and `\t` inserts a tab in the saved file. Open both outputs in VS Code. Count the FASTA headers, join the wrapped lines by eye, and identify the record containing `N`. You should find three records with lengths `12`, `9`, and `6`.

The GFF file is a small feature extract for practising coordinates, not a complete gene annotation. Each CDS has one parent, all phases are zero, and each fragment contains complete codons. The rows are deliberately not all in coordinate order. These choices let you practise sorting and strand handling without needing a general annotation parser.

The walkthrough below demonstrates dataset preparation with a different generator. Use the self-contained script above for this chapter; its filenames and expected results are the ones used in the following questions.

<iframe title="Question 6 walkthrough" width="560" height="315" src="https://www.youtube-nocookie.com/embed/8n3jBd--AnM" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You can inspect the files yourself. Next, write code to collect the same records.

## Read one FASTA record at a time

A FASTA reader needs a current header and a sequence collected so far. When it finds a new header, it saves the previous record before starting the next one. After the loop, it must save the final record too.

Try this small demonstration in `practice.py`:

```{code-cell} python
lines = [">sample_A", "ATG", "CCC", ">sample_B", "TT"]  # Lines without newlines.
records = {}                            # Store completed records here.
header = None                           # No record has started yet.
sequence = ""                           # Accumulate the current sequence.
for line in lines:
    if line.startswith(">"):
        if header is not None:          # Save a record only if one has started.
            records[header] = sequence
        header = line[1:]               # Remove the leading > character.
        sequence = ""                   # Reset for the new record.
    else:
        sequence += line                # Join sequence lines in their existing order.
if header is not None:                  # Save the final record after the loop.
    records[header] = sequence
print(records)
```

Expect `{'sample_A': 'ATGCCC', 'sample_B': 'TT'}`. `None` means no header has been assigned yet; `is not None` checks for an assigned header. `.startswith(">")` distinguishes headers from sequence lines, and `[1:]` keeps everything after the first character.

**Try it:** temporarily remove the final two lines that save the last record. Notice which dictionary entry disappears. Restore them before continuing. This small check catches a common file-reading bug.

### Question 7 — Write a FASTA reader

Add `read_fasta(filename)` to `sequtils.py` and call it from `q7.py`. Adapt the loop above to read from an open file, using `.strip()` to remove surrounding whitespace and `.upper()` on sequence lines. Return the completed dictionary after the file has been read.

Use these rules so your function has predictable behaviour:

1. Skip blank lines.
2. Keep the complete header after `>` as the key, trimming surrounding whitespace.
3. Reject an empty or repeated header, sequence text before any header, or a record with no sequence. Use `raise ValueError("explanation")`, as in Week 4, rather than overwriting or discarding data.
4. Return `{}` for an empty file. Do not validate the alphabet yet: the reader should preserve `gene_bad` so a later check can report it.

Print the number of records, then each identifier and length. Expect `3`, followed by `gene_A: 12`, `gene_B: 9`, and `gene_bad: 6`. Test a one-record file and a file containing blank lines. Make separate test files for the rejected cases so you keep your main dataset intact.

You can now retrieve sequences by name. The optional GFF questions use those names to extract specified regions.

## Optional: connect coordinates to sequences

A GFF interval from `2` to `5` includes four bases. Python uses a zero-based start and an excluded end, so the corresponding slice is `[1:5]`:

```{code-cell} python
sequence = "ACGTAC"                  # Six bases numbered 1–6 in a GFF file.
start, end = 2, 5                    # Store the inclusive GFF coordinates.
fragment = sequence[start - 1:end]   # Shift the start, keeping the excluded Python end.
print(fragment)                     # Positions 2, 3, 4, and 5 give CGTA.
```

Subtract one from `start` only. Subtracting one from `end` loses the final base. Check the length with `end - start + 1`.

### Question 8 — Inspect GFF features (optional)

In `q8.py`, read `examples.gff`. Skip blank lines and lines beginning with `#`. Split each remaining line with `.split("\t")` and check that there are exactly nine fields. A plain `.split()` would treat other whitespace as separators too; this format specifically uses tabs.

Select rows whose type is `CDS` or `exon`. Print the type, integer start and end, strand, and the `ID` from the attributes column. To obtain the ID, split the attributes on `;`, then split each part on the first `=` using `.split("=", 1)`. Store those name/value pairs in a dictionary.

Expect five selected rows: one exon and four CDS features. The first has ID `exon_A`, coordinates `1`–`12`, and strand `+`. Add a comment line and confirm it does not change the result. Keep this exercise separate from FASTA reading: you are inspecting annotations, not changing any sequences yet.

Several CDS fragments can be joined into a coding sequence. Their order matters as much as their contents.

### Question 9 — Build coding sequences (optional)

In `q9.py`, combine your FASTA reader with the GFF processing from Question 8. Create a dictionary keyed by each CDS feature's `Parent`, with a list of that parent's fragments as its value. Store each fragment together with its start coordinate and strand. Ignore exon rows so they are not counted a second time.

For this small dataset:

1. Look up the source sequence using `seqid`. Check `1 <= start <= end <= len(sequence)` before slicing.
2. Extract each fragment using `sequence[start - 1:end]`.
3. Sort each parent's fragments by increasing genomic start, then join their DNA strings.
4. If the parent's strand is `-`, reverse-complement the **whole joined string** using `sequtils.rev_comp`. This reverses the fragment order as well as the bases within each fragment.
5. Return a dictionary of parent IDs and completed coding DNA. Print each ID and up to the first 100 bases using `[:100]`.

One way to organise fragments is as `(start, fragment)` pairs in a list. `sorted(pairs)` compares their first values first, giving the coordinate order. Store the strand separately for each parent and check that all its rows agree.

Check `tx_A` against `ATGAACTCTTAA` and `tx_B` against `ATGTAA`. Reorder the rows in the GFF file and confirm the results stay the same. Reverse-complementing individual fragments and leaving them in ascending order would give the wrong reverse-strand result.

These are joined **coding regions**, not full RNA transcripts: untranslated regions are omitted. This exercise assumes one sequence and one strand per parent, non-overlapping intervals, one parent per CDS, and phase zero with complete codons. General GFF processing needs additional handling for other annotations; use these small files to understand the core operation first.

Whether or not you tried the GFF questions, you can now return to the FASTA data and translate one complete coding sequence. The final question uses `gene_A` directly, so it does not depend on Questions 8 or 9.

## Translate a sequence, then search the protein

Translation uses the dictionary lookup from Question 1 and the three-character steps from Week 3. For this exercise, begin at the first base, read consecutive triplets, and stop at the first stop codon. The reading frame is supplied. This is not a program for finding genes.

Save this small table at the top of `sequtils.py`, outside any function:

```python
# These codons cover the practice sequence; this is not a complete genetic code.
CODONS = {"ATG": "M", "AAC": "N", "TCT": "S", "TAA": "*"}
```

Capital letters in `CODONS` signal a value intended to stay fixed. For new sequences, extend the table with verified mappings; do not guess what an absent codon means.

### Question 10 — Translate and search for a motif

**Part A: write a translation function.** Add `translate_dna(sequence)` to `sequtils.py`. Convert the input to uppercase and require a nonempty string of A, C, G, and T. Reject a length that is not divisible by three, rather than silently dropping its final bases.

Loop in steps of three. Look up each codon in `CODONS`; raise a clear `ValueError` if it is missing. If its value is `*`, stop without appending that symbol. Otherwise, add the amino-acid letter to a growing protein string. Return the protein after the loop.

In `q10.py`, read `examples.fasta`, select `gene_A`, and translate it. Expect `MNS`. Save it to `protein_1.fasta` with header `>gene_A_protein` and the protein on the next line. Check `ATGTAA` → `M`, lowercase input, an incomplete triplet, and the invalid `gene_bad` record. Test errors separately so they do not stop the main script before its output is written.

**Part B: search the protein.** Start with the pattern `r"N[ST]"`, meaning N immediately followed by S or T. Use `re.findall` to list matches and `re.search` to decide whether any match exists. For `MNS`, expect one match, `NS`.

Write the protein record to `motif_hits.fasta` only when a match exists. Open the output in write mode even if there are no hits, so a previous run's results do not remain in the file. Test the no-hit case with `M` and check that the file is empty afterwards.

This short motif activity is a text-search exercise. A matching string alone does not establish a protein's biological function. As an extension, make the pattern a function argument so you can change the search without changing the file-writing code.

## When the pieces do not work together

| Symptom | What to check |
| --- | --- |
| `KeyError` | Check the spelling and case of the key; decide whether a fallback or an error is appropriate. |
| A DNA check accepts an invalid sequence | Use `fullmatch`, not a search that accepts a valid substring. |
| `ModuleNotFoundError` | Save `sequtils.py` beside the script you are running; check the spelling. |
| Importing a module prints unexpected results | Move demonstration calls out of the module and into `main.py`. |
| The final FASTA record is missing | Save the current record after the reading loop. |
| Two records become one | Reject duplicate headers before storing a new record. |
| A feature is one base too short | Use `start - 1:end`, with no subtraction from the end. |
| Reverse-strand fragments appear in the wrong order | Sort, concatenate, then reverse-complement the joined sequence. |
| Old motif hits remain after a no-hit run | Open the output in write mode on every run. |

Test each function with one small input before connecting it to a file. When an error appears, identify the stage that failed: reading, validation, transformation, or writing. Then change one part at a time.

## Bring the first five weeks together

Compare your attempts with the [Week 5 solutions](../solutions.md#week-5). Then choose one function and explain its input, return value, and error cases without looking at the code.

For extra practice, combine `read_fasta`, your DNA validator, and the GC calculation from Week 4. Write a tab-separated summary containing each valid record's identifier, length, and GC percentage to two decimal places. Report invalid records by name instead of silently deleting them. For these files, valid lengths are `12` and `9`, with GC percentages `25.00` and `33.33`; flag `gene_bad`.

You began with strings and simple calculations. You can now read named sequences, validate them, reuse functions, and save a result another program can read. Continue with the [Portfolio Projects](../projects.md) to practise combining these tools in a larger task.
