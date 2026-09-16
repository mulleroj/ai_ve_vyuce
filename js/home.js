/* ── Homepage choice panel ── */
(() => {
    const panel = document.querySelector('[data-hero-choices]');
    if (!panel) return;

    const buttons = [...panel.querySelectorAll('[data-hero-choice]')];
    const title = panel.querySelector('[data-hero-detail-title]');
    const description = panel.querySelector('[data-hero-detail-description]');
    const link = panel.querySelector('[data-hero-detail-link]');
    if (!buttons.length || !title || !description || !link) return;

    const selectChoice = (button) => {
        buttons.forEach((item) => {
            item.setAttribute('aria-pressed', item === button ? 'true' : 'false');
        });

        title.textContent = button.dataset.title;
        description.textContent = button.dataset.description;
        link.href = button.dataset.href;
        link.textContent = button.dataset.cta;

        if (button.dataset.external === 'true') {
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
        } else {
            link.removeAttribute('target');
            link.removeAttribute('rel');
        }
    };

    buttons.forEach((button) => {
        button.addEventListener('click', () => selectChoice(button));
    });
})();
