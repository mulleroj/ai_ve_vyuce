const { test, expect } = require('@playwright/test');
const axeCore = require('axe-core');
const fs = require('node:fs');
const path = require('node:path');
const { PAGE_FILES, snapshot, captureFromGit } = require('../scripts/wave23-page-baseline');
const baseline = require('./fixtures/pages-wave23-baseline.json');

const BASE_URL = 'http://127.0.0.1:4173';
const GROUPS = {
  A: ['prompty.html','vibe-coding-prompty.html','gemini-notebook-prompty.html'],
  B: ['copilot-pro-ucitele.html','perplexity-pro-ucitele.html','google-ai-studio-2026-vibe-coding.html'],
  C: ['vibe-coding-clanky.html','vibe-coding.html']
};
const completedGroups = (process.env.WAVE23_COMPLETED_GROUPS || 'A').split(',').filter(Boolean);
const migratedPages = [...new Set(completedGroups.flatMap(group => GROUPS[group] || []))];
const widths = [320,390,420,421,520,521,540,541,620,621,640,641,760,761,768,799,800,801,900,901,980,981,1024,1100,1101,1440];
const mkdir = () => fs.mkdirSync('artifacts/wave23',{recursive:true});

function contentContract(value) {
  return {
    title:value.title, metadata:value.metadata, canonical:value.canonical,
    headings:value.headings, contentText:value.contentText, links:value.links,
    images:value.images, prompts:value.prompts, navigation:value.navigation.map(nav=>nav.links)
  };
}

async function openPage(page,file,width=1440) {
  await page.setViewportSize({width,height:1000});
  await page.goto(`${BASE_URL}/${file}`,{waitUntil:'domcontentloaded'});
  await page.addStyleTag({content:'*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}'});
  await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(resolve=>setTimeout(resolve,1600))]));
}

test('wave 23 fixture is generated from the exact PR 76 HEAD and preserves page content', async () => {
  expect(baseline.baselineSha).toBe('ccbe7322895e31240e7a42133624d9ede4bf83bd');
  expect(Object.keys(baseline.pages)).toEqual(PAGE_FILES);
  const regenerated = captureFromGit(baseline.baselineSha);
  expect(regenerated).toEqual(baseline);
  for (const file of PAGE_FILES) {
    const actual = snapshot(file,fs.readFileSync(path.resolve(__dirname,'..',file),'utf8'));
    const expected = baseline.pages[file];
    expect(contentContract(actual),`${file}: headings, full text, links, images/alt, metadata, canonical and prompt order`).toEqual(contentContract(expected));
    for (const id of expected.publicIds) expect(actual.publicIds,`${file}: public id ${id}`).toContain(id);
    let scriptCursor = 0;
    for (const script of expected.scripts) {
      const index = actual.scripts.indexOf(script,scriptCursor);
      expect(index,`${file}: retained script in original order ${script}`).toBeGreaterThanOrEqual(scriptCursor);
      scriptCursor = index + 1;
    }
  }
});

test('wave 23 pages render without document overflow at responsive and breakpoint widths', async ({page}) => {
  test.setTimeout(120000);
  mkdir();
  const evidence=[];
  for (const file of PAGE_FILES) {
    const widthsResult=[];
    await openPage(page,file,1440);
    for (const width of widths) {
      await page.setViewportSize({width,height:1000});
      await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      const layout=await page.evaluate(()=>({viewport:innerWidth,document:document.documentElement.scrollWidth,body:document.body.scrollWidth,bodyClass:document.body.className}));
      widthsResult.push(layout);
    }
    evidence.push({file,migrated:migratedPages.includes(file),widths:widthsResult});
    if (migratedPages.includes(file)) for (const layout of widthsResult) {
      expect(layout.document,`${file} document overflow at ${layout.viewport}px`).toBeLessThanOrEqual(layout.viewport+1);
      expect(layout.body,`${file} body overflow at ${layout.viewport}px`).toBeLessThanOrEqual(layout.viewport+1);
    }
  }
  fs.writeFileSync('artifacts/wave23/responsive.json',JSON.stringify({baselineSha:baseline.baselineSha,completedGroups,pages:evidence},null,2)+'\n');
});

