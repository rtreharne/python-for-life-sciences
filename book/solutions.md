---
kernelspec:
  name: python3
  display_name: Python 3
---

# Solutions and worked answers

Try the activity first, then use these examples to compare the approach and output. These are learning references: trace each line and test a changed input before relying on a solution.

## Week 1

These scripts correspond to Questions 1–8 in the [Week 1 chapter](chapters/week-1.md). Save each interactive answer in its own `.py` file and run it in your VS Code terminal. Input prompts wait for your response, so these blocks are intended to run on your computer. Compare the approach with your attempt and test a second input before moving on.

### Question 1 — Hello, Python

```python
name = input("Enter your name: ")  # Save the user's response as text.
print(f"Hello, {name}!")           # Insert that text into the greeting.
```

`input` returns a string. Assignment associates it with `name`, and the f-string inserts its value between `Hello, ` and `!`. Entering `Alex` produces `Hello, Alex!`.

### Question 2 — DNA Case & Length

```python
dna = input("Enter a DNA sequence: ")  # Preserve the entered sequence.
upper_dna = dna.upper()                # Create an uppercase copy.
lower_dna = dna.lower()                # Create a lowercase copy.
print(upper_dna)
print(lower_dna)
print("Length:", len(dna))             # Count all characters in the input.
```

The method calls return new strings, so `dna` retains its original case. `len` returns the character count, and the comma in `print` separates the label from that number. Input `aCgTtg` gives `ACGTTG`, `acgttg`, and `Length: 6` on separate lines.

### Question 3 — Concatenate Two Sequences

```python
seq1 = input("Enter seq1: ")     # Collect the first fragment.
seq2 = input("Enter seq2: ")     # Collect the second fragment.
dna = (seq1 + seq2).upper()      # Join in order, then uppercase both.
print(dna)
print("Length:", len(dna))      # Measure the joined sequence.
```

Parentheses ensure the method applies to the complete concatenation. No space is inserted by `+`. Inputs `actg` and `tta` give `ACTGTTA` and `Length: 7`.

### Question 4 — Reverse Sequence

```python
dna = input("Enter a DNA sequence: ")  # Collect text to reverse.
reversed_dna = dna[::-1]                # Traverse the entire string backwards.
print(reversed_dna)
```

The slice's step is `-1`. Its omitted endpoints select the full string in that direction. Input `ACTG` produces `GTCA`; no base substitution is performed.

### Question 5 — RNA + polyA

```python
seq1 = input("Enter seq1: ")      # Each script collects its own input.
seq2 = input("Enter seq2: ")
dna = (seq1 + seq2).upper()       # Normalise before matching uppercase T.
rna = dna.replace("T", "U")      # Return RNA with every T replaced.
rna_with_tail = rna + "A" * 7    # Append exactly seven additional As.
print(rna_with_tail)
print("Length:", len(rna_with_tail))
```

String repetition constructs the tail and concatenation appends it. For `actg` and `tta`, the result is `ACUGUUAAAAAAAA`, with length 14. One terminal A belongs to the original RNA and seven belong to the added tail.

### Question 6 — Fix the Reverse Complement

```{code-cell} python
dna = "ACTG"  # Change this to AATTCC for the second acceptance check.
comp = {"A": "T", "T": "A", "C": "G", "G": "C"}  # Base partners.
result = ""   # Accumulate the output from an empty string.

for base in dna[::-1]:  # Visit the original bases from right to left.
    result = result + comp.get(base, "?")  # Append each base's complement.

print(result)  # Print once, after all bases have been processed.
```

The repair is to iterate over `dna[::-1]`. For `ACTG`, the loop visits `G`, `T`, `C`, `A`, whose complements are `C`, `A`, `G`, `T`. Thus the result is `CAGT`. Changing the test sequence to `AATTCC` gives `GGAATT`. The dictionary describes pairing; the slice determines visiting order. Neither operation alone performs both jobs.

### Question 7 — Numeric Input

```python
text = input("Enter a number: ")  # Input is always text initially.
value = float(text)               # Convert suitable text into a number.
result = value * 2                # Multiply numerically, rather than repeat text.
print("Result:", result)
```

For `3.5`, the output is `Result: 7.0`. For `3`, it is `Result: 6.0`; for `-2`, it is `Result: -4.0`. Conversion determines which meaning of `*` applies. These examples assume valid numeric input.

### Question 8 — DNA Mystery Message

