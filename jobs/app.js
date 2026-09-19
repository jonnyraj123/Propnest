/* WorkAbroad Hub — site engine (3 languages) */
(function () {
  var D = window.WAH, A = D.agency;
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };

  /* ---------------- language ---------------- */
  var LKEY = 'wah_lang';
  var lang = (function () {
    try { var s = localStorage.getItem(LKEY); if (window.T[s]) return s; } catch (e) {}
    var n = (navigator.language || 'en').toLowerCase();
    if (n.indexOf('bn') === 0) return 'bn';
    if (n.indexOf('hi') === 0) return 'hi';
    return 'en';
  })();

  function t(path) {
    var v = window.T[lang];
    path.split('.').forEach(function (k) { v = (v == null) ? v : v[k]; });
    return (v == null) ? '' : v;
  }
  function loc(o) { return (o && (o[lang] || o.en)) || ''; }

  /* Bengali / Hindi digits where it reads naturally */
  var DIG = { bn:'০১২৩৪৫৬৭৮৯', hi:'0123456789', en:'0123456789' };
  function num(x) {
    var map = DIG[lang] || DIG.en;
    return String(x).replace(/[0-9]/g, function (d) { return map[+d]; });
  }

  /* ---------------- shared bits ---------------- */
  function contacts() {
    var tel = 'tel:' + A.phone.replace(/\s/g, '');
    var wa  = 'https://wa.me/' + A.whatsapp;
    var cp = $('#callpill');
    if (cp) { cp.href = tel; $('span', cp).textContent = t('call') + ' ' + A.phone.replace('+91 ', ''); }
    var fp = $('#ft-phone'); if (fp) { fp.textContent = '📞 ' + A.phone; fp.href = tel; }
    var fm = $('#ft-mail');  if (fm) { fm.textContent = '✉️ ' + A.email; fm.href = 'mailto:' + A.email; }
    var fc = $('#ft-city');  if (fc) fc.textContent = '📍 ' + loc(A.city);
    var fw = $('#ft-wa');    if (fw) fw.href = wa;
    var hw = $('#hero-wa');
    var greet = { en:'Hello, I want to know about work abroad.',
                  hi:'नमस्ते, मुझे विदेश में काम के बारे में जानना है।',
                  bn:'নমস্কার, আমি বিদেশে কাজের ব্যাপারে জানতে চাই।' }[lang];
    if (hw) hw.href = wa + '?text=' + encodeURIComponent(greet);
    var fab = $('#fab'); if (fab) fab.href = wa + '?text=' + encodeURIComponent(greet);
  }

  /* ---------------- render everything ---------------- */
  function paint() {
    document.body.setAttribute('data-lang', lang);
    document.documentElement.lang = lang;

    $$('[data-t]').forEach(function (el) { el.innerHTML = t(el.getAttribute('data-t')); });
    $$('[data-ph]').forEach(function (el) { el.placeholder = t(el.getAttribute('data-ph')); });
    $$('[data-lang-btn]').forEach(function (b) {
      b.classList.toggle('on', b.getAttribute('data-lang-btn') === lang);
    });

    contacts();
    home();
    applyPage();
  }

  function setLang(l) {
    if (!window.T[l] || l === lang) return;
    lang = l;
    try { localStorage.setItem(LKEY, l); } catch (e) {}
    paint();
  }
  $$('[data-lang-btn]').forEach(function (b) {
    b.addEventListener('click', function () { setLang(b.getAttribute('data-lang-btn')); });
  });

  /* ================= HOME ================= */
  function countryOptions() {
    return '<option value="">' + t('picker.pickC') + '</option>' + D.countries.map(function (c) {
      return '<option value="' + c.id + '">' + c.fl + '  ' + loc(c.n) + '</option>';
    }).join('');
  }
  function jobOptions() {
    return '<option value="">' + t('picker.pickJ') + '</option>' + D.jobs.map(function (j) {
      return '<option value="' + j.id + '">' + loc(j.n) + '</option>';
    }).join('');
  }
  function countryName(id) {
    var c = D.countries.filter(function (x) { return x.id === id; })[0];
    return c ? loc(c.n) : '';
  }
  function jobName(id) {
    var j = D.jobs.filter(function (x) { return x.id === id; })[0];
    return j ? loc(j.n) : '';
  }

  function home() {
    /* starfield */
    var st = $('#stars');
    if (st && !st.children.length) {
      var h = '';
      for (var i = 0; i < 70; i++) {
        h += '<i style="left:' + (Math.random() * 100).toFixed(2) + '%;top:' +
             (Math.random() * 100).toFixed(2) + '%;animation-delay:' +
             (Math.random() * 4).toFixed(2) + 's;opacity:' + (0.2 + Math.random() * 0.6).toFixed(2) + '"></i>';
      }
      st.innerHTML = h;
    }

    /* stats */
    var sw = $('#stats');
    if (sw) sw.innerHTML = t('stats').map(function (s) {
      return '<div><div class="n">' + s[0] + '</div><div class="l">' + s[1] + '</div></div>';
    }).join('');

    /* marquee */
    var tr = $('#track');
    if (tr) {
      var one = D.countries.filter(function (c) { return c.id !== 'any'; }).map(function (c) {
        return '<span>' + c.fl + ' ' + loc(c.n) + ' <b>' + c.code + '</b></span>';
      }).join('');
      tr.innerHTML = one + one;
    }

    /* process */
    var sp = $('#steps');
    if (sp) sp.innerHTML = t('process.s').map(function (s, i) {
      return '<div class="step"><div class="num">' + num(i + 1) + '</div>' +
             '<h3>' + s[0] + '</h3><p>' + s[1] + '</p></div>';
    }).join('');

    /* jobs */
    var jl = $('#joblist');
    if (jl) jl.innerHTML = D.jobs.map(function (j) {
      return '<a class="jb" href="apply.html?job=' + j.id + '">' +
        '<span class="ic">' + j.ic + '</span>' +
        '<span><span class="t">' + loc(j.n) + '</span><span class="s">' + loc(j.d) + '</span></span>' +
        '<span class="ar">›</span></a>';
    }).join('');

    /* countries */
    var cl = $('#countrylist');
    if (cl) cl.innerHTML = D.countries.map(function (c) {
      return '<a class="cy" href="apply.html?country=' + c.id + '">' +
        '<span class="top"><span class="fl">' + c.fl + '</span>' +
        '<span class="code">' + c.code + '</span></span>' +
        '<span class="nm">' + loc(c.n) + '</span>' +
        '<span class="mt">' + loc(c.d) + '</span></a>';
    }).join('');

    /* why us */
    var fw = $('#feats');
    if (fw) fw.innerHTML = t('why.c').map(function (c) {
      return '<div class="ft"><div class="bar"></div><h3>' + c[0] + '</h3><p>' + c[1] + '</p></div>';
    }).join('');

    /* fee list */
    var fl = $('#feelist');
    if (fl) fl.innerHTML = t('fee.p').map(function (p) {
      return '<li><b>' + p[0] + '</b> ' + p[1] + '</li>';
    }).join('');
    var fa = $('#feeAmt');
    if (fa) fa.firstChild.nodeValue = '₹' + num(A.fee);

    /* reviews */
    var rl = $('#revlist');
    if (rl) rl.innerHTML = t('rev.r').map(function (r) {
      return '<div class="rv-c"><div class="st">★★★★★</div><p>“' + r[0] + '”</p>' +
        '<div class="who"><span class="av">' + r[1].trim().charAt(0) + '</span>' +
        '<span><b>' + r[1] + '</b><span>' + r[2] + '</span></span></div></div>';
    }).join('');

    /* faq */
    var ql = $('#faqlist');
    if (ql) ql.innerHTML = t('faq.q').map(function (q, i) {
      return '<details' + (i === 0 ? ' open' : '') + '><summary>' + q[0] + '</summary>' +
        '<div class="ans">' + q[1] + '</div></details>';
    }).join('');

    /* picker */
    var hc = $('#hc-country'), hj = $('#hc-job');
    if (hc && hj) {
      var cv = hc.value, jv = hj.value;
      hc.innerHTML = countryOptions(); hj.innerHTML = jobOptions();
      hc.value = cv; hj.value = jv;
      if (!hc.dataset.wired) {
        hc.dataset.wired = '1';
        $('#hc-go').addEventListener('click', function () {
          var q = [];
          if (hc.value) q.push('country=' + hc.value);
          if (hj.value) q.push('job=' + hj.value);
          location.href = 'apply.html' + (q.length ? '?' + q.join('&') : '');
        });
      }
    }
  }

  /* header shadow + scroll reveal */
  var hdr = $('#hdr');
  if (hdr) window.addEventListener('scroll', function () {
    hdr.classList.toggle('stuck', window.scrollY > 8);
  }, { passive: true });

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    $$('.rv').forEach(function (el) { io.observe(el); });
  } else {
    $$('.rv').forEach(function (el) { el.classList.add('in'); });
  }

  /* ================= APPLICATION PAGE ================= */
  var rec = null;                       /* current receipt */
  var KEY = 'wah_receipt';
  function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function wipe() { try { localStorage.removeItem(KEY); } catch (e) {} }

  function applyPage() {
    var form = $('#applyform');
    if (!form) return;

    var sc = $('#f-country'), sj = $('#f-job'), se = $('#f-exp'), sp = $('#f-haspp');

    /* selects (keep current choice through a language switch) */
    var keep = [sc.value, sj.value, se.selectedIndex, sp.value];
    sc.innerHTML = countryOptions();
    sj.innerHTML = jobOptions();
    se.innerHTML = '<option value="">' + t('ap.expPick') + '</option>' +
      t('ap.expOpts').map(function (o, i) { return '<option value="' + (i + 1) + '">' + o + '</option>'; }).join('');
    sp.innerHTML = '<option value="yes">' + t('ap.ppYes') + '</option>' +
                   '<option value="no">' + t('ap.ppNo') + '</option>';
    sc.value = keep[0]; sj.value = keep[1];
    if (keep[2] > 0) se.selectedIndex = keep[2];
    sp.value = keep[3] || 'yes';

    /* preselect from the link */
    var p = new URLSearchParams(location.search);
    if (!keep[0] && p.get('country')) sc.value = p.get('country');
    if (!keep[1] && p.get('job')) sj.value = p.get('job');

    /* receipt static lists */
    var nx = $('#r-next');
    if (nx) nx.innerHTML = t('rc.next').map(function (s) { return '<li>' + s + '</li>'; }).join('');
    var sf = $('#r-safe');
    if (sf) sf.innerHTML = t('rc.safe').map(function (s) { return '<span>' + s + '</span>'; }).join('');
    var rf = $('#r-feelist');
    if (rf) rf.innerHTML = t('fee.p').map(function (x) {
      return '<li><b>' + x[0] + '</b> ' + x[1] + '</li>';
    }).join('');
    $('#f-lang').value = lang;

    if (form.dataset.wired) { if (rec) fillReceipt(rec); return; }
    form.dataset.wired = '1';

    /* passport toggle */
    sp.addEventListener('change', function () {
      var on = this.value === 'yes';
      $('#f-passport').disabled = !on;
      $('#f-passport').placeholder = on ? 'M1234567' : t('ap.ppPh2');
      if (!on) $('#f-passport').value = '';
    });

    /* validation */
    function bad(id, msg) {
      var f = $('#' + id).closest('.fld');
      f.classList.add('err');
      $('.emsg', f).textContent = msg;
      return false;
    }
    function check() {
      var ok = true;
      $$('.fld').forEach(function (f) { f.classList.remove('err'); });
      if (!sc.value) ok = bad('f-country', t('ap.err.country'));
      if (!sj.value) ok = bad('f-job', t('ap.err.job'));
      if ($('#f-name').value.trim().length < 3) ok = bad('f-name', t('ap.err.name'));
      if ($('#f-phone').value.replace(/\D/g, '').length < 10) ok = bad('f-phone', t('ap.err.phone'));
      var age = +$('#f-age').value;
      if (!age || age < 18 || age > 60) ok = bad('f-age', t('ap.err.age'));
      if (!se.value) ok = bad('f-exp', t('ap.err.exp'));
      var pp = $('#f-passport').value.trim();
      if (pp && !/^[A-Za-z][0-9]{7}$/.test(pp)) ok = bad('f-passport', t('ap.err.pp'));
      if (!pp && sp.value === 'yes') ok = bad('f-passport', t('ap.err.ppReq'));
      if (!$('#f-agree').checked) { alert(t('ap.err.agreeA')); ok = false; }
      if (!ok) { var e = $('.fld.err'); if (e) e.scrollIntoView({ block: 'center', behavior: 'smooth' }); }
      return ok;
    }

    function appNo() {
      var d = new Date();
      var s = String(d.getFullYear()).slice(2) +
        ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);
      return 'WAH-' + s + '-' + Math.floor(1000 + Math.random() * 9000);
    }

    $('#r-txn').addEventListener('input', function () { if (rec) $('#r-wa').href = waLink(rec); });

    $('#r-pay').addEventListener('click', function (e) {
      if (!A.payLink || A.payLink === '#') { e.preventDefault(); alert(t('rc.demoPay')); }
      setTimeout(function () { if (rec) unlock(rec); }, 600);
    });

    $('#r-print').addEventListener('click', function () { window.print(); });
    $('#r-new').addEventListener('click', function (e) {
      e.preventDefault(); wipe(); rec = null; location.href = 'apply.html';
    });

    /* submit */
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!check()) return;

      var btn = $('#f-submit');
      btn.disabled = true; btn.textContent = t('ap.submitting');

      var no = appNo();
      $('#f-appno').value = no;

      var d = new Date();
      rec = {
        no: no,
        nm: $('#f-name').value.trim(),
        ph: $('#f-phone').value.trim(),
        ci: sc.value,
        ji: sj.value,
        iso: d.toISOString(),
        paid: false,
        t: Date.now()
      };

      var fd = new FormData(form);
      fetch('/', { method: 'POST', body: fd })
        .then(function () {}).catch(function () {})
        .then(function () {
          save(rec); fillReceipt(rec);
          btn.disabled = false; btn.textContent = t('ap.submit');
        });
    });

    /* an earlier receipt (24 h) */
    var prev = load();
    if (prev && prev.t && (Date.now() - prev.t) < 864e5) { rec = prev; fillReceipt(rec); }
  }

  /* WhatsApp message */
  function waLink(r) {
    var m = t('rc.waMsg');
    var txn = ($('#r-txn') && $('#r-txn').value.trim()) || '';
    var d = new Date(r.iso);
    var msg = m.head + '\n\n' +
      m.no + ': ' + r.no + '\n' +
      m.name + ': ' + r.nm + '\n' +
      m.phone + ': ' + r.ph + '\n' +
      m.country + ': ' + countryName(r.ci) + '\n' +
      m.job + ': ' + jobName(r.ji) + '\n' +
      m.date + ': ' + fmtDate(d) + '\n\n' +
      m.paid + (txn ? '\n' + m.txn + ': ' + txn : '') + '\n\n' + m.end;
    return 'https://wa.me/' + A.whatsapp + '?text=' + encodeURIComponent(msg);
  }

  function fmtDate(d, withTime) {
    var s = num(d.getDate()) + '/' + num(d.getMonth() + 1) + '/' + num(d.getFullYear());
    if (withTime) s += ', ' + num(('0' + d.getHours()).slice(-2)) + ':' + num(('0' + d.getMinutes()).slice(-2));
    return s;
  }

  function unlock(r) {
    $('#ps1').classList.add('paid');
    $('#ps2').classList.remove('lock');
    $('#ps2').classList.add('done');
    $('#ps2-lock').textContent = t('rc.open');
    $('#r-wa').href = waLink(r);
    r.paid = true; save(r);
  }

  function fillReceipt(r) {
    var d = new Date(r.iso);
    $('#r-no').textContent = r.no;
    $('#r-name').textContent = r.nm;
    $('#r-phone').textContent = r.ph;
    $('#r-country').textContent = countryName(r.ci);
    $('#r-job').textContent = jobName(r.ji);
    $('#r-date').textContent = fmtDate(d, true);
    $('#r-date2').textContent = fmtDate(d);
    $('#r-ph2').textContent = A.phone;

    if (r.paid) unlock(r);
    else {
      $('#ps1').classList.remove('paid');
      $('#ps2').classList.add('lock');
      $('#ps2').classList.remove('done');
      $('#ps2-lock').textContent = t('rc.locked');
    }

    $('#formzone').style.display = 'none';
    $('#receipt').classList.add('on');
    $$('.prog div').forEach(function (x) { x.classList.add('on'); });
  }

  paint();
})();
