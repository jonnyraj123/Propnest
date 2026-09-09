import { chromium } from 'playwright';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox']});
const p = await b.newPage({viewport:{width:840,height:1188},deviceScaleFactor:1.6});
await p.goto('file://' + process.cwd() + '/book2/sample.html', { waitUntil:'networkidle' });
const els = await p.$$('.page');
const mm = v => Math.round(v/(96/25.4));
for (let i=0;i<els.length;i++){
  const h = mm((await els[i].boundingBox()).height);
  console.log(`page ${i}: ${h}mm ${h>297?'OVERFLOW':'ok'}`);
  await els[i].screenshot({path:`book2/s${i}.png`});
}
await b.close();
