"""LIFE733 Portfolio Project 1, Part C. Student ID: 987654321.
Classify each row of three replicate measurements.
"""
# ORIGINAL QUESTION — PART C: CLASSIFY REPLICATE MEASUREMENTS
# Read the tab-separated table, skipping its header. For each row, reject
# measurements outside 0–2000; then check failed, uniform, duplicate,
# consistent, and outlier conditions in that order. Print each sample name and
# its classification using the exact labels specified in the book.
def classify(values):
    # Track invalid values and whether every reading is below ten.
    invalid = False
    all_below_ten = True
    for value in values:
        if value < 0 or value > 2000: invalid = True  # Apply the allowed range.
        if value >= 10: all_below_ten = False       # One value ends the failed-assay test.
    if invalid: return "Invalid"                    # Validation has priority.
    if all_below_ten: return "Failed assay"         # Then check a failed assay.
    if values[0] == values[1] and values[1] == values[2]: return "Uniform replicates"
    if values[0] == values[1] or values[0] == values[2] or values[1] == values[2]: return "Duplicate replicates"
    mean = sum(values) / len(values)                 # Compare each value to the mean.
    consistent = True
    for value in values:
        difference = value - mean
        if difference < 0: difference = -difference  # Convert to an absolute difference.
        if difference > 0.2 * mean: consistent = False  # More than 20% is an outlier.
    if consistent: return "Consistent assay"
    return "Outlier replicate"

rows = open("portfolio1_987654321_part-c_replicates.tsv", encoding="utf-8").read().splitlines()[1:]  # Skip the header.
output = []
for row in rows:
    fields = row.split("\t")                         # Separate the name and three readings.
    name = fields[0]                                   # The first field identifies the sample.
    values = [int(value) for value in fields[1:]]      # Convert text readings to integers.
    output.append(f"{name}: {classify(values)}")       # Store one output line per sample.
for line in output: print(line)
with open("part_c_results.txt", "w", encoding="utf-8") as handle:
    handle.write("\n".join(output) + "\n")
