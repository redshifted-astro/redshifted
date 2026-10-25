/* Formule matematiche con KaTeX (si attiva solo negli articoli con "math: true") */
(function () {
  'use strict';
  if (!window.katex || !window.renderMathInElement) return;

  // Alcune versioni di Jekyll trasformano $$...$$ in <script type="math/tex">: li convertiamo qui.
  var scripts = document.querySelectorAll('script[type^="math/tex"]');
  for (var i = 0; i < scripts.length; i++) {
    var s = scripts[i];
    var display = s.type.indexOf('display') > -1;
    var el = document.createElement(display ? 'div' : 'span');
    try { window.katex.render(s.textContent, el, { displayMode: display, throwOnError: false }); }
    catch (e) { el.textContent = s.textContent; }
    s.parentNode.replaceChild(el, s);
  }

  var body = document.querySelector('.post-body');
  if (body) {
    window.renderMathInElement(body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '\\[', right: '\\]', display: true },
        { left: '\\(', right: '\\)', display: false }
      ],
      throwOnError: false
    });
  }
})();
