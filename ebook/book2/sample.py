# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from svgs2 import SVG
import base64
_B = os.path.dirname(os.path.abspath(__file__))
PHOTO = base64.b64encode(open(os.path.join(_B,'img/model.png'),'rb').read()).decode()

CSS = '''
@font-face{font-family:'NSB';src:url('../assets/NotoSansBengali-400.ttf');font-weight:400;}
@font-face{font-family:'NSB';src:url('../assets/NotoSansBengali-600.ttf');font-weight:600;}
@font-face{font-family:'NSB';src:url('../assets/NotoSansBengali-700.ttf');font-weight:700;}
:root{
 --teal:#0F5C63; --teal-d:#083E44; --teal-l:#D6EAEC; --teal-xl:#EDF6F7;
 --rust:#B4531F; --rust-l:#F7E4D8;
 --olive:#5B7C3A; --olive-l:#E6EDDC;
 --ink:#2A2622; --ink2:#4A443D; --mut:#8A8078;
 --cream:#FCFAF6; --line:#E6E0D6;
}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'NSB',sans-serif;color:var(--ink);background:#8a8a8a;
     font-size:11.6pt;line-height:1.78;-webkit-font-smoothing:antialiased}
.page{width:210mm;min-height:297mm;background:var(--cream);margin:0 auto 8mm;
      padding:19mm 18mm 14mm;position:relative;display:flex;flex-direction:column}
@page{size:A4;margin:0}
@media print{body{background:#fff}.page{margin:0;page-break-after:always}
 .page:last-child{page-break-after:auto}}

/* running foot only — keeps the top of every page clean */
.page::after{content:attr(data-pg);position:absolute;bottom:8mm;left:0;right:0;
  text-align:center;font-size:9pt;color:var(--mut);letter-spacing:.1em}
.page.plain::after{content:none}
.brand{position:absolute;bottom:8mm;right:18mm;font-size:8pt;letter-spacing:.14em;
  color:#BFB6AA;text-transform:uppercase}

h1{font-size:25pt;line-height:1.24;font-weight:700;color:var(--teal-d);letter-spacing:-.01em}
h2{font-size:16pt;font-weight:700;color:var(--teal-d);line-height:1.35;margin-bottom:4mm}
h3{font-size:12.5pt;font-weight:700;color:var(--teal);margin:6mm 0 2mm}
p{margin:0 0 3.4mm}
strong{font-weight:700}
.lede{font-size:12.5pt;line-height:1.7;color:var(--ink2);margin-bottom:5mm}
.rule{height:1.4mm;width:26mm;background:var(--rust);border-radius:1mm;margin:4mm 0 5mm}

/* chapter opener */
.op .num{font-size:9.5pt;letter-spacing:.26em;color:var(--rust);font-weight:700;
  text-transform:uppercase;margin-bottom:5mm}
.op h1{font-size:31pt}
.op .quote{font-size:14pt;color:var(--ink2);font-style:italic;line-height:1.6;
  border-left:1.2mm solid var(--teal-l);padding-left:6mm;margin:7mm 0 8mm}
.learn{background:#fff;border:.4pt solid var(--line);border-radius:4mm;padding:7mm 8mm;margin-top:auto}
.learn .lt{font-size:9pt;letter-spacing:.2em;color:var(--teal);font-weight:700;
  text-transform:uppercase;margin-bottom:4mm}
.learn ol{list-style:none;counter-reset:l}
.learn li{counter-increment:l;display:flex;gap:5mm;align-items:baseline;
  padding:2.6mm 0;border-bottom:.4pt solid var(--line);font-size:11.5pt}
.learn li:last-child{border-bottom:none}
.learn li::before{content:counter(l,decimal-leading-zero);font-size:10pt;font-weight:700;
  color:var(--rust);min-width:8mm}

/* content elements */
.fig{margin:4.5mm 0}
.fig .fw{background:#fff;border:.4pt solid var(--line);border-radius:4mm;padding:6mm 6mm 4mm}
.fig svg{display:block;width:100%;height:auto;max-height:52mm}
.fig .cap{text-align:center;font-size:9.5pt;color:var(--mut);margin-top:2.5mm}

.tip,.note,.warn{border-radius:4mm;padding:4.4mm 5.5mm;margin:4mm 0}
.tip{background:var(--olive-l);border-left:1.6mm solid var(--olive)}
.note{background:var(--teal-xl);border-left:1.6mm solid var(--teal)}
.warn{background:var(--rust-l);border-left:1.6mm solid var(--rust)}
.tip .h,.note .h,.warn .h{font-size:8.5pt;letter-spacing:.2em;text-transform:uppercase;
  font-weight:700;margin-bottom:2.2mm;display:block}
.tip .h{color:#3D5426}.note .h{color:var(--teal-d)}.warn .h{color:#8A3D14}
.tip p:last-child,.note p:last-child,.warn p:last-child{margin-bottom:0}

.da{display:grid;grid-template-columns:1fr 1fr;gap:4.5mm;margin:4.5mm 0}
.da .c{background:#fff;border:.4pt solid var(--line);border-radius:4mm;padding:5mm 5.5mm}
.da .c .t{font-size:10pt;font-weight:700;letter-spacing:.08em;margin-bottom:3mm}
.da .ok .t{color:var(--olive)} .da .no .t{color:var(--rust)}
.da ul{list-style:none} .da li{font-size:11pt;padding:1.6mm 0;display:flex;gap:3mm}
.da li::before{font-weight:700;flex:none}
.da .ok li::before{content:'✓';color:var(--olive)}
.da .no li::before{content:'✕';color:var(--rust)}

table{width:100%;border-collapse:separate;border-spacing:0;margin:4.5mm 0;font-size:10.5pt;
  border-radius:3mm;overflow:hidden;box-shadow:0 0 0 .4pt var(--line)}
th{background:var(--teal);color:#fff;text-align:left;padding:2.8mm 3.4mm;font-size:9.5pt;font-weight:600}
td{padding:2.6mm 3.4mm;border-bottom:.4pt solid var(--line);background:#fff}
tbody tr:nth-child(even) td{background:#F7F3EC}
tbody tr:last-child td{border-bottom:none}
td.n{text-align:right;font-weight:700;color:var(--rust);white-space:nowrap}

/* A4 cover — photo top, panel bottom */
.cv{padding:0;overflow:hidden;background:#062E26;color:#fff;justify-content:flex-start}
.cv .top{position:relative;height:150mm;overflow:hidden;flex:none}
.cv .top img{width:100%;height:100%;object-fit:cover;object-position:34% 26%}
.cv .top:after{content:'';position:absolute;left:0;right:0;bottom:0;height:64mm;
  background:linear-gradient(180deg,rgba(6,46,38,0),#062E26 82%)}
.cv .kick{position:absolute;left:18mm;top:15mm;z-index:2;font-size:9pt;letter-spacing:.22em;
  font-weight:700;color:#08322A;background:#F0C980;padding:2.4mm 6mm;border-radius:20mm}
.cv .body{padding:0 18mm 16mm;margin-top:-26mm;position:relative;z-index:2;
  display:flex;flex-direction:column;flex:1}
.cv h1{font-size:33pt;line-height:1.12;color:#fff;letter-spacing:-.01em}
.cv h1 em{font-style:normal;color:#F5C451;display:block}
.cv .bar{width:32mm;height:1.5mm;background:#F5C451;border-radius:1mm;margin:6mm 0 6mm}
.cv .sub{font-size:13.5pt;line-height:1.6;color:#BEDCD2;font-weight:600}
.cv .ticks{margin-top:8mm;display:grid;grid-template-columns:1fr 1fr;gap:3mm 6mm}
.cv .t{display:flex;align-items:center;gap:3mm;font-size:11pt;color:#E3F2EB;font-weight:600}
.cv .t i{width:5.4mm;height:5.4mm;border-radius:50%;background:#F5C451;flex:none;
  display:flex;align-items:center;justify-content:center;font-style:normal;
  color:#08322A;font-size:8pt;font-weight:700}
.cv .foot{margin-top:auto;font-size:10.5pt;color:#9FC6B8;line-height:1.6;
  border-top:.4pt solid rgba(245,196,81,.3);padding-top:5mm}
.cv .band{position:absolute;left:0;right:0;bottom:0;height:5mm;
  background:linear-gradient(90deg,#F5C451,#D9863A 55%,#B4531F)}

/* cover */
.cover{background:linear-gradient(158deg,#083E44 0%,#0F5C63 52%,#15757E 100%);
  color:#fff;justify-content:center;padding:26mm 20mm;overflow:hidden}
.cover .ring{position:absolute;border:1px solid rgba(255,255,255,.07);border-radius:50%}
.cover .kick{display:inline-block;align-self:flex-start;font-size:9pt;letter-spacing:.24em;
  font-weight:700;color:#08363B;background:#EBC77E;padding:2.6mm 6mm;border-radius:20mm;margin-bottom:9mm}
.cover h1{font-size:36pt;color:#fff;line-height:1.16;margin-bottom:6mm}
.cover h1 em{font-style:normal;color:#F0C980;display:block}
.cover .sub{font-size:14.5pt;color:#BFDCDE;line-height:1.62;font-weight:600;margin-bottom:11mm}
.cover .bar{height:1.5mm;width:34mm;background:#EBC77E;border-radius:1mm;margin-bottom:9mm}
.cover .pills{display:flex;gap:3mm;flex-wrap:wrap;margin-bottom:13mm}
.cover .pill{border:.5pt solid rgba(255,255,255,.38);border-radius:20mm;
  padding:2.2mm 5.5mm;font-size:10pt;color:#DCEEEF}
.cover .foot{font-size:10.5pt;color:#9FC6C9;line-height:1.6}
.cover .band{position:absolute;left:0;right:0;bottom:0;height:5mm;
  background:linear-gradient(90deg,#EBC77E,#C4762B 60%,#B4531F)}
'''

