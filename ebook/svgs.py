# -*- coding: utf-8 -*-
# Flat vector illustrations. Palette-locked, no external assets.
G='#15654A'; GD='#0E4433'; GL='#CFE6DA'; T='#C2410C'; TL='#F7D9C6'
GO='#B45309'; GOL='#F6E2BE'; CR='#FDFBF7'; IN='#44403C'; W='#FFFFFF'

def wrap(inner, vb="0 0 480 168"):
    return f'<svg viewBox="{vb}" xmlns="http://www.w3.org/2000/svg" role="img">{inner}</svg>'

SVG = {}

# ---------- plate: half veg, quarter protein, quarter rice ----------
SVG['plate'] = wrap(f'''
<circle cx="240" cy="76" r="66" fill="{W}" stroke="{GL}" stroke-width="3"/>
<path d="M240 12 A64 64 0 0 0 240 140 Z" fill="{GL}"/>
<path d="M240 12 A64 64 0 0 1 304 76 L240 76 Z" fill="{TL}"/>
<path d="M240 140 A64 64 0 0 0 304 76 L240 76 Z" fill="{GOL}"/>
<circle cx="205" cy="52" r="7" fill="{G}"/><circle cx="192" cy="78" r="6" fill="{G}"/>
<circle cx="208" cy="100" r="7" fill="{G}"/><circle cx="222" cy="66" r="5" fill="{G}"/>
<circle cx="220" cy="96" r="5" fill="{G}"/>
<path d="M262 44 q16 -10 30 0 q-10 10 -30 0 Z" fill="{T}"/><circle cx="286" cy="45" r="2" fill="{W}"/>
<circle cx="266" cy="102" r="2.6" fill="{GO}"/><circle cx="276" cy="96" r="2.6" fill="{GO}"/>
<circle cx="286" cy="104" r="2.6" fill="{GO}"/><circle cx="274" cy="110" r="2.6" fill="{GO}"/>
<circle cx="240" cy="76" r="66" fill="none" stroke="{GD}" stroke-width="2.5"/>
<text x="150" y="24" font-size="13" fill="{G}" font-weight="700" text-anchor="end">অর্ধেক</text>
<text x="150" y="40" font-size="11" fill="{IN}" text-anchor="end">সবজি</text>
<line x1="155" y1="30" x2="196" y2="52" stroke="{GL}" stroke-width="2"/>
<text x="332" y="34" font-size="13" fill="{T}" font-weight="700">১/৪ মাছ</text>
<line x1="310" y1="42" x2="290" y2="50" stroke="{TL}" stroke-width="2"/>
<text x="332" y="118" font-size="13" fill="{GO}" font-weight="700">১/৪ ভাত</text>
<line x1="310" y1="110" x2="292" y2="104" stroke="{GOL}" stroke-width="2"/>''')

