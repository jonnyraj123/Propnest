import { chromium } from 'playwright';
const [file, out, w, h] = process.argv.slice(2);
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox']});
const p = await b.newPage({viewport:{width:+w,height:+h}});
await p.goto('file://' + process.cwd() + '/' + file, { waitUntil:'networkidle' });
await p.locator('.c').screenshot({path: out});
await b.close(); console.log(out);
