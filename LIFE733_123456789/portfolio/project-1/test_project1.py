# LIFE733 Portfolio Project 1 checker
# Student ID: 123456789
# Run this file from the project-1 folder after creating the four result files.

transcript = []
score = 0

def check_part(label, expected, filename):
    global score
    try:
        with open(filename, encoding="utf-8") as handle:
            actual = handle.read().strip()
    except FileNotFoundError:
        transcript.append(label + ": 0/25 — result file is missing: " + filename)
        return
    if actual == expected.strip():
        transcript.append(label + ": 25/25 — output is correct.")
        score += 25
    else:
        transcript.append(label + ": 0/25 — output does not match the expected result for this dataset.")
        transcript.append("  Check labels, spelling, rounding, line order, and that the script read the generated data file.")

# Part A: calculate the expected result from this student’s two fragments.
fragments = []
with open("part-a-dna/project1_123456789_part-a_fragments.txt", encoding="utf-8") as handle:
    for line in handle:
        if line.strip(): fragments.append(line.strip())
dna = (fragments[0] + fragments[1]).upper()
complements = {"A": "T", "T": "A", "C": "G", "G": "C"}
reverse_complement = ""
for base in dna[::-1]: reverse_complement += complements[base]
rna = dna.replace("T", "U") + "A" * 7
expected = "DNA: " + dna + "\nDNA length: " + str(len(dna)) + "\nReverse complement: " + reverse_complement + "\nRNA: " + rna + "\nRNA length: " + str(len(rna))
check_part("Part A", expected, "part-a-dna/part_a_results.txt")

# Part B: calculate the six summary values from the generated count file.
counts = []
with open("part-b-counts/project1_123456789_part-b_counts.txt", encoding="utf-8") as handle:
    for line in handle: counts.append(int(line.strip()))
ordered = sorted(counts)
total = sum(counts)
mean = total / len(counts)
variance = sum((value - mean) ** 2 for value in counts) / len(counts)
expected = f"Total: {total:.1f}\nMean: {mean:.1f}\nPopulation variance: {variance:.1f}\nPopulation standard deviation: {variance ** 0.5:.1f}\nMedian: {ordered[len(ordered) // 2]:.1f}\nRange: {max(counts) - min(counts):.1f}"
check_part("Part B", expected, "part-b-counts/part_b_results.txt")

# Part C: read every replicate row and apply the stated branch order.
def classify(values):
    invalid = False
    all_below_ten = True
    for value in values:
        if value < 0 or value > 2000: invalid = True
        if value >= 10: all_below_ten = False
    if invalid: return "Invalid"
    if all_below_ten: return "Failed assay"
    if values[0] == values[1] and values[1] == values[2]: return "Uniform replicates"
    if values[0] == values[1] or values[0] == values[2] or values[1] == values[2]: return "Duplicate replicates"
    mean = sum(values) / len(values)
    consistent = True
    for value in values:
        difference = value - mean
        if difference < 0: difference = -difference
        if difference > 0.2 * mean: consistent = False
    if consistent: return "Consistent assay"
    return "Outlier replicate"
expected_lines = []
with open("part-c-replicates/project1_123456789_part-c_replicates.tsv", encoding="utf-8") as handle:
    rows = handle.read().splitlines()[1:]
for row in rows:
    fields = row.split("\t")
    expected_lines.append(fields[0] + ": " + classify([int(value) for value in fields[1:]]))
check_part("Part C", "\n".join(expected_lines), "part-c-replicates/part_c_results.txt")

# Part D: parse FASTA records, then validate and classify each sequence.
records = {}
header = None
sequence = ""
with open("part-d-sequences/project1_123456789_part-d_sequences.fasta", encoding="utf-8") as handle:
    for raw in handle:
        line = raw.strip()
        if line.startswith(">"):
            if header is not None: records[header] = sequence.upper()
            header, sequence = line[1:], ""
        elif line: sequence += line
if header is not None: records[header] = sequence.upper()
expected_lines = []
valid = 0
for name, sequence in records.items():
    valid_sequence = True
    if not sequence or len(sequence) % 3: valid_sequence = False
    for base in sequence:
        if base not in "ACGT": valid_sequence = False
    if not valid_sequence:
        expected_lines.append(name + ": invalid")
        continue
    gc = 100 * (sequence.count("G") + sequence.count("C")) / len(sequence)
    category = "AT-rich" if gc < 40 else "Balanced" if gc <= 60 else "GC-rich"
    expected_lines.append(f"{name}: valid, length={len(sequence)}, GC={gc:.2f}%, category={category}")
    valid += 1
expected_lines.append(f"Summary: {valid} valid, {len(records) - valid} invalid")
check_part("Part D", "\n".join(expected_lines), "part-d-sequences/part_d_results.txt")

transcript.append("Score: " + str(score) + "/100")
if score == 100: transcript.append("Status: complete — all four portfolio parts produced the expected outputs.")
else: transcript.append("Status: incomplete — use the feedback above, correct the scripts, and run this checker again.")
for line in transcript: print(line)
with open("project1_test_transcript.txt", "w", encoding="utf-8") as handle:
    handle.write("\n".join(transcript) + "\n")
