"""LIFE733 Portfolio Project 1, Part D. Student ID: 987654321.
Validate FASTA records and report GC percentage and category.
"""
# ORIGINAL QUESTION — PART D: VALIDATE SEQUENCES
# Read all FASTA records, joining wrapped sequence lines. A valid sequence is
# nonempty, contains only A/C/G/T, and has a length divisible by three. For
# valid records calculate GC percentage and classify it as AT-rich (<40%),
# Balanced (40–60% inclusive), or GC-rich (>60%). Report each record and a
# valid/invalid summary using the exact format shown in the book.
records = {}
header = None
sequence = ""
with open("portfolio1_987654321_part-d_sequences.fasta", encoding="utf-8") as handle:
    for raw in handle:
        line = raw.strip()
        if line.startswith(">"):
            if header is not None: records[header] = sequence.upper()
            header, sequence = line[1:], ""
        elif line:
            sequence += line
if header is not None: records[header] = sequence.upper()

valid = 0
output = []
for name, sequence in records.items():
    valid_sequence = True
    if not sequence or len(sequence) % 3: valid_sequence = False
    for base in sequence:
        if base not in "ACGT": valid_sequence = False
    if not valid_sequence:
        output.append(f"{name}: invalid")
        continue
    gc = 100 * (sequence.count("G") + sequence.count("C")) / len(sequence)
    category = "AT-rich" if gc < 40 else "Balanced" if gc <= 60 else "GC-rich"
    output.append(f"{name}: valid, length={len(sequence)}, GC={gc:.2f}%, category={category}")
    valid += 1
output.append(f"Summary: {valid} valid, {len(records) - valid} invalid")
for line in output: print(line)
with open("part_d_results.txt", "w", encoding="utf-8") as handle:
    handle.write("\n".join(output) + "\n")
