// Spusťte: node tests/smoke.test.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
for (const name of ['index.html','css/style.css','js/model.js','js/map.js']) {
  assert.ok(fs.statSync(name).size > 200, `Chybí nebo je prázdný ${name}`);
}
const index = fs.readFileSync('index.html','utf8');
assert.ok(index.includes('js/model.js') && index.includes('js/map.js'));
function retention(q, hours, lossPercent) { return q * hours * 3600 * (1-lossPercent/100); }
assert.equal(retention(100,21,0),7560000);
assert.equal(retention(100,21,10),6804000);
const modelSource = fs.readFileSync('js/model.js','utf8');
assert.match(modelSource,/id:'b'[^\n]*def:350/);
assert.ok(index.includes('js/geometry.js'));
console.log('OK – vstupní soubory.');
