---
kernelspec:
  name: python3
  display_name: Python 3
---

# Week 4: Functions and files

In Week 3, you used loops to repeat calculations across lists and DNA strings. This week, you will give useful pieces of code their own names as **functions**. You will also read data from files and save results, so your work can continue after a script finishes.

These two ideas fit together. A function can calculate a result for one sequence; a file can hold the sequence you want to analyse. By the end of the chapter, you will combine functions, loops, and decisions to produce reports from small datasets.

Keep VS Code open as you read. Run an example, change one input, and predict the result before running it again. For file exercises, inspect the output file as well as the terminal: a script can finish successfully without printing anything.

## Organise your Week 4 work

Create `week-4` inside `LIFE733`, alongside your earlier folders, and open it with **File → Open Folder** in VS Code. Use `practice.py` for examples and a separate file for each coding question. The text files below will be created as you reach their exercises; all sample data is provided in this chapter.

```text
LIFE733/
├── week-1/
├── week-2/
├── week-3/
└── week-4/             ← Open this folder in VS Code
    ├── practice.py    ← Try worked examples here
    ├── q1.py … q10.py ← Save your answers separately as needed
    ├── quotes.txt     ← Input for Question 4
    ├── dna.txt        ← Input for Question 6
    ├── words.txt      ← Input for Question 7
    ├── grades.txt     ← Input for Question 8
    ├── system.log     ← Input for Question 9
    └── mystery.txt    ← Input for Question 10
```

This is a folder diagram. Create each named file in Explorer; do not create a file literally named `q1.py … q10.py`. Question 5 is an explanation activity and does not require another script.

Run your scripts using the approach from earlier weeks. Relative filenames such as `"dna.txt"` refer to the terminal's current directory, which should be `week-4`. Opening a script in the editor does not necessarily change that directory. Check with `pwd` and `ls` if Python cannot find a file.

Keep input and output filenames distinct. The exercises create outputs such as `message.txt`, `report.txt`, `grade_summary.txt`, and `errors.txt` in this same folder. You will learn what happens when you rerun a script that writes to an existing file.

The introductory video gives an overview of functions and file handling. You can watch it now or return to it after trying the first examples.

<iframe title="Week 4 introduction: functions and file handling" width="560" height="315" src="https://www.youtube-nocookie.com/embed/7NSkR6r-pZw" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Start with a calculation you could write in one line. Putting it in a function will show how data enters a reusable block and how a result comes back.

## Give a calculation a name

### Define a function, then call it

A function is a named block of instructions. You define it once and **call** it whenever you want those instructions to run. Functions are useful across programming languages because they let you reuse an operation and improve it in one place.

```{code-cell} python
def double_volume(volume):           # Define a function with one input parameter.
    """Return twice the supplied volume."""
    return volume * 2                # Calculate a result and send it back.

answer = double_volume(2.5)          # Call the function with an argument.
print("Doubled volume:", answer)
print("Another result:", double_volume(4.0))  # Reuse it with a different value.
```

The outputs are `Doubled volume: 5.0` and `Another result: 8.0`. The definition begins with `def`, followed by a name, parentheses, and a colon. The indented lines belong to the function. Defining it makes it available; the body runs only when you call it.

`volume` is a **parameter**: the name used for incoming data inside the function. `2.5` is an **argument**: the actual value supplied in this call. The call gives `volume` that value, evaluates `volume * 2`, and returns the result. The assignment then stores it in `answer`.

The triple-quoted text immediately after the definition is a **docstring**. It describes the function's purpose. It is not printed when the function runs. Comments explain particular lines; the docstring explains what the function does overall.

**Try it:** call `double_volume(0)` and `double_volume(1.25)`. Predict `0` and `2.5`, then check. You can add calls without copying the function's body.

A useful result often needs to be stored or used in another calculation. That is why the function returns a value instead of only displaying it.

### Understand `return` and `print`

