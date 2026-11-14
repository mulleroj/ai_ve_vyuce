(function () {
  const articles = (window.siteArticles || [])
    .filter((article) => article.series === 'Filozofování s AI' && Number.isFinite(article.seriesNumber))
    .sort((a, b) => a.seriesNumber - b.seriesNumber);
  if (articles.length !== 4 || articles.some((article, index) => article.seriesNumber !== index + 1)) return;

  const pathLeaf = location.pathname.split('/').filter(Boolean).pop() || '';
  const currentHref = pathLeaf && !pathLeaf.includes('.') ? `${pathLeaf}.html` : pathLeaf;
  const current = articles.findIndex((article) => article.href === currentHref);
  const target = document.querySelector('[data-series-list]');
  if (target) {
    target.replaceChildren(...articles.map((article) => {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = article.href;
      link.textContent = `Díl ${article.seriesNumber}: ${article.title}`;
      item.append(link);
      if (article.summary) {
        const summary = document.createElement('p');
        summary.textContent = article.summary;
        item.append(summary);
      }
      return item;
    }));
  }
  if (current < 0) return;

  const main = document.querySelector('main');
  if (!main) return;
  const nav = document.createElement('nav');
  nav.className = 'series-navigation';
  nav.setAttribute('aria-label', 'Návaznost série Filozofování s AI');
  const heading = document.createElement('h2');
  heading.textContent = `Filozofování s AI · díl ${current + 1} ze ${articles.length}`;
  nav.append(heading);
  const all = document.createElement('ol');
  all.className = 'series-all-parts';
  articles.forEach((article, index) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = article.href;
    link.textContent = `${index + 1}. ${article.title}`;
    if (index === current) link.setAttribute('aria-current', 'page');
    item.append(link);
    all.append(item);
  });
  nav.append(all);
  const steps = document.createElement('div');
  steps.className = 'series-steps';
  if (articles[current - 1]) {
    const previous = document.createElement('a');
    previous.href = articles[current - 1].href;
    previous.rel = 'prev';
    previous.textContent = `← Předchozí díl: ${articles[current - 1].title}`;
    steps.append(previous);
  }
  if (articles[current + 1]) {
    const next = document.createElement('a');
    next.href = articles[current + 1].href;
    next.rel = 'next';
    next.textContent = `Následující díl: ${articles[current + 1].title} →`;
    steps.append(next);
  }
  nav.append(steps);
  const returnLink = document.createElement('a');
  returnLink.href = 'filozofovani-s-ai.html';
  returnLink.textContent = 'Zpět na rozcestník série';
  nav.append(returnLink);
  const related = main.querySelector('.workflow-related');
  if (related) main.insertBefore(nav, related);
  else main.append(nav);
})();
