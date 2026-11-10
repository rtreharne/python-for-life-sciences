---
title: "Week 9: Alignments, trees, and NCBI databases"
authors:
  - name: Andy Jones
---

# Week 9: Alignments, trees, and NCBI databases

In Week 8, you used BLAST to compare sequences and Biopython to read FASTA
files. This week, you will compare a group of related proteins at once, find
conserved positions, build simple phylogenetic trees, and retrieve records from
NCBI. The examples reuse familiar ideas: running an external program, reading
files, looping over sequences, and checking your results.

## What you will learn

By the end of this chapter, you should be able to:

- align protein sequences with MUSCLE and read the result with `AlignIO`
- explain how alignment columns and gap characters represent sequence positions
- calculate conservation scores across an alignment
- calculate distances and construct neighbour-joining and UPGMA trees
- draw a tree and adjust its tip labels and branch colours
- retrieve protein records and search PubMed with Biopython's Entrez module.

## Set up your Week 9 folder

Create a `week-9` folder alongside your earlier weekly folders. Keep the input
FASTA file unchanged, and save alignment files, scripts, and results with new
names:

```text
LIFE733/
└── week-9/
    ├── human_mapk_prots.fasta
    ├── q1.py … q9.py
    ├── human_mapk_aligned.fasta      ← Created by MUSCLE
    ├── alignment_region.txt          ← Created in Question 2
    └── custom_tree.png               ← Created in Question 6
```

