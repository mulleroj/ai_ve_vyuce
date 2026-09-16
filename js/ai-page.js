/* ── AI directory search, filters, and progressive disclosure ── */
(function initAiDirectory() {
    document.body.classList.add('ai-directory-js');

    const sections = Array.from(document.querySelectorAll('[data-ai-directory-section]')).map(section => ({
        element: section,
        rows: Array.from(section.querySelectorAll('tbody > tr')),
        toggle: section.querySelector('[data-ai-directory-toggle]'),
        empty: section.querySelector('[data-ai-directory-empty]'),
        expanded: false
    }));
    const queryInput = document.querySelector('[data-ai-directory-query]');
    const clearButton = document.querySelector('[data-ai-directory-clear]');
    const status = document.querySelector('[data-ai-directory-status]');
    const noResults = document.querySelector('[data-ai-directory-no-results]');
    const filterButtons = Array.from(document.querySelectorAll('[data-ai-directory-filter]'));

    if (!sections.length || !queryInput || !filterButtons.length) return;

    const normalize = value => String(value || '')
        .toLocaleLowerCase('cs-CZ')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');

    const filters = {
        all: () => true,
        chatgpt: text => text.includes('chatgpt'),
        gemini: text => text.includes('gemini'),
        microsoft: text => text.includes('microsoft') || text.includes('copilot'),
        'vibe-coding': text => text.includes('vibe coding'),
        philosophy: text => text.includes('filozofovani s ai')
    };

    sections.forEach(section => {
        section.rows.forEach(row => {
            row.dataset.aiDirectorySearchText = normalize(row.textContent);
        });
        if (section.toggle) {
            section.toggle.hidden = section.rows.length <= 5;
            section.toggle.addEventListener('click', () => {
                section.expanded = !section.expanded;
                update();
            });
        }
    });

    let activeFilter = 'all';

    function update() {
        const query = normalize(queryInput.value);
        const filtering = Boolean(query || activeFilter !== 'all');
        const filterMatches = filters[activeFilter] || filters.all;
        let totalMatches = 0;
        let totalRows = 0;

        sections.forEach(section => {
            totalRows += section.rows.length;
            const matches = section.rows.filter(row => {
                const text = row.dataset.aiDirectorySearchText || '';
                return (!query || text.includes(query)) && filterMatches(text);
            });
            totalMatches += matches.length;
            const showAll = filtering || section.expanded;
            const matchingRows = new Set(matches);

            section.rows.forEach(row => {
                const matchIndex = matches.indexOf(row);
                row.hidden = !matchingRows.has(row) || (!showAll && matchIndex >= 5);
            });

            if (section.empty) section.empty.hidden = matches.length > 0;
            if (section.toggle) {
                section.toggle.hidden = filtering || section.rows.length <= 5;
                section.toggle.textContent = section.expanded
                    ? 'Zobrazit méně ↑'
                    : `Zobrazit všechny (${section.rows.length}) ↓`;
                section.toggle.setAttribute('aria-expanded', String(section.expanded));
            }
        });

        clearButton.hidden = !queryInput.value;
        noResults.hidden = !filtering || totalMatches > 0;
        if (status) {
            status.textContent = filtering
                ? `Zobrazeno ${totalMatches} z ${totalRows} položek.`
                : '';
        }
    }

    queryInput.addEventListener('input', update);
    queryInput.form?.addEventListener('submit', event => event.preventDefault());
    clearButton?.addEventListener('click', () => {
        queryInput.value = '';
        update();
        queryInput.focus();
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            activeFilter = button.dataset.aiDirectoryFilter || 'all';
            filterButtons.forEach(filterButton => {
                const isActive = filterButton === button;
                filterButton.classList.toggle('is-active', isActive);
                filterButton.setAttribute('aria-pressed', String(isActive));
            });
            update();
        });
    });

    update();
})();
