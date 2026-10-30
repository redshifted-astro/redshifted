/* Redshifted - piccoli script del sito: lingua preferita, "torna su", ricerca e tag */
(function () {
  'use strict';

  // Ricorda la lingua scelta (usata dall'indirizzo principale del sito per reindirizzare)
  var langLinks = document.querySelectorAll('.lang-switch a[data-lang]');
  for (var i = 0; i < langLinks.length; i++) {
    langLinks[i].addEventListener('click', function () {
      try { localStorage.setItem('redshifted-lang', this.getAttribute('data-lang')); } catch (e) {}
    });
  }

  // Pulsante "torna su": compare solo dopo aver scorso un po' la pagina
  var up = document.getElementById('scroll-up');
  if (up) {
    var showUp = function () { up.classList.toggle('visible', window.scrollY > 300); };
    window.addEventListener('scroll', showUp, { passive: true });
    showUp();
    up.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // Carosello della Home: frecce, puntini, scorrimento con il dito, scorrimento automatico lento
  var carousel = document.getElementById('carousel');
  var track = document.getElementById('carousel-track');
  if (carousel && track) {
    var slides = track.querySelectorAll('.slide');
    var n = slides.length;
    var label = function (k) { return carousel.getAttribute('data-label-' + k) || ''; };
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var current = 0, timer = null, paused = false, userPaused = false;

    for (var s = 0; s < n; s++) slides[s].setAttribute('aria-label', label('item') + ' ' + (s + 1) + ' / ' + n);

    if (n < 2) {
      carousel.classList.add('single');
    } else {
      var mk = function (cls, aria, icon) {
        var b = document.createElement('button');
        b.type = 'button'; b.className = cls; b.setAttribute('aria-label', aria);
        b.innerHTML = '<i class="fas ' + icon + '" aria-hidden="true"></i>';
        return b;
      };
      var prev = mk('carousel-btn prev', label('prev'), 'fa-chevron-left');
      var next = mk('carousel-btn next', label('next'), 'fa-chevron-right');
      var bar = document.createElement('div'); bar.className = 'carousel-bar';
      var dots = document.createElement('div'); dots.className = 'carousel-dots';
      var dotEls = [];
      for (var d = 0; d < n; d++) {
        (function (k) {
          var dot = document.createElement('button');
          dot.type = 'button'; dot.className = 'carousel-dot';
          dot.setAttribute('aria-label', label('item') + ' ' + (k + 1));
          dot.addEventListener('click', function () { go(k); });
          dots.appendChild(dot); dotEls.push(dot);
        })(d);
      }
      var toggle = mk('carousel-toggle', label('pause'), 'fa-pause');
      bar.appendChild(dots); bar.appendChild(toggle);
      carousel.appendChild(prev); carousel.appendChild(next); carousel.appendChild(bar);
      carousel.classList.add('ready');

      var mark = function () {
        for (var i = 0; i < n; i++) dotEls[i].setAttribute('aria-current', i === current ? 'true' : 'false');
      };
      var go = function (k) {
        current = (k + n) % n;
        track.scrollTo({ left: current * track.clientWidth, behavior: reduce ? 'auto' : 'smooth' });
        mark();
      };
      prev.addEventListener('click', function () { go(current - 1); });
      next.addEventListener('click', function () { go(current + 1); });

      var ticking = false;
      track.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(function () {
          var k = Math.round(track.scrollLeft / track.clientWidth);
          if (k !== current && k >= 0 && k < n) { current = k; mark(); }
          ticking = false;
        });
      }, { passive: true });
      window.addEventListener('resize', function () { track.scrollLeft = current * track.clientWidth; });

      // Scorrimento automatico: lento, si ferma col mouse/focus/dito e si può mettere in pausa
      var delay = parseInt(carousel.getAttribute('data-autoplay'), 10) || 6500;
      var stop = function () { if (timer) { clearInterval(timer); timer = null; } };
      var start = function () {
        stop();
        if (reduce || userPaused || paused || document.hidden) return;
        timer = setInterval(function () { go(current + 1); }, delay);
      };
      var setToggle = function () {
        toggle.setAttribute('aria-label', userPaused ? label('play') : label('pause'));
        toggle.innerHTML = '<i class="fas ' + (userPaused ? 'fa-play' : 'fa-pause') + '" aria-hidden="true"></i>';
      };
      toggle.addEventListener('click', function () { userPaused = !userPaused; setToggle(); start(); });
      carousel.addEventListener('mouseenter', function () { paused = true; start(); });
      carousel.addEventListener('mouseleave', function () { paused = false; start(); });
      carousel.addEventListener('focusin', function () { paused = true; start(); });
      carousel.addEventListener('focusout', function () { paused = false; start(); });
      carousel.addEventListener('touchstart', function () { paused = true; start(); }, { passive: true });
      carousel.addEventListener('touchend', function () { setTimeout(function () { paused = false; start(); }, 4000); }, { passive: true });
      document.addEventListener('visibilitychange', start);
      if (reduce) { userPaused = true; setToggle(); }
      mark();
      start();
    }
  }

  // Ricerca per parola chiave e per tag (pagine con l'elenco degli articoli)
  var input = document.getElementById('search');
  var cards = document.querySelectorAll('#cards .card');
  if (!input || !cards.length) return;

  var none = document.getElementById('no-results');

  function filter() {
    var q = input.value.toLowerCase().replace(/^\s+|\s+$/g, '');
    var shown = 0;
    for (var i = 0; i < cards.length; i++) {
      var match = !q || cards[i].textContent.toLowerCase().indexOf(q) > -1;
      cards[i].hidden = !match;
      if (match) shown++;
    }
    if (none) none.hidden = shown > 0;
  }

  input.addEventListener('input', filter);
  var btn = document.getElementById('search-btn');
  if (btn) btn.addEventListener('click', filter);

  // Un clic su un tag filtra l'elenco senza ricaricare la pagina
  var tags = document.querySelectorAll('#cards .tag');
  for (var j = 0; j < tags.length; j++) {
    tags[j].addEventListener('click', function (e) {
      e.preventDefault();
      input.value = this.getAttribute('data-tag') || this.textContent;
      filter();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Arrivando da un tag (es. journal/?q=cosmologia) il filtro è già applicato
  var m = /[?&]q=([^&]*)/.exec(window.location.search);
  if (m) {
    try { input.value = decodeURIComponent(m[1].replace(/\+/g, ' ')); } catch (e) {}
    filter();
  }
})();

/* Ricerca nel testo degli articoli (casella nel menu in alto) */
(function () {
  'use strict';
  var form = document.querySelector('.site-search');
  if (!form) return;
  var input = form.querySelector('.ss-input');
  var box = form.querySelector('.ss-results');
  var lang = form.getAttribute('data-lang');
  var index = null, loading = false, failed = false, items = [], active = -1;

  // minuscolo e senza accenti, mantenendo la stessa lunghezza del testo originale
  function norm(s) {
    var out = '';
    for (var i = 0; i < s.length; i++) {
      var c = s.charAt(i).toLowerCase();
      var d = c.normalize ? c.normalize('NFD').replace(/[̀-ͯ]/g, '') : c;
      out += d.length === 1 ? d : c.charAt(0);
    }
    return out;
  }

  function load(cb) {
    if (index) return cb();
    if (loading) return;
    loading = true;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', form.getAttribute('data-index'));
    xhr.onload = function () {
      loading = false;
      try {
        var data = JSON.parse(xhr.responseText), list = [];
        for (var i = 0; i < data.length; i++) {
          var d = data[i];
          if (d.lang !== lang) continue;
          var text = (d.text || '').replace(/\s+/g, ' ');
          list.push({
            title: d.title || '', url: d.url, text: text,
            nt: norm(d.title || ''), ng: norm((d.tags || []).join(' ')),
            nd: norm(d.description || ''), nx: norm(text)
          });
        }
        index = list; failed = false;
      } catch (e) { failed = true; index = []; }
      cb();
    };
    xhr.onerror = function () { loading = false; failed = true; index = []; cb(); };
    xhr.send();
  }

  function count(h, w) {
    var n = 0, p = h.indexOf(w);
    while (p > -1 && n < 50) { n++; p = h.indexOf(w, p + w.length); }
    return n;
  }

  function search(q) {
    var terms = norm(q).split(/\s+/).filter(function (t) { return t.length > 0; });
    if (!terms.length) return [];
    var res = [];
    for (var i = 0; i < index.length; i++) {
      var it = index[i], score = 0, ok = true;
      for (var k = 0; k < terms.length; k++) {
        var t = terms[k];
        var s = count(it.nt, t) * 8 + count(it.ng, t) * 5 + count(it.nd, t) * 3 + count(it.nx, t);
        if (!s) { ok = false; break; }
        score += s;
      }
      if (ok) res.push({ it: it, score: score, terms: terms });
    }
    res.sort(function (a, b) { return b.score - a.score; });
    return res.slice(0, 8);
  }

  function snippet(r) {
    var text = r.it.text, nx = r.it.nx, pos = -1;
    for (var k = 0; k < r.terms.length && pos < 0; k++) pos = nx.indexOf(r.terms[k]);
    var from = pos < 0 ? 0 : Math.max(0, pos - 60);
    var to = Math.min(text.length, from + 170);
    if (from > 0) { var sp = text.indexOf(' ', from); if (sp > -1 && sp < pos) from = sp + 1; }
    return { s: text.substring(from, to), n: nx.substring(from, to), pre: from > 0, post: to < text.length };
  }

  // scrive il testo in sicurezza evidenziando le parole cercate
  function highlight(el, str, nstr, terms) {
    var marks = [];
    for (var k = 0; k < terms.length; k++) {
      var p = nstr.indexOf(terms[k]);
      while (p > -1) { marks.push([p, p + terms[k].length]); p = nstr.indexOf(terms[k], p + terms[k].length); }
    }
    marks.sort(function (a, b) { return a[0] - b[0]; });
    var pos = 0;
    for (var m = 0; m < marks.length; m++) {
      if (marks[m][0] < pos) continue;
      el.appendChild(document.createTextNode(str.substring(pos, marks[m][0])));
      var mk = document.createElement('mark');
      mk.textContent = str.substring(marks[m][0], marks[m][1]);
      el.appendChild(mk);
      pos = marks[m][1];
    }
    el.appendChild(document.createTextNode(str.substring(pos)));
  }

  function clear() { while (box.firstChild) box.removeChild(box.firstChild); items = []; active = -1; }

  function msg(text) {
    clear();
    var p = document.createElement('p'); p.className = 'ss-msg'; p.textContent = text;
    box.appendChild(p); box.hidden = false;
  }

  function render() {
    var q = input.value.replace(/^\s+|\s+$/g, '');
    if (!q) { clear(); box.hidden = true; return; }
    if (failed) return msg(form.getAttribute('data-error'));
    var res = search(q);
    if (!res.length) return msg(form.getAttribute('data-none'));
    clear();
    for (var i = 0; i < res.length; i++) {
      var r = res[i], a = document.createElement('a');
      a.className = 'ss-item'; a.href = r.it.url; a.setAttribute('role', 'option');
      var h = document.createElement('strong'); highlight(h, r.it.title, r.it.nt, r.terms);
      var sn = snippet(r), d = document.createElement('span');
      if (sn.pre) d.appendChild(document.createTextNode('… '));
      highlight(d, sn.s, sn.n, r.terms);
      if (sn.post) d.appendChild(document.createTextNode(' …'));
      a.appendChild(h); a.appendChild(d); box.appendChild(a); items.push(a);
    }
    box.hidden = false;
  }

  function closeBox() { box.hidden = true; active = -1; }

  input.addEventListener('focus', function () { load(render); });
  input.addEventListener('input', function () { load(render); });
  form.addEventListener('submit', function (e) {
    if (index) { e.preventDefault(); var t = items[active > -1 ? active : 0]; if (t) window.location.href = t.href; }
  });
  form.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeBox(); input.blur(); return; }
    if ((e.key === 'ArrowDown' || e.key === 'ArrowUp') && items.length) {
      e.preventDefault();
      active = (active + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
      for (var i = 0; i < items.length; i++) items[i].classList.toggle('active', i === active);
      items[active].scrollIntoView({ block: 'nearest' });
    }
  });
  document.addEventListener('click', function (e) { if (!form.contains(e.target)) closeBox(); });
})();

/* Se i bottoni vanno a capo sotto il logo, il tutto si centra: stessa distanza dai due bordi */
(function () {
  'use strict';
  var header = document.querySelector('.site-header');
  var brand = header && header.querySelector('.brand');
  var nav = header && header.querySelector('.main-nav');
  if (!brand || !nav) return;
  function check() {
    header.classList.remove('wrapped');
    if (nav.getBoundingClientRect().top >= brand.getBoundingClientRect().bottom - 2) header.classList.add('wrapped');
  }
  window.addEventListener('resize', check);
  window.addEventListener('load', check);
  check();
})();