def page(body, pg=None, cls=""):
    a = f' data-pg="{pg}"' if pg else ''
    return f'<section class="page {cls}"{a}>{body}</section>'

BODY = []

# ---------- 1 · COVER ----------
BODY.append(page(f'''
  <div class="top"><img src="data:image/png;base64,{PHOTO}"><div class="kick">বাঙালিদের জন্য</div></div>
  <div class="body">
    <h1>ডায়াবেটিস<em>নিয়ন্ত্রণে রাখুন</em></h1>
    <div class="bar"></div>
    <div class="sub">সঠিক খাবার · নিয়মিত জীবনযাপন · কম ঝুঁকি<br>
    বাড়ির রোজকার রান্নাতেই ৩০ দিনের প্ল্যান</div>
    <div class="ticks">
      <div class="t"><i>✓</i>৩০ দিনের দিন-ভিত্তিক চার্ট</div>
      <div class="t"><i>✓</i>বাঙালি খাবারের GI তালিকা</div>
      <div class="t"><i>✓</i>১৫টি সহজ রেসিপি</div>
      <div class="t"><i>✓</i>সুগার ট্র্যাকার ও প্রশ্নোত্তর</div>
    </div>
    <div class="foot">ওষুধের বিকল্প নয় — ওষুধের সঙ্গে চলার সঙ্গী।<br>
    ৭০ পাতা · সম্পূর্ণ বাংলায়</div>
  </div>
  <div class="band"></div>''', cls="plain cv"))