# ---------- hand measures ----------
def _lab(x,t,c=IN): return f'<text x="{x}" y="152" font-size="12" fill="{c}" text-anchor="middle" font-weight="600">{t}</text>'
SVG['hands'] = wrap(f'''
<g>
 <rect x="30" y="52" width="52" height="56" rx="14" fill="{GL}" stroke="{G}" stroke-width="2.5"/>
 <rect x="36" y="26" width="9" height="30" rx="4.5" fill="{GL}" stroke="{G}" stroke-width="2.5"/>
 <rect x="48" y="20" width="9" height="36" rx="4.5" fill="{GL}" stroke="{G}" stroke-width="2.5"/>
 <rect x="60" y="24" width="9" height="32" rx="4.5" fill="{GL}" stroke="{G}" stroke-width="2.5"/>
 <rect x="71" y="32" width="8" height="24" rx="4" fill="{GL}" stroke="{G}" stroke-width="2.5"/>
 <rect x="14" y="60" width="20" height="9" rx="4.5" fill="{GL}" stroke="{G}" stroke-width="2.5"/>
</g>{_lab(52,'তালু = প্রোটিন',G)}
<g>
 <rect x="150" y="40" width="62" height="62" rx="18" fill="{TL}" stroke="{T}" stroke-width="2.5"/>
 <line x1="162" y1="58" x2="200" y2="58" stroke="{T}" stroke-width="2"/>
 <line x1="162" y1="72" x2="200" y2="72" stroke="{T}" stroke-width="2"/>
 <line x1="162" y1="86" x2="200" y2="86" stroke="{T}" stroke-width="2"/>
 <rect x="136" y="52" width="18" height="9" rx="4.5" fill="{TL}" stroke="{T}" stroke-width="2.5"/>
</g>{_lab(178,'মুঠো = সবজি',T)}
<g>
 <path d="M262 52 q34 -22 68 0 q-8 50 -34 50 q-26 0 -34 -50 Z" fill="{GOL}" stroke="{GO}" stroke-width="2.5"/>
 <ellipse cx="296" cy="54" rx="34" ry="9" fill="{W}" stroke="{GO}" stroke-width="2.5"/>
 <circle cx="286" cy="52" r="3" fill="{GO}"/><circle cx="300" cy="55" r="3" fill="{GO}"/>
 <circle cx="308" cy="50" r="3" fill="{GO}"/>
</g>{_lab(296,'কোষ = ভাত',GO)}
<g>
 <rect x="404" y="46" width="22" height="56" rx="11" fill="{GL}" stroke="{G}" stroke-width="2.5"/>
 <ellipse cx="415" cy="46" rx="11" ry="7" fill="{W}" stroke="{G}" stroke-width="2.5"/>
</g>{_lab(415,'আঙুল = তেল',G)}''')

# ---------- kitchen shelves ----------
SVG['kitchen'] = wrap(f'''
<rect x="60" y="18" width="360" height="112" rx="6" fill="{W}" stroke="{GL}" stroke-width="2.5"/>
<line x1="60" y1="72" x2="420" y2="72" stroke="{G}" stroke-width="3"/>
<line x1="60" y1="130" x2="420" y2="130" stroke="{G}" stroke-width="3"/>
<g opacity=".45">
 <rect x="88" y="38" width="26" height="32" rx="4" fill="{TL}" stroke="{T}" stroke-width="2"/>
 <rect x="94" y="30" width="14" height="9" rx="2" fill="{T}"/>
 <rect x="128" y="44" width="30" height="26" rx="4" fill="{TL}" stroke="{T}" stroke-width="2"/>
 <rect x="172" y="36" width="24" height="34" rx="4" fill="{TL}" stroke="{T}" stroke-width="2"/>
 <path d="M184 30 l0 6" stroke="{T}" stroke-width="3"/>
</g>
<text x="212" y="58" font-size="12" fill="{T}" font-weight="700">↑ উপরে সরান</text>
<text x="212" y="72" font-size="10" fill="{IN}">বিস্কুট · চিপস · মিষ্টি</text>
<g>
 <circle cx="96" cy="112" r="15" fill="{GL}" stroke="{G}" stroke-width="2.5"/>
 <path d="M96 97 q4 -8 10 -8" stroke="{G}" stroke-width="2.5" fill="none"/>
 <ellipse cx="140" cy="112" rx="18" ry="12" fill="{GL}" stroke="{G}" stroke-width="2.5"/>
 <ellipse cx="140" cy="106" rx="18" ry="5" fill="{W}" stroke="{G}" stroke-width="2"/>
 <rect x="176" y="92" width="18" height="38" rx="8" fill="{GL}" stroke="{G}" stroke-width="2.5"/>
 <rect x="180" y="86" width="10" height="8" rx="2" fill="{G}"/>
 <path d="M216 128 l8 -30 l8 30 Z" fill="{GL}" stroke="{G}" stroke-width="2.5"/>
</g>
<text x="252" y="112" font-size="12" fill="{G}" font-weight="700">↓ সামনে রাখুন</text>
<text x="252" y="126" font-size="10" fill="{IN}">ফল · দই · কাটা সবজি · জল</text>''')

