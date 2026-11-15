const fs = require('node:fs');
const path = require('node:path');

const PAGE_FILES = ['asistenti.html', 'katalog-asistenti.html'];
const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

function decode(value) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', bull: '•', middot: '·', copy: '©', reg: '®', euro: '€' };
  return String(value || '').replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : entity;
    }
    return named[code.toLowerCase()] ?? entity;
  });
}

function parseAttributes(raw) {
  const first = raw.match(/^<\s*([a-z][a-z0-9:-]*)/i);
  if (!first) return {};
  const rest = raw.slice(first[0].length).replace(/\/?\s*>\s*$/, '');
  const attrs = {};
  const pattern = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match;
  while ((match = pattern.exec(rest))) attrs[match[1].toLowerCase()] ??= decode(match[2] ?? match[3] ?? match[4] ?? '');
  return attrs;
}

function tokens(markup) {
  const result = [];
  const pattern = /<!--[\s\S]*?-->|<![^>]*>|<\/?[a-z][a-z0-9:-]*(?:"[^"]*"|'[^']*'|[^'">])*>/gi;
  let match;
  while ((match = pattern.exec(markup))) {
    const raw = match[0];
    if (raw.startsWith('<!--') || raw.startsWith('<!')) continue;
    const info = raw.match(/^<\s*(\/?)\s*([a-z][a-z0-9:-]*)/i);
    if (!info) continue;
    result.push({ raw, tag: info[2].toLowerCase(), closing: info[1] === '/', attrs: info[1] ? {} : parseAttributes(raw), start: match.index, end: pattern.lastIndex });
  }
  return result;
}

function elements(markup, predicate) {
  const found = [];
  const stack = [];
  for (const token of tokens(markup)) {
    if (!token.closing) {
      const record = { tag: token.tag, attrs: token.attrs, start: token.start, openEnd: token.end, end: token.end, inner: '' };
      if (predicate(record)) found.push(record);
      if (!VOID_TAGS.has(token.tag)) stack.push(record);
    } else {
      let index = stack.length - 1;
      while (index >= 0 && stack[index].tag !== token.tag) index--;
      if (index >= 0) {
        for (let i = stack.length - 1; i >= index; i--) {
          const record = stack.pop();
          if (record.tag === token.tag) {
            record.end = token.end;
            record.inner = markup.slice(record.openEnd, token.start);
          }
        }
      }
    }
  }
  return found;
}

function byClass(markup, className) {
  return elements(markup, el => (el.attrs.class || '').split(/\s+/).includes(className));
}

function text(markup) {
  return decode(String(markup || '')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, ' ')
    .replace(/<br\b[^>]*>/gi, ' ')
    .replace(/<\/(?:p|div|section|article|header|footer|nav|main|h[1-6]|li|button|a|summary|dt|dd|tr|td|th)\s*>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();
}

function attrsOf(attrs, names) {
  return Object.fromEntries(names.map(name => [name, attrs[name] ?? null]));
}

function links(markup) {
  return elements(markup, el => el.tag === 'a' && !(el.attrs.class || '').split(/\s+/).includes('skip-link')).map(el => ({
    href: el.attrs.href ?? null,
    text: text(el.inner),
    title: el.attrs.title ?? null,
    target: el.attrs.target ?? null,
    rel: el.attrs.rel ?? null
  }));
}

function snapshot(file, html) {
  const cardClass = file === 'asistenti.html' ? 'assistant-card' : 'catalog-card';
  const cards = byClass(html, cardClass).filter(card => !card.inner.includes('Název asistenta'));
  const cardRecords = cards.map(card => {
    const title = byClass(card.inner, file === 'asistenti.html' ? 'assistant-name' : 'catalog-card-title')[0];
    const description = byClass(card.inner, file === 'asistenti.html' ? 'assistant-desc' : 'catalog-card-desc')[0];
    return {
      title: title ? text(title.inner) : null,
      description: description ? text(description.inner) : null,
      text: text(card.inner),
      links: links(card.inner),
      images: elements(card.inner, el => el.tag === 'img').map(el => attrsOf(el.attrs, ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'])),
      data: Object.fromEntries(Object.entries(card.attrs).filter(([key]) => key === 'id' || key.startsWith('data-')))
    };
  });
  const metas = elements(html, el => el.tag === 'meta').map(el => attrsOf(el.attrs, ['name', 'property', 'http-equiv', 'content']))
    .filter(meta => meta.name || meta.property || meta['http-equiv']);
  const canonical = elements(html, el => el.tag === 'link' && (el.attrs.rel || '').toLowerCase().split(/\s+/).includes('canonical')).map(el => el.attrs.href || null);
  const title = elements(html, el => el.tag === 'title')[0];
  const header = elements(html, el => el.tag === 'header' && (el.attrs.class || '').split(/\s+/).includes('site-header'))[0];
  const footer = elements(html, el => el.tag === 'footer')[0];
  const nav = byClass(html, 'site-nav-pilot')[0];
  const navLinks = nav ? links(nav.inner) : [];
  const filterButtons = elements(html, el => el.tag === 'button' && el.attrs['data-platform'] !== undefined).map(button => ({
    text: text(button.inner),
    platform: button.attrs['data-platform'],
    pressed: button.attrs['aria-pressed'] ?? null
  }));
  return {
    file,
    title: title ? text(title.inner) : '',
    metadata: metas,
    canonical,
    headings: elements(html, el => /^h[1-6]$/.test(el.tag)).map(el => ({ level: Number(el.tag[1]), text: text(el.inner) })),
    contentText: text(html.slice(header?.end ?? 0, footer?.start ?? html.length)),
    cards: cardRecords,
    links: links(html),
    images: elements(html, el => el.tag === 'img').map(el => attrsOf(el.attrs, ['src', 'alt', 'title', 'width', 'height', 'loading', 'decoding'])),
    publicIds: [...new Set(tokens(html).filter(token => !token.closing && token.attrs.id).map(token => token.attrs.id))],
    navigation: navLinks,
    filters: filterButtons,
    scripts: elements(html, el => el.tag === 'script').map(el => ({ src: el.attrs.src ?? null, defer: 'defer' in el.attrs, async: 'async' in el.attrs })),
    noJavaScript: file === 'katalog-asistenti.html'
      ? { cardsVisible: 2, emptyStateVisible: true, filtersVisible: true, navigationLinks: 6 }
      : { cardsVisible: 9, navigationLinks: 6 },
    withJavaScript: file === 'katalog-asistenti.html'
      ? { initialVisibleCards: 2, initialEmptyStateVisible: false, filters: { all: 2, gpt: 1, gem: 2, claude: 1 }, emptyFilterShowsEmptyState: true }
      : { cardsVisible: 9 }
  };
}

function capture(directory) {
  const pages = {};
  for (const file of PAGE_FILES) pages[file] = snapshot(file, fs.readFileSync(path.join(directory, file), 'utf8'));
  return { baselineSha: '2ddaab92e024cd4bafb638f9ea0e62835ef10d27', pages };
}

if (require.main === module) {
  const [directory, output] = process.argv.slice(2);
  if (!directory || !output) throw new Error('Usage: node scripts/assistant-pages-baseline.js <source-dir> <output.json>');
  fs.writeFileSync(output, JSON.stringify(capture(directory), null, 2) + '\n');
}

module.exports = { PAGE_FILES, snapshot, capture, text };