# ---------- 2 · CHAPTER OPENER ----------
BODY.append(page(f'''
  <div class="op" style="display:flex;flex-direction:column;flex:1">
    <div class="num">অধ্যায় ০৩</div>
    <h1>কী খাবেন,<br>কী এড়াবেন</h1>
    <div class="rule"></div>
    <div class="quote">খাবারকে ভয় পাওয়ার দরকার নেই।<br>খাবারকে চিনতে শিখলেই যথেষ্ট।</div>
    <p class="lede">ডায়াবেটিসে কোনও খাবার চিরতরে নিষিদ্ধ নয়। কোন খাবার সুগার কত দ্রুত তোলে,
    আর কতটা খেলে সেটা সামলানো যায় — এই দুটো জানলেই বেশিরভাগ কাজ হয়ে যায়।</p>
    <div class="fig" style="margin:auto 0"><div class="fw">{SVG['plate']}</div>
      <div class="cap">প্লেট সাজানোর নিয়ম — অধ্যায়ের ভিতরে বিস্তারিত</div></div>
    <div class="learn">
      <div class="lt">এই অধ্যায়ে</div>
      <ol>
        <li>কোন খাবারে সুগার কত দ্রুত ওঠে — বাঙালি খাবারের তালিকা</li>
        <li>প্লেট সাজানোর নিয়ম — মাপার যন্ত্র ছাড়াই</li>
        <li>খাওয়ার ক্রম বদলালে কী হয়</li>
        <li>যে ছয়টি খাবার নিয়ে সবচেয়ে বেশি ভুল ধারণা</li>
      </ol>
    </div>
  </div>
  <div class="brand">সুস্থ বাঙালি</div>''', pg="২৭"))