# ---------- vegetable basket ----------
SVG['basket'] = wrap(f'''
<g>
 <path d="M110 74 h150 l-16 62 h-118 Z" fill="{GOL}" stroke="{GO}" stroke-width="2.5"/>
 <line x1="140" y1="80" x2="132" y2="130" stroke="{GO}" stroke-width="1.6"/>
 <line x1="170" y1="80" x2="166" y2="130" stroke="{GO}" stroke-width="1.6"/>
 <line x1="200" y1="80" x2="202" y2="130" stroke="{GO}" stroke-width="1.6"/>
 <line x1="230" y1="80" x2="236" y2="130" stroke="{GO}" stroke-width="1.6"/>
 <path d="M104 74 h162" stroke="{GO}" stroke-width="4" stroke-linecap="round"/>
 <path d="M140 30 q10 -16 26 0 q-2 22 -16 30 q-16 -10 -10 -30 Z" fill="{G}"/>
 <path d="M156 34 q0 20 -4 26" stroke="{GD}" stroke-width="1.6" fill="none"/>
 <ellipse cx="196" cy="52" rx="20" ry="20" fill="{T}"/>
 <path d="M196 32 q6 -8 12 -6 q-4 8 -12 8" fill="{G}"/>
 <path d="M232 68 q-4 -30 10 -38 q6 20 -2 38 Z" fill="{GO}"/>
 <path d="M242 28 q6 -8 12 -6" stroke="{G}" stroke-width="3" fill="none"/>
</g>
<g>
 <circle cx="330" cy="46" r="6" fill="{G}"/><text x="346" y="51" font-size="12" fill="{IN}">প্রোটিন — মাছ, ডিম, ডাল</text>
 <circle cx="330" cy="72" r="6" fill="{T}"/><text x="346" y="77" font-size="12" fill="{IN}">সবজি — যত খুশি</text>
 <circle cx="330" cy="98" r="6" fill="{GO}"/><text x="346" y="103" font-size="12" fill="{IN}">শর্করা — মেপে</text>
 <circle cx="330" cy="124" r="6" fill="{GL}" stroke="{G}" stroke-width="2"/><text x="346" y="129" font-size="12" fill="{IN}">তেল — চামচে</text>
</g>''')

# ---------- water ----------
SVG['water'] = wrap(f'''
<g>
 <rect x="150" y="30" width="52" height="100" rx="12" fill="{W}" stroke="{G}" stroke-width="2.5"/>
 <rect x="150" y="74" width="52" height="56" rx="12" fill="{GL}"/>
 <rect x="150" y="74" width="52" height="8" fill="{GL}"/>
 <rect x="166" y="16" width="20" height="16" rx="4" fill="{G}"/>
 <line x1="150" y1="60" x2="164" y2="60" stroke="{G}" stroke-width="2"/>
 <line x1="150" y1="90" x2="164" y2="90" stroke="{G}" stroke-width="2"/>
 <path d="M176 96 l0 -22 M176 96 l0 22" stroke="{GD}" stroke-width="0"/>
</g>
<g>
 {''.join(f'<g><path d="M{x} 76 l6 46 h26 l6 -46 Z" fill="{GL}" stroke="{G}" stroke-width="2.5"/><path d="M{x+3} 94 l4 28 h20 l4 -28 Z" fill="{G}" opacity=".35"/></g>' for x in (238,300,362))}
</g>
<text x="240" y="158" font-size="12.5" fill="{G}" font-weight="700">দিনে ৩ লিটার — বোতলে দাগ দিন</text>''')

