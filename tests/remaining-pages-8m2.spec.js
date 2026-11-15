const { test } = require('@playwright/test');
const axeSource = require('axe-core').source;
const fs = require('node:fs');

const pages = [
  'prompty.html', 'gemini-notebook-prompty.html', 'vibe-coding-prompty.html',
  'qr-kod.html', 'copilot-pro-ucitele.html', 'perplexity-pro-ucitele.html',
  'google-ai-studio-2026-vibe-coding.html', 'vibe-coding-clanky.html',
  'asistenti/math-cermat.html', 'asistenti/metodicky-asistent-gemini.html', 'vibe-coding.html'
];
const widths = [1440, 1024, 768, 390, 320];
const out = 'artifacts/8m2';
const findings = { pages: {}, axe: {}, interactions: {}, notes: [] };
fs.mkdirSync(out, { recursive: true });
function writeReport() {
  fs.writeFileSync(`${out}/report.json`, JSON.stringify(findings,null,2));
  fs.writeFileSync(`${out}/report.md`, '# 8M/2 Browser audit\n\nJSON records per-page viewport metrics, axe-core violations and manual-review items, interaction outcomes, console/network errors, and screenshot paths. Screenshots use exact viewport dimensions.\n');
}
async function runAxe(page) {
  await page.addScriptTag({ content: axeSource, timeout: 5000 });
  return page.evaluate(async () => {
    const timeout = new Promise(resolve => setTimeout(() => resolve({ timedOut:true }), 12000));
    const audit = axe.run(document, { runOnly: { type:'tag', values:['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice'] } }).then(r => ({
      violations:r.violations.map(v=>({id:v.id,impact:v.impact,description:v.description,help:v.help,nodes:v.nodes.map(n=>({target:n.target,html:n.html,summary:n.failureSummary}))})),
      incomplete:r.incomplete.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,html:n.html}))})),passes:r.passes.length
    }));
    return Promise.race([audit,timeout]);
  }, null, {timeout:18000});
}

