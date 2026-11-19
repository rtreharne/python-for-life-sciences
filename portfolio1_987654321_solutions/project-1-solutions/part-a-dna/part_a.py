"""LIFE733 Portfolio Project 1, Part A. Student ID: 987654321.
Read two DNA fragments, transform them, and report each result clearly.
"""
# ORIGINAL QUESTION — PART A: DNA STRING TRANSFORMATIONS
# Read the two DNA fragments in the data file. Join them and convert the
# combined sequence to uppercase. Print its length. Calculate the reverse
# complement, transcribe DNA to RNA, append seven A characters, and print the
# final RNA and its length. Keep the labels and formatting shown in the book.
# This script reads the individual generated dataset for student 987654321.
# The data file is beside this script in the extracted solution folder.
fragments = []
with open("portfolio1_987654321_part-a_fragments.txt", encoding="utf-8") as handle:
    for line in handle:
        if line.strip():
            fragments.append(line.strip())
fragment_1 = fragments[0]
fragment_2 = fragments[1]
dna = (fragment_1 + fragment_2).upper()          # Join and normalise case.
complements = {"A": "T", "T": "A", "C": "G", "G": "C"}
reverse_complement = ""
for base in dna[::-1]:
    reverse_complement += complements[base]
rna = dna.replace("T", "U")                     # Transcribe DNA to RNA.
rna_with_tail = rna + "A" * 7                    # Add seven adenines.
output = []
output.append("DNA: " + dna)
output.append("DNA length: " + str(len(dna)))
output.append("Reverse complement: " + reverse_complement)
output.append("RNA: " + rna_with_tail)
output.append("RNA length: " + str(len(rna_with_tail)))
for line in output: print(line)
with open("part_a_results.txt", "w", encoding="utf-8") as handle:
    handle.write("\n".join(output) + "\n")
