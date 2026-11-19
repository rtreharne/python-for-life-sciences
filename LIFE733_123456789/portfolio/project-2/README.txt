LIFE733 Portfolio Project 2
Dataset version: 1
Student ID: 123456789

START HERE
1. Open the extracted project-2 folder in VS Code.
2. Use the files in practice/ to develop and test your code first.
3. Complete fasta_tools.py and main.py.
4. Run python main.py from the project-2 folder.
5. Run python test_project2.py from the project-2 folder. It writes project2_test_transcript.txt.

INPUTS
Keep every file in input/ unchanged. They are your individual dataset.

OUTPUTS
Your program must create these files in output/:
- orfs.fasta: candidate ORFs. Use headers such as gene_1_orf_1, gene_1_orf_2.
- proteins.fasta: translated valid full records, retaining each input identifier.
- motif_hits.fasta: translated records with one or more motif matches; create an empty file if there are none.
- summary.tsv: one row per input record, in input order, with this exact header:
  record_identifier\tdna_length\tvalidity\torf_count\tprotein_length\tstop_symbol_count\tmotif_hit_count
  Use lowercase valid or invalid. For invalid records use NA in all analysis columns.

GAI USE
Record meaningful GAI use in gai_log.txt. GAI must not generate your code, pseudocode, algorithm, or solution directly.
