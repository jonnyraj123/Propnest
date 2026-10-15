import { chromium } from 'playwright';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox']});
const p = await b.newPage();
await p.goto('file://' + process.cwd() + '/book.html', { waitUntil: 'networkidle' });
const r = await p.$$eval('.page', els => els.map((e,i)=>({i, mm: Math.round(e.getBoundingClientRect().height/ (96/25.4)), pg: e.dataset.pg||'—'})));
const bad = r.filter(x=>x.mm>297);
console.log('total pages:', r.length, '| overflowing:', bad.length);
bad.forEach(x=>console.log(`  page idx ${x.i} (data-pg ${x.pg}) = ${x.mm}mm  [+${x.mm-297}]`));
await b.close();
