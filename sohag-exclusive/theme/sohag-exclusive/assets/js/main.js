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

    // UPI gateway: copy the UPI ID.
    var copy = t.closest('[data-upi-copy]');
    if (copy) {
      var num = copy.parentNode.querySelector('[data-upi-id]');
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

  // Scroll reveal: sections drift up into view once. Without IntersectionObserver everything simply shows.
  var reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  }

})();
