# -*- coding: utf-8 -*-
import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from svgs2 import SVG
_B = os.path.dirname(os.path.abspath(__file__))
from coverart import EMBLEM

CSS = '''
@font-face{font-family:'NSB';src:url('../assets/NotoSansBengali-400.ttf');font-weight:400;}
@font-face{font-family:'NSB';src:url('../assets/NotoSansBengali-600.ttf');font-weight:600;}
@font-face{font-family:'NSB';src:url('../assets/NotoSansBengali-700.ttf');font-weight:700;}
:root{
 --navy:#17325C; --navy-d:#0E2140; --navy-l:#DBE5F2; --navy-xl:#EEF3F9;
 --amb:#C2700B; --amb-l:#F6E7CE;
 --olive:#5B7C3A; --olive-l:#E9EFDD;
 --ink:#22201C; --ink2:#4A443D; --mut:#8B837A;
 --paper:#F8F5EE; --line:#D6CFC2; --hair:#C4BCAD;
}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'NSB',sans-serif;color:var(--ink);background:#8a8a8a;
     font-size:11.6pt;line-height:1.76;-webkit-font-smoothing:antialiased}
.page{width:210mm;min-height:297mm;background:var(--paper);margin:0 auto 8mm;
      padding:18mm 18mm 15mm;position:relative;display:flex;flex-direction:column}
@page{size:A4;margin:0}
@media print{body{background:#fff}.page{margin:0;page-break-after:always}
 .page:last-child{page-break-after:auto}}

/* বাঁ কিনারার মেরুদণ্ড — বই ২-এর চিহ্ন */
.page:not(.plain):before{content:'';position:absolute;left:0;top:0;bottom:0;width:3.4mm;
  background:var(--navy)}
.page:not(.plain):after{content:attr(data-pg);position:absolute;bottom:9mm;left:18mm;
  font-size:9pt;color:var(--navy);letter-spacing:.12em;font-weight:700}
.brand{position:absolute;bottom:9mm;right:18mm;font-size:8pt;letter-spacing:.18em;
  color:var(--mut);text-transform:uppercase}
.footrule{position:absolute;left:18mm;right:18mm;bottom:15.5mm;height:.4pt;background:var(--hair)}

h1{font-size:26pt;line-height:1.2;font-weight:700;color:var(--navy);letter-spacing:-.015em}
h2{font-size:16.5pt;font-weight:700;color:var(--navy);line-height:1.32;
   border-bottom:1.2pt solid var(--navy);padding-bottom:2.6mm;margin-bottom:5mm}
h3{font-size:12.5pt;font-weight:700;color:var(--ink);margin:5.5mm 0 2mm;
   padding-left:4mm;border-left:1.2mm solid var(--amb)}
p{margin:0 0 3.4mm}
strong{font-weight:700;color:var(--navy-d)}
.lede{font-size:12.5pt;line-height:1.68;color:var(--ink2);margin-bottom:5mm}
.rule{height:1.6mm;width:28mm;background:var(--amb);margin:4mm 0 5mm}

/* অধ্যায়ের শুরু */
.op .num{font-size:9pt;letter-spacing:.28em;color:var(--amb);font-weight:700;
  border-bottom:.4pt solid var(--hair);padding-bottom:3mm;margin-bottom:7mm}
.op h1{font-size:33pt}
.op .quote{font-size:14pt;color:var(--navy);line-height:1.55;font-weight:600;
  border-top:.4pt solid var(--hair);border-bottom:.4pt solid var(--hair);
  padding:5mm 0;margin:7mm 0 7mm}
.learn{border-top:1.2pt solid var(--navy);padding-top:5mm;margin-top:auto}
.learn .lt{font-size:8.5pt;letter-spacing:.24em;color:var(--amb);font-weight:700;
  text-transform:uppercase;margin-bottom:3.5mm}
.learn ol{list-style:none;counter-reset:l}
.learn li{counter-increment:l;display:flex;gap:5mm;align-items:baseline;
  padding:2.4mm 0;border-bottom:.4pt solid var(--hair);font-size:11.5pt}
.learn li:last-child{border-bottom:none}
.learn li::before{content:counter(l,bengali);font-size:9pt;font-weight:700;
  color:var(--amb);min-width:8mm;letter-spacing:.08em}

/* ছবি */
.fig{margin:4.5mm 0}
.fig .fw{background:#fff;border:.4pt solid var(--hair);padding:6mm 6mm 4mm}
.fig svg{display:block;width:100%;height:auto;max-height:46mm}
.fig .cap{font-size:9.5pt;color:var(--mut);margin-top:2.4mm;padding-left:4mm;
  border-left:.8mm solid var(--hair)}

/* বাক্স — গোল কোণ নেই, উপরে সরু রুল */
.tip,.note,.warn{padding:4mm 5mm;margin:4mm 0;border-top:1.4mm solid}
.tip{background:var(--olive-l);border-color:var(--olive)}
.note{background:var(--navy-xl);border-color:var(--navy)}
.warn{background:var(--amb-l);border-color:var(--amb)}
.tip .h,.note .h,.warn .h{font-size:8.5pt;letter-spacing:.22em;text-transform:uppercase;
  font-weight:700;margin-bottom:2.2mm;display:block}
.tip .h{color:#3D5426}.note .h{color:var(--navy)}.warn .h{color:#8A4E06}
.tip p:last-child,.note p:last-child,.warn p:last-child{margin-bottom:0}

/* করবেন / করবেন না */
.da{display:grid;grid-template-columns:1fr 1fr;gap:0;margin:4mm 0;
    border:.4pt solid var(--hair);background:#fff}
.da .c{padding:4.5mm 5mm}
.da .c+.c{border-left:.4pt solid var(--hair)}
.da .c .t{font-size:9pt;font-weight:700;letter-spacing:.2em;margin-bottom:3mm;
  text-transform:uppercase;padding-bottom:2mm;border-bottom:.4pt solid var(--hair)}
.da .ok .t{color:var(--olive)} .da .no .t{color:var(--amb)}
.da ul{list-style:none} .da li{font-size:11pt;padding:1.6mm 0;display:flex;gap:3mm}
.da li::before{font-weight:700;flex:none}
.da .ok li::before{content:'+';color:var(--olive)}
.da .no li::before{content:'−';color:var(--amb)}

table{width:100%;border-collapse:collapse;margin:5mm 0;font-size:10.5pt}
th{background:var(--navy);color:#fff;text-align:left;padding:2.8mm 3.4mm;
   font-size:9pt;font-weight:600;letter-spacing:.06em}
td{padding:2.6mm 3.4mm;border-bottom:.4pt solid var(--hair);background:#fff}
tbody tr:nth-child(even) td{background:#FBF9F4}
td.n{text-align:right;font-weight:700;color:var(--amb);white-space:nowrap}

/* ---------- A4 প্রচ্ছদ ---------- */
.cv{padding:16mm 16mm 0;background:var(--paper);overflow:hidden;justify-content:flex-start}
.cv .grid{position:absolute;inset:0;pointer-events:none;opacity:.5;
  background-image:radial-gradient(#22201C 1px,transparent 1px);background-size:8mm 8mm;
  -webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,.18),transparent 55%)}
.cv .spine{position:absolute;left:0;top:0;bottom:0;width:5mm;background:var(--navy)}
.cv .spine2{position:absolute;left:5mm;top:0;bottom:0;width:1.6mm;background:var(--amb)}
.cv .hd{display:flex;justify-content:space-between;align-items:center;
  border-bottom:1.2pt solid var(--navy);padding:0 0 4mm 8mm;position:relative;z-index:2}
.cv .hd .l{font-size:10pt;letter-spacing:.26em;font-weight:700;color:var(--navy)}
.cv .hd .r{font-size:9pt;letter-spacing:.2em;color:var(--mut);font-weight:600}
.cv .in{padding-left:8mm;position:relative;z-index:2;display:flex;flex-direction:column;flex:1}
.cv h1{font-size:42pt;line-height:1.04;letter-spacing:-.03em;color:var(--navy);margin-top:11mm}
.cv h1 em{font-style:normal;display:block;color:var(--navy-d)}
.cv .ul{width:44mm;height:2.4mm;background:var(--amb);margin:6mm 0 5mm}
.cv .sub{font-size:13pt;line-height:1.6;color:var(--ink2);font-weight:600;max-width:150mm}
.cv .sub b{color:var(--navy);box-shadow:inset 0 -3mm 0 var(--amb-l)}
.cv .art{margin:6mm 0 0;display:flex;justify-content:center}
.cv .art svg{width:108mm;height:auto}
.cv .list{margin-top:auto;border-top:1.2pt solid var(--navy)}
.cv .lt{font-size:8.5pt;letter-spacing:.24em;text-transform:uppercase;font-weight:700;
  color:var(--amb);margin:4mm 0 2mm}
.cv .rows{display:grid;grid-template-columns:1fr 1fr;gap:0 8mm}
.cv .t{display:flex;gap:4mm;align-items:baseline;font-size:11pt;font-weight:600;
  padding:2.4mm 0;border-bottom:.4pt solid var(--hair)}
.cv .t .n{font-size:8.5pt;font-weight:700;color:var(--amb);letter-spacing:.08em;min-width:7mm}
.cv .foot{padding:5mm 0 9mm;font-size:10pt;color:var(--ink2);line-height:1.6}
.cv .foot b{color:var(--navy)}
.cv .bar{position:absolute;left:0;right:0;bottom:0;height:6mm;background:var(--navy)}
.cv .bar:after{content:'';position:absolute;left:0;bottom:0;height:6mm;width:34%;
  background:var(--amb)}
'''

