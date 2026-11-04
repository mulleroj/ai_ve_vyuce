(() => {
  'use strict';
  const page = document.querySelector('.subject-page');
  const header = page?.querySelector('.site-header');
  const toggle = header?.querySelector('.nav-toggle');
  const nav = header?.querySelector('.primary-nav');
  if (!page || !toggle || !nav) return;

  // Without JavaScript, the links stay visible (including on small screens).
  // Enable the compact mobile menu only after its button is working.
  page.classList.add('subject-nav-ready');

  const closeMenu = (returnFocus = false) => {
    nav.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    const opening = !nav.classList.contains('is-open');
    nav.classList.toggle('is-open', opening);
    toggle.setAttribute('aria-expanded', String(opening));
  });

  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => closeMenu());
  });

  document.addEventListener('keydown', event => {
    if (event.key !== 'Escape') return;
    const hadOpenGroup = !!nav.querySelector('details[open]');
    nav.querySelectorAll('details[open]').forEach(details => { details.open = false; });
    if (nav.classList.contains('is-open')) closeMenu(true);
    else if (hadOpenGroup) nav.querySelector('.subject-nav-group summary')?.focus();
  });

  document.addEventListener('click', event => {
    if (!header.contains(event.target)) {
      nav.querySelectorAll('details[open]').forEach(details => { details.open = false; });
      closeMenu();
    }
  });

  const desktop = window.matchMedia('(min-width: 901px)');
  if (desktop.addEventListener) desktop.addEventListener('change', () => closeMenu());
})();
