---
kernelspec:
  name: python3
  display_name: Python 3
---

# Week 4: Functions and files

## Learning goals

Functions package steps under a meaningful name. Parameters provide input; `return` sends a result back to the code that called the function. Files let a program work with data saved outside the script.

## Define and call a function

```{code-cell} python
def triple_number(value):
    """Return a number multiplied by three."""
    return value * 3

answer = triple_number(4)
print(answer)
```

The function runs when called with `triple_number(4)`. `return` gives the value `12` back to the caller. `print` displays a value but does not return it for later calculations. A function that only prints would produce `None` if you tried to assign its result.

## Make a reusable sequence calculation

The GC percentage is the number of G and C bases divided by the total number of bases, multiplied by 100. Put the calculation in a function so that it can be reused and tested.

```{code-cell} python
def gc_content(sequence):
    sequence = sequence.upper()
    gc_count = sequence.count("G") + sequence.count("C")
    return 100 * gc_count / len(sequence)

print(f"{gc_content('ATGC'):.1f}%")
```

This short function assumes a non-empty DNA string containing only A, C, G, and T. When you extend it, decide how to handle an empty string or invalid symbols. Clear assumptions are part of a good interface.

## Read a text file safely

Use `with open(...)` so that Python closes the file even if an error occurs. The example writes a tiny FASTA file, then reads sequence lines and joins them. In a FASTA file, lines beginning with `>` are headers, not sequence.

```{code-cell} python
from pathlib import Path

example = Path("week4_example.fasta")
example.write_text(">sample_1\nATGC\nAATT\n", encoding="utf-8")
sequence_lines = []
with example.open(encoding="utf-8") as handle:
    for line in handle:
        line = line.strip()
        if line and not line.startswith(">"):
            sequence_lines.append(line)
sequence = "".join(sequence_lines)
print(sequence)
example.unlink()
```

The code removes the temporary file after the example. For your own data, keep input and output paths explicit, and avoid overwriting the original file.

## Write a report

Open an output file in write mode (`"w"`) to create or replace it. Use a descriptive path and include headings so a person can interpret the results later.

```{code-cell} python
from pathlib import Path

report = Path("week4_report.txt")
report.write_text("Sample\tLength\nseq_A\t6\n", encoding="utf-8")
print(report.read_text(encoding="utf-8"), end="")
report.unlink()
```

## Activities

1. Write `gc_content(sequence)` and test it with `ATGC`, `GGCC`, and `ATAT`.
2. Write a function that returns a reverse complement. Test a sequence with a known answer.
3. Create a small text file with three lines, then write a function that prints each line with a line number.
4. Read a sequence from a file, calculate its length and GC percentage, and save a summary report.
5. **Mini-project:** create a DNA file analyser that reads one sequence from FASTA, checks its symbols, and writes its length and GC percentage to a report. Test an empty or malformed input too.

## Videos

The Week 4 playlist has an introduction and question walkthroughs. Start with the introduction, then choose a video matching the activity you are attempting.

<iframe title="Week 4: functions and file handling introduction" width="560" height="315" src="https://www.youtube-nocookie.com/embed/7NSkR6r-pZw?cc_load_policy=1&cc_lang_pref=en" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Read the transcript](../captions/7NSkR6r-pZw.txt) · [Watch on YouTube](https://www.youtube.com/watch?v=7NSkR6r-pZw)

<iframe title="Week 4: write a function" width="560" height="315" src="https://www.youtube-nocookie.com/embed/9hoTmmzB4DY?cc_load_policy=1&cc_lang_pref=en" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Read the transcript](../captions/9hoTmmzB4DY.txt) · [Watch on YouTube](https://www.youtube.com/watch?v=9hoTmmzB4DY)

<iframe title="Week 4: read from a file" width="560" height="315" src="https://www.youtube-nocookie.com/embed/roOG_A93cyQ?cc_load_policy=1&cc_lang_pref=en" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Read the transcript](../captions/roOG_A93cyQ.txt) · [Watch on YouTube](https://www.youtube.com/watch?v=roOG_A93cyQ)

[Browse the Week 4 walkthrough playlist](https://www.youtube.com/playlist?list=PLsWFiDvzgp8o9Tyl_OwhsbjyzdjzHizuM).