# ---------- 3 · CONTENT ----------
BODY.append(page(f'''
  <h2>একই ভাত, দুই রকম ফল</h2>
  <p>দুপুরে সমান পরিমাণ ভাত খেয়েও দু'জনের সুগার আলাদা ওঠে। কারণ ভাত নয় —
  <strong>কোন খাবারটা আগে পাতে উঠল</strong>, সেটা। আগে সবজি আর প্রোটিন গেলে
  সেগুলো পর্দার মতো কাজ করে, ভাত ধীরে ভাঙে।</p>

  <div class="fig"><div class="fw">{SVG['curve']}</div>
    <div class="cap">একই পরিমাণ ভাত — শুধু খাওয়ার ক্রম বদলে দেওয়ার ফল</div></div>

  <div class="tip"><span class="h">আজ থেকেই করুন</span>
  <p>পাতে আগে সবজি ও শাক নিন, তারপর মাছ বা ডাল, ভাত সবার শেষে।
  কিছু বাদ দিতে হচ্ছে না — শুধু ক্রমটা উল্টে দিন।</p></div>

  <h3>ছয়টি চেনা ভুল ধারণা</h3>
  <div class="da">
    <div class="c ok"><div class="t">যা ঠিক</div><ul>
      <li>ভাত খাওয়া যায় — পরিমাণ মেপে</li>
      <li>মরসুমি ফল চলে — গোটা ফল, রস নয়</li>
      <li>ঘি সামান্য চলে</li></ul></div>
    <div class="c no"><div class="t">যা ভুল</div><ul>
      <li>করলার রসে ডায়াবেটিস সারে</li>
      <li>চিনি ছাড়লেই সুগার ঠিক</li>
      <li>ফল খাওয়া বারণ</li></ul></div>
  </div>

  <div class="warn"><span class="h">মনে রাখবেন</span>
  <p>এই বই খাবার সামলাতে শেখায় — <strong>ওষুধের বিকল্প নয়।</strong>
  ডাক্তারের পরামর্শ ছাড়া কোনও ওষুধের মাত্রা বদলাবেন না।</p></div>
  <div class="brand">সুস্থ বাঙালি</div>''', pg="২৮"))

html = ('<!doctype html><html lang="bn"><head><meta charset="utf-8">'
        f'<title>Sample</title><style>{CSS}</style></head><body>'
        + ''.join(BODY) + '</body></html>')
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sample.html'), 'w').write(html)
print('sample.html written')