test.describe('8M/2 rendered audit', () => {
  test.describe.configure({ mode:'serial' });
  test.afterAll(() => {
    writeReport();
    const compact={
      pageCount:Object.keys(findings.pages).length,
      pages:Object.fromEntries(Object.entries(findings.pages).map(([path,p])=>[path,{
        mainCounts:Object.fromEntries(Object.entries(p.widths||{}).map(([w,m])=>[w,m.mainCount])),
        overflows:Object.entries(p.widths||{}).filter(([,m])=>m.horizontalOverflow).map(([w,m])=>({width:w,documentWidth:m.documentWidth,bodyWidth:m.bodyWidth})),
        statuses:Object.fromEntries(Object.entries(p.widths||{}).map(([w,m])=>[w,m.status])),
        mobileMenu:p.mobileMenu,noJavaScript:p.noJavaScript,keyboardFocus:p.keyboardFocus,
        consoleErrors:p.consoleErrors,pageErrors:p.pageErrors,failedRequests:p.failedRequests,httpErrors:p.httpErrors
      }])),
      axe:Object.fromEntries(Object.entries(findings.axe).map(([path,a])=>[path,a?.error?{error:a.error}:{timedOut:!!a?.timedOut,violations:(a?.violations||[]).map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,html:n.html}))})),incomplete:(a?.incomplete||[]).map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,html:n.html}))})),passes:a?.passes}])),
      interactions:findings.interactions,notes:findings.notes
    };
    console.log('8M2_AUDIT_JSON='+JSON.stringify(compact));
  });
  for (const path of pages) {
    test(path, async ({ browser }) => {
      test.setTimeout(120000);
      const slug=path.replaceAll('/','--').replace('.html','');
      const row={widths:{},consoleErrors:[],pageErrors:[],failedRequests:[],httpErrors:[]};
      findings.pages[path]=row;
      const context=await browser.newContext({viewport:{width:1440,height:900},acceptDownloads:true});
      const page=await context.newPage();
      page.setDefaultTimeout(5000);
      page.on('console',m=>{if(m.type()==='error')row.consoleErrors.push(m.text())});
      page.on('pageerror',e=>row.pageErrors.push(String(e)));
      page.on('requestfailed',r=>row.failedRequests.push({url:r.url(),error:r.failure()?.errorText}));
      page.on('response',r=>{if(r.status()>=400)row.httpErrors.push({url:r.url(),status:r.status()})});
      for(const width of widths){
        await page.setViewportSize({width,height:900});
        const response=await page.goto(`http://127.0.0.1:4173/${path}`,{waitUntil:'domcontentloaded',timeout:10000}).catch(e=>{findings.notes.push(`${path} @${width}: ${e.message}`);return null});
        await page.waitForTimeout(100);
        const m=await page.evaluate(()=>({
          title:document.title,mainCount:document.querySelectorAll('main,[role="main"]').length,viewport:innerWidth,
          documentWidth:document.documentElement.scrollWidth,bodyWidth:document.body.scrollWidth,
          nav:[...document.querySelectorAll('nav')].map(n=>({label:n.getAttribute('aria-label'),visible:!!(n.offsetWidth||n.offsetHeight),text:n.innerText.slice(0,120)})),
          localNav:[...document.querySelectorAll('nav,.local-nav,.subject-nav,.prompt-collection-nav,.toc')].map(n=>({class:n.className?.toString(),visible:!!(n.offsetWidth||n.offsetHeight),height:Math.round(n.getBoundingClientRect().height)}))
        })).catch(()=>({title:null,mainCount:0,viewport:width,documentWidth:0,bodyWidth:0,nav:[],localNav:[]}));
        row.widths[width]={status:response?.status()??null,...m,horizontalOverflow:m.documentWidth>width+1||m.bodyWidth>width+1};
        await page.screenshot({path:`${out}/${slug}-${width}.png`,fullPage:false,animations:'disabled',timeout:10000}).catch(()=>{});
        if(width===1440) findings.axe[path]=await runAxe(page).catch(e=>({error:String(e)}));
        if(width===390){
          await page.keyboard.press('Tab').catch(()=>{});
          row.keyboardFocus=await page.evaluate(()=>{const a=document.activeElement,s=getComputedStyle(a);return{tag:a?.tagName,text:a?.innerText?.slice(0,80)||a?.getAttribute('aria-label'),outline:s.outline,outlineStyle:s.outlineStyle,boxShadow:s.boxShadow}}).catch(()=>null);
          const toggle=page.locator('.menu-toggle,.nav-toggle,.nav-mobile-toggle').first();
          if(await toggle.count()){
            await toggle.click({timeout:3000}).catch(()=>{});
            await page.screenshot({path:`${out}/${slug}-390-menu.png`,fullPage:false,timeout:10000}).catch(()=>{});
            row.mobileMenu=await page.evaluate(()=>({expanded:document.querySelector('.menu-toggle,.nav-toggle,.nav-mobile-toggle')?.getAttribute('aria-expanded'),visibleMenus:[...document.querySelectorAll('#primary-menu,.primary-nav,.nav-content')].filter(n=>n.offsetWidth||n.offsetHeight).length})).catch(()=>null);
            await page.keyboard.press('Escape').catch(()=>{});
          }
          const d=page.locator('details').first();
          if(await d.count()&&await d.locator('summary').count()){
            await d.locator('summary').click({timeout:3000}).catch(()=>{});
            await page.screenshot({path:`${out}/${slug}-390-local-nav-open.png`,fullPage:false,timeout:10000}).catch(()=>{});
          }
          findings.axe[`${path} @390px`]=await runAxe(page).catch(e=>({error:String(e)}));
        }
      }
      const noJsContext=await browser.newContext({javaScriptEnabled:false,viewport:{width:390,height:844}});
      const noJs=await noJsContext.newPage(); await noJs.setDefaultTimeout(5000);
      await noJs.goto(`http://127.0.0.1:4173/${path}`,{waitUntil:'domcontentloaded',timeout:10000}).catch(()=>{});
      row.noJavaScript=await noJs.evaluate(()=>({h1:document.querySelector('h1')?.innerText||null,mainCount:document.querySelectorAll('main,[role="main"]').length,visibleLinks:[...document.querySelectorAll('a')].filter(a=>a.offsetWidth||a.offsetHeight).length,documentWidth:document.documentElement.scrollWidth})).catch(()=>null);
      await noJsContext.close().catch(()=>{}); await context.close().catch(()=>{}); writeReport();
    });
  }
  for(const path of ['prompty.html','gemini-notebook-prompty.html','vibe-coding-prompty.html']){
    test(`prompt controls: ${path}`,async({browser})=>{
      test.setTimeout(60000); const context=await browser.newContext({permissions:['clipboard-read','clipboard-write']}); const page=await context.newPage(); page.setDefaultTimeout(5000);
      await page.goto(`http://127.0.0.1:4173/${path}`,{waitUntil:'domcontentloaded',timeout:10000}).catch(()=>{});
      const result={search:null,filter:null,copy:null};
      const search=page.locator('input[type="search"],input[id*="search"],input[aria-label*="Hledat" i]').first();
      if(await search.count()){const before=await page.locator('.prompt-card:visible').count();await search.fill('xyz-audit-no-match');result.search={before,after:await page.locator('.prompt-card:visible').count()};await search.fill('')}
      const chip=page.locator('.filter-chip[data-filter]').nth(1);
      if(await chip.count()){await chip.click().catch(e=>{result.filterClickError=String(e)});result.filter={selected:await chip.getAttribute('aria-pressed').catch(()=>null),visibleCards:await page.locator('.prompt-card:visible').count()}}
      const copy=page.locator('.copy-btn,[data-copy-prompt]').first();
      if(await copy.count()){await copy.click({timeout:3000}).catch(e=>{result.copyError=String(e)});result.copy={buttonText:await copy.innerText().catch(()=>''),clipboardLength:await page.evaluate(()=>navigator.clipboard.readText().then(t=>t.length).catch(()=>0))}}
      findings.interactions[path]=result; await context.close(); writeReport();
    });
  }
  test('QR input, generation and PNG download',async({browser})=>{
    test.setTimeout(60000);const context=await browser.newContext({acceptDownloads:true});const page=await context.newPage();page.setDefaultTimeout(5000);
    await page.goto('http://127.0.0.1:4173/qr-kod.html',{waitUntil:'domcontentloaded',timeout:10000}).catch(()=>{});
    const result={libraryAvailable:await page.evaluate(()=>typeof window.QRCode==='function').catch(()=>false),generated:false,download:null,error:null};
    await page.locator('#urlInput').fill('https://example.com/audit').catch(()=>{});
    await page.locator('#qrForm button[type="submit"]').click().catch(()=>{});
    await page.waitForTimeout(300);result.generated=await page.locator('#qrCode canvas,#qrCode img').count()>0;result.error=await page.locator('#qrError').innerText().catch(()=>null);
    if(result.generated){try{const dl=page.waitForEvent('download',{timeout:8000});await page.locator('#downloadQr').click();result.download=(await dl).suggestedFilename()}catch(e){result.downloadError=String(e)}}
    findings.interactions['qr-kod.html']=result;await context.close();writeReport();
  });
});

