/*
 * Sohag Exclusive — static demo behaviour for Netlify.
 * The pages are exported from the real WordPress theme; this script replaces the parts that
 * need a server (cart, checkout, search, accounts) with browser-only versions. Nothing is sent
 * anywhere and no order is placed.
 */
(function () {
  'use strict';

  var PRODUCTS = window.SOHAG_PRODUCTS || {};
  var CART_KEY = 'sohag_demo_cart';
  var ORDER_KEY = 'sohag_demo_last_order';
  var body = document.body;

  /* ---------- storage ---------- */
  function load(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function save(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* storage blocked: cart lives for this page only */ }
  }
  var cart = load(CART_KEY, []);

  /* ---------- helpers ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function money(n) {
    return '<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">&#8377;</span>' +
      Math.round(n).toLocaleString('en-IN') + '</bdi></span>';
  }
  function cartCount() { return cart.reduce(function (s, i) { return s + i.qty; }, 0); }
  function cartTotal() { return cart.reduce(function (s, i) { return s + i.qty * i.price; }, 0); }
  function persist() {
    save(CART_KEY, cart);
    document.querySelectorAll('[data-cart-count]').forEach(function (el) { el.textContent = cartCount(); });
  }
  function addToCart(id, qty, variation, price) {
    var p = PRODUCTS[id];
    if (!p) return;
    var key = id + '|' + (variation || '');
    var line = cart.filter(function (i) { return i.key === key; })[0];
    if (line) {
      line.qty += qty;
    } else {
      cart.push({ key: key, id: id, name: p.name, variation: variation || '', price: price || p.price, img: p.img, url: p.url, qty: qty });
    }
    persist();
  }

  var toastTimer;
  function toast(html) {
    var t = document.querySelector('.demo-toast');
    if (!t) {
      t = document.createElement('div');
      t.className = 'demo-toast';
      t.setAttribute('role', 'status');
      body.appendChild(t);
    }
    t.innerHTML = html;
    t.classList.add('is-shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('is-shown'); }, 3600);
  }

  function notice(container, html, type) {
    var old = container.querySelector(':scope > .demo-notice');
    if (old) old.remove();
    var d = document.createElement('div');
    d.className = 'demo-notice';
    d.innerHTML = type === 'error'
      ? '<ul class="woocommerce-error" role="alert">' + html + '</ul>'
      : '<div class="woocommerce-info">' + html + '</div>';
    container.insertBefore(d, container.firstChild);
    d.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ---------- demo ribbon + badges ---------- */
  var ribbon = document.createElement('div');
  ribbon.className = 'demo-ribbon';
  ribbon.textContent = 'Preview site — you can try the cart and checkout, but no real orders are placed.';
  body.insertBefore(ribbon, body.firstChild);
  persist();

  /* ---------- clicks ---------- */
  document.addEventListener('click', function (e) {
    var t = e.target;

    // Loop "Add to cart".
    var add = t.closest('a.add_to_cart_button[data-product_id]');
    if (add) {
      e.preventDefault();
      addToCart(add.getAttribute('data-product_id'), 1);
      add.classList.add('added');
      add.textContent = 'Added ✓';
      if (!add.parentNode.querySelector('.added_to_cart')) {
        add.insertAdjacentHTML('afterend', '<a href="/cart/" class="added_to_cart wc-forward">View cart</a>');
      }
      toast('Added to cart. <a href="/cart/">View cart</a>');
      return;
    }

    // Contact links are placeholders until the real numbers are added.
    var link = t.closest('a[href]');
    if (link) {
      var href = link.getAttribute('href');
      var telDigits = /^tel:/.test(href) ? href.replace(/\D+/g, '').length : 99;
      if (/wa\.me\/910000000000/.test(href) || telDigits < 10) {
        e.preventDefault();
        toast('Demo: your real WhatsApp / phone number will be connected here.');
        return;
      }
      if (/^upi:/.test(href)) {
        e.preventDefault();
        toast('Demo: on a phone this opens Google Pay / PhonePe / Paytm with the amount filled in.');
        return;
      }
    }

    // Checkout: coupon / login toggles.
    if (t.closest('.showcoupon')) {
      e.preventDefault();
      var cf = document.querySelector('form.checkout_coupon');
      if (cf) cf.style.display = cf.style.display === 'none' || !cf.style.display ? 'block' : 'none';
      return;
    }
    if (t.closest('.showlogin')) {
      e.preventDefault();
      var lf = document.querySelector('form.woocommerce-form-login');
      if (lf) lf.style.display = lf.style.display === 'none' || !lf.style.display ? 'block' : 'none';
      return;
    }

    // Product tabs.
    var tab = t.closest('.wc-tabs li a');
    if (tab) {
      e.preventDefault();
      showTab(tab.getAttribute('href'));
      return;
    }

    // Cart: remove line.
    var rm = t.closest('[data-demo-remove]');
    if (rm) {
      e.preventDefault();
      var k = rm.getAttribute('data-demo-remove');
      cart = cart.filter(function (i) { return i.key !== k; });
      persist();
      renderCart();
    }
  });

  /* ---------- forms ---------- */
  document.addEventListener('submit', function (e) {
    var f = e.target;

    // Header search -> filter the shop page.
    if (f.matches('form[role="search"]')) {
      e.preventDefault();
      var q = (f.querySelector('input[name="s"]') || {}).value || '';
      location.href = '/shop/?q=' + encodeURIComponent(q.trim());
      return;
    }

    // Single product add to cart / Order Now.
    if (f.matches('form.cart')) {
      e.preventDefault();
      var submitter = e.submitter || f.querySelector('.single_add_to_cart_button');
      var qty = Math.max(1, parseInt((f.querySelector('input.qty') || {}).value, 10) || 1);
      var id = f.getAttribute('data-product_id') || (submitter && submitter.value) || (f.querySelector('[name="add-to-cart"]') || {}).value;
      var variation = '';
      var price = null;
      if (f.matches('.variations_form')) {
        var picked = selectedVariation(f);
        if (!picked) {
          toast('Please choose an option first.');
          return;
        }
        variation = picked.label;
        price = picked.price;
      }
      addToCart(String(id), qty, variation, price);
      if (submitter && submitter.classList.contains('sohag-buy-now')) {
        location.href = '/checkout/';
      } else {
        toast('Added to cart. <a href="/cart/">View cart</a> · <a href="/checkout/">Checkout</a>');
      }
      return;
    }

    if (f.matches('form.checkout')) {
      e.preventDefault();
      placeOrder(f);
      return;
    }

    if (f.matches('form.woocommerce-ordering')) {
      e.preventDefault();
      return;
    }

    // Anything else that would need the server (login, register, coupon, reviews, cart update).
    e.preventDefault();
    toast('This works on the real WordPress site. In the preview it is switched off.');
  });

  /* ---------- variable products ---------- */
  function variationsOf(form) {
    try { return JSON.parse(form.getAttribute('data-product_variations') || '[]'); } catch (e) { return []; }
  }
  function selectedVariation(form) {
    var selects = form.querySelectorAll('table.variations select');
    var chosen = {};
    var labels = [];
    for (var i = 0; i < selects.length; i++) {
      if (!selects[i].value) return null;
      chosen[selects[i].name] = selects[i].value;
      labels.push(selects[i].value);
    }
    var match = variationsOf(form).filter(function (v) {
      return Object.keys(chosen).every(function (k) { return !v.attributes[k] || v.attributes[k] === chosen[k]; });
    })[0];
    if (!match) return null;
    return { label: labels.join(', '), price: match.display_price };
  }
  document.querySelectorAll('form.variations_form').forEach(function (form) {
    var out = form.querySelector('.single_variation');
    var reset = form.querySelector('.reset_variations');
    function update() {
      var v = selectedVariation(form);
      if (out) out.innerHTML = v ? '<div class="woocommerce-variation-price"><span class="price">' + money(v.price) + '</span></div>' : '';
      if (reset) reset.style.visibility = v ? 'visible' : 'hidden';
    }
    form.addEventListener('change', update);
    if (reset) {
      reset.addEventListener('click', function (e) {
        e.preventDefault();
        form.querySelectorAll('table.variations select').forEach(function (s) { s.value = ''; });
        update();
      });
    }
    update();
  });

  /* ---------- product tabs ---------- */
  function showTab(hash) {
    document.querySelectorAll('.wc-tabs li').forEach(function (li) {
      li.classList.toggle('active', li.querySelector('a').getAttribute('href') === hash);
    });
    document.querySelectorAll('.woocommerce-Tabs-panel').forEach(function (p) {
      p.style.display = '#' + p.id === hash ? '' : 'none';
    });
  }
  var firstTab = document.querySelector('.wc-tabs li a');
  if (firstTab) showTab(firstTab.getAttribute('href'));

  /* ---------- shop: search + sorting ---------- */
  var list = document.querySelector('ul.products');
  var params = new URLSearchParams(location.search);
  if (list && body.classList.contains('woocommerce-shop') || list && body.classList.contains('tax-product_cat')) {
    var items = Array.prototype.slice.call(list.children);
    var priceOf = function (li) {
      var btn = li.querySelector('[data-product_id]');
      var url = (li.querySelector('a.woocommerce-LoopProduct-link') || {}).getAttribute ? li.querySelector('a.woocommerce-LoopProduct-link').getAttribute('href') : '';
      if (btn && PRODUCTS[btn.getAttribute('data-product_id')]) return PRODUCTS[btn.getAttribute('data-product_id')].price;
      for (var id in PRODUCTS) { if (PRODUCTS[id].url === url) return PRODUCTS[id].price; }
      return 0;
    };
    var q = (params.get('q') || '').trim();
    if (q) {
      var needle = q.toLowerCase();
      var shown = 0;
      items.forEach(function (li) {
        var hit = li.textContent.toLowerCase().indexOf(needle) !== -1;
        li.style.display = hit ? '' : 'none';
        if (hit) shown++;
      });
      var h1 = document.querySelector('.page-hero h1');
      if (h1) h1.textContent = 'Results for “' + q + '”';
      var count = document.querySelector('.woocommerce-result-count');
      if (count) count.textContent = shown === 1 ? 'Showing the single result' : 'Showing all ' + shown + ' results';
      if (!shown) list.insertAdjacentHTML('beforebegin', '<div class="woocommerce-info">No products were found matching your search. <a href="/shop/">View all products</a></div>');
    }
    var sort = document.querySelector('.woocommerce-ordering select');
    if (sort) {
      sort.addEventListener('change', function () {
        var sorted = items.slice();
        if (sort.value === 'price') sorted.sort(function (a, b) { return priceOf(a) - priceOf(b); });
        if (sort.value === 'price-desc') sorted.sort(function (a, b) { return priceOf(b) - priceOf(a); });
        sorted.forEach(function (li) { list.appendChild(li); });
      });
    }
  }

  /* ---------- cart page ---------- */
  function renderCart() {
    var wrap = document.querySelector('.woocommerce-cart .content-area > .woocommerce');
    if (!wrap) return;
    if (!cart.length) {
      wrap.innerHTML = '<div class="wc-empty-cart-message"><div class="cart-empty woocommerce-info" role="status">Your cart is currently empty.</div></div>' +
        '<p class="return-to-shop"><a class="button wc-backward" href="/shop/">Return to shop</a></p>';
      return;
    }
    var rows = cart.map(function (i) {
      return '<tr class="woocommerce-cart-form__cart-item cart_item">' +
        '<td class="product-remove"><a href="#" class="remove" data-demo-remove="' + esc(i.key) + '" aria-label="Remove ' + esc(i.name) + ' from cart">&times;</a></td>' +
        '<td class="product-thumbnail"><a href="' + esc(i.url) + '"><img src="' + esc(i.img) + '" alt="" width="240" height="240"></a></td>' +
        '<td class="product-name" data-title="Product"><a href="' + esc(i.url) + '">' + esc(i.name) + '</a>' +
          (i.variation ? '<dl class="variation"><dt>Colour:</dt> <dd>' + esc(i.variation) + '</dd></dl>' : '') + '</td>' +
        '<td class="product-price" data-title="Price">' + money(i.price) + '</td>' +
        '<td class="product-quantity" data-title="Quantity"><div class="quantity"><label class="screen-reader-text" for="q-' + esc(i.key) + '">Quantity</label>' +
          '<input type="number" id="q-' + esc(i.key) + '" class="input-text qty text" min="0" step="1" value="' + i.qty + '" data-demo-qty="' + esc(i.key) + '" inputmode="numeric"></div></td>' +
        '<td class="product-subtotal" data-title="Subtotal">' + money(i.price * i.qty) + '</td></tr>';
    }).join('');
    wrap.innerHTML =
      '<form class="woocommerce-cart-form"><table class="shop_table shop_table_responsive cart woocommerce-cart-form__contents" cellspacing="0">' +
      '<thead><tr><th class="product-remove"><span class="screen-reader-text">Remove item</span></th><th class="product-thumbnail"><span class="screen-reader-text">Thumbnail image</span></th>' +
      '<th class="product-name">Product</th><th class="product-price">Price</th><th class="product-quantity">Quantity</th><th class="product-subtotal">Subtotal</th></tr></thead>' +
      '<tbody>' + rows + '</tbody></table></form>' +
      '<div class="cart-collaterals"><div class="cart_totals"><h2>Order Summary</h2><table cellspacing="0" class="shop_table shop_table_responsive">' +
      '<tr class="cart-subtotal"><th>Subtotal</th><td data-title="Subtotal">' + money(cartTotal()) + '</td></tr>' +
      '<tr class="woocommerce-shipping-totals shipping"><th>Delivery</th><td data-title="Delivery">Free Delivery</td></tr>' +
      '<tr class="order-total"><th>Total</th><td data-title="Total"><strong>' + money(cartTotal()) + '</strong></td></tr></table>' +
      '<div class="wc-proceed-to-checkout"><a href="/checkout/" class="checkout-button button alt wc-forward">Proceed to Checkout</a></div></div></div>';
  }
  document.addEventListener('change', function (e) {
    var k = e.target.getAttribute && e.target.getAttribute('data-demo-qty');
    if (!k) return;
    var qty = Math.max(0, parseInt(e.target.value, 10) || 0);
    cart = cart.map(function (i) { if (i.key === k) i.qty = qty; return i; }).filter(function (i) { return i.qty > 0; });
    persist();
    renderCart();
  });
  if (body.classList.contains('woocommerce-cart')) renderCart();

  /* ---------- checkout page ---------- */
  var checkoutForm = document.querySelector('form.checkout');
  function renderReview() {
    var table = document.querySelector('.woocommerce-checkout-review-order-table');
    if (!table) return;
    table.querySelector('tbody').innerHTML = cart.map(function (i) {
      return '<tr class="cart_item"><td class="product-name">' + esc(i.name) + (i.variation ? ' — ' + esc(i.variation) : '') +
        '&nbsp;<strong class="product-quantity">&times;&nbsp;' + i.qty + '</strong></td><td class="product-total">' + money(i.price * i.qty) + '</td></tr>';
    }).join('');
    table.querySelector('tfoot').innerHTML =
      '<tr class="cart-subtotal"><th>Subtotal</th><td>' + money(cartTotal()) + '</td></tr>' +
      '<tr class="woocommerce-shipping-totals shipping"><th>Delivery</th><td data-title="Delivery">Free Delivery</td></tr>' +
      '<tr class="order-total"><th>Total</th><td><strong>' + money(cartTotal()) + '</strong></td></tr>';
    // UPI box: amount + app link.
    var upiAmount = document.querySelector('.sohag-upi__row strong');
    if (upiAmount) upiAmount.innerHTML = money(cartTotal());
    var app = document.querySelector('.sohag-upi__app');
    if (app) app.setAttribute('href', app.getAttribute('href').replace(/am=[^&]*/, 'am=' + cartTotal().toFixed(2)));
  }
  function syncPaymentBoxes() {
    document.querySelectorAll('.wc_payment_method').forEach(function (li) {
      var input = li.querySelector('input[name="payment_method"]');
      var box = li.querySelector('.payment_box');
      if (box) box.style.display = input && input.checked ? 'block' : 'none';
    });
  }
  if (checkoutForm) {
    if (!cart.length) {
      checkoutForm.style.display = 'none';
      checkoutForm.insertAdjacentHTML('beforebegin', '<div class="woocommerce-info">Your cart is empty. <a href="/shop/">Browse products</a> and tap <strong>Order Now</strong> to try the checkout.</div>');
    }
    renderReview();
    syncPaymentBoxes();
    checkoutForm.addEventListener('change', function (e) {
      if (e.target.name === 'payment_method') syncPaymentBoxes();
    });
  }

  function val(form, name) {
    var el = form.querySelector('[name="' + name + '"]');
    return el ? String(el.value || '').trim() : '';
  }
  function markRow(form, name, ok) {
    var el = form.querySelector('[name="' + name + '"]');
    var row = el && el.closest('.form-row');
    if (row) {
      row.classList.toggle('woocommerce-invalid', !ok);
      row.classList.toggle('woocommerce-validated', ok);
    }
  }
  function placeOrder(form) {
    var errors = [];
    function need(name, label, test, msg) {
      var v = val(form, name);
      var ok = v !== '' && (!test || test(v));
      markRow(form, name, ok);
      if (!ok) errors.push(v === '' ? '<strong>' + label + '</strong> is a required field.' : msg);
    }
    var phoneDigits = function (v) {
      var d = v.replace(/\D+/g, '');
      if (d.length === 12 && d.indexOf('91') === 0) d = d.slice(2);
      if (d.length === 11 && d[0] === '0') d = d.slice(1);
      return d;
    };
    need('billing_first_name', 'Full name');
    need('billing_phone', 'Mobile number', function (v) { return /^[6-9]\d{9}$/.test(phoneDigits(v)); }, 'Please enter a valid 10-digit Indian mobile number.');
    need('billing_address_1', 'Address');
    need('billing_city', 'City / Town');
    need('billing_postcode', 'PIN code', function (v) { return /^[1-9]\d{5}$/.test(v.replace(/\s+/g, '')); }, 'Please enter a valid 6-digit PIN code.');
    need('billing_state', 'State');
    var email = val(form, 'billing_email');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      markRow(form, 'billing_email', false);
      errors.push('Please enter a valid email address.');
    }
    var method = form.querySelector('input[name="payment_method"]:checked');
    if (!method) errors.push('Please choose a payment method.');
    if (method && method.value === 'sohag_upi') {
      need('sohag_upi_utr', 'UTR / UPI reference number', function (v) { return /^[A-Z0-9]{10,22}$/i.test(v.replace(/\s+/g, '')); },
        'Please enter the UTR / UPI reference number from your payment (usually 12 digits).');
    }
    if (errors.length) {
      notice(form, errors.map(function (m) { return '<li>' + m + '</li>'; }).join(''), 'error');
      return;
    }
    var stateSel = form.querySelector('[name="billing_state"]');
    var stateName = stateSel && stateSel.options ? stateSel.options[stateSel.selectedIndex].text : val(form, 'billing_state');
    var methodLabel = method.closest('li').querySelector('label').textContent.trim();
    save(ORDER_KEY, {
      number: String(1000 + Math.floor(Math.random() * 9000)),
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }),
      items: cart,
      total: cartTotal(),
      method: method.value,
      methodLabel: methodLabel,
      address: [val(form, 'billing_first_name'), val(form, 'billing_address_1'), val(form, 'billing_address_2'),
        val(form, 'billing_city') + ' ' + val(form, 'billing_postcode'), stateName, 'India'].filter(Boolean),
      phone: phoneDigits(val(form, 'billing_phone')),
      email: email
    });
    cart = [];
    persist();
    location.href = '/order-received/';
  }

  /* ---------- order received ---------- */
  var orderBox = document.getElementById('demo-order');
  if (orderBox) {
    var o = load(ORDER_KEY, null);
    if (!o) {
      orderBox.innerHTML = '<div class="woocommerce-info">No order yet. <a href="/shop/">Browse products</a> and try the checkout.</div>';
    } else {
      orderBox.innerHTML =
        '<div class="woocommerce-order">' +
        '<ol class="checkout-steps"><li class="is-done"><span>1</span>Cart</li><li class="is-done"><span>2</span>Details &amp; Payment</li><li class="is-active"><span>3</span>Order Complete</li></ol>' +
        '<p class="woocommerce-notice woocommerce-notice--success woocommerce-thankyou-order-received">Thank you! We have received your order and will call you shortly to confirm it. ♥</p>' +
        '<ul class="woocommerce-order-overview woocommerce-thankyou-order-details order_details">' +
        '<li class="woocommerce-order-overview__order order">Order number: <strong>' + esc(o.number) + '</strong></li>' +
        '<li class="woocommerce-order-overview__date date">Date: <strong>' + esc(o.date) + '</strong></li>' +
        '<li class="woocommerce-order-overview__total total">Total: <strong>' + money(o.total) + '</strong></li>' +
        '<li class="woocommerce-order-overview__payment-method method">Payment method: <strong>' + esc(o.methodLabel) + '</strong></li></ul>' +
        (o.method === 'sohag_upi' ? '<p class="woocommerce-info">We will verify your UPI payment and confirm your order shortly.</p>' : '') +
        '<section class="woocommerce-order-details"><h2 class="woocommerce-order-details__title">Order details</h2>' +
        '<table class="woocommerce-table woocommerce-table--order-details shop_table order_details"><thead><tr><th class="product-name">Product</th><th class="product-total">Total</th></tr></thead><tbody>' +
        o.items.map(function (i) {
          return '<tr><td class="product-name">' + esc(i.name) + (i.variation ? ' — ' + esc(i.variation) : '') + ' <strong class="product-quantity">&times;&nbsp;' + i.qty + '</strong></td><td class="product-total">' + money(i.price * i.qty) + '</td></tr>';
        }).join('') +
        '</tbody><tfoot><tr><th>Subtotal:</th><td>' + money(o.total) + '</td></tr><tr><th>Delivery:</th><td>Free Delivery</td></tr>' +
        '<tr><th>Payment method:</th><td>' + esc(o.methodLabel) + '</td></tr><tr><th>Total:</th><td>' + money(o.total) + '</td></tr></tfoot></table></section>' +
        '<section class="woocommerce-customer-details"><h2 class="woocommerce-column__title">Delivery Address</h2><address>' +
        o.address.map(esc).join('<br>') + '<p class="woocommerce-customer-details--phone">' + esc(o.phone) + '</p>' +
        (o.email ? '<p class="woocommerce-customer-details--email">' + esc(o.email) + '</p>' : '') + '</address></section>' +
        '<p class="demo-footnote">This was a preview order — nothing was charged or sent. On the real site the order appears in WooCommerce → Orders.</p>' +
        '</div>';
    }
  }
})();
