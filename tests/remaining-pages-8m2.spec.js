const { test, expect } = require('@playwright/test');
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

test('8M/2 rendered audit of remaining pages', async ({ browser }) => {
  test.setTimeout(15 * 60 * 1000);
  fs.mkdirSync(out, { recursive: true });
  for (const path of pages) {
    const slug = path.replaceAll('/', '--').replace('.html', '');
    findings.pages[path] = { widths: {}, consoleErrors: [], pageErrors: [], failedRequests: [], httpErrors: [] };
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, acceptDownloads: true });
    await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
    const page = await context.newPage();
    page.on('console', msg => { if (msg.type() === 'error') findings.pages[path].consoleErrors.push(msg.text()); });
    page.on('pageerror', err => findings.pages[path].pageErrors.push(String(err)));
    page.on('requestfailed', req => findings.pages[path].failedRequests.push({ url: req.url(), error: req.failure()?.errorText }));
    page.on('response', res => { if (res.status() >= 400) findings.pages[path].httpErrors.push({ url: res.url(), status: res.status() }); });
    for (const width of widths) {
      await page.setViewportSize({ width, height: 1000 });
      const response = await page.goto(`http://127.0.0.1:4173/${path}`, { waitUntil: 'networkidle', timeout: 45000 }).catch(async error => { findings.notes.push(`${path} navigation at ${width}px: ${error}`); return null; });
      await page.evaluate(() => document.fonts?.ready);
      await page.addStyleTag({ content: '*,*::before,*::after{scroll-behavior:auto!important;animation-duration:0s!important;transition-duration:0s!important}' }).catch(() => {});
      const metrics = await page.evaluate(() => ({
        title: document.title, mainCount: document.querySelectorAll('main,[role="main"]').length,
        viewport: innerWidth, documentWidth: document.documentElement.scrollWidth,
        bodyWidth: document.body.scrollWidth,
        nav: [...document.querySelectorAll('nav')].map(n => ({ label:n.getAttribute('aria-label'), visible:!!(n.offsetWidth||n.offsetHeight), text:n.innerText.slice(0,180) })),
        localNav: [...document.querySelectorAll('nav, .local-nav, .subject-nav, .prompt-collection-nav, .toc')].map(n => ({ class:n.className?.toString(), visible:!!(n.offsetWidth||n.offsetHeight), rect:Math.round(n.getBoundingClientRect().height) }))
      }));
      findings.pages[path].widths[width] = { status: response?.status() ?? null, ...metrics, horizontalOverflow: metrics.documentWidth > width + 1 || metrics.bodyWidth > width + 1 };
      await page.screenshot({ path: `${out}/${slug}-${width}.png`, fullPage: width === 1440, animations: 'disabled' }).catch(() => {});
      if (width === 1440) {
        await page.addScriptTag({ content: axeSource });
        findings.axe[path] = await page.evaluate(async () => {
          const r = await axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a','wcag2aa','wcag21a','wcag21aa','best-practice'] } });
          return { violations:r.violations.map(v=>({ id:v.id, impact:v.impact, description:v.description, help:v.help, nodes:v.nodes.map(n=>({ target:n.target, html:n.html, summary:n.failureSummary })) })), incomplete:r.incomplete.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,html:n.html}))})), passes:r.passes.length };
        });
      }
      if (width === 390) {
        const toggle = page.locator('.menu-toggle, .nav-toggle, .nav-mobile-toggle').first();
        if (await toggle.count()) {
          await toggle.click().catch(() => {});
          await page.screenshot({ path: `${out}/${slug}-390-menu.png`, fullPage: false, animations: 'disabled' }).catch(() => {});
          findings.pages[path].mobileMenu = await page.evaluate(() => ({ toggleExpanded:document.querySelector('.menu-toggle,.nav-toggle,.nav-mobile-toggle')?.getAttribute('aria-expanded'), visibleMenus:[...document.querySelectorAll('#primary-menu,.primary-nav,.nav-content')].filter(n=>n.offsetWidth||n.offsetHeight).length }));
          await page.keyboard.press('Escape').catch(() => {});
        }
        for (const d of await page.locator('details').all()) {
          const summary = d.locator('summary');
          if (await summary.count()) { await summary.click().catch(() => {}); await page.screenshot({ path: `${out}/${slug}-390-local-nav-open.png`, fullPage: false, animations:'disabled' }).catch(() => {}); break; }
        }
      }
    }
    // Static essential-content and no-JavaScript behavior at 390px.
    const noJs = await context.newPage();
    await noJs.setJavaScriptEnabled(false);
    await noJs.setViewportSize({ width:390,height:844 });
    await noJs.goto(`http://127.0.0.1:4173/${path}`, { waitUntil:'domcontentloaded', timeout:45000 }).catch(()=>{});
    findings.pages[path].noJavaScript = await noJs.evaluate(() => ({ h1:document.querySelector('h1')?.innerText||null, mainCount:document.querySelectorAll('main,[role="main"]').length, visibleLinks:[...document.querySelectorAll('a')].filter(a=>a.offsetWidth||a.offsetHeight).length, documentWidth:document.documentElement.scrollWidth }));
    await noJs.close();
    await context.close();
  }

  // Prompt search, filter and copy controls where implemented.
  for (const path of ['prompty.html','gemini-notebook-prompty.html','vibe-coding-prompty.html']) {
    const context = await browser.newContext({ permissions:['clipboard-read','clipboard-write'] });
    const page = await context.newPage();
    await page.goto(`http://127.0.0.1:4173/${path}`, { waitUntil:'networkidle' });
    const result = { search:null, filter:null, copy:null };
    const search = page.locator('input[type="search"],input[id*="search"],input[aria-label*="Hledat" i]').first();
    if (await search.count()) { const before=await page.locator('.prompt-card:visible').count(); await search.fill('xyz-audit-no-match'); result.search={before,after:await page.locator('.prompt-card:visible').count()}; }
    const chip=page.locator('.filter-chip[data-filter]').nth(1);
    if (await chip.count()) { await chip.click(); result.filter={selected:await chip.getAttribute('aria-pressed'),visibleCards:await page.locator('.prompt-card:visible').count()}; }
    const copy=page.locator('.copy-btn,[data-copy-prompt]').first();
    if (await copy.count()) { await copy.click(); await page.waitForTimeout(150); result.copy={buttonText:await copy.innerText().catch(()=>''), clipboardLength:await page.evaluate(()=>navigator.clipboard.readText().then(t=>t.length).catch(()=>0))}; }
    findings.interactions[path]=result;
    await context.close();
  }
  // QR generation and PNG download. CDN failures are recorded as actual behavior.
  {
    const context=await browser.newContext({acceptDownloads:true}); const page=await context.newPage();
    await page.goto('http://127.0.0.1:4173/qr-kod.html',{waitUntil:'networkidle'});
    const result={libraryAvailable:await page.evaluate(()=>typeof window.QRCode==='function'),generated:false,download:null,error:null};
    await page.locator('#urlInput').fill('https://example.com/audit');
    await page.locator('#qrForm button[type="submit"]').click();
    await page.waitForTimeout(500);
    result.generated=await page.locator('#qrCode canvas,#qrCode img').count()>0;
    result.error=await page.locator('#qrError').innerText().catch(()=>null);
    if(result.generated){const dl=page.waitForEvent('download',{timeout:10000});await page.locator('#downloadQr').click();result.download=(await dl).suggestedFilename();}
    findings.interactions['qr-kod.html']=result; await context.close();
  }
  fs.writeFileSync(`${out}/report.json`, JSON.stringify(findings,null,2));
  fs.writeFileSync(`${out}/report.md`, '# 8M/2 Browser audit\n\nRaw page metrics, axe-core violations/incomplete results, interaction outcomes, browser errors, and screenshots are packaged with this report.\n');
  console.log(`8M2 audit completed for ${Object.keys(findings.pages).length} pages; full data is in artifacts/8m2/report.json`);
  expect(Object.keys(findings.pages)).toHaveLength(pages.length);
});

