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
.c{width:1280px;height:720px;position:relative;overflow:hidden;
   background:radial-gradient(120%% 100%% at 20%% 0%%,#12604F 0%%,#0B4438 45%%,#062E26 100%%);
   color:#fff}

/* photo on the right, feathered into the panel */
.ph{position:absolute;right:0;top:0;width:560px;height:100%%;overflow:hidden}
.ph img{width:100%%;height:100%%;object-fit:cover;object-position:32%% 28%%}
.ph:after{content:'';position:absolute;inset:0;
  background:linear-gradient(90deg,#062E26 0%%,rgba(6,46,38,.82) 16%%,rgba(6,46,38,0) 48%%)}

.glow{position:absolute;left:-140px;bottom:-220px;width:560px;height:560px;border-radius:50%%;
  background:radial-gradient(circle,#F5C451,transparent 62%%);opacity:.13}
.band{position:absolute;left:0;right:0;bottom:0;height:12px;
  background:linear-gradient(90deg,#F5C451,#D9863A 52%%,#B4531F)}

.L{position:absolute;left:70px;top:56px;width:660px;z-index:3}
.kick{display:inline-block;font-size:16px;letter-spacing:.2em;font-weight:700;
  color:#08322A;background:#F0C980;padding:8px 20px;border-radius:30px;margin-bottom:22px}
h1{font-size:66px;line-height:1.08;font-weight:700;letter-spacing:-1.5px}
h1 em{font-style:normal;color:#F5C451;display:block}
.rule{width:110px;height:7px;background:#F5C451;border-radius:4px;margin:22px 0 20px}
.sub{font-size:23px;line-height:1.5;color:#BEDCD2;font-weight:600}

.ticks{margin-top:26px;display:grid;grid-template-columns:1fr 1fr;gap:11px 26px;width:600px}
.t{display:flex;align-items:center;gap:11px;font-size:18.5px;color:#E3F2EB;font-weight:600}
.t i{width:24px;height:24px;border-radius:50%%;background:#F5C451;flex:none;
  display:flex;align-items:center;justify-content:center;font-style:normal}
.t i svg{width:13px;height:13px}

.price{position:absolute;left:70px;bottom:56px;z-index:4;display:flex;align-items:center;gap:20px}
.price .now{font-size:70px;font-weight:700;color:#F5C451;line-height:.94;letter-spacing:-1px}
.price .col{display:flex;flex-direction:column;gap:8px;align-items:flex-start}
.price .old{font-size:29px;color:#DCEBE3;font-weight:700;position:relative}
.price .old:after{content:'';position:absolute;left:-5px;right:-5px;top:47%%;height:2.5px;
  background:#F0704A;transform:rotate(-6deg);border-radius:2px;opacity:.9}
.off{background:linear-gradient(135deg,#F5C451,#C2410C);color:#fff;font-size:17px;font-weight:700;
  padding:7px 17px;border-radius:30px;box-shadow:0 8px 22px rgba(194,65,12,.38)}
.lbl{font-size:15px;color:#BEDCD2;font-weight:600;line-height:1.45}

.note{position:absolute;right:44px;bottom:38px;z-index:4;text-align:right;
  font-size:14.5px;color:#DFF0E8;line-height:1.55;font-weight:600;
  background:rgba(6,46,38,.55);padding:12px 18px;border-radius:12px;
  border:1px solid rgba(245,196,81,.28)}
</style></head><body>
<div class="c">
  <div class="ph"><img src="data:image/png;base64,%s"></div>
  <div class="glow"></div>

  <div class="L">
    <div class="kick">বাঙালিদের জন্য</div>
    <h1>ডায়াবেটিস<em>নিয়ন্ত্রণে রাখুন</em></h1>
    <div class="rule"></div>
    <div class="sub">সঠিক খাবার · নিয়মিত জীবনযাপন · কম ঝুঁকি<br>বাড়ির রোজকার রান্নাতেই ৩০ দিনের প্ল্যান</div>
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

TICK = ('<svg viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L19 7" stroke="#08322A" '
        'stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>')
items = ['৩০ দিনের দিন-ভিত্তিক চার্ট', 'বাঙালি খাবারের GI তালিকা',
         '১৫টি সহজ রেসিপি', 'সুগার ট্র্যাকার ও প্রশ্নোত্তর']
ticks = ''.join(f'<div class="t"><i>{TICK}</i>{t}</div>' for t in items)

open(os.path.join(B,'cover.html'),'w').write(HTML % (img, ticks))
print('cover.html written')
