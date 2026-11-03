/* ChatGPT product directory. Selection and featured/date ordering stay catalog driven. */
(() => {
    const mount = document.querySelector('#chatgpt-articles-grid');
    if (!mount || !Array.isArray(window.siteArticles)) return;

    const articles = window.siteArticles
        .map((article, index) => ({ article, index }))
        .filter(item => item.article.platforms?.includes('chatgpt'))
        .sort((left, right) => {
            const featured = Number(Boolean(right.article.featured)) - Number(Boolean(left.article.featured));
            const date = (right.article.date || '').localeCompare(left.article.date || '');
            return featured || date || left.index - right.index;
        })
        .map(item => item.article);

    const text = value => String(value ?? '');
    const make = (tag, className, value) => {
        const node = document.createElement(tag);
        if (className) node.className = className;
        if (value !== undefined) node.textContent = value;
        return node;
    };
    mount.replaceChildren();

    if (!articles.length) {
        const empty = make('p', 'empty-state', 'Zatím zde nejsou žádné články označené pro ChatGPT.');
        empty.dataset.empty = '';
        mount.appendChild(empty);
        return;
    }

    articles.forEach((article, index) => {
        const category = text(article.category || 'Článek');
        const contentType = article.contentType || (
            ['Novinka', 'AI ve vzdělávání', 'Filozofování s AI'].includes(category) ? 'magazine' :
                ['Návod'].includes(category) ? 'guide' :
                    category === 'Nástroj krok za krokem' ? 'tool-guide' :
                        ['Workflow', 'AI V PRAXI'].includes(category) ? 'workflow' : ''
        );
        const searchText = [article.title, article.summary, category, article.dateLabel, ...(article.tags || [])].map(text).join(' ');
        const card = make('article', 'article-card');
        card.dataset.card = '';
        card.dataset.category = category;
        card.dataset.contentType = contentType;
        card.dataset.search = searchText;

        const link = make('a', 'card-link');
        link.href = article.href;
        if (article.image) {
            const media = make('div', 'card-media');
            const img = make('img');
            img.src = article.image;
            img.alt = text(article.imageAlt || article.title);
            img.loading = 'lazy';
            media.appendChild(img);
            link.appendChild(media);
        } else {
            const media = make('div', 'card-media card-fallback');
            media.setAttribute('aria-hidden', 'true');
            media.appendChild(make('span', '', text(article.icon || '✦')));
            link.appendChild(media);
        }

        const copy = make('div', 'card-copy');
        const meta = make('div', 'card-meta');
        meta.append(make('span', 'category-pill', category));
        if (article.dateLabel) {
            const time = make('time', '', article.dateLabel);
            time.dateTime = text(article.date || '');
            meta.appendChild(time);
        }
        copy.appendChild(meta);

        const tags = make('div', 'card-tags');
        tags.setAttribute('aria-label', 'Štítky');
        (article.tags || []).slice(0, 3).forEach(tag => tags.appendChild(make('span', 'tag-chip', tag)));
        if (tags.childElementCount) copy.appendChild(tags);

        const heading = make('h3');
        heading.textContent = text(article.title);
        copy.append(heading, make('p', '', article.summary || ''));
        copy.appendChild(make('span', 'card-cta', contentType === 'workflow' ? 'Otevřít workflow →' : 'Číst článek →'));
        link.appendChild(copy);
        card.appendChild(link);
        if (article.featured) card.classList.add('is-featured');
        card.dataset.order = String(index + 1);
        mount.appendChild(card);
    });
})();
