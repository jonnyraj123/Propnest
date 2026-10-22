/* Shared layer: header, footer, cart, popups, effects. Every page loads data.js then this file. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  const S = window.SHOP;

  /* ---------- helpers ---------- */
  const pad = n => String(n).padStart(2, '0');
  const img = (n, small) => `img/p/p${pad(n)}${small ? '-s' : ''}.webp`;
  const byId = id => PRODUCTS.find(p => p.id === id);
  const catName = id => (CATS.find(c => c.id === id) || {}).name || '';
  const unit = (p, size) => p.priceBySize ? p.priceBySize[size] : p.price;
  const rupee = n => '₹' + Number(n).toLocaleString('en-IN');
  const priceHTML = p => {
    if (p.priceBySize) { const v = Object.values(p.priceBySize); return `<span class="price">${rupee(Math.min(...v))}<small> – ${rupee(Math.max(...v))} / pc</small></span>`; }
    if (p.price) return `<span class="price">${rupee(p.price)}<small> / pc</small></span>`;
    return `<span class="price ask">Price on WhatsApp</span>`;
  };
  const SW = { Navy: '#1f2a5a', Olive: '#8a8a2a', Purple: '#7a4bb0', Wine: '#6d1f3a', 'Bottle Green': '#1e5a46', Brown: '#8a5a3a', Blue: '#4b7bd0', Pink: '#f3a2bd', Mint: '#a6e0c9', Lilac: '#c9a8e6', Yellow: '#f5d34b', Maroon: '#7a1f2e', Rust: '#b0543a', Mauve: '#9a7390', Peach: '#f7b996', Aqua: '#6fd4d0', Orange: '#f08a3c', Teal: '#2a9d9a', Mustard: '#d7a531', Green: '#79b04a', Rose: '#d77a8f', Grey: '#8c8c8c', Red: '#d23b3b', Sky: '#6fb8ec', Sage: '#94b8a0' };
  const swatch = c => SW[c] || ['#f3a2bd', '#a6e0c9', '#f5d34b'][['Colour A', 'Colour B', 'Colour C'].indexOf(c)] || '#ddd';
  const wa = text => `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(text)}`;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return store.mem[k] ?? d; } },
    set(k, v) { store.mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    mem: {}
  };

  /* ---------- cart ---------- */
  const Cart = {
    all: () => store.get('ag_cart', []),
    save(c) { store.set('ag_cart', c); updateCount(true); },
    set(id, q) { const c = Cart.all().filter(x => x.id !== id); if (Object.values(q).some(v => v > 0)) c.push({ id, q }); Cart.save(c); },
    get: id => (Cart.all().find(x => x.id === id) || {}).q || {},
    remove(id) { Cart.save(Cart.all().filter(x => x.id !== id)); },
    pcs: q => Object.values(q).reduce((a, b) => a + (+b || 0), 0),
    line(item) {
      const p = byId(item.id); let total = 0, priced = true;
      for (const [k, v] of Object.entries(item.q)) { if (!v) continue; const u = unit(p, k.split('|')[1]); if (u) total += u * v; else priced = false; }
      return { p, pcs: Cart.pcs(item.q), total, priced };
    },
    totals() {
      let pcs = 0, total = 0, ask = 0;
      Cart.all().forEach(it => { const l = Cart.line(it); if (!l.p) return; pcs += l.pcs; total += l.total; if (!l.priced) ask++; });
      return { pcs, total, ask, designs: Cart.all().length };
    }
  };
  const updateCount = bump => { const n = $('#cartN'); if (!n) return; const d = Cart.all().length; n.textContent = d; n.hidden = !d; if (bump) { n.classList.remove('bump'); void n.offsetWidth; n.classList.add('bump'); } };

  /* ---------- header / footer ---------- */
  const page = document.body.dataset.page;
  const navItems = [['index.html', 'Home', 'home'], ['shop.html', 'Shop', 'shop'], ['about.html', 'How Wholesale Works', 'about'], ['contact.html', 'Contact', 'contact']];
  const hdr = $('#hdr');
  if (hdr) hdr.outerHTML = `
  <div class="top-strip">Wholesale only · Minimum <b>${S.moq} pieces</b> per design · Sizes 16 to XL · 3 colours per design</div>
  <header class="hdr"><div class="wrap hdr-in">
    <a class="logo" href="index.html" aria-label="ALIMUDDIN Garments home"><span class="logo-mark">AG</span><span class="logo-t">ALIMUDDIN<small>GARMENTS</small></span></a>
    <nav class="nav" aria-label="Main">${navItems.map(([h, t, k]) => `<a href="${h}" class="${page === k ? 'on' : ''}">${t}</a>`).join('')}</nav>
    <div class="hdr-act">
      <a class="icon-btn" href="shop.html" aria-label="Search products"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg></a>
      <a class="icon-btn" href="cart.html" aria-label="Order list"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg><span class="cart-n" id="cartN" hidden>0</span></a>
      <button class="icon-btn menu-btn" id="menuBtn" aria-label="Open menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h10"/></svg></button>
    </div>
  </div></header>
  <aside class="drawer" id="drawer" aria-label="Menu"><button class="icon-btn x" id="drawerX" aria-label="Close menu">✕</button>${navItems.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a href="cart.html">Order List</a></aside>`;
  const drawer = $('#drawer');
  $('#menuBtn')?.addEventListener('click', () => drawer.classList.add('open'));
  $('#drawerX')?.addEventListener('click', () => drawer.classList.remove('open'));

  const waSvg = '<svg viewBox="0 0 32 32" fill="#fff"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.6c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8 1 3.9.8a3.3 3.3 0 0 0 2.1-1.5 2.6 2.6 0 0 0 .2-1.5c-.1-.2-.3-.3-.6-.4Z"/></svg>';
  const ftr = $('#ftr');
  if (ftr) ftr.outerHTML = `
  <footer class="foot"><div class="wrap">
    <div class="foot-top">
      <div><a class="logo" href="index.html"><span class="logo-mark">AG</span><span class="logo-t">ALIMUDDIN<small>GARMENTS</small></span></a>
        <p style="margin-top:16px;max-width:360px">Wholesale kidswear for shops — frocks, skirt sets, co-ords, bell-bottom sets, boys sets and dungarees. Every design comes in 3 colours.</p></div>
      <div class="foot-links"><h4>Shop</h4>${CATS.map(c => `<a href="shop.html?cat=${c.id}">${c.name}</a>`).join('')}</div>
      <div class="foot-links"><h4>Visit / Call</h4><p>${S.address}</p><a href="tel:+91${S.phones[0].replace(/\s/g, '')}">📞 ${S.phones[0]}</a><a href="tel:+91${S.phones[1].replace(/\s/g, '')}">📞 ${S.phones[1]}</a><a href="${wa('Hi ALIMUDDIN Garments, I want to see your wholesale collection.')}" target="_blank" rel="noopener">💬 WhatsApp us</a></div>
    </div>
    <div class="pay-row"><span>We accept</span>
      <span class="pay"><b style="color:#097939">UPI</b></span><span class="pay"><b style="color:#5f6368">G</b>Pay</span><span class="pay" style="color:#5f259f">PhonePe</span><span class="pay"><b style="color:#00baf2">pay</b><b style="color:#002e6e">tm</b></span><span class="pay" style="color:#0a3a7a">RuPay</span><span class="pay" style="color:#1a1f71;font-style:italic">VISA</span><span class="pay"><svg viewBox="0 0 38 24"><circle cx="14" cy="12" r="9" fill="#eb001b"/><circle cx="24" cy="12" r="9" fill="#f79e1b" fill-opacity=".9"/></svg></span><span class="pay">🏦 Bank Transfer</span>
    </div>
    <div class="legal">
      <button data-policy="wholesale">Wholesale Policy</button><button data-policy="terms">Terms &amp; Conditions</button><button data-policy="privacy">Privacy Policy</button><button data-policy="shipping">Shipping &amp; Delivery</button><button data-policy="returns">Returns &amp; Exchange</button>
      <span class="copy">© ${new Date().getFullYear()} ALIMUDDIN Garments · Site by <a href="https://plastrixstudio.com" target="_blank" rel="noopener" style="text-decoration:underline">Plastrix Studio</a></span>
    </div>
  </div></footer>
  <a class="wa-float" href="${wa('Hi ALIMUDDIN Garments, I want to place a wholesale order.')}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${waSvg}<span class="wa-tip">Order on WhatsApp</span></a>
  <div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="modalT"><div class="modal-bg" data-close></div><div class="modal-box"><div class="modal-h"><h3 id="modalT"></h3><button class="modal-x" data-close aria-label="Close">✕</button></div><div class="modal-c" id="modalC"></div></div></div>
  <div class="toast" id="toast" role="status"></div>`;
  updateCount();

  /* ---------- policies (draft text, to be confirmed by the shop) ---------- */
  const POL = {
    wholesale: ['Wholesale Policy', `<p>We sell only in wholesale to shops, boutiques and resellers.</p><h4>Minimum order</h4><p>Minimum ${S.moq} pieces per design. You can mix sizes and colours of the same design to reach ${S.moq}.</p><h4>Sizes &amp; colours</h4><p>Each design comes in a 3-colour chart. Size range is shown on every product page.</p><h4>Prices</h4><p>Prices shown are per piece, wholesale, and may change with new stock. The final price is confirmed on WhatsApp before dispatch.</p>`],
    terms: ['Terms &amp; Conditions', `<p>By placing an order on this website you agree to the terms below.</p><h4>Orders</h4><p>An order on this website is a request. It is confirmed only after we check stock and confirm it with you on WhatsApp or phone.</p><h4>Stock</h4><p>Colours may look slightly different on screen. If a colour or size is out of stock we will tell you before dispatch.</p><h4>Payment</h4><p>Payment details (UPI / bank transfer) are shared after the order is confirmed. Goods are dispatched after payment is received, unless agreed otherwise.</p><h4>Contact</h4><p>${S.address} · ${S.phones.join(' / ')}</p>`],
    privacy: ['Privacy Policy', `<p>We collect only what we need to process your order: shop name, contact name, phone number and delivery address.</p><h4>How we use it</h4><ul><li>To confirm and deliver your order</li><li>To send you new design updates on WhatsApp, only if you ask for them</li></ul><h4>Sharing</h4><p>We do not sell your details. We share your address only with the courier or transport delivering your parcel.</p><h4>Your choice</h4><p>Message us on WhatsApp any time to stop updates or remove your details.</p>`],
    shipping: ['Shipping &amp; Delivery', `<h4>Kolkata</h4><p>Pick up from our shop or ask for local delivery.</p><h4>Outside Kolkata</h4><p>We send parcels by courier or transport across India. Delivery charges and time depend on your city and parcel weight, and are confirmed on WhatsApp before dispatch.</p><h4>Tracking</h4><p>We share the courier or transport receipt on WhatsApp after dispatch.</p>`],
    returns: ['Returns &amp; Exchange', `<h4>Wrong or damaged items</h4><p>If you receive a damaged piece or a wrong design, size or colour, message us on WhatsApp with photos and an unboxing video soon after receiving the parcel. We will exchange it.</p><h4>Not accepted</h4><ul><li>Pieces that were used, washed or altered</li><li>Change of mind after dispatch</li></ul><p>Exact return time and rules are confirmed with every order.</p>`]
  };
  const modal = $('#modal');
  const openModal = (title, html) => { $('#modalT').innerHTML = title; $('#modalC').innerHTML = html + '<p class="upd">ALIMUDDIN Garments, Kolkata</p>'; $('#modalC').scrollTop = 0; modal.classList.remove('closing'); modal.classList.add('on'); $('.modal-x', modal).focus(); lenis?.stop(); };
  const closeModal = () => { if (!modal.classList.contains('on')) return; modal.classList.add('closing'); setTimeout(() => { modal.classList.remove('on', 'closing'); lenis?.start(); }, reduce ? 0 : 280); };
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-policy]'); if (b) { const [t, h] = POL[b.dataset.policy]; openModal(t, h); }
    if (e.target.closest('[data-close]')) closeModal();
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') { closeModal(); closeGift(); drawer?.classList.remove('open'); $('.zoom.on')?.classList.remove('on'); } });

  /* ---------- toast ---------- */
  let tt;
  const toast = html => { const t = $('#toast'); t.innerHTML = html; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 3600); };

  /* ---------- gift popup (3.5 s after first visit in a session) ---------- */
  document.body.insertAdjacentHTML('beforeend', `
  <div class="gift" id="gift" role="dialog" aria-modal="true" aria-labelledby="giftT"><div class="gift-bg" data-gclose></div>
    <div class="gift-card"><div class="gift-cover"></div><div class="gift-lid"><span class="rv"></span><span class="rh"></span>
      <svg class="bow" viewBox="0 0 90 60"><path d="M45 30C30 5 5 5 8 22s27 10 37 8Z" fill="#e8c46c" stroke="#9a7224" stroke-width="2"/><path d="M45 30c15-25 40-25 37-8S55 32 45 30Z" fill="#e8c46c" stroke="#9a7224" stroke-width="2"/><circle cx="45" cy="30" r="8" fill="#c79a3b"/></svg></div>
      <button class="gift-x" data-gclose aria-label="Close">✕</button>
      <div class="emoji">🎁</div><p class="eyebrow" style="justify-content:center">For shop owners</p>
      <h3 id="giftT">New designs, <em>first</em> to you</h3>
      <p>Get our newest kidswear designs on WhatsApp as soon as they arrive — with prices and the 3-colour chart.</p>
      <a class="btn btn-wa" href="${wa('Hi ALIMUDDIN Garments, please add me to your new designs list. My shop name is: ')}" target="_blank" rel="noopener" data-gclose>${waSvg.replace('<svg', '<svg width="22" height="22"')} Send me new designs</a>
      <button class="gift-later" data-gclose>Maybe later</button>
    </div></div>`);
  const gift = $('#gift');
  function closeGift() { gift.classList.remove('on', 'open'); }
  gift.addEventListener('click', e => { if (e.target.closest('[data-gclose]')) closeGift(); });
  let seen = false; try { seen = sessionStorage.getItem('ag_gift'); } catch (e) {}
  if (!seen && page !== 'thanks') setTimeout(() => { try { sessionStorage.setItem('ag_gift', 1); } catch (e) {} gift.classList.add('on'); setTimeout(() => gift.classList.add('open'), reduce ? 0 : 450); }, 3500);

  /* ---------- smooth scroll ---------- */
  let lenis = null;
  if (!reduce && window.Lenis && fine) {
    lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    if (window.gsap) { lenis.on('scroll', () => window.ScrollTrigger && ScrollTrigger.update()); gsap.ticker.add(t => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = t => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  const watch = (root = document) => $$('.rv:not(.in)', root).forEach(el => io.observe(el));

  /* ---------- gold sparkle trail (desktop) + tap burst (touch) ---------- */
  const spark = (x, y, n) => { if (reduce) return; for (let i = 0; i < n; i++) { const s = document.createElement('i'); s.className = 'spark'; s.style.left = x + 'px'; s.style.top = y + 'px'; const a = Math.random() * 6.28, d = 14 + Math.random() * 40; s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d + 18 + 'px'); document.body.appendChild(s); setTimeout(() => s.remove(), 900); } };

  const confetti = (x = innerWidth / 2, y = innerHeight / 3, n = 60) => {
    if (reduce) return; const cols = ['#8cc63f', '#e2718b', '#c79a3b', '#f3dc97', '#f8c8d2', '#3f7a23'];
    for (let i = 0; i < n; i++) {
      const c = document.createElement('i'); c.className = 'confetti'; c.style.background = cols[i % cols.length]; c.style.left = x + 'px'; c.style.top = y + 'px'; document.body.appendChild(c);
      const a = Math.random() * Math.PI * 2, v = 120 + Math.random() * 260;
      c.animate([{ transform: 'translate(0,0) rotate(0)', opacity: 1 }, { transform: `translate(${Math.cos(a) * v}px,${Math.sin(a) * v + 260}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }], { duration: 1400 + Math.random() * 800, easing: 'cubic-bezier(.2,.7,.4,1)' }).onfinish = () => c.remove();
    }
  };

  /* ---------- product card ---------- */
  const card = p => `
    <a class="card rv" href="product.html?id=${p.id}">
      <div class="card-img">${p.tag ? `<span class="tag ${p.tag}">${p.tag}</span>` : ''}<img src="${img(p.img[0], 1)}" alt="${p.name}" loading="lazy">${p.img[1] ? `<img src="${img(p.img[1], 1)}" alt="" loading="lazy">` : ''}<span class="moq-b">MOQ ${S.moq} pcs</span></div>
      <div class="card-b">${p.code ? `<span class="code">CODE ${p.code}</span>` : `<span class="code">${catName(p.cat).toUpperCase()}</span>`}<h3>${p.name}</h3>
        <div class="row">${priceHTML(p)}<span class="dots">${p.colours.slice(0, 4).map(c => `<i style="background:${swatch(c)}"></i>`).join('')}</span></div></div>
    </a>`;
  const tilt = (root = document) => {
    if (!fine || reduce) return;
    $$('.card', root).forEach(c => {
      c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; c.style.transform = `perspective(900px) rotateX(${-y * 8}deg) rotateY(${x * 10}deg) translateY(-4px)`; c.style.setProperty('--gx', (x + .5) * 100 + '%'); c.style.setProperty('--gy', (y + .5) * 100 + '%'); });
      c.addEventListener('pointerleave', () => c.style.transform = '');
    });
  };

  window.AG = { $, $$, reduce, fine, img, byId, catName, unit, rupee, priceHTML, swatch, wa, Cart, card, tilt, watch, toast, confetti, spark, store, lenis: () => lenis, updateCount };
  addEventListener('DOMContentLoaded', () => { watch(); tilt(); });
  if (document.readyState !== 'loading') { watch(); tilt(); }
})();