```python
original_dna = input("Enter DNA sequence: ")  # Preserve exactly what was entered.
key_text = input("Enter key number: ")       # Read the position as text.
key = int(key_text)                          # Convert to a whole-number index.

dna = original_dna.upper()             # Normalise a separate working copy.
trimmed_dna = dna[key:]                # Keep the key position through the end.
trimmed_rna = trimmed_dna.replace("T", "U")  # Convert the selected region.
poly_a_rna = trimmed_rna + "A" * 10    # This question requires ten added As.

print("Original DNA:", original_dna)
print("Trimmed RNA:", trimmed_rna)
print("Poly-A RNA:", poly_a_rna)
print("Length:", len(poly_a_rna))      # Include the tail in the reported length.
```

The integer key uses zero-based indexing. For `ATGCTTACGGTAC` and key `4`, the trimmed DNA is `TTACGGTAC`, the trimmed RNA is `UUACGGUAC`, and the final RNA is `UUACGGUACAAAAAAAAAA`. Its length is **19**: nine selected bases plus ten added As. The original worksheet's displayed trimmed RNA and total length were inconsistent with these operations; the values here follow the code.

Lowercase input works because the working copy is uppercased before replacement. The original report preserves the entered case. A key of zero keeps the full sequence; a key equal to the sequence length leaves only the ten-base tail. This version assumes valid DNA and a key within that range. For the extension, plan checks that every character is an allowed base and that the integer key lies between zero and the sequence length, then implement those checks as you learn decisions and loops.


## Week 2

These answers match the eight questions in [Week 2](chapters/week-2.md). Try each question first, then compare how your script collects input, calculates values, and chooses its output. Save the interactive examples in your own `week-2` folder and run them in the VS Code terminal.

### Question 1 — Simple Calculator

```python
first = float(input("Enter first number: "))    # Convert the first response.
second = float(input("Enter second number: "))  # Convert the second response.
print("Sum:", first + second)
print("Difference:", first - second)  # Keep the order in which numbers were entered.
print("Product:", first * second)
print("Quotient:", first / second)   # Initially assume second is nonzero.
```

The inner `input` call returns text, and the outer `float` call converts it before assignment. Inputs `10` and `4` give `14.0`, `6.0`, `40.0`, and `2.5`. Inputs `7.5` and `2.5` give `10.0`, `5.0`, `18.75`, and `3.0`.

After learning conditionals, replace the final line with this check. It belongs after the other calculations in the same script:

```python
if second == 0:                     # Compare the divisor with zero first.
    print("Cannot divide by zero.")
else:
    print("Quotient:", first / second)  # Only divide when second is nonzero.
```

The colon and indentation mark each branch. For inputs `10` and `0`, the sum, difference, and product still print, followed by the message instead of a division error.

### Question 2 — Temperature Converter

```python
celsius = float(input("Enter temperature in Celsius: "))  # Allow decimals.
fahrenheit = celsius * 9 / 5 + 32                          # Apply the formula.
print(f"Fahrenheit: {fahrenheit:.1f}")                     # Show one decimal place.
```

Multiplication and division happen before adding 32. Inside the f-string, `.1f` formats the result with one decimal place. Inputs `20`, `0`, and `-40` give `68.0`, `32.0`, and `-40.0` respectively.

### Question 3 — Even or Odd?

```python
number = int(input("Enter a number: "))  # Request a whole number.
if number % 2 == 0:                      # Zero remainder means even.
    print(f"{number} is even")
else:
    print(f"{number} is odd")
```

`%` finds the remainder; `== 0` turns that result into a Boolean comparison. The `if` and `else` branches cover the two possibilities. Inputs `8` and `0` are even; `7` is odd.

### Question 4 — Grade Classifier

```python
mark = float(input("Enter mark: "))  # Allow decimal marks.
if mark < 0:                         # Reject values below the allowed range.
    print("Invalid mark")
elif mark > 100:                     # Reject values above the allowed range.
    print("Invalid mark")
elif mark >= 70:                     # Check the highest valid band first.
    print("Grade: Distinction")
elif mark >= 60:
    print("Grade: Merit")
elif mark >= 50:
    print("Grade: Pass")
else:                               # Valid marks below 50 reach this branch.
    print("Grade: Fail")
```

Only the first matching branch runs. That makes `69.9` a Merit and `70` a Distinction. Check `0`, `49.9`, `50`, `59.9`, `60`, `69.9`, `70`, and `100`, plus invalid values `-1` and `101`. Once you have learned `or`, the first two branches can be combined into one condition, `mark < 0 or mark > 100`.

### Question 5 — Boolean Logic

