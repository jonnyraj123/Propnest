import { chromium } from 'playwright';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox']});
const p = await b.newPage({viewport:{width:1280,height:720},deviceScaleFactor:1});
await p.goto('file://' + import.meta.dirname + '/cover.html', { waitUntil:'networkidle' });
await p.locator('.c').screenshot({path: import.meta.dirname + '/cover-1280x720.png'});
await b.close();
console.log('ok');
