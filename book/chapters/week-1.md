---
kernelspec:
  name: python3
  display_name: Python 3
---

# Week 1: Strings, variables, and input/output

This week you will write your first Python scripts and use them to transform short DNA sequences. Work through the chapter with VS Code open: type the examples, run them, and change one thing at a time. Programming becomes easier when you can connect each instruction to a result you have seen for yourself.

Small tasks have an important purpose here. Asking for a sequence, making its case consistent, selecting a region, and reporting its length are building blocks of biological data analysis. Later, you will apply these operations to many sequences, organise them into reusable functions, and read data from files. For now, a short sequence lets you check every result by eye.

## What you will learn

By the end of the week, you should be able to create and run a saved Python script, explain the difference between text and numbers, collect input, and manipulate strings. You will also practise checking a program against an expected answer. You do not need to memorise every command: use this chapter as a reference while you work.

Complete Questions 1–8 in order. Each question builds on the explanation immediately before it. Try a question before watching its walkthrough or opening the [Week 1 solutions](../solutions.md#week-1). The examples displayed on this website have already been run; to experiment, run your own copies in VS Code.

## Set up your Week 1 project in VS Code

### Open a folder and a terminal

A **project folder** is simply a folder that holds the files for a piece of work. A **script** is a text file containing Python instructions; its name ends in `.py`. VS Code is the editor in which you write those instructions. The Python **interpreter** is the program that executes them.

1. Open VS Code. Choose **File → Open Folder** and create or select a folder called `LIFE733` in a location you can find again. On a university MWS computer, use your `M:` drive if it is available to you. On your own computer, a folder in your home directory is suitable.
2. In VS Code's Explorer panel, create a folder named `week-1` inside `LIFE733`. Open that `week-1` folder with **File → Open Folder**. Your files for this chapter will live here.
3. Choose **Terminal → New Terminal**. The integrated terminal appears in the lower panel of VS Code. A terminal lets you enter commands, including commands to run Python.
4. Check the terminal profile using the menu beside the **+** button. On Windows MWS use **PowerShell**. On macOS/Linux use **Bash**, if available. The commands shown here also work in the usual macOS **zsh** shell.

A **shell** (Bash or PowerShell) interprets terminal commands. The editor and terminal have different jobs: put Python programs in the editor, and put the commands below in the terminal. Type one command at a time and press Enter. Lines beginning with `#` are explanatory comments; you can omit them when typing.

### Check where you are before creating or running files

The terminal has a **current working directory**: the folder from which relative file paths are resolved. Opening a file in the editor does not necessarily change that directory. Check it instead of guessing.

**Bash — macOS/Linux:**

```bash
pwd                 # Print the full path of the current directory.
ls                  # List the files and folders in that directory.
```

`pwd` means “print working directory”. `ls` lists the directory's contents; an empty folder may produce no output. Your path should end in `LIFE733/week-1`.

**PowerShell — Windows/MWS:**

```powershell
Get-Location        # Show the current directory's full path.
Get-ChildItem       # List its files and folders.
```

These commands perform the same checks. On MWS, your path might be `M:\LIFE733\week-1`. Your actual path depends on where you created the folder.

If the terminal is in `LIFE733`, move into its child folder using the appropriate command:

```bash
cd "week-1"         # Bash: enter week-1 inside the current directory.
pwd                 # Confirm the new location.
```

`cd` means “change directory”. The name here is a **relative path**, interpreted from your current directory. Quotes keep a path containing spaces together as one argument.

```powershell
Set-Location "week-1"   # PowerShell: enter the child folder.
Get-Location           # Confirm the new location.
```

`Set-Location` changes PowerShell's working directory. If you are somewhere else entirely, use a full path instead. These are examples: replace the location with the folder you actually created.

```bash
cd "$HOME/LIFE733/week-1"  # Example: a project inside your home directory.
ls                        # Check the destination's contents.
```

`$HOME` expands to your home directory in Bash. This command works only if your project is at that location; a project in Documents needs that additional path component.

```powershell
Set-Location "M:\LIFE733\week-1"  # Example: a project on the MWS M: drive.
Get-ChildItem                    # Check the destination's contents.
```

The drive letter and backslashes identify a Windows path. If you see “path does not exist”, check the spelling and location in Explorer. Do not continue running commands until you can locate your project folder.

### Check Python and create your first file

Use the command for your terminal:

```bash
python3 --version    # Bash: ask the Python interpreter for its version.
```

`python3` starts Python; `--version` asks it to report its version and exit. Expect a result beginning with `Python 3`.

```powershell
python --version     # PowerShell: check the Python interpreter.
```

On Windows, `python` is the command used throughout this chapter. If it is unavailable but `py --version` works, use `py` wherever the Windows examples say `python`. If neither works, ask for help checking the installation before continuing.

In VS Code, open Extensions and check that **Python**, published by **Microsoft**, is installed. Open the Command Palette (**Ctrl+Shift+P**, or **Cmd+Shift+P** on macOS), choose **Python: Select Interpreter**, and select your Python 3 installation. This selection controls the extension's run commands; a manually typed terminal command uses whichever interpreter that command resolves to. The [VS Code Python guide](https://code.visualstudio.com/docs/python/python-tutorial) explains the interpreter and run controls.

In Explorer, choose **New File**, name it `practice.py`, and enter:

```python
# Display a message so we can check that this script runs.
print("My first LIFE733 script")
```

The first line is a comment: Python ignores the text after `#` on that line. `print` is a function that displays a value. Its parentheses enclose the value to display; the quotes mark that value as text. The quotes themselves are not printed.

Save the file with **Ctrl+S** (macOS: **Cmd+S**). Check that Explorer shows `practice.py`, not `practice.py.txt`. Then run it:

```bash
pwd                    # Confirm that you are in your week-1 folder.
ls                     # Check that practice.py is listed.
python3 practice.py    # Execute the saved file with Python.
```

The space separates the interpreter command from the filename. Python reads the file from disk and runs its instructions from top to bottom.

```powershell
Get-Location            # Confirm that you are in your week-1 folder.
Get-ChildItem           # Check that practice.py is listed.
python .\practice.py    # Execute the file in the current directory.
```

In PowerShell, `.\` explicitly means “in the current directory”. Both terminal examples should display `My first LIFE733 script` and then return to the shell prompt.

You can also use **Run Python File in Terminal** in the editor's run menu. For these first exercises, practise the terminal command so you understand which file is being run. See the [VS Code running guide](https://code.visualstudio.com/docs/python/run) for the run-menu option.

**Follow along:** change the message, save, and run the script again. If the old message appears, check that you saved the file and are running the file you edited. Repeat this **edit → save → run → inspect** cycle throughout the chapter. Create `q1.py`, `q2.py`, and so on for your answers, replacing `practice.py` in the run command with the relevant filename.

### Know which prompt is waiting for you

A shell prompt often ends in `$` in Bash or starts with `PS` in PowerShell; its exact appearance varies. Do not type the prompt itself. A prompt showing `>>>` belongs to Python's interactive interpreter, which you may have opened by entering `python` or `python3` without a filename. Type `exit()` and press Enter to return to the shell before running a script command.

When your script asks a question with `input`, type the requested answer in the terminal and press Enter. It is waiting for data, so you should not enter another shell command at that point. **Ctrl+C** interrupts a running script if you need to stop it.

## Text, variables, and your first interaction

### Strings, assignment, and printing

Python represents text using a **string**, whose type is called `str`. A string can contain letters, digits, spaces, or punctuation. Matching single quotes or matching double quotes delimit a string: `'ATGC'` and `"ATGC"` represent the same text. Use straight quotation marks in code, not typographic “curly quotes”.

```{code-cell} python
sample_name = "sample_01"  # Give a text value a descriptive name.
print(sample_name)         # Read the value associated with that name.
print("sample_name")       # Display these literal characters instead.
```

The first line is an **assignment**. Python evaluates the right side of `=` and associates its value with the name on the left. Here, `sample_name` is a variable. The next lines print `sample_01` and `sample_name`, respectively: an unquoted name refers to a variable, while quoted text is a **literal** string.

Variable names are case-sensitive: `dna` and `DNA` are different names. Use descriptive names with underscores, such as `sample_name`; do not put spaces in them or start them with a digit. Define a variable before using it. Assignment uses one `=`; it is an instruction to store a value, not a mathematical claim that remains true forever.

### Ask for input and format a message

Put this example in `practice.py` and run it yourself:

```python
sample_name = input("Sample name: ")  # Wait for text and save the response.
print(f"Processing {sample_name}.")   # Insert that value into a message.
```

`input` first displays its **prompt**, the string inside the parentheses. It then waits for Enter and returns the typed text as a string, without the final newline. You do not type quotation marks around your response. If you enter `sample_02`, the next line displays `Processing sample_02.`

The `f` immediately before the opening quote makes an **f-string**. Python evaluates the expression inside `{sample_name}` and inserts its value into the surrounding text. Without the `f`, the braces and variable name would be printed literally. Parentheses call functions; quotes delimit text; braces inside an f-string mark expressions to insert. Each symbol has a specific job.

Interactive examples use ordinary code blocks because they wait for your response. The other worked examples show their output on this page. Both kinds can be copied into your script.

### Question 1 — Hello, Python

Create `q1.py`. Ask for the user's name with the prompt `Enter your name: `, store the response, and print a personalised greeting on one line using an f-string. With the response `Alex`, your greeting should be `Hello, Alex!`.

Run the script twice with different names. Does it greet the person who actually supplied the input? Explain which part of the program stores the response and which part inserts it into the message. Later, the same pattern will let you label results with sample names rather than generic messages.

## Change case and measure a sequence

A DNA sequence can be stored as a string. Python treats its characters as text; it does not automatically know whether they are valid DNA bases.

```{code-cell} python
dna = "gAtC"             # Keep the original mixed-case sequence.
upper_dna = dna.upper()   # Create an uppercase version.
lower_dna = dna.lower()   # Create a lowercase version.
print(upper_dna)
print(lower_dna)
print("Length:", len(dna))  # Count the characters in the original string.
print("Original:", dna)    # Show that the original value is unchanged.
```

The outputs are `GATC`, `gatc`, `Length: 4`, and `Original: gAtC`. A **method** is an operation accessed through an object: the dot in `dna.upper()` selects the string's `upper` method, and `()` calls it. Empty parentheses mean that this call supplies no arguments. Writing `dna.upper` without parentheses does not perform the conversion.

Strings are **immutable**: their characters cannot be changed in place. These methods return new strings. To retain the uppercase result, assign it to a name, as above, or reassign `dna = dna.upper()`.

`len(dna)` is a function call that returns an integer count. It counts all characters, including spaces; it does not validate a sequence. In `print("Length:", len(dna))`, the comma separates two arguments. `print` places a space between them and ends the line with a newline.

**Follow along:** add a space inside the sequence and predict its new length. Run the program to check. Remove the space before continuing with the DNA exercises, which assume inputs contain only A, C, G, and T in either case.

### Question 2 — DNA Case & Length

Create `q2.py`. Prompt for one DNA sequence, then print its uppercase version, lowercase version, and length, on three separate lines. For the input `aCgTtg`, expect:

```text
ACGTTG
acgttg
Length: 6
```

These are output lines, not code to enter in the editor. Test a second sequence whose length you can count manually. Keep the original input in a variable and explain why calling `.upper()` alone does not replace its value. Consistent case will make comparisons and base counting more reliable in later weeks.

Try your answer before watching this walkthrough, then compare the approach with your own.

<iframe title="Question 2 walkthrough: DNA case and length" width="560" height="315" src="https://www.youtube-nocookie.com/embed/qyeJIcrAj30" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Join strings together

**Concatenation** means joining strings end to end. With two strings, `+` performs concatenation and does not insert a space or separator.

```{code-cell} python
first = "ac"                 # First fragment, in its original case.
second = "Gta"               # Second fragment.
combined = (first + second).upper()  # Join first, then convert the result.
print(combined)
print("Length:", len(combined))
```

The result is `ACGTA` with length `5`. The parentheses around `first + second` group the expression so `.upper()` applies to the whole joined string. Writing `first + second.upper()` would uppercase only `second`, leaving `first` as `ac`. The original variables remain unchanged.

**Follow along:** swap the two fragments. Predict the new sequence and its length before running. The order changes the sequence, but concatenation still adds the two lengths.

### Question 3 — Concatenate Two Sequences

Create `q3.py`. Ask for two sequences using separate `input` calls. Join them in the order entered, convert the complete result to uppercase, and print the sequence and its length. Inputs `actg` and `tta` should produce:

```text
ACTGTTA
Length: 7
```

The seven characters must be adjacent, with no intervening space. Try a one-base first fragment and a four-base second fragment as an additional check. Later, you will use this operation to assemble sequence lines read from a file.

Attempt the script, then use the walkthrough to review how the two inputs become one result.

<iframe title="Question 3 walkthrough: concatenate two sequences" width="560" height="315" src="https://www.youtube-nocookie.com/embed/3htTsf2EQiE" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Select and reverse characters with slicing

Each character has a position, called an **index**. Python starts counting indices at zero. For `GATCA`, the positions are:

| Index | 0 | 1 | 2 | 3 | 4 |
| --- | --- | --- | --- | --- | --- |
| Character | G | A | T | C | A |

```{code-cell} python
dna = "GATCA"           # Five characters, indexed from 0 to 4.
print(dna[0])           # Select the first character.
print(dna[1:4])         # Select indices 1, 2, and 3.
print(dna[2:])          # Select index 2 through to the end.
print(dna[::-1])        # Visit every character in reverse order.
```

The outputs are `G`, `ATC`, `TCA`, and `ACTAG`. Square brackets select characters. A single index selects one character; a **slice** selects a sequence of characters. The general form is `text[start:stop:step]`: `start` is included, `stop` is excluded, and `step` specifies how to move between positions.

For an ordinary forward slice, leaving out the start means the beginning, leaving out the stop means the end, and leaving out the step means `1`. In `[::-1]`, the negative step means move backwards; the omitted endpoints make Python traverse the entire string from its last character to its first. The two colons matter: `dna[-1]` selects only the last character, whereas `dna[::-1]` reverses the whole sequence.

A slice starting at index `2` discards the first two characters. This is useful when removing a known prefix or extracting a region, but always establish whether a position supplied by a dataset counts from zero or one. Here, all indices count from zero.

### Question 4 — Reverse Sequence

Create `q4.py`. Ask for a DNA sequence and print its characters in reverse order. Input `ACTG` must give `GTCA`. This question changes character order only; do not replace any bases with their complements.

Test `A` as well: reversing a single character should leave it unchanged. Explain what the `-1` does in your slice. You will combine reversal with a separate base-mapping operation in Question 6.

Try the question first, then watch the walkthrough to check your use of slicing.

<iframe title="Question 4 walkthrough: reverse a sequence" width="560" height="315" src="https://www.youtube-nocookie.com/embed/rGS8ixk8uvQ" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

## Replace bases and add a repeated tail

`replace` returns a string in which matching text has been replaced. We will model a simple DNA-to-RNA conversion by replacing `T` with `U`. This assumes the supplied DNA represents the coding-strand sequence in the appropriate orientation; it is a text-processing exercise, not a complete model of transcription or RNA processing.

```{code-cell} python
dna = "GATT"                   # Use uppercase so T matches consistently.
rna = dna.replace("T", "U")    # Replace every T with U.
tail = "A" * 3                 # Repeat A three times for this demonstration.
rna_with_tail = rna + tail      # Append the tail without a space.
print("RNA:", rna)
print("With tail:", rna_with_tail)
print("Length:", len(rna_with_tail))
```

This prints `RNA: GAUU`, `With tail: GAUUAAA`, and `Length: 7`. The two arguments in `.replace("T", "U")` mean “old text” and “replacement text”, in that order. Matching is case-sensitive, so lowercase `t` would remain unchanged unless you first normalise the DNA with `.upper()`.

With a string and an integer, `*` repeats the string. Here `"A" * 3` creates `"AAA"`; concatenating that tail adds three characters to the RNA. Do not type spaces between bases to make the sequence easier to read: a space becomes an extra character.

### Question 5 — RNA + polyA

Create `q5.py`. Ask again for the two fragments from Question 3, join them, and convert the complete DNA to uppercase. Convert every `T` to `U`, append **exactly seven** `A` characters, and print the resulting RNA with its total length. A new script does not inherit variables from a previous script, so it needs its own input and assignment statements.

For fragments `actg` and `tta`, the RNA before adding the tail is `ACUGUUA`. The final result is:

```text
ACUGUUAAAAAAAA
Length: 14
```

The RNA already ends in one `A`; adding seven gives eight consecutive terminal `A` characters. There is no space before the tail. Check the length as `7 + 7 = 14`. This combination of small transformations is the beginning of a processing pipeline: each intermediate result becomes the next operation's input.

## Read unfamiliar code: a guided bug hunt

Question 6 introduces a loop and a dictionary ahead of their fuller treatment later in the course. Treat it as guided practice in reading code. You only need to understand the small set of operations described here.

A **dictionary** associates keys with values. For example, a base can be a key and its complement the associated value. A **loop** repeats an indented block for each item in a sequence.

```{code-cell} python
labels = {"A": "adenine", "C": "cytosine"}  # Map keys to values.
for base in "AC":                           # Visit A, then C.
    print(labels.get(base, "unknown"))      # Look up each base's label.
```

This prints `adenine` and then `cytosine`. Inside the dictionary's braces, a colon separates each key from its value, and commas separate the pairs. In `for base in "AC":`, `base` is assigned one character at a time. The final colon starts the loop's block. The four spaces before `print` show that it belongs to the block and runs on each iteration.

`labels.get(base, "unknown")` looks up the current key. If it is missing, `get` returns the supplied fallback, `"unknown"`. Unlike the braces in an f-string, these dictionary braces construct a collection of key–value pairs; context determines their meaning.

### Question 6 — Fix the Reverse Complement (Bug Hunt)

Copy this deliberately incomplete program into `q6.py`. It produces a complement, but does not yet produce the required **reverse complement**:

```python
dna = "ACTG"  # Test DNA; assume uppercase A, T, C, and G only.
comp = {"A": "T", "T": "A", "C": "G", "G": "C"}  # Base partners.
result = ""   # Start with an empty string to accumulate the answer.

for base in dna:  # Inspect the order in which this visits the bases.
    result = result + comp.get(base, "?")  # Append one complement.

print(result)  # Display the completed result after the loop.
```

`""` is the empty string, with length zero. On each iteration, Python evaluates `result + comp.get(base, "?")` using the current value of `result`, then assigns the longer string back to `result`. The unindented `print` runs once after the loop. The fallback `?` marks an unrecognised character; it does not make invalid DNA valid.

Run the supplied version and trace its output on paper. Then change the order in which the loop visits the bases so these checks pass:

| Input DNA | Required reverse complement |
| --- | --- |
| `ACTG` | `CAGT` |
| `AATTCC` | `GGAATT` |

Keep the base-pair mapping unchanged. Explain the difference between reversing, complementing, and doing both. Later, loops will apply operations across many records, and dictionaries will support mappings such as codons to amino acids.

## Convert numeric input before doing arithmetic

`input` always returns a string, even when the user types digits. The type of a value affects what an operator does.

```{code-cell} python
text = "2.5"            # This value is text, despite containing digits.
print(text * 2)         # Repeating a string joins two copies.
value = float(text)     # Convert the text to a decimal-capable number.
print(value * 2)        # Numeric multiplication doubles the value.
```

The outputs are `2.52.5` and `5.0`. `float(text)` converts suitable numeric text to a floating-point number; it does not alter `text`. Assigning the result to `value` retains the number for arithmetic. Use `int` for a whole-number input such as a position: `int("4")` produces the integer `4`. `int("3.5")` fails because that string does not represent an integer.

Use `str` to convert a value to text when needed; f-strings handle the conversion for display automatically. For example, inserting a number in an f-string avoids trying to concatenate a string and a number with `+`. Floating-point numbers approximate many decimal values; we will revisit suitable precision when reporting calculations.

### Question 7 — Numeric Input (Type Casting)

Create `q7.py`. Ask `Enter a number: `, convert the response to `float`, double the numeric value, and print a line beginning `Result:`. Input `3.5` must give `Result: 7.0`. Also check that `3` gives `Result: 6.0` and `-2` gives `Result: -4.0`.

Explain why the conversion must happen before multiplication. For now, assume the user enters a valid number. Text such as `three` raises `ValueError`; handling unsuitable input is a later step. Numeric conversion will be essential when working with measurements, counts, and concentrations.

## Combine your skills in a small project

You now have the pieces needed to collect data, select a region, transform it, and report the result. Before writing code, list the intermediate values you need. Giving each stage a clear variable name makes it easier to find the first point at which an unexpected result appears.

### Question 8 — Mini Project: DNA Mystery Message

A colleague sends you a DNA sequence and a key telling you where a message begins. Write `q8.py` to extract and transform it. This is a practice scenario for string processing.

1. Ask for the DNA sequence and preserve the entered text for your original-DNA report.
2. Ask for the key and convert it to an integer. The key is a **zero-based index**: key `4` discards the first four characters and starts at the fifth character.
3. Make an uppercase working copy and slice from the key position through to the end.
4. Replace every `T` in the trimmed sequence with `U`.
5. Append **exactly ten** `A` characters to the trimmed RNA. This question uses ten, whereas Question 5 used seven.
6. Print the original input, trimmed RNA before the tail, RNA including the tail, and the total length including the tail.

For input `ATGCTTACGGTAC` and key `4`, expect:

```text
Original DNA: ATGCTTACGGTAC
Trimmed RNA: UUACGGUAC
Poly-A RNA: UUACGGUACAAAAAAAAAA
Length: 19
```

The original sequence has 13 characters. Removing four leaves nine, and adding ten gives 19. The trimmed RNA contains `U`, not `T`. Use these independent checks to verify your result rather than relying only on its appearance.

For the main exercise, assume valid DNA and an integer key from zero up to the sequence length. Test key `0`, which keeps the whole sequence, and a key equal to its length, which leaves empty trimmed RNA and then a ten-character tail. Python accepts negative slice indices and slices beyond the end, but those are outside this exercise's stated input range.

**Extensions:** test lowercase input and confirm that your working sequence is normalised while the original report preserves what was entered. Then describe, in plain language, how you would reject characters other than A, T, C, and G and reject keys outside the allowed range. Implementing those checks is an optional look ahead to Week 2's decisions and Week 3's loops; completing the main transformation is the priority this week.

## When a script does not work

Errors are information about what Python could not do. Read the final line of the error message first, then check the filename and line number it identifies.

| Symptom | What to check |
| --- | --- |
| “Can't open file” or “No such file” | Use the directory and listing commands above. Is the saved `.py` file in the current directory? Is its name spelled correctly? |
| Command not found or not recognised | Check the interpreter command and installation. Use the version check before attempting to run a file. |
| `SyntaxError` | Check matching quotes, parentheses, brackets, and required colons. Do not paste shell commands into a Python file. |
| `NameError` | Check that the variable was assigned earlier and that its spelling and case match. |
| `IndentationError` | Check the four spaces inside the loop. Top-level statements should not have accidental leading spaces. |
| `TypeError` when joining values | Check whether you are combining text with a number. Use an f-string for display or convert numeric input before arithmetic. |
| `ValueError` during conversion | Check whether the typed response is valid for `float` or `int`. |
| No new output after editing | Save the file, then run the correct file again. |
| Script seems to pause | Look for an input prompt in the terminal; type the requested data and press Enter. |

If you need help, share the smallest example that shows the issue, the input you used, the expected output, and the full error message. Try to explain what you expected each line to do. That explanation often reveals the next useful check.

## Bring the week's ideas together

Revisit your eight scripts and choose one line in each to explain aloud. Can you say what value it receives, what operation it performs, and what value it produces? Change the input and predict the result before rerunning. You are aiming for understanding you can reuse, rather than an answer that works for only one example.

In Week 2, decisions will let your scripts react to input. In Week 3, loops and collections will help you repeat work across datasets. In Week 4, functions and files will turn these small transformations into reusable analyses. In Week 5, you will work with structured biological formats. String operations from this chapter remain part of that work.

Compare your attempts with the [separate solutions](../solutions.md#week-1), then begin the sequence-transformation stage of [Project 1](../projects.md) when you feel ready. The extended projects are optional opportunities to practise; return to their later stages as you learn the tools they require.