```python
id_answer = input("Has ID card? ").strip().lower()    # Normalise the first response.
coat_answer = input("Has lab coat? ").strip().lower()  # Normalise the second.
has_id = id_answer == "yes"           # Store Boolean comparison results.
has_coat = coat_answer == "yes"
if has_id and has_coat:               # Both confirmations are required.
    print("Access granted.")
else:
    print("Access denied.")
```

The methods run on the string returned by `input`. `and` requires both comparisons to be true. Only yes/yes grants access; yes/no, no/yes, and no/no deny it. Input such as ` YES ` also counts as yes. Any other response counts as no under this exercise's rule.

### Question 6 — Faulty Conditional

```python
num = float(input("Enter a number: "))  # Convert text before comparing it.
if num > 0:
    print("Positive")
elif num == 0:                          # Use comparison, not assignment.
    print("Zero")
else:                                  # End the header with a colon.
    print("Negative")
```

The original script needed three repairs: numeric conversion, `==` in the equality test, and a colon after `else`. Test `7`, `0`, `-3`, and a decimal such as `-0.5`. Python checks syntax first, so the type problem becomes visible only after the syntax errors are fixed.

### Question 7 — Leap Year Checker

```python
year = int(input("Enter a year: "))  # Assume a positive Gregorian year.
divisible_by_4 = year % 4 == 0       # Calculate each part of the rule.
divisible_by_100 = year % 100 == 0
divisible_by_400 = year % 400 == 0
is_leap_year = (divisible_by_4 and not divisible_by_100) or divisible_by_400
if is_leap_year:                      # Use the combined Boolean directly.
    print("Leap year!")
else:
    print("Not a leap year.")
```

The parenthesised rule accepts multiples of four that are not centuries. The `or` also accepts multiples of 400. Thus `1900` and `2023` are not leap years; `2000` and `2020` are leap years.

### Question 8 — Lab Equipment Monitor

```python
temperature = float(input("Enter temperature: "))  # Read both measurements.
ph = float(input("Enter pH: "))
temperature_ok = temperature >= 36 and temperature <= 38  # Include both limits.
ph_ok = ph >= 6.8 and ph <= 7.2                            # Include both limits.
if temperature_ok and ph_ok:               # Both ranges must be satisfied.
    print("Incubator status: SAFE")
else:
    print("Incubator status: UNSAFE")

# Extension: independent checks can print both warnings.
if not temperature_ok:
    print("Warning: temperature is outside 36–38 °C.")
if not ph_ok:
    print("Warning: pH is outside 6.8–7.2.")
```

`>=` and `<=` include the endpoints. Each named Boolean records one range check. The first decision produces one status, and the two independent warning checks may produce zero, one, or two messages. For `39` and `7.4`, the status is `UNSAFE` and both warnings appear. Using `elif` for the second warning would hide it whenever the temperature warning had already matched.

For `37` and `7.0`, the status is `SAFE` with no warnings. Test all endpoint pairs `(36, 6.8)`, `(36, 7.2)`, `(38, 6.8)`, and `(38, 7.2)`; each is safe under the exercise's rules. Then change one value at a time to just outside its range.


## Week 3

These answers match the original ten questions in [Week 3](chapters/week-3.md), followed by the optional sensor summary. Try each task before reading its answer. Save interactive scripts in your `week-3` folder and run them in the VS Code terminal. Change the test data and trace the loop as well as checking its final output.

### Question 1 — Sum a List

```{code-cell} python
numbers = [3, 7, 2, 9, 5]
total = 0                      # Initialise once, before the loop.
for number in numbers:
    total += number            # Add the current item to the running total.
print("Total:", total)         # Report once, after all items have been added.
```

The total passes through `3`, `10`, `12`, `21`, and `26`. Moving the initialisation inside the loop would erase earlier additions. An empty list would leave the total at zero because the loop would run zero times.

### Question 2 — Average of Numbers

```{code-cell} python
numbers = [3, 7, 2, 9, 5]
total = 0
for number in numbers:
    total += number               # Complete the sum before calculating the mean.
print("Total:", total)
if len(numbers) > 0:              # Avoid division by zero for an empty list.
    mean = total / len(numbers)
    print("Mean:", mean)
else:
    print("No numbers to average.")
```

The total is `26` and the mean is `26 / 5`, or `5.2`. The condition is outside the loop, so it checks the completed collection once. For `[8]`, the mean is `8.0`; for `[]`, the total is zero and the script prints the no-numbers message.

### Question 3 — Find the Maximum

