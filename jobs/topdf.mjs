/* confirm.html → PDF */
import { chromium } from '/home/user/Propnest/ebook/node_modules/playwright/index.mjs';
const b = await chromium.launch({executablePath:'/opt/pw-browsers/chromium-1194/chrome-linux/chrome'});
const p = await b.newPage();
await p.goto('file:///home/user/Propnest/jobs/confirm.html', {waitUntil:'networkidle'});
await p.waitForTimeout(1500);
await p.pdf({path:'/home/user/Propnest/jobs/Payment-Confirmation.pdf', width:'210mm', height:'297mm', printBackground:true});
await p.setViewportSize({width:794, height:1123});
await p.screenshot({path:'/tmp/claude-0/-home-user-Propnest/f4053d30-5a6f-55cd-a9fa-eac662c69241/scratchpad/confirm.png', fullPage:true});
await b.close();
console.log('pdf ok');
