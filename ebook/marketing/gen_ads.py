# -*- coding: utf-8 -*-
import os, sys
sys.path.insert(0, os.path.abspath('.'))
from svgs import SVG

OUT = 'marketing/images'
os.makedirs(OUT, exist_ok=True)

BASE = '''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:'NSB';src:url('../../assets/NotoSansBengali-400.ttf');font-weight:400;}
@font-face{font-family:'NSB';src:url('../../assets/NotoSansBengali-600.ttf');font-weight:600;}
@font-face{font-family:'NSB';src:url('../../assets/NotoSansBengali-700.ttf');font-weight:700;}
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'NSB',sans-serif}
.ad{width:%(W)spx;height:%(H)spx;position:relative;overflow:hidden;display:flex;
    flex-direction:column;justify-content:center;padding:%(PAD)spx;color:#fff}
.kick{display:inline-block;align-self:flex-start;font-size:%(KS)spx;letter-spacing:.16em;
  font-weight:700;padding:%(KPY)spx %(KPX)spx;border-radius:60px;margin-bottom:%(GAP)spx}
h1{font-size:%(HS)spx;line-height:1.06;font-weight:700;letter-spacing:-2px}
.sub{font-size:%(SS)spx;line-height:1.45;font-weight:600;margin-top:%(GAP)spx}
.rule{width:%(RW)spx;height:%(RH)spx;border-radius:8px;margin:%(GAP)spx 0}
.art{margin:%(GAP2)spx 0;background:linear-gradient(160deg,#FDFBF7,#F1ECE2);
  border-radius:%(NR)spx;padding:%(AP)spx %(AP)spx %(AP2)spx}
.art svg{width:100%%;height:auto;max-height:%(ARTH)spx}
.strip{position:absolute;left:0;right:0;bottom:0;padding:%(SPY)spx %(PAD)spx;
  display:flex;align-items:center;justify-content:space-between;gap:20px}
.strip .t{font-size:%(TS)spx;font-weight:600;line-height:1.35}
.strip .p{font-size:%(PS)spx;font-weight:700;white-space:nowrap}
.strip .p s{font-size:%(PSS)spx;font-weight:600;opacity:.55;margin-right:14px}
.band{position:absolute;left:0;right:0;bottom:0;height:%(BH)spx;
  background:linear-gradient(90deg,#F59E0B,#EA580C 55%%,#C2410C)}
.glow{position:absolute;border-radius:50%%;filter:blur(2px)}
.rowlist{margin-top:%(GAP)spx}
.rowlist div{display:flex;align-items:center;gap:%(RG)spx;font-size:%(LS)spx;
  font-weight:600;margin-bottom:%(RMB)spx}
.rowlist i{width:%(IC)spx;height:%(IC)spx;border-radius:50%%;flex:none;
  display:flex;align-items:center;justify-content:center;font-style:normal;font-size:%(ICF)spx;font-weight:700}
.num{display:flex;gap:%(NG)spx;margin-top:%(GAP)spx}
.num .c{flex:1;border-radius:%(NR)spx;padding:%(NP)spx;text-align:center}
.num .c .b{font-size:%(NBS)spx;font-weight:700;line-height:1}
.num .c .s{font-size:%(NSS)spx;font-weight:600;margin-top:10px;opacity:.85}
</style></head><body>%(BODY)s</body></html>'''

def scale(w, h):
    sq = (w == h)
    k = 1.0 if sq else 1.12
    return dict(W=w, H=h, PAD=int(78*k), KS=int(26*k), KPY=int(12*k), KPX=int(30*k),
        GAP=int(26*k), HS=int((104 if sq else 116)), SS=int(38*k), RW=int(120*k), RH=int(11*k),
        GAP2=int(34*k), ARTH=(300 if sq else 430), SPY=int(40*k), TS=int(26*k),
        PS=int(52*k), PSS=int(30*k), BH=int(14*k), RG=int(20*k), LS=int(33*k),
        RMB=int(18*k), IC=int(46*k), ICF=int(26*k), NG=int(24*k), NR=int(26*k),
        NP=int(34*k), NBS=int(78*k), NSS=int(26*k),
        AP=int(26*k), AP2=int(14*k))

GREEN_BG = "background:radial-gradient(120% 100% at 76% 8%, #1E8A63 0%, #12583F 44%, #08301F 100%)"
CREAM_BG = "background:linear-gradient(165deg,#FDFBF7 0%,#F2EDE3 100%)"
DARK_BG  = "background:radial-gradient(110% 90% at 20% 10%, #2B2118 0%, #17110C 60%, #0C0907 100%)"

def strip(dark, line, price=True):
    col = "#C8E6D7" if dark else "#44403C"
    pcol = "#FFC65C" if dark else "#C2410C"
    scol = "#B9D6C6" if dark else "#8A8378"
    p = f'<div class="p"><s style="color:{scol}">₹৩৯৯</s><span style="color:{pcol}">₹২৯৯</span></div>' if price else ''
    return f'<div class="strip"><div class="t" style="color:{col}">{line}</div>{p}</div><div class="band"></div>'

