---
kernelspec:
  name: python3
  display_name: Python 3
---

# Solutions and worked answers

Try the activity first, then use these examples to compare the approach and output. These are learning references: trace each line and test a changed input before relying on a solution.

## Week 1

```{code-cell} python
dna = "ACTG"
complement = {"A": "T", "T": "A", "C": "G", "G": "C"}
reverse_complement = "".join(complement[base] for base in dna[::-1])
print(reverse_complement)  # CAGT
```

The source worksheet's acceptance check said `ACTG` should produce `CAG`; that omits the final base. The correct reverse complement is `CAGT`.

For interactive string exercises, collect each input with `input`, normalize with `.upper()` or `.lower()`, and print lengths with `len`. For RNA plus tail, use `dna.replace("T", "U") + "A" * 7`.

## Week 2

```{code-cell} python
mark = 65
if not 0 <= mark <= 100:
    grade = "Invalid mark"
elif mark >= 70:
    grade = "Distinction"
elif mark >= 60:
    grade = "Merit"
elif mark >= 50:
    grade = "Pass"
else:
    grade = "Fail"
print(grade)
```

Convert an input string before comparing it with numeric values. For lab access, normalize yes/no responses with `.strip().lower()` and require both conditions with `and`.

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