```{code-cell} python
def show_double(value):
    """Display twice the value."""
    print(value * 2)                 # Send text to the terminal.

def calculate_double(value):
    """Return twice the value for further use."""
    return value * 2                 # Send a value back to the calling code.

shown = show_double(3)               # Prints 6, but returns no explicit value.
calculated = calculate_double(3)     # Returns 6 without printing it.
print("Stored from show_double:", shown)
print("Stored from calculate_double:", calculated)
print("After adding one:", calculated + 1)
```

First, `show_double` prints `6`. The next lines show that `shown` is `None`, `calculated` is `6`, and adding one gives `7`. A function that reaches its end without a `return` value returns `None`, Python's marker for the absence of a value here. A function may deliberately only print or write a file, but a calculation should usually return its answer.

`return` also ends the current function call. Instructions placed after it in the same path do not run. Put a return outside a loop when you need the loop to finish processing every item before returning the result.

Names created inside a function, including its parameters, are **local** to that call. Use parameters to bring data in and `return` to send results out. For example, the calling code above uses `calculated`; it does not try to read the function's local name `value`.

**Try it:** change the argument from `3` to `5`. Then temporarily remove `return` from `calculate_double`, leaving just `value * 2`. Run the script and explain why the final addition now fails. Restore `return` afterward.

### Question 1 — Write Your First Function

Create `q1.py`. Define `triple_number(x)` to return three times its numeric argument. Call it with `4`, `0`, `-2`, and `1.5`; the returned values should be `12`, `0`, `-6`, and `4.5`.

Store at least one returned value in a variable and use it in a further calculation. Keep the output statements outside the function so you can explain which line calculates, which returns, and which displays. Try the question before watching its walkthrough.

<iframe title="Question 1 walkthrough: write your first function" width="560" height="315" src="https://www.youtube-nocookie.com/embed/9hoTmmzB4DY" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

A function can contain the loops and conditions you already know. Next, turn a sequence calculation into a function that works with different DNA inputs.

## Build a reusable sequence calculation

Before writing a function, state what it receives and what it returns. For a GC-content calculation, the input is a DNA string and the output is a percentage:

**GC percentage = 100 × (number of G bases + number of C bases) / sequence length.**

For this exercise, accept uppercase or lowercase A, C, G, and T. Require a nonempty sequence so the denominator cannot be zero. Here is a simpler helper that checks those rules and returns uppercase DNA:

```{code-cell} python
def normalise_dna(sequence):
    """Return uppercase DNA; reject empty input or unexpected characters."""
    sequence = sequence.upper()       # Work with consistent case inside the function.
    if sequence == "":
        raise ValueError("DNA must not be empty.")
    for base in sequence:
        if base not in "ACGT":        # Reject anything outside the allowed letters.
            raise ValueError("DNA must contain only A, C, G, and T.")
    return sequence                   # Return only after all characters pass.

print(normalise_dna("aTgc"))           # A valid example produces ATGC.
```

`base not in "ACGT"` checks whether the character is absent from the allowed letters. `raise ValueError(...)` stops the function and reports why its input cannot be used. This is the same kind of error you saw when numeric conversion failed in Week 2, but here you supply the message yourself. We will allow these errors to stop the script rather than add exception handling yet.

The local assignment to `sequence` does not change a string variable in the calling code. The function returns the new value for the caller to use.

**Try it:** run the function separately with `"ATNX"` and `""`. Read the error message in each case. Then restore a valid input before continuing.

### Question 2 — GC Content

Create `q2.py`. Define `gc_content(seq)` to return a percentage, using the formula above. Give it one parameter, `seq`. The original worksheet's heading mentions multiple arguments, but this particular function needs only one.

Normalise case and reject empty or invalid DNA. You can place these checks inside `gc_content`, or copy `normalise_dna` above it in the same file and call that helper. To count bases, use a loop or the string method `seq.count("G")`, which returns the number of occurrences of `G`. Add the G and C counts before dividing.

Check `ATGC` → `50.0`, `GGCC` → `100.0`, `ATAT` → `0.0`, and `aGc` → approximately `66.6667`. Keep the full numeric result in the function; format it to two decimal places when printing with an f-string. Empty input and `ATNX` should raise a clear `ValueError`. Then compare your calculation with the walkthrough; this version also makes the input checks explicit.

