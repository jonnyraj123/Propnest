/* WorkAbroad Hub — সাইটের স্ক্রিপ্ট */
(function () {
  var S = window.SETU, A = S.agency;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* বাংলা সংখ্যা */
  var BN = '০১২৩৪৫৬৭৮৯';
  function bn(x) { return String(x).replace(/[0-9]/g, function (d) { return BN[+d]; }); }

  /* ---------- এজেন্সির তথ্য সব পাতায় বসানো ---------- */
  function fill() {
    var tel = 'tel:' + A.phone.replace(/\s/g, '');
    var wa = 'https://wa.me/' + A.whatsapp;
    [['#tb-phone', A.phone]].forEach(function (p) {
      var el = $(p[0]); if (el) el.textContent = p[1];
    });
    var fp = $('#ft-phone'); if (fp) { fp.textContent = '📞 ' + A.phone; fp.href = tel; }
    var fw = $('#ft-wa'); if (fw) fw.href = wa;
    var hw = $('#hero-wa');
    if (hw) hw.href = wa + '?text=' + encodeURIComponent('নমস্কার, আমি বিদেশে কাজের ব্যাপারে জানতে চাই।');
    var fm = $('#ft-mail'); if (fm) { fm.textContent = '✉️ ' + A.email; fm.href = 'mailto:' + A.email; }
    var tm = $('#tb-mail'); if (tm) tm.textContent = A.email;
  }

  /* ---------- সব দেশ ও কাজ এক তালিকায় ---------- */
  function allCountries() {
    var out = [];
    S.regions.forEach(function (r) { r.countries.forEach(function (c) { out.push(c); }); });
    return out;
  }
  function countryName(id) {
    var c = allCountries().filter(function (x) { return x.id === id; })[0];
    return c ? c.name : '';
  }
  function jobName(id) {
    var j = S.jobs.filter(function (x) { return x.id === id; })[0];
    return j ? j.t : '';
  }

  /* ---------- হোম পেজ ---------- */
  function home() {
    /* কাজের তালিকা */
    var jl = $('#joblist');
    if (jl) {
      jl.innerHTML = S.jobs.map(function (j) {
        return '<a class="jb" href="apply.html?job=' + j.id + '">' +
          '<span class="ic">' + j.ic + '</span>' +
          '<span><span class="t">' + j.t + '</span><br><span class="s">' + j.s + '</span></span>' +
          '<span class="ar">›</span></a>';
      }).join('');
    }

    /* দেশের তালিকা */
    var cl = $('#countrylist');
    if (cl) {
      cl.innerHTML = S.regions.map(function (r) {
        return '<div class="regionlbl">' + r.name + '</div><div class="countries">' +
          r.countries.map(function (c) {
            return '<a class="cy" href="apply.html?country=' + c.id + '">' +
              '<span class="fl">' + c.fl + '</span>' +
              '<span><span class="nm">' + c.name + '</span><br><span class="mt">' + c.note + '</span></span></a>';
          }).join('') + '</div>';
      }).join('');
    }

    /* হিরো কার্ডের ড্রপডাউন */
    var hc = $('#hc-country'), hj = $('#hc-job');
    if (hc && hj) {
      hc.innerHTML = '<option value="">— দেশ বাছুন —</option>' + S.regions.map(function (r) {
        return '<optgroup label="' + r.name + '">' + r.countries.map(function (c) {
          return '<option value="' + c.id + '">' + c.fl + ' ' + c.name + '</option>';
        }).join('') + '</optgroup>';
      }).join('');
      hj.innerHTML = '<option value="">— কাজ বাছুন —</option>' + S.jobs.map(function (j) {
        return '<option value="' + j.id + '">' + j.t + '</option>';
      }).join('');
      $('#hc-go').addEventListener('click', function () {
        var q = [];
        if (hc.value) q.push('country=' + hc.value);
        if (hj.value) q.push('job=' + hj.value);
        location.href = 'apply.html' + (q.length ? '?' + q.join('&') : '');
      });
    }
  }

  /* ---------- আবেদন পাতা ---------- */
  function apply() {
    var form = $('#applyform');
    if (!form) return;

    /* ড্রপডাউন ভরা */
    var sc = $('#f-country'), sj = $('#f-job');
    sc.innerHTML = '<option value="">— দেশ বাছুন —</option>' + S.regions.map(function (r) {
      return '<optgroup label="' + r.name + '">' + r.countries.map(function (c) {
        return '<option value="' + c.id + '">' + c.fl + ' ' + c.name + '</option>';
      }).join('') + '</optgroup>';
    }).join('');
    sj.innerHTML = '<option value="">— কাজ বাছুন —</option>' + S.jobs.map(function (j) {
      return '<option value="' + j.id + '">' + j.t + '</option>';
    }).join('');

    /* লিঙ্ক থেকে আগে বাছা দেশ/কাজ বসানো */
    var p = new URLSearchParams(location.search);
    if (p.get('country')) sc.value = p.get('country');
    if (p.get('job')) sj.value = p.get('job');

    /* যাচাই */
    function bad(id, msg) {
      var f = $('#' + id).closest('.fld');
      f.classList.add('err');
      if (msg) $('.emsg', f).textContent = msg;
      return false;
    }
    function check() {
      var ok = true;
      $$('.fld').forEach(function (f) { f.classList.remove('err'); });

      if (!sc.value) ok = bad('f-country', 'দেশ বেছে নিন');
      if (!sj.value) ok = bad('f-job', 'কাজ বেছে নিন');
      if ($('#f-name').value.trim().length < 3) ok = bad('f-name', 'পুরো নাম লিখুন');

      var ph = $('#f-phone').value.replace(/\D/g, '');
      if (ph.length < 10) ok = bad('f-phone', '১০ সংখ্যার মোবাইল নম্বর লিখুন');

      if (!$('#f-age').value || +$('#f-age').value < 18 || +$('#f-age').value > 60)
        ok = bad('f-age', 'বয়স ১৮ থেকে ৬০-এর মধ্যে হতে হবে');

      if ($('#f-exp').value === '') ok = bad('f-exp', 'এক্সপেরিয়েন্স বাছুন');

      var pp = $('#f-passport').value.trim();
      if (pp && !/^[A-Za-z][0-9]{7}$/.test(pp))
        ok = bad('f-passport', 'পাসপোর্ট নম্বর এরকম হয় — একটি অক্ষর ও ৭টি সংখ্যা (যেমন M1234567)');
      if (!pp && $('#f-haspp').value === 'ho')
        ok = bad('f-passport', 'পাসপোর্ট নম্বর লিখুন');

      if (!$('#f-agree').checked) { alert('শর্তে সম্মতি দিতে হবে।'); ok = false; }

      if (!ok) { var e = $('.fld.err'); if (e) e.scrollIntoView({ block: 'center' }); }
      return ok;
    }

    /* পাসপোর্ট আছে/নেই */
    $('#f-haspp').addEventListener('change', function () {
      var on = this.value === 'ho';
      $('#f-passport').disabled = !on;
      $('#f-passport').placeholder = on ? 'M1234567' : 'পাসপোর্ট হলে পরে দেবেন';
      if (!on) $('#f-passport').value = '';
    });

    /* আবেদন নম্বর */
    function appNo() {
      var d = new Date();
      var s = String(d.getFullYear()).slice(2) +
        ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);
      var r = String(Math.floor(1000 + Math.random() * 9000));
      return 'WAH-' + s + '-' + r;
    }

    /* ব্রাউজারে রসিদ জমা রাখা — ফি দিয়ে ফিরে এলেও যেন হারিয়ে না যায় */
    var KEY = 'wah_receipt';
    function save(o) { try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {} }
    function load() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
    function wipe() { try { localStorage.removeItem(KEY); } catch (e) {} }

    /* WhatsApp-এ যে মেসেজটা তৈরি হবে */
    function waLink(r) {
      var txn = $('#r-txn').value.trim();
      var msg = '*WorkAbroad Hub — আবেদন রসিদ*\n\n' +
        'আবেদন নম্বর: ' + r.no + '\n' +
        'নাম: ' + r.nm + '\n' +
        'মোবাইল: ' + r.ph + '\n' +
        'দেশ: ' + r.cy + '\n' +
        'কাজ: ' + r.jb + '\n' +
        'তারিখ: ' + r.dt + '\n\n' +
        '✅ ₹৫০০ প্রসেসিং ফি জমা দিয়েছি।' +
        (txn ? '\nTransaction / UTR: ' + txn : '') +
        '\n\nপরের ধাপ জানাবেন।';
      return 'https://wa.me/' + A.whatsapp + '?text=' + encodeURIComponent(msg);
    }

    /* ২য় ধাপ খুলে দেওয়া */
    function unlock(r) {
      $('#ps1').classList.add('paid');
      $('#ps2').classList.remove('lock');
      $('#ps2').classList.add('done');
      $('#ps2-lock').textContent = '✓ খোলা';
      $('#r-wa').href = waLink(r);
      r.paid = true; save(r);
    }

    /* রসিদ দেখানো */
    function receipt(r) {
      $('#r-no').textContent = r.no;
      $('#r-name').textContent = r.nm;
      $('#r-phone').textContent = r.ph;
      $('#r-country').textContent = r.cy;
      $('#r-job').textContent = r.jb;
      $('#r-date').textContent = r.dt;
      $('#r-date2').textContent = r.day;
      $('#r-ph2').textContent = A.phone;

      var pay = $('#r-pay');
      if (A.payLink && A.payLink !== '#') pay.href = A.payLink;
      pay.addEventListener('click', function (e) {
        if (!A.payLink || A.payLink === '#') {
          e.preventDefault();
          alert('ডেমো — এখানে SuperProfile-এর ₹৫০০ পেজ খুলবে।');
        }
        setTimeout(function () { unlock(r); }, 600);
      });

      $('#r-txn').addEventListener('input', function () { $('#r-wa').href = waLink(r); });

      if (r.paid) unlock(r);

      $('#formzone').style.display = 'none';
      $('#receipt').classList.add('on');
      $$('.prog div').forEach(function (d) { d.classList.add('on'); });
      window.scrollTo(0, 0);
    }

    /* নতুন আবেদন */
    $('#r-new').addEventListener('click', function (e) {
      e.preventDefault(); wipe(); location.href = 'apply.html';
    });

    /* আগের রসিদ থাকলে সেটাই দেখাও (২৪ ঘণ্টা) */
    var prev = load();
    if (prev && prev.t && (Date.now() - prev.t) < 864e5) receipt(prev);

    /* জমা */
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!check()) return;

      var btn = $('#f-submit');
      btn.disabled = true; btn.textContent = 'জমা হচ্ছে…';

      var no = appNo();
      $('#f-appno').value = no;

      var d = new Date();
      var day = bn(d.getDate()) + '/' + bn(d.getMonth() + 1) + '/' + bn(d.getFullYear());
      var rec = {
        no: no,
        nm: $('#f-name').value.trim(),
        ph: $('#f-phone').value.trim(),
        cy: countryName(sc.value),
        jb: jobName(sj.value),
        day: day,
        dt: day + ', ' + bn(('0' + d.getHours()).slice(-2)) + ':' + bn(('0' + d.getMinutes()).slice(-2)),
        paid: false,
        t: Date.now()
      };

      var fd = new FormData(form);
      fetch('/', { method: 'POST', body: fd })
        .then(function () {})
        .catch(function () {})   /* ডেমোতে সার্ভার নেই */
        .then(function () {
          save(rec); receipt(rec);
          btn.disabled = false; btn.textContent = 'আবেদন জমা দিন';
        });
    });

    $('#r-print').addEventListener('click', function () { window.print(); });
  }

  fill(); home(); apply();
})();
