# -*- coding: utf-8 -*-
import base64, os
B = os.path.dirname(os.path.abspath(__file__))
img = base64.b64encode(open(os.path.join(B,'img/model.png'),'rb').read()).decode()

HTML = '''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'NSB';src:url('../assets/NotoSansBengali-400.ttf');font-weight:400;}
@font-face{font-family:'NSB';src:url('../assets/NotoSansBengali-600.ttf');font-weight:600;}
@font-face{font-family:'NSB';src:url('../assets/NotoSansBengali-700.ttf');font-weight:700;}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'NSB',sans-serif}

.c{width:1280px;height:720px;position:relative;overflow:hidden;color:#123A2E;
   background:linear-gradient(105deg,#FFFFFF 0%%,#F4FAF4 38%%,#EAF4EC 66%%,#E2F0E6 100%%)}

/* soft organic tints so the frame is not flat white */
.b1{position:absolute;left:-190px;top:-220px;width:640px;height:640px;border-radius:50%%;
    background:radial-gradient(circle,#BFE3C6,transparent 66%%);opacity:.55}
.b2{position:absolute;left:120px;bottom:-300px;width:720px;height:640px;border-radius:50%%;
    background:radial-gradient(circle,#D8EBBF,transparent 68%%);opacity:.5}

/* the photo — feathered on every edge so it dissolves into the page */
.ph{position:absolute;right:0;top:0;width:720px;height:100%%}
.ph img{width:100%%;height:100%%;object-fit:cover;object-position:46%% 33%%;display:block;
   -webkit-mask-image:
      linear-gradient(90deg,transparent 0%%,rgba(0,0,0,.35) 18%%,#000 42%%),
      linear-gradient(180deg,transparent 0%%,#000 9%%,#000 93%%,transparent 100%%);
   -webkit-mask-composite:source-in;mask-composite:intersect}
/* tint pass: pulls the photo's whites toward the page's green-cream */
.ph:after{content:'';position:absolute;inset:0;pointer-events:none;
   background:linear-gradient(100deg,rgba(226,240,230,.85) 0%%,rgba(226,240,230,.30) 30%%,
              rgba(226,240,230,0) 52%%),
              linear-gradient(0deg,rgba(232,244,234,.34),rgba(232,244,234,0) 22%%)}

.band{position:absolute;left:0;right:0;bottom:0;height:11px;
  background:linear-gradient(90deg,#0E7A55,#4E9B3E 55%%,#C2410C)}

.L{position:absolute;left:64px;top:52px;width:600px;z-index:3}
.kick{display:inline-block;font-size:15.5px;letter-spacing:.2em;font-weight:700;
  color:#fff;background:#0E7A55;padding:8px 20px;border-radius:30px;margin-bottom:20px;
  box-shadow:0 6px 16px rgba(14,122,85,.24)}
h1{font-size:67px;line-height:1.07;font-weight:700;letter-spacing:-1.6px;color:#0C3A30}
h1 em{font-style:normal;display:block;color:#0E7A55}
.rule{width:104px;height:7px;background:#C2410C;border-radius:4px;margin:20px 0 18px}
.sub{font-size:22px;line-height:1.5;color:#3C5C51;font-weight:600}
.sub b{color:#0C3A30;font-weight:700}

.ticks{margin-top:24px;display:grid;grid-template-columns:1fr 1fr;gap:11px 22px;width:590px}
.t{display:flex;align-items:center;gap:10px;font-size:18px;color:#1E4A3D;font-weight:600}
.t i{width:24px;height:24px;border-radius:50%%;background:#0E7A55;flex:none;
  display:flex;align-items:center;justify-content:center;font-style:normal;
  box-shadow:0 3px 8px rgba(14,122,85,.28)}
.t i svg{width:13px;height:13px}

.price{position:absolute;left:64px;bottom:48px;z-index:4;display:flex;align-items:center;gap:18px;
  background:rgba(255,255,255,.72);border:1px solid #CFE6D6;border-radius:18px;
  padding:14px 24px 14px 22px;box-shadow:0 14px 34px rgba(12,58,48,.10)}
.price .now{font-size:66px;font-weight:700;color:#C2410C;line-height:.94;letter-spacing:-1px}
.price .col{display:flex;flex-direction:column;gap:7px;align-items:flex-start}
.price .old{font-size:28px;color:#456254;font-weight:700;position:relative}
.price .old:after{content:'';position:absolute;left:-5px;right:-5px;top:47%%;height:2.6px;
  background:#C2410C;transform:rotate(-6deg);border-radius:2px}
.off{background:linear-gradient(135deg,#128A5E,#0B5F42);color:#fff;font-size:16px;font-weight:700;
  padding:6px 15px;border-radius:30px}
.lbl{font-size:14.5px;color:#4A6A5D;font-weight:600;line-height:1.45;
  border-left:2px solid #CFE6D6;padding-left:16px}

.note{position:absolute;right:40px;bottom:36px;z-index:4;text-align:right;
  font-size:14.5px;color:#1E4A3D;line-height:1.55;font-weight:600;
  background:rgba(255,255,255,.80);padding:12px 18px;border-radius:12px;
  border:1px solid #CFE6D6;box-shadow:0 8px 22px rgba(12,58,48,.09)}
</style></head><body>
<div class="c">
  <div class="b1"></div><div class="b2"></div>
  <div class="ph"><img src="data:image/png;base64,%s"></div>

  <div class="L">
    <div class="kick">বাঙালিদের জন্য</div>
    <h1>ডায়াবেটিস<em>নিয়ন্ত্রণে রাখুন</em></h1>
    <div class="rule"></div>
    <div class="sub">সঠিক খাবার · নিয়মিত জীবনযাপন · কম ঝুঁকি<br>
      <b>বাড়ির রোজকার রান্নাতেই ৩০ দিনের প্ল্যান</b></div>
    <div class="ticks">
      %s
    </div>
  </div>

  <div class="price">
    <div class="now">₹২৯৯</div>
    <div class="col">
      <div class="old">₹৩৯৯</div>
      <div class="off">২৫%% ছাড়</div>
    </div>
    <div class="lbl">একবারই<br>আজীবন অ্যাক্সেস</div>
  </div>

  <div class="note">ওষুধের বিকল্প নয় —<br>ওষুধের সঙ্গে চলার সঙ্গী।</div>
  <div class="band"></div>
</div></body></html>'''

TICK = ('<svg viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#fff" '
        'stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>')
items = ['৩০ দিনের দিন-ভিত্তিক চার্ট', 'বাঙালি খাবারের GI তালিকা',
         '১৫টি সহজ রেসিপি', 'সুগার ট্র্যাকার ও প্রশ্নোত্তর']
ticks = ''.join(f'<div class="t"><i>{TICK}</i>{t}</div>' for t in items)

open(os.path.join(B,'cover.html'),'w').write(HTML % (img, ticks))
print('cover.html written')
