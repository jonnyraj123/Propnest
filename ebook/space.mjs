import { chromium } from 'playwright';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox']});
const p = await b.newPage();
await p.goto('file://' + process.cwd() + '/book.html', { waitUntil: 'networkidle' });
const r = await p.$$eval('.page', els => els.map((e,i)=>{
  const mm = v => v/(96/25.4);
  const pad = 13; // bottom padding mm
  const last = e.children.length ? e.children[e.children.length-1] : null;
  const contentBottom = last ? last.getBoundingClientRect().bottom : e.getBoundingClientRect().top;
  const free = mm(e.getBoundingClientRect().top + 297*(96/25.4) - contentBottom) - pad;
  return {i, free: Math.round(free), h:((e.querySelector('h1,h2')||{}).textContent||'—').replace(/\s+/g,' ').trim().slice(0,42)};
}));
console.log(JSON.stringify(r));
await b.close();