# ---------- fish plate ----------
SVG['fish'] = wrap(f'''
<ellipse cx="240" cy="82" rx="96" ry="50" fill="{W}" stroke="{GL}" stroke-width="3"/>
<ellipse cx="240" cy="82" rx="82" ry="40" fill="none" stroke="{GL}" stroke-width="2"/>
<g>
 <path d="M186 82 q34 -30 72 0 q-38 30 -72 0 Z" fill="{T}" stroke="{GD}" stroke-width="2"/>
 <path d="M186 82 l-22 -16 l0 32 Z" fill="{T}" stroke="{GD}" stroke-width="2"/>
 <circle cx="240" cy="76" r="3.4" fill="{W}"/>
 <path d="M212 70 q6 12 0 24" stroke="{GD}" stroke-width="1.6" fill="none"/>
 <path d="M228 68 q6 14 0 28" stroke="{GD}" stroke-width="1.6" fill="none"/>
</g>
<g>
 <circle cx="292" cy="62" r="12" fill="{GOL}" stroke="{GO}" stroke-width="2"/>
 <path d="M292 50 v24 M280 62 h24" stroke="{GO}" stroke-width="1.4"/>
 <path d="M286 100 q12 -12 24 0 q-12 10 -24 0 Z" fill="{G}"/>
 <path d="M298 96 v10" stroke="{GD}" stroke-width="1.4"/>
</g>
<text x="240" y="158" font-size="12.5" fill="{G}" font-weight="700" text-anchor="middle">ভাজার বদলে ভাপা — ৮০ ক্যালরি কম</text>''')

# ---------- walking ----------
SVG['walk'] = wrap(f'''
<line x1="60" y1="132" x2="420" y2="132" stroke="{GL}" stroke-width="4" stroke-linecap="round"/>
<g stroke="{G}" stroke-width="7" fill="none" stroke-linecap="round">
 <circle cx="230" cy="30" r="13" fill="{G}" stroke="none"/>
 <path d="M230 44 l0 42"/>
 <path d="M230 86 l-20 44 M230 86 l22 40"/>
 <path d="M230 56 l-26 18 M230 56 l28 12"/>
</g>
<g stroke="{GL}" stroke-width="4" stroke-linecap="round">
 <path d="M150 46 h34 M138 66 h30 M156 86 h26"/>
</g>
<g fill="{TL}">
 <circle cx="322" cy="52" r="16"/><circle cx="356" cy="76" r="11"/><circle cx="336" cy="98" r="8"/>
</g>
<text x="240" y="160" font-size="12.5" fill="{G}" font-weight="700" text-anchor="middle">রোজ ২০–৩০ মিনিট — একটানা নয়, ভেঙে ভেঙেও চলবে</text>''')

# ---------- tape + scale ----------
SVG['tape'] = wrap(f'''
<g>
 <circle cx="150" cy="76" r="46" fill="none" stroke="{T}" stroke-width="12"/>
 <circle cx="150" cy="76" r="46" fill="none" stroke="{TL}" stroke-width="4" stroke-dasharray="4 8"/>
 <path d="M150 122 q-40 22 -66 10" stroke="{T}" stroke-width="12" fill="none" stroke-linecap="round"/>
 <circle cx="150" cy="76" r="26" fill="{CR}" stroke="{T}" stroke-width="2.5"/>
 <text x="150" y="82" font-size="15" fill="{T}" font-weight="700" text-anchor="middle">কোমর</text>
</g>
<g>
 <rect x="266" y="66" width="106" height="60" rx="10" fill="{W}" stroke="{G}" stroke-width="2.5"/>
 <rect x="284" y="80" width="70" height="26" rx="5" fill="{GL}"/>
 <text x="319" y="99" font-size="15" fill="{GD}" font-weight="700" text-anchor="middle">— · — kg</text>
 <path d="M290 66 l0 -8 h58 l0 8" stroke="{G}" stroke-width="2.5" fill="none"/>
</g>
<text x="240" y="160" font-size="12.5" fill="{IN}" font-weight="600" text-anchor="middle">সপ্তাহে একদিন — রবিবার সকালে, খালি পেটে, দুটোই মাপুন</text>''')

# ---------- 30 day calendar ----------
def _cal():
    c=[]; n=1
    for r in range(5):
        for col in range(6):
            if n>30: break
            x=90+col*52; y=22+r*24
            done = n<=12
            c.append(f'<rect x="{x}" y="{y}" width="44" height="19" rx="4" fill="{GL if done else W}" stroke="{G if done else GL}" stroke-width="1.8"/>')
            if done: c.append(f'<path d="M{x+16} {y+10} l4 5 l9 -10" stroke="{G}" stroke-width="2.4" fill="none" stroke-linecap="round"/>')
            else: c.append(f'<text x="{x+22}" y="{y+14}" font-size="11" fill="{IN}" text-anchor="middle">{n}</text>')
            n+=1
    return ''.join(c)
