/* Memory cosmico - gioco a tempo che sblocca i download.
   Le carte sono in _data/memory.yml, le soglie di punteggio in _data/downloads.yml (campo "unlock"). */
(function () {
  var cfgEl = document.getElementById('memory-config');
  var board = document.getElementById('mem-board');
  if (!cfgEl || !board) return;
  var cfg = JSON.parse(cfgEl.textContent);
  var T = cfg.texts;
  var KEY = 'redshifted_memory_best';
  var memBest = 0;

  var elTime = document.getElementById('mem-time');
  var elErrors = document.getElementById('mem-errors');
  var elPairs = document.getElementById('mem-pairs');
  var elBest = document.getElementById('mem-best');
  var elResult = document.getElementById('mem-result');
  var btnStart = document.getElementById('mem-start');
  var btnReset = document.getElementById('mem-reset');

  function loadBest() {
    try { var v = parseInt(localStorage.getItem(KEY), 10); return isNaN(v) ? memBest : v; } catch (e) { return memBest; }
  }
  function saveBest(v) {
    memBest = v;
    try { localStorage.setItem(KEY, String(v)); } catch (e) {}
  }
  function fmt(s) {
    var m = Math.floor(s / 60), r = Math.floor(s % 60);
    return m + ':' + (r < 10 ? '0' : '') + r;
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }

  /* ---------- blocco / sblocco dei download ---------- */
  function applyLocks() {
    var best = loadBest();
    var sets = document.querySelectorAll('.download-set[data-unlock]');
    for (var i = 0; i < sets.length; i++) {
      var s = sets[i], need = parseInt(s.getAttribute('data-unlock'), 10);
      var badge = s.querySelector('[data-lock-badge]');
      var open = best >= need;
      s.classList.toggle('locked', !open);
      var btns = s.querySelectorAll('.btn[data-href]');
      for (var k = 0; k < btns.length; k++) {
        var b = btns[k];
        if (open) {
          b.setAttribute('href', b.getAttribute('data-href'));
          b.setAttribute('download', '');
          b.removeAttribute('aria-disabled');
          b.classList.remove('btn-locked');
        } else {
          b.removeAttribute('href');
          b.removeAttribute('download');
          b.setAttribute('aria-disabled', 'true');
          b.classList.add('btn-locked');
        }
      }
      if (badge) {
        badge.innerHTML = open
          ? '<i class="fas fa-lock-open" aria-hidden="true"></i> ' + esc(T.lockOpen)
          : '<i class="fas fa-lock" aria-hidden="true"></i> ' + esc(T.lockLabel.replace('{n}', need)) +
            (best > 0 ? ' &middot; ' + esc(T.lockMissing.replace('{n}', need - best)) : '');
      }
    }
    elBest.textContent = best;
  }

  /* ---------- partita ---------- */
  var state = null;

  function colsFor(n) { return n <= 12 ? 4 : (n <= 20 ? 5 : 6); }

  function newBoard(active) {
    var pool = shuffle(cfg.cards.slice()).slice(0, Math.min(cfg.pairs, cfg.cards.length));
    var tiles = [];
    pool.forEach(function (c) { tiles.push(c); tiles.push(c); });
    shuffle(tiles);
    board.innerHTML = '';
    board.style.setProperty('--cols', colsFor(tiles.length));
    board.classList.toggle('is-idle', !active);
    var items = tiles.map(function (c, idx) {
      var b = el('button', 'mem-card');
      b.type = 'button';
      b.setAttribute('aria-label', T.card + ' ' + (idx + 1));
      b.innerHTML = '<span class="mem-inner"><span class="mem-face mem-back"></span>' +
        '<span class="mem-face mem-front"><img src="' + c.image + '" alt="" draggable="false"></span></span>';
      b.disabled = !active;
      board.appendChild(b);
      return { id: c.id, name: c.name, node: b, flipped: false, matched: false };
    });
    return { items: items, pairs: pool.length, found: 0, errors: 0, first: null, busy: false,
             started: false, t0: 0, timer: null, finished: false };
  }

  function tick() {
    if (state && state.started && !state.finished) elTime.textContent = fmt((Date.now() - state.t0) / 1000);
  }

  function score(n, errors, secs) {
    var acc = n / (n + errors);
    var fast = 3 * n, slow = 15 * n;
    var speed = Math.max(0, Math.min(1, (slow - secs) / (slow - fast)));
    return Math.round(1000 * (0.5 * acc + 0.5 * speed));
  }

  function updateHud() {
    elErrors.textContent = state ? state.errors : 0;
    elPairs.textContent = state ? state.found + '/' + state.pairs : '0/0';
  }

  function start() {
    if (state && state.timer) clearInterval(state.timer);
    elResult.hidden = true; elResult.innerHTML = '';
    state = newBoard(true);
    elTime.textContent = '0:00';
    updateHud();
    btnStart.querySelector('span').textContent = T.restart;
    board.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function flip(it, up) {
    it.flipped = up;
    it.node.classList.toggle('flipped', up);
  }

  function onCard(it) {
    if (!state || state.busy || state.finished || it.flipped || it.matched) return;
    if (!state.started) {
      state.started = true; state.t0 = Date.now();
      state.timer = setInterval(tick, 200);
    }
    flip(it, true);
    if (!state.first) { state.first = it; return; }
    var a = state.first, b = it;
    state.first = null;
    if (a.id === b.id) {
      a.matched = b.matched = true;
      a.node.classList.add('matched'); b.node.classList.add('matched');
      a.node.disabled = b.node.disabled = true;
      state.found++;
      updateHud();
      if (state.found === state.pairs) finish();
    } else {
      state.errors++; state.busy = true; updateHud();
      setTimeout(function () { flip(a, false); flip(b, false); state.busy = false; }, 850);
    }
  }

  function finish() {
    state.finished = true;
    clearInterval(state.timer);
    var secs = (Date.now() - state.t0) / 1000;
    elTime.textContent = fmt(secs);
    var sc = score(state.pairs, state.errors, secs);
    var prev = loadBest();
    var isRecord = sc > prev;
    if (isRecord) saveBest(sc);
    var now = loadBest();
    var fresh = cfg.rewards.filter(function (r) { return r.unlock > prev && r.unlock <= now; });
    var allOpen = cfg.rewards.every(function (r) { return r.unlock <= now; });
    var html = '<h3>' + esc(T.over) + '</h3>' +
      '<p class="mem-score"><small>' + esc(T.score) + '</small><b>' + sc + '</b></p>' +
      '<p class="mem-meta">' + esc(T.time) + ': <b>' + fmt(secs) + '</b> &middot; ' + esc(T.errors) + ': <b>' + state.errors + '</b>' +
      (isRecord ? ' &middot; <span class="mem-record">' + esc(T.newRecord) + '</span>' : ' &middot; ' + esc(T.best) + ': <b>' + now + '</b>') + '</p>';
    if (fresh.length) {
      html += '<p class="mem-unlocked">' + esc(T.unlocked) + '</p><ul>' +
        fresh.map(function (r) { return '<li><i class="fas fa-lock-open" aria-hidden="true"></i> ' + esc(r.title) + '</li>'; }).join('') + '</ul>';
    } else if (allOpen) {
      html += '<p class="mem-unlocked">' + esc(T.allUnlocked) + '</p>';
    } else {
      html += '<p class="mem-unlocked">' + esc(T.nothing) + '</p>';
    }
    html += '<p><a class="btn btn-primary" href="#downloads-list"><i class="fas fa-download" aria-hidden="true"></i> ' + esc(T.goto) + '</a></p>';
    elResult.innerHTML = html;
    elResult.hidden = false;
    applyLocks();
    elResult.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  board.addEventListener('click', function (e) {
    var node = e.target.closest ? e.target.closest('.mem-card') : null;
    if (!node || !state) return;
    for (var i = 0; i < state.items.length; i++) {
      if (state.items[i].node === node) { onCard(state.items[i]); return; }
    }
  });
  btnStart.addEventListener('click', start);

  var resetArmed = false, resetTimer = null;
  btnReset.addEventListener('click', function () {
    if (!resetArmed) {
      resetArmed = true; btnReset.textContent = T.resetSure;
      resetTimer = setTimeout(function () { resetArmed = false; btnReset.textContent = T.reset; }, 3500);
      return;
    }
    clearTimeout(resetTimer); resetArmed = false; btnReset.textContent = T.reset;
    saveBest(0); applyLocks();
  });

  memBest = loadBest();
  state = newBoard(false);   /* tavolo coperto in attesa di "Inizia" */
  updateHud();
  applyLocks();
})();
