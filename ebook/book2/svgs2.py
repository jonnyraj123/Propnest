# -*- coding: utf-8 -*-
# Diabetes book — calmer, more editorial illustration set.
T='#17325C'   # deep navy (primary)
TD='#0E2140'
TL='#DBE5F2'
A='#C2700B'   # amber accent
AL='#F6E7CE'
G='#5B7C3A'   # olive (safe/good)
GL='#E6EDDC'
W='#FFFFFF'; IN='#3F3A34'; MU='#8A8078'; CR='#F8F5EE'

def wrap(inner, vb="0 0 480 200"):
    return f'<svg viewBox="{vb}" xmlns="http://www.w3.org/2000/svg" role="img">{inner}</svg>'

SVG = {}

# ---------- plate method for diabetes ----------
SVG['plate'] = wrap(f'''
<circle cx="150" cy="100" r="82" fill="{W}" stroke="{TL}" stroke-width="3"/>
<path d="M150 18 A82 82 0 0 0 150 182 Z" fill="{GL}"/>
<path d="M150 18 A82 82 0 0 1 232 100 L150 100 Z" fill="{AL}"/>
<path d="M150 182 A82 82 0 0 0 232 100 L150 100 Z" fill="{TL}"/>
<circle cx="150" cy="100" r="82" fill="none" stroke="{TD}" stroke-width="2.5"/>
<line x1="150" y1="18" x2="150" y2="182" stroke="{TD}" stroke-width="2"/>
<line x1="150" y1="100" x2="232" y2="100" stroke="{TD}" stroke-width="2"/>
<g fill="{G}"><circle cx="112" cy="70" r="7"/><circle cx="96" cy="100" r="6"/>
<circle cx="114" cy="128" r="7"/><circle cx="130" cy="88" r="5"/><circle cx="128" cy="118" r="5"/></g>
<path d="M172 58 q18 -11 34 0 q-12 11 -34 0 Z" fill="{A}"/><circle cx="200" cy="59" r="2.2" fill="{W}"/>
<g fill="{T}" opacity=".55"><circle cx="176" cy="130" r="3"/><circle cx="188" cy="124" r="3"/>
<circle cx="199" cy="133" r="3"/><circle cx="186" cy="140" r="3"/></g>
<g>
 <rect x="262" y="34" width="14" height="14" rx="3" fill="{GL}" stroke="{G}" stroke-width="2"/>
 <text x="286" y="46" font-size="15" fill="{IN}" font-weight="700">অর্ধেক — সবজি ও শাক</text>
 <rect x="262" y="86" width="14" height="14" rx="3" fill="{AL}" stroke="{A}" stroke-width="2"/>
 <text x="286" y="98" font-size="15" fill="{IN}" font-weight="700">এক ভাগ — মাছ, ডিম, ডাল</text>
 <rect x="262" y="138" width="14" height="14" rx="3" fill="{TL}" stroke="{T}" stroke-width="2"/>
 <text x="286" y="150" font-size="15" fill="{IN}" font-weight="700">এক ভাগ — ভাত বা রুটি</text>
</g>''')

# ---------- glucose curve: same rice, different order ----------
def _curve(pts, col, dash=""):
    d = "M" + " L".join(f"{x} {y}" for x, y in pts)
    return f'<path d="{d}" stroke="{col}" stroke-width="4" fill="none" stroke-linecap="round" stroke-linejoin="round" {dash}/>'
SVG['curve'] = wrap(f'''
<line x1="66" y1="140" x2="440" y2="140" stroke="{TL}" stroke-width="2.5"/>
<line x1="66" y1="20" x2="66" y2="140" stroke="{TL}" stroke-width="2.5"/>
<text x="52" y="28" font-size="13" fill="{MU}" text-anchor="end">সুগার</text>
<text x="440" y="158" font-size="13" fill="{MU}" text-anchor="end">সময় →</text>
''' + _curve([(66,133),(130,58),(200,38),(280,74),(360,110),(430,127)], A)
   + _curve([(66,133),(130,100),(200,88),(280,100),(360,118),(430,130)], G)
   + f'''
<circle cx="200" cy="38" r="5.5" fill="{A}"/>
<circle cx="200" cy="88" r="5.5" fill="{G}"/>
<g>
 <rect x="86" y="176" width="13" height="13" rx="3" fill="{A}"/>
 <text x="107" y="187" font-size="14" fill="{IN}" font-weight="700">আগে ভাত</text>
 <rect x="216" y="176" width="13" height="13" rx="3" fill="{G}"/>
 <text x="237" y="187" font-size="14" fill="{IN}" font-weight="700">আগে সবজি ও প্রোটিন</text>
</g>''')

# ---------- hypo warning ----------
SVG['hypo'] = wrap(f'''
<g>
 <circle cx="88" cy="76" r="42" fill="{AL}" stroke="{A}" stroke-width="3"/>
 <path d="M88 52 v30" stroke="{A}" stroke-width="7" stroke-linecap="round"/>
 <circle cx="88" cy="98" r="4.5" fill="{A}"/>
</g>
<text x="150" y="52" font-size="17" fill="{TD}" font-weight="700">এই লক্ষণগুলো দেখলে</text>
<g font-size="15" fill="{IN}">
 <text x="150" y="80">ঘাম · হাত কাঁপা · হঠাৎ খুব খিদে</text>
 <text x="150" y="104">মাথা ঘোরা · বুক ধড়ফড় · চোখে ঝাপসা</text>
</g>
<g>
 <rect x="64" y="132" width="352" height="52" rx="10" fill="{GL}" stroke="{G}" stroke-width="2"/>
 <text x="240" y="154" font-size="15" fill="#3D5426" font-weight="700" text-anchor="middle">সঙ্গে সঙ্গে ৩ চামচ চিনি বা ১ গ্লাস মিষ্টি শরবত</text>
 <text x="240" y="174" font-size="14" fill="#5B6B4A" text-anchor="middle">১৫ মিনিট পরেও না কমলে আবার। তারপর ডাক্তারকে জানান।</text>
</g>''')

# ---------- GI comparison bars ----------
def _bar(x, h, col, label, val):
    y = 152 - h
    return (f'<rect x="{x}" y="{y}" width="52" height="{h}" rx="6" fill="{col}"/>'
            f'<text x="{x+26}" y="{y-9}" font-size="14" fill="{IN}" font-weight="700" text-anchor="middle">{val}</text>'
            f'<text x="{x+26}" y="172" font-size="14" fill="{MU}" text-anchor="middle">{label}</text>')
SVG['gi'] = wrap(f'''
<line x1="40" y1="152" x2="452" y2="152" stroke="{TL}" stroke-width="2.5"/>
{_bar(60,112,A,'সাদা ভাত','৭৩')}
{_bar(138,96,'#C97A3E','লুচি','৬৭')}
{_bar(216,76,'#D8A05A','আটার রুটি','৬২')}
{_bar(294,52,'#8FA36B','ঢেঁকি ছাঁটা চাল','৫০')}
{_bar(372,34,G,'ডাল ও সবজি','৩০')}
<text x="246" y="196" font-size="14" fill="{MU}" text-anchor="middle" font-style="italic">সংখ্যা যত কম, সুগার তত ধীরে ওঠে</text>''')