SVG['calendar'] = wrap(_cal()+f'<text x="240" y="160" font-size="12.5" fill="{G}" font-weight="700" text-anchor="middle">রোজ একটা করে টিক — ৩০ দিনে অভ্যাস</text>')

# ---------- measured oil ----------
SVG['oil'] = wrap(f'''
<g>
 <path d="M140 60 h100 v46 a24 24 0 0 1 -24 24 h-52 a24 24 0 0 1 -24 -24 Z" fill="{GL}" stroke="{G}" stroke-width="2.5"/>
 <ellipse cx="190" cy="60" rx="50" ry="12" fill="{W}" stroke="{G}" stroke-width="2.5"/>
 <path d="M240 74 q26 -4 26 12" stroke="{G}" stroke-width="4" fill="none"/>
 <g opacity=".7"><path d="M172 46 q4 -14 10 -18 M190 42 q4 -12 8 -16 M208 46 q4 -14 10 -18" stroke="{GL}" stroke-width="3" fill="none" stroke-linecap="round"/></g>
</g>
<g>
 <ellipse cx="330" cy="62" rx="24" ry="10" fill="{GOL}" stroke="{GO}" stroke-width="2.5"/>
 <path d="M352 62 q30 4 34 -14" stroke="{GO}" stroke-width="4" fill="none" stroke-linecap="round"/>
 <path d="M330 68 q-3 12 0 14 q3 -2 0 -14" fill="{GO}"/>
 <text x="330" y="106" font-size="13" fill="{GO}" font-weight="700" text-anchor="middle">১ চা-চামচ</text>
 <text x="330" y="122" font-size="11" fill="{IN}" text-anchor="middle">= ১২০ ক্যালরি</text>
</g>
<text x="190" y="160" font-size="12.5" fill="{G}" font-weight="700" text-anchor="middle">তেল ঢালবেন না — মেপে দিন</text>''')

# ---------- tea ----------
SVG['tea'] = wrap(f'''
<g>
 <path d="M150 54 h84 v34 a42 42 0 0 1 -84 0 Z" fill="{W}" stroke="{G}" stroke-width="2.5"/>
 <path d="M150 60 h84 v22 a42 42 0 0 1 -84 0 Z" fill="{GOL}"/>
 <path d="M234 62 q30 0 30 16 q0 16 -28 16" stroke="{G}" stroke-width="2.5" fill="none"/>
 <ellipse cx="192" cy="130" rx="62" ry="9" fill="{GL}" stroke="{G}" stroke-width="2.5"/>
 <g opacity=".6"><path d="M172 40 q6 -12 0 -22 M192 36 q6 -12 0 -22 M212 40 q6 -12 0 -22" stroke="{GL}" stroke-width="3" fill="none" stroke-linecap="round"/></g>
</g>
<g>
 <rect x="300" y="52" width="30" height="30" rx="5" fill="{W}" stroke="{T}" stroke-width="2.5"/>
 <rect x="322" y="70" width="30" height="30" rx="5" fill="{W}" stroke="{T}" stroke-width="2.5"/>
 <line x1="294" y1="106" x2="358" y2="42" stroke="{T}" stroke-width="4" stroke-linecap="round"/>
 <text x="326" y="126" font-size="12" fill="{T}" font-weight="700" text-anchor="middle">চিনি অর্ধেক</text>
</g>
<text x="192" y="160" font-size="12" fill="{IN}" font-weight="600" text-anchor="middle">লিকার চা — ০ ক্যালরি</text>''')

