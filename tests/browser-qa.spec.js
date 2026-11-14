const { test, expect } = require('@playwright/test');

const baseURL = 'http://127.0.0.1:4173';
const widths = [320, 390, 768, 960, 961, 1024, 1440];
const localProblems = [];

test.beforeEach(async ({ page }) => {
  page.on('console', message => {
    if (message.type() === 'error') localProblems.push(`console: ${message.text()}`);
  });
  page.on('pageerror', error => localProblems.push(`pageerror: ${error.message}`));
  page.on('response', response => {
    if (response.url().startsWith(baseURL) && response.status() >= 400) {
      localProblems.push(`HTTP ${response.status()}: ${response.url()}`);
    }
  });
  page.on('requestfailed', request => {
    if (request.url().startsWith(baseURL)) {
      localProblems.push(`request failed: ${request.url()} (${request.failure()?.errorText || 'unknown'})`);
    }
  });
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    await page.screenshot({ path: testInfo.outputPath('failure-state.png'), fullPage: true }).catch(() => {});
    await page.locator('body').innerText().then(text => require('node:fs').writeFileSync(
      testInfo.outputPath('failure-state.txt'), text
    )).catch(() => {});
  }
});

test('responsive layout, navigation, local assets, and overflow at requested widths', async ({ page }) => {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${baseURL}/ai-novinka-datovi-agenti-lidske-schvaleni.html`);
    await expect(page.locator('.brand-symbol')).toBeVisible();
    await expect(page.locator('.site-nav-pilot details')).toHaveCount(6);
    await expect(page.locator('.site-breadcrumbs > ol > li')).toHaveCount(3);
    await expect(page.locator('.site-breadcrumbs > ol > li').nth(0)).toContainText('Domů');
    await expect(page.locator('.site-breadcrumbs > ol > li').nth(1)).toContainText('AI ve vzdělávání');
    await expect(page.locator('.site-breadcrumbs > ol > li').nth(2)).toHaveAttribute('aria-current', 'page');
    await expect(page.locator('.article-content-navigation a')).toHaveCount(16);
    await expect(page.locator('.workflow-related')).toBeVisible();

    const geometry = await page.evaluate(() => {
      const toc = document.querySelector('.article-content-navigation');
      const article = document.querySelector('.workflow-article');
      const related = document.querySelector('.workflow-related');
      return {
        scrollWidth: document.documentElement.scrollWidth,
        innerWidth: window.innerWidth,
        toc: toc.getBoundingClientRect().toJSON(),
        article: article.getBoundingClientRect().toJSON(),
        related: related.getBoundingClientRect().toJSON(),
        tocPosition: getComputedStyle(toc).position,
        detailsOpen: toc.open
      };
    });
    expect(geometry.scrollWidth, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(width + 1);
    if (width > 960) {
      expect(geometry.toc.left).toBeLessThan(geometry.article.left);
      expect(geometry.tocPosition).toBe('sticky');
      expect(geometry.detailsOpen).toBe(true);
      expect(geometry.related.left).toBeLessThanOrEqual(geometry.toc.left + 1);
      expect(geometry.related.width).toBeGreaterThan(geometry.article.width);
    } else {
      expect(geometry.toc.left).toBeCloseTo(geometry.article.left, 0);
      expect(geometry.tocPosition).toBe('static');
    }

    if (width === 1440) {
      await page.screenshot({ path: 'artifacts/desktop-1440-top.png', fullPage: false });
      await page.evaluate(() => window.scrollTo(0, 1050));
      await page.waitForTimeout(250);
      await page.screenshot({ path: 'artifacts/desktop-1440-toc-scrolled.png', fullPage: false });
      const stickyTop = await page.locator('.article-content-navigation').evaluate(el => el.getBoundingClientRect().top);
      expect(stickyTop).toBeGreaterThanOrEqual(0);
      expect(stickyTop).toBeLessThan(260);
    }
    if (width === 390) {
      const toc = page.locator('.article-content-navigation');
      await toc.locator('summary').click();
      await expect(toc).toHaveJSProperty('open', false);
      await page.screenshot({ path: 'artifacts/mobile-390-collapsed.png', fullPage: false });
      await toc.locator('summary').click();
      await expect(toc).toHaveJSProperty('open', true);
      await page.screenshot({ path: 'artifacts/mobile-390-expanded.png', fullPage: false });
    }
    if (width === 960) await page.screenshot({ path: 'artifacts/width-960.png', fullPage: false });
    if (width === 961) await page.screenshot({ path: 'artifacts/width-961.png', fullPage: false });
  }
});

test('contents links navigate to H2 and selected H3 and update the active chapter', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseURL}/ai-novinka-datovi-agenti-lidske-schvaleni.html`);
  await page.locator('.article-content-navigation a[href="#obsah-lidske-schvaleni"]').click();
  await expect(page).toHaveURL(/#obsah-lidske-schvaleni$/);
  await expect(page.locator('#obsah-lidske-schvaleni')).toBeInViewport();
  await expect(page.locator('.article-content-navigation a[aria-current="location"]'))
    .toHaveAttribute('href', '#obsah-lidske-schvaleni');

  await page.locator('.article-content-navigation a[href="#obsah-ai-muze-vykonat"]').click();
  await expect(page).toHaveURL(/#obsah-ai-muze-vykonat$/);
  await expect(page.locator('#obsah-ai-muze-vykonat')).toBeInViewport();
  await expect(page.locator('.article-content-navigation a[aria-current="location"]'))
    .toHaveAttribute('href', '#obsah-ai-muze-vykonat');
});

test('keyboard disclosure and mobile menu support Space, Enter, and Escape', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}/ai-novinka-datovi-agenti-lidske-schvaleni.html`);
  await page.keyboard.press('Tab');
  await expect(page.locator('.brand')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('.menu-toggle')).toBeFocused();
  const toc = page.locator('.article-content-navigation');
  const summary = toc.locator('summary');
  await summary.focus();
  await page.keyboard.press('Space');
  await expect(toc).toHaveJSProperty('open', false);
  await page.keyboard.press('Enter');
  await expect(toc).toHaveJSProperty('open', true);

  const toggle = page.locator('.menu-toggle');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded', 'true');
  await toggle.focus();
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded', 'false');
  await expect(toggle).toBeFocused();
});

test('contents anchor works with JavaScript disabled', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/ai-novinka-datovi-agenti-lidske-schvaleni.html`);
  await page.locator('.article-content-navigation a[href="#obsah-co-si-odnest"]').click();
  await expect(page).toHaveURL(/#obsah-co-si-odnest$/);
  await expect(page.locator('#obsah-co-si-odnest')).toBeInViewport();
  await expect(page.locator('.article-content-navigation')).toHaveJSProperty('open', true);
  await context.close();
});

