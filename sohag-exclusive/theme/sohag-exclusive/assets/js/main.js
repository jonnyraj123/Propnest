/* Sohag Exclusive — small, dependency-free interactions. */
(function () {
  'use strict';

  var drawer = document.getElementById('sohag-drawer');
  var opener = document.querySelector('[data-drawer-open]');

  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle('is-open', open);
    drawer.setAttribute('aria-hidden', open ? 'false' : 'true');
    if (opener) opener.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.documentElement.style.overflow = open ? 'hidden' : '';
    if (open) {
      var first = drawer.querySelector('a, button');
      if (first) first.focus();
    } else if (opener) {
      opener.focus();
    }
  }

  document.addEventListener('click', function (e) {
    var t = e.target;

    if (t.closest('[data-drawer-open]')) { setDrawer(true); return; }
    if (t.closest('[data-drawer-close]')) { setDrawer(false); return; }

    var searchBtn = t.closest('[data-search-toggle]');
    if (searchBtn) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      var box = document.getElementById('sohag-search');
      var open = box.classList.toggle('is-open');
      searchBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
      if (open) box.querySelector('input[type="search"]').focus();
      return;
    }

    // Mobile banking gateway: copy number.
    var copy = t.closest('[data-mpay-copy]');
    if (copy) {
      var num = copy.parentNode.querySelector('[data-mpay-number]');
      if (num && navigator.clipboard) {
        navigator.clipboard.writeText(num.textContent.trim()).then(function () {
          var old = copy.textContent;
          copy.textContent = '✓';
          setTimeout(function () { copy.textContent = old; }, 1400);
        });
      }
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('is-open')) setDrawer(false);
  });

  // Mobile banking gateway: switch displayed number with the chosen provider.
  // Checkout HTML is re-rendered by AJAX, so listen on document.
  document.addEventListener('change', function (e) {
    var r = e.target;
    if (!r.matches || !r.matches('input[name="sohag_mpay_method"]')) return;
    var wrap = r.closest('.sohag-mpay');
    if (!wrap) return;
    wrap.querySelector('[data-mpay-number]').textContent = r.getAttribute('data-number');
    wrap.querySelector('[data-mpay-label]').textContent = r.getAttribute('data-label');
  });
})();
