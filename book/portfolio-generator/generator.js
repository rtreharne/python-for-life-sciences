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
  function generate(id, project) {
    const number = validateId(id);
    if (project !== 1 && project !== 2) throw new Error('Choose Project 1 or Project 2.');
    const rand = random(number + project * 1000000000);
    const prefix = 'portfolio' + project + '_' + id;
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
    files.push({name: prefix + '_README.txt', text: 'LIFE733 Portfolio Project ' + project + '\nDataset version: ' + VERSION + '\nStudent ID: ' + id + '\n\nKeep these inputs unchanged. Test using the book practice data first, then run your solution on these files. Save results separately.\n\nFiles:\n' + files.map(f => f.name).join('\n') + '\n'});
    if (project === 1) {
      const part = [
        ['part-a-dna', 'part_a.py', 'part-a_fragments.txt', 'DNA: ACTGTGTCAGTCAGTTTTGG\nDNA length: 20\nReverse complement: CCAAAACTGACTGACACAGT\nRNA: ACUGUGUCAGUCAGUUUUGGAAAAAAA\nRNA length: 27\n'],
        ['part-b-counts', 'part_b.py', 'part-b_counts.txt', 'Total: 100.0\nMean: 20.0\nPopulation variance: 2.0\nPopulation standard deviation: 1.4\nMedian: 20.0\nRange: 4.0\n'],
        ['part-c-replicates', 'part_c.py', 'part-c_replicates.tsv', 'sample_practice: Consistent assay\n'],
        ['part-d-sequences', 'part_d.py', 'part-d_sequences.fasta', 'sample_1: valid, length=9, GC=55.56%, category=Balanced\nsample_2: invalid\nsample_3: valid, length=6, GC=100.00%, category=GC-rich\nSummary: 2 valid, 1 invalid\n']
      ];
      const archiveFiles = [];
      const instructions = 'LIFE733 Portfolio Project 1\nDataset version: ' + VERSION + '\nStudent ID: ' + id + '\n\nSTART HERE\n1. Extract this ZIP into a new folder, for example LIFE733/portfolio/project-1.\n2. In VS Code choose File > Open Folder and select the extracted project-1 folder.\n3. Open Terminal > New Terminal. Use pwd and ls to confirm the location.\n4. Work through part-a-dna, part-b-counts, part-c-replicates, and part-d-sequences separately.\n5. Open the Python script in one part folder, read its TODO comment, and complete the task using the data file beside it.\n6. Run the script from that part folder. Use python script_name.py (or python3 script_name.py if that is the command configured on your computer).\n7. Check your output against the expected format in the book. Your values should come from this generated dataset, not from copied practice values.\n8. Run test_project1.py from the project-1 folder after all four result files have been created.\n9. Save the generated portfolio_test_transcript.txt alongside your scripts as evidence. Do not rename or edit the generated data files.\n\nFOLDER CONTENTS\nEach part folder contains exactly one recommended script and one generated data file:\n- part-a-dna/part_a.py reads portfolio1_<student-id>_part-a_fragments.txt\n- part-b-counts/part_b.py reads portfolio1_<student-id>_part-b_counts.txt\n- part-c-replicates/part_c.py reads portfolio1_<student-id>_part-c_replicates.tsv\n- part-d-sequences/part_d.py reads portfolio1_<student-id>_part-d_sequences.fasta\nThe root also contains test_project1.py, which checks the four result files and writes a scored transcript.\n\nPATHS\nRun a part script while the terminal is inside the folder containing that script and its data file. Run the test script only while the terminal is inside the extracted project-1 folder. If Python reports FileNotFoundError, run pwd and ls, then open the correct folder.\n\nSUBMISSION\nComplete all four parts. Keep the student ID comment in each script. Test your logic with the practice snippets in the book, then run the finished script on these generated files. The generated values are your individual portfolio dataset.\n';
      const tester = '# LIFE733 Portfolio Project 1 checker\n# Student ID: ' + id + '\n# Run this file from the project-1 folder after creating the four result files.\n\ntranscript = []\nscore = 0\n\ndef check_part(label, expected, filename):\n    global score\n    try:\n        with open(filename, encoding="utf-8") as handle:\n            actual = handle.read().strip()\n    except FileNotFoundError:\n        transcript.append(label + ": 0/25 — result file is missing: " + filename)\n        return\n    if actual == expected.strip():\n        transcript.append(label + ": 25/25 — output is correct.")\n        score += 25\n    else:\n        transcript.append(label + ": 0/25 — output does not match the expected result for this dataset.")\n        transcript.append("  Check labels, spelling, rounding, line order, and that the script read the generated data file.")\n\n# Part A: calculate the expected result from this student’s two fragments.\nfragments = []\nwith open("part-a-dna/portfolio1_' + id + '_part-a_fragments.txt", encoding="utf-8") as handle:\n    for line in handle:\n        if line.strip(): fragments.append(line.strip())\ndna = (fragments[0] + fragments[1]).upper()\ncomplements = {"A": "T", "T": "A", "C": "G", "G": "C"}\nreverse_complement = ""\nfor base in dna[::-1]: reverse_complement += complements[base]\nrna = dna.replace("T", "U") + "A" * 7\nexpected = "DNA: " + dna + "\\nDNA length: " + str(len(dna)) + "\\nReverse complement: " + reverse_complement + "\\nRNA: " + rna + "\\nRNA length: " + str(len(rna))\ncheck_part("Part A", expected, "part-a-dna/part_a_results.txt")\n\n# Part B: calculate the six summary values from the generated count file.\ncounts = []\nwith open("part-b-counts/portfolio1_' + id + '_part-b_counts.txt", encoding="utf-8") as handle:\n    for line in handle: counts.append(int(line.strip()))\nordered = sorted(counts)\ntotal = sum(counts)\nmean = total / len(counts)\nvariance = sum((value - mean) ** 2 for value in counts) / len(counts)\nexpected = f"Total: {total:.1f}\\nMean: {mean:.1f}\\nPopulation variance: {variance:.1f}\\nPopulation standard deviation: {variance ** 0.5:.1f}\\nMedian: {ordered[len(ordered) // 2]:.1f}\\nRange: {max(counts) - min(counts):.1f}"\ncheck_part("Part B", expected, "part-b-counts/part_b_results.txt")\n\n# Part C: read every replicate row and apply the stated branch order.\ndef classify(values):\n    invalid = False\n    all_below_ten = True\n    for value in values:\n        if value < 0 or value > 2000: invalid = True\n        if value >= 10: all_below_ten = False\n    if invalid: return "Invalid"\n    if all_below_ten: return "Failed assay"\n    if values[0] == values[1] and values[1] == values[2]: return "Uniform replicates"\n    if values[0] == values[1] or values[0] == values[2] or values[1] == values[2]: return "Duplicate replicates"\n    mean = sum(values) / len(values)\n    consistent = True\n    for value in values:\n        difference = value - mean\n        if difference < 0: difference = -difference\n        if difference > 0.2 * mean: consistent = False\n    if consistent: return "Consistent assay"\n    return "Outlier replicate"\nexpected_lines = []\nwith open("part-c-replicates/portfolio1_' + id + '_part-c_replicates.tsv", encoding="utf-8") as handle:\n    rows = handle.read().splitlines()[1:]\nfor row in rows:\n    fields = row.split("\\t")\n    expected_lines.append(fields[0] + ": " + classify([int(value) for value in fields[1:]]))\ncheck_part("Part C", "\\n".join(expected_lines), "part-c-replicates/part_c_results.txt")\n\n# Part D: parse FASTA records, then validate and classify each sequence.\nrecords = {}\nheader = None\nsequence = ""\nwith open("part-d-sequences/portfolio1_' + id + '_part-d_sequences.fasta", encoding="utf-8") as handle:\n    for raw in handle:\n        line = raw.strip()\n        if line.startswith(">"):\n            if header is not None: records[header] = sequence.upper()\n            header, sequence = line[1:], ""\n        elif line: sequence += line\nif header is not None: records[header] = sequence.upper()\nexpected_lines = []\nvalid = 0\nfor name, sequence in records.items():\n    valid_sequence = True\n    if not sequence or len(sequence) % 3: valid_sequence = False\n    for base in sequence:\n        if base not in "ACGT": valid_sequence = False\n    if not valid_sequence:\n        expected_lines.append(name + ": invalid")\n        continue\n    gc = 100 * (sequence.count("G") + sequence.count("C")) / len(sequence)\n    category = "AT-rich" if gc < 40 else "Balanced" if gc <= 60 else "GC-rich"\n    expected_lines.append(f"{name}: valid, length={len(sequence)}, GC={gc:.2f}%, category={category}")\n    valid += 1\nexpected_lines.append(f"Summary: {valid} valid, {len(records) - valid} invalid")\ncheck_part("Part D", "\\n".join(expected_lines), "part-d-sequences/part_d_results.txt")\n\ntranscript.append("Score: " + str(score) + "/100")\nif score == 100: transcript.append("Status: complete — all four portfolio parts produced the expected outputs.")\nelse: transcript.append("Status: incomplete — use the feedback above, correct the scripts, and run this checker again.")\nfor line in transcript: print(line)\nwith open("portfolio_test_transcript.txt", "w", encoding="utf-8") as handle:\n    handle.write("\\n".join(transcript) + "\\n")\n';
      for (const [folder, script, suffix, output] of part) {
        const generated = files.find(file => file.name.endsWith('_' + suffix));
        archiveFiles.push({path: 'project-1/' + folder + '/' + script, text: '# LIFE733 Portfolio Project 1\n# Student ID: ' + id + '\n# The generated data file for this part is in this folder.\n\n# TODO: write your solution here.\n'});
        archiveFiles.push({path: 'project-1/' + folder + '/' + generated.name, text: generated.text});
      }
      archiveFiles.push({path: 'project-1/README.txt', text: instructions});
      archiveFiles.push({path: 'project-1/test_project1.py', text: tester});
      return {version: VERSION, project, files, zip: {name: prefix + '_project.zip', bytes: zip(archiveFiles)}};
    }
    return {version: VERSION, project, files};
  }
  const api = {generate, validateId, dnaTag, codingTag};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PortfolioDatasets = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
