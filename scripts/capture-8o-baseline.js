const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const BASELINE_SHA = '342780b03feb07232852d50a089db290688f04c5';
const PAGE_FILES = [
  'qr-kod.html',
  'asistenti/math-cermat.html',
  'asistenti/metodicky-asistent-gemini.html'
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
      const element = { tag, attrs:attrs(raw), start:m.index, openEnd:m.index + raw.length, end:m.index + raw.length, ancestors:stack.map(x=>x.attrs), inner:'' };
      all.push(element);
      if (!VOID.has(tag)) stack.push(element);
    } else {
      let i = stack.length - 1;
      while (i >= 0 && stack[i].tag !== tag) i--;
      if (i >= 0) {
        const element = stack[i];
        element.end = m.index + raw.length;
        element.inner = markup.slice(element.openEnd, m.index);
        stack.length = i;
      }
    }
  }
  return all;
}
function text(markup='') {
  return decode(String(markup).replace(/<!--[\s\S]*?-->/g,' ').replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,' ').replace(/<br\b[^>]*>/gi,' ').replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();
}
function classes(attrs={}) { return new Set((attrs.class || '').split(/\s+/).filter(Boolean)); }
function snapshot(file, html, qrSource='') {
  const elements = scan(html);
  const select = predicate => elements.filter(predicate);
  const title = elements.find(element => element.tag === 'title');
  const visible = () => true;
  const meta = select(e => e.tag === 'meta' && (e.attrs.name || e.attrs.property || e.attrs['http-equiv']))
    .map(e => ({name:e.attrs.name??null,property:e.attrs.property??null,httpEquiv:e.attrs['http-equiv']??null,content:e.attrs.content??null}));
  const canonical = select(e => e.tag === 'link' && (e.attrs.rel||'').toLowerCase().split(/\s+/).includes('canonical')).map(e => e.attrs.href||null);
  const headings = select(e => /^h[1-6]$/.test(e.tag) && visible(e)).map(e => ({level:Number(e.tag[1]),text:text(e.inner)}));
  const links = select(e => e.tag === 'a' && visible(e)).map(e => ({href:e.attrs.href??null,text:text(e.inner),title:e.attrs.title??null,target:e.attrs.target??null,rel:e.attrs.rel??null,ariaLabel:e.attrs['aria-label']??null}));
  const images = select(e => e.tag === 'img' && visible(e)).map(e => ({src:e.attrs.src??null,alt:e.attrs.alt??null,title:e.attrs.title??null,width:e.attrs.width??null,height:e.attrs.height??null}));
  const publicIds = [...new Set(select(e => e.attrs.id && visible(e)).map(e => e.attrs.id))];
  const controls = select(e => ['input','button','select','textarea'].includes(e.tag) && visible(e)).map(e => {
    const id = e.attrs.id || null;
    const linkedLabel = id ? select(label => label.tag === 'label' && label.attrs.for === id).map(label => text(label.inner)).join(' ') : '';
    const wrapped = select(label => label.tag === 'label' && label.start <= e.start && label.end >= e.end).map(label => text(label.inner)).join(' ');
    return {tag:e.tag,type:e.attrs.type??null,id,name:e.attrs.name??null,value:e.attrs.value??null,placeholder:e.attrs.placeholder??null,required:Object.hasOwn(e.attrs,'required'),disabled:Object.hasOwn(e.attrs,'disabled'),ariaLabel:e.attrs['aria-label']??null,label:linkedLabel || wrapped};
  });
  const forms = select(e => e.tag === 'form' && visible(e)).map(e => ({id:e.attrs.id??null,action:e.attrs.action??null,method:e.attrs.method??null,controls:scan(e.inner).filter(c=>['input','button','select','textarea'].includes(c.tag)).map(c=>({tag:c.tag,type:c.attrs.type??null,id:c.attrs.id??null,name:c.attrs.name??null}))}));
  const scripts = select(e => e.tag === 'script' && visible(e)).map(e => ({src:e.attrs.src??null,inlineSha256:e.attrs.src?null:crypto.createHash('sha256').update(e.inner.replace(/\r\n?/g,'\n')).digest('hex')}));
  const promptBlocks = select(e => e.tag === 'div' && (classes(e.attrs).has('prompt-container') || classes(e.attrs).has('prompt-content'))).map(e => text(e.inner));
  const body = html.match(/<body\b[^>]*>([\s\S]*?)<\/body\s*>/i)?.[1] || html;
  const qrFunctions = qrSource.match(/(?:function\s+([A-Za-z_$][\w$]*)\s*\(|(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:function|\([^)]*\)\s*=>))/g) || [];
  return {
    file,
    title:title?text(title.inner):'',
    metadata:meta,
    canonical,
    headings,
    visibleText:text(body),
    links,
    images,
    publicIds,
    forms,
    controls,
    promptBlocks,
    scripts,
    ...(file === 'qr-kod.html' ? {qrGenerator:{scriptSha256:crypto.createHash('sha256').update(qrSource.replace(/\r\n?/g,'\n')).digest('hex'),functionDeclarations:qrFunctions.map(s=>s.match(/function\s+([\w$]+)/)?.[1] || s.match(/(?:const|let|var)\s+([\w$]+)/)?.[1])}} : {})
  };
}
function capture(sourceDir=path.resolve(__dirname,'..')) {
  const pages = {};
  for (const file of PAGE_FILES) {
    const qrSource = file === 'qr-kod.html' ? fs.readFileSync(path.join(sourceDir,'js/qr-kod.js'),'utf8') : '';
    pages[file] = snapshot(file,fs.readFileSync(path.join(sourceDir,file),'utf8'),qrSource);
  }
  return {baselineSha:BASELINE_SHA,pages};
}
if (require.main === module) {
  const [sourceDir, output] = process.argv.slice(2);
  if (!sourceDir || !output) throw new Error('Usage: node scripts/capture-8o-baseline.js <exact-source-dir> <output.json>');
  fs.writeFileSync(output,JSON.stringify(capture(sourceDir),null,2)+'\n');
}
module.exports = {BASELINE_SHA,PAGE_FILES,snapshot,capture};