test('no critical browser errors or missing local resources', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${baseURL}/ai-novinka-datovi-agenti-lidske-schvaleni.html`);
  await page.locator('#obsah-co-si-odnest').scrollIntoViewIfNeeded();
  await page.waitForTimeout(250);
  expect(localProblems, localProblems.join('\n')).toEqual([]);
});

const wave1Articles = [
  { file: 'ai-agenti-10-ukolu.html', title: '10 úkolů, které může AI agent převzít učiteli', tocCount: 18, h2: '#ukol-pracovni-list', h3: '#autonomie-schvaleni', baselineSha: '1abd3fc39df4650b402f5f6d31f6a2148f7a769f' },
  { file: 'ai-agenti-agentni-smycka.html', title: 'Jak funguje AI agent: agentní smyčka krok za krokem', tocCount: 17, h2: '#toc-03', h3: '#loop-think', baselineSha: '1abd3fc39df4650b402f5f6d31f6a2148f7a769f' },
  { file: 'ai-agenti-chatbot-automatizace-workflow.html', title: 'AI agent, automatizace, workflow nebo chatbot?', tocCount: 24, h2: '#typ-chatbot', h3: '#typ-chatbot-kdy', baselineSha: '1abd3fc39df4650b402f5f6d31f6a2148f7a769f' },
  { file: 'ai-agenti-kdy-nepouzivat.html', title: 'Kdy AI agenta ve škole raději nepoužívat', tocCount: 21, h2: '#riziko-znamka', h3: '#semafor-zluta', baselineSha: '1abd3fc39df4650b402f5f6d31f6a2148f7a769f' }
];
const wave2Articles = [
  { file: 'ai-agenti-coding-agenti.html', title: 'Od vibe codingu ke coding agentům: když AI pracuje na projektu', tocCount: 31, h2: '#toc-03', h3: '#coding-agent', baselineSha: '6ae5e726d79b6aea3c87845193b9e0caa0f3ed19' },
  { file: 'ai-agenti-nastroje-function-calling.html', title: 'Nástroje a Function Calling: jak dostane AI „ruce“', tocCount: 25, h2: '#toc-04', h3: '#tools-step-understand', baselineSha: '6ae5e726d79b6aea3c87845193b9e0caa0f3ed19' },
  { file: 'ai-agenti-pamet.html', title: 'Paměť AI agentů: co si AI skutečně pamatuje', tocCount: 28, h2: '#toc-02', h3: '#memory-context-size', baselineSha: '6ae5e726d79b6aea3c87845193b9e0caa0f3ed19' },
  { file: 'ai-agenti-rag.html', title: 'RAG: když AI pracuje s vašimi vlastními dokumenty', tocCount: 38, h2: '#toc-04', h3: '#rag-step-sources', baselineSha: '6ae5e726d79b6aea3c87845193b9e0caa0f3ed19' }
];
const wave3Articles = [
  { file: 'ai-agenti-mcp.html', title: 'MCP: univerzální konektor pro svět AI agentů', tocCount: 30, h2: '#toc-02', h3: '#ai-agenti-mcp-h3-01', baselineSha: '258e96761fb8d327d06ecea9b283cc1bd9f3ea10', checkTocScroll: true },
  { file: 'ai-agenti-multi-agentni.html', title: 'Multi-agentní systémy: když na jednom úkolu pracuje tým AI', tocCount: 27, h2: '#toc-02', h3: null, baselineSha: '258e96761fb8d327d06ecea9b283cc1bd9f3ea10', checkTocScroll: true },
  { file: 'ai-agenti-prvni-agent.html', title: 'Jak navrhnout svého prvního jednoduchého AI agenta', tocCount: 27, h2: '#toc-02', h3: '#ai-agenti-prvni-agent-h3-01', baselineSha: '258e96761fb8d327d06ecea9b283cc1bd9f3ea10', checkTocScroll: true },
  { file: 'ai-agenti-skills.html', title: 'Skills: jak naučit AI agenta opakovat osvědčený pracovní postup', tocCount: 37, h2: '#toc-02', h3: '#ai-agenti-skills-h3-01', baselineSha: '258e96761fb8d327d06ecea9b283cc1bd9f3ea10', checkTocScroll: true }
];
const wave4Articles = [
  { file: 'ai-agenti-llm-tools-rag-memory-skills-workflow-mcp.html', title: 'Jak spolu souvisí LLM, Tools, RAG, Memory, Skills, Workflow a MCP', tocCount: 35, h2: '#toc-07', h3: '#ai-agenti-llm-tools-rag-memory-skills-workflow-mcp-h3-01', baselineSha: 'fdc0a22750a024ab2dccc422084c24f51e356581', checkTocScroll: true },
  { file: 'ai-agenti-ve-skole.html', title: 'AI agent ve škole: co může skutečně dělat učiteli', tocCount: 30, h2: '#toc-07', h3: '#ai-agenti-ve-skole-h3-01', baselineSha: 'fdc0a22750a024ab2dccc422084c24f51e356581', checkTocScroll: true },
  { file: 'ai-agenti-co-je-ai-agent.html', title: 'AI agenti: když AI začne pracovat', tocCount: 10, h2: '#toc-01', h3: null, baselineSha: 'fdc0a22750a024ab2dccc422084c24f51e356581' }
];
const wave5Articles = [
  { file: 'ai-navod-gemini-notebook-infografiky.html', title: '7 promptů pro Gemini Notebook', tocCount: 10, h2: '#toc-01', h3: '#ai-navod-gemini-notebook-infografiky-h3-01', baselineSha: 'bcdd8e48cf8a97b44917b90c40f59c5a6e348f4f', activeArea: 'Připravit výuku', breadcrumb: 'Praktické návody', breadcrumbHref: 'ai-navody.html', legacyInternalIds: ['toc-heading-ai-navod-gemini-notebook-infografiky-html'] },
  { file: 'ai-navod-gemini-notebook-prezentace.html', title: '7 promptů pro lepší výukovou prezentaci', tocCount: 14, h2: '#toc-01', h3: '#ai-navod-gemini-notebook-prezentace-h3-01', baselineSha: 'bcdd8e48cf8a97b44917b90c40f59c5a6e348f4f', activeArea: 'Připravit výuku', breadcrumb: 'Praktické návody', breadcrumbHref: 'ai-navody.html', legacyInternalIds: ['toc-heading-ai-navod-gemini-notebook-prezentace-html'] },
  { file: 'ai-navod-gemini-notebook-priprava.html', title: '7 promptů pro Gemini Notebook', tocCount: 11, h2: '#toc-01', h3: '#ai-navod-gemini-notebook-priprava-h3-01', baselineSha: 'bcdd8e48cf8a97b44917b90c40f59c5a6e348f4f', activeArea: 'Připravit výuku', breadcrumb: 'Praktické návody', breadcrumbHref: 'ai-navody.html', legacyInternalIds: ['toc-heading-ai-navod-gemini-notebook-priprava-html'] },
  { file: 'ai-navod-gemini-notebook-vyuka.html', title: 'Gemini Notebook ve výuce: interaktivní studijní prostředí', tocCount: 14, h2: '#toc-01', h3: '#ai-navod-gemini-notebook-vyuka-h3-01', baselineSha: 'bcdd8e48cf8a97b44917b90c40f59c5a6e348f4f', activeArea: 'Připravit výuku', breadcrumb: 'Praktické návody', breadcrumbHref: 'ai-navody.html', legacyInternalIds: ['toc-heading-ai-navod-gemini-notebook-vyuka-html'] }
];

test('wave 5 prompts copy the selected text to the clipboard', async ({ browser }) => {
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  for (const article of wave5Articles) {
    await page.goto(`${baseURL}/${article.file}`);
    const prompt = page.locator('.article-prompt').first();
    const expected = (await prompt.innerText()).trimEnd();
    await prompt.evaluate(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    });
    await page.keyboard.press('Control+C');
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied.trimEnd(), `clipboard contents for ${article.file}`).toBe(expected);
  }
  await context.close();
});

const wave6Articles = [
  { file: 'ai-navod-7-univerzalnich-promptu.html', title: '7 univerzálních AI promptů: rychlejší příprava výuky', tocCount: 12, h2: '#toc-01', h3: '#ai-navod-7-univerzalnich-promptu-h3-07', baselineSha: '180c5a3880089216910f5b31b5de6a9b6b6fde38', activeArea: 'Připravit výuku', breadcrumb: 'Praktické návody', breadcrumbHref: 'ai-navody.html' },
  { file: 'ai-navod-ai-agent-v-prohlizeci.html', title: 'AI agent v prohlížeči: když AI také pracuje', tocCount: 22, checkTocScroll: true, h2: '#ai-navod-ai-agent-v-prohlizeci-h2-01', h3: '#ai-navod-ai-agent-v-prohlizeci-h3-04', baselineSha: '180c5a3880089216910f5b31b5de6a9b6b6fde38', activeArea: 'Připravit výuku', breadcrumb: 'Praktické návody', breadcrumbHref: 'ai-navody.html' },
  { file: 'ai-navod-chatgpt-vizualni-materialy.html', title: '7 promptů pro ChatGPT: vizuální výukové materiály', tocCount: 13, h2: '#toc-01', h3: null, baselineSha: '180c5a3880089216910f5b31b5de6a9b6b6fde38', activeArea: 'Připravit výuku', breadcrumb: 'Praktické návody', breadcrumbHref: 'ai-navody.html' },
  { file: 'ai-navod-commands-chatgpt.html', title: 'Commands v ChatGPT', tocCount: 10, h2: '#ai-navod-commands-chatgpt-h2-01', h3: null, baselineSha: '180c5a3880089216910f5b31b5de6a9b6b6fde38', activeArea: 'Připravit výuku', breadcrumb: 'Praktické návody', breadcrumbHref: 'ai-navody.html' },
];


test('wave 6 hero light styles, desktop and mobile screenshots, and computed-style evidence', async ({ page }) => {
  const fs = require('node:fs');
  const evidence = [];
  for (const article of wave6Articles) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${baseURL}/${article.file}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const record = await page.evaluate(() => {
        const pick = selector => {
          const el = document.querySelector(selector);
          if (!el) return null;
          const s = getComputedStyle(el), before = getComputedStyle(el, '::before'), after = getComputedStyle(el, '::after');
          return {
            selector, backgroundColor: s.backgroundColor, backgroundImage: s.backgroundImage,
            color: s.color, opacity: s.opacity, filter: s.filter,
            before: { display: before.display, content: before.content, backgroundColor: before.backgroundColor, backgroundImage: before.backgroundImage, opacity: before.opacity, position: before.position, width: before.width, height: before.height },
            after: { display: after.display, content: after.content, backgroundColor: after.backgroundColor, backgroundImage: after.backgroundImage, opacity: after.opacity, position: after.position, width: after.width, height: after.height }
          };
        };
        return {
          width: innerWidth,
          body: pick('body'),
          shell: pick('.workflow-shell'),
          hero: pick('.workflow-hero'),
          panels: [...document.querySelectorAll('.workflow-news-panel,.workflow-route')].map(el => {
            const s = getComputedStyle(el), b = getComputedStyle(el,'::before'), a = getComputedStyle(el,'::after');
            return { selector:'.'+el.className, backgroundColor:s.backgroundColor, backgroundImage:s.backgroundImage, color:s.color, opacity:s.opacity, filter:s.filter,
              before:{display:b.display,content:b.content,backgroundColor:b.backgroundColor,backgroundImage:b.backgroundImage,opacity:b.opacity},
              after:{display:a.display,content:a.content,backgroundColor:a.backgroundColor,backgroundImage:a.backgroundImage,opacity:a.opacity} };
          }),
          title: pick('.workflow-hero h1'),
          lead: pick('.workflow-hero-lead')
        };
      });
      evidence.push({ file: article.file, ...record });
      await page.locator('.workflow-shell').screenshot({ path: `artifacts/${article.file}-hero-${width}.png` });
      const gradient = record.shell.backgroundImage || '';
      expect(gradient, `hero gradient missing on ${article.file}`).not.toBe('none');
      expect(gradient, `hero image overlay on ${article.file}`).not.toMatch(/url\(/i);
      const stops = [...gradient.matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/g)];
      expect(stops.length, `computed gradient stops missing on ${article.file}`).toBeGreaterThan(0);
      for (const stop of stops) expect(Number(stop[1]) + Number(stop[2]) + Number(stop[3]), `dark hero gradient stop on ${article.file}`).toBeGreaterThan(570);
      expect(record.shell.opacity).toBe('1');
    }
  }
  fs.writeFileSync('artifacts/wave6-computed-hero-styles.json', JSON.stringify(evidence, null, 2));
});

test('wave 6 contact sheet compares four article heroes with the approved light pilot and homepage', async ({ page }) => {
  const cards = [];
  for (const article of wave6Articles) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${baseURL}/${article.file}`, { waitUntil: 'networkidle' });
    const image = await page.locator('.workflow-shell').screenshot();
    cards.push({ title: article.title, data: image.toString('base64') });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${baseURL}/ai-agenti-co-je-ai-agent.html`, { waitUntil: 'networkidle' });
  const pilot = await page.locator('.workflow-shell').screenshot();
  cards.push({ title: 'Schválený světlý pilot', data: pilot.toString('base64') });
  await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
  const home = await page.screenshot();
  cards.push({ title: 'Homepage', data: home.toString('base64') });
  await page.setContent(`<!doctype html><html lang="cs"><meta charset="utf-8"><title>Vlna 6 – srovnání hero</title><style>
    *{box-sizing:border-box}body{margin:0;padding:24px;background:#fffefa;color:#102d2b;font:600 15px Arial,sans-serif}
    h1{margin:0 0 18px}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
    article{padding:10px;border:1px solid #dfe8e1;border-radius:12px;background:#fff;overflow:hidden}
    h2{font-size:16px;min-height:40px;margin:4px 0 10px}img{display:block;width:100%;height:auto;object-fit:contain;border:1px solid #e5e7e1;border-radius:8px}
  </style><h1>Praktické návody – migrační vlna 6 a světlé reference</h1><main class="grid">${cards.map(x=>`<article><h2>${x.title}</h2><img alt="${x.title}" src="data:image/png;base64,${x.data}"></article>`).join('')}</main></html>`);
  await page.screenshot({ path: 'artifacts/wave6-hero-contact-sheet.png', fullPage: true });
});

const wave7Articles = [
  { file: 'ai-navod-edit-kontrola.html', title: 'EDIT: kontrola výstupů', tocCount: 39, h2: '#ai-navod-edit-kontrola-h2-01', h3: '#ai-navod-edit-kontrola-h3-01', baselineSha: '80caef268f88b36c496518d35cf18209f7ff3e8f', activeArea: 'Připravit výuku', breadcrumb: 'Praktické návody', breadcrumbHref: 'ai-navody.html', checkTocScroll: true },
  { file: 'ai-navod-lepsi-prompty-10-zasad.html', title: 'Jak psát lepší prompty pro AI: 10 zásad pro učitele', tocCount: 15, h2: '#ai-navod-lepsi-prompty-10-zasad-h2-01', h3: '#ai-navod-lepsi-prompty-10-zasad-h3-01', baselineSha: '80caef268f88b36c496518d35cf18209f7ff3e8f', activeArea: 'Připravit výuku', breadcrumb: 'Praktické návody', breadcrumbHref: 'ai-navody.html' },
  { file: 'ai-navod-prep-prompty.html', title: 'PREP: lepší prompty', tocCount: 24, h2: '#ai-navod-prep-prompty-h2-01', h3: '#ai-navod-prep-prompty-h3-01', baselineSha: '80caef268f88b36c496518d35cf18209f7ff3e8f', activeArea: 'Připravit výuku', breadcrumb: 'Praktické návody', breadcrumbHref: 'ai-navody.html', checkTocScroll: true }
];
const wave7PromptArticles = [
  { file: 'ai-navod-edit-kontrola.html', count: 10 },
  { file: 'ai-navod-lepsi-prompty-10-zasad.html', count: 2 },
  { file: 'ai-navod-prep-prompty.html', count: 8 }
];

test('wave 7 prompts remain selectable and copy the exact selected text', async ({ browser }) => {
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  for (const article of wave7PromptArticles) {
    await page.goto(`${baseURL}/${article.file}`);
    const prompts = page.locator('.article-content .article-prompt');
    await expect(prompts).toHaveCount(article.count);
    for (let index = 0; index < article.count; index++) {
      const prompt = prompts.nth(index);
      const expected = (await prompt.innerText()).trimEnd();
      await prompt.evaluate(element => {
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
      });
      await page.keyboard.press('Control+C');
      const copied = await page.evaluate(() => navigator.clipboard.readText());
      expect(copied.trimEnd(), `selected prompt ${index + 1} in ${article.file}`).toBe(expected);
    }
  }
  await context.close();
});

test('wave 7 hero styles and desktop/mobile screenshots', async ({ page }) => {
  const fs = require('node:fs');
  const records = [];
  for (const article of wave7Articles) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${baseURL}/${article.file}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const record = await page.evaluate(() => {
        const snapshot = (selector, provided) => {
          const el = provided || document.querySelector(selector);
          if (!el) return null;
          const style = getComputedStyle(el), before = getComputedStyle(el, '::before'), after = getComputedStyle(el, '::after');
          return {
            selector, backgroundColor: style.backgroundColor, backgroundImage: style.backgroundImage,
            color: style.color, opacity: style.opacity, filter: style.filter, backdropFilter: style.backdropFilter,
            before: { display: before.display, content: before.content, backgroundColor: before.backgroundColor, backgroundImage: before.backgroundImage, opacity: before.opacity, position: before.position, width: before.width, height: before.height },
            after: { display: after.display, content: after.content, backgroundColor: after.backgroundColor, backgroundImage: after.backgroundImage, opacity: after.opacity, position: after.position, width: after.width, height: after.height }
          };
        };
        return {
          width: innerWidth,
          shell: snapshot('.workflow-shell'), hero: snapshot('.workflow-hero'),
          title: snapshot('.workflow-hero h1'), lead: snapshot('.workflow-hero-lead'),
          panels: [...document.querySelectorAll('.workflow-news-panel,.workflow-route,.workflow-stage,.workflow-stage-number,.workflow-news-panel-label,.workflow-meta span')]
            .map((el, index) => snapshot(`panel-${index}-${el.className || el.tagName.toLowerCase()}`, el))
        };
      });
      records.push({ file: article.file, ...record });
      const surfaces = [record.shell, record.hero, ...record.panels].filter(Boolean);
      for (const surface of surfaces) {
        expect(surface.filter).toBe('none');
        expect(surface.backdropFilter).toBe('none');
        for (const image of [surface.backgroundImage, surface.before?.backgroundImage, surface.after?.backgroundImage].filter(Boolean)) {
          expect(image, `hero image layer in ${article.file}`).not.toMatch(/url\(/i);
          const rgbStops = [...image.matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/g)];
          for (const stop of rgbStops) {
            const alpha = stop[4] === undefined ? 1 : Number(stop[4]);
            const luminanceSum = [1, 2, 3].reduce((sum, channel) => sum + Number(stop[channel]) * alpha + 255 * (1 - alpha), 0);
            expect(luminanceSum, `dark computed hero gradient in ${article.file}: ${image}`)
              .toBeGreaterThan(570);
          }
        }
        const colors = [
          { value: surface.backgroundColor },
          { value: surface.before?.backgroundColor, pseudo: surface.before },
          { value: surface.after?.backgroundColor, pseudo: surface.after }
        ];
        for (const entry of colors) {
          const color = entry.value;
          if (!color) continue;
          const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if (!match) continue;
          const alpha = match[4] === undefined ? 1 : Number(match[4]);
          if (alpha <= 0.05) continue;
          const sum = [1, 2, 3].reduce((total, channel) => total + Number(match[channel]) * alpha + 255 * (1 - alpha), 0);
          if (sum <= 570) {
            const tinyApprovedGreenMarker = color === 'rgb(22, 143, 124)'
              && surface.selector.includes('workflow-stage')
              && entry.pseudo?.display !== 'none'
              && entry.pseudo?.position === 'absolute'
              && Number.parseFloat(entry.pseudo?.width) <= 20
              && Number.parseFloat(entry.pseudo?.height) <= 20
              && entry.pseudo?.opacity === '1';
            expect(tinyApprovedGreenMarker, `unexpected dark hero surface in ${article.file}: ${color}`).toBe(true);
          }
        }
      }
      expect(record.shell.opacity).toBe('1');
      await page.locator('.workflow-shell').screenshot({ path: `artifacts/${article.file}-hero-${width}.png` });
      const prompt = page.locator('.article-content .article-prompt').first();
      await prompt.scrollIntoViewIfNeeded();
      await prompt.screenshot({ path: `artifacts/${article.file}-prompt-${width}.png` });
    }
  }
  fs.writeFileSync('artifacts/wave7-computed-hero-styles.json', JSON.stringify(records, null, 2));
});

test('wave 7 hero contact sheet includes the approved light reference', async ({ page }) => {
  const cards = [];
  for (const article of wave7Articles) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${baseURL}/${article.file}`, { waitUntil: 'networkidle' });
    const image = await page.locator('.workflow-shell').screenshot();
    cards.push({ title: article.title, data: image.toString('base64') });
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${baseURL}/ai-navod-commands-chatgpt.html`, { waitUntil: 'networkidle' });
  const reference = await page.locator('.workflow-shell').screenshot();
  cards.push({ title: 'Schválená světlá reference z PR #60', data: reference.toString('base64') });
  await page.setContent(`<!doctype html><html lang="cs"><meta charset="utf-8"><title>Vlna 7 – hero a světlá reference</title><style>
    *{box-sizing:border-box}body{margin:0;padding:24px;background:#fffefa;color:#102d2b;font:600 15px Arial,sans-serif}
    h1{margin:0 0 18px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
    article{padding:10px;border:1px solid #dfe8e1;border-radius:12px;background:#fff;overflow:hidden}
    h2{font-size:16px;min-height:40px;margin:4px 0 10px}img{display:block;width:100%;height:auto;object-fit:contain;border:1px solid #e5e7e1;border-radius:8px}
  </style><h1>Praktické návody – migrační vlna 7 a schválená světlá reference</h1><main class="grid">${cards.map(x=>`<article><h2>${x.title}</h2><img alt="${x.title}" src="data:image/png;base64,${x.data}"></article>`).join('')}</main></html>`);
  await page.screenshot({ path: 'artifacts/wave7-hero-contact-sheet.png', fullPage: true });
});

test('homepage renders the six newest catalog entries and complete records through wave 11', async ({ page }) => {
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await expect(page.locator('#latest-articles .latest-card')).toHaveCount(6);
  const [expected, actual, wave7Records, wave8Records, wave10Records, wave11Records, wave12Records, duplicateHrefs] = await page.evaluate(() => {
    const ordered = window.siteArticles
      .map((article, index) => ({ article, index }))
      .sort((left, right) => (right.article.date || '').localeCompare(left.article.date || '') || left.index - right.index)
      .slice(0, 6)
      .map(item => item.article.href);
    return [
      ordered,
      [...document.querySelectorAll('#latest-articles .latest-card-title')].map(link => link.getAttribute('href')),
      ['ai-navod-edit-kontrola.html', 'ai-navod-lepsi-prompty-10-zasad.html', 'ai-navod-prep-prompty.html']
        .map(href => window.siteArticles.find(article => article.href === href)),
      ['gemini-desktop-navod-pro-ucitele.html', 'gemini-notebook-navod-pro-ucitele.html', 'gemini-skills-pro-ucitele.html', 'gemini-storybook-navod-pro-ucitele.html', 'ai-navod-chatgpt-zacatek-bezpecne.html', 'ai-workflow-7-kroku-gemini-notebook.html']
        .map(href => window.siteArticles.find(article => article.href === href)),
      ['ai-workflow-8-otazek.html', 'ai-workflow-prep-edit.html', 'ai-workflow-udl-ai.html', 'ai-workflow-usetri-praci.html']
        .map(href => window.siteArticles.find(article => article.href === href)),
      ['ai-workflow-10-promptu-gemini.html', 'ai-workflow-18-promptu.html', 'ai-workflow-chatgpt-images-2-5.html', 'ai-workflow-gemini-notebook-ai-agent.html']
        .map(href => window.siteArticles.find(article => href === article.href)),
      ['ai-workflow-css-grid-vibe-coding.html', 'ai-workflow-fotografie-ucebnice.html', 'ai-workflow-prezentace-webova-stranka.html', 'ai-workflow-vibe-coding.html', 'ai-ziva-hlasova-ai-ve-vyuce.html']
        .map(href => window.siteArticles.find(article => href === article.href)),
      window.siteArticles.map(item => item.href).filter((href, index, all) => all.indexOf(href) !== index)
    ];
  });
  expect(actual).toEqual(expected);
  expect(duplicateHrefs).toEqual([]);
  for (const article of [...wave7Records, ...wave8Records, ...wave10Records, ...wave11Records, ...wave12Records]) {
    expect(article).toBeTruthy();
    for (const field of ['href', 'title', 'summary', 'category', 'date', 'dateLabel', 'icon', 'tags', 'badgeClass']) {
      expect(article[field], `catalog ${field} for ${article.href}`).toBeTruthy();
    }
  }
  const expectedDates = {
    'ai-workflow-8-otazek.html': ['2026-08-25', '25. srpna 2026'],
    'ai-workflow-prep-edit.html': ['2026-08-25', '25. srpna 2026'],
    'ai-workflow-udl-ai.html': ['2026-08-25', '25. srpna 2026'],
    'ai-workflow-usetri-praci.html': ['2026-08-25', '25. srpna 2026'],
    'ai-workflow-10-promptu-gemini.html': ['2026-08-26', '26. srpna 2026'],
    'ai-workflow-18-promptu.html': ['2026-08-25', '25. srpna 2026'],
    'ai-workflow-chatgpt-images-2-5.html': ['2026-09-11', '11. září 2026'],
    'ai-workflow-gemini-notebook-ai-agent.html': ['2026-09-08', '8. září 2026'],
    'ai-workflow-css-grid-vibe-coding.html': ['2026-09-03', '3. září 2026'],
    'ai-workflow-fotografie-ucebnice.html': ['2026-08-27', '27. srpna 2026'],
    'ai-workflow-prezentace-webova-stranka.html': ['2026-09-02', '2. září 2026'],
    'ai-workflow-vibe-coding.html': ['2026-08-26', '26. srpna 2026'],
    'ai-ziva-hlasova-ai-ve-vyuce.html': ['2026-09-21', '21. září 2026']
  };
  for (const article of [...wave10Records, ...wave11Records]) {
    expect(article.category).toBe('Workflow');
    expect([article.date, article.dateLabel]).toEqual(expectedDates[article.href]);
  }
  for (const article of wave12Records) {
    expect([article.date, article.dateLabel]).toEqual(expectedDates[article.href]);
  }
});

const wave9Articles = [
  { file: 'ai-navod-chatgpt-zacatek-bezpecne.html', title: 'ChatGPT pro učitele: jak začít bezpečně a co zvládnete i zdarma', baselineSha: '55347de6a974110071b66406404e7ab29dfef46b', activeArea: 'Začít s AI', breadcrumb: 'ChatGPT pro učitele', breadcrumbHref: 'chatgpt-pro-ucitele.html', h2: '#guide-chatgpt-zacatek-bezpecne-1-zacnete-na-oficialnim-chatgpt-1', h3: '#guide-chatgpt-zacatek-bezpecne-dulezite-4', copyButtons: 2 },
  { file: 'ai-workflow-7-kroku-gemini-notebook.html', title: 'Gemini Notebook jako kompletní příprava výuky', baselineSha: '55347de6a974110071b66406404e7ab29dfef46b', activeArea: 'Připravit výuku', breadcrumb: 'Workflow pro učitele', breadcrumbHref: 'ai.html#workflow', h2: '#toc-01', h3: '#guide-gemini-notebook-7-kroku-proc-tento-krok-delat-3', copyButtons: 8 }
];

const wave8Articles = [
  { file: 'gemini-desktop-navod-pro-ucitele.html', title: 'Gemini Desktop pro učitele: instalace a první kroky ve Windows', tocCount: 22, h2: '#wave8-gemini-desktop-navod-pro-ucitele-h2-01', h3: '#wave8-gemini-desktop-navod-pro-ucitele-h3-10', baselineSha: '815614650945db4c916f29a73c6444d00abe23c9', activeArea: 'Nástroje a asistenti', breadcrumb: 'Gemini pro učitele', breadcrumbHref: 'gemini-pro-ucitele.html', checkTocScroll: true, activeHeadingFollowsViewport: true },
  { file: 'gemini-notebook-navod-pro-ucitele.html', title: 'Gemini Notebook: jak si vytvořit sešit, který opravdu šetří práci', tocCount: 49, h2: '#ucel-potom-zdroje', h3: '#wave8-gemini-notebook-navod-pro-ucitele-h3-28', baselineSha: '815614650945db4c916f29a73c6444d00abe23c9', activeArea: 'Nástroje a asistenti', breadcrumb: 'Gemini Notebook', breadcrumbHref: 'gemini-notebook.html', checkTocScroll: true, activeHeadingFollowsViewport: true },
  { file: 'gemini-skills-pro-ucitele.html', title: 'Gemini Skills pro učitele: jednou nastavíte, pak už Gemini ví, jak má pracovat', tocCount: 35, h2: '#gemini-zaklady', h3: '#wave8-gemini-skills-pro-ucitele-h3-25', baselineSha: '815614650945db4c916f29a73c6444d00abe23c9', activeArea: 'Nástroje a asistenti', breadcrumb: 'Gemini pro učitele', breadcrumbHref: 'gemini-pro-ucitele.html', checkTocScroll: true, activeHeadingFollowsViewport: true },
  { file: 'gemini-storybook-navod-pro-ucitele.html', title: 'Gemini Storybook: jak vytvořit ilustrovaný příběh pro výuku', tocCount: 29, h2: '#kdy-storybook-pouzit', h3: '#wave8-gemini-storybook-navod-pro-ucitele-h3-20', baselineSha: '815614650945db4c916f29a73c6444d00abe23c9', activeArea: 'Nástroje a asistenti', breadcrumb: 'Gemini pro učitele', breadcrumbHref: 'gemini-pro-ucitele.html', checkTocScroll: true, activeHeadingFollowsViewport: true }
];
const wave8InteractiveArticles = [
  { file: 'gemini-notebook-navod-pro-ucitele.html', buttons: 2, details: 0, checkboxes: 0 },
  { file: 'gemini-skills-pro-ucitele.html', buttons: 11, details: 8, checkboxes: 8 },
  { file: 'gemini-storybook-navod-pro-ucitele.html', buttons: 3, details: 0, checkboxes: 0 }
];

test('wave 9 generated guides preserve body text, heading IDs, media, links, and SEO metadata', async ({ page }) => {
  const { execFileSync } = require('node:child_process');
  const normalize = value => value.replace(/\s+/g, ' ').trim();
  for (const article of wave9Articles) {
    const baseline = execFileSync('git', ['show', article.baselineSha + ':' + article.file], { encoding: 'utf8' });
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(baseURL + '/' + article.file, { waitUntil: 'networkidle' });
    const current = await page.evaluate(() => ({
      headings: [...document.querySelectorAll('.guide-article .article-content h2, .guide-article .article-content h3')].map(el => [el.tagName, el.id, el.textContent.replace(/\s+/g, ' ').trim()]),
      images: [...document.querySelectorAll('.guide-cover img, .guide-article .article-content img')].map(el => [el.getAttribute('src'), el.getAttribute('alt')]),
      links: [...document.querySelectorAll('.guide-article .article-content a')].map(el => el.getAttribute('href')),
      title: document.title,
      metadata: [...document.querySelectorAll('meta[name="description"], meta[property^="og:"], link[rel="canonical"]')].map(el => [el.getAttribute('name') || el.getAttribute('property') || 'canonical', el.getAttribute('content') || el.getAttribute('href')]),
      text: document.querySelector('.guide-article .article-content').innerText.replace(/\s+/g, ' ').trim()
    }));
    const previous = await page.evaluate(html => {
      const parsed = new DOMParser().parseFromString(html, 'text/html');
      const wrapper = document.createElement('article');
      wrapper.className = 'guide-article';
      wrapper.innerHTML = parsed.querySelector('.guide-article').innerHTML;
      document.body.append(wrapper);
      const text = wrapper.querySelector('.article-content').innerText.replace(/\s+/g, ' ').trim();
      wrapper.remove();
      return {
        headings: [...parsed.querySelectorAll('.guide-article .article-content h2, .guide-article .article-content h3')].map(el => [el.tagName, el.id, el.textContent.replace(/\s+/g, ' ').trim()]),
        images: [...parsed.querySelectorAll('.guide-cover img, .guide-article .article-content img')].map(el => [el.getAttribute('src'), el.getAttribute('alt')]),
        links: [...parsed.querySelectorAll('.guide-article .article-content a')].map(el => el.getAttribute('href')),
        title: parsed.title,
        metadata: [...parsed.querySelectorAll('meta[name="description"], meta[property^="og:"], link[rel="canonical"]')].map(el => [el.getAttribute('name') || el.getAttribute('property') || 'canonical', el.getAttribute('content') || el.getAttribute('href')]),
        text
      };
    }, baseline);
    expect(current).toEqual(previous);
    const expectedDate = article.file.startsWith('ai-workflow-') ? '29. srpna 2026' : '27. srpna 2026';
    await expect(page.locator('.guide-eyebrow')).toContainText(expectedDate);
    await expect(page.locator('.guide-breadcrumbs > ol > li').nth(2)).toHaveText(article.title);
  }
});

test('wave 9 shared TOC, navigation, breadcrumbs, and responsive layout work at required widths', async ({ page }) => {
  for (const article of wave9Articles) {
    for (const width of widths) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(baseURL + '/' + article.file);
      const toc = page.locator('.article-content-navigation');
      await expect(toc).toHaveCount(1);
      await expect(page.locator('.guide-toc-mobile, .guide-toc-desktop, .guide-toc-list')).toHaveCount(0);
      await expect(page.locator('.site-header')).toHaveCount(1);
      await expect(page.locator('.site-nav-pilot details')).toHaveCount(6);
      await expect(page.locator('.site-nav-pilot details[data-active="true"] > summary')).toHaveText(article.activeArea);
      await expect(page.locator('.guide-breadcrumbs > ol > li')).toHaveCount(3);
      await expect(page.locator('.guide-breadcrumbs > ol > li').nth(1)).toHaveText(article.breadcrumb);
      await expect(page.locator('.guide-breadcrumbs > ol > li').nth(1).locator('a')).toHaveAttribute('href', article.breadcrumbHref);
      await expect(page.locator('.guide-breadcrumbs > ol > li').nth(2)).toHaveAttribute('aria-current', 'page');
      const state = await page.evaluate(() => {
        const navigation = document.querySelector('.article-content-navigation');
        const links = [...navigation.querySelectorAll('a[href^="#"]')];
        return {
          scrollWidth: document.documentElement.scrollWidth,
          open: navigation.open,
          position: getComputedStyle(navigation).position,
          ids: [...document.querySelectorAll('[id]')].map(node => node.id),
          h2Count: document.querySelectorAll('.guide-article .article-content h2[id]').length,
          tocH2Count: navigation.querySelectorAll(':scope > nav > ol > li').length,
          tocH3Count: navigation.querySelectorAll(':scope > nav > ol > li > ol > li').length,
          anchorsResolve: links.every(link => document.getElementById(decodeURIComponent(link.hash.slice(1)))),
          images: [...document.querySelectorAll('.guide-cover img')].map(image => ({complete:image.complete,width:image.naturalWidth,alt:image.alt}))
        };
      });
      expect(state.scrollWidth, 'overflow at ' + width + 'px in ' + article.file).toBeLessThanOrEqual(width + 1);
      expect(new Set(state.ids).size).toBe(state.ids.length);
      expect(state.anchorsResolve).toBe(true);
      expect(state.tocH2Count).toBe(state.h2Count);
      expect(state.tocH3Count).toBeGreaterThan(0);
      expect(state.images.length).toBe(1);
      expect(state.images.every(image => image.complete && image.width > 0 && image.alt)).toBe(true);
      if (width > 960) {
        expect(state.position).toBe('sticky');
        expect(state.open).toBe(true);
      } else {
        expect(state.position).toBe('static');
        expect(state.open).toBe(true);
      }
      if (width === 1440) {
        await page.locator('.guide-hero').screenshot({ path: 'artifacts/' + article.file + '-desktop-1440-hero.png' });
        await toc.scrollIntoViewIfNeeded();
        await toc.screenshot({ path: 'artifacts/' + article.file + '-desktop-1440-sticky-toc.png' });
        await page.locator('.prompt-card').first().screenshot({ path: 'artifacts/' + article.file + '-desktop-1440-prompt.png' });
      }
      if (width === 390) {
        await page.locator('.guide-hero').screenshot({ path: 'artifacts/' + article.file + '-mobile-390-hero.png' });
        await toc.scrollIntoViewIfNeeded();
        await toc.screenshot({ path: 'artifacts/' + article.file + '-mobile-390-expanded-toc.png' });
        await page.locator('.prompt-card').first().screenshot({ path: 'artifacts/' + article.file + '-mobile-390-prompt.png' });
      }
    }
  }
});

test('wave 9 H2/H3 links update the active chapter and anchors work without JavaScript', async ({ browser, page }) => {
  for (const article of wave9Articles) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(baseURL + '/' + article.file);
    for (const fragment of [article.h2, article.h3]) {
      await page.locator('.article-content-navigation a[href="' + fragment + '"]').click();
      await expect(page).toHaveURL(new RegExp(fragment + '$'));
      await expect(page.locator(fragment)).toBeInViewport();
      await expect.poll(() => page.evaluate(() => {
        const links = [...document.querySelectorAll('.article-content-navigation a[href^="#"]')].map(link => ({
          href: link.getAttribute('href'),
          heading: document.getElementById(decodeURIComponent(link.hash.slice(1)))
        })).filter(item => item.heading);
        const marker = Math.min(window.innerHeight * 0.34, 240);
        const passed = links.filter(item => item.heading.getBoundingClientRect().top <= marker);
        const expected = (passed[passed.length - 1] || links[0])?.href || null;
        const active = document.querySelector('.article-content-navigation a[aria-current="location"]')?.getAttribute('href') || null;
        return expected === active;
      })).toBe(true);
    }
    const noJs = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
    const noJsPage = await noJs.newPage();
    await noJsPage.goto(baseURL + '/' + article.file);
    await expect(noJsPage.locator('.article-content-navigation')).toHaveJSProperty('open', true);
    await noJsPage.locator('.article-content-navigation a[href="' + article.h2 + '"]').click();
    await expect(noJsPage).toHaveURL(new RegExp(article.h2 + '$'));
    await expect(noJsPage.locator(article.h2)).toBeInViewport();
    await noJs.close();
  }
});

test('wave 9 mobile TOC supports keyboard toggling and each prompt copies its exact text', async ({ browser }) => {
  const keyboardContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const keyboardPage = await keyboardContext.newPage();
  for (const article of wave9Articles) {
    await keyboardPage.goto(baseURL + '/' + article.file);
    const toc = keyboardPage.locator('.article-content-navigation');
    const summary = toc.locator('summary');
    await summary.focus();
    await keyboardPage.keyboard.press('Space');
    await expect(toc).toHaveJSProperty('open', false);
    await keyboardPage.keyboard.press('Enter');
    await expect(toc).toHaveJSProperty('open', true);
    await expect(summary).toBeFocused();
  }
  await keyboardContext.close();

  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  for (const article of wave9Articles) {
    await page.goto(baseURL + '/' + article.file);
    const buttons = page.locator('.prompt-copy-button');
    await expect(buttons).toHaveCount(article.copyButtons);
    for (let index = 0; index < article.copyButtons; index++) {
      const button = buttons.nth(index);
      const targetId = await button.getAttribute('data-copy-prompt');
      const expected = await page.locator('#' + targetId).innerText();
      await button.click();
      await expect(button).toHaveText('Zkopírováno');
      const copied = await page.evaluate(() => navigator.clipboard.readText());
      expect(copied.trim(), article.file + ' prompt ' + (index + 1)).toBe(expected.trim());
    }
  }
  await context.close();
});

test('wave 9 hero computed styles, desktop/mobile screenshots, and approved reference comparison', async ({ page }) => {
  const fs = require('node:fs');
  const cards = [];
  const records = [];
  for (const article of wave9Articles) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(baseURL + '/' + article.file, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const record = await page.evaluate(() => {
        const selectors = ['.guide-hero', '.guide-hero-copy', '.guide-hero-extra', '.guide-meta span', '.workflow-article-summary', '.guide-overview', '.guide-overview .workflow-route', '.guide-overview .workflow-stage', '.guide-hero h1', '.guide-hero-lead', '.guide-hero-illustration'];
        const snapshot = selector => {
          const el = document.querySelector(selector);
          if (!el) return null;
          const style = getComputedStyle(el), before = getComputedStyle(el, '::before'), after = getComputedStyle(el, '::after');
          return {selector,backgroundColor:style.backgroundColor,backgroundImage:style.backgroundImage,color:style.color,opacity:style.opacity,filter:style.filter,backdropFilter:style.backdropFilter,
            before:{display:before.display,content:before.content,backgroundColor:before.backgroundColor,backgroundImage:before.backgroundImage,opacity:before.opacity},
            after:{display:after.display,content:after.content,backgroundColor:after.backgroundColor,backgroundImage:after.backgroundImage,opacity:after.opacity}};
        };
        return {file:location.pathname.split('/').pop(),width:innerWidth,body:snapshot('body'),hero:snapshot('.guide-hero'),surfaces:selectors.map(snapshot).filter(Boolean),
          title:snapshot('.guide-hero h1'),lead:snapshot('.guide-hero-lead'),image:(()=>{const el=document.querySelector('.guide-hero-illustration img');return {src:el?.getAttribute('src'),complete:el?.complete,naturalWidth:el?.naturalWidth,alt:el?.alt};})()};
      });
      records.push(record);
      expect(record.image.complete && record.image.naturalWidth > 0).toBe(true);
      expect(record.title.color).toBe('rgb(18, 63, 54)');
      expect(record.lead.color).toBe('rgb(49, 87, 75)');
      for (const surface of record.surfaces.filter(item => !['.guide-hero h1','.guide-hero-lead'].includes(item.selector))) {
        expect(surface.filter, surface.selector).toBe('none');
        expect(surface.backdropFilter, surface.selector).toBe('none');
        for (const paint of [surface.backgroundColor,surface.before.backgroundColor,surface.after.backgroundColor]) {
          const match=paint.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
          if(!match)continue;
          const alpha=match[4]===undefined?1:Number(match[4]);
          if(alpha<0.05)continue;
          const brightness=[1,2,3].reduce((sum,channel)=>sum+Number(match[channel])*alpha+255*(1-alpha),0);
          expect(brightness,surface.selector+' dark hero surface').toBeGreaterThan(570);
        }
        for(const paint of [surface.backgroundImage,surface.before.backgroundImage,surface.after.backgroundImage]){
          if(!paint||paint==='none')continue;
          expect(paint).not.toMatch(/url\(/i);
          for(const stop of paint.matchAll(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/g)){
            const alpha=stop[4]===undefined?1:Number(stop[4]);
            const brightness=[1,2,3].reduce((sum,channel)=>sum+Number(stop[channel])*alpha+255*(1-alpha),0);
            expect(brightness,surface.selector+' dark gradient stop').toBeGreaterThan(570);
          }
        }
      }
      if(width===1440){
        const image=await page.locator('.guide-hero').screenshot({path:'artifacts/'+article.file+'-hero-1440.png'});
        cards.push({title:article.title,data:image.toString('base64')});
      }
    }
  }
  await page.setViewportSize({width:1440,height:1000});
  await page.goto(baseURL+'/ai-agenti-co-je-ai-agent.html',{waitUntil:'networkidle'});
  const reference=await page.locator('.workflow-shell').screenshot();
  cards.push({title:'Schválená světlá reference',data:reference.toString('base64')});
  await page.setContent('<!doctype html><html lang="cs"><meta charset="utf-8"><title>Vlna 9 – hero comparison</title><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#fffefa;color:#102d2b;font:600 15px Arial,sans-serif}h1{margin:0 0 18px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}article{padding:10px;border:1px solid #dfe8e1;border-radius:12px;background:#fff;overflow:hidden}h2{font-size:16px;min-height:40px;margin:4px 0 10px}img{display:block;width:100%;height:auto;object-fit:contain;border:1px solid #e5e7e1;border-radius:8px}</style><h1>Etapa 7Y – hero comparison and approved light reference</h1><main class="grid">'+cards.map(x=>'<article><h2>'+x.title+'</h2><img alt="'+x.title+'" src="data:image/png;base64,'+x.data+'"></article>').join('')+'</main></html>');
  await page.screenshot({path:'artifacts/wave9-hero-contact-sheet.png',fullPage:true});
  fs.writeFileSync('artifacts/wave9-computed-styles.json',JSON.stringify(records,null,2));
});


const wave10Articles = [
  { file: 'ai-workflow-8-otazek.html', title: '8 otázek, které by si měl učitel položit při práci s AI', activeArea: 'Připravit výuku', breadcrumb: 'Workflow pro učitele', breadcrumbHref: 'ai.html#workflow', tocCount: 25, h2: '#ai-workflow-8-otazek-h2-01', h3: '#ai-workflow-8-otazek-h3-01', baselineSha: '94be232d7d0f20e589deb5910c820a6b95fc5171', checkTocScroll: true, waitForStableViewportChapter: true, representative: '#ai-workflow-8-otazek-h2-01' },
  { file: 'ai-workflow-prep-edit.html', title: 'PREP + EDIT: Praktický workflow pro práci s AI', activeArea: 'Připravit výuku', breadcrumb: 'Workflow pro učitele', breadcrumbHref: 'ai.html#workflow', tocCount: 27, h2: '#ai-workflow-prep-edit-h2-01', h3: '#ai-workflow-prep-edit-h3-01', baselineSha: '94be232d7d0f20e589deb5910c820a6b95fc5171', checkTocScroll: true, representative: '#ai-workflow-prep-edit-h2-03' },
  { file: 'ai-workflow-udl-ai.html', title: 'UDL + AI: Jak přizpůsobit výuku různým žákům', activeArea: 'Připravit výuku', breadcrumb: 'Workflow pro učitele', breadcrumbHref: 'ai.html#workflow', tocCount: 40, h2: '#toc-01', h3: '#ai-workflow-udl-ai-h3-01', baselineSha: '94be232d7d0f20e589deb5910c820a6b95fc5171', legacyInternalIds: ['toc-heading-ai-workflow-udl-ai-html'], legacyChapterAnchors: [['toc-01', 'Co je UDL?'], ['toc-02', 'AI může pomoci hlavně s variantami'], ['toc-03', 'Největší chyba: „udělej to jednodušší“'], ['toc-04', 'UDL není „speciální verze pro slabší žáky“'], ['toc-05', 'Co má zůstat stejné?'], ['toc-06', 'Praktický prompt: vytvoř tři varianty']], checkTocScroll: true, representative: '#toc-01' },
  { file: 'ai-workflow-usetri-praci.html', title: 'Jak může AI skutečně ušetřit učiteli práci', activeArea: 'Připravit výuku', breadcrumb: 'Workflow pro učitele', breadcrumbHref: 'ai.html#workflow', tocCount: 34, h2: '#toc-01', h3: '#ai-workflow-usetri-praci-h3-05', baselineSha: '94be232d7d0f20e589deb5910c820a6b95fc5171', legacyInternalIds: ['toc-heading-ai-workflow-usetri-praci-html'], legacyChapterAnchors: [['toc-01', 'Největší úspora času nevzniká tam, kde AI udělá všechno'], ['toc-02', 'Kde AI šetří nejvíc času?'], ['toc-03', 'Kde AI čas naopak často neušetří?'], ['toc-04', 'Co bych AI nepředávala bez velmi silné kontroly'], ['toc-05', 'Metoda 3D: Delegate – Do together – Decide yourself'], ['toc-06', 'Jeden materiál, více výstupů']], checkTocScroll: true, representative: '#toc-02' }
];

const wave11Articles = [
  { file: 'ai-workflow-10-promptu-gemini.html', title: '10 promptů pro Gemini Notebook, které mohou učiteli ušetřit hodiny práce', activeArea: 'Připravit výuku', breadcrumb: 'Workflow pro učitele', breadcrumbHref: 'ai.html#workflow', tocCount: 23, h2: '#toc-01', h3: '#ai-workflow-10-promptu-gemini-h3-01', baselineSha: '4f48ddb65eef3f19fa4be7ff62b05b3d8e2bb8c5', checkTocScroll: true, waitForStableViewportChapter: true, noLegacyTopbar: true, legacyInternalIds: ['toc-heading-ai-workflow-10-promptu-gemini-html'], representative: '#ai-workflow-10-promptu-gemini-h2-07', promptCount: 13, representativePromptIndex: 1 },
  { file: 'ai-workflow-18-promptu.html', title: '18 praktických AI promptů pro učitele', activeArea: 'Připravit výuku', breadcrumb: 'Workflow pro učitele', breadcrumbHref: 'ai.html#workflow', tocCount: 26, h2: '#toc-01', h3: '#ai-workflow-18-promptu-h3-01', baselineSha: '4f48ddb65eef3f19fa4be7ff62b05b3d8e2bb8c5', checkTocScroll: true, waitForStableViewportChapter: true, noLegacyTopbar: true, legacyInternalIds: ['toc-heading-ai-workflow-18-promptu-html'], representative: '#ai-workflow-18-promptu-h2-02', promptCount: 24, representativePromptIndex: 2 },
  { file: 'ai-workflow-chatgpt-images-2-5.html', title: 'ChatGPT Images 2.5 ve výuce: od jednoduchého obrázku k výukovému materiálu', activeArea: 'Připravit výuku', breadcrumb: 'Workflow pro učitele', breadcrumbHref: 'ai.html#workflow', tocCount: 20, h2: '#toc-01', h3: '#ai-workflow-chatgpt-images-2-5-h3-01', baselineSha: '4f48ddb65eef3f19fa4be7ff62b05b3d8e2bb8c5', checkTocScroll: true, waitForStableViewportChapter: true, noLegacyTopbar: true, legacyInternalIds: ['toc-heading-ai-workflow-chatgpt-images-2-5-html'], representative: '#toc-03', promptCount: 24, representativePromptIndex: 0 },
  { file: 'ai-workflow-gemini-notebook-ai-agent.html', title: 'Jak vytvořit chytrý učitelský sešit v Gemini Notebooku pomocí AI agenta', activeArea: 'Připravit výuku', breadcrumb: 'Workflow pro učitele', breadcrumbHref: 'ai.html#workflow', tocCount: 20, h2: '#toc-01', h3: '#ai-workflow-gemini-notebook-ai-agent-h3-01', baselineSha: '4f48ddb65eef3f19fa4be7ff62b05b3d8e2bb8c5', checkTocScroll: true, waitForStableViewportChapter: true, noLegacyTopbar: true, legacyInternalIds: ['toc-heading-ai-workflow-gemini-notebook-ai-agent-html'], representative: '#ai-workflow-gemini-notebook-ai-agent-h2-07', promptCount: 5, representativePromptIndex: 1 },
];

const wave12Articles = [
  { file: 'ai-workflow-css-grid-vibe-coding.html', title: 'CSS Grid: proč se při vibe codingu vyplatí rozumět řádkům a sloupcům', activeArea: 'Tvořit s AI', breadcrumb: 'Články o Vibe Codingu', breadcrumbHref: 'vibe-coding-clanky.html', tocCount: 13, h2: '#ai-workflow-css-grid-vibe-coding-h2-01', baselineSha: '3a566d2deb6e54e202acd4d1dc88194714477093', noLegacyTopbar: true, waitForStableViewportChapter: true, representative: '#ai-workflow-css-grid-vibe-coding-h2-02' },
  { file: 'ai-workflow-fotografie-ucebnice.html', title: 'Fotografii učebnice už nemusíte přepisovat', activeArea: 'Připravit výuku', breadcrumb: 'ChatGPT pro učitele', breadcrumbHref: 'chatgpt-pro-ucitele.html', tocCount: 4, h2: '#ai-workflow-fotografie-ucebnice-h2-01', baselineSha: '3a566d2deb6e54e202acd4d1dc88194714477093', noLegacyTopbar: true, waitForStableViewportChapter: true, representative: '#ai-workflow-fotografie-ucebnice-h2-02' },
  { file: 'ai-workflow-prezentace-webova-stranka.html', title: 'Od prezentace k webové stránce', activeArea: 'Připravit výuku', breadcrumb: 'Workflow pro učitele', breadcrumbHref: 'ai.html#workflow', tocCount: 15, h2: '#ai-workflow-prezentace-webova-stranka-h2-01', h3: '#ai-workflow-prezentace-webova-stranka-h3-01', baselineSha: '3a566d2deb6e54e202acd4d1dc88194714477093', noLegacyTopbar: true, waitForStableViewportChapter: true, representative: '#ai-workflow-prezentace-webova-stranka-h2-03' },
  { file: 'ai-workflow-vibe-coding.html', title: 'Vibe coding krok za krokem', activeArea: 'Tvořit s AI', breadcrumb: 'Vibe Coding', breadcrumbHref: 'vibe-coding.html', tocCount: 15, h2: '#ai-workflow-vibe-coding-h2-01', baselineSha: '3a566d2deb6e54e202acd4d1dc88194714477093', noLegacyTopbar: true, waitForStableViewportChapter: true, representative: '#ai-workflow-vibe-coding-h2-02' },
  { file: 'ai-ziva-hlasova-ai-ve-vyuce.html', title: 'Když AI začne skutečně naslouchat: živá hlasová umělá inteligence ve výuce', activeArea: 'Číst a objevovat', breadcrumb: 'AI ve vzdělávání', breadcrumbHref: 'ai.html#novinky', tocCount: 21, h2: '#ai-ziva-hlasova-ai-ve-vyuce-h2-01', h3: '#ai-ziva-hlasova-ai-ve-vyuce-h3-01', baselineSha: '3a566d2deb6e54e202acd4d1dc88194714477093', noLegacyTopbar: true, waitForStableViewportChapter: true, representative: '#ai-ziva-hlasova-ai-ve-vyuce-h2-03' },
];

const wave13Articles = [
  { file: 'asistent-ucitele-osobni-ai-asistent.html', title: 'Asistent učitele: Pomocník, který pedagogům dosud chyběl', activeArea: 'Nástroje a asistenti', breadcrumb: 'AI asistenti a boti', breadcrumbHref: 'asistenti.html', tocCount: 14, h2: '#wave13-asistent-ucitele-osobni-ai-asistent-h2-01', h3: '#wave13-asistent-ucitele-osobni-ai-asistent-h3-01', baselineSha: '646735727573f95b337fa03977b12530b8ebff61', noLegacyTopbar: true, waitForStableViewportChapter: true, representative: '#wave13-asistent-ucitele-osobni-ai-asistent-h2-02' },
  { file: 'neplytvej-inteligenci-ai-modely.html', title: 'Neplýtvej inteligencí', activeArea: 'Připravit výuku', breadcrumb: 'Praktické návody', breadcrumbHref: 'ai.html#navody', tocCount: 24, h2: '#jak-nevycerpat', h3: '#wave13-neplytvej-inteligenci-ai-modely-h3-01', baselineSha: '646735727573f95b337fa03977b12530b8ebff61', noLegacyTopbar: true, legacyInternalIds: ['toc-heading-neplytvej-inteligenci'], waitForStableViewportChapter: true, representative: '#princip-1' },
  { file: 'skill-anglictina-vyukove-materialy.html', title: 'Jeden SKILL, sedm výukových materiálů: AI pomocník pro angličtinu', activeArea: 'Učit s AI', breadcrumb: 'Angličtina', breadcrumbHref: 'anglictina.html', tocCount: 13, h2: '#wave13-skill-anglictina-vyukove-materialy-h2-01', h3: '#wave13-skill-anglictina-vyukove-materialy-h3-01', baselineSha: '646735727573f95b337fa03977b12530b8ebff61', noLegacyTopbar: true, waitForStableViewportChapter: true, representative: '#wave13-skill-anglictina-vyukove-materialy-h2-02' },
  { file: 'vibe-coding-bezpecnost-kodu-php2shell.html', title: 'Vibe Coding: AI ti naprogramuje aplikaci. Ale kdo zkontroluje její bezpečnost?', activeArea: 'Tvořit s AI', breadcrumb: 'Vibe Coding', breadcrumbHref: 'vibe-coding.html', tocCount: 10, h2: '#wave13-vibe-coding-bezpecnost-kodu-php2shell-h2-01', baselineSha: '646735727573f95b337fa03977b12530b8ebff61', noLegacyTopbar: true, waitForStableViewportChapter: true, representative: '#wave13-vibe-coding-bezpecnost-kodu-php2shell-h2-02' },
  { file: 'vibe-coding-ucitele.html', title: 'Úvod do vibe codingu pro učitele', activeArea: 'Tvořit s AI', breadcrumb: 'Vibe Coding', breadcrumbHref: 'vibe-coding.html', tocCount: 12, h2: '#wave13-vibe-coding-ucitele-h2-01', baselineSha: '646735727573f95b337fa03977b12530b8ebff61', noLegacyTopbar: true, waitForStableViewportChapter: true, representative: '#wave13-vibe-coding-ucitele-h2-02' },
];
const wave13Gallery = { file: 'vibe-coding-pro-ucitele.html', title: 'Co si můžete vytvořit do výuky', activeArea: 'Tvořit s AI', breadcrumb: 'Vibe Coding', breadcrumbHref: 'vibe-coding.html', baselineSha: '646735727573f95b337fa03977b12530b8ebff61' };


const wave14Articles = [
  { file: 'ai-novinka-agenti-onenote-pruvodce-ucenim.html', title: 'AI ve vzdělávání: chytřejší agenti, OneNote v ChatGPT a AI jako průvodce učením', activeArea: 'Číst a objevovat', breadcrumb: 'AI ve vzdělávání', breadcrumbHref: 'ai.html#novinky', tocCount: 14, h2: '#wave14-agenti-onenote-pruvodce-ucenim-h2-01', h3: '#wave14-agenti-onenote-pruvodce-ucenim-h3-01', baselineSha: '709eeb0edb22c8bdd988ec41999e087b25861143', noLegacyTopbar: true, waitForStableViewportChapter: true, representative: '#wave14-agenti-onenote-pruvodce-ucenim-h2-03' },
  { file: 'ai-novinka-gemini-desktop-chatgpt-word-agenti.html', title: 'AI ve vzdělávání: Gemini na Windows, ChatGPT ve Wordu a nové hranice pro AI agenty', activeArea: 'Číst a objevovat', breadcrumb: 'AI ve vzdělávání', breadcrumbHref: 'ai.html#novinky', tocCount: 13, h2: '#wave14-gemini-desktop-chatgpt-word-agenti-h2-01', h3: '#wave14-gemini-desktop-chatgpt-word-agenti-h3-01', baselineSha: '709eeb0edb22c8bdd988ec41999e087b25861143', noLegacyTopbar: true, waitForStableViewportChapter: true, representative: '#wave14-gemini-desktop-chatgpt-word-agenti-h2-03' },
  { file: 'ai-novinka-sdilene-zdroje-propojene-aplikace-2026.html', title: 'AI ve vzdělávání: sdílené zdroje, propojené aplikace a bezpečnější práce s daty', activeArea: 'Číst a objevovat', breadcrumb: 'AI ve vzdělávání', breadcrumbHref: 'ai.html#novinky', tocCount: 17, h2: '#wave14-sdilene-zdroje-propojene-aplikace-2026-h2-01', h3: '#wave14-sdilene-zdroje-propojene-aplikace-2026-h3-01', baselineSha: '709eeb0edb22c8bdd988ec41999e087b25861143', noLegacyTopbar: true, waitForStableViewportChapter: true, representative: '#wave14-sdilene-zdroje-propojene-aplikace-2026-h2-03' },
  { file: 'notebooklm-hlasovy-rozhovor-nad-zdroji.html', title: 'Když AI zná naše učivo: hlasový rozhovor nad zdroji v NotebookLM', activeArea: 'Číst a objevovat', breadcrumb: 'AI ve vzdělávání', breadcrumbHref: 'ai.html#novinky', tocCount: 12, h2: '#wave14-notebooklm-hlasovy-rozhovor-nad-zdroji-h2-01', h3: null, baselineSha: '709eeb0edb22c8bdd988ec41999e087b25861143', noLegacyTopbar: true, waitForStableViewportChapter: true, representative: '#wave14-notebooklm-hlasovy-rozhovor-nad-zdroji-h2-03' },
];
const wave15Articles = [
  { file: 'ai-novinka-ai-ve-vzdelavani-srpen-2026.html', title: 'AI ve vzdělávání: co je nového na konci srpna', activeArea: 'Číst a objevovat', breadcrumb: 'AI ve vzdělávání', breadcrumbHref: 'ai.html#novinky', tocCount: 10, h2: '#wave15-ai-ve-vzdelavani-srpen-2026-h2-01', h3: '#wave15-ai-ve-vzdelavani-srpen-2026-h3-01', baselineSha: '1a2ca130db05a6cfe46e072235a18ecb75d2adbb', noLegacyTopbar: true, waitForStableViewportChapter: true, representative: '#wave15-ai-ve-vzdelavani-srpen-2026-h2-02', sourceH2: 8, sourceH3: 6, sourceImages: 1 },
  { file: 'ai-novinka-gemini-classroom.html', title: 'Gemini míří přímo do výuky', activeArea: 'Číst a objevovat', breadcrumb: 'AI ve vzdělávání', breadcrumbHref: 'ai.html#novinky', tocCount: 4, h2: '#wave15-gemini-classroom-h2-01', h3: null, baselineSha: '1a2ca130db05a6cfe46e072235a18ecb75d2adbb', noLegacyTopbar: true, waitForStableViewportChapter: true, representative: '#wave15-gemini-classroom-h2-02', sourceH2: 6, sourceH3: 3, sourceImages: 1 },
  { file: 'ai-novinka-microsoft-ai-workflow.html', title: 'Microsoft skládá AI workflow pro učitele', activeArea: 'Číst a objevovat', breadcrumb: 'AI ve vzdělávání', breadcrumbHref: 'ai.html#novinky', tocCount: 6, h2: '#wave15-microsoft-ai-workflow-h2-01', h3: null, baselineSha: '1a2ca130db05a6cfe46e072235a18ecb75d2adbb', noLegacyTopbar: true, waitForStableViewportChapter: true, representative: '#wave15-microsoft-ai-workflow-h2-02', sourceH2: 8, sourceH3: 3, sourceImages: 1 },
  { file: 'ai-novinka-microsoft-gemini.html', title: 'Microsoft skládá AI do jednoho prostředí', activeArea: 'Číst a objevovat', breadcrumb: 'AI ve vzdělávání', breadcrumbHref: 'ai.html#novinky', tocCount: 6, h2: '#wave15-microsoft-gemini-h2-01', h3: null, baselineSha: '1a2ca130db05a6cfe46e072235a18ecb75d2adbb', noLegacyTopbar: true, waitForStableViewportChapter: true, representative: '#wave15-microsoft-gemini-h2-02', sourceH2: 8, sourceH3: 3, sourceImages: 1 },
  { file: 'ai-novinka-vykonnejsi-ai.html', title: 'Výkonnější AI se stává běžně dostupnou', activeArea: 'Číst a objevovat', breadcrumb: 'AI ve vzdělávání', breadcrumbHref: 'ai.html#novinky', tocCount: 6, h2: '#wave15-vykonnejsi-ai-h2-01', h3: null, baselineSha: '1a2ca130db05a6cfe46e072235a18ecb75d2adbb', noLegacyTopbar: true, waitForStableViewportChapter: true, representative: '#wave15-vykonnejsi-ai-h2-02', sourceH2: 8, sourceH3: 3, sourceImages: 1 },
];

const migrationArticles = [...wave1Articles, ...wave2Articles, ...wave3Articles, ...wave4Articles, ...wave5Articles, ...wave6Articles, ...wave7Articles, ...wave8Articles, ...wave10Articles, ...wave11Articles, ...wave12Articles, ...wave13Articles, ...wave14Articles, ...wave15Articles];

for (const article of migrationArticles) {
  test.describe(`Migration: ${article.file}`, () => {
    test('responsive layout, global navigation, contents, related articles, and screenshots', async ({ page }) => {
      const problems = [];
      page.on('console', message => { if (message.type() === 'error') problems.push(`console: ${message.text()}`); });
      page.on('pageerror', error => problems.push(`pageerror: ${error.message}`));
      page.on('response', response => {
        if (response.url().startsWith(baseURL) && response.status() >= 400) problems.push(`HTTP ${response.status()}: ${response.url()}`);
      });
      page.on('requestfailed', request => {
        if (request.url().startsWith(baseURL)) problems.push(`request failed: ${request.url()} (${request.failure()?.errorText || 'unknown'})`);
      });

      for (const width of widths) {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`${baseURL}/${article.file}`);
        await page.locator('.workflow-article img, .workflow-hero img').evaluateAll(images => Promise.all(images.map(image => { image.loading = 'eager'; return image.decode().catch(() => false); })));
        await page.evaluate(() => window.scrollTo(0, 0));
        await expect(page.locator('.site-header')).toHaveCount(1);
        if (article.noLegacyTopbar) await expect(page.locator('.workflow-topbar')).toHaveCount(0);
        await expect(page.locator('.menu-toggle')).toHaveCount(1);
        await expect(page.locator('.brand')).toHaveAttribute('href', 'index.html');
        await expect(page.locator('.brand-symbol')).toBeVisible();
        await expect(page.locator('.site-nav-pilot details')).toHaveCount(6);
        await expect(page.locator('.site-nav-pilot details[data-active="true"] > summary'))
          .toHaveText(article.activeArea || 'Tvořit s AI');
        await expect(page.locator('.site-breadcrumbs > ol > li')).toHaveCount(3);
        await expect(page.locator('.site-breadcrumbs > ol > li').nth(0)).toContainText('Domů');
        await expect(page.locator('.site-breadcrumbs > ol > li').nth(1)).toHaveText(article.breadcrumb || 'AI agenti');
        await expect(page.locator('.site-breadcrumbs > ol > li').nth(1).locator('a')).toHaveAttribute('href', article.breadcrumbHref || 'ai-agenti.html');
        await expect(page.locator('.site-breadcrumbs > ol > li').nth(2)).toHaveAttribute('aria-current', 'page');
        await expect(page.locator('.site-breadcrumbs > ol > li').nth(2)).toHaveText(article.title);
        await expect(page.locator('.article-toc')).toHaveCount(0);
        const toc = page.locator('.article-content-navigation');
        await expect(toc).toHaveCount(1);
        await expect(toc.locator('a')).toHaveCount(article.tocCount);
        await expect(page.locator('.workflow-related')).toHaveCount(1);
        await expect(page.locator('.workflow-main > .workflow-article')).toHaveCount(1);
        await expect(page.locator('.workflow-main > .workflow-related')).toHaveCount(1);

        const state = await page.evaluate(() => {
          const ids = [...document.querySelectorAll('[id]')].map(node => node.id);
          const links = [...document.querySelectorAll('.article-content-navigation a[href^="#"]')];
          return {
            scrollWidth: document.documentElement.scrollWidth,
            viewportWidth: innerWidth,
            idsUnique: new Set(ids).size === ids.length,
            anchorsResolve: links.every(link => document.getElementById(decodeURIComponent(link.hash.slice(1)))),
            mainChildren: [...document.querySelector('.workflow-main').children].map(node => node.className),
            tocPosition: getComputedStyle(document.querySelector('.article-content-navigation')).position,
            bodyBackground: getComputedStyle(document.body).backgroundColor,
            heroTitleColor: getComputedStyle(document.querySelector('.workflow-hero h1')).color,
            related: document.querySelector('.workflow-related').getBoundingClientRect().toJSON(),
            article: document.querySelector('.workflow-article').getBoundingClientRect().toJSON(),
            toc: document.querySelector('.article-content-navigation').getBoundingClientRect().toJSON(),
            tocScroll: {
              overflowY: getComputedStyle(document.querySelector('.article-content-navigation nav')).overflowY,
              scrollHeight: document.querySelector('.article-content-navigation nav').scrollHeight,
              clientHeight: document.querySelector('.article-content-navigation nav').clientHeight
            },
            imageStatus: [...document.querySelectorAll('.workflow-article img, .workflow-hero img')].map(img => ({
              src: img.getAttribute('src'), complete: img.complete, naturalWidth: img.naturalWidth, alt: img.getAttribute('alt')
            })),
            promptStyles: [...document.querySelectorAll('.article-prompt')].slice(0, 1).map(el => ({
              background: getComputedStyle(el).backgroundColor, color: getComputedStyle(el).color
            })),
            codeOverflow: [...document.querySelectorAll('pre')].map(el => ({
              scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, overflowX: getComputedStyle(el).overflowX
            }))
          };
        });
        expect(state.scrollWidth, `horizontal overflow at ${width}px on ${article.file}`).toBeLessThanOrEqual(width + 1);
        expect(state.idsUnique, `duplicate IDs on ${article.file}`).toBe(true);
        expect(state.anchorsResolve, `broken contents anchor on ${article.file}`).toBe(true);
        expect(state.bodyBackground).toBe('rgb(255, 254, 250)');
        expect(state.imageStatus.length, `article illustration missing on ${article.file}`).toBeGreaterThan(0);
        expect(state.imageStatus.every(image => image.complete && image.naturalWidth > 0 && image.alt), `article illustration failed to load or lacks alt text on ${article.file}`).toBe(true);
        expect(state.promptStyles.every(style => style.background !== 'rgba(0, 0, 0, 0)' && style.color !== 'rgba(0, 0, 0, 0)'), `prompt styling missing on ${article.file}`).toBe(true);
        expect(state.codeOverflow.every(block => block.scrollWidth <= block.clientWidth || ['auto', 'scroll'].includes(block.overflowX)), `code overflow escapes its block on ${article.file}`).toBe(true);
        if (width > 960) {
          expect(state.tocPosition).toBe('sticky');
          expect(state.toc.left).toBeLessThan(state.article.left);
          if (article.checkTocScroll || article.baselineSha === '6ae5e726d79b6aea3c87845193b9e0caa0f3ed19') {
            expect(['auto', 'scroll']).toContain(state.tocScroll.overflowY);
            expect(state.tocScroll.scrollHeight).toBeGreaterThan(state.tocScroll.clientHeight);
          }
          expect(state.related.width).toBeGreaterThan(state.article.width);
        } else {
          expect(state.tocPosition).toBe('static');
          expect(Math.abs(state.toc.left - state.article.left)).toBeLessThanOrEqual(1);
        }

        if (width === 1440) {
          await page.screenshot({ path: `artifacts/${article.file}-desktop-1440-top.png` });
          await page.locator('.workflow-main').scrollIntoViewIfNeeded();
          await page.waitForTimeout(150);
          await page.screenshot({ path: `artifacts/${article.file}-desktop-1440-toc-scrolled.png` });
          const stickyTop = await toc.evaluate(el => el.getBoundingClientRect().top);
          expect(stickyTop).toBeGreaterThanOrEqual(0);
          expect(stickyTop).toBeLessThan(280);
        }
        if (width === 390) {
          await expect(toc).toHaveJSProperty('open', true);
          await toc.scrollIntoViewIfNeeded();
          await page.waitForTimeout(100);
          await page.screenshot({ path: `artifacts/${article.file}-mobile-390-expanded.png` });
          await toc.locator('summary').click();
          await expect(toc).toHaveJSProperty('open', false);
          await toc.scrollIntoViewIfNeeded();
          await page.waitForTimeout(100);
          await page.screenshot({ path: `artifacts/${article.file}-mobile-390-collapsed.png` });
          await toc.locator('summary').click();
          await expect(toc).toHaveJSProperty('open', true);
        }
      }
      expect(problems, problems.join('\n')).toEqual([]);
    });

    test('H2 and selected H3 links navigate and highlight the current chapter', async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(`${baseURL}/${article.file}`);
      for (const fragment of [article.h2, article.h3].filter(Boolean)) {
        await page.locator(`.article-content-navigation a[href="${fragment}"]`).click();
        await expect(page).toHaveURL(new RegExp(`${fragment}$`));
        await expect(page.locator(fragment)).toBeInViewport();
        if (article.waitForStableViewportChapter) {
          await page.evaluate(() => new Promise(resolve => {
            let previousScrollY = null;
            let stableFrames = 0;
            const sample = () => {
              const scrollY = window.scrollY;
              stableFrames = scrollY === previousScrollY ? stableFrames + 1 : 0;
              previousScrollY = scrollY;
              if (stableFrames >= 3) resolve();
              else requestAnimationFrame(sample);
            };
            requestAnimationFrame(sample);
          }));
          const viewportChapter = await page.evaluate(() => {
            const links = [...document.querySelectorAll('.article-content-navigation a[href^="#"]')].map(link => ({
              href: link.getAttribute('href'),
              heading: document.getElementById(decodeURIComponent(link.hash.slice(1)))
            })).filter(item => item.heading);
            const marker = Math.min(window.innerHeight * 0.34, 240);
            const passed = links.filter(item => item.heading.getBoundingClientRect().top <= marker);
            return (passed[passed.length - 1] || links[0])?.href || null;
          });
          expect(viewportChapter, 'the viewport must resolve to a contents chapter').toBeTruthy();
          await expect(page.locator('.article-content-navigation a[aria-current="location"]'))
            .toHaveAttribute('href', viewportChapter);
        } else if (article.activeHeadingFollowsViewport) {
          const viewportChapter = () => page.evaluate(() => {
            const links = [...document.querySelectorAll('.article-content-navigation a[href^="#"]')].map(link => ({
              href: link.getAttribute('href'),
              heading: document.getElementById(decodeURIComponent(link.hash.slice(1)))
            })).filter(item => item.heading);
            const marker = Math.min(window.innerHeight * 0.34, 240);
            const passed = links.filter(item => item.heading.getBoundingClientRect().top <= marker);
            return (passed[passed.length - 1] || links[0])?.href || null;
          });
          await expect.poll(async () => page.evaluate(() => {
            const links = [...document.querySelectorAll('.article-content-navigation a[href^="#"]')].map(link => ({
              href: link.getAttribute('href'),
              heading: document.getElementById(decodeURIComponent(link.hash.slice(1)))
            })).filter(item => item.heading);
            const marker = Math.min(window.innerHeight * 0.34, 240);
            const passed = links.filter(item => item.heading.getBoundingClientRect().top <= marker);
            const expected = (passed[passed.length - 1] || links[0])?.href || null;
            const active = document.querySelector('.article-content-navigation a[aria-current="location"]')?.getAttribute('href') || null;
            return expected !== null && active === expected;
          })).toBe(true);
        } else {
          await expect.poll(async () => page.evaluate(() => {
            const links = [...document.querySelectorAll('.article-content-navigation a[href^="#"]')].map(link => ({
              href: link.getAttribute('href'),
              heading: document.getElementById(decodeURIComponent(link.hash.slice(1)))
            })).filter(item => item.heading);
            const marker = Math.min(window.innerHeight * 0.34, 240);
            const passed = links.filter(item => item.heading.getBoundingClientRect().top <= marker);
            const expected = (passed[passed.length - 1] || links[0])?.href || null;
            const active = document.querySelector('.article-content-navigation a[aria-current="location"]')?.getAttribute('href') || null;
            return expected !== null && active === expected;
          })).toBe(true);
        }
      }
    });

    test('Tab, Enter, Space, and Escape work for mobile controls', async ({ page }) => {
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${baseURL}/${article.file}`);
      await page.keyboard.press('Tab');
      await expect(page.locator('.brand')).toBeFocused();
      await page.keyboard.press('Tab');
      const toggle = page.locator('.menu-toggle');
      await expect(toggle).toBeFocused();
      const toc = page.locator('.article-content-navigation');
      const summary = toc.locator('summary');
      await summary.focus();
      await page.keyboard.press('Space');
      await expect(toc).toHaveJSProperty('open', false);
      await page.keyboard.press('Enter');
      await expect(toc).toHaveJSProperty('open', true);
      await toggle.click();
      await expect(toggle).toHaveAttribute('aria-expanded', 'true');
      await toggle.focus();
      await page.keyboard.press('Escape');
      await expect(toggle).toHaveAttribute('aria-expanded', 'false');
      await expect(toggle).toBeFocused();
    });

    test('contents anchors work with JavaScript disabled', async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
      const page = await context.newPage();
      await page.goto(`${baseURL}/${article.file}`);
      const link = page.locator(`.article-content-navigation a[href="${article.h2}"]`);
      await link.click();
      await expect(page).toHaveURL(new RegExp(`${article.h2}$`));
      await expect(page.locator(article.h2)).toBeInViewport();
      await expect(page.locator('.article-content-navigation')).toHaveJSProperty('open', true);
      await context.close();
    });

    if (article.legacyChapterAnchors) {
      test('legacy public chapter anchors remain and only one contents navigation controls the article', async ({ browser }) => {
        const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, javaScriptEnabled: false });
        for (const [id, headingText] of article.legacyChapterAnchors) {
          const page = await context.newPage();
          await page.goto(baseURL + '/' + article.file + '#' + id);
          await expect(page).toHaveURL(new RegExp('#' + id + '$'));
          await expect(page.locator('.article-toc')).toHaveCount(0);
          await expect(page.locator('.article-content-navigation')).toHaveCount(1);
          const heading = page.locator('#' + id);
          await expect(heading).toHaveJSProperty('tagName', 'H2');
          await expect(heading).toHaveText(headingText);
          await expect(heading).toBeInViewport();
          await page.close();
        }
        await context.close();
      });
    }

    test('article text, headings, IDs, media, links, controls, date, and SEO match the pre-migration baseline', async ({ page }) => {
      const baselineSha = article.baselineSha || process.env.BASELINE_SHA;
      expect(baselineSha, 'baseline SHA must be provided by the workflow').toBeTruthy();
      const { execFileSync } = require('node:child_process');
      const baselineHTML = execFileSync('git', ['show', `${baselineSha}:${article.file}`], { encoding: 'utf8' });
      const currentHTML = require('node:fs').readFileSync(article.file, 'utf8');
      const [before, after] = await page.evaluate(([oldHTML, newHTML]) => {
        const fingerprint = html => {
          const doc = new DOMParser().parseFromString(html, 'text/html');
          const content = doc.querySelector('.article-content');
          const intro = doc.querySelector('.workflow-article-intro');
          const normalize = el => el?.textContent.replace(/\s+/g, ' ').trim() || '';
          return {
            title: doc.title,
            h1: normalize(doc.querySelector('.workflow-hero h1')),
            intro: normalize(intro),
            date: normalize(doc.querySelector('.workflow-eyebrow')),
            articleText: normalize(content),
            headings: [...content.querySelectorAll('h2,h3')].map(el => [el.tagName, normalize(el)]),
            ids: [...doc.querySelectorAll('[id]')].map(el => el.id),
            publicAnchorIds: [...new Set([
              ...doc.querySelectorAll('.article-content [id], .workflow-related [id]'),
              ...[...doc.querySelectorAll('a[href^="#"]')]
                .map(link => doc.getElementById(decodeURIComponent(link.getAttribute('href').slice(1))))
                .filter(Boolean)
            ].map(el => el.id))],
            images: [...content.querySelectorAll('img')].map(el => [el.getAttribute('src'), el.getAttribute('alt'), el.getAttribute('width'), el.getAttribute('height')]),
            links: [...content.querySelectorAll('a'), ...doc.querySelectorAll('.workflow-related a')].map(el => [el.getAttribute('href'), normalize(el)]),
            metadata: [...doc.querySelectorAll('meta[name="description"],meta[property^="og:"]')].map(el => [el.getAttribute('name') || el.getAttribute('property'), el.getAttribute('content')]),
            canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href'),
            allCode: [...doc.querySelectorAll('code')].map(el => el.innerHTML),
            preservedStructures: [...content.querySelectorAll('table,pre,code,details,button,form,.article-prompt,.article-table')].map(el => [el.tagName, el.className, el.outerHTML])
          };
        };
        return [fingerprint(oldHTML), fingerprint(newHTML)];
      }, [baselineHTML, currentHTML]);

      expect(after.title).toBe(before.title);
      expect(after.h1).toBe(before.h1);
      expect(after.intro).toBe(before.intro);
      expect(after.date).toBe(before.date);
      expect(after.articleText).toBe(before.articleText);
      expect(after.headings).toEqual(before.headings);
      expect(after.images).toEqual(before.images);
      expect(after.links).toEqual(before.links);
      expect(after.metadata).toEqual(before.metadata);
      expect(after.canonical).toBe(before.canonical);
      expect(after.preservedStructures).toEqual(before.preservedStructures);
      expect(after.allCode, 'all code element contents must match the exact pre-migration HTML').toEqual(before.allCode);
      for (const id of before.publicAnchorIds) expect(after.ids, `lost public article anchor: ${id}`).toContain(id);
      const lostIds = before.ids.filter(id => !after.ids.includes(id));
      expect(lostIds.sort(), 'only explicitly documented internal IDs from the removed TOC label may disappear')
        .toEqual([...(article.legacyInternalIds || [])].sort());
    });
  });
}



