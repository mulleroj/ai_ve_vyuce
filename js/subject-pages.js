document.querySelectorAll('.subject-page').forEach((page) => {
    const cards = [...page.querySelectorAll('.activity-grid .activity-card')];
    const visibleCount = page.querySelector('[data-count-visible]');
    const totalCount = page.querySelector('[data-count-total]');
    if (totalCount) totalCount.textContent = String(cards.length);

    const updateCount = () => {
        if (!visibleCount) return;
        visibleCount.textContent = String(cards.filter((card) => card.style.display !== 'none').length);
    };
    page.querySelectorAll('.filter-group .filter-chip[data-filter]').forEach((button) => {
        button.addEventListener('click', updateCount);
    });
    updateCount();

    page.querySelectorAll('.tabs .tab-btn').forEach((button) => {
        button.addEventListener('click', () => {
            page.querySelectorAll('.tabs .tab-btn').forEach((tab) => {
                tab.setAttribute('aria-pressed', tab === button ? 'true' : 'false');
            });
        });
    });
});
