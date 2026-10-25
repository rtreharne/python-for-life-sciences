/* LIFE733 portfolio dataset format v1. No network requests or browser storage. */
(function (root) {
  'use strict';
  const VERSION = '1';
  function validateId(id) {
    if (typeof id !== 'string' || !/^[1-9][0-9]{8}$/.test(id)) {
      throw new Error('Enter a nine-digit student ID using digits only (100000000–999999999).');
    }
    return Number(id);
  }
  function random(seed) {
    let state = seed >>> 0;
    return function (min, max) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      return min + Math.floor((state / 4294967296) * (max - min + 1));
    };
  }
  function dnaTag(number) {
    // Fixed-width base-4 encoding is injective for every accepted ID (4^15 > 10^9).
    let result = '';
    for (let i = 0; i < 15; i++) {
      result = 'ACGT'[number % 4] + result;
      number = Math.floor(number / 4);
    }
    return result;
  }
  function codingTag(number) {
    // Encode 30 bits as two synonymous alanine codons: fixed length, distinct DNA.
    return number.toString(2).padStart(30, '0').split('').map(bit => bit === '0' ? 'GCT' : 'GCC').join('');
  }
  function fasta(records) {
    return records.map(([name, sequence]) => '>' + name + '\n' + sequence.match(/.{1,60}/g).join('\n') + '\n').join('');
  }
  const table = 'codon\tamino_acid\nATG\tM\nAAA\tK\nCCC\tP\nGGG\tG\nAAC\tN\nTCT\tS\nACT\tT\nGCT\tA\nGCC\tA\nTAA\t*\nTAG\t*\nTGA\t*\n';
  function crc32(text) {
    let crc = 0xffffffff;
    for (const byte of new TextEncoder().encode(text)) {
      crc ^= byte;
      for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }
  function zip(files) {
    const encoder = new TextEncoder(), chunks = [], central = [];
    let offset = 0;
    const u16 = value => new Uint8Array([value & 255, value >>> 8 & 255]);
    const u32 = value => new Uint8Array([value & 255, value >>> 8 & 255, value >>> 16 & 255, value >>> 24 & 255]);
    const join = arrays => { const result = new Uint8Array(arrays.reduce((n, a) => n + a.length, 0)); let at = 0; for (const a of arrays) { result.set(a, at); at += a.length; } return result; };
    for (const file of files) {
      const name = encoder.encode(file.path), data = encoder.encode(file.text), crc = crc32(file.text);
      const local = join([new Uint8Array([80,75,3,4]), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), name, data]);
      chunks.push(local);
      central.push(join([new Uint8Array([80,75,1,2]), u16(20), u16(20), u16(0), u16(0), u16(0), u16(0), u32(crc), u32(data.length), u32(data.length), u16(name.length), u16(0), u16(0), u16(0), u16(0), u32(0), u32(offset), name]));
      offset += local.length;
    }
    const directory = join(central);
    return join([...chunks, directory, new Uint8Array([80,75,5,6]), u16(0), u16(0), u16(files.length), u16(files.length), u32(directory.length), u32(offset), u16(0)]);
  }
  function gaiLogTemplate(project) {
    return 'LIFE733 Portfolio Project ' + project + ' — GAI use log\n\n' +
      'Complete this file honestly if you use generative AI (GAI) while working on this project. Keep it with your project files. If you do not use GAI, write: No GAI used for this project.\n\n' +
      'GAI may help you understand an error, explain a concept, suggest small tests, or review code that you have already written. Do not ask it to generate your code, pseudocode, algorithm, or a solution for any part of this project. Your submitted code must be written by you, and you must be able to explain and test it.\n\n' +
      'For each meaningful interaction, add an entry using this format:\n\n' +
      'Date:\nTool and account:\nTask and problem:\nMy attempt before using GAI:\nPrompt I used:\nSummary of the response:\nWhat I wrote, changed, or rejected myself:\nHow I checked my work:\n\n' +
      'Example — Microsoft Copilot\n' +
      'Date: 2026-10-25\nTool and account: Microsoft Copilot, University account\nTask and problem: Project ' + project + '; my program raises FileNotFoundError.\nMy attempt before using GAI: I checked the filename in my script and used ls in the terminal.\nPrompt I used: I have already written this Python file-reading code. Do not write or rewrite code for me. Explain what FileNotFoundError usually means and give me a checklist for checking my working folder and filename.\nSummary of the response: It suggested checking the terminal folder, exact spelling, and file extension.\nWhat I wrote, changed, or rejected myself: I corrected the filename after comparing it with ls output.\nHow I checked my work: I ran the script again and confirmed that it read my generated input.\n\n' +
      'Example — ChatGPT\n' +
      'Date: 2026-10-25\nTool and account: ChatGPT, personal account\nTask and problem: Project ' + project + '; I was unsure how to test a condition in my own function.\nMy attempt before using GAI: I wrote the function and tested one normal input.\nPrompt I used: Do not generate code or pseudocode. I have written a function that validates a DNA sequence. Suggest a few small edge cases I can use to test it, and explain what each test should reveal.\nSummary of the response: It suggested an empty sequence, an invalid base, and a valid sequence.\nWhat I wrote, changed, or rejected myself: I chose appropriate tests and wrote the test calls myself.\nHow I checked my work: I compared the results with the project requirements and traced my code.\n\n' +
      'Do not enter confidential, personal, patient, assessment, or other sensitive data into a GAI tool. Microsoft Copilot with your University account is the University-sanctioned option; follow current University and course guidance when using any other service.\n';
  }
  function generate(id, project) {
    const number = validateId(id);
    if (project !== 1 && project !== 2) throw new Error('Choose Project 1 or Project 2.');
    const rand = random(number + project * 1000000000);
    const prefix = 'project' + project + '_' + id;
    let files;
    if (project === 1) {
      const bases = length => Array.from({length}, () => 'ACGT'[rand(0, 3)]).join('');
      const fragment1 = dnaTag(number) + bases(9);
      const fragment2 = bases(24);
      const counts = Array.from({length: 7}, () => rand(10, 60));
      const uniform = rand(30, 180), duplicate = rand(30, 180), centre = rand(90, 150);
      const replicates = [
        [rand(30, 100), -rand(1, 5), rand(30, 100)],
        [rand(0, 9), rand(0, 9), rand(0, 9)],
        [uniform, uniform, uniform],
        [duplicate, duplicate, duplicate + 10],
        [centre - 4, centre, centre + 4],
        [rand(20, 30), rand(100, 110), rand(180, 190)]
      ];
      // Shuffle case order without changing the mix of classification branches.
      for (let i = replicates.length - 1; i > 0; i--) {
        const j = rand(0, i); [replicates[i], replicates[j]] = [replicates[j], replicates[i]];
      }
      files = [
        {name: prefix + '_part-a_fragments.txt', text: fragment1.toLowerCase() + '\n' + fragment2.toLowerCase() + '\n'},
        {name: prefix + '_part-b_counts.txt', text: counts.join('\n') + '\n'},
        {name: prefix + '_part-c_replicates.tsv', text: 'sample\treplicate_1\treplicate_2\treplicate_3\n' + replicates.map((r,i) => 'sample_' + (i+1) + '\t' + r.join('\t')).join('\n') + '\n'},
        {name: prefix + '_part-d_sequences.fasta', text: fasta([
          ['sequence_1', fragment1 + fragment2], ['sequence_2', 'AAT'.repeat(rand(8,12))],
          ['sequence_3', 'GCG'.repeat(rand(8,12))], ['sequence_4', 'ATGC'.repeat(6)],
          ['sequence_5', bases(9) + 'NNA'], ['sequence_6', bases(10)]
        ])}
      ];
    } else {
      const sense = ['AAA', 'CCC', 'GGG', 'GCT', 'GCC'];
      const middle = () => Array.from({length: 9}, () => sense[rand(0, sense.length-1)]).join('');
      files = [
        {name: prefix + '_sequences.fasta', text: fasta([
          ['gene_1', 'ATG' + codingTag(number) + middle() + 'AACGCTTCTTAA'],
          ['gene_2', 'ATG' + middle() + 'AACCCCTCTTAG'],
          ['gene_3', 'ATG' + middle() + 'AAATGA'],
          ['gene_4', 'ATGAAAATG' + middle() + 'TAG'],
          ['gene_5', 'ATG' + middle() + 'AACGCCACTTAA'],
          ['gene_6', 'ATG' + middle() + 'GGGTAG'],
          ['gene_7', 'ATGNAA'], ['gene_8', 'ATGXAA']
        ])},
        {name: prefix + '_codons.tsv', text: table}
      ];
    }
    const resultInstructions = project === 1
      ? '\n\nRESULT FILES\nRun each script while the terminal is inside its own part folder. Each script must print its result and save it with this exact name beside the script and generated input:\n- part-a-dna: run python part_a.py and save part_a_results.txt\n- part-b-counts: run python part_b.py and save part_b_results.txt\n- part-c-replicates: run python part_c.py and save part_c_results.txt\n- part-d-sequences: run python part_d.py and save part_d_results.txt\nDo not call these files results.txt or put them in a different folder: test_project1.py checks these exact paths. After creating all four files, run python test_project1.py from the project-1 folder. It writes portfolio_test_transcript.txt.\n'
      : '\n\nRESULT FILES\nCreate a project-2/output folder beside your scripts and input folder. Save these required outputs there:\n- output/proteins.fasta: translated valid full records\n- output/motif_hits.fasta: translated records with at least one motif match; create an empty file when there are no matches\n- output/summary.tsv: one header row and one row per input record\nAlso save your candidate ORFs with their source identifiers, for example as output/orfs.fasta. Keep the generated FASTA, codon table, and this README unchanged in input/.\n';
    const readmeResultInstructions = project === 1 ? resultInstructions.replaceAll("portfolio_test_transcript.txt", "project1_test_transcript.txt") : resultInstructions;
    files.push({name: prefix + '_README.txt', text: 'LIFE733 Portfolio Project ' + project + '\nDataset version: ' + VERSION + '\nStudent ID: ' + id + '\n\nKeep these inputs unchanged. Test using the book practice data first, then run your solution on these files. Save results separately.' + readmeResultInstructions + '\nGAI USE\nUse the supplied gai_log.txt to record any meaningful GAI use. GAI must not generate your project code directly.\n\nFiles:\n' + files.map(f => f.name).join('\n') + (project === 2 ? '\ngai_log.txt' : '') + '\n'});
    if (project === 1) {
      const part = [
        ['part-a-dna', 'part_a.py', 'part-a_fragments.txt', 'DNA: ACTGTGTCAGTCAGTTTTGG\nDNA length: 20\nReverse complement: CCAAAACTGACTGACACAGT\nRNA: ACUGUGUCAGUCAGUUUUGGAAAAAAA\nRNA length: 27\n'],
        ['part-b-counts', 'part_b.py', 'part-b_counts.txt', 'Total: 100.0\nMean: 20.0\nPopulation variance: 2.0\nPopulation standard deviation: 1.4\nMedian: 20.0\nRange: 4.0\n'],
        ['part-c-replicates', 'part_c.py', 'part-c_replicates.tsv', 'sample_practice: Consistent assay\n'],
        ['part-d-sequences', 'part_d.py', 'part-d_sequences.fasta', 'sample_1: valid, length=9, GC=55.56%, category=Balanced\nsample_2: invalid\nsample_3: valid, length=6, GC=100.00%, category=GC-rich\nSummary: 2 valid, 1 invalid\n']
      ];
      const archiveFiles = [];
      const instructions = 'LIFE733 Portfolio Project 1\nDataset version: ' + VERSION + '\nStudent ID: ' + id + '\n\nSTART HERE\n1. Extract this ZIP into a new folder, for example LIFE733/portfolio/project-1.\n2. In VS Code choose File > Open Folder and select the extracted project-1 folder.\n3. Open Terminal > New Terminal. Use pwd and ls to confirm the location.\n4. Work through part-a-dna, part-b-counts, part-c-replicates, and part-d-sequences separately.\n5. Open the Python script in one part folder, read its TODO comment, and complete the task using the data file beside it.\n6. Run the script from that part folder. Use python script_name.py (or python3 script_name.py if that is the command configured on your computer).\n7. Check your output against the expected format in the book. Your values should come from this generated dataset, not from copied practice values.\n8. Run test_project1.py from the project-1 folder after all four result files have been created.\n9. Save the generated portfolio_test_transcript.txt alongside your scripts as evidence. Do not rename or edit the generated data files.\n\nFOLDER CONTENTS\nEach part folder contains exactly one recommended script and one generated data file:\n- part-a-dna/part_a.py reads portfolio1_<student-id>_part-a_fragments.txt\n- part-b-counts/part_b.py reads portfolio1_<student-id>_part-b_counts.txt\n- part-c-replicates/part_c.py reads portfolio1_<student-id>_part-c_replicates.tsv\n- part-d-sequences/part_d.py reads portfolio1_<student-id>_part-d_sequences.fasta\nThe root also contains test_project1.py, which checks the four result files and writes a scored transcript.\n\nPATHS\nRun a part script while the terminal is inside the folder containing that script and its data file. Run the test script only while the terminal is inside the extracted project-1 folder. If Python reports FileNotFoundError, run pwd and ls, then open the correct folder.\n\nGAI USE\nUse gai_log.txt at the project root to record any meaningful GAI use. It includes examples for Microsoft Copilot and ChatGPT. GAI can support your learning, but must not generate your project code, pseudocode, algorithm, or a solution directly.\n\nSUBMISSION\nComplete all four parts. Keep the student ID comment in each script. Test your logic with the practice snippets in the book, then run the finished script on these generated files. The generated values are your individual portfolio dataset.' + resultInstructions;
      const tester = '# LIFE733 Portfolio Project 1 checker\n# Student ID: ' + id + '\n# Run this file from the project-1 folder after creating the four result files.\n\ntranscript = []\nscore = 0\n\ndef check_part(label, expected, filename):\n    global score\n    try:\n        with open(filename, encoding="utf-8") as handle:\n            actual = handle.read().strip()\n    except FileNotFoundError:\n        transcript.append(label + ": 0/25 — result file is missing: " + filename)\n        return\n    if actual == expected.strip():\n        transcript.append(label + ": 25/25 — output is correct.")\n        score += 25\n    else:\n        transcript.append(label + ": 0/25 — output does not match the expected result for this dataset.")\n        transcript.append("  Check labels, spelling, rounding, line order, and that the script read the generated data file.")\n\n# Part A: calculate the expected result from this student’s two fragments.\nfragments = []\nwith open("part-a-dna/portfolio1_' + id + '_part-a_fragments.txt", encoding="utf-8") as handle:\n    for line in handle:\n        if line.strip(): fragments.append(line.strip())\ndna = (fragments[0] + fragments[1]).upper()\ncomplements = {"A": "T", "T": "A", "C": "G", "G": "C"}\nreverse_complement = ""\nfor base in dna[::-1]: reverse_complement += complements[base]\nrna = dna.replace("T", "U") + "A" * 7\nexpected = "DNA: " + dna + "\\nDNA length: " + str(len(dna)) + "\\nReverse complement: " + reverse_complement + "\\nRNA: " + rna + "\\nRNA length: " + str(len(rna))\ncheck_part("Part A", expected, "part-a-dna/part_a_results.txt")\n\n# Part B: calculate the six summary values from the generated count file.\ncounts = []\nwith open("part-b-counts/portfolio1_' + id + '_part-b_counts.txt", encoding="utf-8") as handle:\n    for line in handle: counts.append(int(line.strip()))\nordered = sorted(counts)\ntotal = sum(counts)\nmean = total / len(counts)\nvariance = sum((value - mean) ** 2 for value in counts) / len(counts)\nexpected = f"Total: {total:.1f}\\nMean: {mean:.1f}\\nPopulation variance: {variance:.1f}\\nPopulation standard deviation: {variance ** 0.5:.1f}\\nMedian: {ordered[len(ordered) // 2]:.1f}\\nRange: {max(counts) - min(counts):.1f}"\ncheck_part("Part B", expected, "part-b-counts/part_b_results.txt")\n\n# Part C: read every replicate row and apply the stated branch order.\ndef classify(values):\n    invalid = False\n    all_below_ten = True\n    for value in values:\n        if value < 0 or value > 2000: invalid = True\n        if value >= 10: all_below_ten = False\n    if invalid: return "Invalid"\n    if all_below_ten: return "Failed assay"\n    if values[0] == values[1] and values[1] == values[2]: return "Uniform replicates"\n    if values[0] == values[1] or values[0] == values[2] or values[1] == values[2]: return "Duplicate replicates"\n    mean = sum(values) / len(values)\n    consistent = True\n    for value in values:\n        difference = value - mean\n        if difference < 0: difference = -difference\n        if difference > 0.2 * mean: consistent = False\n    if consistent: return "Consistent assay"\n    return "Outlier replicate"\nexpected_lines = []\nwith open("part-c-replicates/portfolio1_' + id + '_part-c_replicates.tsv", encoding="utf-8") as handle:\n    rows = handle.read().splitlines()[1:]\nfor row in rows:\n    fields = row.split("\\t")\n    expected_lines.append(fields[0] + ": " + classify([int(value) for value in fields[1:]]))\ncheck_part("Part C", "\\n".join(expected_lines), "part-c-replicates/part_c_results.txt")\n\n# Part D: parse FASTA records, then validate and classify each sequence.\nrecords = {}\nheader = None\nsequence = ""\nwith open("part-d-sequences/portfolio1_' + id + '_part-d_sequences.fasta", encoding="utf-8") as handle:\n    for raw in handle:\n        line = raw.strip()\n        if line.startswith(">"):\n            if header is not None: records[header] = sequence.upper()\n            header, sequence = line[1:], ""\n        elif line: sequence += line\nif header is not None: records[header] = sequence.upper()\nexpected_lines = []\nvalid = 0\nfor name, sequence in records.items():\n    valid_sequence = True\n    if not sequence or len(sequence) % 3: valid_sequence = False\n    for base in sequence:\n        if base not in "ACGT": valid_sequence = False\n    if not valid_sequence:\n        expected_lines.append(name + ": invalid")\n        continue\n    gc = 100 * (sequence.count("G") + sequence.count("C")) / len(sequence)\n    category = "AT-rich" if gc < 40 else "Balanced" if gc <= 60 else "GC-rich"\n    expected_lines.append(f"{name}: valid, length={len(sequence)}, GC={gc:.2f}%, category={category}")\n    valid += 1\nexpected_lines.append(f"Summary: {valid} valid, {len(records) - valid} invalid")\ncheck_part("Part D", "\\n".join(expected_lines), "part-d-sequences/part_d_results.txt")\n\ntranscript.append("Score: " + str(score) + "/100")\nif score == 100: transcript.append("Status: complete — all four portfolio parts produced the expected outputs.")\nelse: transcript.append("Status: incomplete — use the feedback above, correct the scripts, and run this checker again.")\nfor line in transcript: print(line)\nwith open("portfolio_test_transcript.txt", "w", encoding="utf-8") as handle:\n    handle.write("\\n".join(transcript) + "\\n")\n';
      const projectOneTester = tester.replace("portfolio_test_transcript.txt", "project1_test_transcript.txt").replaceAll("portfolio1_", "project1_");
      for (const [folder, script, suffix, output] of part) {
        const generated = files.find(file => file.name.endsWith('_' + suffix));
        archiveFiles.push({path: 'project-1/' + folder + '/' + script, text: '# LIFE733 Portfolio Project 1\n# Student ID: ' + id + '\n# The generated data file for this part is in this folder.\n#\n# OUTPUT: Build your result as text, print it, then save exactly this filename\n# in this same folder: ' + script.replace('.py', '_results.txt') + '\n# Do not move or rename the result file: test_project1.py checks this path.\n#\n# GAI: Do not use generative AI to generate this code, pseudocode, an\n# algorithm, or a solution. You may use it for learning support; record any\n# meaningful use in ../gai_log.txt.\n\n# TODO: write your solution here.\n'});
        archiveFiles.push({path: 'project-1/' + folder + '/' + generated.name, text: generated.text});
      }
      archiveFiles.push({path: 'project-1/README.txt', text: instructions.replaceAll("portfolio_test_transcript.txt", "project1_test_transcript.txt").replaceAll("portfolio1_", "project1_")});
      archiveFiles.push({path: 'project-1/gai_log.txt', text: gaiLogTemplate(1)});
      archiveFiles.push({path: 'project-1/test_project1.py', text: projectOneTester});
      return {version: VERSION, project, files, zip: {name: prefix + '_project.zip', bytes: zip(archiveFiles)}};
    }
    const sequenceFile = files[0], codonFile = files[1];
    const projectTwoReadme = files.find(file => file.name.endsWith('_README.txt'));
    const projectTwoInstructions = 'LIFE733 Portfolio Project 2\nDataset version: ' + VERSION + '\nStudent ID: ' + id + '\n\nSTART HERE\n1. Open the extracted project-2 folder in VS Code.\n2. Use the files in practice/ to develop and test your code first.\n3. Complete fasta_tools.py and main.py.\n4. Run python main.py from the project-2 folder.\n5. Run python test_project2.py from the project-2 folder. It writes project2_test_transcript.txt.\n\nINPUTS\nKeep every file in input/ unchanged. They are your individual dataset.\n\nOUTPUTS\nYour program must create these files in output/:\n- orfs.fasta: candidate ORFs. Use headers such as gene_1_orf_1, gene_1_orf_2.\n- proteins.fasta: translated valid full records, retaining each input identifier.\n- motif_hits.fasta: translated records with one or more motif matches; create an empty file if there are none.\n- summary.tsv: one row per input record, in input order, with this exact header:\n  record_identifier\\tdna_length\\tvalidity\\torf_count\\tprotein_length\\tstop_symbol_count\\tmotif_hit_count\n  Use lowercase valid or invalid. For invalid records use NA in all analysis columns.\n\nGAI USE\nRecord meaningful GAI use in gai_log.txt. GAI must not generate your code, pseudocode, algorithm, or solution directly.\n';
    const projectTwoTest = '# LIFE733 Portfolio Project 2 checker\n# Student ID: ' + id + '\n# Run from the project-2 folder after creating the required output files.\n\nfrom pathlib import Path\nimport re\n\nROOT = Path(__file__).parent\nINPUT = ROOT / "input"\nOUTPUT = ROOT / "output"\nTRANSCRIPT = ROOT / "project2_test_transcript.txt"\n\ndef read_fasta(path):\n    records, header, sequence = {}, None, []\n    with open(path, encoding="utf-8") as handle:\n        for raw in handle:\n            line = raw.strip()\n            if line.startswith(">"):\n                if header is not None: records[header] = "".join(sequence).upper()\n                header, sequence = line[1:], []\n            elif line: sequence.append(line)\n    if header is not None: records[header] = "".join(sequence).upper()\n    return records\n\ndef write_result(lines):\n    print("\\n".join(lines))\n    TRANSCRIPT.write_text("\\n".join(lines) + "\\n", encoding="utf-8")\n\ndef find_orfs(sequence):\n    result = []\n    for frame in range(3):\n        for start in range(frame, len(sequence) - 2, 3):\n            if sequence[start:start + 3] != "ATG": continue\n            for stop in range(start + 3, len(sequence) - 2, 3):\n                if sequence[stop:stop + 3] in {"TAA", "TAG", "TGA"}:\n                    result.append(sequence[start:stop + 3])\n                    break\n    return result\n\nrecords = read_fasta(INPUT / "' + sequenceFile.name + '")\ncodons = {}\nwith open(INPUT / "' + codonFile.name + '", encoding="utf-8") as handle:\n    next(handle)\n    for line in handle:\n        codon, amino_acid = line.rstrip("\\n").split("\\t")\n        codons[codon] = amino_acid\nvalid = {name: sequence for name, sequence in records.items() if sequence and set(sequence) <= set("ACGT")}\nproteins = {name: "".join(codons[sequence[i:i + 3]] for i in range(0, len(sequence), 3)) for name, sequence in valid.items()}\nmotif_hits = {name: protein for name, protein in proteins.items() if any(re.search(r"N[^P][ST]", part) for part in protein.split("*"))}\nexpected_orfs = {}\nfor name, sequence in valid.items():\n    for number, orf in enumerate(find_orfs(sequence), start=1): expected_orfs[name + "_orf_" + str(number)] = orf\n\nchecks = []\ndef compare_fasta(label, filename, expected):\n    path = OUTPUT / filename\n    if not path.exists():\n        checks.append(label + ": missing " + str(path.relative_to(ROOT))); return\n    actual = read_fasta(path)\n    checks.append(label + (": correct" if actual == expected else ": incorrect records, headers, or sequences"))\n\ncompare_fasta("ORFs", "orfs.fasta", expected_orfs)\ncompare_fasta("Proteins", "proteins.fasta", proteins)\ncompare_fasta("Motif hits", "motif_hits.fasta", motif_hits)\nsummary = OUTPUT / "summary.tsv"\nexpected_header = "record_identifier\\tdna_length\\tvalidity\\torf_count\\tprotein_length\\tstop_symbol_count\\tmotif_hit_count"\nexpected_rows = [expected_header]\nfor name, sequence in records.items():\n    if name not in valid:\n        expected_rows.append("\\t".join([name, str(len(sequence)), "invalid", "NA", "NA", "NA", "NA"]))\n        continue\n    protein = proteins[name]\n    hit_count = sum(len(re.findall(r"N[^P][ST]", part)) for part in protein.split("*"))\n    expected_rows.append("\\t".join([name, str(len(sequence)), "valid", str(len(find_orfs(sequence))), str(len(protein)), str(protein.count("*")), str(hit_count)]))\nif not summary.exists(): checks.append("Summary: missing output/summary.tsv")\nelif summary.read_text(encoding="utf-8").splitlines() == expected_rows: checks.append("Summary: correct")\nelse: checks.append("Summary: incorrect header, values, or row order")\npassed = sum(check.endswith("correct") for check in checks)\nchecks.append("Score: " + str(passed) + "/4")\nchecks.append("Status: complete" if passed == 4 else "Status: incomplete — correct the files above and run this checker again.")\nwrite_result(checks)\n';
    const projectTwoMain = '# LIFE733 Portfolio Project 2\n# Student ID: ' + id + '\n#\n# Read the generated files in input/, then create output/orfs.fasta,\n# output/proteins.fasta, output/motif_hits.fasta, and output/summary.tsv.\n# Run python test_project2.py from this folder when you are finished.\n#\n# GAI: do not use generative AI to generate this code, pseudocode, an\n# algorithm, or a solution. Record meaningful learning support in gai_log.txt.\n\n# TODO: write the short driver program here.\n';
    const projectTwoTools = '# LIFE733 Portfolio Project 2 reusable functions\n#\n# TODO: put your FASTA parsing, validation, ORF, translation, and motif\n# functions here, then import them into main.py.\n';
    const archiveFiles = [
      {path: 'project-2/README.txt', text: projectTwoInstructions},
      {path: 'project-2/gai_log.txt', text: gaiLogTemplate(2)},
      {path: 'project-2/main.py', text: projectTwoMain},
      {path: 'project-2/fasta_tools.py', text: projectTwoTools},
      {path: 'project-2/test_project2.py', text: projectTwoTest},
      {path: 'project-2/practice/project2_practice.fasta', text: '>gene_alpha synthetic example\nATGAAACCCGGGTAA\n>gene_beta synthetic example\nATGCCCTAG\n>gene_gamma contains invalid symbol\nATGNAA\n'},
      {path: 'project-2/practice/project2_codons.tsv', text: table},
      {path: 'project-2/input/' + sequenceFile.name, text: sequenceFile.text},
      {path: 'project-2/input/' + codonFile.name, text: codonFile.text},
      {path: 'project-2/input/README.txt', text: projectTwoReadme.text}
    ];
    return {version: VERSION, project, files, zip: {name: prefix + '_project.zip', bytes: zip(archiveFiles)}};
  }
  const api = {generate, validateId, dnaTag, codingTag};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PortfolioDatasets = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