The supplied FASTA file contains 13 human MAPK protein sequences. [Download
the file](../week-9/human_mapk_prots.fasta) into your `week-9` folder. The
[Week 9 slide deck](https://canvas.liverpool.ac.uk/courses/95131/modules/items/2725146)
and [workshop exercises](https://canvas.liverpool.ac.uk/courses/95131/modules/items/2725145)
are optional companions. The Canvas [videos page](https://canvas.liverpool.ac.uk/courses/95131/modules/items/2725148)
contains recorded explanations of alignments, trees, and database searches.

Before starting, check that the terminal is in your `week-9` folder and that
the data file is present:

```bash
# Confirm that the terminal is in the Week 9 folder.
pwd
# List the files, including the supplied FASTA file.
ls
```

On Windows, use `cd` to check the current folder and `dir` to list its files.
If the file is missing, download it again before running the examples.

## Align proteins with MUSCLE

This chapter includes three videos. They refer to this material as “Lecture 7,”
which reflects the course organisation in previous years. The book has since been updated:
interpret “Lecture 7” in these videos as Week 9 content.

<iframe title="Align proteins with MUSCLE" width="560" height="315" src="https://www.youtube.com/embed/noMxZwOYIqc?si=gkew2YG6tzW2zn6E" loading="lazy" allow="accelerometer, autoplay, clipboard-write, encrypted-media, gyroscope, picture-in-picture, web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

A **multiple sequence alignment** arranges two or more sequences so that
corresponding regions appear in the same columns. An alignment program inserts
gap characters (`-`) where needed. Similar residues in the same column can
indicate regions that have been conserved during evolution.

This chapter uses MUSCLE, an external command-line program. Install it from the
[MUSCLE releases page](https://github.com/rcedgar/muscle/releases), or use
**Install University Applications** on a University-managed computer. If the
program is not found by name, use the path to the downloaded executable. For
example, on macOS or Linux, a program in the current folder is commonly run as
`./muscle`. On Windows, its name is commonly `muscle.exe`. Exact alignment
output can vary with the MUSCLE version and options, so inspect your result
rather than assuming a fixed alignment length.

First run MUSCLE directly in the terminal. The command-line options shown here
are for MUSCLE 5:

```bash
muscle -align human_mapk_prots.fasta -output human_mapk_aligned.fasta
```

If you use Windows and the executable is named `muscle.exe`, substitute that
name in the command. Check that `human_mapk_aligned.fasta` exists before
continuing. Running the external command in the terminal first helps separate
installation problems from Python problems.

You can run the same command from Python with `os.system`, which you used in
Week 8:

```python
import os

# Build the same command that worked in the terminal.
command = (
    "muscle -align human_mapk_prots.fasta "
    "-output human_mapk_aligned.fasta"
)
print(command)
# Run MUSCLE and save its exit status (zero means success).
result = os.system(command)

# Check both the exit status and the expected output file.
if result == 0 and os.path.exists("human_mapk_aligned.fasta"):
    print("MUSCLE finished successfully")
else:
    print("MUSCLE failed or did not create the alignment file")
```

Replace `muscle` with the executable name or path that worked in your
terminal. As in Week 8, `os.system` returns a status value. Check both that
the command succeeded and that the expected output file was created.

## Read the alignment with `AlignIO`

Use `AlignIO.read` to read a file containing one alignment. It returns an
alignment object whose rows are sequence records and whose columns are aligned
positions:

```python
from Bio import AlignIO

# Read one alignment from the FASTA file.
alignment = AlignIO.read("human_mapk_aligned.fasta", "fasta")
# The records are rows. The alignment length is the number of columns.
print("Number of sequences:", len(alignment))
print("Alignment columns:", alignment.get_alignment_length())

for record in alignment:
    print(record.id)
```

Each `record.seq` is a sequence with gap characters included. The sequences
in an alignment all have the same length, even though the original proteins
have different lengths. In the supplied dataset, the input records range from
360 to 816 amino acids. The alignment can be longer because it includes gap
columns.

To calculate the gap percentage in the first aligned sequence, count its gaps
and divide by its aligned length:

```python
# Convert the sequence to text so its gap characters can be counted.
first_sequence = str(alignment[0].seq)
gap_count = first_sequence.count("-")
gap_percentage = gap_count / len(first_sequence) * 100
print(f"Gaps in first sequence: {gap_percentage:.2f}%")
```

Here the denominator is the number of alignment columns. This describes the
fraction of the aligned row occupied by gaps, not the fraction of the original
protein that was deleted.

### Question 1: Run MUSCLE and inspect the alignment

Use MUSCLE to create `human_mapk_aligned.fasta`. Read the file with `AlignIO`
and print the number of sequences, alignment length, and ID of every sequence.
Then calculate what percentage of the first aligned sequence consists of gaps.

## Extract positions from an alignment

Python indexes strings from zero, but positions in biological sequences are
usually described starting at one. If a worksheet asks for position 150, use
index `149` in Python. To select columns 150 through 160 **inclusive**, use
the slice `149:160`: the starting index is 149 and the stopping index is 160,
which is excluded by Python's slice.

This example writes those eleven columns for each record to a tab-separated
text file and counts all gaps in the selected region:

```python
from Bio import AlignIO

# Read the aligned rows before selecting columns.
alignment = AlignIO.read("human_mapk_aligned.fasta", "fasta")
start = 149                         # Biological position 150.
stop = 160                          # Slice stop is excluded: includes 160.

# Refuse to write an incomplete region if the alignment is too short.
if alignment.get_alignment_length() < stop:
    raise ValueError("The alignment is shorter than position 160")

total_gaps = 0
# Write each sequence's selected columns as one tab-separated row.
with open("alignment_region.txt", "w", encoding="utf-8") as output:
    output.write("Sequence ID\tPositions 150-160\n")
    for record in alignment:
        region = str(record.seq[start:stop])
        output.write(f"{record.id}\t{region}\n")
        total_gaps += region.count("-")

print("Gaps in positions 150-160:", total_gaps)
```

Keep the position convention visible in comments. This makes it easier to
check a Python result against a viewer such as Jalview, which labels columns
starting at one.

### Question 2: Extract alignment positions

Print the amino acid at position 150 for every sequence. Write columns 150–160
to `alignment_region.txt` and report the total number of gaps in that region.
In your comments, explain how the biological positions map to Python indices.

## Find conserved positions

A position is perfectly conserved when every sequence has the same character
in that column. The character may be an amino acid or a gap. `Counter` counts
the characters in a column:

```python
from collections import Counter
from Bio import AlignIO

# Load the alignment and prepare a count of fully matching columns.
alignment = AlignIO.read("human_mapk_aligned.fasta", "fasta")
alignment_length = alignment.get_alignment_length()
perfect_positions = 0

for position in range(alignment_length):
    # Collect the character from every sequence at this column.
    column = [str(record.seq[position]) for record in alignment]
    counts = Counter(column)
    if len(counts) == 1:
        perfect_positions += 1
        print(position + 1, column[0])  # Display a 1-based position.

print("Perfectly conserved positions:", perfect_positions)
```

This counts an all-gap column as perfectly conserved because the activity asks
you to include gaps. For a percentage such as 90%, exclude gaps from the
denominator and from the amino-acid counts. If a column contains only gaps,
there are no residues to compare, so skip it:

```python
residues = [character for character in column if character != "-"]
if residues:
    # Measure agreement among residues only. Gaps do not affect the score.
    counts = Counter(residues)
    agreement = max(counts.values()) / len(residues)
    if agreement >= 0.90:
        print(position + 1, agreement)
```

### Question 3: Find conserved positions

Loop through the complete alignment and print every position where all 13
sequences have the same character. Count the perfectly conserved positions.
For an extension, also report positions where at least 90% of the non-gap
residues agree.

## Calculate a conservation score

A conservation score for one alignment column is the frequency of its most
common non-gap amino acid. The score ranges from `0` to `1`: a score of `1`
means all non-gap residues agree. Gaps are ignored. An all-gap column has no
residues to compare, so this function returns `0` for that column:

```python
from collections import Counter
from Bio import AlignIO

def calculate_conservation_score(alignment, position):
    """Return the fraction of non-gap residues matching the majority residue."""
    if position < 0 or position >= alignment.get_alignment_length():
        raise IndexError("Alignment position is outside the alignment")

    residues = [
        str(record.seq[position])
        for record in alignment
        if str(record.seq[position]) != "-"
    ]
    if not residues:
        return 0.0

    counts = Counter(residues)
    return max(counts.values()) / len(residues)

alignment = AlignIO.read("human_mapk_aligned.fasta", "fasta")
scores = []
for position in range(alignment.get_alignment_length()):
    # Skip columns with no amino acids. Their score has no biological meaning.
    has_residue = any(str(record.seq[position]) != "-" for record in alignment)
    if has_residue:  # All-gap columns contain no conservation information.
        score = calculate_conservation_score(alignment, position)
        scores.append((position, score))
top_positions = sorted(scores, key=lambda item: (-item[1], item[0]))[:10]

# Show the ten highest scores, converting indexes to 1-based positions.
for position, score in top_positions:
    print(f"Position {position + 1}: {score:.3f}")
```

The sort key orders scores from highest to lowest and uses the position to
break ties. Positions are stored with zero-based indexes in the calculation
and displayed with one-based numbering.

### Question 4: Write a conservation scoring function

Write `calculate_conservation_score(alignment, position)`. It should ignore
gaps, return a score between 0 and 1, and handle an all-gap column. Calculate
the score for every position and print the ten highest-scoring positions.

## Build a phylogenetic tree

<iframe title="Build a phylogenetic tree" width="560" height="315" src="https://www.youtube.com/embed/m_Xhx2Up9C8?si=izo6DpnjH9k6bjak" loading="lazy" allow="accelerometer, autoplay, clipboard-write, encrypted-media, gyroscope, picture-in-picture, web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

An alignment can be used to estimate distances between sequences. A
`DistanceCalculator` compares the aligned residues using a chosen model. The
`identity` model treats positions as matching or different. Substitution
matrices such as BLOSUM62 and PAM250 account for how plausible different amino
acid substitutions are. The values from different models are not interchangeable
measurements.

This example prints the distance between the first two sequences for three
models, then constructs a neighbour-joining tree using BLOSUM62:

```python
from Bio import AlignIO
from Bio.Phylo.TreeConstruction import DistanceCalculator, DistanceTreeConstructor

# Read the alignment used for every distance calculation below.
alignment = AlignIO.read("human_mapk_aligned.fasta", "fasta")
models = ("identity", "blosum62", "pam250")

for model in models:
    # Build the model-specific matrix and print its first pairwise distance.
    calculator = DistanceCalculator(model)
    distances = calculator.get_distance(alignment)
    print(f"{model}: {distances[0, 1]:.3f}")

# Build the NJ tree from the BLOSUM62 distance matrix.
calculator = DistanceCalculator("blosum62")
distance_matrix = calculator.get_distance(alignment)
constructor = DistanceTreeConstructor()
tree = constructor.nj(distance_matrix)
print(tree)
```

Neighbour-joining (NJ) estimates an unrooted tree from the distance matrix.
UPGMA is another method. It produces a rooted tree and assumes a constant rate
of evolution along the branches. Different distance models or construction
methods can produce different branch lengths and groupings. A tree is an
inference from the input alignment and chosen settings, not a direct picture
of certainty about evolutionary history.

### Question 5: Build a neighbour-joining tree

Calculate distances using `identity`, `blosum62`, and `pam250`, and print the
distance between the first two sequences for each model. Use BLOSUM62 to
construct and print an NJ tree. Compare the values and explain why the models
can give different distances.

## Draw and customise a tree

Install Matplotlib in the same Python environment you use for Biopython:

```bash
python -m pip install matplotlib
```

Tip labels in the input file are full UniProt IDs. The gene name appears after
`GN=` in each FASTA description, so build a lookup before shortening the tree
labels. Internal NJ nodes are automatically named `Inner...`. Those labels can
be cleared. Each clade's `branch_length` describes the branch leading to it.
The colour is shown for that branch when the tree is drawn:

```python
import re
import matplotlib.pyplot as plt
from Bio import AlignIO, Phylo
from Bio.Phylo.TreeConstruction import DistanceCalculator, DistanceTreeConstructor

# Read the sequences and map each full record ID to its gene name.
alignment = AlignIO.read("human_mapk_aligned.fasta", "fasta")
gene_names = {}
for record in alignment:
    match = re.search(r"GN=([^\s]+)", record.description)
    if match:
        gene_names[record.id] = match.group(1)

distances = DistanceCalculator("blosum62").get_distance(alignment)
tree = DistanceTreeConstructor().nj(distances)

# Shorten tip labels and remove automatically generated internal labels.
for clade in tree.find_clades():
    if clade.is_terminal():
        clade.name = gene_names.get(clade.name, clade.name)
    elif clade.name and clade.name.startswith("Inner"):
        clade.name = None

    # Colour each branch by its length. Missing lengths use the blue case.
    if clade.branch_length is not None and clade.branch_length > 0.2:
        clade.color = "red"
    else:
        clade.color = "blue"

# Draw the tree, save a high-resolution image, then close the figure.
figure, axes = plt.subplots(figsize=(8, 6))
Phylo.draw(tree, axes=axes, do_show=False)
figure.savefig("custom_tree.png", dpi=300, bbox_inches="tight")
plt.close(figure)
```

The `> 0.2` comparison makes a branch of exactly `0.2` blue. The plot
labels the tips with gene names such as `MAPK1`. It removes the generated
internal node labels. Keep the full IDs in your alignment file so results
remain traceable to their source records.

### Question 6: Customise a tree plot

Build an NJ tree using BLOSUM62. Remove internal labels, show gene names at
the tips, colour branches longer than `0.2` red and all other branches blue,
and save the result to `custom_tree.png` at 300 dpi. Compare the plot with the
tree structure printed to the terminal.

### Question 7: Compare NJ and UPGMA trees

Use the same alignment and BLOSUM62 distance matrix to build an NJ tree and an
UPGMA tree. Print both tree structures and save the figures as `nj_tree.png`
and `upgma_tree.png`. Note which groups are the same and which differ. UPGMA
assumes a molecular clock. NJ does not make that same assumption.

## Retrieve protein records from NCBI

<iframe title="Retrieve protein records from NCBI" width="560" height="315" src="https://www.youtube.com/embed/GYrjsWoUPiY?si=6mCdBCrvLf66Zs-u" loading="lazy" allow="accelerometer, autoplay, clipboard-write, encrypted-media, gyroscope, picture-in-picture, web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Biopython's `Entrez` module sends searches and retrieval requests to NCBI.
`efetch` can return a GenBank record, which `SeqIO.read` turns into a
`SeqRecord`. Set `Entrez.email` to your own valid email address before making
requests, and keep requests at a reasonable rate. The example below makes only
a few individual requests. NCBI asks clients to make no more than three
requests per second.

```python
from Bio import Entrez, SeqIO
from urllib.error import URLError

# NCBI uses this address to identify the person making requests.
Entrez.email = "your.name@example.edu"  # Replace with your own email address.
accessions = ["KYF48150.1", "NP_000537.3", "AAH69243.1"]
records = []

for accession in accessions:
    try:
        # Request one GenBank protein record and parse it as a SeqRecord.
        with Entrez.efetch(
            db="protein", id=accession, rettype="gb", retmode="text"
        ) as handle:
            record = SeqIO.read(handle, "genbank")
    except (OSError, URLError, ValueError) as error:
        print(f"Could not retrieve {accession}: {error}")
        continue

    # GenBank annotations include metadata that FASTA does not retain.
    organism = record.annotations.get("organism", "Unknown organism")
    print(record.id, record.description)
    print("Organism:", organism)
    print("Length:", len(record.seq))
    records.append(record)

if records:
    # Save all successfully retrieved sequences in FASTA format.
    SeqIO.write(records, "ncbi_proteins.fasta", "fasta")
    print("Wrote", len(records), "records to ncbi_proteins.fasta")
else:
    print("No records were retrieved, so no FASTA file was written.")
```

This example continues after a retrieval or parsing error so one invalid
accession does not prevent the other records from being saved. FASTA stores
the sequence and description, but not all the annotations from the GenBank
record. See the [Biopython Entrez tutorial](https://biopython.org/docs/latest/Tutorial/chapter_entrez.html)
and [NCBI E-utilities guidance](https://www.ncbi.nlm.nih.gov/books/NBK25497/)
for more detail.

### Question 8: Retrieve protein sequences

Use `Entrez.efetch` to retrieve the three example accessions from the protein
database. Print each record's ID, description, organism, and sequence length.
Write every successfully retrieved sequence to `ncbi_proteins.fasta`, and
handle an accession that cannot be retrieved.

## Search PubMed and write a bibliography

Use `Entrez.esearch` to find PubMed identifiers, then `Entrez.efetch` and
`Medline.parse` to retrieve citation fields. This example writes a numbered
bibliography with the title, authors, publication year, PMID, and journal:

```python
from Bio import Entrez, Medline

# Replace this placeholder with your own valid contact email.
Entrez.email = "your.name@example.edu"  # Replace with your own valid email.
search_term = "CRISPR gene editing 2024"

def format_author(author):
    """Format a MEDLINE author as surname and first initial."""
    parts = author.split()
    if len(parts) > 1:
        return f"{parts[0]} {parts[1][0]}"
    return author

# Search PubMed and keep the IDs returned by the query.
with Entrez.esearch(db="pubmed", term=search_term, retmax=20) as handle:
    search_results = Entrez.read(handle)
identifiers = search_results["IdList"]

if not identifiers:
    print("No PubMed records matched the search.")
else:
    # Fetch citation metadata for the matching IDs in one request.
    with Entrez.efetch(
        db="pubmed", id=",".join(identifiers),
        rettype="medline", retmode="text",
    ) as handle:
        records = list(Medline.parse(handle))

    # Write one formatted citation at a time to the bibliography file.
    with open("pubmed_bibliography.txt", "w", encoding="utf-8") as output:
        for number, record in enumerate(records, start=1):
            title = record.get("TI", "Untitled")
            authors = [format_author(author) for author in record.get("AU", [])]
            year = record.get("DP", "Year unknown")[:4]
            pmid = record.get("PMID", "PMID unavailable")
            journal = record.get("JT", "Journal unavailable")
            output.write(f"{number}. {title}\n")
            output.write("   Authors: " + ", ".join(authors) + "\n")
            output.write(f"   Year: {year}, PMID: {pmid}, Journal: {journal}\n\n")

    print(f"Wrote {len(records)} citations to pubmed_bibliography.txt")
```

The query is interpreted by PubMed, so changing its words changes the results.
The script saves citation metadata, not article full text. If you change the
search to request many records, retrieve them in batches and avoid sending
rapid repeated requests.

### Question 9: Search PubMed

Search for up to 20 papers using a term you choose. Retrieve the MEDLINE
records, then write a numbered bibliography containing each title, all
authors, year, PMID, and journal when available. Try the example search term
first, then compare it with a more specific query.

## Bring the week together

This week's workflow moves from aligned sequences to evolutionary and database
questions:

1. MUSCLE aligns related proteins and inserts gaps where positions do not match.
2. `AlignIO` reads the result as rows and columns that Python can inspect.
3. Conservation scores summarize agreement across alignment columns.
4. Distance matrices support NJ and UPGMA tree construction.
5. `Phylo` draws trees and lets you change labels and branch colours.
6. `Entrez` retrieves protein records and searches PubMed.

Check each stage before trusting the next one: confirm the alignment file was
created, inspect a few rows and columns, check the distance matrix, and make
sure the tree or database report contains the records you expected.

### Additional resources

For further examples, see the [Biopython Phylo tutorial](https://biopython.org/docs/latest/Tutorial/chapter_phylo.html)
for working with phylogenetic trees and the [Biopython Entrez tutorial](https://biopython.org/docs/latest/Tutorial/chapter_entrez.html)
for searching and retrieving database records.

## Extension: combine the week into a pipeline

The Canvas workshop includes a larger challenge that links literature search,
sequence retrieval, alignment, conservation analysis, and tree construction.
Start with a small known list of accessions, save each stage's output, and
check it before moving to the next stage. Only combine the steps after each
part works on its own. You can also investigate sequence logos, alignment
quality measures, or approaches for finding possible orthologues.
