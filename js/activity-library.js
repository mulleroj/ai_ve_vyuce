(function () {
  'use strict';
  const cards = [...document.querySelectorAll('#allActivities [data-activity-id]')];
  const search = document.getElementById('activitySearch');
  const filters = Object.fromEntries(['subject', 'level', 'tool'].map(key => [key, document.getElementById(`${key}Filter`)]));
  const status = document.getElementById('activityResults');
  const empty = document.getElementById('emptyState');
  const dialog = document.getElementById('activityDetailDialog');
  const panel = dialog.querySelector('.activity-dialog-panel');
  let returnFocus = null;
  function restoreFocus() { const target = returnFocus; if (target) requestAnimationFrame(() => target.focus({ preventScroll: true })); }
  const subjectNames = { mat: 'Matematika', cj: 'Čeština', aj: 'Angličtina', pv: 'Přírodní vědy', dej: 'Dějepis', obecne: 'Obecné aktivity' };
  const toolNames = { chatgpt: 'ChatGPT', gemini: 'Gemini', claude: 'Claude' };
  const levels = { zs1: '1.–5. ročník', zs2: '6.–9. ročník', ss: 'Střední škola' };
  const normalize = value => value.toLocaleLowerCase('cs').normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const valid = { subject: new Set(['all', ...Object.keys(subjectNames)]), level: new Set(['all', ...Object.keys(levels)]), tool: new Set(['all', ...Object.keys(toolNames)]) };
  const plural = n => n === 1 ? 'aktivita' : n >= 2 && n <= 4 ? 'aktivity' : 'aktivit';

  function readUrl() {
    const params = new URLSearchParams(location.search);
    search.value = params.get('q') || '';
    for (const [key, element] of Object.entries(filters)) element.value = valid[key].has(params.get(key)) ? params.get(key) : 'all';
  }
  function writeUrl() {
    const params = new URLSearchParams();
    if (search.value.trim()) params.set('q', search.value.trim());
    for (const [key, element] of Object.entries(filters)) if (element.value !== 'all') params.set(key, element.value);
    const query = params.toString();
    history.replaceState(null, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
  }
  function apply(sync = true) {
    const query = normalize(search.value.trim());
    let count = 0;
    for (const card of cards) {
      const visible = (filters.subject.value === 'all' || card.dataset.subject === filters.subject.value) &&
        (filters.level.value === 'all' || card.dataset.level.split(/\s+/).includes(filters.level.value)) &&
        (filters.tool.value === 'all' || card.dataset.tool === filters.tool.value) &&
        (!query || normalize(card.dataset.search).includes(query));
      card.hidden = !visible;
      if (visible) count++;
    }
    empty.hidden = count !== 0;
    status.textContent = `Zobrazeno ${count} ${plural(count)}`;
    if (sync) writeUrl();
  }
  function closeDialog() {
    if (dialog.hidden) return;
    dialog.hidden = true;
    document.body.classList.remove('activity-dialog-open');
    if (returnFocus && document.contains(returnFocus)) restoreFocus();
  }
  function openDialog(card, trigger) {
    returnFocus = trigger;
    document.getElementById('activityDetailTitle').textContent = card.dataset.modalTitle || card.querySelector('.activity-title').textContent.trim();
    document.getElementById('activityDetailDescription').textContent = card.querySelector('.activity-desc').textContent.trim();
    const intro = document.getElementById('activityDetailIntro'); intro.textContent = card.dataset.intro || ''; intro.hidden = !card.dataset.intro;
    document.getElementById('activityDetailPrompt').textContent = card.dataset.prompt;
    const copy = document.getElementById('activityDetailCopy');
    copy.dataset.copy = card.dataset.prompt;
    const meta = document.getElementById('activityDetailMeta');
    const entries = [['Předmět', subjectNames[card.dataset.subject]], ['Ročník', card.dataset.level.split(/\s+/).map(level => levels[level]).join(', ')], ['AI nástroj', toolNames[card.dataset.tool]], ['Doba', card.dataset.duration], ['Forma', card.dataset.format]];
    meta.replaceChildren(...entries.flatMap(([label, value]) => { const wrap = document.createElement('div'); const dt = document.createElement('dt'); const dd = document.createElement('dd'); dt.textContent = `${label}:`; dd.textContent = value; wrap.append(dt, dd); return [wrap]; }));
    const related = document.getElementById('activityDetailRelated');
    if (card.dataset.relatedPrompt) { related.href = `prompty.html#${encodeURIComponent(card.dataset.relatedPrompt)}`; related.hidden = false; } else related.hidden = true;
    dialog.hidden = false;
    document.body.classList.add('activity-dialog-open');
    document.getElementById('activityDetailTitle').focus();
  }
  for (const [key, element] of Object.entries(filters)) element.addEventListener('change', () => apply());
  search.addEventListener('input', () => apply());
  document.getElementById('resetActivityFilters').addEventListener('click', () => { search.value = ''; Object.values(filters).forEach(element => element.value = 'all'); apply(); search.focus(); });
  document.getElementById('allActivities').addEventListener('click', event => {
    const trigger = event.target.closest('[data-open-activity], [data-modal-target]');
    if (!trigger) return;
    if (trigger.dataset.modalTarget) {
      event.preventDefault();
      const modal = document.getElementById(trigger.dataset.modalTarget);
      if (!modal) return;
      returnFocus = trigger;
      modal.setAttribute('role', 'dialog'); modal.setAttribute('aria-modal', 'true');
      const title = modal.querySelector('h2, h3');
      if (title) { title.setAttribute('tabindex', '-1'); modal.setAttribute('aria-labelledby', title.id || (title.id = `${modal.id}-title`)); }
      modal.classList.add('open');
      const close = modal.querySelector('.modal-close'); if (close) close.focus();
      document.body.classList.add('activity-dialog-open');
      return;
    }
    const card = cards.find(item => item.dataset.activityId === trigger.dataset.openActivity);
    if (card) openDialog(card, trigger);
  });
  dialog.addEventListener('click', event => { if (event.target.closest('[data-close-dialog]')) closeDialog(); });
  document.addEventListener('click', event => {
    const close = event.target.closest('.modal-close');
    if (close) { close.closest('.modal-overlay')?.classList.remove('open'); document.body.classList.remove('activity-dialog-open'); restoreFocus(); }
  });
  document.querySelectorAll('.modal-overlay').forEach(modal => modal.addEventListener('click', event => {
    if (event.target !== modal || !modal.classList.contains('open')) return;
    modal.classList.remove('open'); document.body.classList.remove('activity-dialog-open'); restoreFocus();
  }));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !dialog.hidden) { event.preventDefault(); closeDialog(); return; }
    const activeModal = document.querySelector('.modal-overlay.open');
    if (event.key === 'Escape' && activeModal) { event.preventDefault(); event.stopImmediatePropagation(); activeModal.classList.remove('open'); document.body.classList.remove('activity-dialog-open'); restoreFocus(); return; }
    if (event.key !== 'Tab') return;
    const focusScope = dialog.hidden ? activeModal : dialog;
    if (!focusScope) return;
    const focusable = [...focusScope.querySelectorAll('button:not([disabled]),a[href]:not([hidden]),[tabindex="0"]')];
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }, true);
  window.addEventListener('popstate', () => { readUrl(); apply(false); });
  readUrl(); apply(false);
})();
