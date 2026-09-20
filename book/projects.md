# Portfolio Projects

Both projects **must be completed as part of your LIFE733 portfolio, in addition to the BioBoost knowledge checks**. Instructions for the BioBoost knowledge checks will be introduced separately.

Use the shared practice files first. Their small size and known results let you check that your solution works. Then generate your individual datasets below using your nine-digit student ID and **run your completed solutions against those datasets**. Completing only the practice examples does not complete the portfolio projects.

Your individual files are reproducible: the same ID produces the same version of each dataset. Different IDs produce different DNA data, with the same task structure. The generator runs in your browser without sending your ID to a server. Keep the downloaded README with your inputs so you retain the dataset version.

## Set up your portfolio folders

Create a `portfolio` folder alongside your weekly work. Give each project its own folder with `practice`, `input`, and `output` subfolders. Keep the downloaded input files unchanged and save your results under `output`.

```text
portfolio/
├── project-1/
│   ├── main.py       ← Your project script
│   ├── practice/     ← Shared files for checking your solution
│   ├── input/        ← Your individual dataset and README
│   └── output/       ← Results from your individual run
└── project-2/
    ├── main.py       ← Driver script
    ├── fasta_tools.py ← Reusable functions
    ├── practice/
    ├── input/
    └── output/
```

Open the project folder in VS Code and check the terminal location before running your script. Use relative paths such as `practice/project1_counts.txt` while testing, then switch to the downloaded filenames under `input`. Change the input paths rather than hard-coding the expected answers. Keep your practice test results separate from your individual results.

