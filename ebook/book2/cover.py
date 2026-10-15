# -*- coding: utf-8 -*-
import os, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from coverart import EMBLEM
B = os.path.dirname(os.path.abspath(__file__))

items = [('১','৩০ দিনের দিন-ভিত্তিক চার্ট'), ('২','বাঙালি খাবারের GI তালিকা'),
         ('৩','১৫টি সহজ রেসিপি'),          ('৪','সুগার ট্র্যাকার ও প্রশ্নোত্তর')]
rows = ''.join(f'<div class="t"><span class="n">{n}</span>{x}</div>' for n,x in items)

HTML = '''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'NSB';src:url('../assets/NotoSansBengali-400.ttf');font-weight:400;}
@font-face{font-family:'NSB';src:url('../assets/NotoSansBengali-600.ttf');font-weight:600;}
@font-face{font-family:'NSB';src:url('../assets/NotoSansBengali-700.ttf');font-weight:700;}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'NSB',sans-serif}

.c{width:1280px;height:720px;position:relative;overflow:hidden;color:#22201C;
   background:#F8F5EE;padding:44px 58px 0}
/* কাগজের বিন্দু-জাল */
.c:before{content:'';position:absolute;inset:0;pointer-events:none;opacity:.5;
  background-image:radial-gradient(#22201C 1px,transparent 1px);background-size:22px 22px;
  -webkit-mask-image:linear-gradient(180deg,rgba(0,0,0,.16),transparent 62%%)}
/* বাঁ কিনারার নেভি মেরুদণ্ড */
.spine{position:absolute;left:0;top:0;bottom:0;width:16px;background:#17325C}
.amber{position:absolute;left:16px;top:0;bottom:0;width:5px;background:#C2700B}

.hd{display:flex;align-items:center;justify-content:space-between;
    border-bottom:1.5px solid #17325C;padding-bottom:13px;position:relative;z-index:2}
.hd .l{font-size:14px;letter-spacing:.26em;font-weight:700;color:#17325C}
.hd .r{font-size:13px;letter-spacing:.2em;color:#6E675E;font-weight:600}

.mid{display:flex;gap:36px;margin-top:30px;position:relative;z-index:2}
.L{width:640px;flex:none}
h1{font-size:72px;line-height:1.04;font-weight:700;letter-spacing:-2.4px;color:#17325C}
h1 em{font-style:normal;display:block;color:#0E2140}
.uline{width:158px;height:9px;background:#C2700B;margin:18px 0 16px}
.sub{font-size:21px;line-height:1.55;color:#4A443D;font-weight:600;max-width:612px}
.sub b{color:#17325C;font-weight:700;
  box-shadow:inset 0 -10px 0 #F6E7CE}

.list{margin-top:24px;border-top:1px solid #CFC8BB;width:612px}
.t{display:flex;align-items:center;gap:14px;font-size:18.5px;color:#22201C;font-weight:600;
   border-bottom:1px solid #CFC8BB;padding:7.5px 0}
.t .n{font-size:13px;letter-spacing:.1em;font-weight:700;color:#C2700B;min-width:30px}

.R{flex:1;display:flex;align-items:flex-start;justify-content:center;padding-top:26px}
.R svg{width:376px;height:auto}

/* নিচের সারি */
.ft{position:absolute;left:58px;right:58px;bottom:40px;z-index:2;
    display:flex;align-items:stretch;gap:26px;border-top:1.5px solid #17325C;padding-top:20px}
.tag{background:#17325C;color:#fff;padding:12px 24px 13px;display:flex;align-items:baseline;gap:12px}
.tag .now{font-size:48px;font-weight:700;letter-spacing:-1px;line-height:1}
.tag .cur{font-size:19px;color:#B9C9E2;font-weight:600}
.meta{display:flex;flex-direction:column;justify-content:center;gap:5px}
.meta .o{font-size:22px;color:#4A443D;font-weight:700}
.meta .o s{text-decoration-color:#C2700B;text-decoration-thickness:2.5px}
.meta .d{font-size:16px;font-weight:700;color:#C2700B;letter-spacing:.06em}
.acc{margin-left:auto;text-align:right;display:flex;flex-direction:column;
     justify-content:center;gap:5px;font-size:15px;color:#4A443D;font-weight:600;line-height:1.5}
.acc b{color:#17325C}
.bar{position:absolute;left:0;right:0;bottom:0;height:14px;background:#17325C}
.bar:after{content:'';position:absolute;left:0;bottom:0;height:14px;width:34%%;background:#C2700B}
</style></head><body>
<div class="c">
  <div class="spine"></div><div class="amber"></div>

  <div class="hd">
    <div class="l">সুস্থ বাংলা</div>
    <div class="r">বাংলা স্বাস্থ্য গাইড · ০২</div>
  </div>

  <div class="mid">
    <div class="L">
      <h1>ডায়াবেটিস<em>নিয়ন্ত্রণে রাখুন</em></h1>
      <div class="uline"></div>
      <div class="sub">ভাত-রুটি বাদ নয় — <b>মাপ, সময় আর সঙ্গী খাবার</b> বদলালেই
        সুগার নামতে শুরু করে। বাড়ির রোজকার রান্নাতেই ৩০ দিনের প্ল্যান।</div>
      <div class="list">%s</div>
    </div>
    <div class="R">%s</div>
  </div>

  <div class="ft">
    <div class="tag"><span class="now">₹২৯৯</span><span class="cur">একবারই</span></div>
    <div class="meta">
      <div class="o"><s>₹৩৯৯</s></div>
      <div class="d">২৫%% ছাড়</div>
    </div>
    <div class="acc"><b>ওষুধের বিকল্প নয় — ওষুধের সঙ্গে চলার সঙ্গী।</b>
      ৭০ পাতা · সম্পূর্ণ বাংলায় · আজীবন অ্যাক্সেস</div>
  </div>
  <div class="bar"></div>
</div></body></html>'''

open(os.path.join(B,'cover.html'),'w').write(HTML % (rows, EMBLEM))
print('cover.html written')