def page(body, pg=None, cls=""):
    a = f' data-pg="{pg}"' if pg else ''
    return f'<section class="page {cls}"{a}>{body}</section>'

BODY = []

# ---------- 1 · COVER ----------
BODY.append(page(f'''
  <div class="grid"></div><div class="spine"></div><div class="spine2"></div>
  <div class="hd"><div class="l">সুস্থ বাংলা</div>
    <div class="r">বাংলা স্বাস্থ্য গাইড · ০২</div></div>
  <div class="in">
    <h1>ডায়াবেটিস<em>নিয়ন্ত্রণে রাখুন</em></h1>
    <div class="ul"></div>
    <div class="sub">ভাত-রুটি বাদ নয় — <b>মাপ, সময় আর সঙ্গী খাবার</b> বদলালেই সুগার
      নামতে শুরু করে। বাড়ির রোজকার রান্নাতেই ৩০ দিনের প্ল্যান।</div>
    <div class="art">{EMBLEM}</div>
    <div class="list">
      <div class="lt">বইটিতে যা পাবেন</div>
      <div class="rows">
        <div class="t"><span class="n">১</span>৩০ দিনের দিন-ভিত্তিক চার্ট</div>
        <div class="t"><span class="n">২</span>বাঙালি খাবারের GI তালিকা</div>
        <div class="t"><span class="n">৩</span>১৫টি সহজ রেসিপি</div>
        <div class="t"><span class="n">৪</span>বিপদে কী করবেন — জরুরি নির্দেশ</div>
        <div class="t"><span class="n">৫</span>সুগার ট্র্যাকার ও প্রশ্নোত্তর</div>
        <div class="t"><span class="n">৬</span>উৎসব, বাইরে খাওয়া ও ভ্রমণ</div>
      </div>
      <div class="foot"><b>৭০ পাতা · সম্পূর্ণ বাংলায়</b><br>
      ওষুধের বিকল্প নয় — ওষুধের সঙ্গে চলার সঙ্গী।</div>
    </div>
  </div>
  <div class="bar"></div>''', cls="plain cv"))

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
  <div class="footrule"></div><div class="brand">সুস্থ বাংলা</div>''', pg="২৭"))

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
  <div class="footrule"></div><div class="brand">সুস্থ বাংলা</div>''', pg="২৮"))

html = ('<!doctype html><html lang="bn"><head><meta charset="utf-8">'
        f'<title>Sample</title><style>{CSS}</style></head><body>'
        + ''.join(BODY) + '</body></html>')
open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'sample.html'), 'w').write(html)
print('sample.html written')
