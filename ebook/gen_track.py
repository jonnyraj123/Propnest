# -*- coding: utf-8 -*-
BN="০১২৩৪৫৬৭৮৯"
def bn(n): return ''.join(BN[int(c)] for c in str(n))
o=[]
o.append('''
<!-- ===== CH 17 TRACKER ===== -->
<section class="page" data-sec="পার্ট ৬ — হিসাব রাখা" data-pg="•">
  <div class="chapno">১৭</div>
  <h1>৩০ দিনের ট্র্যাকার</h1>
  <div class="rule"></div>
  <p class="lede">এই পাতা দুটো প্রিন্ট করে ফ্রিজে আটকান। রোজ রাতে শুতে যাওয়ার আগে টিক দিন — মাত্র ৩০ সেকেন্ড।</p>
  <div class="box">
    <span class="bt">কেন এটা কাজ করে</span>
    <p>যা মাপা হয়, তা উন্নত হয়। রোজ টিক দিলে দুটো জিনিস ঘটে — এক, আপনি নিজের কাছে দায়বদ্ধ থাকেন; দুই, কোথায় আটকাচ্ছে সেটা চোখে পড়ে। <strong>টিক না পড়লে সেই দিনটাই আপনার শেখার জায়গা।</strong></p>
  </div>
  <h3>সাপ্তাহিক মাপ</h3>
  <table>
    <thead><tr><th>কবে</th><th>ওজন (কেজি)</th><th>কোমর (ইঞ্চি)</th><th>কেমন লাগছে</th></tr></thead>
    <tbody>''')
for lbl in ["শুরুর দিন","৭ দিন পর","১৪ দিন পর","২১ দিন পর","৩০ দিন পর"]:
    o.append(f'      <tr style="height:9mm"><td><strong>{lbl}</strong></td><td></td><td></td><td></td></tr>\n')
o.append('''    </tbody>
  </table>
  <p style="font-size:9pt;color:var(--ink-3);">মাপার নিয়ম: রবিবার সকালে, বাথরুম সেরে, খালি পেটে, একই জামায়। কোমর মাপুন নাভির ঠিক উপর দিয়ে, শ্বাস স্বাভাবিক রেখে।</p>
</section>
''')
for start,end,part in [(1,15,'১'),(16,30,'২')]:
    o.append(f'''
<section class="page" data-sec="পার্ট ৬ — হিসাব রাখা" data-pg="•">
  <h2>রোজকার ট্র্যাকার — দিন {bn(start)} থেকে {bn(end)}</h2>
  <table style="font-size:8.5pt;">
    <thead><tr>
      <th style="width:14mm">দিন</th><th>চার্ট মেনেছি</th><th>৩ লিটার জল</th>
      <th>হেঁটেছি</th><th>ভাজা/মিষ্টি বাদ</th><th>৭ ঘণ্টা ঘুম</th><th>নোট</th>
    </tr></thead>
    <tbody>
''')
    for d in range(start,end+1):
        o.append(f'      <tr style="height:7.5mm"><td><strong>{bn(d)}</strong></td><td></td><td></td><td></td><td></td><td></td><td></td></tr>\n')
    o.append('''    </tbody>
  </table>
</section>
''')
open('tracker.html','w').write(''.join(o))
print('ok')
