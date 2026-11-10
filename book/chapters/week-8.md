---
title: "Week 8: External programs and Biopython"
authors:
  - name: Andy Jones
---

# Week 8: External programs and Biopython

Week 8 begins the second half of the module. You will use Python to work with
programs that were written by somebody else, including the command-line
program BLAST and the Biopython library. The Python ideas are familiar ones:
variables, loops, conditions, functions, dictionaries, regular expressions,
and files. The new part is learning how to connect those ideas to useful
bioinformatics tools.

## What you will learn

By the end of this chapter, you should be able to:

- work confidently in a terminal and identify files in the current folder
- supply command-line arguments with `sys.argv` or `argparse`
- run a command-line program from Python with `os.system`
- create a local BLAST database and run a BLAST search
- read tab-separated BLAST output and filter hits by numerical criteria
- install and import Biopython
- use `Seq`, `SeqRecord`, and `SeqIO` for common sequence tasks
- combine regular expressions, dictionaries, and Biopython to analyse FASTA files.

The commands in this chapter are examples. The exact BLAST executable names
and installation steps can vary between Windows, macOS, Linux, and
university-managed computers. If a command is not found, see the [BLAST+
installation appendix](#appendix-install-blast) before changing your Python
code.

## Set up your Week 8 folder

Create a new folder for this week's work and open it in VS Code. Use the
integrated terminal rather than the play button for the examples in this
chapter. A terminal command makes the current folder, program, and arguments
visible:

```bash
python script.py
```

On some computers the command is `py script.py` or `python3 script.py`.
Use whichever command successfully ran your earlier Python programs.

Your folder will eventually contain your programs, the supplied data, a local
BLAST database, and output files. Keep the supplied input files unchanged.
write databases and results to new names.

```text
week-8/
├── q1.py … q9.py
├── ToxoDB-68_TgondiiME49_AnnotatedProteins.fasta
├── ToxoDB-68_NcaninumLIV_AnnotatedProteins.fasta
├── Ncaninum_input_for_BLAST.txt
├── UP000005640_9606.fasta
├── tgondii_proteins.*             ← Created by makeblastdb
└── toxodb_blast.tsv               ← Created by blastp
```

This is a folder diagram, not a request to create a file literally named
`q1.py … q9.py`. Use a separate Python file for each question if that helps
you keep your work organised.

### Download the Week 8 data

All required sequence data is available here. You do not need to retrieve it
from Canvas. Download each file into your `week-8` folder before you reach the
relevant question:

- [Toxoplasma gondii annotated proteins](../week-8/ToxoDB-68_TgondiiME49_AnnotatedProteins.fasta): database for the BLAST exercises (8,204 protein records).
- [Neospora caninum annotated proteins](../week-8/ToxoDB-68_NcaninumLIV_AnnotatedProteins.fasta): an additional protein FASTA file for practice (7,115 records).
- [Neospora BLAST queries](../week-8/Ncaninum_input_for_BLAST.txt): three protein FASTA records to search against the Toxoplasma database. Despite the `.txt` extension, this is a FASTA-formatted file.
- [Human reference proteome](../week-8/UP000005640_9606.fasta): input for the gene-name exercise (20,659 protein records).
- [Week 8 slide deck](https://canvas.liverpool.ac.uk/courses/95131/modules/items/2725138): optional visual companion to the command-line BLAST and Biopython material. Slides 2 to 19 follow the BLAST workflow. Slides 20 to 38 introduce Biopython objects and FASTA parsing.

These are sizeable files, especially the human proteome. Download them once,
then work on local copies. When a question below says `proteins.fasta`, replace
it with the appropriate supplied filename or a small FASTA file of your own.

Check the folder before you begin:

```bash
pwd
ls
```

On Windows, `cd` shows the current folder and `dir` lists its contents. A
surprising number of apparent Python or BLAST errors are actually caused by
running a command in the wrong folder.

## Supply information when you run a script

You learned to use `sys.argv` in Week 6. This section briefly recaps how
command-line arguments can supply filenames and settings, then introduces
`argparse` as a way to handle named options.

So far, you may have written filenames and thresholds directly in a script:

```python
input_file = "sequences.fasta"
threshold = 0.05
```

That is useful while you are learning, but it means editing the program each
time you want to analyse another file. A command-line argument supplies the
value when you run the script instead:

```bash
python analyse.py sequences.fasta 0.05
```

The same script can then be reused with different files and settings. The
complete command also records exactly what was analysed.

### Read simple arguments with `sys.argv`

Python stores command-line arguments in a list called `sys.argv`. The first
item is the script name, so the arguments you supply begin at position `1`:

```python
import sys

if len(sys.argv) != 2:
    print("Usage: python show_argument.py TEXT")
    sys.exit(1)

print("Script name:", sys.argv[0])
print("Argument:", sys.argv[1])
```

Save this as `show_argument.py` and run it with:

```bash
python show_argument.py sample_A
```

Everything in `sys.argv` starts as text. Convert a value before treating it as
a number:

```python
threshold = float(sys.argv[1])
max_hits = int(sys.argv[2])
```

Always check the number of arguments before accessing the list. Otherwise,
running a script without enough information causes an `IndexError`.

### Use `argparse` for named options

For a script with several settings, Python's standard-library `argparse`
module gives users named options, sensible defaults, validation, and an
automatic help page:

```python
import argparse

parser = argparse.ArgumentParser(
    description="Report the number of sequences in a FASTA file"
)
parser.add_argument("input_file", help="Path to a FASTA file")
parser.add_argument(
    "--min-length",
    type=int,
    default=100,
    help="Minimum sequence length to include (default: 100)",
)
parser.add_argument(
    "--output",
    "-o",
    default="results.txt",
    help="Output filename (default: results.txt)",
)

args = parser.parse_args()
print("Input:", args.input_file)
print("Minimum length:", args.min_length)
print("Output:", args.output)
```

Run the script with its defaults:

```bash
python fasta_report.py proteins.fasta
```

Or change named options without needing to remember their position:

```bash
python fasta_report.py proteins.fasta --min-length 200 --output long_proteins.txt
```

The command below displays the help text generated from the descriptions and
`help` values in the program:

```bash
python fasta_report.py --help
```

## Find files from Python

Python can inspect the contents of a folder. The `os` module also lets a
program ask the operating system to run a command. Start with a directory
listing:

```python
import os

os.system("ls")
```

On Windows, use `dir` instead of `ls`:

```python
import os

os.system("dir")
```

The command's output is printed, but it is not yet data that Python can loop
over. A more portable approach for finding files is the `os` module's directory
functions:

```python
import os

for filename in os.listdir("."):
    if filename.endswith((".fasta", ".fa")):
        size = os.path.getsize(filename)
        print(filename, size, "bytes")
```

The argument `"."` means the current directory. `endswith` accepts a tuple of
possible endings, so this finds both `.fasta` and `.fa` files. This is a useful
pattern whenever a script should discover its input files rather than having
one filename permanently written into the code.

You can also send a command's output to a file, then read that file with
Python. The redirection symbol `>` is handled by the terminal:

```python
import os

listing_file = "directory_listing.txt"
os.system("dir > " + listing_file)

with open(listing_file) as file:
    for line in file:
        if ".fasta" in line or ".fa" in line:
            print("Possible FASTA file:", line.strip())
```

On macOS or Linux, replace `dir` with `ls`. This approach is useful for seeing
how Python can collect the output of another program. For your own scripts,
`os.listdir` is usually clearer and works across operating systems.

### Question 1: Directory listing and file discovery

Write a program that lists the files in the current directory. Identify every
FASTA file and print its size in bytes. Test the program in a folder containing
at least two files with different extensions.

## Run an external program

BLAST is a collection of command-line programs for comparing biological
sequences. Rather than opening a website and clicking through a form, you can
run BLAST locally and save its output. The command-line approach is repeatable:
the input file, settings, and output filename are all visible in the command.

> **Slide companion:** The [Week 8 slide deck](https://canvas.liverpool.ac.uk/courses/95131/modules/items/2725138)
> gives a visual walkthrough of external commands and local BLAST in slides 2
> to 19. It also illustrates the sequence-search results that the commands
> below create.

<iframe title="Week 8 walkthrough: external programs and BLAST" width="560" height="315" src="https://www.youtube-nocookie.com/embed/tfnkqI_sj1M" loading="lazy" style="display: block; width: min(560px, 100%); height: auto; aspect-ratio: 16 / 9; margin: 1rem 0 1.5rem; border: 0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

Before calling BLAST from Python, make sure the command works in the terminal.
For example, check the installation with:

```bash
blastp -version
```

If the command is not recognised, follow the instructions in the [BLAST+
installation appendix](#appendix-install-blast) for your operating system.

### Create a BLAST database

`makeblastdb` turns a FASTA file into indexed files that BLAST can search. For
a protein FASTA file, use `-dbtype prot`. This example uses the supplied
Toxoplasma protein file:

```bash
makeblastdb -in ToxoDB-68_TgondiiME49_AnnotatedProteins.fasta -dbtype prot -out tgondii_proteins
```

The output name is a prefix. BLAST creates several files, including files with
the extensions `.phr`, `.pin`, and `.psq`. A successful command usually prints
a message saying that the database was created. These indexed files are the
database that BLAST searches. Keep them together in the same folder and do not
rename or move them after creating the database.

If you need a reminder of the available options, ask BLAST for its built-in
documentation in VS Code's integrated terminal:

```bash
makeblastdb -help
```

The same command can be built and run in Python:

```python
import os

fasta_file = "ToxoDB-68_TgondiiME49_AnnotatedProteins.fasta"
database = "tgondii_proteins"

command = (
    "makeblastdb -in " + fasta_file
    + " -dbtype prot -out " + database
)

print(command)
result = os.system(command)

if result == 0:
    print("Successfully created", database)
    for extension in (".phr", ".pin", ".psq"):
        filename = database + extension
        if os.path.exists(filename):
            print(filename, "created")
        else:
            print(filename, "missing")
else:
    print("The BLAST database command failed")
```

`os.system` returns a status value. In this simple example, zero means that
the command completed successfully. Checking the status and the expected files
is better than assuming that a command worked.

For real projects, filenames can contain spaces or characters that have a
special meaning to the shell. Later in the module you may meet safer process
tools such as `subprocess`. For the present exercise, keep filenames simple and
learn to inspect the command that your program prints.

### Question 2: Create a database

Use `ToxoDB-68_TgondiiME49_AnnotatedProteins.fasta` to create a database with
a clear name. Write Python code that checks the return value from `os.system`
and checks that the expected index files exist. Print a useful success or
failure message.

## Run BLAST and read tab-separated output

Use the supplied Neospora query file and the database you just created. A
protein search can be run with `blastp`:

```bash
blastp -query Ncaninum_input_for_BLAST.txt -db tgondii_proteins -out toxodb_blast.tsv -outfmt 6
```

The option `-outfmt 6` requests a compact tab-separated format. The columns
are, in order:

1. query sequence ID
2. subject sequence ID
3. percentage identity
4. alignment length
5. number of mismatches
6. number of gap openings
7. query start
8. query end
9. subject start
10. subject end
11. E-value
12. bit score.

The output has no column-heading line, so your program must remember the
column positions. Python counts from zero, which means percentage identity is
at position `2` and E-value is at position `10`.

Without `-outfmt 6`, BLAST writes a human-readable report containing the
alignments. That is useful when inspecting a small number of hits. The
tab-separated version is a better input for a Python program and can also be
opened in spreadsheet software for a quick check.

Read and filter the file like this:

```python
hits = 0

with open("toxodb_blast.tsv") as file:
    for line in file:
        fields = line.strip().split("\t")

        if len(fields) < 12:
            continue

        percent_identity = float(fields[2])
        evalue = float(fields[10])

        if evalue < 1e-10 and percent_identity > 70:
            print(fields[0], fields[1], percent_identity, evalue)
            hits += 1

print("Significant hits:", hits)
```

The `split("\t")` call is important: a tab-separated file is not the same as
a file separated by ordinary spaces. Converting the two numerical fields with
`float` allows Python to compare them with numerical thresholds.

### Question 3: Filter BLAST results

Run the supplied Neospora queries against your Toxoplasma database with
`-outfmt 6`. Write a script that reads `toxodb_blast.tsv`, prints only hits
with E-value below `1e-10` and percentage identity above `70`, and reports the
total number of retained hits. Add a header to your printed report so that
somebody else can understand the columns.

## Use Biopython sequence objects

Biopython is a collection of Python modules for biological computation. Install
it in the environment used for this work, then test the import:

```bash
python -m pip install biopython
```

> **Slide companion:** Use slides 20 to 38 of the [Week 8 slide deck](https://canvas.liverpool.ac.uk/courses/95131/modules/items/2725138)
> for diagrams of `Seq` and `SeqRecord` objects, plus additional examples of
> FASTA parsing and motif searches.

<iframe title="Week 8 walkthrough: Biopython sequences and FASTA" width="560" height="315" src="https://www.youtube-nocookie.com/embed/i2Wjr81B4Mo" loading="lazy" style="display: block; width: min(560px, 100%); height: auto; aspect-ratio: 16 / 9; margin: 1rem 0 1.5rem; border: 0;" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

### What an object is

An **object** is a value that keeps related data and useful operations together.
For example, a number has methods such as `bit_length`, and a string has methods
such as `upper`. A Biopython `Seq` object holds a sequence and provides
biologically meaningful operations such as transcription, reverse complement,
and translation. You ask an object to perform one of its operations with a dot:

```python
sequence = "atgca"
print(sequence.upper())
```

Here, `sequence` is a string object and `upper()` is one of its methods. The
same pattern applies to a `Seq` object. Later, a `SeqRecord` will combine a
sequence with its identifier, description, and other annotations. You do not
need to design your own object classes this week. The goal is to use the
well-tested objects supplied by Biopython and understand what data each holds.

Biopython's `Seq` object represents a biological sequence and provides useful
methods. It behaves much like a string, but its methods make the intended
biological operation explicit:

```python
from Bio.Seq import Seq

dna = Seq("ATGGCCATTGTAATGGGCCGCTGAAAGGGTGCCCGATAG")

print("DNA:", dna)
print("RNA:", dna.transcribe())
print("Reverse complement:", dna.reverse_complement())
print("Protein:", dna.translate())
print("DNA length:", len(dna))
```

Like a string, a `Seq` object supports indexing and slicing. Slicing returns a
new `Seq` object, so you can select a region while keeping its sequence-aware
methods:

```python
from Bio.Seq import Seq

sequence = Seq("AGTACACTGGT")
print(sequence[0])
print(sequence[1:4])
print(type(sequence[1:4]))
```

The output is `A`, then `GTA`, followed by the Biopython `Seq` type. You can
also join two compatible `Seq` objects with `+`, just as you join strings.

Transcription replaces the DNA alphabet with the corresponding RNA alphabet.
The reverse complement reverses the sequence and complements each base.
Translation reads the sequence in codons of three bases. In a real analysis,
you should confirm the reading frame and decide how to handle stop codons
before interpreting the protein sequence.

### Question 4: Explore a `Seq`

Create the DNA `Seq` shown above. Print the DNA, RNA, reverse complement, and
translated protein, together with the length of each. Explain in a comment why
the translated sequence is shorter than the DNA sequence.

## Read FASTA files with `SeqIO`

FASTA files contain one or more records. A record begins with a line starting
with `>` followed by an identifier and description. The following lines contain
the sequence, sometimes wrapped over several lines.

Biopython's `SeqIO.parse` handles those details:

```python
from Bio import SeqIO

for record in SeqIO.parse("proteins.fasta", "fasta"):
    print(record.id, len(record.seq))
```

`record.id` is the identifier, while `record.seq` is a `Seq` object. You can
convert the sequence to text when using ordinary string operations:

```python
sequence = str(record.seq)
```

### Question 5: FASTA statistics

Write a program that reads
`ToxoDB-68_NcaninumLIV_AnnotatedProteins.fasta` and reports:

- the total number of sequences
- the average sequence length
- the shortest sequence and its ID
- the longest sequence and its ID
- the total number of amino acids or nucleotides.

Remember to handle an empty FASTA file without dividing by zero.

## Search for motifs with regular expressions

Regular expressions are useful for describing patterns in sequences. The motif
`K[RK]R` means lysine, followed by either lysine or arginine, followed by
arginine. Compile the pattern once, then search every record:

```python
import re
from Bio import SeqIO

pattern = re.compile(r"K[RK]R")
sequences_with_motif = 0
total_matches = 0

for record in SeqIO.parse("proteins.fasta", "fasta"):
    sequence = str(record.seq)
    matches = list(pattern.finditer(sequence))

    if matches:
        sequences_with_motif += 1
        total_matches += len(matches)
        print("Sequence:", record.id)

        for match in matches:
            start = match.start()
            end = match.end()
            context_start = max(0, start - 10)
            context_end = min(len(sequence), end + 10)
            context = sequence[context_start:context_end]
            print(" position:", start, "match:", match.group())
            print(" context:", context)

print("Sequences containing the motif:", sequences_with_motif)
print("Total motif occurrences:", total_matches)
```

`match.start()` uses zero-based positions. `max` and `min` prevent the context
slice from going beyond the beginning or end of a sequence.

### Question 6: Search for a motif

Search `ToxoDB-68_NcaninumLIV_AnnotatedProteins.fasta` for `K[RK]R`. For every
match, print the sequence ID, position, matched text, and up to ten amino acids
of context on either side. Report both the number of sequences containing the
motif and the total number of occurrences.

## Create and write `SeqRecord` objects

`Seq` represents sequence data. `SeqRecord` wraps a sequence with information
about that sequence, such as an ID, name, description, and annotations:

```python
from Bio.Seq import Seq
from Bio.SeqRecord import SeqRecord
from Bio import SeqIO

record = SeqRecord(
    Seq("MKTAYIAKQRQISFVKSHF"),
    id="PROT001",
    name="example_protein",
    description="Example protein sequence",
)
record.annotations["organism"] = "Homo sapiens"
record.annotations["function"] = "Example function"

SeqIO.write(record, "one_protein.fasta", "fasta")
```

To write several records, put them in a list and pass the list to
`SeqIO.write`. Read the file back afterwards to verify what was written.

### Question 7: Create custom records

Create three made-up protein `SeqRecord` objects. Give each an ID, name,
description, organism annotation, and function annotation. Write them to
`my_proteins.fasta`, then read the file back and print each ID and length.

## Use dictionaries to organise records

A dictionary is useful when you need to find a sequence by its identifier. This
program stores records, sorts their IDs, and writes only sequences longer than
100 amino acids:

```python
from Bio import SeqIO

records = {}

for record in SeqIO.parse("proteins.fasta", "fasta"):
    records[record.id] = record

selected = []
for identifier in sorted(records):
    record = records[identifier]
    if len(record.seq) > 100:
        selected.append(record)

SeqIO.write(selected, "sorted_long_proteins.fasta", "fasta")
print("Wrote", len(selected), "records")
```

The dictionary makes the relationship between an ID and its record explicit.
Sorting the keys gives a reproducible order, which makes output easier to
inspect and compare.

### Question 8: Sort and filter FASTA records

Read `ToxoDB-68_NcaninumLIV_AnnotatedProteins.fasta` into a dictionary keyed by
sequence ID. Write a new FASTA file containing only sequences longer than 100
amino acids, in alphabetical ID order. Check that the output has the expected
records.

## Extract information from FASTA descriptions

FASTA descriptions often contain useful fields, but their format depends on the
source database. A regular expression can extract a field when the format is
known. For example, if descriptions contain `GN=TP53`, search for the gene
name:

```python
import re
from Bio import SeqIO

gene_pattern = re.compile(r"GN=([^ ]+)")

for record in SeqIO.parse("human_proteome.fasta", "fasta"):
    match = gene_pattern.search(record.description)
    if match and match.group(1).startswith("TP53"):
        print(match.group(1), record.id, len(record.seq))
        print(str(record.seq)[:50])
```

The expression captures the text after `GN=` up to the next space. Inspect a
few real descriptions before writing a pattern: not every FASTA database uses
the same labels.

### Question 9: Find proteins by gene name

Using `UP000005640_9606.fasta`, find proteins whose gene names start with
`TP53`. Write a summary containing the gene name, protein ID, sequence length,
and first 50 amino acids. Also write the matching records to a new FASTA file.

## When an external analysis does not work

When a script combines Python, files, Biopython, and BLAST, debug one layer at
a time:

1. Check that the terminal is in the folder containing the input file.
2. Run `blastp -version` or `makeblastdb -version` directly.
3. Print the command that Python is about to run.
4. Check the return value from `os.system`.
5. Check that the expected output file was created and is not empty.
6. Print the first line of a result file before parsing every line.
7. Confirm the number and types of fields after `split("\t")`.
8. Test Biopython with one short, known sequence before opening a large FASTA file.

For a missing-file error, inspect the filename and current folder. For an
`IndexError`, inspect the number of command-line arguments or tab-separated
fields. For a `ValueError`, look for a text value that you tried to convert to
`int` or `float`.

## Bring the week together

This week connects Python to a larger analysis workflow:

1. A FASTA file supplies biological sequences.
2. `makeblastdb` prepares sequences for searching.
3. `blastp` produces tab-separated search results.
4. Python reads and filters those results.
5. Biopython provides sequence-aware objects and FASTA parsing.
6. Regular expressions and dictionaries help find and organise records.

The important habit is to treat every stage as data that can be checked. Print
commands before running them, inspect files after programs create them, and
verify a few records before trusting a summary of a large dataset.

Compare your attempts with the [Week 8 solutions](../solutions.md#week-8-external-programs-and-biopython).

(appendix-install-blast)=
## Appendix: Install BLAST+ on your computer

BLAST+ is a set of command-line programs. These instructions install the
programs needed in this chapter, including `blastp` and `makeblastdb`. Use the
integrated terminal in VS Code for the commands, and open a new terminal after
an installation or PATH change.

Download installers and archives from the [NCBI BLAST+ latest download
directory](https://ftp.ncbi.nlm.nih.gov/blast/executables/blast+/LATEST/).
NCBI lists supported package types and platform guidance in its [BLAST Command
Line Applications User Manual](https://www.ncbi.nlm.nih.gov/books/NBK569861/).

### Windows

On a University-managed PC, use **Install University Applications** to install
BLAST+, if it is available. On a personal 64-bit Windows computer:

1. In the NCBI download directory, download the file ending in `win64.exe`.
2. Run the installer and follow its prompts.
3. Open a new VS Code terminal and check the installation:

```powershell
blastp -version
```

If PowerShell says that `blastp` is not recognised, find the BLAST+
installation's `bin` folder. Search Windows for **Edit environment variables
for your account**, select **Path**, add the full path to that `bin` folder,
and open a new terminal. Run the version command again.

### macOS

If [Homebrew](https://brew.sh/) is installed, open a VS Code terminal and run:

```bash
brew install blast
blastp -version
```

The `blast` formula installs the BLAST+ command-line programs. If you do not
use Homebrew, download the current macOS package from the [NCBI download
directory](https://ftp.ncbi.nlm.nih.gov/blast/executables/blast+/LATEST/) and
follow the included installer or archive instructions. Choose the package
that matches your Mac. If you use an archive, extract it and add its `bin`
folder to your shell PATH. For example, after placing the extracted folder at
`/usr/local/ncbi-blast`, add this line to `~/.zshrc`:

```bash
export PATH="/usr/local/ncbi-blast/bin:$PATH"
```

Open a fresh terminal, or run `source ~/.zshrc`, and check with
`blastp -version`. If macOS blocks an executable, use **System Settings >
Privacy & Security** to review the block. Only proceed with software obtained
from NCBI.

### Linux

#### Ubuntu: install from the VS Code terminal (recommended)

On Ubuntu, you can install BLAST+ directly from the Ubuntu package repository.
Open **Terminal > New Terminal** in VS Code and run:

```bash
sudo apt update
sudo apt install ncbi-blast+
```

Enter your Ubuntu password if prompted. The terminal does not show characters
while you type the password; this is normal. Check that the commands are
available:

```bash
blastp -version
makeblastdb -version
```

Ubuntu provides the `ncbi-blast+` package for supported releases. If `apt`
reports that it cannot find the package, check that the Ubuntu **Universe**
repository is enabled or use the NCBI archive instructions below.

#### Other Linux distributions or Ubuntu fallback

For a 64-bit Linux computer, download the archive ending in `x64-linux.tar.gz`
from the [NCBI download directory](https://ftp.ncbi.nlm.nih.gov/blast/executables/blast+/LATEST/).
In a terminal, go to the directory where the archive was downloaded, extract
it, and move the resulting `ncbi-blast-...` folder to a location you own, such
as `~/.local/opt/`:

```bash
mkdir -p "$HOME/.local/opt"
tar -xzf ncbi-blast-*-x64-linux.tar.gz -C "$HOME/.local/opt"
```

The extracted folder name includes the BLAST+ version. Add its `bin` folder
to PATH, replacing `<extracted-folder>` with that exact folder name:

```bash
export PATH="$HOME/.local/opt/<extracted-folder>/bin:$PATH"
```

To make this setting available in future Bash terminals, add the same `export`
line to `~/.bashrc` and open a new terminal. If you use another shell, add it
to that shell's startup file. Check the installation:

```bash
blastp -version
```

### Check that the programs are available

After installing BLAST+, both commands used in the local search should print
a version number:

```bash
blastp -version
makeblastdb -version
```

If either command is not found, check that the BLAST+ `bin` folder is on PATH
and that you opened a new terminal. On a managed computer, ask the course or
local IT support team for help if you cannot change PATH or install software.
