# -*- coding: utf-8 -*-
import re
BN="০১২৩৪৫৬৭৮৯"
def bn(n): return ''.join(BN[int(c)] for c in str(n))
s=open('book.html').read()

# 1. sequential page numbers on every non-cover page
parts = re.split(r'(<section class="page"[^>]*>)', s)
n = 1  # cover is page 1
out=[parts[0]]
chap_pages={}
for i in range(1, len(parts), 2):
    tag, body = parts[i], parts[i+1]
    if 'plain cover' in tag:
        out += [tag, body]; continue
    n += 1
    tag = re.sub(r'data-pg="[^"]*"', f'data-pg="{bn(n)}"', tag)
    m = re.search(r'<div class="chapno">([^<]+)</div>', body)
    if m: chap_pages[m.group(1).strip()] = n
    out += [tag, body]
s=''.join(out)

# 2. sync TOC page numbers to real chapter pages
def fix_toc(mo):
    num = mo.group(1).lstrip('০').lstrip() or '০'
    # toc uses 2-digit bengali like ০১ -> chapno is ১
    key = num if num in chap_pages else mo.group(1)
    if key in chap_pages:
        return mo.group(0).replace(f'<span class="p">{mo.group(2)}</span>',
                                   f'<span class="p">{bn(chap_pages[key])}</span>')
    return mo.group(0)
s = re.sub(r'<div class="toc-row"><span class="n">([^<]+)</span><span class="t">[^<]*</span><span class="p">([^<]+)</span></div>',
           fix_toc, s)

# 3. resolve cross-reference tokens
tok = {'@@TRACK@@': chap_pages.get('১৭'), '@@FREEFOOD@@': chap_pages.get('৬',0)+1,
       '@@OUT@@': chap_pages.get('১৩'), '@@FEST@@': chap_pages.get('১৪'),
       '@@NEXT@@': chap_pages.get('১৯')}
for k,v in tok.items():
    if v: s = s.replace(k, bn(v))
open('book.html','w').write(s)
print('chapters ->', {k:v for k,v in sorted(chap_pages.items(), key=lambda x:x[1])})
print('total pages:', n)