<iframe title="Question 2 walkthrough: GC content function" width="560" height="315" src="https://www.youtube-nocookie.com/embed/R2GyHuk_of8" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You now have a function that returns a result. Next, give a function two inputs and use them to save text outside the program.

## Write a message to a file

### Supply more than one argument

Separate parameters with commas when a function needs more than one input:

```{code-cell} python
def labelled_length(label, sequence):
    """Return a short description of one sequence."""
    return f"{label}: {len(sequence)} bases"  # Combine both supplied values.

summary = labelled_length("sample_A", "ATGC")  # Arguments match parameters in order.
print(summary)
```

The result is `sample_A: 4 bases`. The first argument becomes `label` and the second becomes `sequence`. Choose names that make the purpose of each input clear. **Try it:** supply a different label and a six-base sequence, then predict the new message.

A saving function also needs two inputs: the text to save and the filename to use. First, try the file-writing steps directly in `practice.py`:

```python
message = "Sample preparation complete.\n"  # End the message with a newline.
with open("practice_message.txt", "w", encoding="utf-8") as handle:
    handle.write(message)                  # Write the string to the open file.
print("Saved practice_message.txt")         # This runs after the file is closed.
```

`open` takes a path and a mode. `"w"` means write: create the file if it does not exist, or replace its contents if it does. `encoding="utf-8"` specifies how text is stored. This is a **keyword argument**, supplied by name rather than only by position.

`with ... as handle:` gives the open file a name within the indented block. Python closes it when the block ends, even if a problem interrupts the block. `.write(message)` writes the text but does not add a newline automatically. The `\n` in the string supplies that newline; it is one character representing a line break.

**Try it:** run the script and open `practice_message.txt` in VS Code. Change the message and rerun. The new text should replace the old text. Keep this output separate from any input you want to preserve.

### Question 3 — Writing to a File

Create `q3.py`. Define `save_message(msg, filename)` to write the supplied string to the supplied file using `with open(...)`. Let the caller decide whether the message ends with `\n`; the function should save the text exactly as provided.

Call it once with `"Hello from Week 4.\n"` and `"message.txt"`, then with a different message and `"second_message.txt"`. Open both files to check their contents. This function performs an action and does not need to return a calculated value. Rerunning it for the same filename should replace that file's contents. Watch the walkthrough after your attempt.

<iframe title="Question 3 walkthrough: writing to a file" width="560" height="315" src="https://www.youtube-nocookie.com/embed/roOG_A93cyQ" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You have saved text. Reading it back will let your scripts work with data prepared separately from the code.

## Read a file one line at a time

Create `quotes.txt` in the same folder and paste in these three practice sentences, one per line:

```text
Small steps make progress.
Check one example at a time.
Keep asking why the result changed.
```

Save it as plain text. These sentences are sample input, so they need neither Python quotes nor commas. Now try:

```python
with open("quotes.txt", "r", encoding="utf-8") as handle:
    for line in handle:          # Visit each line in order.
        text = line.rstrip("\n") # Remove the line-ending newline.
        print(text)              # print supplies its own newline.
```

`"r"` means read. A loop over the file gives you one line at a time, usually including its newline. Removing that newline avoids an extra blank line when `print` adds its own. `.rstrip("\n")` removes newline characters from the end; `.strip()` would also remove spaces at both ends. Choose according to whether those spaces matter.

A missing filename raises `FileNotFoundError`. Check its spelling and the terminal's current directory. Python uses the directory from which you run the script, not automatically the folder containing the script.

**Try it:** add a fourth sentence to the file without editing the Python loop. Rerun and confirm that the extra line appears. Then restore the three-line sample for the next check.

### Question 4 — Number the Quotes

Create `q4.py`. Define `read_quotes(filename)` to open a text file and print each line with a number starting at one. Use a counter initialised before the loop and increase it after printing each line.

With the sample file, the first output should be `1: Small steps make progress.` and the last `3: Keep asking why the result changed.`. Number every physical line, including a blank line if one is present. An empty file should print nothing. Call your function with `"quotes.txt"`, then compare with the walkthrough.

