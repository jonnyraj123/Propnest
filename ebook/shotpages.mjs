import { chromium } from 'playwright';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox']});
const p = await b.newPage({viewport:{width:840,height:1188}, deviceScaleFactor:2});
await p.goto('file:///home/user/Propnest/ebook/book.html', { waitUntil:'networkidle' });
const els = await p.$$('.page');
const want = {25:'chart', 42:'recipe', 54:'tracker', 21:'bazar'};
for (const [i,name] of Object.entries(want)) {
  await els[i].screenshot({path:`preview/${name}.png`});
  console.log('saved', name);
}
await b.close();
