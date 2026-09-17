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

      if ($('#f-exp').value === '') ok = bad('f-exp', 'অভিজ্ঞতা বাছুন');

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

    /* রসিদ দেখানো */
    function receipt(no) {
      var d = new Date();
      var day = bn(d.getDate()) + '/' + bn(d.getMonth() + 1) + '/' + bn(d.getFullYear());
      var dt = day + ', ' + bn(('0' + d.getHours()).slice(-2)) + ':' + bn(('0' + d.getMinutes()).slice(-2));
      var nm = $('#f-name').value.trim();
      var ph = $('#f-phone').value.trim();
      var cy = countryName(sc.value);
      var jb = jobName(sj.value);

      $('#r-no').textContent = no;
      $('#r-name').textContent = nm;
      $('#r-phone').textContent = ph;
      $('#r-country').textContent = cy;
      $('#r-job').textContent = jb;
      $('#r-date').textContent = dt;
      $('#r-date2').textContent = day;
      $('#r-ph2').textContent = A.phone;

      /* WhatsApp-এ রসিদ পাঠানোর লিঙ্ক */
      var msg = '*WorkAbroad Hub — আবেদন রসিদ*\n\n' +
        'আবেদন নম্বর: ' + no + '\n' +
        'নাম: ' + nm + '\n' +
        'মোবাইল: ' + ph + '\n' +
        'দেশ: ' + cy + '\n' +
        'কাজ: ' + jb + '\n' +
        'তারিখ: ' + dt + '\n\n' +
        'আমার আবেদনটি জমা দিয়েছি। পরের ধাপ জানাবেন।';
      $('#r-wa').href = 'https://wa.me/' + A.whatsapp + '?text=' + encodeURIComponent(msg);

      /* পেমেন্ট লিঙ্ক */
      var pay = $('#r-pay');
      if (A.payLink && A.payLink !== '#') pay.href = A.payLink;
      else pay.addEventListener('click', function (e) {
        e.preventDefault(); alert('ডেমো — এখানে SuperProfile-এর ₹৫০০ পেমেন্ট লিঙ্ক বসবে।');
      });

      $('#formzone').style.display = 'none';
      $('#receipt').classList.add('on');
      $$('.prog div').forEach(function (d) { d.classList.add('on'); });
      window.scrollTo(0, 0);
    }

    /* জমা */
    form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      if (!check()) return;

      var btn = $('#f-submit');
      btn.disabled = true; btn.textContent = 'জমা হচ্ছে…';

      var no = appNo();
      $('#f-appno').value = no;

      var fd = new FormData(form);
      fetch('/', { method: 'POST', body: fd })
        .then(function () { receipt(no); })
        .catch(function () { receipt(no); })   /* ডেমোতে সার্ভার নেই — রসিদ দেখানো হবে */
        .then(function () { btn.disabled = false; btn.textContent = 'আবেদন জমা দিন'; });
    });

    $('#r-print').addEventListener('click', function () { window.print(); });
  }

  fill(); home(); apply();
})();
