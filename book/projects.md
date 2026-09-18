# Extended practice projects

These optional projects combine the five chapters. They use small synthetic datasets that are included here, so you can complete them without a personal download or an extra helper file. Try each stage before looking at the [solutions](solutions.md#project-solutions).

## Project 1: DNA sequences and cell counts

This project adapts the ideas from the former Assignment 1 into a sequence of practice tasks. Store the supplied values directly in your script; the goal is to practise Python, not to retrieve a student-specific dataset.

### Part A: DNA string transformations

Use these example fragments:

```python
fragment_1 = "actgtgtcag"
fragment_2 = "tcagttttgg"
```

Join the fragments and normalize the result to uppercase. Print its length. Then calculate the reverse complement, transcribe DNA to RNA, append seven `A` characters, and print the final RNA length.

**Check:** the combined DNA is `ACTGTGTCAGTCAGTTTTGG`, with length 20. Its reverse complement is `CCAAAACTGACTGACACAGT`; its RNA with the tail is `ACUGUGUCAGUCAGUUUUGGAAAAAAA`.

### Part B: replicate statistics

Use the synthetic cell counts `[18, 21, 19, 22, 20]`. Calculate and print the total, mean, population variance, population standard deviation, median, and range. Format reported statistics to one decimal place.

For population variance, calculate the mean squared difference from the mean. The population standard deviation is the square root of that variance. The median is the middle value after sorting.

### Part C: classify replicate measurements

Classify these protein concentration replicates, measured in mg/L: `[104, 112, 108]`. First reject values outside 0–2000. Then classify all values below 10 as a failed assay, all equal values as uniform, exactly two equal values as duplicates, and otherwise compare each value's absolute deviation from the mean with 20% of the mean.

Write a function that accepts a list and returns a classification string. Test at least one case for every classification and explain which branch should take precedence when conditions overlap.

### Part D: validate sequences

Analyze these synthetic FASTA records:

```text
>sample_1
ATGCCGTAA
>sample_2
ATNXGTA
>sample_3
GCGCGC
```

Ignore headers while validating sequence lines. A sequence is valid only if it contains A, C, G, or T and its length is divisible by three. For valid records, calculate GC percentage and classify it as AT-rich (<40%), balanced (40–60% inclusive), or GC-rich (>60%). Report counts of valid and invalid records.

## Project 2: A small FASTA analysis pipeline

This project adapts the former Assignment 2 to a compact synthetic dataset. It joins file handling, dictionaries, functions, loops, validation, and regular expressions. Create a file named `practice.fasta` with the following content:

```text
>gene_alpha synthetic example
ATGAAACCCGGGTAA
>gene_beta synthetic example
ATGCCCTAG
>gene_gamma contains invalid symbol
ATGNAA
```

### Stage 1: parse and clean records

Write `read_fasta(filename)` to return a dictionary mapping each full header to its uppercase sequence. Handle wrapped sequence lines. Report the number of records, valid records, invalid records, and mean length of valid sequences. For this project, valid DNA contains only A, C, G, and T.

### Stage 2: find candidate ORFs

Write `find_orfs(sequence)` to scan all three reading frames. Treat an ORF as any start codon `ATG` followed in the same frame by its first downstream stop codon (`TAA`, `TAG`, or `TGA`). Return the nucleotide strings from start through stop, inclusive. Test with `ATGAAACCCGGGTAA` and `ATGCCCTAG`.

### Stage 3: translate valid DNA

Create a codon dictionary for the codons in your valid example sequences. Translate complete triplets and represent stop codons with `*`. Write translated records to `proteins.fasta`, keeping a corresponding identifier for each protein. In real work, use a complete standard genetic code table; this small project uses only the codons needed by the supplied example.

### Stage 4: search protein motifs

Use the regular expression `N[^P][ST]` to find N-linked glycosylation-like motifs in protein sequences. Report protein length, number of stop symbols, and number of non-overlapping motif matches. Try a small protein string with one known match and one near-match.

### Stage 5: organize your program

Move reusable functions into `sequtils.py` or `fasta_tools.py`, then import them from a short driver script. Write a tab-separated report with a header row. Include a brief test case for an empty FASTA file, a wrapped sequence, and an invalid base.

## Suggested workflow

Work in a new folder, keep the input file unchanged, and write generated output to a different file. Print small intermediate values while debugging. When each stage works on the supplied data, try one additional synthetic case of your own.
