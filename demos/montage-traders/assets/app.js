/* Shared: header, footer, cart, policies, reveal. Every page loads data.js then this file. */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const S = window.SHOP, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rupee = n => '₹' + Number(n).toLocaleString('en-IN');
  const img = (n, small) => `img/${n}${small ? '-s' : ''}.webp`;
  const byId = id => PRODUCTS.find(p => p.id === id);
  const catName = id => (CATS.find(c => c.id === id) || {}).name || '';
  const wa = t => `https://wa.me/${S.whatsapp}?text=${encodeURIComponent(t)}`;
  const store = {
    mem: {},
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return this.mem[k] ?? d; } },
    set(k, v) { this.mem[k] = v; try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  };
  const priced = p => p.v.filter(x => x[1]).map(x => x[1]);
  const priceHTML = p => { const v = priced(p); if (!v.length) return '<span class="price ask">Price on WhatsApp</span>'; const lo = Math.min(...v); return `<span class="price">${v.length > 1 ? '<small>from </small>' : ''}${rupee(lo)}</span>`; };

  /* cart: [{id, vi, q}] */
  const Cart = {
    all: () => store.get('mt_cart', []).filter(x => byId(x.id)),
    save(c) { store.set('mt_cart', c); count(); },
    add(id, vi, q) { const c = Cart.all(), f = c.find(x => x.id === id && x.vi === vi); if (f) f.q += q; else c.push({ id, vi, q }); Cart.save(c); },
    setQ(i, q) { const c = Cart.all(); if (q < 1) c.splice(i, 1); else c[i].q = q; Cart.save(c); },
    line(x) { const p = byId(x.id), [label, price] = p.v[x.vi]; return { p, label, price, total: price ? price * x.q : 0 }; },
    totals() { let items = 0, total = 0, ask = 0; Cart.all().forEach(x => { const l = Cart.line(x); items += x.q; total += l.total; if (!l.price) ask++; }); return { items, total, ask }; }
  };
  const count = () => { const n = $('#cartN'); if (!n) return; const t = Cart.all().reduce((a, b) => a + b.q, 0); n.textContent = t; n.hidden = !t; };

  const logo = `<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="23" fill="#0c2744"/><path d="M6 33 17 18l6 8 5-6 14 13Z" fill="#eef4f8"/><path d="m17 18 3.5 4.7-2.2-.6L17 24l-1.4-2.4-2.1.9Z" fill="#fff"/><path d="M8 37c5-3 10-3 16 0s11 3 16 0" stroke="#f07a2a" stroke-width="2.6" fill="none" stroke-linecap="round"/></svg><span class="logo-t">MONTAGE<small>TRADERS</small></span>`;
  const page = document.body.dataset.page;
  const nav = [['index.html', 'Home', 'home'], ['shop.html', 'Shop', 'shop'], ['shop.html?cat=tents', 'Camping', 'x'], ['shop.html?cat=aqua', 'Aquariums', 'y'], ['about.html', 'About', 'about'], ['contact.html', 'Visit Us', 'contact']];
  const waSvg = '<svg viewBox="0 0 32 32"><path d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3Zm0 23.6c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6Zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7 0a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5 1-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.6 3.6 0 0 0-1.1 2.7 6.3 6.3 0 0 0 1.3 3.3 14.4 14.4 0 0 0 5.5 4.9c2 .9 2.8 1 3.9.8a3.3 3.3 0 0 0 2.1-1.5 2.6 2.6 0 0 0 .2-1.5c-.1-.2-.3-.3-.6-.4Z"/></svg>';

  $('#hdr') && ($('#hdr').outerHTML = `
  <div class="strip">Fishing · Camping · Aquariums — <b>Lal Mandi, Srinagar</b> · Order on WhatsApp</div>
  <header class="hdr"><div class="wrap hdr-in">
    <a class="logo" href="index.html" aria-label="Montage Traders home">${logo}</a>
    <nav class="nav" aria-label="Main">${nav.map(([h, t, k]) => `<a href="${h}" class="${page === k ? 'on' : ''}">${t}</a>`).join('')}</nav>
    <div class="acts">
      <a class="ib" href="shop.html" aria-label="Search"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg></a>
      <a class="ib" href="cart.html" aria-label="Cart"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 7h12l-1 13H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg><span class="cart-n" id="cartN" hidden>0</span></a>
      <button class="ib menu-btn" id="menuBtn" aria-label="Menu"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h16M4 12h16M4 17h10"/></svg></button>
    </div></div></header>
  <aside class="drawer" id="drawer"><button class="ib" id="drawerX" aria-label="Close menu">✕</button>${nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}<a href="cart.html">Cart</a></aside>`);
  $('#menuBtn')?.addEventListener('click', () => $('#drawer').classList.add('open'));
  $('#drawerX')?.addEventListener('click', () => $('#drawer').classList.remove('open'));

  $('#ftr') && ($('#ftr').outerHTML = `
  <footer class="foot"><video autoplay muted loop playsinline preload="none" poster="media/lake.jpg" aria-hidden="true"><source src="media/lake.mp4" type="video/mp4"></video><div class="wrap">
    <div class="foot-cta"><p class="eyebrow" style="justify-content:center;color:#ffd2b0">Planning a trip?</p><h2>Tell us where you're headed — <em>we'll pack your list.</em></h2>
      <div class="row"><a class="btn btn-or" href="${wa('Hi Montage Traders, I am planning a trip and need gear. ')}" target="_blank" rel="noopener">💬 Chat on WhatsApp</a><a class="btn btn-glass" href="tel:+91${S.phones[0].replace(/\s/g, '')}">📞 ${S.phones[0]}</a></div></div>
    <div class="foot-top">
      <div><a class="logo" href="index.html">${logo}</a><p style="margin-top:14px;max-width:360px">Fishing, camping and aquarium gear in the heart of Srinagar — tents, rods, waders, life jackets, aquariums and ornamental fish.</p></div>
      <div class="foot-links"><h4>SHOP</h4>${CATS.map(c => `<a href="shop.html?cat=${c.id}">${c.name}</a>`).join('')}</div>
      <div class="foot-links"><h4>VISIT</h4><a href="about.html">About Montage Traders</a><p>${S.address}</p><a href="tel:+91${S.phones[0].replace(/\s/g, '')}">📞 ${S.phones[0]}</a><a href="tel:+91${S.phones[1].replace(/\s/g, '')}">📞 ${S.phones[1]}</a><a href="${S.instagram}" target="_blank" rel="noopener">📸 @montagetraders69</a></div>
    </div>
    <div class="pay-row"><b>We accept</b><span class="pay" style="color:#097939">UPI</span><span class="pay">G&nbsp;Pay</span><span class="pay" style="color:#5f259f">PhonePe</span><span class="pay" style="color:#00a6e0">Paytm</span><span class="pay" style="color:#1a1f71;font-style:italic">VISA</span><span class="pay" style="color:#0a3a7a">RuPay</span><span class="pay">💵 Cash on Delivery</span></div>
    <div class="legal"><button data-pol="shipping">Shipping &amp; Delivery</button><button data-pol="returns">Returns &amp; Exchange</button><button data-pol="terms">Terms &amp; Conditions</button><button data-pol="privacy">Privacy Policy</button><span class="copy">© ${new Date().getFullYear()} Montage Traders · Site by <a href="https://plastrixstudio.com" target="_blank" rel="noopener" style="text-decoration:underline">Plastrix Studio</a></span></div>
  </div></footer>
  <a class="wa" href="${wa('Hi Montage Traders, I have a question.')}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${waSvg}</a>
  <div class="modal" id="modal" role="dialog" aria-modal="true" aria-labelledby="mT"><div class="modal-bg" data-x></div><div class="modal-box"><div class="modal-h"><h3 id="mT"></h3><button class="ib" data-x aria-label="Close">✕</button></div><div class="modal-c" id="mC"></div></div></div>
  <div class="toast" id="toast" role="status"></div>`);
  count();

  /* policies — draft text for the shop to confirm */
  const POL = {
    shipping: ['Shipping & Delivery', `<h4>Srinagar</h4><p>Pick up from our shop at Lal Mandi or ask for local delivery.</p><h4>Outside Srinagar</h4><p>We send parcels across Jammu & Kashmir and India by courier. Charges and delivery time depend on the place and parcel size, and are confirmed on WhatsApp before dispatch.</p>`],
    returns: ['Returns & Exchange', `<h4>Damaged or wrong item</h4><p>Message us on WhatsApp with photos soon after you receive the parcel and we will exchange it.</p><h4>Not accepted</h4><ul><li>Used items or items without original packing</li><li>Live fish once delivered</li></ul>`],
    terms: ['Terms & Conditions', `<p>Prices on this website are in Indian Rupees and can change with new stock. Your order is confirmed after we check stock and confirm with you on WhatsApp or phone. Colours of tents and gear may vary.</p><h4>Contact</h4><p>${S.address} · ${S.phones.join(' / ')}</p>`],
    privacy: ['Privacy Policy', `<p>We only ask for your name, phone number and address to confirm and deliver your order. We do not sell your details and share your address only with the courier.</p>`]
  };
  const modal = $('#modal');
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-pol]'); if (b) { const [t, h] = POL[b.dataset.pol]; $('#mT').textContent = t; $('#mC').innerHTML = h; modal.classList.add('on'); }
    if (e.target.closest('[data-x]')) modal.classList.remove('on');
  });
  addEventListener('keydown', e => { if (e.key === 'Escape') { modal.classList.remove('on'); $('#drawer')?.classList.remove('open'); } });

  let tt; const toast = h => { const t = $('#toast'); t.innerHTML = h; t.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => t.classList.remove('on'), 3200); };

  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  const watch = () => $$('.rv:not(.in)').forEach(el => io.observe(el));

  const card = p => `<a class="card rv" href="product.html?id=${p.id}"><div class="card-img">${p.tag ? `<span class="tag ${p.tag.split(' ')[0]}">${p.tag}</span>` : ''}<img src="${img(p.img[0], 1)}" alt="${p.name}" loading="lazy"></div>
    <div class="card-b"><small>${catName(p.cat)}</small><h3>${p.name}</h3><span class="vars">${p.v.length > 1 ? p.v.length + ' options' : p.v[0][0]}</span>${priceHTML(p)}<span class="go">View &amp; buy →</span></div></a>`;

  if (window.Lenis && !reduce && matchMedia('(pointer:fine)').matches) { const l = new Lenis({ duration: 1.1 }); const raf = t => { l.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); window.__lenis = l; }

  window.MT = { $, $$, rupee, img, byId, catName, wa, store, Cart, card, watch, toast, priceHTML, reduce };
  watch();
})();