The [project solutions](solutions.md#project-solutions) demonstrate the shared practice cases. Attempt each stage yourself before consulting them. Follow the course's portfolio submission and AI-use instructions; this page does not replace those instructions.

## Project 1: DNA sequences and cell counts

This project combines string transformations, numerical summaries, decisions, and validation. Start with the four practice files:

- {download}`DNA fragments <portfolio-generator/practice/project1_fragments.txt>`
- {download}`Cell counts <portfolio-generator/practice/project1_counts.txt>`
- {download}`Replicate measurements <portfolio-generator/practice/project1_replicates.tsv>`
- {download}`DNA records <portfolio-generator/practice/project1_sequences.fasta>`

### Generate your Project 1 dataset

<iframe title="Generate a Project 1 portfolio dataset" src="/python-for-life-sciences/portfolio-generator/index.html?project=1" width="100%" height="650" loading="lazy"></iframe>

Download all five generated files, including the README. The fragments file has two DNA strings, one per line. The counts file has one integer per line. The replicate table has a header followed by a sample identifier and three tab-separated measurements per row. The FASTA file contains multiple named records.

If the embedded form is too small, [open the Project 1 generator in a separate tab](/python-for-life-sciences/portfolio-generator/index.html?project=1).

### Part A: DNA string transformations

Use these example fragments:

```python
fragment_1 = "actgtgtcag"  # First shared practice fragment.
fragment_2 = "tcagttttgg"  # Second shared practice fragment.
```

Join the fragments and normalize the result to uppercase. Print its length. Then calculate the reverse complement, transcribe DNA to RNA, append seven `A` characters, and print the final RNA length.

**Check:** the combined DNA is `ACTGTGTCAGTCAGTTTTGG`, with length 20. Its reverse complement is `CCAAAACTGACTGACACAGT`; its RNA with the tail is `ACUGUGUCAGUCAGUUUUGGAAAAAAA`.

For your individual run, read the two lines from your downloaded fragments file. Strip surrounding whitespace and perform the same operations on those values. Both individual fragments have 24 bases, so their combined length is 48 and the RNA length after adding the tail is 55. The sequence itself depends on your ID.

### Part B: replicate statistics

Use the synthetic cell counts `[18, 21, 19, 22, 20]`. Calculate and print the total, mean, population variance, population standard deviation, median, and range. Format reported statistics to one decimal place.

For population variance, calculate the mean squared difference from the mean. The population standard deviation is the square root of that variance. The median is the middle value after sorting.

**Practice check:** total `100.0`, mean `20.0`, population variance `2.0`, population standard deviation `1.4`, median `20.0`, and range `4.0`.

For your individual run, load the integers from the counts file rather than embedding the practice list in your code. There are seven counts; use the list length in your calculations instead of assuming five.

### Part C: classify replicate measurements

Classify these protein concentration replicates, measured in mg/L: `[104, 112, 108]`. First reject values outside 0–2000. Then classify all values below 10 as a failed assay, all equal values as uniform, exactly two equal values as duplicates, and otherwise compare each value's absolute deviation from the mean with 20% of the mean. If every deviation is at most 20%, classify the sample as consistent; otherwise classify it as containing an outlier.

Write a function that accepts a list and returns a classification string. Test at least one case for every classification and explain which branch should take precedence when conditions overlap.

The practice sample is consistent. For your individual run, skip the header row in the replicate table, convert its three measurements to numbers, and apply your function to every sample. Print or save each sample identifier with its classification. Do not apply one classification to the whole file.

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

Parse complete records and join wrapped sequence lines before validation; keep each header so you can identify its result. A sequence is valid only if it contains A, C, G, or T and its length is divisible by three. For valid records, calculate GC percentage and classify it as AT-rich (<40%), balanced (40–60% inclusive), or GC-rich (>60%). Report counts of valid and invalid records.

**Practice check:** two valid records and one invalid record. `sample_1` has GC `44.44%` (balanced); `sample_3` has GC `100.00%` (GC-rich). Validate a nonempty complete sequence, not each wrapped line independently.

Run the same analysis on your individual FASTA file. Save each record's identifier, validity, and, where valid, length, GC percentage, and GC category. Report the totals alongside your other Project 1 results.

## Project 2: A small FASTA analysis pipeline

This project joins file handling, dictionaries, functions, loops, validation, and regular expressions. Download the {download}`practice FASTA file <portfolio-generator/practice/project2_practice.fasta>` and {download}`codon lookup table <portfolio-generator/practice/project2_codons.tsv>` into your `practice` folder. The FASTA contains:

```text
>gene_alpha synthetic example
ATGAAACCCGGGTAA
>gene_beta synthetic example
ATGCCCTAG
>gene_gamma contains invalid symbol
ATGNAA
```

### Generate your Project 2 dataset

<iframe title="Generate a Project 2 portfolio dataset" src="/python-for-life-sciences/portfolio-generator/index.html?project=2" width="100%" height="590" loading="lazy"></iframe>

Download the FASTA, codon table, and README into your Project 2 `input` folder. [Open the Project 2 generator in a separate tab](/python-for-life-sciences/portfolio-generator/index.html?project=2) if needed.

The individual FASTA includes wrapped lines, invalid records, multiple candidate starts, and proteins with and without motif matches. Use the supplied codon table for both practice and individual data: the six-codon demonstration table in the solutions is too small for the individual sequences. The downloaded table covers all codons used in the valid supplied sequences; it is a teaching subset, not the complete genetic code.

### Stage 1: parse and clean records

Write `read_fasta(filename)` to return a dictionary mapping each full header to its uppercase sequence. Handle wrapped sequence lines. Report the number of records, valid records, invalid records, and mean length of valid sequences. For this project, valid DNA is nonempty and contains only A, C, G, and T. Reject missing or repeated headers rather than overwriting records. If there are no valid records, report the mean length as unavailable instead of dividing by zero.

**Practice check:** three records, two valid, one invalid; mean valid length `12.0`. Apply the same checks to every individual record.

### Stage 2: find candidate ORFs

Write `find_orfs(sequence)` to scan all three reading frames. Treat an ORF as any start codon `ATG` followed in the same frame by its first downstream stop codon (`TAA`, `TAG`, or `TGA`). Scan the supplied forward strand only. Return the nucleotide strings from start through stop, inclusive. Each start gets its own candidate, including nested starts. Do not return a start without an in-frame stop. Test with `ATGAAACCCGGGTAA` and `ATGCCCTAG`.

Save the candidate ORFs with their source record identifiers; use a separate numbered identifier for each candidate. Finding ORFs is a separate stage from the full-record translation below.

### Stage 3: translate valid DNA

Read the downloaded tab-separated codon table into a dictionary, skipping its header. Translate each valid full FASTA record from its first base, in triplets, and represent stop codons with `*`. For this project, retain stop symbols and continue to the end of the record; this differs from Week 5's stop-at-first-stop exercise. Skip invalid records and report their identifiers. Reject incomplete trailing triplets and missing codon mappings with a clear message instead of silently dropping bases or inventing a translation.

Write translated records to `output/proteins.fasta`, keeping a corresponding identifier for each protein. All valid records generated for this project have complete triplets and use the supplied mappings.

**Practice check:** the two protein strings are `MKPG*` and `MP*`.

### Stage 4: search protein motifs

Use the regular expression `N[^P][ST]` to find candidate N-linked glycosylation-like motifs in protein sequences. A pattern match alone does not establish that a protein is glycosylated. Do not match across stop symbols: search each segment obtained with `protein.split("*")` separately. Report protein length, number of stop symbols, and number of non-overlapping motif matches. Try a small protein string with one known match and one near-match.

The practice proteins have zero hits, so also test `NAT` (one hit), `NPS` (no hit), and `N*S` (no hit across a stop). Save matching protein records to `output/motif_hits.fasta`; create an empty file if no proteins match.

### Stage 5: organize your program

Move reusable functions into `sequtils.py` or `fasta_tools.py`, then import them from a short driver script. Write `output/summary.tsv` with a header row and columns for record identifier, DNA length, validity, ORF count, protein length, stop-symbol count, and motif-hit count. Use `NA` for analyses not performed on invalid records. Include brief tests for an empty FASTA file, a wrapped sequence, and an invalid base.

Once the practice checks pass, run all stages against your individual FASTA and codon table. Keep those results together with your code and dataset README for your portfolio.

## Check your portfolio work

Before following the course submission instructions, check that you have completed **both** projects and run each on the dataset generated with your own student ID. Keep your code, your checks against the shared practice data, the unchanged individual inputs and README, and the output from your individual runs together.

Be ready to explain how your program reads, validates, transforms, and reports the data. The BioBoost knowledge checks are an additional required part of the LIFE733 portfolio; instructions for them will follow separately.
