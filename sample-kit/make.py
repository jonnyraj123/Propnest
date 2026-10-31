"""Build a premium animated sample for one lead.

Usage: python3 make.py leads/<id>.json

The lead file names a template and fills its {{slots}}. Photos are paths
relative to the lead file. Output goes to out/<id>/: index.html, video.webm,
before_after.mp4 and before_after.gif (before = their current site).
"""
import json, os, shutil, subprocess, sys, html
from PIL import Image, ImageDraw, ImageFont

KIT = os.path.dirname(os.path.abspath(__file__))
REC_JS = r"""
const {chromium}=require('playwright');
(async()=>{const [,,page,dir,url]=process.argv;const b=await chromium.launch();
if(url){const p=await b.newPage({viewport:{width:1440,height:900}});
 await p.goto(url,{timeout:45000,waitUntil:'load'}).catch(()=>{});await p.waitForTimeout(6000);
 await p.screenshot({path:dir+'/before.png'});await p.close();}
const c=await b.newContext({viewport:{width:1440,height:900},recordVideo:{dir:dir+'/rec',size:{width:1440,height:900}}});
const p=await c.newPage();await p.goto('file://'+page,{waitUntil:'load'});await p.waitForTimeout(11000);
await c.close();await b.close();})();
"""

def esc(s):
    return html.escape(str(s), quote=True)

def build_page(lead, src_dir, out):
    tpl = open(os.path.join(KIT, 'templates', lead['template'] + '.html')).read()
    photos = lead.get('photos', [])
    for i, ph in enumerate(photos):
        im = Image.open(os.path.join(src_dir, ph['file'])).convert('RGB')
        im.thumbnail((1600, 1600))
        im.save(os.path.join(out, f'p{i}.jpg'), quality=88)
    n = 5
    angle = 360 / n
    cards = []
    for i in range(n):
        delay = 0.9 + i * 0.18
        if photos:
            ph = photos[i % len(photos)]
            bg = f"background-image:url(p{i % len(photos)}.jpg);"
            inner = ''
            label = ph.get('label', '')
        else:
            bg = ''
            inner = "<div class='ph'>✂</div>"
            label = lead['services'][i % len(lead['services'])]
        cards.append(f"<div class='card' style='{bg}transform:rotateY({i*angle}deg) translateZ(250px);animation-delay:{delay:.2f}s'>{inner}<b>{esc(label)}</b></div>")
    bgi = lead.get('bg_photo')
    if bgi is not None and photos:
        bg_css = f"url(p{bgi}.jpg) center/cover"
    else:
        bg_css = f"radial-gradient(60% 70% at 70% 40%,{lead['accent']}55,transparent 70%),#111"
    if lead.get('video'):
        shutil.copy(os.path.join(KIT, 'videos', lead['video'] + '.webm'), os.path.join(out, 'bg.webm'))
    words = (lead['line1'] + ' |' + lead['line2']).split()
    heading, italic = [], False
    for i, w in enumerate(words):
        if w.startswith('|'):
            italic, w = True, w[1:]
            heading.append('<br>')
        word = f'<em>{esc(w)}</em>' if italic else esc(w)
        heading.append(f"<span class='w' style='animation-delay:{1.3 + i * 0.14:.2f}s'>{word}</span>")
    serif = lead.get('style', 'serif') == 'serif'
    fill_extra = {
        'heading': ' '.join(heading).replace(' <br> ', '<br>'),
        'font': "400 1em 'Instrument Serif',serif" if serif else "400 1em Anton,sans-serif",
        'hsize': '118px' if serif else '104px',
        'cta': esc(lead.get('cta', 'Book now')),
    }
    fill = {
        **fill_extra,
        'name': esc(lead['name']), 'city': esc(lead['city']), 'kicker': esc(lead['kicker']),
        'line1': esc(lead['line1']), 'line2': esc(lead['line2']), 'sub': esc(lead['sub']),
        'phone': esc(lead['phone']), 'accent': lead['accent'], 'bg_css': bg_css,
        'cards': ''.join(cards),
        'chips': ''.join(f'<span>{esc(s)}</span>' for s in lead['services'][:3]),
    }
    for k, v in fill.items():
        tpl = tpl.replace('{{' + k + '}}', v)
    open(os.path.join(out, 'index.html'), 'w').write(tpl)

def compose(lead, out):
    font = lambda w, s: ImageFont.truetype(os.path.join(KIT, f'Mont{w}.ttf'), s)
    W, H = 1920, 760
    c = Image.new('RGB', (W, H))
    d = ImageDraw.Draw(c)
    for y in range(H):
        t = y / H
        d.line([(0, y), (W, y)], fill=(int(14 + 18 * t), int(10 + 8 * t), int(16 + 24 * t)))
    d.text((40, 34), f"{lead['name']} — a fresh look", font=font(600, 40), fill=(255, 255, 255))
    d.text((40, 88), 'Free sample homepage by Plastrix Studio', font=font(500, 22), fill=(210, 195, 230))
    d.text((40, 128), 'BEFORE · your site today', font=font(600, 20), fill=(170, 170, 180))
    d.text((980, 128), 'AFTER · free sample design', font=font(600, 20), fill=(240, 170, 120))
    before = os.path.join(out, 'before.png')
    if os.path.exists(before):
        c.paste(Image.open(before).convert('RGB').resize((900, 562)), (40, 165))
    c.save(os.path.join(out, 'frame.png'))
    webm = [f for f in os.listdir(os.path.join(out, 'rec')) if f.endswith('.webm')][0]
    webm = os.path.join(out, 'rec', webm)
    mp4 = os.path.join(out, 'before_after.mp4')
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-loop', '1', '-i', os.path.join(out, 'frame.png'), '-i', webm,
                    '-filter_complex', '[1:v]trim=0.3:10.8,setpts=PTS-STARTPTS,scale=900:562,fps=30[a];[0:v][a]overlay=980:165:shortest=1,format=yuv420p[v]',
                    '-map', '[v]', '-c:v', 'libx264', '-crf', '20', '-preset', 'slow', '-movflags', '+faststart', mp4], check=True)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', mp4, '-vf',
                    'fps=12,scale=960:-1:flags=lanczos,split[s0][s1];[s0]palettegen=max_colors=128[p];[s1][p]paletteuse=dither=bayer:bayer_scale=4',
                    os.path.join(out, 'before_after.gif')], check=True)

def main(path):
    lead = json.load(open(path))
    src_dir = os.path.dirname(os.path.abspath(path))
    out = os.path.join(KIT, 'out', lead['id'])
    shutil.rmtree(out, ignore_errors=True)
    os.makedirs(out)
    build_page(lead, src_dir, out)
    js = os.path.join(out, 'rec.js')
    open(js, 'w').write(REC_JS)
    subprocess.run(['node', js, os.path.join(out, 'index.html'), out, lead.get('website', '')], check=True)
    os.remove(js)
    compose(lead, out)
    print(out)

if __name__ == '__main__':
    main(sys.argv[1])
