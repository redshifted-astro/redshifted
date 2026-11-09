/* Pulsanti di condivisione dell'articolo: "Copia link" e "Condividi" (menu del telefono) */
(function () {
  'use strict';
  var blocks = document.querySelectorAll('.share');

  function fallback(url, done) {
    var ta = document.createElement('textarea');
    ta.value = url; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(ta);
  }

  for (var i = 0; i < blocks.length; i++) {
    (function (box) {
      var note = box.querySelector('.share-note');
      var copy = box.querySelector('.share-copy');
      var nat = box.querySelector('.share-native');
      var timer, base = '';

      function say(msg) {
        if (!note) return;
        note.textContent = msg;
        window.clearTimeout(timer);
        timer = window.setTimeout(function () { note.textContent = base; }, 2500);
      }

      if (copy) {
        copy.addEventListener('click', function () {
          var url = copy.getAttribute('data-url') || window.location.href;
          var done = function () { say(copy.getAttribute('data-copied')); };
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(url).then(done, function () { fallback(url, done); });
          } else { fallback(url, done); }
        });
      }

      // Il pulsante "Condividi" compare solo sui dispositivi che lo supportano (di solito i telefoni)
      if (nat && navigator.share) {
        nat.hidden = false;
        if (note && box.classList.contains('share-bottom')) { base = note.getAttribute('data-hint') || ''; note.textContent = base; }
        nat.addEventListener('click', function () {
          navigator.share({ title: nat.getAttribute('data-title'), url: nat.getAttribute('data-url') }).catch(function () {});
        });
      }
    })(blocks[i]);
  }
})();
