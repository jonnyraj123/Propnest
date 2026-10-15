# -*- coding: utf-8 -*-
"""বই ২-এর নিজস্ব ভিজ্যুয়াল ভাষা — কাগজ, হেয়ারলাইন রুল, নীল বৃত্ত, সুগার-রেখা।
বই ১ (গাঢ় সবুজ + ৩ডি বইয়ের মকআপ) থেকে সম্পূর্ণ আলাদা।"""

NAVY  = '#17325C'; NAVY_D = '#0E2140'; NAVY_L = '#DBE5F2'
AMBER = '#C2700B'; AMBER_L = '#F6E7CE'
OLIVE = '#5B7C3A'
PAPER = '#F8F5EE'; INK = '#22201C'

# মূল প্রতীক — নীল বৃত্ত (ডায়াবেটিসের আন্তর্জাতিক চিহ্ন) + সুগারের রেখা
EMBLEM = f'''<svg viewBox="0 0 420 420" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="210" cy="210" r="176" stroke="{NAVY}" stroke-width="30"/>
  <circle cx="210" cy="210" r="196" stroke="{NAVY}" stroke-width="1.5" opacity=".2"/>

  <!-- নিরাপদ সীমা -->
  <rect x="66" y="222" width="288" height="50" fill="{NAVY_L}" opacity=".9"/>
  <line x1="66" y1="222" x2="354" y2="222" stroke="{NAVY}" stroke-width="1.6"
        stroke-dasharray="7 6" opacity=".45"/>
  <line x1="66" y1="272" x2="354" y2="272" stroke="{NAVY}" stroke-width="1.6"
        stroke-dasharray="7 6" opacity=".45"/>
  <text x="210" y="308" text-anchor="middle" font-family="NSB, sans-serif" font-size="17"
        font-weight="600" fill="{NAVY}" opacity=".72">নিরাপদ সীমা</text>

  <!-- ওঠানামা করা সুগার, তারপর স্থির -->
  <path d="M84 206 L106 150 L126 234 L148 146 L170 240
           C200 246 226 254 252 251 C282 248 308 244 336 247"
        stroke="{AMBER}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
  <circle cx="336" cy="247" r="13" fill="{NAVY}"/>
  <circle cx="336" cy="247" r="5" fill="{PAPER}"/>
</svg>'''

# ছোট প্রতীক — শিরোনামের পাশে
GLYPH = f'''<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="48" stroke="{NAVY}" stroke-width="10"/>
  <path d="M28 62 L40 40 L50 74 L62 38 L72 70 C82 74 92 70 96 66"
        stroke="{AMBER}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>
</svg>'''

# থালার নিয়ম — ভিতরের পাতা ও প্রচ্ছদের গৌণ ছবি
PLATE = f'''<svg viewBox="0 0 420 250" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect x="0" y="0" width="420" height="250" fill="none"/>
  <circle cx="125" cy="125" r="104" fill="#FFFFFF" stroke="{NAVY}" stroke-width="3"/>
  <path d="M125 21 A104 104 0 0 0 125 229 Z" fill="{OLIVE}" opacity=".85"/>
  <path d="M125 21 A104 104 0 0 1 229 125 L125 125 Z" fill="{AMBER}" opacity=".8"/>
  <path d="M229 125 A104 104 0 0 1 125 229 L125 125 Z" fill="{NAVY}" opacity=".8"/>
  <line x1="125" y1="21" x2="125" y2="229" stroke="#FFF" stroke-width="4"/>
  <line x1="125" y1="125" x2="229" y2="125" stroke="#FFF" stroke-width="4"/>
  <g font-family="NSB, sans-serif" font-size="15" fill="{INK}">
    <line x1="60" y1="125" x2="262" y2="70" stroke="{INK}" stroke-width="1.2" opacity=".35"/>
    <text x="270" y="74" font-weight="700">অর্ধেক — সবজি</text>
    <text x="270" y="96" opacity=".7" font-size="13">শাক, ঝিঙে, লাউ, উচ্ছে</text>
    <line x1="180" y1="80" x2="262" y2="134" stroke="{INK}" stroke-width="1.2" opacity=".35"/>
    <text x="270" y="138" font-weight="700">এক ভাগ — ভাত / রুটি</text>
    <text x="270" y="160" opacity=".7" font-size="13">মেপে, এক কাপের বেশি নয়</text>
    <line x1="180" y1="172" x2="262" y2="198" stroke="{INK}" stroke-width="1.2" opacity=".35"/>
    <text x="270" y="202" font-weight="700">এক ভাগ — প্রোটিন</text>
    <text x="270" y="224" opacity=".7" font-size="13">মাছ, ডিম, ডাল, ছানা</text>
  </g>
</svg>'''