```python
numbers = []                            # Build the list from the responses.
for position in range(1, 6):             # Ask five times: 1 through 5.
    number = float(input(f"Number {position}: "))  # Convert before storing.
    numbers.append(number)
print("Largest:", max(numbers))          # All five items are available now.
```

`range(1, 6)` stops before 6. After the loop, the list contains five numeric values, so `max` has a nonempty collection to inspect. Inputs `2`, `9`, `4`, `1`, `7` give `Largest: 9.0`. Inputs `-8`, `-3`, `-12`, `-5`, `-9` give `Largest: -3.0`.

To practise finding a maximum yourself, replace the final line with the following code in the same script:

```python
largest = numbers[0]            # Start with a real item, which may be negative.
for number in numbers[1:]:      # Compare each remaining value.
    if number > largest:
        largest = number       # Keep the largest value found so far.
print("Largest:", largest)
```

Using the first item avoids incorrectly reporting zero for a list of negative numbers. This version assumes the list is nonempty, as guaranteed by the five-input task. The slice starts at index 1 because the first item has already been used.

### Question 4 — Even or Odd

```python
for position in range(1, 6):                   # Process five responses.
    number = int(input(f"Integer {position}: "))  # Request a whole number.
    if number % 2 == 0:                        # Test the current response.
        print(f"{number} is even")
    else:
        print(f"{number} is odd")
```

The decision sits inside the loop, so each response gets a message immediately. Inputs `7`, `8`, `0`, `-3`, and `-2` produce odd, even, even, odd, and even respectively. A list is unnecessary when you do not need the responses after classifying them.

### Question 5 — DNA Base Count

```python
dna = input("Enter DNA: ").upper()  # Normalise before comparing letters.
count_a = 0                        # Initialise every counter before the loop.
count_t = 0
count_c = 0
count_g = 0
unexpected = 0
for base in dna:
    if base == "A":
        count_a += 1               # Increase only the matching counter.
    elif base == "T":
        count_t += 1
    elif base == "C":
        count_c += 1
    elif base == "G":
        count_g += 1
    else:
        unexpected += 1            # Account for every other character.
print("A:", count_a)
print("T:", count_t)
print("C:", count_c)
print("G:", count_g)
print("Unexpected:", unexpected)
```

For `aCgTtG`, the counts are A: 1, T: 2, C: 1, G: 2, Unexpected: 0. For `ATNX`, they are 1, 1, 0, 0, and 2. Every character enters exactly one branch, so the five counts add up to the input length. Empty input leaves every counter at zero. This version counts unexpected characters rather than silently discarding them.

### Question 6 — Reverse a List

```{code-cell} python
words = ["cat", "dog", "rabbit", "tiger"]
for index in range(len(words) - 1, -1, -1):  # Visit the last index down to zero.
    print(words[index])                     # Print each whole word.
print("Original:", words)                   # Confirm that the list was not changed.
```

The indices are `3`, `2`, `1`, and `0`, giving tiger, rabbit, dog, cat. The `-1` stop is excluded. With an empty list, the range is empty too and no word is selected. Looping over `words[::-1]` is another valid answer: it visits a reversed copy of the list.

### Question 7 — Multiplication Table

```python
number = int(input("Enter a number: "))  # Keep one input for the whole table.
for multiplier in range(1, 11):           # Include 1 through 10.
    product = number * multiplier        # Calculate a new product on each pass.
    print(f"{number} x {multiplier} = {product}")
```

For `5`, this prints ten rows from `5 x 1 = 5` to `5 x 10 = 50`. The stop is 11 because `range` excludes it. Zero and negative integers also work; the number of rows remains ten.

### Question 8 — Guess the Number

```python
import random                       # Use Python's standard random-number module.
target = random.randint(1, 20)       # Choose once, including either endpoint.
while True:                         # Keep asking until the correct guess breaks out.
    guess = int(input("Guess 1–20: "))
    if guess < target:
        print("Too low")
    elif guess > target:
        print("Too high")
    else:
        print("Correct")
        break                       # Exit the loop as soon as the guess matches.
```

The target is set outside the loop and stays fixed. `while True` repeats until `break` is reached; the input call collects a fresh guess on each pass. During testing, replace the target line with `target = 7`: guesses `3`, `9`, and `7` should give low, high, correct and then stop. A correct first guess must also stop immediately. Restore the random target when you finish testing.

### Question 9 — Mystery Script: The Prize Message

The program visits starting positions `0`, `3`, `6`, and so on. Each three-character slice adds a dot for `ATG`, a dash for `TAA`, or a space for `TGA`. The original sequence has 831 characters and therefore 277 groups. It contains only those three recognised groups, so the output has 277 characters too.

