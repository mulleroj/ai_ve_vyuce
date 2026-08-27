/* ── ChatGPT article directory ── */
const chatgptArticlesMount = document.querySelector('#chatgpt-articles-grid');
if (chatgptArticlesMount && Array.isArray(window.siteArticles)) {
    const chatgptArticles = window.siteArticles
        .map((article, index) => ({ article, index }))
        .filter(item => item.article.platforms?.includes('chatgpt'))
        .sort((left, right) => {
            const leftDate = left.article.date || '';
            const rightDate = right.article.date || '';
            return rightDate.localeCompare(leftDate) || left.index - right.index;
        })
        .map(item => item.article);

    chatgptArticlesMount.replaceChildren();

    if (!chatgptArticles.length) {
        const emptyState = document.createElement('p');
        emptyState.className = 'chatgpt-empty';
        emptyState.textContent = 'Zatím zde nejsou žádné články označené pro ChatGPT.';
        chatgptArticlesMount.appendChild(emptyState);
    } else {
        chatgptArticles.forEach((article, index) => {
            const card = document.createElement('article');
            card.className = 'workflow-related-card';

            const number = document.createElement('span');
            number.className = 'workflow-card-number';
            number.textContent = String(index + 1).padStart(2, '0');

            const meta = document.createElement('div');
            meta.className = 'chatgpt-article-meta';
            meta.textContent = `${article.category || 'Článek'}${article.dateLabel ? ` · ${article.dateLabel}` : ''}`;

            const title = document.createElement('h3');
            const titleLink = document.createElement('a');
            titleLink.href = article.href;
            titleLink.textContent = article.title;
            title.appendChild(titleLink);

            const summary = document.createElement('p');
            summary.textContent = article.summary || '';

            const readLink = document.createElement('a');
            readLink.className = 'chatgpt-article-link';
            readLink.href = article.href;
            readLink.textContent = 'Číst článek →';

            card.append(number, meta, title, summary, readLink);
            chatgptArticlesMount.appendChild(card);
        });
    }
}