# ---------- tracker notebook ----------
SVG['note'] = wrap(f'''
<g>
 <rect x="120" y="20" width="200" height="112" rx="8" fill="{W}" stroke="{G}" stroke-width="2.5"/>
 <line x1="152" y1="20" x2="152" y2="132" stroke="{GL}" stroke-width="2.5"/>
 {''.join(f'<circle cx="136" cy="{y}" r="4.5" fill="none" stroke="{G}" stroke-width="2"/>' for y in (40,64,88,112))}
 {''.join(f'<line x1="172" y1="{y}" x2="300" y2="{y}" stroke="{GL}" stroke-width="2"/>' for y in (46,70,94,118))}
 {''.join(f'<path d="M{170} {y-6} l5 6 l10 -12" stroke="{G}" stroke-width="2.6" fill="none" stroke-linecap="round"/>' for y in (46,70,94))}
</g>
<g>
 <path d="M352 108 l52 -66 l16 12 l-52 66 l-20 6 Z" fill="{GOL}" stroke="{GO}" stroke-width="2.5"/>
 <path d="M348 126 l4 -18 l20 -6 Z" fill="{GO}"/>
</g>
<text x="240" y="160" font-size="12.5" fill="{G}" font-weight="700" text-anchor="middle">রাতে ৩০ সেকেন্ড — শুধু টিক দিন</text>''')

# ---------- festival plate ----------
SVG['festival'] = wrap(f'''
<circle cx="200" cy="76" r="58" fill="{W}" stroke="{GO}" stroke-width="3"/>
<circle cx="200" cy="76" r="48" fill="none" stroke="{GOL}" stroke-width="6" stroke-dasharray="3 7"/>
<circle cx="180" cy="64" r="14" fill="{GL}" stroke="{G}" stroke-width="2"/>
<circle cx="216" cy="60" r="12" fill="{TL}" stroke="{T}" stroke-width="2"/>
<circle cx="198" cy="94" r="13" fill="{GOL}" stroke="{GO}" stroke-width="2"/>
<g>
 <path d="M312 108 q26 -14 52 0 q-8 16 -26 16 q-18 0 -26 -16 Z" fill="{GOL}" stroke="{GO}" stroke-width="2.5"/>
 <path d="M338 94 q-8 -14 0 -26 q10 12 0 26 Z" fill="{T}"/>
</g>
<text x="338" y="158" font-size="12" fill="{GO}" font-weight="700" text-anchor="middle">একটা নিন, ধীরে খান</text>
<text x="200" y="160" font-size="12" fill="{IN}" font-weight="600" text-anchor="middle">প্লেট একবারই — দ্বিতীয়বার নয়</text>''')

# ---------- plateau chart ----------
SVG['chart'] = wrap(f'''
<line x1="80" y1="128" x2="420" y2="128" stroke="{GL}" stroke-width="2.5"/>
<line x1="80" y1="18" x2="80" y2="128" stroke="{GL}" stroke-width="2.5"/>
{''.join(f'<rect x="{100+i*46}" y="{h}" width="30" height="{128-h}" rx="4" fill="{c}"/>' for i,(h,c) in enumerate([(30,G),(44,G),(58,G),(66,GO),(66,GO),(66,GO),(80,G)]))}
<path d="M115 24 L253 60 L391 74" stroke="{T}" stroke-width="3" fill="none" stroke-linecap="round"/>
{''.join(f'<circle cx="{x}" cy="{y}" r="4.5" fill="{T}"/>' for x,y in [(115,24),(253,60),(391,74)])}
<rect x="238" y="30" width="126" height="22" rx="11" fill="{GOL}"/>
<text x="301" y="45" font-size="12" fill="{GO}" font-weight="700" text-anchor="middle">এখানে আটকে যায়</text>
<text x="240" y="160" font-size="12.5" fill="{G}" font-weight="700" text-anchor="middle">স্বাভাবিক — কম খাবেন না, নড়াচড়া বাড়ান</text>''')