test('wave 10 light hero computed styles and required desktop/mobile screenshot evidence', async ({ page }) => {
  const fs = require('node:fs');
  const records = [];
  const contactCards = [];
  const contrast = (foreground, background) => {
    const rgb = value => {
      const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (!match) return null;
      return match.slice(1, 4).map(channel => {
        const component = Number(channel) / 255;
        return component <= 0.04045 ? component / 12.92 : ((component + 0.055) / 1.055) ** 2.4;
      }).reduce((sum, component, index) => sum + component * [0.2126, 0.7152, 0.0722][index], 0);
    };
    const a = rgb(foreground), b = rgb(background);
    if (a === null || b === null) return 0;
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };

  for (const article of wave10Articles) {
    for (const viewport of [{name:'desktop-1440',width:1440,height:1000},{name:'mobile-390',width:390,height:844}]) {
      await page.setViewportSize({width:viewport.width,height:viewport.height});
      await page.goto(baseURL + '/' + article.file,{waitUntil:'networkidle'});
      await page.evaluate(() => document.fonts.ready);
      const style = await page.evaluate(() => {
        const selectors = ['body','.workflow-shell','.workflow-topbar','.workflow-hero','.workflow-eyebrow','.workflow-hero h1','.workflow-hero h1 span','.workflow-hero-lead','.workflow-meta span','.workflow-news-panel','.workflow-news-panel-label','.workflow-news-panel h2','.workflow-news-panel p','.workflow-news-panel-meta span','.workflow-route','.workflow-stage','.workflow-stage-number','.workflow-stage strong','.workflow-stage small'];
        return selectors.map(selector => {
          const element = document.querySelector(selector);
          if (!element) return null;
          const css = getComputedStyle(element), before = getComputedStyle(element,'::before'), after = getComputedStyle(element,'::after');
          const read = item => ({display:item.display,content:item.content,backgroundColor:item.backgroundColor,backgroundImage:item.backgroundImage,color:item.color,opacity:item.opacity,filter:item.filter,backdropFilter:item.backdropFilter});
          return {selector,backgroundColor:css.backgroundColor,backgroundImage:css.backgroundImage,color:css.color,opacity:css.opacity,filter:css.filter,backdropFilter:css.backdropFilter,before:read(before),after:read(after)};
        }).filter(Boolean);
      });
      records.push({file:article.file,...viewport,styles:style});
      const value = selector => style.find(item=>item.selector===selector);
      expect(value('.workflow-shell').backgroundImage).toContain('linear-gradient');
      expect(value('.workflow-shell').backgroundImage).not.toMatch(/#0a0f1e|#0d1b40|10, 15, 30|13, 27, 64/i);
      expect(value('.workflow-shell').after.display).toBe('none');
      expect(value('.workflow-hero h1').color).toBe('rgb(16, 45, 43)');
      expect(value('.workflow-hero h1 span').color).toBe('rgb(7, 88, 79)');
      expect(value('.workflow-hero-lead').color).toBe('rgb(52, 75, 69)');
      expect(contrast(value('.workflow-hero h1').color,'rgb(255, 254, 250)')).toBeGreaterThan(7);
      expect(contrast(value('.workflow-hero-lead').color,'rgb(255, 254, 250)')).toBeGreaterThan(4.5);
      const panel=value('.workflow-news-panel');
      if(panel){
        expect(panel.backgroundImage).toContain('linear-gradient');
        expect(panel.backgroundImage).not.toMatch(/#0a0f1e|#0d1b40|10, 15, 30|13, 27, 64/i);
        expect(value('.workflow-news-panel h2').color).toBe('rgb(16, 45, 43)');
        expect(value('.workflow-news-panel p').color).toBe('rgb(82, 103, 95)');
        expect(contrast(value('.workflow-news-panel p').color,'rgb(255, 255, 255)')).toBeGreaterThan(4.5);
      }
      for(const surface of style.filter(item=>item.selector==='.workflow-stage')){
        expect(surface.backgroundColor).not.toMatch(/10, 15, 30|13, 21, 48|13, 27, 64/);
        expect(surface.backdropFilter).toBe('none');
      }
      const heroPath='artifacts/wave10-'+article.file+'-'+viewport.name+'-hero.png';
      await page.locator('.workflow-shell').screenshot({path:heroPath});
      if(viewport.width===1440){
        const image=await fs.promises.readFile(heroPath);
        contactCards.push({title:article.title,data:image.toString('base64')});
        const toc=page.locator('.article-content-navigation');
        await toc.scrollIntoViewIfNeeded();
        await toc.screenshot({path:'artifacts/wave10-'+article.file+'-desktop-1440-content-panel.png'});
        const inner=page.locator('.article-content-navigation nav');
        const scroll=await inner.evaluate(el=>({height:el.scrollHeight,client:el.clientHeight}));
        expect(scroll.height).toBeGreaterThan(scroll.client);
        await inner.evaluate(el=>{el.scrollTop=Math.max(0,Math.floor((el.scrollHeight-el.clientHeight)/2));});
        await toc.screenshot({path:'artifacts/wave10-'+article.file+'-desktop-1440-content-panel-inner-scroll.png'});
        await page.locator(article.representative).scrollIntoViewIfNeeded();
        await page.screenshot({path:'artifacts/wave10-'+article.file+'-desktop-1440-method-section.png',fullPage:false});
      } else {
        const toc=page.locator('.article-content-navigation');
        await expect(toc).toHaveJSProperty('open',true);
        await toc.screenshot({path:'artifacts/wave10-'+article.file+'-mobile-390-expanded-content.png'});
        await page.locator(article.representative).scrollIntoViewIfNeeded();
        await page.screenshot({path:'artifacts/wave10-'+article.file+'-mobile-390-method-section.png',fullPage:false});
      }
    }
  }

  await page.setViewportSize({width:1440,height:1000});
  await page.goto(baseURL+'/ai-navod-edit-kontrola.html',{waitUntil:'networkidle'});
  const reference=await page.locator('.workflow-shell').screenshot();
  contactCards.push({title:'Schválený světlý pilot EDIT',data:reference.toString('base64')});
  const cards=contactCards.map(item=>'<article><h2>'+item.title+'</h2><img alt="'+item.title+'" src="data:image/png;base64,'+item.data+'"></article>').join('');
  await page.setContent('<!doctype html><html lang="cs"><meta charset="utf-8"><title>Vlna 10 – porovnání hero</title><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#fffefa;color:#102d2b;font:600 15px Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}article{min-width:0;padding:10px;border:1px solid #dfe8e1;border-radius:12px;background:#fff;overflow:hidden}h2{font-size:16px;min-height:40px;margin:4px 0 12px}img{display:block;width:100%;height:auto;border:1px solid #e5e7e1;border-radius:8px}</style><h1>Vlna 10 – hero a schválený světlý pilot</h1><main class="grid">'+cards+'</main></html>');
  await page.screenshot({path:'artifacts/wave10-hero-contact-sheet.png',fullPage:true});
  fs.writeFileSync('artifacts/wave10-computed-styles.json',JSON.stringify(records,null,2));
});

test('wave 11 original prompt blocks remain selectable and copy as selected through the browser', async ({ browser }) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    permissions: ['clipboard-read', 'clipboard-write']
  });
  for (const article of wave11Articles) {
    const page = await context.newPage();
    await page.goto(baseURL + '/' + article.file, { waitUntil: 'networkidle' });
    const prompts = page.locator('.article-content .article-prompt');
    await expect(prompts).toHaveCount(article.promptCount);
    await expect(page.locator('.article-content button')).toHaveCount(0);
    for (let index = 0; index < article.promptCount; index++) {
      const prompt = prompts.nth(index);
      const selectedText = await prompt.evaluate(element => {
        const range = document.createRange();
        range.selectNodeContents(element);
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        return { text: selection.toString(), userSelect: getComputedStyle(element).userSelect };
      });
      expect(selectedText.text.trim(), article.file + ' prompt ' + index + ' should have selectable text').not.toBe('');
      expect(selectedText.userSelect, article.file + ' prompt ' + index + ' must permit selection').not.toBe('none');
      await page.keyboard.press('Control+C');
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText()))
        .toBe(selectedText.text);
    }
    await page.close();
  }
  await context.close();
});

