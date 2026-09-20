// Run with Node.js: node tests/portfolio-generator.cjs
const assert = require('node:assert/strict');
const {generate, validateId, dnaTag, codingTag} = require('../book/portfolio-generator/generator.js');
function fasta(text) {
  const result = []; let current;
  for (const line of text.trim().split('\n')) {
    if (line.startsWith('>')) { current = {name:line.slice(1), dna:''}; result.push(current); }
    else current.dna += line;
  }
  return result;
}
function classify(r) {
  if (r.some(x => x < 0 || x > 2000)) return 'invalid';
  if (r.every(x => x < 10)) return 'failed';
  if (new Set(r).size === 1) return 'uniform';
  if (new Set(r).size === 2) return 'duplicates';
  const mean = r.reduce((a,b) => a+b) / r.length;
  return r.every(x => Math.abs(x-mean) <= .2*mean) ? 'consistent' : 'outlier';
}
for (const id of ['', '123', '1234567890', '012345678', ' 123456789', '123456789 ', '12345678a', '1e0000000', '１２３４５６７８９', 123456789]) {
  assert.throws(() => validateId(id));
}
assert.throws(() => generate('123456789', 3));
const seen1 = new Set(), seen2 = new Set();
for (const n of [100000000,999999999,...Array.from({length:1000},(_,i)=>234567000+i)]) {
  const id = String(n), one = generate(id,1), two = generate(id,2);
  assert.deepEqual(one, generate(id,1)); assert.deepEqual(two, generate(id,2));
  // Decode the injective tags independently: uniqueness is in the DNA, not the header.
  assert.equal(parseInt(dnaTag(n).split('').map(c=>'ACGT'.indexOf(c)).join(''),4),n);
  assert.equal(parseInt(codingTag(n).match(/.../g).map(c=>c==='GCT'?'0':'1').join(''),2),n);
  const fragments = one.files[0].text.trim().split('\n');
  assert.deepEqual(fragments.map(x=>x.length),[24,24]);
  assert(!seen1.has(fragments.join(''))); seen1.add(fragments.join(''));
  assert.equal(one.files[1].text.trim().split('\n').length,7);
  const classes = one.files[2].text.trim().split('\n').slice(1).map(row=>classify(row.split('\t').slice(1).map(Number)));
  assert.deepEqual(classes.sort(),['consistent','duplicates','failed','invalid','outlier','uniform']);
  const dna1=fasta(one.files[3].text);
  assert.equal(dna1.filter(r=>/^[ACGT]+$/.test(r.dna)&&r.dna.length%3===0).length,4);
  const dna2=fasta(two.files[0].text);
  assert(!seen2.has(dna2[0].dna)); seen2.add(dna2[0].dna);
  assert.equal(dna2.length,8);
  const valid=dna2.filter(r=>/^[ACGT]+$/.test(r.dna)); assert.equal(valid.length,6);
  const table=Object.fromEntries(two.files[1].text.trim().split('\n').slice(1).map(row=>row.split('\t')));
  let hits=0, misses=0;
  for (const r of valid) {
    assert.equal(r.dna.length%3,0);
    const codons=r.dna.match(/.../g); assert(codons.every(c=>c in table));
    assert.equal(codons[0],'ATG'); assert(['TAA','TAG','TGA'].includes(codons.at(-1)));
    const protein=codons.map(c=>table[c]).join('');
    const matches=protein.split('*').flatMap(segment=>segment.match(/N[^P][ST]/g)||[]);
    if(matches.length) hits++; else misses++;
  }
  assert(hits>0 && misses>0);
}
// Pin representative content so accidental changes cannot silently redefine dataset v1.
const crypto=require('node:crypto');
const digest=crypto.createHash('sha256').update(JSON.stringify([generate('123456789',1),generate('123456789',2)])).digest('hex');
if (process.env.PRINT_DATASET_DIGEST) console.log(digest);
else assert.equal(digest,'61a93fb9467ea9d2b10cdebaca33b0722f52acc7901400171dd1a2dda7f7b715');
console.log('Portfolio generator: validation, repeatability, uniqueness, classifications and translation checks passed.');
