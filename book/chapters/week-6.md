---
kernelspec:
  name: python3
  display_name: Python 3
---

# Week 6: Command-line arguments

A command-line argument is extra information supplied when you run a script. Instead of changing a filename or sequence inside your code every time, you give it to the script in the terminal. This makes your work easier to repeat, test, and explain.

Command-line arguments are especially useful for the Portfolio Projects. Your finished script can work with a practice file, an individual dataset, or a new test file without being edited. The command you ran records exactly which input and output you used.

They also make your scripts useful outside VS Code. Not everyone will run your code in an editor with a convenient play button. A script that accepts command-line arguments can be run at any time by opening a terminal, moving to the correct folder, and using the relevant Python command with the required arguments.

This chapter is deliberately short. Your main priority this week is to make sure you have worked through the material from Weeks 1–5 and to make progress on your Portfolio Tasks. Command-line arguments are a small addition that will make those tasks easier to run, test, and document.

## Set up your Week 6 folder

Create `week-6` inside `LIFE733` and open it in VS Code. Use `practice.py` for the short examples, then create `q1.py` to `q4.py` as you reach each question.

```text
LIFE733/
└── week-6/
    ├── practice.py
    ├── q1.py
    ├── q2.py
    ├── q3.py
    └── q4.py
```

Open **Terminal > New Terminal** in VS Code. Check that the terminal is in `week-6`, then run scripts with the Python command that worked in earlier weeks:

```bash
pwd
ls
python3 practice.py
```

On Windows or MWS PCs, use `python practice.py` or `py practice.py` if that is the command you used earlier.

## Supply information when you run a script

The **Run Python File** play button is useful for a quick check, but it normally runs only the active file. It does not ask which sequence, input file, or output file your program should use. You can configure arguments for debugging later, but typing the command in the terminal is simpler and makes the complete command visible.

For example, this command runs `practice.py` and gives it one argument, `sample_A`:

```bash
python3 practice.py sample_A
```

Python stores command-line arguments in the list `sys.argv`. The first item is always the script name. The remaining items are the values typed after it:

```python
import sys

print(sys.argv)
```

Run the script with:

```bash
python3 practice.py sample_A
```

The output is similar to:

```text
['practice.py', 'sample_A']
```

`sys.argv[0]` is the script name. `sys.argv[1]` is the first argument. Command-line arguments begin as strings, so use `int()` or `float()` when you need a number.

**Try it:** run the same script with two arguments, such as `sample_A 12`. Predict the list before running it.

## Document how to use every script

Put a short docstring at the top of a script that needs arguments. State what the script does, the arguments it needs, and one example command.

```python
"""Print a DNA sequence summary.

Usage:
    python q2.py SEQUENCE
Example:
    python q2.py atgcca
"""
```

Also check the number of arguments before using them. A clear usage message is more helpful than an `IndexError`.

```python
import sys

if len(sys.argv) != 2:
    print("Usage: python q1.py SAMPLE_NAME")
    raise SystemExit(1)

sample_name = sys.argv[1]
print(f"Working with: {sample_name}")
```

`SystemExit(1)` stops the script and reports that it was used incorrectly. Keep the usage line accurate if you rename the script or change its arguments.

For portfolio work, save the command you used in your `GAI_documentation` or task notes when it helps explain a result. For example:

```text
python part_d.py portfolio1_123456789_part-d_sequences.fasta results.txt
```

This is more useful than writing “I ran the script”: it identifies the script, input, and output.

## Use one argument: a sample name

### Question 1 — Print a named sample

Create `q1.py`. Add a docstring and write a script that accepts exactly one sample name. It should print:

```text
Working with: sample_A
```

when you run:

```bash
python3 q1.py sample_A
```

Run the script with no argument and with two arguments. In both cases, it should print a clear usage message and stop. This question checks your understanding of strings, lists, and conditions from Weeks 1–3.

## Use an argument in a sequence calculation

### Question 2 — Summarise a DNA sequence

Create `q2.py`. It should accept one DNA sequence, convert it to uppercase, then print its sequence, length, and counts of `A`, `C`, `G`, and `T`.

For this command:

```bash
python3 q2.py atgca
```

expect:

```text
Sequence: ATGCA
Length: 5
A: 2
C: 1
G: 1
T: 1
```

Use `.upper()`, `len()`, and `.count()` from Week 1. Add a docstring and a usage check. Test a second sequence by changing the command, not the code.

## Convert several arguments to numbers

### Question 3 — Calculate a mean

Create `q3.py`. It should accept one or more measurements, convert them to `float` values, then print their mean to two decimal places.

For this command:

```bash
python3 q3.py 4 8 6
```

expect:

```text
Mean: 6.00
```

Use `sys.argv[1:]` to select all the measurements after the script name. A list comprehension can convert them:

```python
values = [float(value) for value in sys.argv[1:]]
```

### A quick aside: list comprehensions

This line is a **list comprehension**. We are being a little bit naughty by using it before covering it properly: it is a short way to loop over a list and build a new list.

```python
values = [float(value) for value in sys.argv[1:]]
```

The equivalent loop uses three lines:

```python
values = []
for value in sys.argv[1:]:
    values.append(float(value))
```

Both versions take each text argument after the script name, convert it to a `float`, and add the result to `values`. The list comprehension saves two lines, but it does not do anything different. You may use the longer `for` loop in this question and in your portfolio work if it is clearer to you.

If no measurements are given, print `Usage: python q3.py NUMBER [NUMBER ...]` and stop. Test the command `python3 q3.py 2.5 3.0 4.5` as well.

## Supply an input file and an output file

### Question 4 — Count bases from a file

Create a file called `sequences.txt` containing:

```text
ATGCA
GGTT
```

Create `q4.py`. It should accept an input filename and an output filename. Read the sequence lines from the input file, join them, convert the result to uppercase, and write base counts to the output file.

Run it with:

```bash
python3 q4.py sequences.txt base_counts.txt
```

`base_counts.txt` should contain:

```text
A: 2
C: 1
G: 3
T: 3
```

Add a docstring and a usage check for exactly two arguments. This follows the same pattern as portfolio scripts: the terminal command states the input and output files, and the script does not need to be edited when the files change.

## When command-line arguments do not work

| Symptom | What to check |
| --- | --- |
| `IndexError: list index out of range` | Check `len(sys.argv)` before accessing an argument. |
| `ValueError` when converting a number | Check the argument is a valid number, such as `3.5` rather than `three`. |
| `FileNotFoundError` | Check the filename and use `pwd` and `ls` to confirm the terminal folder. |
| The play button gives different results | Run the complete terminal command instead. The button may not supply your arguments. |
| An old output is still present | Check that the command names the intended output file and that the script opens it in write mode. |

## Bring the week's ideas together

Command-line arguments make one script reusable. Instead of changing paths or values inside the code, keep the code fixed and change the command. For every portfolio script, make sure you can explain its usage line, the files it needs, and the command you used to run it.

Compare your work with the [Week 6 solutions](../solutions.md#week-6-command-line-arguments). Then rerun Question 4 with a new input file and output filename without editing `q4.py`.
