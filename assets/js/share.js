/* Pulsanti di condivisione dell'articolo: "Copia link" e "Condividi" (menu del telefono) */
(function () {
  'use strict';
  var note = document.getElementById('share-note');
  var copy = document.getElementById('share-copy');
  var nat = document.getElementById('share-native');

  function say(msg) {
    if (!note) return;
    note.textContent = msg;
    window.clearTimeout(say.t);
    say.t = window.setTimeout(function () { note.textContent = ''; }, 2500);
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

  function fallback(url, done) {
    var ta = document.createElement('textarea');
    ta.value = url; ta.setAttribute('readonly', '');
    ta.style.position = 'fixed'; ta.style.opacity = '0';
    document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); done(); } catch (e) {}
    document.body.removeChild(ta);
  }

  // Il pulsante "Condividi" compare solo sui dispositivi che lo supportano (di solito i telefoni)
  if (nat && navigator.share) {
    nat.hidden = false;
    nat.addEventListener('click', function () {
      navigator.share({ title: nat.getAttribute('data-title'), url: nat.getAttribute('data-url') }).catch(function () {});
    });
    if (note) note.textContent = note.getAttribute('data-hint') || '';
  }
})();