Read the output as Morse code: one space separates letters and three spaces separate words. The first `..` is I, then `-- --- ...- .` spells MOVE. Continuing with the chapter's key gives:

> I MOVE WITHOUT MOTION I SPEAK WITHOUT VOICE I GROW WHEN YOU ERR I DIE WHEN YOU REJOICE

The decoded wording is the checkable result. The riddle invites interpretation; for example, worry or self-doubt could grow after mistakes and lessen with joy. The course export does not supply an official riddle answer, so justify your suggestion against the lines rather than treating one interpretation as the only correct answer.

The variable name `codon` does not make this biological translation: the mapping in the program defines a custom code. If you change a group to an unrecognised value, the final `else` appends an empty string and that group disappears from the output. That is a reason to check assumptions about the input when adapting the script.

### Question 10 — Debugging Challenge

```{code-cell} python
numbers = [5, -3, 0, 7, -1, 0, 9]
i = 0                          # Begin at the first valid position.
positives = negatives = zeros = 0  # Initialise all three integer counters.
while i < len(numbers):        # Stop before the invalid index len(numbers).
    n = numbers[i]
    if n > 0:
        positives += 1         # Add one instead of assigning positive one.
    elif n == 0:
        zeros += 1
    else:
        negatives += 1
    i += 1                     # Advance for every item, including zero.
print("Positives:", positives)
print("Negatives:", negatives)
print("Zeros:", zeros)
```

There are three repairs. Use `<` instead of `<=` so the index stays below the length. Use `+= 1` rather than `=+ 1`: the latter assigns `+1` each time. Finally, remove the `continue` branch and advance `i` after every classification, so zeros cannot trap the loop at one position.

The result is three positives, two negatives, and two zeros. `[0]` gives 0, 0, 1; `[1, 2]` gives 2, 0, 0; `[-1, -2]` gives 0, 2, 0; and `[]` gives three zeros. In each case, the counts add up to the list length.

### Optional mini-project — Sensor summary

```{code-cell} python
readings = [36.5, 37.0, 38.5, 39.0]
threshold = 38.0                 # Count only readings strictly above this value.
if len(readings) == 0:
    print("No readings to summarise.")
else:
    total = 0.0
    above_threshold = 0
    for reading in readings:
        total += reading        # Accumulate the sum across all readings.
        if reading > threshold:
            above_threshold += 1
    mean = total / len(readings) # Calculate once the loop is complete.
    print("Total:", total)
    print("Mean:", mean)
    print("Minimum:", min(readings))
    print("Maximum:", max(readings))
    print("Above threshold:", above_threshold)
```

The results are total `151.0`, mean `37.75`, minimum `36.5`, maximum `39.0`, and above-threshold count `2`. The empty-list branch prevents invalid summary calculations. Adding `38.0` changes the total, mean, and number of readings but leaves the above-threshold count at two, because the test uses `>`.


## Week 4

These answers match the ten questions in [Week 4](chapters/week-4.md). Create the sample input files from the chapter in your `week-4` folder. Keep each answer in its own script and run it from that folder. For file tasks, inspect the saved output as well as the terminal.

### Question 1 — Write Your First Function

```{code-cell} python
def triple_number(x):
    """Return three times a numeric value."""
    return x * 3                         # Return a result for the caller to use.

for value in [4, 0, -2, 1.5]:             # Try several independent calls.
    print(value, "->", triple_number(value))
answer = triple_number(4)
print("Result plus one:", answer + 1)    # Use the returned value in another calculation.
```

The calls return `12`, `0`, `-6`, and `4.5`. The last line prints `Result plus one: 13`. Replacing `return` with `print` would display the product but leave `answer` as `None`, so the addition would fail.

### Question 2 — GC Content

```{code-cell} python
def gc_content(seq):
    """Return GC percentage for nonempty DNA containing only A, C, G, and T."""
    seq = seq.upper()                   # Accept either input case.
    if seq == "":
        raise ValueError("DNA must not be empty.")
    for base in seq:
        if base not in "ACGT":         # Check every character before calculating.
            raise ValueError("DNA must contain only A, C, G, and T.")
    gc_count = seq.count("G") + seq.count("C")
    return 100 * gc_count / len(seq)    # Return a number, not a formatted string.

for sequence in ["ATGC", "GGCC", "ATAT", "aGc"]:
    print(f"{sequence}: {gc_content(sequence):.2f}%")  # Format only for display.
```

