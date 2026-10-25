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
    var toggle = function () { up.classList.toggle('visible', window.scrollY > 300); };
    window.addEventListener('scroll', toggle, { passive: true });
    toggle();
    up.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
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
