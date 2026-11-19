"""LIFE733 Portfolio Project 1, Part B. Student ID: 987654321.
Calculate summary statistics from one integer per line.
"""
# ORIGINAL QUESTION — PART B: REPLICATE STATISTICS
# Read every integer in the generated counts file. Calculate the total, mean,
# population variance, population standard deviation, median, and range.
# Format each reported statistic to one decimal place. Do not assume a fixed
# number of values: use the data in this student's file.
counts = []
with open("portfolio1_987654321_part-b_counts.txt", encoding="utf-8") as handle:
    for line in handle:
        counts.append(int(line.strip()))
ordered = sorted(counts)
total = sum(counts)
mean = total / len(counts)
variance = sum((value - mean) ** 2 for value in counts) / len(counts)  # Population variance.
median = ordered[len(ordered) // 2]
output = []
output.append(f"Total: {total:.1f}")
output.append(f"Mean: {mean:.1f}")
output.append(f"Population variance: {variance:.1f}")
output.append(f"Population standard deviation: {variance ** 0.5:.1f}")
output.append(f"Median: {median:.1f}")
output.append(f"Range: {max(counts) - min(counts):.1f}")
for line in output: print(line)
with open("part_b_results.txt", "w", encoding="utf-8") as handle:
    handle.write("\n".join(output) + "\n")