The displayed percentages are `50.00%`, `100.00%`, `0.00%`, and `66.67%`. The function retains the full calculated result. Calling it with an empty string or `ATNX` raises `ValueError`. The `return` is outside the validation loop, so every character is checked.

### Question 3 — Writing to a File

```python
def save_message(msg, filename):
    """Replace the file's contents with the supplied message."""
    with open(filename, "w", encoding="utf-8") as handle:
        handle.write(msg)               # Save the text exactly as supplied.

save_message("Hello from Week 4.\n", "message.txt")
save_message("A different message.\n", "second_message.txt")
```

`msg` receives the first argument and `filename` receives the second. Write mode creates or replaces the file. The caller supplies the newline; `.write` does not add one. This function returns `None` because its purpose is to save a file, and it has no explicit `return`.

### Question 4 — Number the Quotes

```python
def read_quotes(filename):
    """Print every file line with a number starting from one."""
    line_number = 1                     # Reset the counter for each function call.
    with open(filename, "r", encoding="utf-8") as handle:
        for line in handle:
            text = line.rstrip("\n")   # Let print add the displayed newline.
            print(f"{line_number}: {text}")
            line_number += 1            # Count every physical line, including blanks.

read_quotes("quotes.txt")
```

With the supplied three-line file, the numbers are 1 through 3. An empty file gives no output. A blank second line produces `2: ` and still increases the counter. Defining the counter inside the function means a second call starts at one again.

### Question 5 — Explanation Practice

There is no single correct explanation for this activity because you choose the function. A useful explanation identifies what arguments it accepts, which steps it performs, what it returns or writes, and what assumptions it makes. Check claims against actual calls, particularly the difference between output shown by `print` and a returned value. Keep any useful comments in your own script.

### Question 6 — DNA File Analyser

Copy the `gc_content` definition from Question 2 above the following code in `q6.py`. You need the function definition, not its demonstration loop. This keeps the script self-contained.

```python
def analyse_dna_file(filename):
    """Read one plain DNA sequence and write its length and GC percentage."""
    sequence = ""
    with open(filename, "r", encoding="utf-8") as handle:
        for line in handle:
            sequence += line.strip()   # Join cleaned lines; blanks add no characters.
    gc_percent = gc_content(sequence)   # Validate and calculate before opening output.
    length = len(sequence)
    with open("report.txt", "w", encoding="utf-8") as report:
        report.write(f"Length: {length}\n")
        report.write(f"GC content: {gc_percent:.2f}%\n")

analyse_dna_file("dna.txt")
```

For `ATGC` followed by `GGAA`, the report has length `8` and GC content `50.00%`. Case and blank lines do not affect the result. An empty file or an invalid sequence raises `ValueError` before the report is opened, preserving any existing report. If validation fails, an old report describes an earlier run; it is not a result for the rejected input. This reads plain sequence text, so a FASTA header is rejected too.

### Question 7 — Word Counter

```python
def count_words(filename):
    """Return lowercase word counts, splitting on whitespace and retaining punctuation."""
    counts = {}
    with open(filename, "r", encoding="utf-8") as handle:
        for line in handle:
            for word in line.lower().split():
                counts[word] = counts.get(word, 0) + 1  # Start unseen words at zero.
    return counts                         # Return after every line has been processed.

counts = count_words("words.txt")
ordered_words = sorted(counts, key=counts.get, reverse=True)  # Order by count.
for word in ordered_words[:10]:            # Display at most ten words.
    print(f"{word}: {counts[word]}")
```

The sample produces `red: 3`, `blue: 2`, and `green: 1`. `sorted` orders keys using their associated counts, and equal counts stay in first-appearance order. An empty or whitespace-only file returns `{}` and prints no rows. Under this rule, `Red` and `red` share a count, but `red,` is a separate word.

### Question 8 — Student Gradebook

```python
grades = {}                               # Map each unique name to its numeric score.
with open("grades.txt", "r", encoding="utf-8") as handle:
    for line in handle:
        line = line.strip()
        if line == "":
            continue                      # Skip blank records.
        name, score_text = line.split(",") # Require exactly one comma.
        name = name.strip()
        score = float(score_text)
        if name == "":
            raise ValueError("Student name must not be empty.")
        if not (score >= 0 and score <= 100):  # Both inclusive limits must hold.
            raise ValueError("Score must be between 0 and 100.")
        if name in grades:
            raise ValueError(f"Duplicate student name: {name}")
        grades[name] = score

# All records have been checked before an existing report can be replaced.
with open("grade_summary.txt", "w", encoding="utf-8") as report:
    if len(grades) == 0:
        report.write("No grades to summarise.\n")
    else:
        scores = list(grades.values())     # Collect the numeric values for statistics.
        mean = sum(scores) / len(scores)
        report.write(f"Mean: {mean:.2f}\n")
        report.write(f"Minimum: {min(scores):.2f}\n")
        report.write(f"Maximum: {max(scores):.2f}\n")
        report.write("Above mean:\n")
        for name, score in grades.items(): # Visit name–score pairs in input order.
            if score > mean:
                report.write(f"{name}: {score:.2f}\n")
```