test('wave 11 light hero computed styles, prompt screenshots, and contact sheet evidence', async ({ page }) => {
  const fs = require('node:fs');
  const records = [];
  const contactCards = [];
  const contrast = (foreground, background) => {
    const rgb = value => {
      const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (!match) return null;
      return match.slice(1, 4).map(channel => {
        const component = Number(channel) / 255;
        return component <= 0.04045 ? component / 12.92 : ((component + 0.055) / 1.055) ** 2.4;
      }).reduce((sum, component, index) => sum + component * [0.2126, 0.7152, 0.0722][index], 0);
    };
    const a = rgb(foreground), b = rgb(background);
    if (a === null || b === null) return 0;
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };
  for (const article of wave11Articles) {
    for (const viewport of [{ name: 'desktop-1440', width: 1440, height: 1000 }, { name: 'mobile-390', width: 390, height: 844 }]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(baseURL + '/' + article.file, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const image = await page.locator('.workflow-article img').evaluate(element => {
        const rect = element.getBoundingClientRect();
        return { complete: element.complete, naturalWidth: element.naturalWidth, naturalHeight: element.naturalHeight, width: rect.width, height: rect.height, alt: element.alt };
      });
      expect(image.complete && image.naturalWidth > 0 && image.naturalHeight > 0 && image.alt.trim().length > 0).toBe(true);
      const renderedRatio = image.width / image.height;
      const sourceRatio = image.naturalWidth / image.naturalHeight;
      expect(Math.abs(renderedRatio - sourceRatio) / sourceRatio, article.file + ' image aspect ratio').toBeLessThan(0.02);
      const styles = await page.evaluate(() => {
        const selectors = [
          'body', '.site-header', '.site-breadcrumbs', '.workflow-shell', '.workflow-hero',
          '.workflow-eyebrow', '.workflow-hero h1', '.workflow-hero h1 span', '.workflow-hero-lead',
          '.workflow-meta span', '.workflow-news-panel', '.workflow-news-panel-label',
          '.workflow-news-panel h2', '.workflow-news-panel p', '.workflow-news-panel-meta span', '.article-content .article-prompt', '.article-content .article-prompt strong',
          '.workflow-route', '.workflow-stage', '.workflow-stage-number', '.workflow-stage strong', '.workflow-stage small',
          '.workflow-shell::before', '.workflow-shell::after', '.workflow-route::before', '.workflow-stage::before'
        ];
        const read = item => ({
          display: item.display, content: item.content, backgroundColor: item.backgroundColor,
          backgroundImage: item.backgroundImage, color: item.color, opacity: item.opacity,
          filter: item.filter, backdropFilter: item.backdropFilter, borderColor: item.borderColor
        });
        return selectors.map(selector => {
          const pseudo = selector.includes('::') ? selector.slice(selector.indexOf('::')) : null;
          const target = pseudo ? selector.slice(0, selector.indexOf('::')) : selector;
          const element = document.querySelector(target);
          if (!element) return null;
          const css = getComputedStyle(element, pseudo);
          return { selector, ...read(css) };
        }).filter(Boolean);
      });
      records.push({ file: article.file, ...viewport, styles, articleImage: image });
      const value = selector => styles.find(item => item.selector === selector);
      const dark = /#0a0f1e|#0d1b40|#0a1628|10, 15, 30|13, 27, 64|10,15,30/i;
      expect(value('body').backgroundColor).toBe('rgb(255, 254, 250)');
      expect(value('.workflow-shell').backgroundImage).toContain('linear-gradient');
      expect(value('.workflow-shell').backgroundImage).not.toMatch(dark);
      expect(value('.workflow-shell::after').display).toBe('none');
      expect(value('.workflow-shell::before').backgroundImage).not.toMatch(dark);
      for (const pseudo of ['.workflow-shell::before', '.workflow-shell::after', '.workflow-route::before', '.workflow-stage::before']) {
        const overlay = value(pseudo);
        if (!overlay) continue;
        expect(overlay.backgroundColor, pseudo + ' background color').not.toMatch(dark);
        expect(overlay.backgroundImage, pseudo + ' background image').not.toMatch(dark);
        expect(overlay.backdropFilter, pseudo + ' backdrop').toBe('none');
      }
      expect(value('.workflow-hero h1').color).toBe('rgb(16, 45, 43)');
      expect(value('.workflow-hero h1 span').color).toBe('rgb(7, 88, 79)');
      expect(value('.workflow-hero-lead').color).toBe('rgb(52, 75, 69)');
      expect(value('.article-content .article-prompt').backgroundColor).toBe('rgb(238, 245, 239)');
      expect(value('.article-content .article-prompt').color).toBe('rgb(41, 75, 65)');
      expect(contrast(value('.article-content .article-prompt').color, value('.article-content .article-prompt').backgroundColor)).toBeGreaterThan(4.5);
      expect(contrast(value('.workflow-hero h1').color, 'rgb(255, 254, 250)')).toBeGreaterThan(7);
      expect(contrast(value('.workflow-hero-lead').color, 'rgb(255, 254, 250)')).toBeGreaterThan(4.5);
      for (const selector of ['.workflow-news-panel', '.workflow-stage', '.workflow-meta span', '.workflow-stage-number']) {
        const surface = value(selector);
        if (surface) {
          expect(surface.backgroundColor, selector + ' background').not.toMatch(dark);
          expect(surface.backgroundImage, selector + ' gradient').not.toMatch(dark);
          expect(surface.backdropFilter, selector + ' overlay').toBe('none');
        }
      }
      if (value('.workflow-news-panel')) {
        expect(value('.workflow-news-panel').backgroundImage).toContain('linear-gradient');
        expect(value('.workflow-news-panel').backgroundImage).not.toMatch(dark);
        expect(value('.workflow-news-panel h2').color).toBe('rgb(16, 45, 43)');
        expect(value('.workflow-news-panel p').color).toBe('rgb(82, 103, 95)');
        expect(contrast(value('.workflow-news-panel p').color, 'rgb(255, 255, 255)')).toBeGreaterThan(4.5);
      }
      for (const selector of ['.workflow-stage strong', '.workflow-stage small', '.workflow-news-panel-label', '.workflow-news-panel-meta span']) {
        const textStyle = value(selector);
        if (textStyle) expect(textStyle.color, selector + ' must stay legible and light-design colored').not.toMatch(dark);
      }
      const heroPath = 'artifacts/wave11-' + article.file + '-' + viewport.name + '-hero.png';
      await page.locator('.workflow-shell').screenshot({ path: heroPath });
      if (viewport.width === 1440) {
        contactCards.push({ title: article.title, data: (await fs.promises.readFile(heroPath)).toString('base64') });
        const toc = page.locator('.article-content-navigation');
        await toc.scrollIntoViewIfNeeded();
        await page.screenshot({ path: 'artifacts/wave11-' + article.file + '-desktop-1440-sticky-toc.png' });
        const inner = toc.locator('nav');
        const scroll = await inner.evaluate(element => ({ height: element.scrollHeight, client: element.clientHeight }));
        if (scroll.height > scroll.client) {
          await inner.evaluate(element => { element.scrollTop = Math.floor((element.scrollHeight - element.clientHeight) / 2); });
          await expect.poll(() => inner.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
          await toc.screenshot({ path: 'artifacts/wave11-' + article.file + '-desktop-1440-toc-inner-scroll.png' });
        } else {
          expect(scroll.height, article.file + ' TOC fits without internal overflow').toBeLessThanOrEqual(scroll.client);
        }
        const representative = page.locator('.article-content .article-prompt').nth(article.representativePromptIndex);
        await representative.scrollIntoViewIfNeeded();
        await representative.screenshot({ path: 'artifacts/wave11-' + article.file + '-desktop-1440-prompt.png' });
      } else {
        const toc = page.locator('.article-content-navigation');
        await expect(toc).toHaveJSProperty('open', true);
        await toc.screenshot({ path: 'artifacts/wave11-' + article.file + '-mobile-390-expanded-toc.png' });
        const representative = page.locator('.article-content .article-prompt').nth(article.representativePromptIndex);
        await representative.scrollIntoViewIfNeeded();
        await representative.screenshot({ path: 'artifacts/wave11-' + article.file + '-mobile-390-prompt.png' });
      }
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(baseURL + '/ai-navod-edit-kontrola.html', { waitUntil: 'networkidle' });
  const reference = await page.locator('.workflow-shell').screenshot();
  contactCards.push({ title: 'Schválený světlý pilot EDIT', data: reference.toString('base64') });
  const cards = contactCards.map(item => '<article><h2>' + item.title + '</h2><img alt="' + item.title + '" src="data:image/png;base64,' + item.data + '"></article>').join('');
  await page.setContent('<!doctype html><html lang="cs"><meta charset="utf-8"><title>Vlna 11 – porovnání hero</title><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#fffefa;color:#102d2b;font:600 15px Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}article{min-width:0;padding:10px;border:1px solid #dfe8e1;border-radius:12px;background:#fff;overflow:hidden}h2{font-size:16px;min-height:40px;margin:4px 0 12px}img{display:block;width:100%;height:auto;border:1px solid #e5e7e1;border-radius:8px}</style><h1>Vlna 11 – hero a schválený světlý pilot</h1><main class="grid">' + cards + '</main></html>');
  await page.screenshot({ path: 'artifacts/wave11-hero-contact-sheet.png', fullPage: true });
  fs.writeFileSync('artifacts/wave11-computed-styles.json', JSON.stringify(records, null, 2));
});

test('wave 1 desktop overview compares its four articles side by side', async ({ page }) => {
  const cards = [];
  for (const article of wave1Articles) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/${article.file}`);
    await page.evaluate(() => document.fonts.ready);
    const image = await page.screenshot();
    cards.push(`<article><h2>${article.title}</h2><img alt="${article.title}" src="data:image/png;base64,${image.toString('base64')}"></article>`);
  }
  await page.setViewportSize({ width: 1800, height: 1100 });
  await page.setContent(`<!doctype html><html lang="cs"><meta charset="utf-8"><title>AI agenti – přehled migrační vlny 1</title><style>body{margin:0;padding:24px;background:#fffefa;color:#102d2b;font:600 15px Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}article{min-width:0;border:1px solid #dfe8e1;border-radius:12px;padding:10px;background:#fff;overflow:hidden}h2{font-size:16px;min-height:40px;margin:4px 0 12px}img{display:block;width:100%;height:auto;border:1px solid #eee}</style><main class="grid">${cards.join('')}</main>`);
  await page.screenshot({ path: 'artifacts/wave1-overview-desktop-four-articles.png', fullPage: true });
});


test('wave 2 desktop overview compares its four articles side by side', async ({ page }) => {
  const cards = [];
  for (const article of wave2Articles) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/${article.file}`);
    await page.evaluate(() => document.fonts.ready);
    const image = await page.screenshot();
    cards.push(`<article><h2>${article.title}</h2><img alt="${article.title}" src="data:image/png;base64,${image.toString('base64')}"></article>`);
  }
  await page.setViewportSize({ width: 1800, height: 1100 });
  await page.setContent(`<!doctype html><html lang="cs"><meta charset="utf-8"><title>AI agenti – přehled migrační vlny 2</title><style>body{margin:0;padding:24px;background:#fffefa;color:#102d2b;font:600 15px Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}article{min-width:0;border:1px solid #dfe8e1;border-radius:12px;padding:10px;background:#fff;overflow:hidden}h2{font-size:16px;min-height:40px;margin:4px 0 12px}img{display:block;width:100%;height:auto;border:1px solid #eee}</style><main class="grid">${cards.join('')}</main>`);
  await page.screenshot({ path: 'artifacts/wave2-overview-desktop-four-articles.png', fullPage: true });
});


test('wave 3 desktop overview compares its four articles side by side', async ({ page }) => {
  const cards = [];
  for (const article of wave3Articles) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/${article.file}`);
    await page.evaluate(() => document.fonts.ready);
    const image = await page.screenshot();
    cards.push(`<article><h2>${article.title}</h2><img alt="${article.title}" src="data:image/png;base64,${image.toString('base64')}"></article>`);
  }
  await page.setViewportSize({ width: 1800, height: 1100 });
  await page.setContent(`<!doctype html><html lang="cs"><meta charset="utf-8"><title>AI agenti – přehled migrační vlny 3</title><style>body{margin:0;padding:24px;background:#fffefa;color:#102d2b;font:600 15px Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}article{min-width:0;border:1px solid #dfe8e1;border-radius:12px;padding:10px;background:#fff;overflow:hidden}h2{font-size:16px;min-height:40px;margin:4px 0 12px}img{display:block;width:100%;height:auto;border:1px solid #eee}</style><main class="grid">${cards.join('')}</main>`);
  await page.screenshot({ path: 'artifacts/wave3-overview-desktop-four-articles.png', fullPage: true });
});

test('wave 4 desktop overview compares all three articles side by side', async ({ page }) => {
  const cards = [];
  for (const article of wave4Articles) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/${article.file}`);
    await page.evaluate(() => document.fonts.ready);
    const image = await page.screenshot();
    cards.push(`<article><h2>${article.title}</h2><img alt="${article.title}" src="data:image/png;base64,${image.toString('base64')}"></article>`);
  }
  await page.setViewportSize({ width: 1600, height: 1100 });
  await page.setContent(`<!doctype html><html lang="cs"><meta charset="utf-8"><title>AI agenti – přehled migrační vlny 4</title><style>body{margin:0;padding:24px;background:#fffefa;color:#102d2b;font:600 15px Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}article{min-width:0;border:1px solid #dfe8e1;border-radius:12px;padding:10px;background:#fff;overflow:hidden}h2{font-size:16px;min-height:40px;margin:4px 0 12px}img{display:block;width:100%;height:auto;border:1px solid #eee}</style><main class="grid">${cards.join('')}</main>`);
  await page.screenshot({ path: 'artifacts/wave4-overview-desktop-three-articles.png', fullPage: true });
});




test('wave 5 hero sections use the light palette and capture article and reference screenshots', async ({ page }) => {
  const fs = require('node:fs');
  const audit = [];
  const viewports = [
    { name: 'desktop-1440', width: 1440, height: 900 },
    { name: 'mobile-390', width: 390, height: 844 }
  ];
  const references = [
    { file: 'ai-agenti-co-je-ai-agent.html', title: 'Schválený světlý pilot', selector: '.workflow-shell', prefix: 'approved-pilot' },
    { file: 'index.html', title: 'Homepage', selector: '.hero', prefix: 'homepage' }
  ];

  for (const viewport of viewports) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    const cards = [];

    for (const article of wave5Articles) {
      await page.goto(baseURL + '/' + article.file);
      await page.evaluate(() => document.fonts.ready);
      const hero = page.locator('.workflow-shell');
      await expect(hero).toBeVisible();
      const diagnostic = await hero.evaluate(root => {
        const panel = root.querySelector('.workflow-news-panel');
        const route = root.querySelector('.workflow-route');
        const details = element => {
          if (!element) return null;
          const style = getComputedStyle(element);
          const before = getComputedStyle(element, '::before');
          const after = getComputedStyle(element, '::after');
          return {
            backgroundColor: style.backgroundColor,
            backgroundImage: style.backgroundImage,
            color: style.color,
            borderColor: style.borderColor,
            borderRadius: style.borderRadius,
            boxShadow: style.boxShadow,
            filter: style.filter,
            backdropFilter: style.backdropFilter,
            before: { content: before.content, display: before.display, backgroundColor: before.backgroundColor, backgroundImage: before.backgroundImage, opacity: before.opacity },
            after: { content: after.content, display: after.display, backgroundColor: after.backgroundColor, backgroundImage: after.backgroundImage, opacity: after.opacity }
          };
        };
        return {
          shell: details(root),
          hero: details(root.querySelector('.workflow-hero')),
          panel: panel ? {
            surface: details(panel),
            label: details(panel.querySelector('.workflow-news-panel-label')),
            heading: details(panel.querySelector('h2')),
            lead: details(panel.querySelector('p')),
            meta: details(panel.querySelector('.workflow-news-panel-meta span'))
          } : null,
          route: route ? {
            surface: details(route),
            stages: [...route.querySelectorAll('.workflow-stage')].map(stage => ({
              surface: details(stage),
              number: details(stage.querySelector('.workflow-stage-number')),
              title: details(stage.querySelector('strong')),
              description: details(stage.querySelector('small'))
            }))
          } : null,
          heroImages: [...root.querySelectorAll('img')].map(img => ({ src: img.getAttribute('src'), alt: img.alt, loaded: img.complete && img.naturalWidth > 0 }))
        };
      });
      expect(diagnostic.shell.backgroundImage).toContain('linear-gradient(');
      expect(diagnostic.shell.backgroundImage).toContain('rgb(255, 254, 250)');
      expect(diagnostic.shell.backgroundImage).not.toContain('10, 15, 30');
      expect(diagnostic.shell.after.display).toBe('none');
      if (diagnostic.panel) {
        expect(diagnostic.panel.surface.backgroundImage).toContain('rgb(255, 255, 255)');
        expect(diagnostic.panel.surface.backgroundImage).toContain('rgb(242, 246, 241)');
        expect(diagnostic.panel.surface.backgroundImage).not.toContain('10, 15, 30');
        expect(diagnostic.panel.heading.color).toBe('rgb(16, 45, 43)');
        expect(diagnostic.panel.lead.color).toBe('rgb(82, 103, 95)');
        expect(diagnostic.panel.label.backgroundColor).toBe('rgb(230, 241, 237)');
        expect(diagnostic.panel.meta.backgroundColor).toBe('rgb(242, 246, 241)');
      } else {
        expect(diagnostic.route, 'hero must have a panel or workflow route on ' + article.file).toBeTruthy();
        expect(diagnostic.route.stages.length).toBeGreaterThan(0);
        expect(diagnostic.route.stages.every(stage => stage.surface.backgroundColor.includes('255, 255, 255'))).toBe(true);
        expect(diagnostic.route.stages.every(stage => stage.surface.backgroundImage === 'none')).toBe(true);
      }
      expect(diagnostic.heroImages.every(image => image.loaded), 'all hero images should load').toBe(true);
      audit.push({ article: article.file, viewport: viewport.name, ...diagnostic });

      const fullHero = await hero.screenshot({ path: 'artifacts/wave5-hero-' + article.file.replace('.html', '') + '-' + viewport.name + '-full.png' });
      await page.screenshot({ path: 'artifacts/wave5-hero-' + article.file.replace('.html', '') + '-' + viewport.name + '-page-top.png' });
      cards.push({ title: article.file, image: fullHero.toString('base64') });
    }

    for (const reference of references) {
      await page.goto(baseURL + '/' + reference.file);
      await page.evaluate(() => document.fonts.ready);
      const region = page.locator(reference.selector);
      await expect(region).toBeVisible();
      const fullHero = await region.screenshot({ path: 'artifacts/wave5-hero-' + reference.prefix + '-' + viewport.name + '-full.png' });
      await page.screenshot({ path: 'artifacts/wave5-hero-' + reference.prefix + '-' + viewport.name + '-page-top.png' });
      cards.push({ title: reference.title, image: fullHero.toString('base64') });
    }

    const cardsHtml = cards.map(card =>
      '<article><h2>' + card.title + '</h2><img alt="' + card.title + '" src="data:image/png;base64,' + card.image + '"></article>'
    ).join('');
    await page.setViewportSize({ width: 2000, height: 1300 });
    await page.setContent('<!doctype html><html lang="cs"><meta charset="utf-8"><title>Porovnání hero — ' + viewport.name + '</title><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#fffefa;color:#102d2b;font:600 15px Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}article{min-width:0;padding:12px;border:1px solid #dfe8e1;border-radius:14px;background:#fff;overflow:hidden}h2{min-height:42px;margin:0 0 10px;font-size:15px}img{display:block;width:100%;height:auto;max-height:850px;object-fit:contain;object-position:top}</style><main class="grid">' + cardsHtml + '</main></html>');
    await page.screenshot({ path: 'artifacts/wave5-hero-comparison-' + viewport.name + '.png', fullPage: true });
  }
  fs.writeFileSync('artifacts/wave5-hero-computed-styles.json', JSON.stringify(audit, null, 2));
});

test('wave 5 graphic audit captures images and prompt panels at desktop and mobile', async ({ page }) => {
  const fs = require('node:fs');
  const path = require('node:path');
  const audit = [];
  const cards = [];

  for (const article of wave5Articles) {
    const stem = article.file.replace(/\.html$/, '');
    for (const viewport of [
      { name: 'desktop-1440', width: 1440, height: 900 },
      { name: 'mobile-390', width: 390, height: 844 }
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(`${baseURL}/${article.file}`);
      const image = page.locator('.article-figure img');
      await image.evaluate(img => img.decode());
      const visual = await page.evaluate(() => {
        const image = document.querySelector('.article-figure img');
        const figure = document.querySelector('.article-figure');
        const prompt = document.querySelector('.article-prompt');
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth;
        canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d', { willReadFrequently: true });
        context.drawImage(image, 0, 0);
        const pixels = context.getImageData(0, 0, canvas.width, canvas.height).data;
        let sampled = 0, dark = 0;
        for (let i = 0; i < pixels.length; i += 4 * 24) {
          const luminance = 0.2126 * pixels[i] + 0.7152 * pixels[i + 1] + 0.0722 * pixels[i + 2];
          if (luminance < 72) dark++;
          sampled++;
        }
        const promptStyle = getComputedStyle(prompt);
        return {
          image: image.getAttribute('src'),
          naturalWidth: image.naturalWidth,
          naturalHeight: image.naturalHeight,
          alt: image.getAttribute('alt'),
          loaded: image.complete && image.naturalWidth > 0,
          filter: getComputedStyle(image).filter,
          borderRadius: getComputedStyle(image).borderRadius,
          darkPixelRatio: dark / sampled,
          figureBackground: getComputedStyle(figure).backgroundColor,
          promptBackground: promptStyle.backgroundColor,
          promptColor: promptStyle.color,
          bodyBackground: getComputedStyle(document.body).backgroundColor,
          heroColor: getComputedStyle(document.querySelector('.workflow-hero h1')).color
        };
      });
      expect(visual.loaded, `graphic must load on ${article.file}`).toBe(true);
      expect(visual.alt, `graphic alt text must remain on ${article.file}`).toBeTruthy();
      expect(visual.filter, `article image must not be filtered on ${article.file}`).toBe('none');
      expect(visual.promptBackground, `prompt panel must use the light palette on ${article.file}`).toBe('rgb(238, 245, 239)');
      expect(visual.bodyBackground).toBe('rgb(255, 254, 250)');
      audit.push({ article: article.file, viewport: viewport.name, ...visual });

      if (viewport.width === 1440) {
        const imagePath = await image.getAttribute('src');
        const bytes = fs.readFileSync(path.join(process.cwd(), imagePath));
        cards.push({ article, dataUrl: `data:image/png;base64,${bytes.toString('base64')}` });
      }

      await page.screenshot({ path: `artifacts/${stem}-${viewport.name}-top.png` });
      await image.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `artifacts/${stem}-${viewport.name}-infographic.png` });
      await image.screenshot({ path: `artifacts/${stem}-${viewport.name}-infographic-full.png` });
      const prompt = page.locator('.article-prompt').first();
      await prompt.scrollIntoViewIfNeeded();
      await page.screenshot({ path: `artifacts/${stem}-${viewport.name}-prompt-panel.png` });
      await prompt.screenshot({ path: `artifacts/${stem}-${viewport.name}-prompt-panel-full.png` });
    }
  }

  fs.writeFileSync('artifacts/wave5-graphic-audit.json', JSON.stringify(audit, null, 2));
  await page.setViewportSize({ width: 1800, height: 1400 });
  const cardsHtml = cards.map(({ article, dataUrl }) =>
    `<article><h2>${article.title}</h2><img alt="${article.title}" src="${dataUrl}"></article>`
  ).join('');
  await page.setContent(`<!doctype html><html lang="cs"><meta charset="utf-8"><title>Infografiky Gemini Notebook – vizuální audit</title><style>
    *{box-sizing:border-box}body{margin:0;padding:24px;background:#fffefa;color:#102d2b;font:600 16px Arial,sans-serif}
    h1{margin:0 0 20px;font-size:24px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}
    article{min-width:0;padding:14px;border:1px solid #dfe8e1;border-radius:14px;background:#fff}
    h2{min-height:42px;margin:0 0 12px;font-size:18px;line-height:1.3}img{display:block;width:100%;height:auto;object-fit:contain;border:1px solid #e5e7e1;border-radius:8px}
  </style><h1>Vložené infografiky všech čtyř návodů</h1><main class="grid">${cardsHtml}</main></html>`);
  await page.screenshot({ path: 'artifacts/wave5-graphic-contact-sheet.png', fullPage: true });
});

test('wave 5 desktop overview compares all four Gemini Notebook guides side by side', async ({ page }) => {
  const cards = [];
  for (const article of wave5Articles) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${baseURL}/${article.file}`);
    await page.evaluate(() => document.fonts.ready);
    const image = await page.screenshot();
    cards.push(`<article><h2>${article.title}</h2><img alt="${article.title}" src="data:image/png;base64,${image.toString('base64')}"></article>`);
  }
  await page.setViewportSize({ width: 1800, height: 1100 });
  await page.setContent(`<!doctype html><html lang="cs"><meta charset="utf-8"><title>Praktické návody – migrační vlna 5</title><style>body{margin:0;padding:24px;background:#fffefa;color:#102d2b;font:600 15px Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}article{min-width:0;border:1px solid #dfe8e1;border-radius:12px;padding:10px;background:#fff;overflow:hidden}h2{font-size:16px;min-height:40px;margin:4px 0 12px}img{display:block;width:100%;height:auto;border:1px solid #eee}</style><main class="grid">${cards.join('')}</main>`);
  await page.screenshot({ path: 'artifacts/wave5-overview-desktop-four-guides.png', fullPage: true });
});

test('original light pilot visual before and after comparison', async ({ page }) => {
  const article = wave4Articles.find(item => item.file === 'ai-agenti-co-je-ai-agent.html');
  const { execFileSync } = require('node:child_process');
  const baselineHTML = execFileSync('git', ['show', `${article.baselineSha}:${article.file}`], { encoding: 'utf8' });
  await page.setViewportSize({ width: 1440, height: 900 });
  const baselineURL = `${baseURL}/${article.file}`;
  await page.route(baselineURL, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: baselineHTML }));
  await page.goto(baselineURL, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const beforeGeometry = await page.locator('.workflow-hero').evaluate(el => {
    const box = el.getBoundingClientRect(), title = el.querySelector('h1'), style = getComputedStyle(title);
    return { width: box.width, height: box.height, titleFont: style.fontFamily, titleSize: style.fontSize, titleColor: style.color, text: title.innerText };
  });
  const before = await page.screenshot({ path: 'artifacts/ai-agenti-co-je-ai-agent-pilot-before.png' });
  await page.unroute(baselineURL);
  await page.goto(`${baseURL}/${article.file}`);
  await page.evaluate(() => document.fonts.ready);
  const afterGeometry = await page.locator('.workflow-hero').evaluate(el => {
    const box = el.getBoundingClientRect(), title = el.querySelector('h1'), style = getComputedStyle(title);
    return { width: box.width, height: box.height, titleFont: style.fontFamily, titleSize: style.fontSize, titleColor: style.color, text: title.innerText };
  });
  const after = await page.screenshot({ path: 'artifacts/ai-agenti-co-je-ai-agent-pilot-after.png' });
  expect(afterGeometry).toEqual(beforeGeometry);
  const cards = [before, after].map((image, index) => `<article><h2>${index ? 'Po doplnění TOC' : 'Před migrací'}</h2><img alt="${index ? 'Pilot po migraci' : 'Pilot před migrací'}" src="data:image/png;base64,${image.toString('base64')}"></article>`).join('');
  await page.setContent(`<!doctype html><html lang="cs"><meta charset="utf-8"><title>Pilot – před a po</title><style>body{margin:0;padding:24px;background:#fffefa;color:#102d2b;font:600 15px Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}article{min-width:0;border:1px solid #dfe8e1;border-radius:12px;padding:10px;background:#fff;overflow:hidden}h2{font-size:16px}img{display:block;width:100%;height:auto;border:1px solid #eee}</style><main class="grid">${cards}</main>`);
  await page.screenshot({ path: 'artifacts/ai-agenti-co-je-ai-agent-pilot-before-after.png', fullPage: true });
});

test('wave 8 existing copy controls write the exact prompt text to the clipboard', async ({ browser }) => {
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  for (const article of wave8InteractiveArticles) {
    await page.goto(`${baseURL}/${article.file}`);
    const buttons = page.locator('.article-content [data-copy-prompt]');
    await expect(buttons).toHaveCount(article.buttons);
    for (let index = 0; index < article.buttons; index++) {
      const button = buttons.nth(index);
      await button.evaluate(el => { const details = el.closest('details'); if (details) details.open = true; });
      const targetId = await button.getAttribute('data-copy-prompt');
      const format = await button.getAttribute('data-copy-format');
      const target = page.locator(`#${targetId}`);
      await expect(target, `copy source #${targetId} in ${article.file}`).toHaveCount(1);
      const expected = await target.evaluate((el, rendered) => (rendered ? el.innerText : el.textContent).trim(), format === 'rendered');
      await button.click();
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
      const successLabel = await button.getAttribute('data-copy-success-label') || 'Zkopírováno';
      await expect(button).toHaveText(successLabel);
      const state = await button.evaluate(el => ({
        label: el.textContent.trim(),
        feedback: el.closest('.prompt-card')?.querySelector('.prompt-copy-feedback')?.textContent ?? null
      }));
      expect(state.label).toBe(successLabel);
      if (state.feedback !== null) expect(state.feedback).toBe(successLabel);
    }
  }
  await context.close();
});

test('wave 8 Skills disclosures and checklist work with keyboard and pointer', async ({ page }) => {
  await page.goto(`${baseURL}/gemini-skills-pro-ucitele.html`);
  const disclosures = page.locator('.article-content details.teacher-skill');
  await expect(disclosures).toHaveCount(8);
  for (let index = 0; index < await disclosures.count(); index++) {
    const disclosure = disclosures.nth(index);
    await disclosure.evaluate(el => { el.open = false; });
    const summary = disclosure.locator(':scope > summary');
    await summary.focus();
    await expect(summary).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(disclosure).toHaveAttribute('open', '');
    await page.keyboard.press('Space');
    await expect(disclosure).not.toHaveAttribute('open', '');
  }
  const checklist = page.locator('.article-content input[type="checkbox"]');
  await expect(checklist).toHaveCount(8);
  for (let index = 0; index < await checklist.count(); index++) {
    const item = checklist.nth(index);
    await expect(item).not.toBeChecked();
    await item.check();
    await expect(item).toBeChecked();
    await item.uncheck();
    await expect(item).not.toBeChecked();
  }
});

test('wave 8 hero computed styles and desktop/mobile visual evidence', async ({ page }) => {
  const fs = require('node:fs');
  const records = [];
  const heroImages = [];
  for (const article of wave8Articles) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${baseURL}/${article.file}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const style = await page.evaluate(() => {
        const selectors = ['body', '.site-header', '.site-breadcrumbs', '.workflow-shell', '.workflow-hero', '.tool-guide-hero-visual', '.workflow-route', '.workflow-stage', '.tool-guide-meta-card', '.workflow-hero h1', '.workflow-hero-lead'];
        return selectors.map(selector => {
          const el = document.querySelector(selector);
          if (!el) return { selector, missing: true };
          const read = node => {
            const s = getComputedStyle(node), before = getComputedStyle(node, '::before'), after = getComputedStyle(node, '::after');
            return { backgroundColor:s.backgroundColor, backgroundImage:s.backgroundImage, color:s.color, opacity:s.opacity, filter:s.filter, backdropFilter:s.backdropFilter,
              before:{display:before.display,content:before.content,backgroundColor:before.backgroundColor,backgroundImage:before.backgroundImage,opacity:before.opacity},
              after:{display:after.display,content:after.content,backgroundColor:after.backgroundColor,backgroundImage:after.backgroundImage,opacity:after.opacity} };
          };
          return { selector, ...read(el) };
        });
      });
      const shell = style.find(x => x.selector === '.workflow-shell');
      const visual = style.find(x => x.selector === '.tool-guide-hero-visual' && !x.missing);
      expect(shell.backgroundImage).toContain('linear-gradient');
      expect(shell.backgroundImage).not.toMatch(/url\(/i);
      expect(shell.backgroundColor).toBe('rgba(0, 0, 0, 0)');
      if (visual?.backgroundImage) {
        expect(visual.backgroundImage).not.toContain('13, 21, 48');
        expect(visual.backgroundImage).not.toContain('0.7)');
      }
      records.push({ file: article.file, width, styles: style });
      const heroPath = `artifacts/wave8-${article.file}-hero-${width}.png`;
      await page.locator('.workflow-shell').screenshot({ path: heroPath });
      if (width === 1440) heroImages.push({ title: article.title, path: heroPath, data: (await fs.promises.readFile(heroPath)).toString('base64') });
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${baseURL}/ai-navod-edit-kontrola.html`, { waitUntil: 'networkidle' });
  const refPath = 'artifacts/wave8-approved-light-reference-hero.png';
  await page.locator('.workflow-shell').screenshot({ path: refPath });
  heroImages.push({ title: 'Schválená světlá reference – EDIT', path: refPath, data: (await fs.promises.readFile(refPath)).toString('base64') });
  fs.writeFileSync('artifacts/wave8-computed-styles.json', JSON.stringify(records, null, 2));
  const cards = heroImages.map(item => `<article><h2>${item.title}</h2><img alt="${item.title}" src="data:image/png;base64,${item.data}"></article>`).join('');
  await page.setViewportSize({ width: 1900, height: 1300 });
  await page.setContent(`<!doctype html><html lang="cs"><meta charset="utf-8"><title>Vlna 8 – srovnání světlých hero</title><style>body{margin:0;padding:24px;background:#fffefa;color:#102d2b;font:600 15px Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:16px}article{min-width:0;border:1px solid #dfe8e1;border-radius:12px;padding:10px;background:#fff;overflow:hidden}h2{font-size:15px;min-height:40px;margin:4px 0 12px}img{display:block;width:100%;height:auto;border:1px solid #eee}</style><main class="grid">${cards}</main></html>`);
  await page.screenshot({ path: 'artifacts/wave8-hero-contact-sheet.png', fullPage: true });
});

test('wave 8 generated TOC works without JavaScript and switches layout at 960/961px', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const article of wave8Articles) {
    for (const width of [960, 961]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${baseURL}/${article.file}`);
      const toc = page.locator('.article-content-navigation');
      await expect(toc).toHaveCount(1);
      await expect(toc.locator('a')).toHaveCount(article.tocCount);
      const target = page.locator(article.h2);
      await expect(target).toHaveCount(1);
      const href = await toc.locator('a').first().getAttribute('href');
      await toc.locator('a').first().click();
      await expect(page).toHaveURL(new RegExp(`#${href.slice(1)}$`));
      await expect(page.locator('.site-header')).toHaveCount(1);
    }
  }
  await context.close();
});

test('wave 8 screenshots show TOC, representative content, and live interactions', async ({ browser }) => {
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  for (const article of wave8Articles) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${baseURL}/${article.file}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await page.locator(article.h2).scrollIntoViewIfNeeded();
    await page.screenshot({ path: `artifacts/wave8-${article.file}-desktop-toc.png` });
    await page.screenshot({ path: `artifacts/wave8-${article.file}-desktop-content.png` });
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${baseURL}/${article.file}`, { waitUntil: 'networkidle' });
    const mobileToc = page.locator('.article-content-navigation');
    await mobileToc.evaluate(el => { el.open = false; });
    await mobileToc.locator('summary').click();
    await expect(mobileToc).toHaveJSProperty('open', true);
    await mobileToc.screenshot({ path: `artifacts/wave8-${article.file}-mobile-toc-open.png` });
    await page.locator('.article-content').scrollIntoViewIfNeeded();
    await page.screenshot({ path: `artifacts/wave8-${article.file}-mobile-content.png` });
    const button = page.locator('.article-content [data-copy-prompt]').first();
    if (await button.count()) {
      await button.evaluate(el => { const details = el.closest('details'); if (details) details.open = true; });
      await button.scrollIntoViewIfNeeded();
      await button.click();
      await expect(button).toHaveText(await button.getAttribute('data-copy-success-label') || 'Zkopírováno');
      await page.screenshot({ path: `artifacts/wave8-${article.file}-mobile-action.png` });
    }
    if (article.file === 'gemini-skills-pro-ucitele.html') {
      const disclosure = page.locator('.article-content details.teacher-skill').first();
      await disclosure.evaluate(el => { el.open = false; });
      await disclosure.scrollIntoViewIfNeeded();
      await page.screenshot({ path: 'artifacts/wave8-skills-disclosure-closed.png' });
      await disclosure.locator(':scope > summary').click();
      await expect(disclosure).toHaveAttribute('open', '');
      await page.screenshot({ path: 'artifacts/wave8-skills-disclosure-open.png' });
      const copyButton = disclosure.locator('[data-copy-prompt]');
      await copyButton.click();
      await expect(copyButton).toHaveText(await copyButton.getAttribute('data-copy-success-label') || 'Zkopírováno');
      await page.screenshot({ path: 'artifacts/wave8-skills-copy-success.png' });
    }
  }
  await context.close();
});


test('wave 12 CSS Grid examples remain exact, selectable, copyable, and contained at 320px', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 320, height: 900 }, permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await context.newPage();
  await page.goto(baseURL + '/ai-workflow-css-grid-vibe-coding.html', { waitUntil: 'networkidle' });
  const codes = page.locator('body code');
  await expect(codes).toHaveCount(31);
  await expect(page.locator('.article-content button')).toHaveCount(0);
  for (let index = 0; index < 31; index++) {
    const code = codes.nth(index);
    const selected = await code.evaluate(element => {
      const range = document.createRange();
      range.selectNodeContents(element);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      return { text: selection.toString(), userSelect: getComputedStyle(element).userSelect };
    });
    expect(selected.text, 'CSS example ' + index + ' must remain selectable').not.toBe('');
    expect(selected.userSelect).not.toBe('none');
    await page.keyboard.press('Control+C');
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(selected.text.replace(/\u00a0/g, ' '));
  }
  for (const viewport of [{ width: 1440, height: 1000, label: 'desktop' }, { width: 320, height: 900, label: 'mobile-320' }]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto(baseURL + '/ai-workflow-css-grid-vibe-coding.html', { waitUntil: 'networkidle' });
    const overflow = await page.evaluate(() => ({
      pageWidth: document.documentElement.scrollWidth,
      viewport: innerWidth,
      prompts: [...document.querySelectorAll('.article-content .article-prompt')].map(element => ({
        width: element.clientWidth, scrollWidth: element.scrollWidth, overflowX: getComputedStyle(element).overflowX
      }))
    }));
    expect(overflow.pageWidth, 'page horizontal overflow at ' + viewport.width).toBeLessThanOrEqual(viewport.width + 1);
    expect(overflow.prompts.every(item => item.scrollWidth <= item.width || ['auto', 'scroll'].includes(item.overflowX)),
      'technical example overflow must stay inside its content block').toBe(true);
    const examples = page.locator('.article-content .article-prompt');
    for (const index of [0, 1, 2]) {
      await examples.nth(index).scrollIntoViewIfNeeded();
      await examples.nth(index).screenshot({ path: 'artifacts/wave12-css-grid-' + viewport.label + '-example-' + (index + 1) + '.png' });
    }
  }
  await context.close();
});

test('wave 12 light hero computed styles, full screenshots, and hero contact sheet', async ({ page }) => {
  const fs = require('node:fs');
  const records = [];
  const cards = [];
  const contrast = (foreground, background) => {
    const rgb = value => {
      const match = value.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (!match) return null;
      return match.slice(1, 4).map(channel => {
        const component = Number(channel) / 255;
        return component <= 0.04045 ? component / 12.92 : ((component + 0.055) / 1.055) ** 2.4;
      }).reduce((sum, component, index) => sum + component * [0.2126, 0.7152, 0.0722][index], 0);
    };
    const a = rgb(foreground), b = rgb(background);
    if (a === null || b === null) return 0;
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  };
  for (const article of wave12Articles) {
    for (const viewport of [
      { name: 'desktop-1440', width: 1440, height: 1000 },
      { name: 'mobile-390', width: 390, height: 844 }
    ]) {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto(baseURL + '/' + article.file, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const image = await page.locator('.workflow-article img').evaluate(element => {
        const rect = element.getBoundingClientRect();
        return { complete: element.complete, naturalWidth: element.naturalWidth, naturalHeight: element.naturalHeight, width: rect.width, height: rect.height, alt: element.alt };
      });
      expect(Boolean(image.complete && image.naturalWidth > 0 && image.naturalHeight > 0 && image.alt.trim())).toBe(true);
      expect(Math.abs((image.width / image.height) / (image.naturalWidth / image.naturalHeight) - 1)).toBeLessThan(0.02);
      const styles = await page.evaluate(() => {
        const selectors = [
          'body', '.site-header', '.site-breadcrumbs', '.workflow-shell', '.workflow-hero',
          '.workflow-eyebrow', '.workflow-hero h1', '.workflow-hero h1 span', '.workflow-hero-lead',
          '.workflow-meta span', '.workflow-route', '.workflow-stage', '.workflow-stage-number',
          '.workflow-stage strong', '.workflow-stage small', '.workflow-shell::before', '.workflow-shell::after',
          '.workflow-route::before', '.workflow-stage::before'
        ];
        const read = item => ({
          display: item.display, content: item.content, backgroundColor: item.backgroundColor,
          backgroundImage: item.backgroundImage, color: item.color, opacity: item.opacity,
          filter: item.filter, backdropFilter: item.backdropFilter, borderColor: item.borderColor
        });
        return selectors.map(selector => {
          const pseudo = selector.includes('::') ? selector.slice(selector.indexOf('::')) : null;
          const target = pseudo ? selector.slice(0, selector.indexOf('::')) : selector;
          const element = document.querySelector(target);
          if (!element) return null;
          return { selector, ...read(getComputedStyle(element, pseudo)) };
        }).filter(Boolean);
      });
      records.push({ file: article.file, ...viewport, styles, image });
      const value = selector => styles.find(item => item.selector === selector);
      const dark = /#0a0f1e|#0d1b40|10, 15, 30|13, 27, 64/i;
      expect(value('body').backgroundColor).toBe('rgb(255, 254, 250)');
      expect(value('.workflow-shell').backgroundImage).toContain('linear-gradient');
      expect(value('.workflow-shell').backgroundImage).not.toMatch(dark);
      expect(value('.workflow-shell::after').display).toBe('none');
      expect(value('.workflow-hero h1').color).toBe('rgb(16, 45, 43)');
      expect(value('.workflow-hero h1 span').color).toBe('rgb(7, 88, 79)');
      expect(value('.workflow-hero-lead').color).toBe('rgb(52, 75, 69)');
      expect(contrast(value('.workflow-hero h1').color, 'rgb(255, 254, 250)')).toBeGreaterThan(7);
      expect(contrast(value('.workflow-hero-lead').color, 'rgb(255, 254, 250)')).toBeGreaterThan(4.5);
      for (const selector of ['.workflow-route', '.workflow-stage', '.workflow-meta span', '.workflow-stage-number',
        '.workflow-shell::before', '.workflow-shell::after', '.workflow-route::before', '.workflow-stage::before']) {
        const entry = value(selector);
        if (!entry) continue;
        expect(entry.backgroundColor, selector + ' light surface').not.toMatch(dark);
        expect(entry.backgroundImage, selector + ' light gradient').not.toMatch(dark);
        expect(entry.backdropFilter, selector + ' no dark overlay').toBe('none');
      }
      for (const selector of ['.workflow-stage strong', '.workflow-stage small']) {
        expect(value(selector).color, selector + ' readable text').not.toMatch(dark);
      }

      const heroPath = 'artifacts/wave12-' + article.file + '-' + viewport.name + '-hero.png';
      await page.locator('.workflow-shell').screenshot({ path: heroPath });
      if (viewport.width === 1440) {
        cards.push({ title: article.title, data: (await fs.promises.readFile(heroPath)).toString('base64') });
        const toc = page.locator('.article-content-navigation');
        await toc.scrollIntoViewIfNeeded();
        await page.waitForTimeout(100);
        await page.screenshot({ path: 'artifacts/wave12-' + article.file + '-desktop-1440-sticky-toc.png' });
        const inner = toc.locator('nav');
        const scroll = await inner.evaluate(element => ({ height: element.scrollHeight, client: element.clientHeight }));
        if (scroll.height > scroll.client) {
          await inner.evaluate(element => { element.scrollTop = Math.floor((element.scrollHeight - element.clientHeight) / 2); });
          await expect.poll(() => inner.evaluate(element => element.scrollTop)).toBeGreaterThan(0);
          await toc.screenshot({ path: 'artifacts/wave12-' + article.file + '-desktop-1440-toc-inner-scroll.png' });
        } else {
          expect(scroll.height, article.file + ' TOC fits without internal overflow').toBeLessThanOrEqual(scroll.client);
        }
        await page.locator(article.representative).scrollIntoViewIfNeeded();
        await page.screenshot({ path: 'artifacts/wave12-' + article.file + '-desktop-1440-content.png' });
      } else {
        const toc = page.locator('.article-content-navigation');
        await expect(toc).toHaveJSProperty('open', true);
        await toc.screenshot({ path: 'artifacts/wave12-' + article.file + '-mobile-390-expanded-toc.png' });
        await page.locator(article.representative).scrollIntoViewIfNeeded();
        await page.screenshot({ path: 'artifacts/wave12-' + article.file + '-mobile-390-content.png' });
      }
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(baseURL + '/ai-navod-edit-kontrola.html', { waitUntil: 'networkidle' });
  const reference = await page.locator('.workflow-shell').screenshot();
  cards.push({ title: 'Schválený světlý pilot EDIT', data: reference.toString('base64') });
  const contact = cards.map(item => '<article><h2>' + item.title + '</h2><img alt="' + item.title + '" src="data:image/png;base64,' + item.data + '"></article>').join('');
  await page.setContent('<!doctype html><html lang="cs"><meta charset="utf-8"><title>Vlna 12 – hero a schválený světlý pilot</title><style>*{box-sizing:border-box}body{margin:0;padding:24px;background:#fffefa;color:#102d2b;font:600 15px Arial,sans-serif}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}article{min-width:0;padding:10px;border:1px solid #dfe8e1;border-radius:12px;background:#fff;overflow:hidden}h2{font-size:16px;min-height:40px;margin:4px 0 12px}img{display:block;width:100%;height:auto;border:1px solid #e5e7e1;border-radius:8px}</style><h1>Vlna 12 – pět migrovaných článků a světlá reference</h1><main class="grid">' + contact + '</main></html>');
  await page.screenshot({ path: 'artifacts/wave12-hero-contact-sheet.png', fullPage: true });
  fs.writeFileSync('artifacts/wave12-computed-styles.json', JSON.stringify(records, null, 2));
});

test('wave 12 article and related internal links resolve from the local preview', async ({ page, request }) => {
  for (const article of wave12Articles) {
    await page.goto(baseURL + '/' + article.file, { waitUntil: 'networkidle' });
    const hrefs = await page.locator('.article-content a[href], .workflow-related a[href]').evaluateAll(links =>
      [...new Set(links.map(link => link.getAttribute('href')).filter(Boolean))]
    );
    for (const href of hrefs) {
      const url = new URL(href, baseURL + '/' + article.file);
      if (url.origin !== new URL(baseURL).origin || url.pathname.endsWith('.pdf') || url.pathname.endsWith('.docx')) continue;
      const response = await request.get(url.origin + url.pathname);
      expect(response.ok(), article.file + ' link ' + href + ' returned ' + response.status()).toBe(true);
    }
  }
});


// Wave 13: the project gallery keeps its card-led layout; long-form pages use the shared contents navigation.
test('wave 13 project gallery preserves every card, image, alt text, order, and project URL at responsive widths', async ({ page }) => {
  const article = wave13Gallery;
  const { execFileSync } = require('node:child_process');
  const baselineHTML = execFileSync('git', ['show', `${article.baselineSha}:${article.file}`], { encoding: 'utf8' });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${baseURL}/${article.file}`, { waitUntil: 'networkidle' });
  const current = await page.evaluate(oldHTML => {
    const oldDoc = new DOMParser().parseFromString(oldHTML, 'text/html');
    const oldCards = [...oldDoc.querySelectorAll('.workflow-project-preview')].map(figure => {
      const card = figure.closest('.workflow-related-card');
      return { text: card.textContent.replace(/\s+/g, ' ').trim(), image: [figure.querySelector('img')?.getAttribute('src'), figure.querySelector('img')?.getAttribute('alt')], links: [...card.querySelectorAll('a[href]')].map(a => a.getAttribute('href')) };
    });
    const cards = [...document.querySelectorAll('.workflow-project-preview')].map(figure => {
      const card = figure.closest('.workflow-related-card');
      return { text: card.textContent.replace(/\s+/g, ' ').trim(), image: [figure.querySelector('img')?.getAttribute('src'), figure.querySelector('img')?.getAttribute('alt')], links: [...card.querySelectorAll('a[href]')].map(a => a.getAttribute('href')) };
    });
    return {
      oldCards, cards,
      oldPageImages: [...oldDoc.querySelectorAll('.workflow-article img')].map(i => [i.getAttribute('src'), i.getAttribute('alt')]),
      pageImages: [...document.querySelectorAll('.workflow-article img')].map(i => [i.getAttribute('src'), i.getAttribute('alt')]),
      title: document.querySelector('.workflow-article-intro h2')?.innerText.trim(),
      noContentsToc: !document.querySelector('.article-content-navigation'),
      oldArticleText: oldDoc.querySelector('.article-content')?.textContent.replace(/\s+/g, ' ').trim(),
      articleText: document.querySelector('.article-content')?.textContent.replace(/\s+/g, ' ').trim(),
      oldHeadings: [...oldDoc.querySelectorAll('.article-content h2,.article-content h3')].map(h => [h.tagName, h.textContent.replace(/\s+/g, ' ').trim()]),
      headings: [...document.querySelectorAll('.article-content h2,.article-content h3')].map(h => [h.tagName, h.textContent.replace(/\s+/g, ' ').trim()]),
      oldLinks: [...oldDoc.querySelectorAll('.workflow-article a[href],.workflow-related a[href]')].map(a => [a.getAttribute('href'), a.textContent.replace(/\s+/g, ' ').trim()]),
      links: [...document.querySelectorAll('.workflow-article a[href],.workflow-related a[href]')].map(a => [a.getAttribute('href'), a.textContent.replace(/\s+/g, ' ').trim()]),
      oldMetadata: [...oldDoc.querySelectorAll('meta[name="description"],meta[property^="og:"]')].map(m => [m.getAttribute('name')||m.getAttribute('property'),m.getAttribute('content')]),
      metadata: [...document.querySelectorAll('meta[name="description"],meta[property^="og:"]')].map(m => [m.getAttribute('name')||m.getAttribute('property'),m.getAttribute('content')]),
      oldCanonical: oldDoc.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href'),
      breadcrumb: document.querySelector('.site-breadcrumbs > ol > li:nth-child(2) a')?.getAttribute('href'),
      scrollWidth: document.documentElement.scrollWidth,
      viewportWidth: innerWidth
    };
  }, baselineHTML);
  expect(current.title).toBe('Vibe coding pro učitele: co si můžete vytvořit do výuky');
  expect(current.cards).toEqual(current.oldCards);
  expect(current.articleText).toBe(current.oldArticleText);
  expect(current.headings).toEqual(current.oldHeadings);
  expect(current.links).toEqual(current.oldLinks);
  expect(current.metadata).toEqual(current.oldMetadata);
  expect(current.canonical).toBe(current.oldCanonical);
  expect(current.pageImages).toEqual(current.oldPageImages);
  expect(current.cards.length).toBeGreaterThan(0);
  expect(current.noContentsToc).toBe(true);
  expect(current.breadcrumb).toBe('vibe-coding.html');
  expect(current.scrollWidth).toBeLessThanOrEqual(current.viewportWidth + 1);
  await expect(page.locator('.site-nav-pilot details[data-active="true"] > summary')).toHaveText(article.activeArea);
  await expect(page.locator('.workflow-project-grid .workflow-related-card')).toHaveCount(9);
  await page.locator('.workflow-project-preview').last().scrollIntoViewIfNeeded();
  await expect.poll(() => page.locator('.workflow-article img').evaluateAll(images => images.every(img => img.complete && img.naturalWidth > 0 && Boolean(img.alt)))).toBe(true);
  await page.screenshot({ path: 'artifacts/wave13-project-gallery-desktop-1440.png', fullPage: true });
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${baseURL}/${article.file}`, { waitUntil: 'networkidle' });
    const geometry = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, width: innerWidth, columns: getComputedStyle(document.querySelector('.workflow-project-grid')).gridTemplateColumns }));
    expect(geometry.scrollWidth, `gallery overflow at ${width}px`).toBeLessThanOrEqual(width + 1);
    if (width <= 640) expect(geometry.columns.split(' ').length).toBe(1);
    if (width === 390) {
      await page.locator('.menu-toggle').click();
      await expect(page.locator('.menu-toggle')).toHaveAttribute('aria-expanded', 'true');
      await page.screenshot({ path: 'artifacts/wave13-project-gallery-mobile-390.png', fullPage: true });
    }
  }
});

test('wave 13 article pages retain public fragments and contents navigation works without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: false });
  const page = await context.newPage();
  for (const article of wave13Articles) {
    await page.goto(`${baseURL}/${article.file}`);
    const link = page.locator(`.article-content-navigation a[href="${article.h2}"]`);
    await expect(link).toHaveCount(1);
    await link.click();
    await expect(page).toHaveURL(new RegExp(`${article.h2}$`));
    await expect(page.locator(article.h2)).toBeInViewport();
    await expect(page.locator('.article-content-navigation')).toHaveJSProperty('open', true);
  }
  await context.close();
});

test('wave 13 preserves both efficiency tables, six prompt-copy buttons, and bonus details interaction', async ({ browser }) => {
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'], viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/neplytvej-inteligenci-ai-modely.html`, { waitUntil: 'networkidle' });
  await expect(page.locator('.article-table')).toHaveCount(2);
  await expect(page.locator('.article-content .prompt-copy-button[data-copy-prompt]')).toHaveCount(6);
  await expect(page.locator('.article-bonus')).toHaveCount(1);
  const tableState = await page.locator('.article-table-wrap').evaluateAll(wraps => wraps.map(wrap => ({ scrollWidth: wrap.scrollWidth, clientWidth: wrap.clientWidth, overflowX: getComputedStyle(wrap).overflowX, rows: wrap.querySelectorAll('tr').length })));
  expect(tableState).toHaveLength(2);
  expect(tableState.every(table => table.scrollWidth <= table.clientWidth || ['auto', 'scroll'].includes(table.overflowX))).toBe(true);
  for (const button of await page.locator('.article-content .prompt-copy-button[data-copy-prompt]').all()) {
    const promptId = await button.getAttribute('data-copy-prompt');
    const inDetails = await button.evaluate(el => Boolean(el.closest('details')));
    if (inDetails) await button.evaluate(el => { el.closest('details').open = true; });
    const expected = (await page.locator(`#${promptId}`).textContent()).trim();
    await button.click();
    await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
    await expect(button).toContainText('Zkopírováno');
    if (promptId === 'prompt-1') await button.screenshot({ path: 'artifacts/wave13-neplytvej-copy-success.png' });
  }
  const bonus = page.locator('.article-bonus'), summary = bonus.locator('summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(bonus).not.toHaveAttribute('open', '');
  await page.keyboard.press('Space');
  await expect(bonus).toHaveAttribute('open', '');
  await expect(bonus.locator('table')).toBeVisible();
  await bonus.screenshot({ path: 'artifacts/wave13-neplytvej-bonus-expanded.png' });
  await page.locator('.article-table-wrap').nth(0).screenshot({ path: 'artifacts/wave13-neplytvej-table-1.png' });
  await page.locator('.article-table-wrap').nth(1).screenshot({ path: 'artifacts/wave13-neplytvej-table-2.png' });
  await page.keyboard.press('Space');
  await expect(bonus).not.toHaveAttribute('open', '');
  await page.locator('.article-table-wrap').nth(0).screenshot({ path: 'artifacts/wave13-neplytvej-table-and-copy-success.png' });
  await context.close();
});

test('wave 13 skill keeps all 19 code elements and copies the unchanged prompt', async ({ browser }) => {
  const context = await browser.newContext({ permissions: ['clipboard-read', 'clipboard-write'], viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  await page.goto(`${baseURL}/skill-anglictina-vyukove-materialy.html`, { waitUntil: 'networkidle' });
  await expect(page.locator('.article-content code')).toHaveCount(19);
  const button = page.locator('[data-copy-prompt="skill-example"]');
  await expect(button).toHaveCount(1);
  const expected = (await page.locator('#skill-example').textContent()).trim();
  await button.click();
  await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(expected);
  await expect(button).toContainText('Zkopírováno');
  for (const width of [320, 390]) {
    await page.setViewportSize({ width, height: 844 });
    const state = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, code: [...document.querySelectorAll('.article-content code')].map(el => ({ width: el.getBoundingClientRect().width, scrollWidth: el.scrollWidth })) }));
    expect(state.scrollWidth, `SKILL page overflow at ${width}px`).toBeLessThanOrEqual(width + 1);
    expect(state.code.every(code => code.width <= width)).toBe(true);
    if (width === 320) await page.screenshot({ path: 'artifacts/wave13-skill-code-mobile-320.png', fullPage: true });
    if (width === 390) await page.screenshot({ path: 'artifacts/wave13-skill-copy-success-mobile-390.png', fullPage: true });
  }
  await context.close();
});

test('wave 13 hero computed styles and screenshot contact sheet compare all six pages with the approved light pilot', async ({ page }) => {
  const fs = require('node:fs');
  const records = [];
  const cards = [];
  const all = [...wave13Articles, wave13Gallery];
  for (const article of all) {
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 1000 });
      await page.goto(`${baseURL}/${article.file}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const record = await page.evaluate(() => {
        const pick = selector => {
          const el = document.querySelector(selector);
          if (!el) return null;
          const style = getComputedStyle(el), before = getComputedStyle(el, '::before'), after = getComputedStyle(el, '::after');
          return { backgroundColor: style.backgroundColor, backgroundImage: style.backgroundImage, color: style.color, before: { display: before.display, backgroundColor: before.backgroundColor, backgroundImage: before.backgroundImage, opacity: before.opacity }, after: { display: after.display, backgroundColor: after.backgroundColor, backgroundImage: after.backgroundImage, opacity: after.opacity } };
        };
        return { page: location.pathname, viewport: innerWidth, body: pick('body'), shell: pick('.workflow-shell'), hero: pick('.workflow-hero'), heading: pick('.workflow-hero h1'), route: pick('.workflow-route'), panel: pick('.workflow-stage') };
      });
      expect(record.body.backgroundColor).toBe('rgb(255, 254, 250)');
      expect(record.heading.color).not.toBe('rgb(255, 255, 255)');
      records.push(record);
      if (width === 1440) {
        const image = await page.locator('.workflow-shell').screenshot();
        cards.push({ title: article.title, data: image.toString('base64') });
      }
      if (width === 390) {
        await page.locator('.workflow-shell').screenshot({ path: `artifacts/wave13-${article.file}-hero-mobile-390.png` });
        await page.locator('.workflow-main').screenshot({ path: `artifacts/wave13-${article.file}-content-mobile-390.png` });
      } else {
        await page.locator('.workflow-shell').screenshot({ path: `artifacts/wave13-${article.file}-hero-desktop-1440.png` });
        await page.locator('.workflow-main').screenshot({ path: `artifacts/wave13-${article.file}-content-desktop-1440.png` });
      }
    }
  }
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(`${baseURL}/ai-workflow-css-grid-vibe-coding.html`, { waitUntil: 'networkidle' });
  const reference = await page.locator('.workflow-shell').screenshot();
  cards.push({ title: 'Schválený světlý pilot (PR #66)', data: reference.toString('base64') });
  await page.setContent(`<!doctype html><html lang="cs"><meta charset="utf-8"><title>Vlna 13 – hero kontakt sheet</title><style>
    *{box-sizing:border-box}body{margin:0;padding:24px;background:#fffefa;color:#102d2b;font:600 15px Arial,sans-serif}
    h1{margin:0 0 18px}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px}
    article{padding:10px;border:1px solid #dfe8e1;border-radius:12px;background:#fff;overflow:hidden}
    h2{font-size:16px;min-height:40px;margin:4px 0 10px}img{display:block;width:100%;height:auto;object-fit:contain;border:1px solid #e5e7e1;border-radius:8px}
  </style><h1>Metodické a projektové stránky – vlna 13 se schváleným pilotem</h1><main class="grid">${cards.map(x => `<article><h2>${x.title}</h2><img alt="${x.title}" src="data:image/png;base64,${x.data}"></article>`).join('')}</main></html>`);
  await page.screenshot({ path: 'artifacts/wave13-hero-contact-sheet.png', fullPage: true });
  fs.writeFileSync('artifacts/wave13-computed-styles.json', JSON.stringify(records, null, 2));
});

test('wave 13 internal article and gallery links resolve on the preview', async ({ page, request }) => {
  for (const article of [...wave13Articles, wave13Gallery]) {
    await page.goto(`${baseURL}/${article.file}`, { waitUntil: 'networkidle' });
    const hrefs = await page.locator('.article-content a[href], .workflow-article a[href], .workflow-related a[href]').evaluateAll(links => [...new Set(links.map(link => link.getAttribute('href')).filter(Boolean))]);
    for (const href of hrefs) {
      const url = new URL(href, `${baseURL}/${article.file}`);
      if (url.origin !== new URL(baseURL).origin || url.pathname.endsWith('.pdf') || url.pathname.endsWith('.docx') || url.pathname.endsWith('.zip')) continue;
      const response = await request.get(url.origin + url.pathname);
      expect(response.ok(), `${article.file} link ${href} returned ${response.status()}`).toBe(true);
    }
  }
});

test('migration catalog records remain complete, dated, unique, linked, and homepage order stays current', async ({ page, request }) => {
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await expect(page.locator('#latest-articles .latest-card')).toHaveCount(6);
  const data = await page.evaluate(() => {
    const wanted = ['asistent-ucitele-osobni-ai-asistent.html','neplytvej-inteligenci-ai-modely.html','skill-anglictina-vyukove-materialy.html','vibe-coding-bezpecnost-kodu-php2shell.html','vibe-coding-pro-ucitele.html','vibe-coding-ucitele.html','ai-novinka-agenti-onenote-pruvodce-ucenim.html','ai-novinka-gemini-desktop-chatgpt-word-agenti.html','ai-novinka-sdilene-zdroje-propojene-aplikace-2026.html','notebooklm-hlasovy-rozhovor-nad-zdroji.html','ai-novinka-ai-ve-vzdelavani-srpen-2026.html','ai-novinka-gemini-classroom.html','ai-novinka-microsoft-ai-workflow.html','ai-novinka-microsoft-gemini.html','ai-novinka-vykonnejsi-ai.html'];
    const records = wanted.map(href => window.siteArticles.find(item => item.href === href));
    const latest = window.siteArticles.map((article,index) => ({article,index}))
      .sort((a,b) => (b.article.date || '').localeCompare(a.article.date || '') || a.index-b.index).slice(0,6).map(item=>item.article.href);
    return {records, latest, rendered:[...document.querySelectorAll('#latest-articles .latest-card-title')].map(a=>a.getAttribute('href')), duplicates:window.siteArticles.map(item=>item.href).filter((href,i,all)=>all.indexOf(href)!==i)};
  });
  const expectedDates = {
    'asistent-ucitele-osobni-ai-asistent.html':['2026-10-25','25. října 2026'],
    'neplytvej-inteligenci-ai-modely.html':['2026-09-23','23. září 2026'],
    'skill-anglictina-vyukove-materialy.html':['2026-11-01','1. listopadu 2026'],
    'vibe-coding-bezpecnost-kodu-php2shell.html':['2026-10-25','25. října 2026'],
    'vibe-coding-pro-ucitele.html':['2026-09-11','11. září 2026'],
    'vibe-coding-ucitele.html':['2026-08-23','23. srpna 2026'],
    'ai-novinka-agenti-onenote-pruvodce-ucenim.html':['2026-09-07','7. září 2026'],
    'ai-novinka-gemini-desktop-chatgpt-word-agenti.html':['2026-09-18','18. září 2026'],
    'ai-novinka-sdilene-zdroje-propojene-aplikace-2026.html':['2026-09-11','11. září 2026'],
    'notebooklm-hlasovy-rozhovor-nad-zdroji.html':['2026-09-23','23. září 2026'],
    'ai-novinka-ai-ve-vzdelavani-srpen-2026.html':['2026-08-27','27. srpna 2026'],
    'ai-novinka-gemini-classroom.html':['2026-08-12','12. srpna 2026'],
    'ai-novinka-microsoft-ai-workflow.html':['2026-08-21','21. srpna 2026'],
    'ai-novinka-microsoft-gemini.html':['2026-08-17','17. srpna 2026'],
    'ai-novinka-vykonnejsi-ai.html':['2026-08-14','14. srpna 2026']
  };
  expect(data.records.every(Boolean)).toBe(true);
  expect(data.duplicates).toEqual([]);
  expect(data.rendered).toEqual(data.latest);
  for (const record of data.records) {
    for (const field of ['href','title','summary','category','date','dateLabel','icon','tags','badgeClass']) expect(record[field], `catalog ${field} for ${record.href}`).toBeTruthy();
    expect([record.date,record.dateLabel]).toEqual(expectedDates[record.href]);
    const response = await request.get(`${baseURL}/${record.href}`);
    expect(response.ok(), `catalog target ${record.href}`).toBe(true);
  }
});

test('wave 13 full article media and metadata match source HEAD on all six migrated pages', async ({ page }) => {
  const { execFileSync } = require('node:child_process');
  for (const article of [...wave13Articles, wave13Gallery]) {
    const baselineHTML = execFileSync('git', ['show', `${article.baselineSha}:${article.file}`], { encoding: 'utf8' });
    const currentHTML = require('node:fs').readFileSync(article.file, 'utf8');
    const [before, after] = await page.evaluate(([oldHTML,newHTML]) => {
      const fingerprint = html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const article = doc.querySelector('.workflow-article');
        return {
          images: [...article.querySelectorAll('img')].map(img=>[img.getAttribute('src'),img.getAttribute('alt'),img.getAttribute('width'),img.getAttribute('height')]),
          ids: [...new Set([...doc.querySelectorAll('.workflow-article [id],.workflow-related [id],a[href^="#"]')].map(el=>el.id || decodeURIComponent(el.getAttribute('href').slice(1))).filter(Boolean))],
          metadata: [...doc.querySelectorAll('meta[name="description"],meta[property^="og:"]')].map(meta=>[meta.getAttribute('name')||meta.getAttribute('property'),meta.getAttribute('content')]),
          canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href'),
          published: doc.querySelector('meta[property="article:published_time"]')?.getAttribute('content') || null,
          dates: [...doc.querySelectorAll('.workflow-article-meta time')].map(time=>time.getAttribute('datetime'))
        };
      };
      return [fingerprint(oldHTML),fingerprint(newHTML)];
    }, [baselineHTML,currentHTML]);
    expect(after.images, `article image src/alt/dimensions on ${article.file}`).toEqual(before.images);
    for (const id of before.ids) if (!(article.legacyInternalIds || []).includes(id)) expect(after.ids, `fragment ${id} on ${article.file}`).toContain(id);
    expect(after.metadata, `SEO metadata on ${article.file}`).toEqual(before.metadata);
    expect(after.canonical, `canonical URL on ${article.file}`).toBe(before.canonical);
    expect(after.published, `published date metadata on ${article.file}`).toBe(before.published);
    expect(after.dates, `article dates on ${article.file}`).toEqual(before.dates);
  }
});


test('wave 14 preserves every article text, heading, source link, image, and metadata from the exact baseline', async ({ page }) => {
  const { execFileSync } = require('node:child_process');
  for (const item of wave14Articles) {
    const beforeHTML = execFileSync('git', ['show', `${item.baselineSha}:${item.file}`], { encoding: 'utf8' });
    const afterHTML = require('node:fs').readFileSync(item.file, 'utf8');
    const [before, after] = await page.evaluate(([oldHTML,newHTML]) => {
      const fingerprint = html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const norm = value => (value || '').replace(/\\s+/g, ' ').trim();
        const article = doc.querySelector('.workflow-article');
        const related = doc.querySelector('.workflow-related');
        const scoped = [article,related].filter(Boolean);
        return {
          title: doc.title,
          heroText: norm(doc.querySelector('.workflow-hero')?.textContent),
          articleText: scoped.map(el=>norm(el.textContent)),
          headings: [...doc.querySelectorAll('.workflow-article h2,.workflow-article h3')].map(h=>[h.tagName,norm(h.textContent)]),
          links: scoped.flatMap(el=>[...el.querySelectorAll('a[href]')].map(a=>[a.getAttribute('href'),norm(a.textContent)])),
          images: [...scoped.flatMap(el=>[...el.querySelectorAll('img')]),...doc.querySelectorAll('.workflow-hero img')].map(img=>[img.getAttribute('src'),img.getAttribute('alt'),img.getAttribute('width'),img.getAttribute('height')]),
          ids: [...new Set(scoped.flatMap(el=>[...el.querySelectorAll('[id]')].map(node=>node.id)).filter(id=>!id.startsWith('wave14-')))].sort(),
          metadata: [...doc.querySelectorAll('meta[name="description"],meta[property^="og:"]')].map(meta=>[meta.getAttribute('name')||meta.getAttribute('property'),meta.getAttribute('content')]),
          canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || null,
          published: doc.querySelector('meta[property="article:published_time"]')?.getAttribute('content') || null,
          time: [...doc.querySelectorAll('time')].map(el=>[el.getAttribute('datetime'),norm(el.textContent)]),
          h1: norm(doc.querySelector('.workflow-hero h1')?.textContent),
          lead: norm(doc.querySelector('.workflow-hero-lead')?.textContent),
          counts: [doc.querySelectorAll('h2').length,doc.querySelectorAll('h3').length,scoped.reduce((n,el)=>n+el.querySelectorAll('img').length,0)+doc.querySelectorAll('.workflow-hero img').length,scoped.reduce((n,el)=>n+el.querySelectorAll('button').length,0)]
        };
      };
      return [fingerprint(oldHTML),fingerprint(newHTML)];
    }, [beforeHTML,afterHTML]);
    expect(after.title, item.file).toBe(before.title);
    expect(after.heroText, item.file+' hero/date text').toBe(before.heroText);
    expect(after.articleText, item.file+' full article and related text').toEqual(before.articleText);
    expect(after.headings, item.file+' H2/H3 order and wording').toEqual(before.headings);
    expect(after.links, item.file+' hrefs and visible link text').toEqual(before.links);
    expect(after.images, item.file+' images, alt text, and dimensions').toEqual(before.images);
    expect(after.ids, item.file+' public article IDs').toEqual(before.ids);
    expect(after.metadata, item.file+' SEO/Open Graph').toEqual(before.metadata);
    expect(after.canonical, item.file+' canonical URL').toBe(before.canonical);
    expect(after.published, item.file+' publication metadata').toBe(before.published);
    expect(after.time, item.file+' time elements').toEqual(before.time);
    expect(after.h1, item.file+' headline').toBe(before.h1);
    expect(after.lead, item.file+' lead').toBe(before.lead);
    expect(after.counts, item.file+' H2/H3/image/button inventory').toEqual(before.counts);
    expect(after.counts[0], item.file+' total H2 inventory').toBe([12,9,15,13][wave14Articles.indexOf(item)]);
    expect(after.counts[1], item.file+' total H3 inventory').toBe([6,8,6,3][wave14Articles.indexOf(item)]);
    expect(after.counts[2], item.file+' illustration count').toBe(1);
  }
});

test('wave 14 NotebookLM shared mobile menu retains the original navigation action', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${baseURL}/notebooklm-hlasovy-rozhovor-nad-zdroji.html`);
  await expect(page.locator('script[src^="js/main.js"]')).toHaveCount(1);
  await expect(page.locator('.nav-mobile-toggle')).toHaveCount(0);
  const toggle = page.locator('.menu-toggle');
  const menu = page.locator('#primary-menu');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-expanded','true');
  await expect(menu).toHaveClass(/is-open/);
  await expect(menu).toBeVisible();
  await page.screenshot({ path: 'artifacts/notebooklm-hlasovy-rozhovor-nad-zdroji-mobile-menu-open.png' });
  await page.keyboard.press('Escape');
  await expect(toggle).toHaveAttribute('aria-expanded','false');
  await expect(menu).not.toHaveClass(/is-open/);
});

test('wave 14 direct chapter links work with JavaScript disabled', async ({ browser }) => {
  const page = await browser.newPage({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  for (const item of wave14Articles) {
    await page.goto(`${baseURL}/${item.file}${item.h2}`);
    await expect(page).toHaveURL(new RegExp(item.h2.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'$'));
    const heading = page.locator(item.h2);
    await expect(heading).toBeAttached();
    const id = await heading.getAttribute('id');
    expect(id).toBe(item.h2.slice(1));
  }
  await page.close();
});

test('wave 14 hero computed styles and six-view screenshot evidence', async ({ page }) => {
  const fs = require('node:fs');
  const records = [];
  const heroes = [];
  for (const item of [...wave14Articles, { file: 'ai-novinka-datovi-agenti-lidske-schvaleni.html', title: 'Referenční světlá stránka' }]) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${baseURL}/${item.file}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    const hero = page.locator('.workflow-shell');
    const heroShot = await hero.screenshot();
    if (wave14Articles.includes(item)) heroes.push({ title: item.title, data: heroShot.toString('base64') });
    const styles = await page.evaluate(() => {
      const selectors = ['.workflow-shell','.workflow-hero','.philosophy-hero-cover','.workflow-hero h1','.workflow-hero-lead','.workflow-eyebrow','.workflow-meta','.workflow-meta span','.workflow-shell img'];
      const nodes = selectors.map(selector => {
        const el = document.querySelector(selector);
        if (!el) return {selector, missing:true};
        const get = pseudo => {
          const s = getComputedStyle(el,pseudo);
          return {backgroundColor:s.backgroundColor,backgroundImage:s.backgroundImage,color:s.color,borderColor:s.borderColor,boxShadow:s.boxShadow,display:s.display,content:s.content};
        };
        return {selector, rect:el.getBoundingClientRect().toJSON(), style:get(null), before:get('::before'), after:get('::after')};
      });
      return {url:location.pathname,width:innerWidth,bodyBackground:getComputedStyle(document.body).backgroundColor,nodes};
    });
    records.push(styles);
    expect(styles.bodyBackground).toBe('rgb(255, 254, 250)');
    expect(styles.nodes.find(x=>x.selector==='.workflow-hero h1').style.color).toBe('rgb(16, 45, 43)');
    expect(styles.nodes.find(x=>x.selector==='.workflow-hero-lead').style.color).toBe('rgb(52, 75, 69)');
    expect(styles.nodes.find(x=>x.selector==='.workflow-shell').style.backgroundImage).toContain('rgb(255, 255, 255)');
    expect(styles.nodes.find(x=>x.selector==='.workflow-shell').after.display).toBe('none');
    if (item.file === 'notebooklm-hlasovy-rozhovor-nad-zdroji.html') {
      const cover = styles.nodes.find(x=>x.selector==='.philosophy-hero-cover');
      expect(cover.style.backgroundColor).toBe('rgb(242, 246, 241)');
      expect(cover.style.boxShadow).not.toContain('0.3)');
    }

    if (wave14Articles.includes(item)) {
      await page.screenshot({ path: `artifacts/${item.file}-desktop-1440-hero.png` });
      await page.locator('.article-content-navigation').scrollIntoViewIfNeeded();
      await page.waitForTimeout(160);
      await page.screenshot({ path: `artifacts/${item.file}-desktop-1440-sticky-contents.png` });
      await page.locator(item.representative).scrollIntoViewIfNeeded();
      await page.waitForTimeout(120);
      await page.screenshot({ path: `artifacts/${item.file}-desktop-1440-representative.png` });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${baseURL}/${item.file}`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({ path: `artifacts/${item.file}-mobile-390-hero.png` });
      const mobileStyles = await page.evaluate(() => ({width:innerWidth,scrollWidth:document.documentElement.scrollWidth,background:getComputedStyle(document.body).backgroundColor,heroBackground:getComputedStyle(document.querySelector('.workflow-shell')).backgroundImage}));
      expect(mobileStyles.scrollWidth).toBeLessThanOrEqual(391);
      records.push({url:new URL(page.url()).pathname,width:390,...mobileStyles});
      const toc = page.locator('.article-content-navigation');
      await toc.scrollIntoViewIfNeeded();
      await expect(toc).toHaveJSProperty('open',true);
      await page.waitForTimeout(100);
      await toc.screenshot({ path: `artifacts/${item.file}-mobile-390-contents-expanded.png` });
      await page.locator(item.representative).scrollIntoViewIfNeeded();
      await page.waitForTimeout(100);
      await page.screenshot({ path: `artifacts/${item.file}-mobile-390-representative.png` });
    }
  }
  fs.writeFileSync('artifacts/wave14-computed-styles.json',JSON.stringify({testedSha:process.env.TESTED_SHA,baselineSha:'709eeb0edb22c8bdd988ec41999e087b25861143',records},null,2));
  const cards = heroes.map(hero=>`<figure><figcaption>${hero.title.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</figcaption><img alt="" src="data:image/png;base64,${hero.data}"></figure>`).join('');
  await page.setContent(`<!doctype html><html><head><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{margin:0;padding:24px;background:#fffefa;color:#102d2b;font:600 16px Arial}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px}figure{margin:0;padding:10px;background:white;border:1px solid #dfe8e1;border-radius:12px}figcaption{margin:0 0 8px}img{display:block;width:100%;height:320px;object-fit:cover;object-position:top;border-radius:8px}@media(max-width:700px){.grid{grid-template-columns:1fr}}</style></head><body><h1>Wave 14 · porovnání světlých hero</h1><div class="grid">${cards}</div></body></html>`);
  await page.screenshot({ path: 'artifacts/wave14-hero-contact-sheet.png', fullPage: true });
});

test('wave 15 hero styles and six screenshot evidence sets', async ({ page }) => {
  const fs = require('node:fs');
  const path = require('node:path');
  fs.mkdirSync('artifacts', { recursive: true });
  const evidence = { testedSha: process.env.TESTED_SHA, baselineSha: '1a2ca130db05a6cfe46e072235a18ecb75d2adbb', pages: [] };
  const heroCards = [];
  const refs = [...wave15Articles.map(article => ({ ...article, isReference: false })), {
    file: 'ai-novinka-datovi-agenti-lidske-schvaleni.html',
    title: 'Schválená světlá reference PR #68', isReference: true
  }];
  const styleSnapshot = async () => page.evaluate(() => {
    const selectors = ['body', '.site-header', '.workflow-shell', '.workflow-shell::before', '.workflow-shell::after',
      '.workflow-hero', '.workflow-hero h1', '.workflow-hero-lead', '.workflow-eyebrow',
      '.workflow-meta', '.workflow-route', '.workflow-stage', '.workflow-stage-number',
      '.workflow-news-panel', '.workflow-news-panel-label', '.workflow-news-panel-meta span'];
    return Object.fromEntries(selectors.map(selector => {
      const pseudo = selector.includes('::');
      const base = selector.replace(/::(before|after)/, '');
      const el = document.querySelector(base);
      if (!el) return [selector, null];
      const style = getComputedStyle(el, pseudo ? selector.slice(selector.indexOf('::')) : null);
      return [selector, { backgroundColor: style.backgroundColor, backgroundImage: style.backgroundImage,
        color: style.color, display: style.display, borderColor: style.borderColor, fontFamily: style.fontFamily }];
    }));
  });
  for (const article of refs) {
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(`${baseURL}/${article.file}`, { waitUntil: 'networkidle' });
    await page.evaluate(async () => { await document.fonts.ready; });
    await expect(page.locator('.workflow-hero')).toBeVisible();
    const hero = page.locator('.workflow-hero');
    const heroImg = await hero.screenshot();
    heroCards.push({ title: article.isReference ? article.title : article.file, data: heroImg.toString('base64') });
    const style = await styleSnapshot();
    if (!article.isReference) {
      const inventory = await page.evaluate(() => ({
        bodyH2: document.querySelectorAll('.article-content h2').length,
        bodyH3: document.querySelectorAll('.article-content h3').length,
        images: document.querySelectorAll('.workflow-article img').length,
        loadedImages: [...document.querySelectorAll('.workflow-article img')].every(img => img.complete && img.naturalWidth > 0),
        duplicateToc: document.querySelectorAll('.article-content-navigation').length,
        date: document.querySelector('.workflow-eyebrow')?.textContent.trim(),
        breadcrumbs: [...document.querySelectorAll('.site-breadcrumbs a')].map(a => ({ text: a.textContent.trim(), href: a.getAttribute('href') }))
      }));
      expect(inventory.bodyH2).toBe(article.sourceH2 - 1);
      expect(inventory.bodyH3).toBe(article.file === 'ai-novinka-ai-ve-vzdelavani-srpen-2026.html' ? 3 : 0);
      expect(inventory.images).toBe(article.sourceImages);
      expect(inventory.loadedImages).toBe(true);
      expect(inventory.duplicateToc).toBe(1);
      expect(inventory.breadcrumbs.some(link => link.href === 'ai.html#novinky')).toBe(true);
      expect(style['body'].backgroundColor).toBe('rgb(255, 254, 250)');
      expect(style['.workflow-shell::after'].display).toBe('none');
      expect(style['.workflow-hero h1'].color).toBe('rgb(16, 45, 43)');
      if (style['.workflow-route']) {
        expect(style['.workflow-stage'].backgroundColor).toBe('rgba(255, 255, 255, 0.88)');
      } else {
        expect(style['.workflow-news-panel']).not.toBeNull();
        expect(style['.workflow-news-panel'].backgroundImage).toContain('linear-gradient');
        expect(style['.workflow-news-panel-label']).not.toBeNull();
      }
      evidence.pages.push({ file: article.file, inventory, computedStyles: style });
          await hero.screenshot({ path: `artifacts/${article.file}-desktop-1440-hero.png` });
      await page.locator('.article-content-navigation').scrollIntoViewIfNeeded();
      await page.screenshot({ path: `artifacts/${article.file}-desktop-1440-toc.png` });
      await page.locator(article.representative).scrollIntoViewIfNeeded();
      await page.screenshot({ path: `artifacts/${article.file}-desktop-1440-chapter.png` });
      await page.setViewportSize({ width: 390, height: 844 });
      await page.goto(`${baseURL}/${article.file}`, { waitUntil: 'networkidle' });
      await page.evaluate(async () => { await document.fonts.ready; });
      await page.locator('.workflow-hero').screenshot({ path: `artifacts/${article.file}-mobile-390-hero.png` });
      const toc = page.locator('.article-content-navigation');
      const summary = toc.locator('summary');
      if (!(await toc.evaluate(el => el.open))) await summary.click();
      await expect(toc).toHaveJSProperty('open', true);
      await toc.screenshot({ path: `artifacts/${article.file}-mobile-390-toc.png` });
      await page.locator(article.representative).scrollIntoViewIfNeeded();
      await page.screenshot({ path: `artifacts/${article.file}-mobile-390-chapter.png` });
    }
  }
  evidence.testedSha = process.env.TESTED_SHA || 'unavailable';
  fs.writeFileSync('artifacts/wave15-computed-styles.json', JSON.stringify(evidence, null, 2));
  const cards = heroCards.map(card => `<article><h2>${card.title}</h2><img alt="${card.title}" src="data:image/png;base64,${card.data}"></article>`).join('');
  await page.setViewportSize({ width: 1200, height: 1500 });
  await page.setContent(`<!doctype html><html lang="cs"><meta charset="utf-8"><style>body{font:16px Arial;background:#fffefa;color:#102d2b;margin:24px}h1{font-size:24px}main{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:20px}article{border:1px solid #dfe8e1;border-radius:14px;padding:12px;background:white}h2{font-size:14px}img{width:100%;height:280px;object-fit:contain;object-position:top}</style><h1>Vlna 15 – světlé hero a schválená reference PR #68</h1><main>${cards}</main></html>`);
  await page.screenshot({ path: 'artifacts/wave15-hero-contact-sheet.png', fullPage: true });
});

