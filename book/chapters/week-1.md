---
kernelspec:
  name: python3
  display_name: Python 3
---

# Week 1: Strings, variables, and input/output

This week, you will write your first Python scripts and use them to work with short DNA sequences. Keep VS Code open as you read. Type the examples, run them, and change one thing at a time. Seeing the result helps you understand what each instruction does.

These small tasks are the building blocks of biological data analysis. You will ask for a sequence, standardise its case, select a region, and report its length. Later, you will apply the same steps to many sequences and read them from files. For now, short sequences make it easy to check your results by eye.

## What you will learn

By the end of the week, you will be able to create and run a Python script, collect input, work with text and numbers, and change strings. You will also practise checking your results against an expected answer. Keep this chapter handy as you work. You do not need to memorise every command.

Work through Questions 1–8 in order. Each one uses ideas from the section before it. Try the question before watching its video or checking the [Week 1 solutions](../solutions.md#week-1). The examples on this page show their results. Run your own copies in VS Code to experiment.

## Set up your Week 1 project in VS Code

### Open a folder and a terminal

A **project folder** holds the files for your work. A **script** is a text file of Python instructions, saved with a `.py` ending. You write scripts in the VS Code editor. Python's **interpreter** runs them.

1. Open VS Code. Choose **File → Open Folder** and create or select a folder named `LIFE733` somewhere you can find again. On a university MWS computer, use your `M:` drive if available. On your own computer, use a folder in your home directory.
2. In Explorer, create a folder named `week-1` inside `LIFE733`. Then choose **File → Open Folder** and open `week-1`. You will save this week's scripts here.
3. Choose **Terminal → New Terminal**. The integrated terminal opens at the bottom of VS Code. Use it to enter commands and run Python.
4. Use the menu beside the terminal's **+** button to choose a shell. On Windows MWS, choose **PowerShell**. On macOS or Linux, choose **Bash** if available. The Bash commands also work in the usual macOS **zsh** shell.

A **shell** (Bash or PowerShell) interprets commands you type in the terminal. Write Python in the editor. Enter the commands below in the terminal. Type one command at a time and press Enter. The text after `#` explains each command and does not need to be typed.

### Check where you are before creating or running files

The terminal always works from a **current directory**. When you give it a filename, it looks in that folder. Opening a file in the editor does not always change the terminal's directory, so check it before running a script.

**Bash (macOS/Linux):**

```bash
pwd                 # Print the full path of the current directory.
ls                  # List the files and folders in that directory.
```

`pwd` shows the current directory. `ls` lists its contents. An empty folder may show nothing. The path should end in `LIFE733/week-1`.

**PowerShell (Windows/MWS):**

```powershell
Get-Location        # Show the current directory's full path.
Get-ChildItem       # List its files and folders.
```

These PowerShell commands do the same checks. On MWS, the path might look like `M:\LIFE733\week-1`. Your path will depend on where you created the folder.

If the terminal is in `LIFE733`, move into its child folder using the appropriate command:

```bash
cd "week-1"         # Bash: enter week-1 inside the current directory.
pwd                 # Confirm the new location.
```

`cd` changes the directory. Here, `week-1` is a **relative path**: it means the folder named `week-1` inside your current directory. Quotes keep a path with spaces together as one piece.

```powershell
Set-Location "week-1"   # PowerShell: enter the child folder.
Get-Location           # Confirm the new location.
```

`Set-Location` changes PowerShell's current directory. If your terminal is somewhere else, use the full path to your folder. The paths below are examples. Use the location where you created your project.

```bash
cd "$HOME/LIFE733/week-1"  # Example: a project inside your home directory.
ls                        # Check the destination's contents.
```

In Bash, `$HOME` stands for your home directory. Use this command only if `LIFE733` is directly inside your home directory. If you put it in Documents, include `Documents` in the path.

```powershell
Set-Location "M:\LIFE733\week-1"  # Example: a project on the MWS M: drive.
Get-ChildItem                    # Check the destination's contents.
```

The drive letter and backslashes mark this as a Windows path. If PowerShell says the path does not exist, check the spelling and find the folder in Explorer before continuing.

### Check Python and create your first file

Now check that Python is available. Use the command for your terminal:

```bash
python3 --version    # Bash: ask the Python interpreter for its version.
```

`python3` is the Python command on many macOS and Linux computers. `--version` prints the installed version. Expect it to start with `Python 3`.

```powershell
python --version     # PowerShell: check the Python interpreter.
```

On Windows, use `python` as shown in this chapter. If that command is unavailable but `py --version` works, use `py` in its place. If neither command works, ask for help installing or locating Python.

In VS Code, open Extensions and install **Python** by **Microsoft** if it is not already installed. Open the Command Palette (**Ctrl+Shift+P**, or **Cmd+Shift+P** on macOS), choose **Python: Select Interpreter**, and select your Python 3 installation. This tells VS Code which Python to use with its run button. Commands you type yourself use the Python command in that terminal. See the [VS Code Python guide](https://code.visualstudio.com/docs/python/python-tutorial) for details.

With the folder and interpreter ready, create a script and run it once. This checks that VS Code can find both your file and Python.

In Explorer, choose **New File**, name it `practice.py`, and enter:

```python
# Display a message so we can check that this script runs.
print("My first LIFE733 script")
```

The first line is a comment. Python ignores text after `#`. `print` displays a value. Its parentheses contain what to display, and the quotes mark that value as text. The quotes are not printed.

Save the file with **Ctrl+S** (macOS: **Cmd+S**). Check that Explorer shows `practice.py`, not `practice.py.txt`. Then run it:

```bash
pwd                    # Confirm that you are in your week-1 folder.
ls                     # Check that practice.py is listed.
python3 practice.py    # Execute the saved file with Python.
```

The space separates the Python command from the filename. Python opens that file and runs its instructions from top to bottom.

```powershell
Get-Location            # Confirm that you are in your week-1 folder.
Get-ChildItem           # Check that practice.py is listed.
python .\practice.py    # Execute the file in the current directory.
```

In PowerShell, `.\` means “in the current directory”. Both examples should display `My first LIFE733 script` and then return to the prompt.

You can also choose **Run Python File in Terminal** from the editor's run menu. For now, practise typing the command so you know which file it runs. The [VS Code running guide](https://code.visualstudio.com/docs/python/run) shows the run button.

**Try it:** change the message, save the file, and run it again. If you still see the old message, check that you saved and ran the right file. Use the same cycle throughout the chapter: **edit → save → run → check**. Save your answers as `q1.py`, `q2.py`, and so on. Use that filename in the run command.

### Know which prompt is waiting for you

Bash prompts often end in `$`. PowerShell prompts often start with `PS`. Do not type the prompt itself. If you see `>>>`, you are in Python's interactive prompt, not the shell. Type `exit()` and press Enter to return to the shell before running a script command.

When a script asks a question with `input`, type your answer in the terminal and press Enter. The script is waiting for your response, so do not enter another command yet. Press **Ctrl+C** if you need to stop it.

Your first script displayed a fixed message. Next, you will store text in a variable and let the person running the script provide a value.

## Text, variables, and your first interaction

### Strings, assignment, and printing

Python stores text as a **string** (type `str`). A string can contain letters, digits, spaces, or punctuation. Use matching single or double quotes: `'ATGC'` and `"ATGC"` mean the same thing. In code, use straight quotes, not curly quotation marks.

```{code-cell} python
sample_name = "sample_01"  # Give a text value a descriptive name.
print(sample_name)         # Read the value associated with that name.
print("sample_name")       # Display these literal characters instead.
```

The first line is an **assignment**: Python stores the value on the right of `=` under the name on the left. `sample_name` is a **variable**. The next two lines print `sample_01` and `sample_name`. Without quotes, the name refers to the variable. With quotes, it is printed as literal text.

Variable names are case-sensitive: `dna` and `DNA` are different variables. Choose clear names such as `sample_name`. Do not use spaces or start a name with a digit. Assign a value before using a variable. One `=` stores a value in a variable.

### Ask for input and format a message

Put this example in `practice.py` and run it yourself:

```python
sample_name = input("Sample name: ")  # Wait for text and save the response.
print(f"Processing {sample_name}.")   # Insert that value into a message.
```

`input` displays the **prompt** inside its parentheses, then waits for you to press Enter. It returns what you typed as a string. Do not type quotes around your response. If you enter `sample_02`, the program displays `Processing sample_02.`

The `f` before the opening quote makes this an **f-string**. Python replaces `{sample_name}` with the variable's value. Without the `f`, Python would print the braces and name as written. Parentheses call a function, quotes mark text, and braces mark the value to insert.

The examples that use `input` appear in plain code blocks. Copy them into a `.py` file and run them in VS Code so you can type a response. The other examples show their output here.

### Question 1 — Hello, Python

Create `q1.py`. Ask for the user's name with the prompt `Enter your name: `. Store the response, then use an f-string to print a greeting on one line. If the user enters `Alex`, print `Hello, Alex!`.

Run the script twice with different names. Find the line that stores the response and the part that puts it in the greeting. Later, you can use this pattern to label results with sample names.

Now that you can collect and display text, you are ready to work with DNA strings. First, you will standardise their case and count their characters.

## Change case and measure a sequence

Store a DNA sequence as a string. Python treats it as text. It does not check whether the characters are valid DNA bases.

```{code-cell} python
dna = "gAtC"             # Keep the original mixed-case sequence.
upper_dna = dna.upper()   # Create an uppercase version.
lower_dna = dna.lower()   # Create a lowercase version.
print(upper_dna)
print(lower_dna)
print("Length:", len(dna))  # Count the characters in the original string.
print("Original:", dna)    # Show that the original value is unchanged.
```

The output is `GATC`, `gatc`, `Length: 4`, then `Original: gAtC`. A **method** is an operation that belongs to a value. In `dna.upper()`, the dot selects the string's `upper` method and `()` runs it. Without the parentheses, `dna.upper` does not convert the text.

Strings are **immutable**: a method cannot change the original string. Instead, `.upper()` and `.lower()` return new strings. Save the result in a variable, as above, or replace the old value with `dna = dna.upper()`.

`len(dna)` counts the characters and returns an integer. It counts spaces too, but does not check whether the sequence is valid. In `print("Length:", len(dna))`, the comma separates the label from the number. `print` puts a space between them.

**Try it:** put a space inside the sequence. Predict the new length, then run the code to check. Remove the space before continuing. In the next exercises, assume that DNA contains only A, C, G, and T, in either case.

### Question 2 — DNA Case & Length

Create `q2.py`. Ask user for one DNA sequence. Print its uppercase version, lowercase version, and length on separate lines. For input `aCgTtg`, the output should be:

```text
ACGTTG
acgttg
Length: 6
```

These lines are the expected output. Do not type them into your script. Test another sequence and count its bases by hand. Keep the original input in a variable. Notice that `.upper()` returns a new string and leaves that variable unchanged. In later weeks, consistent case will make comparisons and base counts easier.

Try the question first. Then watch the walkthrough and compare it with your solution.

<iframe title="Question 2 walkthrough: DNA case and length" width="560" height="315" src="https://www.youtube-nocookie.com/embed/qyeJIcrAj30" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Now you can inspect one sequence. Next, you will combine two strings to create a longer sequence.

## Join strings together

**Concatenation** joins strings end to end. The `+` operator does not add a space or separator.

```{code-cell} python
first = "ac"                 # First fragment, in its original case.
second = "Gta"               # Second fragment.
combined = (first + second).upper()  # Join first, then convert the result.
print(combined)
print("Length:", len(combined))
```

The result is `ACGTA`, with length `5`. The parentheses make `.upper()` apply to the joined string. If you wrote `first + second.upper()`, only `second` would change case, and `first` would stay `ac`. The original variables are unchanged.

**Try it:** swap the fragments. Predict the sequence and length, then run the code. The order changes the sequence, but not the total length.

### Question 3 — Concatenate Two Sequences

Create `q3.py`. Use `input` twice to ask for two sequences. Join them in the order entered, convert the result to uppercase, and print it with its length. Inputs `actg` and `tta` should give:

```text
ACTGTTA
Length: 7
```

There should be no space between the sequences. Try again with a one-base first fragment and a four-base second fragment. Later, you will join sequence lines read from a file.

Try the question first. Then watch the walkthrough and compare your code.

<iframe title="Question 3 walkthrough: concatenate two sequences" width="560" height="315" src="https://www.youtube-nocookie.com/embed/3htTsf2EQiE" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You have joined two strings. Next, you will use positions to select part of a string, then read it backwards.

## Select and reverse characters with slicing

Each character has a position called an **index**. Python starts counting at zero:

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

The outputs are `G`, `ATC`, `TCA`, and `ACTAG`. Square brackets select characters. One index selects one character. A **slice** selects a range. The form is `text[start:stop:step]`. Python includes `start`, stops before `stop`, and moves by `step`.

If you leave out `start`, Python begins at the start of the string. If you leave out `stop`, it continues to the end. The default step is `1`. In `[::-1]`, the step is `-1`, so Python reads the whole string backwards. By contrast, `dna[-1]` selects only the last character.

A slice that starts at index `2` skips the first two characters. This is useful for selecting a region or removing a known prefix. Check whether positions in your data start at zero or one. Python indices start at zero.

### Question 4 — Reverse Sequence

Create `q4.py`. Ask for a DNA sequence and print it backwards. Input `ACTG` should give `GTCA`. Reverse the order only. Do not swap the bases.

Also test `A`. Reversing one character leaves it unchanged. Explain what `-1` does in the slice. In Question 6, you will reverse the sequence and swap each base for its complement.

Try the question first, then watch the walkthrough to check your slice.

<iframe title="Question 4 walkthrough: reverse a sequence" width="560" height="315" src="https://www.youtube-nocookie.com/embed/rGS8ixk8uvQ" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Slicing lets you select or reverse characters without changing them. Next, you will replace particular characters and add a repeated string.

## Replace bases and add a repeated tail

The `replace` method returns a string with matching text changed. Here, replace `T` with `U` to make a simple DNA-to-RNA conversion. This example assumes the DNA sequence is already in the correct orientation. It demonstrates text processing. It does not model every step of transcription or RNA processing.

```{code-cell} python
dna = "GATT"                   # Use uppercase so T matches consistently.
rna = dna.replace("T", "U")    # Replace every T with U.
tail = "A" * 3                 # Repeat A three times for this demonstration.
rna_with_tail = rna + tail      # Append the tail without a space.
print("RNA:", rna)
print("With tail:", rna_with_tail)
print("Length:", len(rna_with_tail))
```

The output is `RNA: GAUU`, `With tail: GAUUAAA`, and `Length: 7`. In `.replace("T", "U")`, the first argument is what to find and the second is what to put in its place. The match is case-sensitive: lowercase `t` stays unchanged. Convert the DNA to uppercase first if needed.

When used with a string and an integer, `*` repeats the string. `"A" * 3` gives `"AAA"`. Adding it to the RNA adds three characters. Do not put spaces between bases: Python counts them as characters.

### Question 5 — RNA + polyA

Create `q5.py`. Ask for two fragments as you did in Question 3. Join them and convert the result to uppercase. Replace every `T` with `U`, add **exactly seven** `A` characters, then print the RNA and its total length. Each script runs on its own, so ask for the input again in `q5.py`.

For fragments `actg` and `tta`, the RNA before adding the tail is `ACUGUUA`. The final result is:

```text
ACUGUUAAAAAAAA
Length: 14
```

The RNA already ends in one `A`. Adding seven more gives eight `A`s at the end. There is no space before the tail. The length is `7 + 7 = 14`. Each step uses the result from the step before it. This is the start of a data-processing pipeline.

So far, each step has changed or measured text. In Question 6, you will combine several steps to make a reverse complement. The example introduces a loop and a dictionary, which you will study in more detail later.

## Read unfamiliar code: a guided bug hunt

Question 6 uses a loop and a dictionary, which you will study more later. For now, use this example to practise reading code one line at a time.

A **dictionary** pairs keys with values. Here, a DNA base can be a key and its complement the value. A **loop** repeats its indented instructions for each item in a sequence.

```{code-cell} python
labels = {"A": "adenine", "C": "cytosine"}  # Map keys to values.
for base in "AC":                           # Visit A, then C.
    print(labels.get(base, "unknown"))      # Look up each base's label.
```

The code prints `adenine`, then `cytosine`. In the dictionary, a colon separates each key from its value, and a comma separates the pairs. The loop assigns `"A"` to `base`, runs the indented `print`, then repeats with `"C"`. The colon starts the loop. The four spaces before `print` show that it belongs to the loop.

`labels.get(base, "unknown")` looks up the current key. If the key is missing, it returns `"unknown"`. Braces create a dictionary here. Inside an f-string, braces mark a value to insert.

### Question 6 — Fix the Reverse Complement (Bug Hunt)

Copy this program into `q6.py`. It swaps each base for its complement, but it does not yet reverse the sequence:

```python
dna = "ACTG"  # Test DNA; assume uppercase A, T, C, and G only.
comp = {"A": "T", "T": "A", "C": "G", "G": "C"}  # Base partners.
result = ""   # Start with an empty string to accumulate the answer.

for base in dna:  # Inspect the order in which this visits the bases.
    result = result + comp.get(base, "?")  # Append one complement.

print(result)  # Display the completed result after the loop.
```

`""` is an empty string. On each loop, Python looks up the current base's complement and adds it to `result`. The unindented `print` runs once, after the loop. The fallback `?` marks a character missing from the dictionary. It does not validate the DNA.

Run the program and note its output. Then change the loop so it visits the bases in reverse order. Check that it gives:

| Input DNA | Required reverse complement |
| --- | --- |
| `ACTG` | `CAGT` |
| `AATTCC` | `GGAATT` |

Keep the base-pair mapping as it is. A reverse complement does two things: it reverses the order and swaps each base for its partner. Later, you will use loops to process many records and dictionaries to map codons to amino acids.

The reverse-complement task used text throughout. The next question changes the type of input: you will turn text into a number so Python can do arithmetic.

## Convert numeric input before doing arithmetic

`input` always returns text, even when the user types digits. Python uses the value's type to decide what an operator means.

```{code-cell} python
text = "2.5"            # This value is text, despite containing digits.
print(text * 2)         # Repeating a string joins two copies.
value = float(text)     # Convert the text to a decimal-capable number.
print(value * 2)        # Numeric multiplication doubles the value.
```

The outputs are `2.52.5` and `5.0`. `text * 2` repeats the string. `value * 2` multiplies a number. `float(text)` converts numeric text to a decimal number and leaves `text` unchanged. Use `int` for a whole-number position: `int("4")` gives `4`. `int("3.5")` fails because `3.5` is not a whole number.

Use `str` to turn a value into text. For display, an f-string converts values for you. This is useful because you cannot join a string and a number with `+`. Later, you will learn how to choose the number of decimal places to display.

### Question 7 — Numeric Input (Type Casting)

Create `q7.py`. Ask `Enter a number: `, convert the response with `float`, and double it. Print the result on a line beginning `Result:`. Input `3.5` should give `Result: 7.0`. Also test `3` (`Result: 6.0`) and `-2` (`Result: -4.0`).

Why must you convert the input before multiplying? For now, assume the user enters a valid number. If they type `three`, Python raises a `ValueError`. Handling invalid input comes later. You will need numeric input for measurements, counts, and concentrations.

You have now worked with strings and numbers separately. In the final question, you will combine both: collect a DNA sequence and a numeric position, then use that position to select the message.

## Combine your skills in a small project

Question 8 brings together the skills from this chapter: collect input, select part of a sequence, change it, and report the result. Before you code, write down the values you need at each step. Clear variable names will help you spot where a result goes wrong.

### Question 8 — Mini Project: DNA Mystery Message

A colleague sends you a DNA sequence and a key that marks where a message begins. Write `q8.py` to extract and transform the message.

1. Ask for the DNA sequence. Keep the original input so you can print it later.
2. Ask for the key and convert it to an integer. The key is a **zero-based index**. A key of `4` skips four characters and starts at the fifth.
3. Make an uppercase copy. Use a slice to keep the sequence from the key to the end.
4. Replace every `T` in this shorter sequence with `U`.
5. Add **exactly ten** `A` characters to the RNA. Question 5 used seven.
6. Print the original input, trimmed RNA, RNA with its tail, and the final length.

For input `ATGCTTACGGTAC` and key `4`, expect:

```text
Original DNA: ATGCTTACGGTAC
Trimmed RNA: UUACGGUAC
Poly-A RNA: UUACGGUACAAAAAAAAAA
Length: 19
```

The original sequence has 13 characters. Removing the first four leaves nine. Adding ten gives a total length of 19. Check both the RNA letters and the length to catch mistakes.

For now, assume the DNA is valid and the key is from zero to the sequence length. Test a key of `0` to keep the whole sequence. Then use a key equal to the sequence length: the trimmed RNA will be empty, so the result will contain only the ten `A`s. Python allows negative keys and keys beyond the end, but do not use them in this exercise.

**Optional extensions:** try lowercase input. The output should preserve the original case in the report and use uppercase in the working copy. Then plan how you would reject invalid DNA letters and keys outside the allowed range. You will learn the decisions and loops needed for those checks in Weeks 2 and 3.

Once the script works, check the common errors below if you get stuck. They can help you find whether the problem is in your folder, command, or Python code.

## When a script does not work

When a script fails, read the last line of the error first. Then check the filename and line number it gives you.

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
| Script seems to pause | Look for an input prompt in the terminal. Type the requested data and press Enter. |

If you need help, share a small example, the input you tried, the output you expected, and the full error message. Say what you thought the code would do. This makes it easier to find the problem.

## Bring the week's ideas together

Look back at your eight scripts. Choose one line in each and explain what value it starts with, what the line does, and what value it produces. Change an input and predict the result before you run the script again. This will help you use the same ideas with new data.

In Week 2, you will make programs respond to input with decisions. In Week 3, you will use loops and collections to process groups of data. In Week 4, you will use functions and files to build reusable analyses. In Week 5, you will work with biological data formats. The string skills from this week will be useful throughout.

Now compare your answers with the [Week 1 solutions](../solutions.md#week-1). When you are ready, try the sequence-transformation section of [Project 1](../projects.md). The extended projects are optional. You can return to later sections as you learn more Python.
