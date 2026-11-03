#!/usr/bin/env node
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const check = process.argv.includes('--check');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const write = (p, value) => {
  const target = path.join(root, p);
  if (check) {
    if (!fs.existsSync(target) || fs.readFileSync(target, 'utf8') !== value) throw new Error(`${p} is stale; run node scripts/build-catalog-pages.js`);
    console.log(`OK ${p}`);
  } else fs.writeFileSync(target, value);
};
const escape = v => String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const context = { window: {} };
vm.runInNewContext(read('js/site-articles.js'), context);
const articles = context.window.siteArticles;
if (!Array.isArray(articles) || articles.length !== 77) throw new Error(`Expected 77 catalog items, found ${articles?.length}`);
const hrefs = new Set();
for (const a of articles) {
  for (const field of ['href','title','summary','category','date','dateLabel','icon','tags','badgeClass']) if (!a[field]) throw new Error(`${a.href || '(no href)'} missing ${field}`);
  if (hrefs.has(a.href)) throw new Error(`Duplicate catalog href ${a.href}`);
  hrefs.add(a.href);
  if (!fs.existsSync(path.join(root, a.href))) throw new Error(`Missing article target ${a.href}`);
}
const mainGroups = [
  {id:'novinky', title:'AI ve vzdělávání', lead:'Změny, novinky a myšlenky, které ovlivňují školu a každodenní práci učitele.', match:a=>a.contentType==='magazine'||a.category==='AI ve vzdělávání'||a.category==='Novinka'||a.category==='Filozofování s AI'},
  {id:'navody', title:'Praktické návody', lead:'Konkrétní nástroje a postupy, které můžete vyzkoušet při přípravě i ve výuce.', match:a=>a.contentType==='guide'||a.contentType==='tool-guide'||a.category==='Návod'||a.category==='Nástroj krok za krokem'||a.category==='Nástroj'},
  {id:'workflow', title:'Workflow pro učitele', lead:'Ověřené pracovní postupy, které propojují nástroje a jednotlivé kroky.', match:a=>a.contentType==='workflow'||a.category==='Workflow'||a.category==='AI V PRAXI'},
  {id:'temata', title:'AI agenti, nástroje a další témata', lead:'Další články o AI asistentech, vibe codingu, přípravě výuky a souvisejících tématech.', match:a=>!mainGroups.slice(0,3).some(g=>g.match(a))}
];
const guides = articles.filter(a => ['guide','tool-guide','workflow'].includes(a.contentType) || ['Návod','Nástroj krok za krokem','Workflow'].includes(a.category));
const guideHrefSet = new Set(guides.map(a=>a.href));
const preservedGuideLinks=['ai-novinka-ai-duvod-premyslet.html','ai-navod-gemini-notebook-priprava.html','ai-navod-gemini-notebook-vyuka.html','ai-navod-commands-chatgpt.html','ai-navod-gemini-notebook-infografiky.html','ai-navod-prep-prompty.html','ai-navod-edit-kontrola.html','ai-navod-chatgpt-vizualni-materialy.html','ai-navod-7-univerzalnich-promptu.html'];
for (const href of preservedGuideLinks) if(!hrefs.has(href)) throw new Error(`Old guide target missing from central catalog: ${href}`);
const header = (title, desc, isGuide=false) => {
 const metadata = isGuide ? {
   title:'Praktické návody pro AI ve výuce | AI ve Výuce',
   description:'Praktické návody pro učitele: jak začít s AI, psát dobrá zadání a kontrolovat výstupy.',
   ogTitle:'Praktick&#233; n&#225;vody pro AI ve v&#253;uce | AI ve V&#253;uce',
   ogDescription:'Praktick&#233; n&#225;vody pro učitele: jak zač&#237;t s AI, ps&#225;t dobr&#225; zad&#225;n&#237; a kontrolovat v&#253;stupy.'
 } : {
   title:'AI pro vzdělávání – AI ve vzdělávání: co opravdu stojí za pozornost | AI ve Výuce',
   description:'AI ve vzdělávání: co opravdu stojí za pozornost, praktické návody a workflow pro učitele. Objevujte možnosti umělé inteligence ve výuce krok za krokem.',
   ogTitle:'AI pro vzděl&#225;v&#225;n&#237; – AI ve vzděl&#225;v&#225;n&#237;: co opravdu stoj&#237; za pozornost | AI ve V&#253;uce',
   ogDescription:'AI ve vzděl&#225;v&#225;n&#237;: co opravdu stoj&#237; za pozornost, praktick&#233; n&#225;vody a workflow pro učitele. Objevujte možnosti uměl&#233; inteligence ve v&#253;uce krok za krokem.'
 };
 const canonical = 'https://ai-ve-vyuce.netlify.app/'+(isGuide?'ai-navody':'ai');
 const icons = [[16,'favicon-16x16.png'],[32,'favicon-32x32.png'],[48,'favicon-48x48.png'],[64,'favicon-64x64.png'],[192,'icon-192.png'],[512,'favicon-512.png']].map(([size,src]) => '<link rel="icon" type="image/png" sizes="'+size+'px" href="/'+src+'?v=robot-20261103">').join('\n  ');
 const nav = '<nav id="primary-nav" class="primary-nav" aria-label="Hlavní navigace"><a href="index.html">Úvod</a><a href="ai.html"'+(isGuide?'':' aria-current="page"')+'>AI obsah</a><a href="ai-navody.html"'+(isGuide?' aria-current="page"':'')+'>Praktické návody</a><a href="ai-novinky.html">Novinky</a></nav>';
 return ['<!DOCTYPE html>','<html lang="cs"><head>','<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1">','<title>'+escape(metadata.title)+'</title><meta name="description" content="'+escape(metadata.description)+'">','<link rel="canonical" href="'+canonical+'"><meta property="og:title" content="'+metadata.ogTitle+'"><meta property="og:description" content="'+metadata.ogDescription+'"><meta property="og:url" content="'+canonical+'">',icons,'<link rel="shortcut icon" href="/favicon.ico?v=robot-20261103">','<link rel="stylesheet" href="css/catalog-directory.css?v=20261103-catalog">','</head><body>','<a class="skip-link" href="#obsah">Přejít na obsah</a>','<header class="site-header"><div class="site-header-inner"><a class="brand" href="index.html" aria-label="AI ve Výuce – úvodní stránka"><span class="brand-mark" aria-hidden="true">AI</span><span>AI ve Výuce</span></a><button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">Menu</button>'+nav+'</div></header>','<main id="obsah">'].join('\n');
};
const robot = `<div class="catalog-hero-art" aria-hidden="true"><img src="images/ai-ve-vyuce-robot-navody-transparentni.webp" alt="" width="1754" height="897" fetchpriority="high"></div>`;
const hero = (title, lead, isGuide=false) => `<section class="catalog-hero"><div class="catalog-hero-copy"><p class="eyebrow">AI ve výuce 2.0 · ${isGuide?'Prakticky a krok za krokem':'Rozcestník obsahu'}</p><h1>${title}</h1><p class="hero-lead">${lead}</p><div class="hero-links"><a href="#${isGuide?'katalog-navodu':'novinky'}">Prohlédnout obsah <span aria-hidden="true">↓</span></a>${isGuide?'<a class="subtle-link" href="ai.html">Všechny články AI</a>':''}</div></div>${robot}</section>`;
const card = a => {
 const image = a.image && fs.existsSync(path.join(root,a.image)) ? `<div class="card-media"><img src="${escape(a.image)}" alt="${escape(a.imageAlt||'')}" loading="lazy"></div>` : `<div class="card-media card-fallback" aria-hidden="true"><span>${escape(a.icon)}</span></div>`;
 return `<article class="article-card" data-card data-href="${escape(a.href)}" data-category="${escape(a.category)}" data-content-type="${escape(a.contentType||'')}" data-search="${escape([a.title,a.summary,a.category,a.tags.join(' '),a.href].join(' '))}"><a class="card-link" href="${escape(a.href)}">${image}<div class="card-copy"><div class="card-meta"><span class="category-pill">${escape(a.category)}</span><time datetime="${escape(a.date)}">${escape(a.dateLabel)}</time></div><h3>${escape(a.title)}</h3><p>${escape(a.summary)}</p><span class="card-cta">${a.contentType==='workflow'||a.category==='Workflow'?'Otevřít workflow':'Číst článek'} <span aria-hidden="true">→</span></span></div></a></article>`;
};
const end = `</main><footer class="site-footer"><div class="footer-inner"><a class="brand" href="index.html"><span class="brand-mark" aria-hidden="true">AI</span><span>AI ve Výuce</span></a><p>Praktické a srozumitelné využití AI ve vzdělávání.</p><a href="#obsah">Zpět nahoru ↑</a></div></footer><script src="js/catalog-directory.js?v=20261103-catalog" defer></script><script src="js/site-footer.js?v=20260927-human-loop" defer></script></body></html>\n`;
function filters() { return `<section class="catalog-controls" aria-label="Vyhledávání a filtrování"><div class="controls-inner"><label class="search-label" for="catalog-search">Hledat články, návody a workflow</label><div class="search-row"><input id="catalog-search" type="search" data-query placeholder="Např. Gemini Notebook nebo bezpečnost" autocomplete="off"><button type="button" class="clear-button" data-clear hidden>Vymazat</button></div><div class="filter-block"><span class="filter-label" id="filter-label">Témata</span><div class="filter-list" role="group" aria-labelledby="filter-label"><button type="button" data-filter="all" aria-pressed="true">Vše</button><button type="button" data-filter="chatgpt" aria-pressed="false">ChatGPT</button><button type="button" data-filter="gemini" aria-pressed="false">Gemini</button><button type="button" data-filter="microsoft" aria-pressed="false">Microsoft</button><button type="button" data-filter="vibe-coding" aria-pressed="false">Vibe Coding</button><button type="button" data-filter="philosophy" aria-pressed="false">Filozofování s AI</button></div></div><p class="result-status" data-status role="status" aria-live="polite"></p><p class="empty-state" data-empty hidden>Nenašli jsme žádné články. Zkuste upravit hledaný výraz nebo filtr.</p></div></section>`; }
const mainHtml = () => {
 const groups = mainGroups.map(g=>{const items=articles.filter(g.match); return `<section id="${g.id}" class="catalog-section" data-section><div class="section-heading"><div><p class="eyebrow">${g.id==='novinky'?'Co stojí za pozornost':g.id==='navody'?'Použitelné hned':'Osvědčené postupy'}</p><h2>${g.title}</h2><p>${g.lead}</p></div><span class="section-count">${items.length} položek</span></div><div class="card-grid">${items.map(card).join('')}</div></section>`;}).join('');
 return header('AI pro vzdělávání – rozcestník článků | AI ve Výuce','Přehled článků, praktických návodů a workflow o využití AI ve vzdělávání.')+hero('AI ve vzdělávání: co opravdu stojí za pozornost','Objevujte novinky, praktické návody a ověřené pracovní postupy pro smysluplné využití AI ve škole.')+`<nav class="catalog-jump" aria-label="Tematické sekce">${mainGroups.map(g=>`<a href="#${g.id}">${g.title}</a>`).join('')}</nav>`+filters()+`<div class="catalog-content">${groups}<noscript><p class="noscript-note">Všechny články jsou zobrazené. Vyhledávání a filtrování vyžaduje JavaScript.</p></noscript></div>`+end;
};
const guideHtml = () => {
 const relevant=articles.filter(a=>guideHrefSet.has(a.href)||a.href==='ai-novinka-ai-duvod-premyslet.html');
 return header('Praktické návody a workflow pro učitele | AI ve Výuce','Krokové návody a pracovní postupy pro bezpečné a smysluplné využití AI ve výuce.',true)+hero('Praktické návody pro učitele','Od prvního bezpečného kroku až po hotový výukový workflow. Vyberte si postup podle nástroje nebo cíle.',true)+`<section id="katalog-navodu" class="catalog-content guide-content"><div class="section-heading"><div><p class="eyebrow">Vyberte si postup</p><h2>Návody a workflow</h2><p>Konkrétní postupy, které můžete upravit podle své třídy a předmětu.</p></div><span class="section-count">${relevant.length} položek</span></div>${filters()}<div class="card-grid">${relevant.map(card).join('')}</div><noscript><p class="noscript-note">Všechny návody jsou zobrazené. Vyhledávání a filtrování vyžaduje JavaScript.</p></noscript><aside class="starter-notes"><h2>Začněte jednoduše</h2><div class="starter-grid"><article id="zacatek-s-ai"><h3>Jak začít s AI ve výuce</h3><p>Začněte malým, konkrétním úkolem: například návrhem pěti otázek k textu nebo dvěma variantami procvičení. Popište předmět, věk žáků, čas a cíl hodiny.</p><p>První výstup berte jako návrh. Projděte ho, opravte a vyzkoušejte v malém. Tím si vytvoříte vlastní ověřený postup, který můžete později opakovat.</p></article><article id="zadani"><h3>Jak psát zadání, která fungují</h3><p>Dobré zadání obsahuje roli, cíl, kontext, omezení a požadovaný formát výstupu. Místo „vytvoř pracovní list“ napište, pro koho je určený, co má procvičit, jak dlouho má trvat a jak má vypadat.</p><p>Pokud výsledek není vhodný, zadání zpřesněte v dalším kroku. Požádejte o jinou obtížnost, kratší text, více příkladů nebo tabulku s řešením.</p></article><article id="kontrola-vystupu"><h3>Jak kontrolovat výstupy AI</h3><p>Nejprve ověřte fakta a výpočty. Potom zkontrolujte, zda odpověď odpovídá věku žáků, používá srozumitelný jazyk a neobsahuje skryté předpoklady nebo nevhodné příklady.</p><p>Nakonec ověřte zdroje a citlivá data. Do finálního materiálu patří jen to, co jste sami zkontrolovali a co odpovídá cíli vaší hodiny.</p></article></div></aside></section>`+end;
};
write('ai.html',mainHtml()); write('ai-navody.html',guideHtml());

