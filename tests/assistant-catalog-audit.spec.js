const { test }=require('@playwright/test');
const fs=require('node:fs'),path=require('node:path');
const BASE='http://127.0.0.1:4173';
const TARGET_SHA=process.env.AUDIT_TARGET_SHA||'unknown';
const files=['asistenti.html','katalog-asistenti.html'];
const widths=[320,390,420,540,600,601,768,769,800,801,900,1100,1101,1440];
const report={targetSha:TARGET_SHA,pages:[],duplicateHrefGroups:[],findings:[],manualReview:[],noJs:[]};
const artifact=(name)=>path.join('artifacts',name);
fs.mkdirSync('artifacts',{recursive:true});

test('capture page inventories, screenshots, interactions, responsive states and axe evidence',async({browser})=>{
  const context=await browser.newContext({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const page=await context.newPage(),runtimeErrors=[];
  page.on('pageerror',e=>runtimeErrors.push(e.message));
  page.on('response',r=>{if(r.url().startsWith(BASE)&&r.status()>=400)runtimeErrors.push('HTTP '+r.status()+' '+r.url())});

  for(const file of files){
    const slug=file.replace('.html','');
    await page.setViewportSize({width:1440,height:1000});
    await page.goto(BASE+'/'+file,{waitUntil:'networkidle'});
    await page.addStyleTag({content:'.reveal{opacity:1!important;transform:none!important;transition:none!important}'});
    const info=await page.evaluate(()=>{
      const cards=[...document.querySelectorAll('.assistant-card,.catalog-card')].map(card=>{
        const title=card.querySelector('.assistant-name,.catalog-card-title');
        const provider=card.querySelector('.assistant-provider,.catalog-card-platform');
        const desc=card.querySelector('.assistant-desc,.catalog-card-desc');
        return {tag:card.tagName,classes:card.className,title:title?.innerText.trim()||null,provider:provider?.innerText.trim()||null,description:desc?.innerText.trim().replace(/\s+/g,' ')||null,links:[...card.querySelectorAll('a[href]')].map(a=>({text:a.innerText.trim(),href:a.getAttribute('href'),ariaLabel:a.getAttribute('aria-label')}))};
      });
      const links=[...document.querySelectorAll('a[href]')].map(a=>({href:a.getAttribute('href'),text:(a.innerText||'').trim().replace(/\s+/g,' '),ariaLabel:a.getAttribute('aria-label'),context:a.closest('.assistant-card,.catalog-card,.footer-links,.site-nav-pilot')?.className||'other'}));
      const counts={};
      for(const l of links){const k=l.href;counts[k]=(counts[k]||0)+1}
      return {
        title:document.title,description:document.querySelector('meta[name="description"]')?.content||null,
        canonical:document.querySelector('link[rel="canonical"]')?.href||null,
        openGraph:Object.fromEntries([...document.querySelectorAll('meta[property^="og:"]')].map(m=>[m.getAttribute('property'),m.content])),
        ids:[...document.querySelectorAll('[id]')].map(e=>({id:e.id,tag:e.tagName,text:(e.innerText||'').trim().slice(0,100)})),
        styles:[...document.querySelectorAll('link[rel="stylesheet"]')].map(e=>e.getAttribute('href')),
        inlineStyleCount:document.querySelectorAll('style').length,
        scripts:[...document.querySelectorAll('script[src]')].map(e=>e.getAttribute('src')),
        images:[...document.images].map(i=>({src:i.getAttribute('src'),alt:i.getAttribute('alt'),complete:i.complete,naturalWidth:i.naturalWidth})),
        headings:[...document.querySelectorAll('h1,h2,h3,h4')].map(h=>({level:h.tagName,id:h.id||null,text:h.innerText.trim()})),
        landmarks:{main:document.querySelectorAll('main').length,roleMain:document.querySelectorAll('[role="main"]').length,nav:[...document.querySelectorAll('nav')].map(n=>n.getAttribute('aria-label'))},
        cardTagCounts:[...document.querySelectorAll('.assistant-card,.catalog-card')].reduce((a,e)=>(a[e.tagName]=(a[e.tagName]||0)+1,a),{}),
        cards,quickCompareRows:[...document.querySelectorAll('table tbody tr')].map(r=>r.innerText.trim().replace(/\s+/g,' ')),
        links,duplicateHrefs:Object.entries(counts).filter(([,n])=>n>1).map(([href,count])=>({href,count})),
        pageBackground:getComputedStyle(document.body).backgroundColor,
        heroBackground:getComputedStyle(document.querySelector('.page-hero')).backgroundColor,
        heroBackgroundImage:getComputedStyle(document.querySelector('.page-hero')).backgroundImage,
        navAreas:[...document.querySelectorAll('.site-nav-area')].map(e=>({id:e.dataset.area,active:e.dataset.active==='true',open:e.open})),
        navLinkCount:document.querySelectorAll('[data-site-navigation] a').length,
        footerLinkCount:document.querySelectorAll('footer a').length,
        semanticLists:document.querySelectorAll('.assistant-grid ul,.assistant-grid ol,.catalog-grid ul,.catalog-grid ol').length
      }
    });
    info.file=file;
    await page.screenshot({path:artifact(slug+'-desktop-1440.png'),fullPage:true});
    info.viewports=[];
    for(const width of widths){
      await page.setViewportSize({width,height:width<500?844:900});
      const g=await page.evaluate(()=>({viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,overflow:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)>innerWidth,nav:(()=>{const r=document.querySelector('.site-nav').getBoundingClientRect();return{x:r.x,right:r.right,bottom:r.bottom}})(),hero:(()=>{const r=document.querySelector('.page-hero').getBoundingClientRect();return{x:r.x,right:r.right,top:r.top}})()}));
      info.viewports.push(g);
      if(width===768||width===390)await page.screenshot({path:artifact(slug+'-'+width+'.png'),fullPage:true});
    }
    if(info.viewports.some(x=>x.overflow))report.findings.push(file+': horizontal overflow at '+info.viewports.filter(x=>x.overflow).map(x=>x.viewport).join(', ')+'px.');

    await page.setViewportSize({width:1440,height:1000});
    await page.goto(BASE+'/'+file,{waitUntil:'networkidle'});
    await page.addStyleTag({content:'.reveal{opacity:1!important;transform:none!important;transition:none!important}'});
    await page.addScriptTag({path:require.resolve('axe-core')});
    info.axe=await page.evaluate(async()=>{const r=await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}});return{violations:r.violations,incomplete:r.incomplete,passes:r.passes.length}});
    for(const v of info.axe.violations)report.findings.push(file+': axe '+v.id+' ('+v.impact+'), '+v.nodes.length+' node(s): '+v.help);
    if(info.axe.incomplete.length)report.manualReview.push({file,checks:info.axe.incomplete.map(v=>({id:v.id,impact:v.impact,help:v.help,nodes:v.nodes.map(n=>({target:n.target,checks:n.any.map(x=>x.message),failureSummary:n.failureSummary||''}))}))});

    if(file==='katalog-asistenti.html'){
      info.filters=[];
      for(const button of await page.locator('.filter-btn').all()){
        const name=(await button.innerText()).trim();
        await button.click();
        info.filters.push(await page.evaluate(name=>({name,pressed:document.querySelector('.filter-btn[aria-pressed="true"]')?.innerText.trim(),visibleCards:[...document.querySelectorAll('.catalog-card')].filter(c=>getComputedStyle(c).display!=='none').map(c=>c.querySelector('.catalog-card-title')?.innerText.trim()),emptyStateVisible:getComputedStyle(document.querySelector('#emptyState')).display!=='none}),name));
      }
    }

    await page.setViewportSize({width:390,height:844});
    await page.goto(BASE+'/'+file,{waitUntil:'networkidle'});
    const toggle=page.locator('.menu-toggle');
    info.mobileKeyboard={toggleCount:await toggle.count(),label:await toggle.getAttribute('aria-label'),expandedBefore:await toggle.getAttribute('aria-expanded')};
    await toggle.focus();
    info.mobileKeyboard.focusVisibleBefore=await toggle.evaluate(e=>e.matches(':focus-visible'));
    await page.keyboard.press('Enter');
    info.mobileKeyboard.expandedAfterEnter=await toggle.getAttribute('aria-expanded');
    info.mobileKeyboard.menuVisibleAfterEnter=await page.locator('#primary-menu').evaluate(e=>getComputedStyle(e).display!=='none');
    info.mobileKeyboard.navLinks=await page.locator('#primary-menu a').allTextContents();
    await page.screenshot({path:artifact(slug+'-mobile-menu-open.png'),fullPage:false});
    await page.keyboard.press('Escape');
    info.mobileKeyboard.expandedAfterEscape=await toggle.getAttribute('aria-expanded');
    info.mobileKeyboard.focusRestored=await toggle.evaluate(e=>document.activeElement===e);
    await page.setViewportSize({width:1440,height:1000});
    const details=page.locator('.site-nav-area[data-area="tools"] summary');
    await details.focus();
    await page.keyboard.press('Enter');
    info.localNavigationKeyboard={open:await page.locator('.site-nav-area[data-area="tools"]').getAttribute('open'),currentPageLinkCount:await page.locator('.site-nav-area[data-area="tools"] a[aria-current="page"]').count()};
    await page.screenshot({path:artifact(slug+'-desktop-local-navigation-open.png'),fullPage:false});
    info.keyboardSequence=[];
    await page.locator('body').click({position:{x:2,y:2}});
    for(let i=0;i<14;i++){
      await page.keyboard.press('Tab');
      info.keyboardSequence.push(await page.evaluate(()=>{const e=document.activeElement;return{tag:e.tagName,text:(e.innerText||'').trim().slice(0,90),ariaLabel:e.getAttribute('aria-label'),href:e.getAttribute('href'),focusVisible:e.matches(':focus-visible')}}));
    }

    const nojs=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
    const p=await nojs.newPage();await p.goto(BASE+'/'+file,{waitUntil:'networkidle'});
    const fallback=await p.evaluate(()=>({file:location.pathname.split('/').pop(),cards:document.querySelectorAll('.assistant-card,.catalog-card').length,emptyStateVisible:!!document.querySelector('#emptyState')&&getComputedStyle(document.querySelector('#emptyState')).display!=='none',navVisible:getComputedStyle(document.querySelector('#primary-menu')).display!=='none',navLinks:[...document.querySelectorAll('#primary-menu a')].map(a=>a.innerText.trim()),overflow:document.documentElement.scrollWidth>innerWidth}));
    report.noJs.push(fallback);await nojs.close();
    report.pages.push(info);
  }
  if(runtimeErrors.length)report.findings.push('Browser runtime/resource errors: '+runtimeErrors.join(' | '));
  const occurrences=new Map();
  for(const p of report.pages)for(const l of p.links){if(!occurrences.has(l.href))occurrences.set(l.href,[]);occurrences.get(l.href).push({page:p.file,text:l.text,context:l.context})}
  report.duplicateHrefGroups=[...occurrences.entries()].filter(([,a])=>a.length>1).map(([href,contexts])=>({href,contexts}));
  fs.writeFileSync(artifact('assistant-catalog-audit.json'),JSON.stringify(report,null,2));
  await context.close();
});
