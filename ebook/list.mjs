import { chromium } from 'playwright';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox']});
const p = await b.newPage({viewport:{width:840,height:1188}});
await p.goto('file:///home/user/Propnest/ebook/book.html', { waitUntil:'networkidle' });
const rows = await p.$$eval('.page', els => els.map((e,i)=>{
  const h = e.querySelector('h1,h2,h3');
  return i + ' | pg=' + (e.dataset.pg||'-') + ' | ' + (h? h.textContent.trim().slice(0,50) : '(no heading)');
}));
console.log(rows.join('\n'));
await b.close();