test('wave 23 pages have one main landmark, accessible focus and working shared mobile navigation', async ({page}) => {
  test.setTimeout(120000);
  for (const file of migratedPages) {
    await openPage(page,file,390);
    const mains=await page.locator('main').count();
    expect(mains,`${file} main landmark count`).toBe(1);
    const firstTab=page.locator('body');
    await firstTab.press('Tab');
    const focused=await page.evaluate(()=>({tag:document.activeElement.tagName,cls:document.activeElement.className,outline:getComputedStyle(document.activeElement).outlineStyle}));
    expect(focused.outline,`${file} first keyboard target has visible outline`).not.toBe('none');
    const toggle=page.locator('.site-header .menu-toggle').first();
    if (await toggle.count()) {
      await toggle.click();
      await expect(toggle,`${file} shared menu expanded`).toHaveAttribute('aria-expanded','true');
      const menu=toggle.locator('xpath=..').locator('#primary-menu');
      await expect(menu,`${file} shared menu visible`).toBeVisible();
      await page.screenshot({path:`artifacts/wave23/${file.replace('.html','')}-mobile-390-menu.png`,fullPage:true});
      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded','false');
      await expect(toggle).toBeFocused();
    }
    const localToggle=page.locator('body.wave23-vibe-articles .nav-mobile-toggle, body.wave23-vibe-page .nav-mobile-toggle').first();
    if (await localToggle.count()) {
      await localToggle.click();
      await expect(localToggle,`${file} local menu expanded`).toHaveAttribute('aria-expanded','true');
      const localMenu=page.locator('body.wave23-vibe-articles #vibe-clanky-mobile-menu, body.wave23-vibe-page .mobile-menu').first();
      await expect(localMenu,`${file} local menu visible`).toBeVisible();
      await page.screenshot({path:`artifacts/wave23/${file.replace('.html','')}-mobile-390-menu.png`,fullPage:true});
    }
  }
});

test('wave 23 axe-core report: all pages assessed, migrated groups have no confirmed violations', async ({page}) => {
  test.setTimeout(120000);
  mkdir();
  const reports=[];
  for (const file of PAGE_FILES) {
    for (const width of [1440,390]) {
      await openPage(page,file,width);
      await page.addScriptTag({content:axeCore.source});
      const result=await page.evaluate(()=>axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21a','wcag21aa']}}));
      reports.push({file,viewport:width,violations:result.violations,incomplete:result.incomplete.map(item=>({id:item.id,impact:item.impact,help:item.help,nodes:item.nodes.map(node=>({target:node.target,summary:node.failureSummary}))}))});
    }
  }
  fs.writeFileSync('artifacts/wave23/axe-core.json',JSON.stringify({baselineSha:baseline.baselineSha,completedGroups,migratedPages,reports},null,2)+'\n');
  for (const item of reports.filter(report=>migratedPages.includes(report.file))) {
    const violations=item.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(node=>({target:node.target,summary:node.failureSummary}))}));
    expect(violations,`${item.file} axe at ${item.viewport}px`).toEqual([]);
  }
});

test('prompt search, subject filters, clipboard content and copy feedback are preserved', async ({page,context}) => {
  test.setTimeout(60000);
  await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:'http://127.0.0.1:4173'});
  await openPage(page,'prompty.html',1440);
  const input=page.locator('#search-prompts');
  await input.fill('XYZ wave23 no result');
  await expect(page.locator('.prompt-card:visible')).toHaveCount(0);
  await input.fill('vzdělávací infografika');
  await expect(page.locator('.prompt-card:visible').first()).toContainText('Vzdělávací infografika');
  await input.fill('');
  await page.locator('.filter-chip[data-filter="mat"]').click();
  await expect(page.locator('.filter-chip[data-filter="mat"]')).toHaveAttribute('aria-pressed','true');
  await expect(page.locator('.filter-chip[data-filter="all"]')).toHaveAttribute('aria-pressed','false');
  expect(await page.locator('.prompt-card:visible').count()).toBeGreaterThan(0);
  await page.locator('.filter-chip[data-filter="all"]').click();
  const button=page.locator('.prompt-card:visible .copy-btn').first();
  const expected=(await button.getAttribute('data-copy')).trim();
  await button.click();
  await expect(button).toHaveClass(/copied/);
  await expect(page.locator('[role="status"]').last()).toContainText('Prompt zkopírován');
  expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(expected);
});

