const fs = require('node:fs');
const { execFileSync } = require('node:child_process');

const PAGE_FILES = [
  'prompty.html',
  'vibe-coding-prompty.html',
  'gemini-notebook-prompty.html',
  'copilot-pro-ucitele.html',
  'perplexity-pro-ucitele.html',
  'google-ai-studio-2026-vibe-coding.html',
  'vibe-coding-clanky.html',
  'vibe-coding.html'
];
const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']);
const NAMED = { amp:'&', lt:'<', gt:'>', quot:'"', apos:"'", nbsp:' ', ndash:'–', mdash:'—', hellip:'…', rsquo:'’', lsquo:'‘', rdquo:'”', ldquo:'“', bull:'•', middot:'·', copy:'©', reg:'®', euro:'€', laquo:'«', raquo:'»' };
function decode(value='') {
  return String(value).replace(/\r\n?/g,'\n').replace(/&(#x[\da-f]+|#\d+|[a-z]+);/gi, (entity, code) => {
    if (code[0] === '#') {
      const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isFinite(n) ? String.fromCodePoint(n) : entity;
    }
    return NAMED[code.toLowerCase()] ?? entity;
  });
}
function attrs(raw) {
  const tag = raw.match(/^<\s*[a-z][\w:-]*/i)?.[0] || '';
  const rest = raw.slice(tag.length).replace(/\/?\s*>\s*$/, '');
  const out = {};
  const re = /([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g;
  for (const m of rest.matchAll(re)) out[m[1].toLowerCase()] ??= decode(m[2] ?? m[3] ?? m[4] ?? '');
  return out;
}
function scan(markup) {
  const all = [], stack = [];
  const re = /<!--[\s\S]*?-->|<![^>]*>|<\/?[a-z][a-z0-9:-]*(?:"[^"]*"|'[^']*'|[^'">])*>/gi;
  for (const m of markup.matchAll(re)) {
    const raw = m[0];
    if (raw.startsWith('<!--') || raw.startsWith('<!')) continue;
    const info = raw.match(/^<\s*(\/?)\s*([a-z][a-z0-9:-]*)/i);
    if (!info) continue;
    const closing = info[1] === '/', tag = info[2].toLowerCase();
    if (!closing) {
      const a = attrs(raw);
      const el = { tag, attrs:a, start:m.index, openEnd:m.index + raw.length, end:m.index + raw.length, ancestors:stack.map(x=>x.attrs), inner:'' };
      all.push(el);
      if (!VOID.has(tag)) stack.push(el);
    } else {
      let i = stack.length - 1;
      while (i >= 0 && stack[i].tag !== tag) i--;
      if (i >= 0) {
        const el = stack[i]; el.end = m.index + raw.length; el.inner = markup.slice(el.openEnd, m.index);
        stack.length = i;
      }
    }
  }
  return all;
}
function txt(s='') {
  return decode(String(s).replace(/<!--[\s\S]*?-->/g,' ').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,' ').replace(/<br\b[^>]*>/gi,' ').replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();
}
function classes(a={}) { return new Set((a.class || '').split(/\s+/).filter(Boolean)); }
function commonHeader(el) { return [...el.ancestors, el.attrs].some(a => classes(a).has('site-header')); }
function select(all, pred) { return all.filter(pred); }
function snapshot(file, html) {
  const all = scan(html), visible = el => !commonHeader(el);
  const metas = select(all, e => e.tag === 'meta' && (e.attrs.name || e.attrs.property || e.attrs['http-equiv']))
    .map(e => ({name:e.attrs.name??null,property:e.attrs.property??null,httpEquiv:e.attrs['http-equiv']??null,content:e.attrs.content??null}));
  const title = all.find(e => e.tag === 'title');
  const canonical = select(all, e => e.tag === 'link' && (e.attrs.rel||'').toLowerCase().split(/\s+/).includes('canonical')).map(e => e.attrs.href||null);
  const textRanges = all.filter(e => (e.tag === 'header' && classes(e.attrs).has('site-header')) || (e.tag === 'a' && classes(e.attrs).has('skip-link') && !e.ancestors.some(a=>classes(a).has('site-header')))).map(e => [e.start,e.end]).filter(([a,b])=>b>a).sort((a,b)=>b[0]-a[0]);
  let bodyTextSource = html;
  for (const [a,b] of textRanges) bodyTextSource = bodyTextSource.slice(0,a) + bodyTextSource.slice(b);
  const headings = select(all,e=>/^h[1-6]$/.test(e.tag)&&visible(e)).map(e=>({level:+e.tag[1],text:txt(e.inner)}));
  const links = select(all,e=>e.tag==='a'&&visible(e)&&!classes(e.attrs).has('skip-link')).map(e=>({href:e.attrs.href??null,text:txt(e.inner),title:e.attrs.title??null,target:e.attrs.target??null,rel:e.attrs.rel??null}));
  const images = select(all,e=>e.tag==='img'&&visible(e)).map(e=>({src:e.attrs.src??null,alt:e.attrs.alt??null,title:e.attrs.title??null,width:e.attrs.width??null,height:e.attrs.height??null}));
  const ids = [...new Set(select(all,e=>e.attrs.id&&!commonHeader(e)).map(e=>e.attrs.id))];
  const prompts = select(all,e=>e.tag==='div'&&classes(e.attrs).has('prompt-card')).map(card=>({
    id:card.attrs.id??null, data:Object.fromEntries(Object.entries(card.attrs).filter(([k])=>k.startsWith('data-'))), text:txt(card.inner),
    body:select(scan(card.inner),e=>e.tag==='div'&&classes(e.attrs).has('prompt-body')).map(e=>txt(e.inner)),
    copyButtons:select(scan(card.inner),e=>e.tag==='button'&&classes(e.attrs).has('copy-btn')).map(e=>({text:txt(e.inner),dataCopy:e.attrs['data-copy']??null}))
  }));
  const scripts = select(all,e=>e.tag==='script'&&e.attrs.src).map(e=>e.attrs.src);
  const nonSharedNav = select(all,e=>e.tag==='nav'&&visible(e)).map(nav=>({label:nav.attrs['aria-label']??null,links:select(scan(nav.inner),e=>e.tag==='a').map(e=>({href:e.attrs.href??null,text:txt(e.inner)}))}));
  return {file,title:title?txt(title.inner):'',metadata:metas,canonical,headings,contentText:txt(bodyTextSource.slice(bodyTextSource.indexOf('<body'))),links,images,publicIds:ids,prompts,navigation:nonSharedNav,scripts};
}
function captureFromGit(sha) {
  const pages = {};
  for (const file of PAGE_FILES) pages[file] = snapshot(file, execFileSync('git',['show',`${sha}:${file}`],{encoding:'utf8'}));
  return {baselineSha:sha,pages};
}
if (require.main === module) {
  const [sha, output] = process.argv.slice(2);
  if (!sha || !output) throw new Error('Usage: node scripts/wave23-page-baseline.js <baseline-sha> <output.json>');
  fs.writeFileSync(output, JSON.stringify(captureFromGit(sha),null,2)+'\n');
}
module.exports = {PAGE_FILES,snapshot,captureFromGit};