# ---------- sunrise routine ----------
SVG['sun'] = wrap(f'''
<line x1="52" y1="116" x2="428" y2="116" stroke="{G}" stroke-width="3" stroke-linecap="round"/>
<path d="M158 116 A42 42 0 0 1 242 116 Z" fill="{GOL}" stroke="{GO}" stroke-width="2.8" stroke-linejoin="round"/>
<line x1="249.5" y1="99.9" x2="264.7" y2="95.0" stroke="{GO}" stroke-width="3.4" stroke-linecap="round"/><line x1="236.1" y1="78.6" x2="247.2" y2="67.1" stroke="{GO}" stroke-width="3.4" stroke-linecap="round"/><line x1="214.3" y1="66.0" x2="218.7" y2="50.6" stroke="{GO}" stroke-width="3.4" stroke-linecap="round"/><line x1="189.2" y1="65.1" x2="185.9" y2="49.5" stroke="{GO}" stroke-width="3.4" stroke-linecap="round"/><line x1="166.6" y1="76.2" x2="156.3" y2="63.9" stroke="{GO}" stroke-width="3.4" stroke-linecap="round"/><line x1="151.8" y1="96.5" x2="137.0" y2="90.5" stroke="{GO}" stroke-width="3.4" stroke-linecap="round"/>
<g>
 <path d="M322 44 l7 68 h36 l7 -68 Z" fill="{W}" stroke="{G}" stroke-width="2.8" stroke-linejoin="round"/>
 <path d="M327 74 l4 38 h26 l4 -38 Z" fill="{GL}"/>
</g>
<text x="345" y="136" font-size="13" fill="{G}" font-weight="700" text-anchor="middle">১ গ্লাস জল</text>
<text x="200" y="136" font-size="13" fill="{GO}" font-weight="700" text-anchor="middle">সকাল</text>
''')

# ---------- myth: cross / tick ----------
SVG['myth'] = wrap(f'''
<g>
 <circle cx="150" cy="72" r="46" fill="{TL}" stroke="{T}" stroke-width="3"/>
 <path d="M132 54 l36 36 M168 54 l-36 36" stroke="{T}" stroke-width="6" stroke-linecap="round"/>
 <text x="150" y="152" font-size="13" fill="{T}" font-weight="700" text-anchor="middle">যা শুনে এসেছেন</text>
</g>
<path d="M216 72 h48" stroke="{GL}" stroke-width="4" stroke-linecap="round"/>
<path d="M256 62 l12 10 l-12 10" stroke="{GL}" stroke-width="4" fill="none" stroke-linecap="round"/>
<g>
 <circle cx="330" cy="72" r="46" fill="{GL}" stroke="{G}" stroke-width="3"/>
 <path d="M310 72 l14 16 l26 -32" stroke="{G}" stroke-width="6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
 <text x="330" y="152" font-size="13" fill="{G}" font-weight="700" text-anchor="middle">যা আসলে সত্যি</text>
</g>''')

# ---------- calorie balance scale ----------
SVG['balance'] = wrap(f'''
<line x1="240" y1="26" x2="240" y2="122" stroke="{G}" stroke-width="5" stroke-linecap="round"/>
<path d="M186 130 h108" stroke="{G}" stroke-width="6" stroke-linecap="round"/>
<line x1="130" y1="40" x2="350" y2="56" stroke="{GD}" stroke-width="5" stroke-linecap="round"/>
<circle cx="240" cy="28" r="7" fill="{GD}"/>
<g>
 <line x1="132" y1="42" x2="132" y2="66" stroke="{GD}" stroke-width="2.5"/>
 <path d="M100 66 h64 l-12 30 h-40 Z" fill="{TL}" stroke="{T}" stroke-width="2.5"/>
 <text x="132" y="88" font-size="12" fill="{T}" font-weight="700" text-anchor="middle">খাওয়া</text>
</g>
<g>
 <line x1="348" y1="58" x2="348" y2="82" stroke="{GD}" stroke-width="2.5"/>
 <path d="M316 82 h64 l-12 30 h-40 Z" fill="{GL}" stroke="{G}" stroke-width="2.5"/>
 <text x="348" y="104" font-size="12" fill="{G}" font-weight="700" text-anchor="middle">খরচ</text>
</g>
<text x="240" y="160" font-size="12.5" fill="{GD}" font-weight="700" text-anchor="middle">খরচ বেশি হলেই ওজন কমে — এটুকুই পুরো বিজ্ঞান</text>''')