The sample report has mean `75.00`, minimum `60.00`, maximum `90.00`, then Blair at `80.00` and Drew at `90.00` under `Above mean:`. A single student's score equals the mean, so no student line follows that heading. Empty input produces the no-grades message. Invalid numbers, malformed comma-separated records, empty names, out-of-range scores, and duplicate names stop processing before the report is opened.

`not (score >= 0 and score <= 100)` rejects a score unless it satisfies both limits. `grades.values()` supplies scores; `grades.items()` supplies name–score pairs. These operations avoid confusing a dictionary's keys with the numeric values needed for calculations.

### Question 9 — Log File Filter

```python
def extract_errors(filename, outname):
    """Copy lines containing uppercase ERROR to a different file; return their count."""
    error_count = 0
    with open(filename, "r", encoding="utf-8") as source:
        with open(outname, "w", encoding="utf-8") as destination:
            for line in source:
                if "ERROR" in line:       # Match this exact uppercase text anywhere.
                    destination.write(line) # Preserve the original line ending.
                    error_count += 1
    return error_count                     # Return after all lines and both with blocks.

count = extract_errors("system.log", "errors.txt")  # Use distinct input/output paths.
print("Errors found:", count)
```

For the sample, `errors.txt` contains `ERROR Sensor unavailable` and `ERROR Timeout`, and the returned count is two. With no matches, the output file is empty and the count is zero. Lowercase `error` does not match. Because you write `line` directly, a final matching line without a newline stays that way; no additional line breaks are introduced. Always pass different input and output paths.

### Question 10 — Mystery Script Revisited

The original function counts whitespace-separated words, preserving their case and punctuation. For the sample file it returns `{'red': 2, 'blue': 2, 'Red': 1}`. Its `.strip()` removes whitespace at the ends of each line, and `.split()` separates the remaining text into words. It does not call `.lower()`, so `Red` and `red` are distinct keys.

Here is the same approach with descriptive names and a docstring:

```python
def count_exact_words(filename):
    """Return case-sensitive word counts, splitting on whitespace."""
    with open(filename, "r", encoding="utf-8") as handle:
        lines = handle.readlines()           # Keep the original list-of-lines approach.
    counts = {}
    for line in lines:
        for word in line.strip().split():
            counts[word] = counts.get(word, 0) + 1
    return counts                            # Finish counting before returning.

print(count_exact_words("mystery.txt"))
```

`readlines()` loads all lines into a list, allowing the file to close before the loops run. Question 7 instead loops directly over the open file. Both approaches work for these small inputs; the direct file loop avoids keeping every line in memory. The return belongs outside both loops so all lines are counted. Empty input returns an empty dictionary.


## Week 5

```{code-cell} python
import re

is_dna = re.compile(r"[ACGT]+").fullmatch
for sequence in ["ATCGTT", "AXTG", ""]:
    print(sequence, bool(is_dna(sequence)))
```

`fullmatch` is appropriate for validation because it checks the complete string. A substring search could return a match even if invalid characters appeared elsewhere.

## Project solutions

### Project 1A: transform DNA

```{code-cell} python
fragment_1 = "actgtgtcag"
fragment_2 = "tcagttttgg"
dna = (fragment_1 + fragment_2).upper()
complement = {"A": "T", "T": "A", "C": "G", "G": "C"}
reverse_complement = "".join(complement[base] for base in dna[::-1])
rna_with_tail = dna.replace("T", "U") + "A" * 7
print(dna, len(dna))
print(reverse_complement)
print(rna_with_tail, len(rna_with_tail))
```

The reverse complement is `CCAAAACTGACTGACACAGT`. The RNA output has length 27: 20 transcribed bases plus seven adenines.

### Project 1B: summary statistics

