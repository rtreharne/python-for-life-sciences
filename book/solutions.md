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

```{code-cell} python
counts = [3, 7, 2, 9, 5]
total = 0
for count in counts:
    total += count
print(total, total / len(counts))
```

For a base count, initialize a dictionary of zero counts and increment the matching base inside a loop. Check unexpected symbols explicitly if the input must be valid DNA.

## Week 4

```{code-cell} python
def gc_content(sequence):
    sequence = sequence.upper()
    if not sequence:
        raise ValueError("sequence must not be empty")
    if any(base not in "ACGT" for base in sequence):
        raise ValueError("sequence contains a non-DNA character")
    return 100 * (sequence.count("G") + sequence.count("C")) / len(sequence)

print(gc_content("ATGC"))
```

Return the percentage so the caller can print it, compare it, or write it to a report. Raising a clear error makes the function's input assumptions explicit.

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