<iframe title="Question 4 walkthrough: reading and numbering file lines" width="560" height="315" src="https://www.youtube-nocookie.com/embed/0CKYPzSQLRc" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You have now written functions that calculate, save, and display. Before combining them into a larger task, practise explaining how one of them works.

### Question 5 — Optional Explanation Practice

Choose a short function of about five to ten lines. First explain its inputs, processing, result, and any assumptions in your own words. Then ask a partner or an AI tool to explain a copy with the comments removed. Keep the annotated original in your project.

Compare the explanations and check any disputed point by running a small example. Did the explanation distinguish printing from returning? Did it describe empty input correctly? If it feels too easy, ask for a harder question that combines functions with lists or loops from earlier weeks. For solo practice, trace two different calls on paper and check your predictions in VS Code.

Next, put those skills together: read a DNA sequence, calculate a result with a function, and save a report that someone else can inspect.

## Combine reading, calculation, and writing

### Question 6 — DNA File Analyser

Create `dna.txt` with the following content. It holds one DNA sequence split across lines; it has no FASTA header or other metadata:

```text
ATGC
GGAA
```

Create `q6.py`. Copy your tested `gc_content` function into it, together with any helper it calls. Separate scripts do not automatically share their functions. Define these helpers before the code that calls them.

Then define `analyse_dna_file(filename)` to:

1. Read the file, strip whitespace from the ends of each line, and join the lines into one sequence. Ignore blank lines.
2. Calculate the sequence length and call `gc_content` to obtain the percentage.
3. Write both results to a new file named `report.txt` using write mode.

You can start with an empty string and concatenate each cleaned line, as you did when building a message in Week 3. Do all input checks and calculations before opening the output file. If the DNA is invalid, the function should fail without replacing an existing report.

For the sample, `report.txt` should contain:

```text
Length: 8
GC content: 50.00%
```

Test lowercase DNA, blank lines between sequence lines, an empty file, and an unexpected character such as `N`. The first two should work; the latter two should raise the validation errors from your GC function. A FASTA header beginning with `>` is also invalid for this plain-sequence format. You will handle FASTA explicitly in Week 5.

This function writes a report rather than returning a value. Call it with `"dna.txt"` and inspect the output file. The walkthrough follows the original exercise; use the checks above to strengthen your version.

<iframe title="Question 6 walkthrough: DNA file analyser" width="560" height="315" src="https://www.youtube-nocookie.com/embed/-Aty0lYQltM" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

That report summarised one sequence. The next tasks need to remember a separate result for each word or name. A dictionary provides that kind of lookup. We will use a few basic operations here and explore dictionaries further in Week 5.

## Keep a count for each word

### A short introduction to dictionaries

A list selects items by position. A **dictionary** associates a key with a value, such as a word with its count. Curly braces create it:

```{code-cell} python
counts = {}                       # Start with an empty dictionary.
counts["sample"] = 1              # Add a key and its value.
counts["sample"] = counts["sample"] + 1  # Update the value for an existing key.
print(counts)
print("Missing word:", counts.get("tube", 0))  # Use zero when the key is absent.
```

The dictionary is `{'sample': 2}`. `counts["sample"]` retrieves the stored value for that key. Reading a missing key with square brackets would raise `KeyError`. `.get("tube", 0)` instead returns the default zero. It does not add the missing key to the dictionary.

This makes counting straightforward: retrieve the old count or zero, add one, and save it back under the same key.

```{code-cell} python
text = "Red blue red"              # Small input to check by eye.
counts = {}
for word in text.lower().split():  # Lowercase, then split on whitespace.
    counts[word] = counts.get(word, 0) + 1  # Add one occurrence of this word.
print(counts)
```

The result is `{'red': 2, 'blue': 1}`. `.split()` without an argument separates text at whitespace and returns a list of words. Repeated spaces do not create empty words. It does not remove punctuation: `red` and `red,` are different keys under this simple rule.

