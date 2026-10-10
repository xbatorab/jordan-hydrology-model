const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');
const sandbox={window:{}};vm.runInNewContext(fs.readFileSync('js/geometry.js','utf8'),sandbox);
const solve=sandbox.window.JordanGeometry.solve;const v=7560000;
const a=solve(v,.6,350,20);assert.ok(Math.abs(a.volumeCalculated-v)<.01);
assert.ok(a.widthBarrier>a.widthUpstream);assert.equal(a.widthBarrier,650);
assert.ok(Math.abs(a.height-Math.sqrt(6*.0006*v/(650+100)))<.0001);
const short=solve(v,.6,350,3);assert.ok(short.overflow);assert.ok(Math.abs(short.volumeCalculated-v)<.01);
for(const width of [300,350,400])for(const time of [2,21,50]){const q=solve(100*time*3600,.6,width,40);assert.ok(Math.abs(q.volumeCalculated-100*time*3600)<1);assert.ok(q.area>0)}
console.log('OK – proměnná šířka, numerická kontrola objemu a limit oblasti.');
