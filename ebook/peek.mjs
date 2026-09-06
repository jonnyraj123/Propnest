import { chromium } from 'playwright';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox']});
const p = await b.newPage();
await p.goto('file://' + process.cwd() + '/book.html', { waitUntil: 'networkidle' });
const r = await p.$$eval('.page', els => els.map((e,i)=>({i,
  mm: Math.round(e.getBoundingClientRect().height/(96/25.4)),
  h: (e.querySelector('h1,h2')||{}).textContent||'—'})));
r.filter(x=>x.mm>297).forEach(x=>console.log(x.i, x.mm+'mm', '|', x.h.replace(/\s+/g,' ').slice(0,50)));
await b.close();