**Try it:** add another `BLUE` and a `red,` to the text. Predict the counts before running. Keep the punctuation rule in mind when interpreting results.

### Question 7 — Word Counter

Create `words.txt` with this short synthetic sample:

```text
red blue red
green blue red
```

In `q7.py`, define `count_words(filename)` to read the file and return a dictionary of word counts. Lowercase the text and split on whitespace, retaining punctuation as part of a word. You may loop over file lines and then over the words in each line. For this sample, expect red: 3, blue: 2, green: 1.

Outside the function, display up to ten words in descending count order. To see how to order dictionary keys by their values, try this small example:

```{code-cell} python
counts = {"red": 3, "blue": 2, "green": 1}  # Demonstration dictionary.
ordered_words = sorted(counts, key=counts.get, reverse=True)  # Largest counts first.
for word in ordered_words[:10]:             # At most ten keys.
    print(word, counts[word])               # Look up the count for each key.
```

`sorted` returns a new list. Here it takes dictionary keys and uses `counts.get` to look up the value used for ordering. There are no parentheses after `counts.get` because you pass the method for `sorted` to call. `reverse=True` puts larger counts first. Equal counts retain the words' first-appearance order, so tied results are predictable. The slice `[:10]` works even when fewer than ten words exist.

Test an empty file too: the function should return `{}` and the display loop should print no rows. The walkthrough demonstrates the original word-counting task; use the sample and rules above for your checks.

<iframe title="Question 7 walkthrough: word counter" width="560" height="315" src="https://www.youtube-nocookie.com/embed/9m9zz61dDxw" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

You have used dictionary keys to remember words. The same structure can associate each student name with a score, then help you write a summary of the whole group.

## Summarise a small gradebook

### Question 8 — Student Gradebook

Create `grades.txt` with these fictional records and no header line:

```text
Alex,60
Blair,80
Casey,70
Drew,90
```

Each line contains a unique name, a comma, and a score between 0 and 100. Assume names contain no commas. The scores may have decimals. In `q8.py`, read the records into a dictionary that maps names to numeric scores.

Here is the parsing step for one record:

```{code-cell} python
line = "Alex,60"                    # One record from the sample format.
name, score_text = line.split(",")  # Split into exactly two pieces and unpack them.
name = name.strip()                 # Remove spaces around the name.
score = float(score_text)           # Convert numeric text for calculations.
grades = {name: score}              # Use the variable's value as the key.
print(grades)
```

`.split(",")` returns two strings for this format. Assigning them to two names is called **unpacking**; Python expects exactly two pieces here. A missing or extra comma causes a `ValueError`, helping you spot a malformed record. In `{name: score}`, the names are variables; quotes around `name` would instead create a key literally called `name`.

Build the full script in stages:

1. Skip blank lines. Split each remaining line and convert the score.
2. Reject an empty name, a score outside 0–100, or a duplicate name with a clear `ValueError`. Duplicate keys otherwise replace earlier values silently.
3. Store each valid name and score in the dictionary.
4. Obtain the scores with `list(grades.values())`. Use them to calculate mean, minimum, and maximum. You may use `sum`, which adds the values, along with `len`, `min`, and `max`.
5. Write `grade_summary.txt` with those statistics and the names and scores of students strictly above the mean.

Loop over `grades.items()` to visit name–score pairs: `for name, score in grades.items():` unpacks one pair on each iteration. Validate all input before opening the output file. If no records remain after skipping blank lines, write `No grades to summarise.` instead of calculating statistics.

For the sample, expect mean `75.00`, minimum `60.00`, maximum `90.00`, and Blair and Drew above the mean. List those names in input order. Test one student, an empty file, a duplicate name, and scores outside the allowed range. A student exactly at the mean should not appear in the above-mean list.

Your gradebook reads structured lines and writes a new summary. Sometimes you only need to keep selected lines exactly as they appeared. That is the purpose of a file filter.

## Copy only the lines you need

### Question 9 — Log File Filter

Create `system.log` with:

```text
INFO Run started
ERROR Sensor unavailable
INFO Retrying
ERROR Timeout
INFO Run finished
```

