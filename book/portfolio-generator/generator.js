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
        {name: prefix + '_fragments.txt', text: fragment1.toLowerCase() + '\n' + fragment2.toLowerCase() + '\n'},
        {name: prefix + '_counts.txt', text: counts.join('\n') + '\n'},
        {name: prefix + '_replicates.tsv', text: 'sample\treplicate_1\treplicate_2\treplicate_3\n' + replicates.map((r,i) => 'sample_' + (i+1) + '\t' + r.join('\t')).join('\n') + '\n'},
        {name: prefix + '_sequences.fasta', text: fasta([
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
    return {version: VERSION, project, files};
  }
  const api = {generate, validateId, dnaTag, codingTag};
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PortfolioDatasets = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
