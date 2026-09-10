# -*- coding: utf-8 -*-
"""হাতে আঁকা ভেক্টর আর্ট — কভারের জন্য। কোনো ছবি নয়।"""

CREAM = '#F5F0E4'; GOLD = '#E8B455'; RUST = '#C8663A'
OLIVE = '#7FA653'; DEEP = '#062B31'; MID = '#0C4A52'; MINT = '#8FD0CE'

# থালা + গ্লুকোমিটার — বইয়ের মূল ছবি
HERO = f'''<svg viewBox="0 0 560 330" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="pl" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FFFDF6"/><stop offset="1" stop-color="#EDE5D4"/>
    </linearGradient>
  </defs>

  <!-- ছায়া -->
  <ellipse cx="188" cy="300" rx="132" ry="15" fill="#000" opacity=".18"/>
  <ellipse cx="446" cy="300" rx="62" ry="10" fill="#000" opacity=".15"/>

  <!-- থালা -->
  <circle cx="188" cy="164" r="128" fill="{CREAM}" opacity=".18"/>
  <circle cx="188" cy="164" r="116" fill="url(#pl)"/>
  <!-- বাঁ অর্ধেক : সবজি -->
  <path d="M188 48 A116 116 0 0 0 188 280 Z" fill="{OLIVE}" opacity=".92"/>
  <!-- ডান-উপর : ভাত / রুটি -->
  <path d="M188 48 A116 116 0 0 1 304 164 L188 164 Z" fill="{GOLD}" opacity=".92"/>
  <!-- ডান-নিচ : প্রোটিন -->
  <path d="M304 164 A116 116 0 0 1 188 280 L188 164 Z" fill="{RUST}" opacity=".92"/>
  <circle cx="188" cy="164" r="116" fill="none" stroke="{CREAM}" stroke-width="7" opacity=".85"/>
  <line x1="188" y1="48" x2="188" y2="280" stroke="{CREAM}" stroke-width="6" opacity=".85"/>
  <line x1="188" y1="164" x2="304" y2="164" stroke="{CREAM}" stroke-width="6" opacity=".85"/>

  <!-- সবজির খুঁটিনাটি -->
  <circle cx="128" cy="118" r="13" fill="#9CC46B" opacity=".95"/>
  <circle cx="98" cy="168" r="10" fill="#C8663A" opacity=".9"/>
  <circle cx="140" cy="214" r="12" fill="#9CC46B" opacity=".9"/>
  <path d="M96 116 q16 -14 30 -4 q-14 16 -30 4z" fill="#E7F0D6" opacity=".8"/>
  <rect x="112" y="146" width="34" height="8" rx="4" fill="#E7F0D6" opacity=".7" transform="rotate(-18 129 150)"/>
  <rect x="104" y="196" width="30" height="8" rx="4" fill="#E7F0D6" opacity=".6" transform="rotate(12 119 200)"/>
  <!-- ভাতের দানা -->
  <g fill="#FFF6DE" opacity=".85">
    <ellipse cx="232" cy="106" rx="9" ry="4.6" transform="rotate(-24 232 106)"/>
    <ellipse cx="258" cy="128" rx="9" ry="4.6" transform="rotate(16 258 128)"/>
    <ellipse cx="226" cy="140" rx="9" ry="4.6" transform="rotate(40 226 140)"/>
    <ellipse cx="256" cy="94" rx="9" ry="4.6" transform="rotate(8 256 94)"/>
  </g>
  <!-- মাছ -->
  <path d="M214 224 q28 -22 62 0 q-28 22 -62 0z" fill="#F7E3D2" opacity=".92"/>
  <path d="M276 224 l16 -12 v24 z" fill="#F7E3D2" opacity=".92"/>
  <circle cx="232" cy="222" r="3.4" fill="{DEEP}" opacity=".7"/>

  <!-- গ্লুকোমিটার -->
  <rect x="392" y="104" width="108" height="176" rx="22" fill="{DEEP}"/>
  <rect x="392" y="104" width="108" height="176" rx="22" fill="none" stroke="{MINT}" stroke-width="2.4" opacity=".45"/>
  <rect x="406" y="122" width="80" height="60" rx="9" fill="{MINT}" opacity=".92"/>
  <text x="446" y="163" text-anchor="middle" font-family="NSB, sans-serif" font-size="30"
        font-weight="700" fill="{DEEP}">৫.৬</text>
  <text x="446" y="200" text-anchor="middle" font-family="NSB, sans-serif" font-size="13"
        fill="{MINT}" opacity=".85">mmol/L</text>
  <circle cx="424" cy="234" r="12" fill="{MINT}" opacity=".28"/>
  <circle cx="468" cy="234" r="12" fill="{MINT}" opacity=".28"/>
  <rect x="414" y="258" width="64" height="7" rx="3.5" fill="{MINT}" opacity=".22"/>
  <!-- মিটারে ঢোকানো টেস্ট-স্ট্রিপ -->
  <rect x="436" y="74" width="20" height="38" rx="3" fill="{CREAM}" opacity=".92"/>
  <rect x="436" y="74" width="20" height="9" rx="3" fill="{GOLD}"/>
  <!-- পাতা : থালার পাশে -->
  <g opacity=".7">
    <path d="M318 254 q34 -10 46 -42 q-38 2 -46 42z" fill="{OLIVE}"/>
    <path d="M318 254 q22 -20 44 -40" stroke="#DCEBC4" stroke-width="2.4" stroke-linecap="round" fill="none" opacity=".7"/>
  </g>
  <g opacity=".45">
    <path d="M56 214 q-26 -26 -6 -50 q26 20 6 50z" fill="{OLIVE}"/>
  </g>
</svg>'''

