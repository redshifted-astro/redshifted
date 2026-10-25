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