In `q9.py`, define `extract_errors(filename, outname)` to copy every line containing the uppercase text `ERROR` into a new file. Use `if "ERROR" in line:` to test the whole line. Keep the original line, including its newline, when writing it. The match is case-sensitive and may occur anywhere in the line.

The function needs both files open at once. You can put one `with open(...)` block inside another: open the input in read mode, then the output in write mode, and put the loop inside both blocks. Pass different paths for input and output so you preserve the original log.

Start a counter before the loop, increase it for each copied line, and return the count after the loop finishes. Call `extract_errors("system.log", "errors.txt")` and print the returned count. For the sample, expect two matching lines in `errors.txt` and a count of `2`.

Test a file with no matches and an empty file. Both should produce an empty output file and return zero. Test lowercase `error` as well: it should not match this rule. Rerunning the script should replace the output instead of duplicating its lines.

You have now combined most of this week's ideas. The final task asks you to recognise them in a function with names that offer very little help.

## Explain a mystery function

### Question 10 — Mystery Script Revisited

Create `mystery.txt` containing:

```text
red blue red
Red blue
```

Copy this script into `q10.py`. Its structure follows the original worksheet; the comments identify Python operations without giving away the complete explanation.

```python
def m(file):
    with open(file, "r", encoding="utf-8") as f:
        lines = f.readlines()          # Read the lines into a list.
    d = {}                             # Start an empty dictionary.
    for line in lines:
        for w in line.strip().split(): # Visit words within each line.
            d[w] = d.get(w, 0) + 1     # Update the value associated with this key.
    return d                           # Return after all lines are processed.

print(m("mystery.txt"))                # Call the function and display its result.
```

Predict the returned dictionary before running the script. Compare this code with your Question 7 function. Does it normalise case? Does it remove punctuation? Why is `return d` outside both loops? What changes if the file is empty?

Then rename `m`, `file`, `f`, `d`, and `w` to explain their purposes and add a docstring. Check that the results are unchanged. You may compare explanations with a partner or an AI tool after making your own attempt. For an extra challenge, swap a short function with a classmate and explain its inputs, processing, and output.

You have moved from calculating one value to reading and summarising files. Before moving on, use the checks below to resolve problems with paths, types, and where a function returns.

## When a function or file operation does not work

| Symptom | What to check |
| --- | --- |
| Nothing happens after defining a function | Add a call below its definition; defining it does not run its body. |
| A result is `None` | Check that the function returns the value rather than only printing it. |
| Only the first item is processed | A `return` may be indented inside a loop and ending the call too soon. |
| `NameError` for a local variable | Use a parameter to pass data in or return a result for the calling code to store. |
| `TypeError` about arguments | Count the parameters and arguments, and check their order and types. |
| `FileNotFoundError` | Check the filename, saved extension, and terminal directory using `pwd` and `ls`. |
| An output file replaces old content | Write mode `"w"` replaces contents each time; use a separate output path. |
| Blank lines appear between printed lines | The file line may already contain a newline; remove it before using `print`. |
| `KeyError` during counting | Use `.get(key, 0)` when a key might not exist yet. |
| `ValueError` when reading a grade record | Check comma placement, numeric scores, validation rules, and duplicate names. |
| Empty data causes a summary to fail | Check for no values before dividing or using `min` or `max`. |

Test a function first with a small value you can check by hand. For file tasks, open the input and output in VS Code and compare them. Keep the calculation separate from the display so you can test what is returned as well as what is printed.

## Bring the week's ideas together

Choose one function and explain its parameters, return value or file-writing action, and input assumptions. Then run it twice with different data. Can the calling code use its result without changing the function?

Compare your work with the [Week 4 solutions](../solutions.md#week-4). The sample files and answers are small enough to inspect line by line; use them to check your approach before trying larger data. You can also return to [the optional projects](../projects.md) and organise repeated calculations into functions.

In Week 5, you will develop the dictionary and module ideas introduced here and work with biological file formats such as FASTA. Reading a file, checking its contents, and returning a useful result will remain the core steps.
