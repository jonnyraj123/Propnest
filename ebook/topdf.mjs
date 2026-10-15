import { chromium } from 'playwright';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome', args:['--no-sandbox']});
const p = await b.newPage();
await p.goto('file://' + process.cwd() + '/book.html', { waitUntil: 'networkidle' });
await p.emulateMedia({ media: 'print' });
await p.pdf({ path: 'preview.pdf', format: 'A4', printBackground: true,
  margin: {top:'0',bottom:'0',left:'0',right:'0'} });
await b.close();
console.log('pdf ok');
