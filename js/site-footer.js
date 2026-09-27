/*
 * Shared footer mark for every public page.
 * Keep the label here so new standard pages only need to load this script.
 */
(() => {
    const FOOTER_MARK = 'AI + 👤 | HUMAN IN THE LOOP';

    function createFooter() {
        const footer = document.createElement('footer');
        footer.className = document.body.classList.contains('workflow-page')
            ? 'workflow-footer'
            : 'footer';

        if (footer.classList.contains('workflow-footer')) {
            footer.innerHTML = '© 2026 AI ve Výuce · <a href="ai.html">Zpět na AI pro výuku</a>';
        } else {
            footer.innerHTML = '<div class="container"><div class="footer-bottom"><span>© 2026 AI ve Výuce</span></div></div>';
        }

        document.body.appendChild(footer);
        return footer;
    }

    const footer = document.querySelector('footer') || createFooter();
    if (footer.querySelector('[data-site-footer-mark]')) return;

    const mark = document.createElement('span');
    mark.className = 'site-footer-mark';
    mark.dataset.siteFooterMark = '';
    mark.setAttribute('role', 'note');
    mark.textContent = FOOTER_MARK;

    const footerBottom = footer.querySelector('.footer-bottom');
    (footerBottom || footer).appendChild(mark);
})();
