---
kernelspec:
  name: python3
  display_name: Python 3
---

# Week 5: Dictionaries, patterns, and modules

## Learning goals

Use dictionaries to associate keys with values, regular expressions to search for patterns in text, and modules to reuse code across files. These ideas support small but complete sequence-analysis workflows.

## Dictionaries map keys to values

A list is useful when position or order matters. A dictionary is useful when you want to look up a value by a meaningful key.

```{code-cell} python
codons = {"ATG": "M", "GCT": "A", "TAA": "*"}
print(codons["ATG"])
codons["TTT"] = "F"
for codon, amino_acid in codons.items():
    print(codon, amino_acid)
```

The `items()` method provides each key and value. A lookup for a missing key raises `KeyError`; use `dict.get` when a missing value should have a fallback.

## Regular expressions find patterns

The `re` module describes text patterns. `fullmatch` succeeds only when the entire string matches. The pattern `[ACGT]+` means one or more characters, each of which is A, C, G, or T.

```{code-cell} python
import re

pattern = re.compile(r"[ACGT]+")
for sequence in ["ATCGTT", "AXTG", ""]:
    print(sequence, bool(pattern.fullmatch(sequence)))
```

Use a raw string (`r"..."`) for regular-expression patterns. `+` allows one or more bases; it rejects the empty string. If lower-case input is allowed, normalize it with `.upper()` before checking.

## Split code into modules

A module is a Python file that can be imported by another script. Put reusable functions in `sequtils.py`, then import and call them from `main.py`.

```python
# sequtils.py
def transcribe(sequence):
    return sequence.upper().replace("T", "U")


# main.py (in the same folder)
import sequtils

print(sequtils.transcribe("atgc"))
```

When both files are in the same folder, Python can find `sequtils` by its module name. Use a descriptive file name and avoid naming your file after a standard library module such as `re` or `math`.

## FASTA files

FASTA stores sequence records. Each record begins with a header line starting with `>`, followed by one or more sequence lines. Wrap lines can be joined into one sequence string. A FASTA file may contain several records, so save each completed sequence when the next header appears and once more at the end of the file.

```{code-cell} python
fasta_text = ">gene_A example\nATGC\nAATT\n>gene_B example\nGGCC\n"
records = {}
header = None
sequence_parts = []
for line in fasta_text.splitlines():
    line = line.strip()
    if not line:
        continue
    if line.startswith(">"):
        if header is not None:
            records[header] = "".join(sequence_parts).upper()
        header = line[1:]
        sequence_parts = []
    else:
        sequence_parts.append(line)
if header is not None:
    records[header] = "".join(sequence_parts).upper()
print(records)
```

This example handles multiple lines per record. A production parser should also decide how to handle sequence text before the first header, blank files, duplicate headers, and invalid bases.

## GFF files (background)

GFF describes genomic features in tab-separated rows with nine columns, including sequence ID, feature type, start, end, and attributes. GFF coordinates are conventionally 1-based and inclusive. Python string positions are 0-based, so converting a GFF interval `[start, end]` to a Python slice uses `sequence[start - 1:end]`. FASTA is the file format needed for the practice project below; GFF is included as context.

## Activities

1. Make a dictionary for three codons. Add a new item, look up a codon, and print all pairs.
2. Use `re.fullmatch` to accept only DNA sequences containing A, C, G, and T. Test valid, invalid, lowercase, and empty strings.
3. Create `sequtils.py` with `transcribe` and `reverse_complement`, then import the functions from another script.
4. Read a multi-record FASTA file and report every identifier and sequence length.
5. **Mini-project:** build a small FASTA analysis pipeline that validates records, reports lengths and GC percentage, and writes a tab-separated summary.

## Videos

The Week 5 videos cover dictionaries, patterns, and modules. This first walkthrough introduces dictionary operations.

<iframe title="Week 5: dictionary basics" width="560" height="315" src="https://www.youtube-nocookie.com/embed/jl4--IxJMOk?cc_load_policy=1&cc_lang_pref=en" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Read the transcript](../captions/jl4--IxJMOk.txt) · [Watch on YouTube](https://www.youtube.com/watch?v=jl4--IxJMOk)

<iframe title="Week 5: regular expressions" width="560" height="315" src="https://www.youtube-nocookie.com/embed/gBAfQFRxjhw?cc_load_policy=1&cc_lang_pref=en" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Read the transcript](../captions/gBAfQFRxjhw.txt) · [Watch on YouTube](https://www.youtube.com/watch?v=gBAfQFRxjhw)

<iframe title="Week 5: creating a Python module" width="560" height="315" src="https://www.youtube-nocookie.com/embed/iek0ZhnYm2s?cc_load_policy=1&cc_lang_pref=en" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

[Read the transcript](../captions/iek0ZhnYm2s.txt) · [Watch on YouTube](https://www.youtube.com/watch?v=iek0ZhnYm2s)

For FASTA and sequence-processing examples, explore the [Week 5 walkthrough playlist](https://www.youtube.com/playlist?list=PLsWFiDvzgp8oR5MAh9LsO6oy62qS98swl).
