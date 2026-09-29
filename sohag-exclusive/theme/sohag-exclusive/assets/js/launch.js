/* Sohag Exclusive — Grand Opening curtain + ribbon-cutting ceremony. No dependencies. */
(function () {
  'use strict';

  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Gold dust ---------- */
  function dust(stage) {
    var canvas = stage.querySelector('.go-dust');
    if (!canvas || !canvas.getContext || reduced) return null;
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var w = 0, h = 0, parts = [], bursts = [], running = true;

    function size() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    function spawn(initial) {
      return {
        x: Math.random() * w,
        y: initial ? Math.random() * h : h + 10,
        r: 0.6 + Math.random() * 1.8,
        vy: 0.15 + Math.random() * 0.45,
        vx: (Math.random() - 0.5) * 0.25,
        a: 0.25 + Math.random() * 0.6,
        tw: Math.random() * Math.PI * 2
      };
    }
    size();
    var count = Math.round(Math.min(90, Math.max(35, w / 14)));
    for (var i = 0; i < count; i++) parts.push(spawn(true));
    window.addEventListener('resize', size);

    function frame() {
      if (!running) return;
      ctx.clearRect(0, 0, w, h);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y -= p.vy; p.x += p.vx; p.tw += 0.04;
        if (p.y < -10) parts[i] = spawn(false);
        var alpha = p.a * (0.6 + 0.4 * Math.sin(p.tw));
        ctx.beginPath();
        ctx.fillStyle = 'rgba(246, 214, 140,' + alpha.toFixed(3) + ')';
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      for (var j = bursts.length - 1; j >= 0; j--) {
        var b = bursts[j];
        b.vy += 0.18; b.x += b.vx; b.y += b.vy; b.rot += b.vr; b.life -= 1;
        if (b.life <= 0) { bursts.splice(j, 1); continue; }
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.globalAlpha = Math.min(1, b.life / 40);
        ctx.fillStyle = b.c;
        ctx.fillRect(-b.s / 2, -b.s / 4, b.s, b.s / 2);
        ctx.restore();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    return {
      burst: function (x, y) {
        var colours = ['#f6dfa4', '#e2b45a', '#ffffff', '#e8425c', '#c01d37', '#fff1c1'];
        for (var k = 0; k < 140; k++) {
          var ang = Math.random() * Math.PI * 2, sp = 3 + Math.random() * 7;
          bursts.push({ x: x, y: y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp - 4, s: 5 + Math.random() * 7, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4, life: 70 + Math.random() * 50, c: colours[k % colours.length] });
        }
      },
      stop: function () { running = false; }
    };
  }

  /* ---------- Curtain page: countdown ---------- */
  var curtain = document.querySelector('.go-stage--curtain');
  if (curtain) {
    dust(curtain);
    var target = parseInt(curtain.getAttribute('data-opening'), 10);
    var box = curtain.querySelector('.go-count');
    var soon = curtain.querySelector('.go-soon');
    if (target && box) {
      var cells = {};
      box.querySelectorAll('[data-u]').forEach(function (el) { cells[el.getAttribute('data-u')] = el; });
      var pad = function (n) { return (n < 10 ? '0' : '') + n; };
      var tick = function () {
        var left = Math.max(0, target - Date.now());
        if (left <= 0) {
          box.hidden = true;
          if (soon) { soon.hidden = false; soon.textContent = 'Opening any moment now…'; }
          return;
        }
        var s = Math.floor(left / 1000);
        cells.d.textContent = pad(Math.floor(s / 86400));
        cells.h.textContent = pad(Math.floor((s % 86400) / 3600));
        cells.m.textContent = pad(Math.floor((s % 3600) / 60));
        cells.s.textContent = pad(s % 60);
        setTimeout(tick, 1000 - (Date.now() % 1000));
      };
      tick();
    }
  }

  /* ---------- Ceremony: scissors → snip → ribbon falls → curtains open → "We're Open!" ---------- */
  var stage = document.getElementById('sohag-ceremony');
  if (stage) {
    var fx = dust(stage);
    var timers = [];
    var finished = false;
    var at = function (ms, fn) { timers.push(setTimeout(fn, ms)); };
    var finish = function () {
      if (finished) return;
      finished = true;
      timers.forEach(clearTimeout);
      try { localStorage.setItem('sohag_ribbon_cut_seen', '1'); } catch (e) { /* private mode: show again next time */ }
      stage.classList.add('is-done');
      document.documentElement.classList.remove('go-lock');
      setTimeout(function () {
        if (fx) fx.stop();
        if (stage.parentNode) stage.parentNode.removeChild(stage);
      }, 850);
    };

    stage.querySelector('[data-go-skip]').addEventListener('click', finish);
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') finish(); });

    if (reduced) {
      stage.classList.add('is-cut', 'is-open', 'is-cheer');
      at(1600, finish);
    } else {
      at(500, function () { stage.classList.add('is-aim'); });
      at(1550, function () { stage.classList.add('is-snip'); });
      at(1800, function () {
        stage.classList.add('is-cut');
        if (fx) {
          var r = stage.querySelector('.go-ribbon').getBoundingClientRect();
          fx.burst(window.innerWidth / 2, r.top + r.height / 2);
        }
      });
      // "We're Open!" appears in front of the closed curtains, then fades as they part.
      at(2000, function () { stage.classList.add('is-cheer'); });
      at(3300, function () { stage.classList.remove('is-cheer'); stage.classList.add('is-open'); });
      at(4700, finish);
    }
  }
})();
