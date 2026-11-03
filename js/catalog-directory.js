(function () {
  'use strict';
  const normalise = value => String(value || '').toLocaleLowerCase('cs').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const queryInput = document.querySelector('[data-query]');
  if (!queryInput) return;
  const cards = [...document.querySelectorAll('[data-card]')];
  const filterButtons = [...document.querySelectorAll('[data-filter]')];
  const status = document.querySelector('[data-status]');
  const empty = document.querySelector('[data-empty]');
  const clear = document.querySelector('[data-clear]');
  let activeFilter = 'all';
  const filterMatches = card => {
    const haystack = normalise(card.dataset.search + ' ' + card.dataset.category + ' ' + card.dataset.contentType);
    if (activeFilter === 'all') return true;
    const selectedButton = filterButtons.find(button => button.dataset.filter === activeFilter);
    if (selectedButton?.dataset.filterCategory) return card.dataset.category === selectedButton.dataset.filterCategory;
    if (selectedButton?.dataset.filterContentType) return selectedButton.dataset.filterContentType.split(',').includes(card.dataset.contentType);
    if (activeFilter === 'philosophy') return haystack.includes('filozofovani s ai');
    const terms = { chatgpt: ['chatgpt'], gemini: ['gemini', 'notebooklm'], microsoft: ['microsoft', 'copilot'], 'vibe-coding': ['vibe coding'] };
    return (terms[activeFilter] || []).some(term => haystack.includes(normalise(term)));
  };
  const update = (writeUrl = true) => {
    const q = normalise(queryInput.value.trim());
    let count = 0;
    cards.forEach(card => {
      const matches = (!q || normalise(card.dataset.search).includes(q)) && filterMatches(card);
      card.hidden = !matches;
      if (matches) count++;
    });
    if (status) status.textContent = `${count} ${count === 1 ? 'položka' : count >= 2 && count <= 4 ? 'položky' : 'položek'}`;
    if (empty) empty.hidden = count !== 0;
    if (clear) clear.hidden = !queryInput.value;
    const sectionCount = document.querySelectorAll('[data-section]');
    sectionCount.forEach(section => { section.hidden = !section.querySelector('[data-card]:not([hidden])'); });
    if (writeUrl) {
      const url = new URL(window.location.href);
      if (queryInput.value.trim()) url.searchParams.set('q', queryInput.value.trim()); else url.searchParams.delete('q');
      if (activeFilter !== 'all') url.searchParams.set('filter', activeFilter); else url.searchParams.delete('filter');
      window.history.replaceState({}, '', url);
    }
  };
  const setFilter = value => {
    activeFilter = filterButtons.some(button => button.dataset.filter === value) ? value : 'all';
    filterButtons.forEach(button => {
      const selected = button.dataset.filter === activeFilter;
      button.setAttribute('aria-pressed', String(selected));
      button.classList.toggle('is-active', selected);
    });
  };
  const params = new URLSearchParams(window.location.search);
  queryInput.value = params.get('q') || '';
  setFilter(params.get('filter') || 'all');
  update(false);
  queryInput.addEventListener('input', () => update());
  filterButtons.forEach(button => button.addEventListener('click', () => { setFilter(button.dataset.filter); update(); }));
  if (clear) clear.addEventListener('click', () => { queryInput.value = ''; queryInput.focus(); update(); });
  const navToggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.primary-nav');
  if (navToggle && nav) navToggle.addEventListener('click', () => {
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    nav.hidden = expanded;
  });
  if (navToggle && nav) nav.hidden = true;
})();
