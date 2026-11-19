# LIFE733 Portfolio Project 2 checker
# Student ID: 123456789
# Run from the project-2 folder after creating the required output files.

from pathlib import Path
import re

ROOT = Path(__file__).parent
INPUT = ROOT / "input"
OUTPUT = ROOT / "output"
TRANSCRIPT = ROOT / "project2_test_transcript.txt"

def read_fasta(path):
    records, header, sequence = {}, None, []
    with open(path, encoding="utf-8") as handle:
        for raw in handle:
            line = raw.strip()
            if line.startswith(">"):
                if header is not None: records[header] = "".join(sequence).upper()
                header, sequence = line[1:], []
            elif line: sequence.append(line)
    if header is not None: records[header] = "".join(sequence).upper()
    return records

def write_result(lines):
    print("\n".join(lines))
    TRANSCRIPT.write_text("\n".join(lines) + "\n", encoding="utf-8")

def find_orfs(sequence):
    result = []
    for frame in range(3):
        for start in range(frame, len(sequence) - 2, 3):
            if sequence[start:start + 3] != "ATG": continue
            for stop in range(start + 3, len(sequence) - 2, 3):
                if sequence[stop:stop + 3] in {"TAA", "TAG", "TGA"}:
                    result.append(sequence[start:stop + 3])
                    break
    return result

records = read_fasta(INPUT / "project2_123456789_sequences.fasta")
codons = {}
with open(INPUT / "project2_123456789_codons.tsv", encoding="utf-8") as handle:
    next(handle)
    for line in handle:
        codon, amino_acid = line.rstrip("\n").split("\t")
        codons[codon] = amino_acid
valid = {name: sequence for name, sequence in records.items() if sequence and set(sequence) <= set("ACGT")}
proteins = {name: "".join(codons[sequence[i:i + 3]] for i in range(0, len(sequence), 3)) for name, sequence in valid.items()}
motif_hits = {name: protein for name, protein in proteins.items() if any(re.search(r"N[^P][ST]", part) for part in protein.split("*"))}
expected_orfs = {}
for name, sequence in valid.items():
    for number, orf in enumerate(find_orfs(sequence), start=1): expected_orfs[name + "_orf_" + str(number)] = orf

checks = []
def compare_fasta(label, filename, expected):
    path = OUTPUT / filename
    if not path.exists():
        checks.append(label + ": missing " + str(path.relative_to(ROOT))); return
    actual = read_fasta(path)
    checks.append(label + (": correct" if actual == expected else ": incorrect records, headers, or sequences"))

compare_fasta("ORFs", "orfs.fasta", expected_orfs)
compare_fasta("Proteins", "proteins.fasta", proteins)
compare_fasta("Motif hits", "motif_hits.fasta", motif_hits)
summary = OUTPUT / "summary.tsv"
expected_header = "record_identifier\tdna_length\tvalidity\torf_count\tprotein_length\tstop_symbol_count\tmotif_hit_count"
expected_rows = [expected_header]
for name, sequence in records.items():
    if name not in valid:
        expected_rows.append("\t".join([name, str(len(sequence)), "invalid", "NA", "NA", "NA", "NA"]))
        continue
    protein = proteins[name]
    hit_count = sum(len(re.findall(r"N[^P][ST]", part)) for part in protein.split("*"))
    expected_rows.append("\t".join([name, str(len(sequence)), "valid", str(len(find_orfs(sequence))), str(len(protein)), str(protein.count("*")), str(hit_count)]))
if not summary.exists(): checks.append("Summary: missing output/summary.tsv")
elif summary.read_text(encoding="utf-8").splitlines() == expected_rows: checks.append("Summary: correct")
else: checks.append("Summary: incorrect header, values, or row order")
passed = sum(check.endswith("correct") for check in checks)
checks.append("Score: " + str(passed) + "/4")
checks.append("Status: complete" if passed == 4 else "Status: incomplete — correct the files above and run this checker again.")
write_result(checks)
