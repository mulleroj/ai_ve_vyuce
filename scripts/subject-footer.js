'use strict';

// Shared subject-page footer. Markup follows the approved homepage footer.
function buildSubjectFooter() {
  return [
    '    <footer class="footer home-footer subject-site-footer">',
    '      <div class="footer-inner">',
    '        <a class="brand" href="index.html" aria-label="AI ve Výuce – úvodní stránka">',
    '          <img class="brand-symbol" src="images/ai-assistant-book-logo.png?v=robot-20261103" width="512" height="491" alt="">',
    '          <span class="brand-copy"><strong>AI ve výuce</strong><small>Inspirace · nástroje · praxe pro učitele</small></span>',
    '        </a>',
    '        <p>Moderní průvodce světem AI pro české učitele.</p>',
    '        <div class="footer-links" aria-label="Užitečné odkazy">',
    '          <a href="ai-navody.html">Návody</a>',
    '          <a href="prompty.html">Prompty</a>',
    '          <a href="aktivity.html">Aktivity</a>',
    '          <a href="asistenti.html">AI nástroje</a>',
    '        </div>',
    '        <small>© 2026 AI ve výuce</small>',
    '      </div>',
    '    </footer>'
  ].join('\n');
}

module.exports = { buildSubjectFooter };
