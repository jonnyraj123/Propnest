import { chromium } from 'playwright';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox']});
const p = await b.newPage({viewport:{width:840,height:1188},deviceScaleFactor:1.5});
await p.goto('file://' + process.cwd() + '/book.html', { waitUntil: 'networkidle' });
const n = Number(process.argv[2]||0);
const els = await p.$$('.page');
await els[n].screenshot({path:`shot${n}.png`});
await b.close();
