document.querySelectorAll('.subject-page').forEach((page) => {
    const cards = [...page.querySelectorAll('.activity-grid .activity-card')];
    const visibleCount = page.querySelector('[data-count-visible]');
    const totalCount = page.querySelector('[data-count-total]');
    if (totalCount) totalCount.textContent = String(cards.length);

    const updateCount = () => {
        if (!visibleCount) return;
        visibleCount.textContent = String(cards.filter((card) => card.style.display !== 'none').length);
    };
    const levelButtons = [...page.querySelectorAll('.filter-group .filter-chip[data-filter]:not([data-filter-type])')];
    const subsubjectButtons = [...page.querySelectorAll('.filter-group .filter-chip[data-filter-type="subsubject"]')];
    let selectedLevel = 'all';
    let selectedSubsubject = 'all';
    const applyFilters = () => {
        cards.forEach((card) => {
            const levels = (card.dataset.level || '').split(/\s+/);
            const levelMatches = selectedLevel === 'all' || levels.includes(selectedLevel);
            const subjectMatches = selectedSubsubject === 'all' || card.dataset.subject === selectedSubsubject;
            card.style.display = levelMatches && subjectMatches ? '' : 'none';
        });
        updateCount();
    };
    levelButtons.forEach((button) => {
        button.addEventListener('click', () => {
            selectedLevel = button.dataset.filter;
            applyFilters();
        });
    });
    subsubjectButtons.forEach((button) => {
        button.addEventListener('click', () => {
            selectedSubsubject = button.dataset.filter;
            subsubjectButtons.forEach((candidate) => {
                const isActive = candidate === button;
                candidate.classList.toggle('active', isActive);
                candidate.setAttribute('aria-pressed', String(isActive));
            });
            applyFilters();
        });
    });
    page.querySelectorAll('.filter-group .filter-chip[data-filter]:not([data-filter-type])').forEach((button) => {
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
