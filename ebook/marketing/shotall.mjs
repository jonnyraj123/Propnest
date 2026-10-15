import { chromium } from 'playwright';
import fs from 'fs';
const rows = fs.readFileSync('marketing/images/_list.txt','utf8').trim().split('\n');
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox']});
for (const r of rows) {
  const [html, png, w, h] = r.split('|');
  const p = await b.newPage({viewport:{width:+w, height:+h}});
  await p.goto('file://' + process.cwd() + '/' + html, { waitUntil:'networkidle' });
  await p.locator('.ad').screenshot({path: png});
  await p.close();
  console.log('✓', png);
}
await b.close();
