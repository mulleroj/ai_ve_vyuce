const PAGE_FILES = [
  'anglictina.html', 'cestina.html', 'dejepis.html', 'matematika.html', 'prirodoveda.html'
];
const VOID_TAGS = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
function decodeEntities(value) {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', hellip: '…', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', bull: '•', middot: '·', copy: '©', reg: '®', euro: '€' };
  return String(value || '').replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (entity, code) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : entity;
    }
    return Object.prototype.hasOwnProperty.call(named, code.toLowerCase()) ? named[code.toLowerCase()] : entity;
  });
}
function parseAttributes(tagSource) {
  const nameMatch = tagSource.match(/^<\s*\/?\s*([a-z][a-z0-9:-]*)/i);
  if (!nameMatch) return {};
  const rest = tagSource.slice(nameMatch[0].length).replace(/\/?>\s*$/, '');
  const attrs = {};
  const re = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  let match;
  while ((match = re.exec(rest))) {
    const key = match[1].toLowerCase();
    if (!(key in attrs)) attrs[key] = decodeEntities(match[2] ?? match[3] ?? match[4] ?? '');
  }
  return attrs;
}
function tokens(markup) {
  const out = [];
  const re = /<!--[\s\S]*?-->|<![^>]*>|<\/?[a-z][a-z0-9:-]*(?:"[^"]*"|'[^']*'|[^'">])*>/gi;
  let match;
  while ((match = re.exec(markup))) {
    const raw = match[0];
    if (raw.startsWith('<!--') || raw.startsWith('<!')) continue;
    const parts = raw.match(/^<\s*(\/?)\s*([a-z][a-z0-9:-]*)/i);
    if (!parts) continue;
    const closing = parts[1] === '/';
    const tag = parts[2].toLowerCase();
    out.push({ raw, tag, closing, attrs: closing ? {} : parseAttributes(raw), start: match.index, end: re.lastIndex });
    if (!closing && (tag === 'script' || tag === 'style')) {
      const close = new RegExp('</' + tag + '\\s*>', 'ig');
      close.lastIndex = re.lastIndex;
      const rawEnd = close.exec(markup);
      if (rawEnd) {
        out.push({ raw: rawEnd[0], tag, closing: true, attrs: {}, start: rawEnd.index, end: close.lastIndex });
        re.lastIndex = close.lastIndex;
      }
    }
  }
  return out;
}
function elements(markup, predicate) {
  const found = [];
  const stack = [];
  for (const token of tokens(markup)) {
    if (!token.closing) {
      const rec = { tag: token.tag, attrs: token.attrs, start: token.start, openEnd: token.end, end: token.end, inner: '' };
      if (predicate(rec)) found.push(rec);
      if (!VOID_TAGS.has(token.tag)) stack.push(rec);
    } else {
      let index = stack.length - 1;
      while (index >= 0 && stack[index].tag !== token.tag) index--;
      if (index >= 0) {
        for (let i = stack.length - 1; i >= index; i--) {
          const rec = stack.pop();
          if (rec.tag === token.tag) {
            rec.end = token.end;
            rec.inner = markup.slice(rec.openEnd, token.start);
          }
        }
      }
    }
  }
  return found;
}
function classElements(markup, className) {
  return elements(markup, el => (el.attrs.class || '').split(/\s+/).includes(className));
}
function plainText(markup) {
  return decodeEntities(String(markup || '')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, ' ')
    .replace(/<br\b[^>]*>/gi, ' ')
    .replace(/<\/(?:p|div|section|article|header|footer|nav|main|h[1-6]|li|button|a|summary|dt|dd|tr|td|th)\s*>/gi, ' ')
    .replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .trim();
}
function pick(attrs, keys) {
  const out = {};
  for (const key of keys) out[key] = attrs[key] ?? null;
  return out;
}
function attrMap(attrs, predicate) {
  const out = {};
  for (const [key, value] of Object.entries(attrs)) if (predicate(key)) out[key] = value;
  return out;
}
function hashText(value) {
  let hash = 0xcbf29ce484222325n;
  const text = String(value || '');
  for (let i = 0; i < text.length; i++) {
    hash ^= BigInt(text.charCodeAt(i));
    hash = BigInt.asUintN(64, hash * 0x100000001b3n);
  }
  return hash.toString(16).padStart(16, '0');
}
function snapshotPage(html) {
  const bodyMatch = html.match(/<body\b[^>]*>([\s\S]*?)<\/body\s*>/i);
  const body = bodyMatch ? bodyMatch[1] : html;
  const headings = elements(body, el => /^h[1-6]$/.test(el.tag)).map(el => ({ level: Number(el.tag[1]), text: plainText(el.inner) }));
  const cards = classElements(body, 'activity-card').map(card => {
    const title = classElements(card.inner, 'activity-title')[0];
    const description = classElements(card.inner, 'activity-desc')[0];
    const cardButtons = elements(card.inner, el => el.tag === 'button').map(button => ({
      text: plainText(button.inner),
      attributes: attrMap(button.attrs, key => key !== 'onclick' && (key === 'aria-label' || key === 'aria-controls' || key === 'aria-expanded' || key === 'type' || key === 'title' || key === 'disabled' || key === 'id')),
      onclickHash: button.attrs.onclick ? hashText(button.attrs.onclick) : null
    }));
    return {
      title: title ? plainText(title.inner) : null,
      description: description ? plainText(description.inner) : null,
      text: plainText(card.inner),
      data: attrMap(card.attrs, key => key === 'id' || key.startsWith('data-')),
      buttons: cardButtons
    };
  });
  const links = elements(body, el => el.tag === 'a').map(link => ({
    href: link.attrs.href ?? null,
    text: plainText(link.inner),
    ariaLabel: link.attrs['aria-label'] ?? null,
    title: link.attrs.title ?? null,
    target: link.attrs.target ?? null,
    rel: link.attrs.rel ?? null,
    class: link.attrs.class ?? null
  }));
  const images = elements(body, el => el.tag === 'img').map(img => pick(img.attrs, ['src','alt','title','width','height','loading','decoding']));
  const publicIds = tokens(body).filter(token => !token.closing && token.attrs.id).map(token => token.attrs.id);
  const buttons = elements(body, el => el.tag === 'button').map(button => ({
    text: plainText(button.inner),
    attributes: attrMap(button.attrs, key => key !== 'onclick' && (key === 'id' || key === 'type' || key === 'aria-label' || key === 'aria-controls' || key === 'aria-expanded' || key === 'aria-pressed' || key === 'aria-current' || key === 'disabled')),
    onclickHash: button.attrs.onclick ? hashText(button.attrs.onclick) : null
  }));
  const metas = elements(html, el => el.tag === 'meta').map(el => pick(el.attrs, ['name','property','http-equiv','content'])).filter(meta => meta.name || meta.property || meta['http-equiv']);
  const canonical = elements(html, el => el.tag === 'link' && (el.attrs.rel || '').toLowerCase().split(/\s+/).includes('canonical')).map(el => el.attrs.href || null);
  const title = elements(html, el => el.tag === 'title')[0];
  const siteNav = classElements(body, 'site-nav-pilot')[0];
  const navLinks = siteNav ? elements(siteNav.inner, el => el.tag === 'a').map(el => ({ href: el.attrs.href ?? null, text: plainText(el.inner) })) : [];
  const scripts = elements(html, el => el.tag === 'script' && el.attrs.src).map(el => el.attrs.src);
  return {
    bodyText: plainText(body),
    headings,
    cards,
    links,
    images,
    publicIds,
    buttons,
    seo: { title: title ? plainText(title.inner) : '', canonical, metas },
    subjectNavigation: navLinks,
    activityLibraryLinks: links.filter(link => /aktivit|activity/i.test(link.href || '')),
    scripts
  };
}
module.exports = { PAGE_FILES, snapshotPage, plainText };