def ad1(sq):
    return f'''<div class="ad" style="{GREEN_BG}">
  <div class="glow" style="right:-180px;top:-160px;width:640px;height:640px;background:radial-gradient(circle,#F59E0B,transparent 62%);opacity:.16"></div>
  <div class="kick" style="background:#F5C451;color:#0B3A2B">বাঙালিদের জন্য</div>
  <h1>ভাত ছাড়তে<br><span style="color:#FFC65C">হবে না।</span></h1>
  <div class="rule" style="background:#F59E0B"></div>
  <div class="sub" style="color:#C8E6D7">আলাদা রান্না নয়। উপোস নয়।<br>বাড়ির খাবারেই ৩০ দিনের প্ল্যান।</div>
  <div class="art">{SVG['plate']}</div>
  {strip(True, '৬১ পাতার বাংলা গাইড')}
</div>'''

def ad2(sq):
    return f'''<div class="ad" style="{CREAM_BG};color:#1C1917">
  <div class="kick" style="background:#15654A;color:#fff">গৃহিণীদের জন্য</div>
  <h1 style="color:#0E4433">আলাদা রান্না<br><span style="color:#C2410C">করতে হবে না।</span></h1>
  <div class="rule" style="background:#C2410C"></div>
  <div class="sub" style="color:#44403C">বাড়ির সবাই একই খাবার খাবে।<br>শুধু আপনার পাতে পরিমাণটা মাপা।</div>
  <div class="art">{SVG['kitchen']}</div>
  {strip(False, '৩০ দিনের চার্ট · ১৫টি রেসিপি')}
</div>'''

def ad3(sq):
    return f'''<div class="ad" style="{DARK_BG}">
  <div class="kick" style="background:#F59E0B;color:#1C1917">রোজকার একটা ভুল</div>
  <h1>তেল ঢালেন,<br><span style="color:#FFC65C">না মাপেন?</span></h1>
  <div class="rule" style="background:#F59E0B"></div>
  <div class="num">
    <div class="c" style="background:rgba(220,38,38,.14);border:2px solid rgba(239,108,74,.45)">
      <div class="b" style="color:#F0917A">৫ চামচ</div>
      <div class="s" style="color:#E8C4B5">৬০০ ক্যালরি</div></div>
    <div class="c" style="background:rgba(245,158,11,.14);border:2px solid rgba(245,197,81,.5)">
      <div class="b" style="color:#FFC65C">৩ চামচ</div>
      <div class="s" style="color:#EBD9B4">৩৬০ ক্যালরি</div></div>
  </div>
  <div class="sub" style="color:#D8CFC4">স্বাদ প্রায় একই। দিনে ২৪০ ক্যালরি কম।</div>
  {'' if sq else '<div class="art">' + SVG['oil'] + '</div>'}
  {strip(True, 'এরকম ৩০ দিনের পুরো চার্ট')}
</div>'''

def ad4(sq):
    return f'''<div class="ad" style="{CREAM_BG};color:#1C1917">
  <div class="kick" style="background:#C2410C;color:#fff">বইয়ের সবচেয়ে দামি পাতা</div>
  <h1 style="color:#0E4433">হাতের মাপেই<br><span style="color:#C2410C">পরিমাণ।</span></h1>
  <div class="rule" style="background:#15654A"></div>
  <div class="sub" style="color:#44403C">ওজন মাপার যন্ত্র নেই। ক্যালরি গোনা নেই।</div>
  <div class="art">{SVG['hands']}</div>
  {strip(False, 'একবার শিখলে সারাজীবন কাজে লাগবে')}
</div>'''

def ad5(sq):
    no_ = [('"১০ দিনে ১০ কেজি" প্রতিশ্রুতি'), ('জিম বা দামি সাপ্লিমেন্ট'), ('না খেয়ে থাকা')]
    lis = ''.join(f'<div><i style="background:#FBE9E4;color:#DC2626">✕</i>'
                  f'<span style="color:#57534E">{t}</span></div>' for t in no_)
    lis += ('<div style="height:%(GAP)spx"></div>'
            '<div style="font-size:%(KS)spx;letter-spacing:.14em;font-weight:700;'
            'color:#15654A;margin-bottom:%(RMB)spx">যা আছে</div>')
    lis += ('<div><i style="background:#E7F2EC;color:#15654A">✓</i>'
            '<span style="color:#1C1917;font-weight:700">মাসে ২–৩ কেজি, বাড়ির খাবারেই</span></div>')
    return f'''<div class="ad" style="{CREAM_BG};color:#1C1917">
  <div class="kick" style="background:#1C1917;color:#F5C451">সৎ কথা</div>
  <h1 style="color:#0E4433">এই বইয়ে যা<br><span style="color:#C2410C">লেখা নেই।</span></h1>
  <div class="rule" style="background:#C2410C"></div>
  <div class="rowlist">{lis}</div>
  {'' if sq else '<div class="art">' + SVG['tape'] + '</div>'}
  {strip(False, 'যা সত্যি, তাই লেখা · ৬১ পাতা')}
</div>'''

ADS = [('01-vat', ad1), ('02-ranna', ad2), ('03-tel', ad3), ('04-haat', ad4), ('05-sot', ad5)]
SIZES = [('1x1', 1080, 1080), ('9x16', 1080, 1920)]

made = []
for name, fn in ADS:
    for tag, w, h in SIZES:
        cfg = scale(w, h); cfg['BODY'] = fn(w == h)
        path = f'{OUT}/ad-{name}-{tag}.html'
        open(path, 'w').write(BASE % cfg)
        made.append((path, f'{OUT}/ad-{name}-{tag}.png', w, h))
open(f'{OUT}/_list.txt','w').write('\n'.join(f'{a}|{b}|{c}|{d}' for a,b,c,d in made))
print('html files:', len(made))