```{code-cell} python
import math

counts = [18, 21, 19, 22, 20]
ordered = sorted(counts)
mean = sum(counts) / len(counts)
variance = sum((value - mean) ** 2 for value in counts) / len(counts)
median = ordered[len(ordered) // 2]
print(f"Total = {sum(counts):.1f}")
print(f"Mean = {mean:.1f}")
print(f"Variance = {variance:.1f}")
print(f"Standard deviation = {math.sqrt(variance):.1f}")
print(f"Median = {median:.1f}")
print(f"Range = {max(counts) - min(counts):.1f}")
```

### Project 1C: classify replicates

```{code-cell} python
def classify_replicates(values):
    if any(value < 0 or value > 2000 for value in values):
        return "Invalid"
    if all(value < 10 for value in values):
        return "Failed assay"
    if len(set(values)) == 1:
        return "Uniform replicates"
    if len(set(values)) == 2:
        return "Duplicate replicates"
    mean = sum(values) / len(values)
    if all(abs(value - mean) <= 0.2 * mean for value in values):
        return "Consistent assay"
    return "Outlier replicate"

print(classify_replicates([104, 112, 108]))
```

The checks are ordered so invalid values and failed assays are identified before similarity checks.

### Project 1D: validate and classify sequence records

```{code-cell} python
records = {
    "sample_1": "ATGCCGTAA",
    "sample_2": "ATNXGTA",
    "sample_3": "GCGCGC",
}
valid = 0
invalid = 0
for name, sequence in records.items():
    if any(base not in "ACGT" for base in sequence) or len(sequence) % 3 != 0:
        print(name, "Invalid sequence")
        invalid += 1
    else:
        gc_percent = 100 * (sequence.count("G") + sequence.count("C")) / len(sequence)
        if gc_percent > 60:
            category = "GC-rich"
        elif gc_percent < 40:
            category = "AT-rich"
        else:
            category = "Balanced"
        print(name, f"{gc_percent:.2f}%", category)
        valid += 1
print(f"Summary: {valid} valid, {invalid} invalid")
```

### Project 2: FASTA parsing and validation

```{code-cell} python
def parse_fasta(text):
    records = {}
    header = None
    parts = []
    for raw_line in text.splitlines():
        line = raw_line.strip()
        if not line:
            continue
        if line.startswith(">"):
            if header is not None:
                records[header] = "".join(parts).upper()
            header = line[1:]
            parts = []
        elif header is None:
            raise ValueError("sequence data found before a FASTA header")
        else:
            parts.append(line)
    if header is not None:
        records[header] = "".join(parts).upper()
    return records

sample = ">gene_alpha\nATGAAACCCGGGTAA\n>gene_beta\nATGCCCTAG\n>gene_gamma\nATGNAA\n"
records = parse_fasta(sample)
valid = {name: seq for name, seq in records.items() if seq and all(base in "ACGT" for base in seq)}
print("records:", len(records), "valid:", len(valid), "invalid:", len(records) - len(valid))
```

### Project 2: ORFs and translation

This version reports an ORF for each start codon, ending at its first downstream in-frame stop codon. If starts are nested before a stop, each start gets its own candidate ORF.

```{code-cell} python
def find_orfs(sequence):
    stops = {"TAA", "TAG", "TGA"}
    found = []
    sequence = sequence.upper()
    for frame in range(3):
        for start in range(frame, len(sequence) - 2, 3):
            if sequence[start:start + 3] != "ATG":
                continue
            for stop in range(start + 3, len(sequence) - 2, 3):
                if sequence[stop:stop + 3] in stops:
                    found.append(sequence[start:stop + 3])
                    break
    return found

print(find_orfs("ATGAAACCCGGGTAA"))
print(find_orfs("ATGCCCTAG"))
```

The supplied short sequences require only these codons for a demonstration translation:

```{code-cell} python
codon_table = {"ATG": "M", "AAA": "K", "CCC": "P", "GGG": "G", "TAA": "*", "TAG": "*"}

def translate(sequence):
    protein = ""
    for start in range(0, len(sequence) - 2, 3):
        codon = sequence[start:start + 3]
        protein += codon_table.get(codon, "X")
    return protein

print(translate("ATGAAACCCGGGTAA"))
print(translate("ATGCCCTAG"))
```

`X` here marks a codon absent from this intentionally small dictionary. A complete translation task needs all 64 codons and a stated policy for incomplete trailing bases.

### Project 2: motif search

```{code-cell} python
import re

motif = re.compile(r"N[^P][ST]")
protein = "MNNSTAPNPS"
matches = motif.findall(protein)
print(matches, len(matches))
```

The pattern matches an asparagine (`N`), any amino acid other than proline (`[^P]`), then serine or threonine (`[ST]`). `findall` reports non-overlapping matches.