# ছোট মোটিফ — বইয়ের মকআপের ভিতরে
MARK = f'''<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="100" cy="100" r="84" fill="{CREAM}" opacity=".16"/>
  <path d="M100 22 A78 78 0 0 0 100 178 Z" fill="{OLIVE}" opacity=".75"/>
  <path d="M100 22 A78 78 0 0 1 178 100 L100 100 Z" fill="{GOLD}" opacity=".8"/>
  <path d="M178 100 A78 78 0 0 1 100 178 L100 100 Z" fill="{RUST}" opacity=".8"/>
  <circle cx="100" cy="100" r="78" fill="none" stroke="{CREAM}" stroke-width="5" opacity=".8"/>
  <line x1="100" y1="22" x2="100" y2="178" stroke="{CREAM}" stroke-width="4.5" opacity=".8"/>
  <line x1="100" y1="100" x2="178" y2="100" stroke="{CREAM}" stroke-width="4.5" opacity=".8"/>
</svg>'''

# ছোট দৃশ্য — থালা ও গ্লুকোমিটার (বইয়ের মকআপের জন্য)
MINI = f'''<svg viewBox="0 0 260 150" fill="none" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="88" cy="136" rx="66" ry="7" fill="#000" opacity=".22"/>
  <circle cx="88" cy="78" r="66" fill="{CREAM}" opacity=".14"/>
  <circle cx="88" cy="78" r="58" fill="#FFFDF6" opacity=".95"/>
  <path d="M88 20 A58 58 0 0 0 88 136 Z" fill="{OLIVE}"/>
  <path d="M88 20 A58 58 0 0 1 146 78 L88 78 Z" fill="{GOLD}"/>
  <path d="M146 78 A58 58 0 0 1 88 136 L88 78 Z" fill="{RUST}"/>
  <circle cx="88" cy="78" r="58" fill="none" stroke="{CREAM}" stroke-width="4.5" opacity=".9"/>
  <line x1="88" y1="20" x2="88" y2="136" stroke="{CREAM}" stroke-width="4" opacity=".9"/>
  <line x1="88" y1="78" x2="146" y2="78" stroke="{CREAM}" stroke-width="4" opacity=".9"/>
  <circle cx="58" cy="56" r="6.5" fill="#B9DC8C"/>
  <circle cx="44" cy="84" r="5" fill="#C8663A" opacity=".85"/>
  <circle cx="62" cy="104" r="6" fill="#B9DC8C" opacity=".9"/>
  <g fill="#FFF6DE" opacity=".9">
    <ellipse cx="110" cy="48" rx="5" ry="2.6" transform="rotate(-22 110 48)"/>
    <ellipse cx="124" cy="62" rx="5" ry="2.6" transform="rotate(14 124 62)"/>
    <ellipse cx="106" cy="66" rx="5" ry="2.6" transform="rotate(38 106 66)"/>
  </g>
  <path d="M102 108 q15 -12 34 0 q-15 12 -34 0z" fill="#F7E3D2" opacity=".95"/>
  <path d="M136 108 l9 -7 v14 z" fill="#F7E3D2" opacity=".95"/>

  <rect x="182" y="42" width="62" height="98" rx="14" fill="{DEEP}" stroke="{MINT}"
        stroke-width="1.6" stroke-opacity=".5"/>
  <rect x="190" y="52" width="46" height="32" rx="5" fill="{MINT}" opacity=".92"/>
  <text x="213" y="76" text-anchor="middle" font-family="NSB, sans-serif" font-size="17"
        font-weight="700" fill="{DEEP}">৫.৬</text>
  <circle cx="200" cy="102" r="6.5" fill="{MINT}" opacity=".3"/>
  <circle cx="226" cy="102" r="6.5" fill="{MINT}" opacity=".3"/>
  <rect x="194" y="120" width="38" height="5" rx="2.5" fill="{MINT}" opacity=".25"/>
  <rect x="206" y="22" width="13" height="24" rx="2.5" fill="{CREAM}" opacity=".92"/>
  <rect x="206" y="22" width="13" height="6" rx="2.5" fill="{GOLD}"/>
</svg>'''