test('all prompt collections copy their complete prompts and retain keyboard-scrollable text', async ({page,context}) => {
  test.setTimeout(60000);
  await context.grantPermissions(['clipboard-read','clipboard-write'],{origin:'http://127.0.0.1:4173'});
  for (const file of GROUPS.A) {
    await openPage(page,file,390);
    const card=page.locator('.prompt-card:visible').first();
    await expect(card.locator('.prompt-body')).toHaveAttribute('tabindex','0');
    const button=card.locator('.copy-btn').first();
    const expected=(await button.getAttribute('data-copy')).trim();
    await button.click();
    await expect(button).toHaveClass(/copied/);
    expect(await page.evaluate(()=>navigator.clipboard.readText())).toBe(expected);
  }
});

test('no-JavaScript mode keeps prompt text, page content and navigation reachable', async ({browser}) => {
  test.setTimeout(60000);
  const context=await browser.newContext({viewport:{width:390,height:844},javaScriptEnabled:false});
  const page=await context.newPage();
  const evidence=[];
  const failures=[];
  for (const file of PAGE_FILES) {
    await page.goto(`${BASE_URL}/${file}`,{waitUntil:'domcontentloaded'});
    const info=await page.evaluate(()=>({document:document.documentElement.scrollWidth,body:document.body.scrollWidth,mains:document.querySelectorAll('main').length,prompts:document.querySelectorAll('.prompt-card').length,headerLinks:[...document.querySelectorAll('.site-header a, nav[aria-label] a')].map(a=>a.getAttribute('href')),localMenuVisible:['wave23-vibe-articles','wave23-vibe-page'].some(c=>document.body.classList.contains(c))&&getComputedStyle(document.querySelector('.mobile-menu')).display!=='none',overflowing:[...document.querySelectorAll('body *')].map(el=>({tag:el.tagName,cls:typeof el.className==='string'?el.className:'',id:el.id,right:Math.round(el.getBoundingClientRect().right),width:Math.round(el.getBoundingClientRect().width),text:(el.innerText||'').slice(0,70)})).filter(el=>el.right>innerWidth+1).sort((a,b)=>b.right-a.right).slice(0,12)}));
    evidence.push({file, ...info, migrated:migratedPages.includes(file)});
    if (migratedPages.includes(file)) {
      if (info.document>391 || info.body>391 || info.mains!==1 || (GROUPS.A.includes(file)&&info.prompts!==baseline.pages[file].prompts.length) || !info.headerLinks.length || (GROUPS.C.includes(file)&&!info.localMenuVisible)) failures.push({file,info});
    }
  }
  mkdir();
  fs.writeFileSync('artifacts/wave23/no-javascript.json',JSON.stringify({completedGroups,pages:evidence},null,2)+'\n');
  await context.close();
  expect(failures,'No-JS accessibility, content or overflow diagnostics').toEqual([]);
});

test('wave 23 desktop and mobile screenshots are captured for all target pages', async ({page}) => {
  test.setTimeout(120000);
  mkdir();
  const shots=[];
  for (const file of PAGE_FILES) {
    await openPage(page,file,1440);
    await page.screenshot({path:`artifacts/wave23/${file.replace('.html','')}-desktop-1440.png`,fullPage:true});
    shots.push(`${file}:1440`);
    await page.setViewportSize({width:390,height:844});
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    await page.screenshot({path:`artifacts/wave23/${file.replace('.html','')}-mobile-390.png`,fullPage:true});
    shots.push(`${file}:390`);
  }
  fs.writeFileSync('artifacts/wave23/screenshots.json',JSON.stringify(shots,null,2)+'\n');
});


