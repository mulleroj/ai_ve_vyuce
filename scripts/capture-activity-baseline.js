const fs = require('node:fs');
const html = fs.readFileSync(process.argv[2] || 'aktivity.html', 'utf8');
const sha = '9efd3e51b4a5d8a83edf7279bed526c8377d88b0';
const decode = s => s.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (_, x) => {
  if (x[0] === '#') return String.fromCodePoint(x[1].toLowerCase() === 'x' ? parseInt(x.slice(2),16) : Number(x.slice(1)));
  return ({amp:'&',quot:'"',apos:"'",lt:'<',gt:'>',nbsp:'\u00a0'})[x.toLowerCase()];
});
function attrs(source) { const out={}; for(const m of source.matchAll(/(?:^|\s)([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)) out[m[1]]=decode(m[2]??m[3]); return out; }
const cards=[]; let active=null, depth=0;
for (const m of html.matchAll(/<\/?div\b[^>]*>/gi)) {
  const tag=m[0];
  if (!active && /^<div\b/i.test(tag) && /class\s*=\s*["'][^"']*\bactivity-card\b/i.test(tag) && attrs(tag)['data-activity-id']) {
    active={start:m.index,attributes:Object.fromEntries(Object.entries(attrs(tag)).filter(([k])=>k.startsWith('data-')))}; depth=1;
  } else if(active) {
    if(/^<div\b/i.test(tag)) depth++;
    else if(--depth===0){const chunk=html.slice(active.start,m.index+tag.length);const text=decode(chunk.replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim();cards.push({id:active.attributes['data-activity-id'],attributes:active.attributes,text});active=null;}
  }
}
const ids=[...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map(m=>decode(m[1]));
const anchors=[...html.matchAll(/<a\b([^>]*)>(.*?)<\/a>/gis)].map(m=>{const a=attrs(m[1]);return {href:a.href??null,id:a.id??null,text:decode(m[2].replace(/<[^>]*>/g,' ')).replace(/\s+/g,' ').trim()};});
const title=decode((html.match(/<title>(.*?)<\/title>/is)||[])[1]||'').replace(/\s+/g,' ').trim();
const meta={}; for(const m of html.matchAll(/<meta\b[^>]*>/gi)){const a=attrs(m[0]);if(a.name==='description'||a.name==='robots')meta[a.name]=a.content??null;}
for(const m of html.matchAll(/<link\b[^>]*>/gi)){const a=attrs(m[0]);if(a.rel==='canonical')meta.canonical=a.href;}
if(cards.length!==44) throw new Error(`Expected 44 cards, captured ${cards.length}`);
const fixture={baselineSha:sha,page:'aktivity.html',title,meta,activities:cards,ids,anchors};
fs.writeFileSync(process.argv[3] || 'tests/fixtures/activity-library-wave20-baseline.json',JSON.stringify(fixture,null,2)+'\n');
console.log(JSON.stringify({activities:cards.length,uniqueActivities:new Set(cards.map(x=>x.id)).size,ids:ids.length,anchors:anchors.length,title,canonical:meta.canonical}));
