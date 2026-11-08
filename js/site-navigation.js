(function () {
  const navs = document.querySelectorAll('[data-site-navigation]');
  const areas = window.siteNavigationAreas;
  if (!navs.length || !Array.isArray(areas)) return;

  const pathLeaf = location.pathname.split('/').filter(Boolean).pop() || 'index.html';
  const current = pathLeaf.includes('.') ? pathLeaf : `${pathLeaf}.html`;
  document.documentElement.classList.add('js');
  navs.forEach((nav) => {
    nav.classList.add('site-nav-pilot');
    nav.replaceChildren();
    areas.forEach((area) => {
    const details = document.createElement('details');
    details.className = 'site-nav-area';
    details.dataset.area = area.id;
    const active = area.href === current || area.links.some(([, href]) => href === current);
    if (active) details.dataset.active = 'true';
    const summary = document.createElement('summary');
    summary.textContent = area.label;
    if (active) summary.setAttribute('aria-current', area.href === current ? 'page' : 'location');
    details.append(summary);
    const panel = document.createElement('div');
    panel.className = 'site-nav-panel';
    const destinations = [[`Přehled: ${area.label}`, area.href], ...area.links];
    destinations.forEach(([label, href]) => {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      if (href === current) link.setAttribute('aria-current', 'page');
      panel.append(link);
    });
    details.append(panel);
      nav.append(details);
    });

    nav.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      const open = nav.querySelector('details[open]');
      if (open) {
        open.open = false;
        open.querySelector('summary').focus();
        return;
      }
      const menu = nav.closest('.mobile-menu, #primary-menu, .primary-nav');
      const isOpen = menu && (
        menu.classList.contains('open')
        || menu.classList.contains('is-open')
        || (menu.classList.contains('primary-nav') && !menu.hidden && window.matchMedia('(max-width: 760px)').matches)
      );
      if (!isOpen) return;
      menu.classList.remove('open', 'is-open');
      if (menu.classList.contains('primary-nav')) menu.hidden = true;
      const shell = nav.closest('.site-header, .nav, .workflow-shell');
      const toggle = (shell && shell.querySelector('.nav-toggle, .menu-toggle, .nav-mobile-toggle'))
        || document.querySelector('.nav-toggle, .menu-toggle, .nav-mobile-toggle');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Otevřít navigaci');
        toggle.focus();
      }
      document.body.style.overflow = '';
    });
    nav.addEventListener('toggle', (event) => {
      if (event.target.tagName !== 'DETAILS' || !event.target.open) return;
      nav.querySelectorAll('details[open]').forEach((item) => {
        if (item !== event.target) item.open = false;
      });
    }, true);
  });

})();
