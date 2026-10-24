(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  gsap.registerPlugin(ScrollTrigger);
  if (reduce) document.documentElement.classList.add('rm');

  /* smooth scroll */
  let lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(t => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
  const scrollToY = y => lenis ? lenis.scrollTo(y, { duration: 1.4 }) : window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
  $$('a[href^="#"]').forEach(a => a.addEventListener('click', e => {
    const t = $(a.getAttribute('href')); if (!t) return;
    e.preventDefault(); scrollToY(t.getBoundingClientRect().top + window.scrollY);
  }));

  /* loader */
  const loader = $('#loader'), ldn = $('#ldn');
  const cnt = { v: 0 };
  gsap.to(cnt, { v: 214, duration: reduce ? 0 : 1.3, ease: 'power2.out', onUpdate: () => ldn.textContent = Math.round(cnt.v) });
  let started = false;
  const start = () => {
    if (started) return; started = true;
    loader.classList.add('done');
    if (reduce) return;
    gsap.from('.hero-title .ln>span', { yPercent: 110, duration: 1.1, ease: 'expo.out', stagger: .09, delay: .15 });
    gsap.from('.hero .eyebrow, .hero-sub, .hero-cta, .hero-meta', { y: 24, autoAlpha: 0, duration: .9, ease: 'power3.out', stagger: .08, delay: .45 });
    gsap.from('.hero-vid', { scale: 1.18, autoAlpha: 0, duration: 1.8, ease: 'power3.out' });
  };
  window.addEventListener('load', () => setTimeout(start, reduce ? 0 : 1350));
  setTimeout(start, 3200);

  /* nav */
  const nav = $('#nav');
  ScrollTrigger.create({ start: 60, onUpdate: s => nav.classList.toggle('solid', s.scroll() > 60) });

  /* hero scroll */
  const vid = $('#heroVid');
  if (reduce) { vid.removeAttribute('autoplay'); vid.pause(); }
  else {
    gsap.to('.hero-vid', { yPercent: -18, scale: .82, autoAlpha: .2, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
    gsap.to('.hero-copy', { y: -120, autoAlpha: 0, ease: 'none', scrollTrigger: { trigger: '.hero', start: '20% top', end: '80% top', scrub: true } });
  }

  /* ---------- colour swap ---------- */
  const PAL = [
    { name: 'Citrus', desc: 'Teal bezel, orange and sunflower strap. Built for loud summers.', price: '$1,290', old: '$1,490', bg: '#0e4a47', acc: '#ff7a2f' },
    { name: 'Cobalt', desc: 'Royal blue bricks with sunflower sub-dials. Bright on a grey day.', price: '$1,290', old: '$1,490', bg: '#13308f', acc: '#ffd21f' },
    { name: 'Noir Gold', desc: 'Matte black case, polished gold bricks. The limited evening build.', price: '$1,690', old: '$1,890', bg: '#141210', acc: '#e3b04b' }
  ];
  const sws = $$('.sw'), swName = $('#swName'), swatches = $$('.swatches button');
  const thumbs = ['img/w-teal.webp', 'img/w-blue.webp', 'img/w-gold.webp'];
  let cur = 0;
  const root = document.documentElement;
  const splitName = t => t.split(' ').map(w => `<span class="wd">${w.split('').map(c => `<span class="ch">${c}</span>`).join('')}</span>`).join(' ');
  swName.innerHTML = splitName(PAL[0].name);
  const setIdx = (i, instant) => {
    if (i === cur && !instant) return;
    cur = i; const p = PAL[i];
    $('#swIdx').textContent = '0' + (i + 1);
    $('#swDesc').textContent = p.desc; $('#swPrice').textContent = p.price; $('#swOld').textContent = p.old;
    swName.innerHTML = splitName(p.name);
    if (!reduce) gsap.from('#swName .ch', { yPercent: 100, rotationX: -90, autoAlpha: 0, duration: .6, ease: 'back.out(2)', stagger: .03 });
    root.style.setProperty('--acc', p.acc);
    swatches.forEach((b, k) => b.classList.toggle('on', k === i));
    const th = $('#swThumb'); th.style.opacity = 0;
    setTimeout(() => { th.src = thumbs[(i + 1) % 3]; th.style.opacity = 1; }, 200);
  };
  const OUT = { x: '-42vw', y: '-38vh', scale: .28, rotation: -32, autoAlpha: 0 };
  const IN = { x: '44vw', y: '40vh', scale: .16, rotation: 38, autoAlpha: 0 };
  let swapST = null;
  if (reduce) {
    sws.forEach((s, k) => gsap.set(s, { autoAlpha: k ? 0 : 1 }));
    swatches.forEach(b => b.addEventListener('click', () => {
      const i = +b.dataset.i; sws.forEach((s, k) => gsap.set(s, { autoAlpha: k === i ? 1 : 0 }));
      $('.swap').style.backgroundColor = PAL[i].bg; setIdx(i);
    }));
  } else {
    gsap.set([sws[1], sws[2]], IN);
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    [1, 2].forEach(i => {
      const at = (i - 1) * 1.3 + .35;
      tl.to(sws[i - 1], { ...OUT, duration: 1 }, at)
        .to(sws[i], { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1, duration: 1, ease: 'power3.out' }, at)
        .to('.swap', { backgroundColor: PAL[i].bg, duration: 1 }, at);
    });
    tl.to({}, { duration: .4 });
    tl.eventCallback('onUpdate', () => { const t = tl.time(); setIdx(t < .85 ? 0 : t < 2.15 ? 1 : 2); });
    swapST = ScrollTrigger.create({
      trigger: '.swap', start: 'top top', end: '+=260%', pin: '.swap-pin', scrub: .8, animation: tl,
      onUpdate: s => { $('#swBar').style.width = (s.progress * 100) + '%'; },
      onLeaveBack: () => root.style.setProperty('--acc', PAL[0].acc)
    });
    gsap.from('.swap-copy > *', { y: 30, autoAlpha: 0, stagger: .07, duration: .8, ease: 'power3.out', scrollTrigger: { trigger: '.swap', start: 'top 70%' } });
    swatches.forEach(b => b.addEventListener('click', () => {
      const i = +b.dataset.i, total = tl.duration(), at = [0.1, 1.6, 2.9][i];
      scrollToY(swapST.start + (swapST.end - swapST.start) * (at / total));
    }));
  }
  $$('.sizes button').forEach(b => b.addEventListener('click', () => {
    $$('.sizes button').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-checked', x === b); });
  }));

  /* ---------- making ---------- */
  const steps = $$('#mkSteps li'), mkNum = $('#mkNum');
  let stepNow = -1;
  const setStep = i => { if (i === stepNow) return; stepNow = i; steps.forEach((li, k) => li.classList.toggle('on', k === i)); mkNum.textContent = '0' + (i + 1); };
  const hands = $$('.hand');
  gsap.set(hands, { xPercent: -50, yPercent: -50, x: 0, y: 0 });
  const FINAL = { hour: 305, minute: 60, second: 200 };
  if (reduce) {
    steps.forEach(li => li.classList.add('on'));
    gsap.set('.mk-build', { autoAlpha: 0 });
  } else {
    gsap.set('.mk-dialwrap', { autoAlpha: 0, scale: .55, rotation: -90 });
    gsap.set('.mk-dial', { clipPath: 'circle(0% at 50% 50%)' });
    $$('.mk-dialwrap .hand').forEach((h, k) => gsap.set(h, { y: '-80vh', rotation: [-260, 420, -540][k], autoAlpha: 0 }));
    gsap.set('.mk-bezel', { scale: 2.6, autoAlpha: 0, filter: 'blur(18px)' });
    gsap.set('.mk-final', { autoAlpha: 0, scale: 1.12 });
    gsap.set('.mk-badge', { autoAlpha: 0, scale: .4, rotation: -60 });
    gsap.set('.tag', { autoAlpha: 0, scale: .5 });
    gsap.set('.mk-explode', { scale: .82 });
    const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });
    // 1: exploded parts
    tl.to('.mk-explode', { scale: 1, duration: 1 }, 0)
      .to('.tag', { autoAlpha: 1, scale: 1, stagger: .12, duration: .4, ease: 'back.out(2)' }, .15)
    // 2: dial tile by tile
      .to('.tag', { autoAlpha: 0, scale: .6, duration: .3 }, 1)
      .to('.mk-explode', { autoAlpha: 0, scale: 1.3, filter: 'blur(14px)', duration: .7 }, 1)
      .to('.mk-dialwrap', { autoAlpha: 1, scale: 1, rotation: 0, duration: 1, ease: 'power3.out' }, 1.1)
      .to('.mk-dial', { clipPath: 'circle(75% at 50% 50%)', duration: .9, ease: 'power2.out' }, 1.1)
    // 3: hands drop in
      .to('.mk-h', { y: 0, rotation: FINAL.hour, autoAlpha: 1, duration: .8, ease: 'bounce.out' }, 1.98)
      .to('.mk-m', { y: 0, rotation: FINAL.minute, autoAlpha: 1, duration: .8, ease: 'bounce.out' }, 2.1)
      .to('.mk-s', { y: 0, rotation: FINAL.second, autoAlpha: 1, duration: .8, ease: 'bounce.out' }, 2.22)
    // 4: sealed in crystal
      .to('.mk-bezel', { scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: .7, ease: 'power3.in' }, 3.05)
      .to('.mk-flash', { opacity: 1, duration: .08 }, 3.72).to('.mk-flash', { opacity: 0, duration: .5 }, 3.8)
      .to(['.mk-dialwrap', '.mk-bezel'], { autoAlpha: 0, duration: .2 }, 3.74)
      .to('.mk-final', { autoAlpha: 1, scale: 1, duration: .5, ease: 'back.out(1.6)' }, 3.74)
      .fromTo('.mk-click', { autoAlpha: 0, y: 20, scale: .6 }, { autoAlpha: 1, y: 0, scale: 1, duration: .3, ease: 'back.out(3)' }, 3.76)
    // 5: strapped and tested
      .to('.mk-click', { autoAlpha: 0, duration: .3 }, 4.3)
      .to('.mk-final', { rotation: -6, scale: 1.04, duration: 1 }, 4.1)
      .to('.mk-badge', { autoAlpha: 1, scale: 1, rotation: 0, duration: .6, ease: 'back.out(2)' }, 4.25)
      .to({}, { duration: .4 });
    ScrollTrigger.create({
      trigger: '.making', start: 'top top', end: '+=420%', pin: '.mk-pin', scrub: .8, animation: tl
    });
    tl.eventCallback('onUpdate', () => setStep(Math.min(4, Math.max(0, Math.floor(tl.time() + .02)))));
  }

  /* ---------- live time ---------- */
  const tH = $('#tH'), tM = $('#tM'), tS = $('#tS'), digits = $('#digits'), cityLine = $('#cityLine');
  let tz = 'local', acc = { h: null, m: null, s: null };
  const parts = () => {
    const d = new Date();
    if (tz === 'local') return [d.getHours(), d.getMinutes(), d.getSeconds()];
    const f = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }).formatToParts(d);
    const g = k => +f.find(x => x.type === k).value;
    return [g('hour') % 24, g('minute'), g('second')];
  };
  const fwd = (prev, target) => { if (prev === null) return target; let d = ((target - prev) % 360 + 360) % 360; return prev + d; };
  const tick = (travel) => {
    const [h, m, s] = parts();
    digits.textContent = [h, m, s].map(n => String(n).padStart(2, '0')).join(':');
    const th = ((h % 12) + m / 60) * 30, tm = (m + s / 60) * 6, ts = s * 6;
    const nh = fwd(acc.h, th) + (travel ? 360 : 0), nm = fwd(acc.m, tm) + (travel ? 720 : 0), ns = fwd(acc.s, ts);
    if (reduce || acc.h === null) gsap.set(tH, { rotation: nh }), gsap.set(tM, { rotation: nm }), gsap.set(tS, { rotation: ns });
    else {
      gsap.to(tH, { rotation: nh, duration: travel ? 1.6 : .3, ease: travel ? 'power3.inOut' : 'power1.out' });
      gsap.to(tM, { rotation: nm, duration: travel ? 1.6 : .3, ease: travel ? 'power3.inOut' : 'power1.out' });
      gsap.to(tS, { rotation: ns, duration: .35, ease: 'back.out(3)' });
    }
    acc = { h: nh, m: nm, s: ns };
  };
  tick(); setInterval(() => tick(false), 1000);
  $$('#cities button').forEach(b => b.addEventListener('click', () => {
    $$('#cities button').forEach(x => x.classList.toggle('on', x === b));
    tz = b.dataset.tz; cityLine.textContent = tz === 'local' ? 'where you are.' : 'in ' + b.textContent + '.';
    tick(true);
  }));
  const tStage = $('#tStage'), tDial = $('#tDial');
  if (fine && !reduce) {
    tStage.addEventListener('pointermove', e => {
      const r = tDial.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      tDial.style.transform = `rotateX(${-y * 22}deg) rotateY(${x * 22}deg)`;
      tDial.style.setProperty('--gx', (x + .5) * 100 + '%'); tDial.style.setProperty('--gy', (y + .5) * 100 + '%');
    });
    tStage.addEventListener('pointerleave', () => tDial.style.transform = '');
  }

  /* ---------- reveals ---------- */
  if (!reduce) {
    $$('.spec b').forEach(b => {
      const o = { v: 0 }, to = +b.dataset.to, suf = b.dataset.suf || '';
      ScrollTrigger.create({ trigger: b, start: 'top 85%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 1.6, ease: 'power3.out', onUpdate: () => b.textContent = Math.round(o.v) + suf }) });
    });
    $$('.sec-head, .cta h2, .cta .muted, .join, .time-copy > *').forEach(el => gsap.from(el, { y: 40, autoAlpha: 0, duration: .9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
    gsap.from('.card', { y: 80, autoAlpha: 0, rotation: (i) => [-4, 0, 4][i], duration: 1, ease: 'power3.out', stagger: .12, scrollTrigger: { trigger: '.cards', start: 'top 85%' } });
    gsap.from('.tdial', { scale: .6, rotation: -120, autoAlpha: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '.time', start: 'top 70%' } });
    gsap.from('.foot-word span', { yPercent: 100, autoAlpha: 0, stagger: .07, duration: 1, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.foot', start: 'top 90%' } });
  } else {
    $$('.spec b').forEach(b => b.textContent = b.dataset.to + (b.dataset.suf || ''));
  }

  /* ---------- tilt cards + magnetic + cursor ---------- */
  if (fine && !reduce) {
    $$('.tilt').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = `perspective(900px) rotateX(${-y * 10}deg) rotateY(${x * 12}deg)`;
        c.style.setProperty('--gx', (x + .5) * 100 + '%'); c.style.setProperty('--gy', (y + .5) * 100 + '%');
      });
      c.addEventListener('pointerleave', () => c.style.transform = '');
    });
    $$('.magnetic').forEach(b => {
      b.addEventListener('pointermove', e => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px,${(e.clientY - r.top - r.height / 2) * .35}px)`; });
      b.addEventListener('pointerleave', () => b.style.transform = '');
    });
    const cur$ = $('#cursor'); const xTo = gsap.quickTo(cur$, 'x', { duration: .25 }), yTo = gsap.quickTo(cur$, 'y', { duration: .25 });
    gsap.set(cur$, { xPercent: -50, yPercent: -50 });
    addEventListener('pointermove', e => { xTo(e.clientX); yTo(e.clientY); });
    document.addEventListener('pointerover', e => cur$.classList.toggle('big', !!e.target.closest('a,button,summary,.tilt,.tdial')));
  }

  /* ---------- bag ---------- */
  const bag = [], bagEl = $('#bag'), scrim = $('#scrim');
  const fmt = n => '$' + n.toLocaleString('en-US');
  const render = () => {
    const list = $('#bagList');
    list.innerHTML = bag.length ? bag.map((it, i) => `<li><div><b>BRIKA No.01 · ${it.name}</b><small>${it.size} mm · ${fmt(it.price)}</small></div><button data-rm="${i}" aria-label="Remove">✕</button></li>`).join('') : '<li class="bag-empty">Your bag is empty. Go build one.</li>';
    $('#bagTotal').textContent = fmt(bag.reduce((a, b) => a + b.price, 0));
    const c = $('#bagCount'); c.textContent = bag.length;
    const bb = $('#bagBtn'); bb.classList.remove('bump'); void bb.offsetWidth; bb.classList.add('bump');
  };
  const openBag = o => { bagEl.classList.toggle('open', o); scrim.classList.toggle('on', o); bagEl.setAttribute('aria-hidden', !o); if (lenis) o ? lenis.stop() : lenis.start(); };
  const add = (name, price) => { bag.push({ name, price, size: +($('.sizes .on')?.textContent || 42) }); render(); openBag(true); };
  $$('.add').forEach(b => b.addEventListener('click', () => add(b.dataset.name, +b.dataset.price)));
  $('#swAdd').addEventListener('click', () => add(PAL[cur].name, +PAL[cur].price.replace(/\D/g, '')));
  $('#bagBtn').addEventListener('click', () => { render(); openBag(true); });
  $('#bagClose').addEventListener('click', () => openBag(false));
  scrim.addEventListener('click', () => openBag(false));
  addEventListener('keydown', e => e.key === 'Escape' && openBag(false));
  $('#bagList').addEventListener('click', e => { const b = e.target.closest('[data-rm]'); if (b) { bag.splice(+b.dataset.rm, 1); render(); } });
  $('#checkout').addEventListener('click', () => $('#bagNote').hidden = false);
  render(); $('#bagBtn').classList.remove('bump');

  $('#join').addEventListener('submit', e => { e.preventDefault(); $('#join').hidden = true; $('#joinOk').hidden = false; });

  addEventListener('load', () => ScrollTrigger.refresh());
})();
