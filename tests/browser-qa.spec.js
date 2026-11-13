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
    await expect(page.locator('.site-breadcrumbs li')).toHaveCount(3);
    await expect(page.locator('.site-breadcrumbs li').nth(0)).toContainText('Domů');
    await expect(page.locator('.site-breadcrumbs li').nth(1)).toContainText('AI ve vzdělávání');
    await expect(page.locator('.site-breadcrumbs li').nth(2)).toHaveAttribute('aria-current', 'page');
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

test('homepage renders the six newest catalog entries and all wave 7 and wave 8 records', async ({ page }) => {
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  await expect(page.locator('#latest-articles .latest-card')).toHaveCount(6);
  const [expected, actual, wave7Records, wave8Records, duplicateHrefs] = await page.evaluate(() => {
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
      ['gemini-desktop-navod-pro-ucitele.html', 'gemini-notebook-navod-pro-ucitele.html', 'gemini-skills-pro-ucitele.html', 'gemini-storybook-navod-pro-ucitele.html']
        .map(href => window.siteArticles.find(article => article.href === href)),
      window.siteArticles.map(item => item.href).filter((href, index, all) => all.indexOf(href) !== index)
    ];
  });
  expect(actual).toEqual(expected);
  expect(duplicateHrefs).toEqual([]);
  for (const article of [...wave7Records, ...wave8Records]) {
    expect(article).toBeTruthy();
    for (const field of ['href', 'title', 'summary', 'category', 'date', 'dateLabel', 'icon', 'tags', 'badgeClass']) {
      expect(article[field], `catalog ${field} for ${article.href}`).toBeTruthy();
    }
  }
});

const wave8Articles = [
  { file: 'gemini-desktop-navod-pro-ucitele.html', title: 'Gemini Desktop pro učitele: instalace a první kroky ve Windows', tocCount: 22, h2: '#wave8-gemini-desktop-navod-pro-ucitele-h2-01', h3: '#wave8-gemini-desktop-navod-pro-ucitele-h3-01', baselineSha: '815614650945db4c916f29a73c6444d00abe23c9', activeArea: 'Nástroje a asistenti', breadcrumb: 'Gemini pro učitele', breadcrumbHref: 'gemini-pro-ucitele.html', checkTocScroll: true },
  { file: 'gemini-notebook-navod-pro-ucitele.html', title: 'Gemini Notebook: jak si vytvořit sešit, který opravdu šetří práci', tocCount: 49, h2: '#ucel-potom-zdroje', h3: '#wave8-gemini-notebook-navod-pro-ucitele-h3-01', baselineSha: '815614650945db4c916f29a73c6444d00abe23c9', activeArea: 'Nástroje a asistenti', breadcrumb: 'Gemini Notebook', breadcrumbHref: 'gemini-notebook.html', checkTocScroll: true },
  { file: 'gemini-skills-pro-ucitele.html', title: 'Gemini Skills pro učitele: jednou nastavíte, pak už Gemini ví, jak má pracovat', tocCount: 43, h2: '#gemini-zaklady', h3: '#wave8-gemini-skills-pro-ucitele-h3-01', baselineSha: '815614650945db4c916f29a73c6444d00abe23c9', activeArea: 'Nástroje a asistenti', breadcrumb: 'Gemini pro učitele', breadcrumbHref: 'gemini-pro-ucitele.html', checkTocScroll: true },
  { file: 'gemini-storybook-navod-pro-ucitele.html', title: 'Gemini Storybook: jak vytvořit ilustrovaný příběh pro výuku', tocCount: 29, h2: '#kdy-storybook-pouzit', h3: '#wave8-gemini-storybook-navod-pro-ucitele-h3-01', baselineSha: '815614650945db4c916f29a73c6444d00abe23c9', activeArea: 'Nástroje a asistenti', breadcrumb: 'Gemini pro učitele', breadcrumbHref: 'gemini-pro-ucitele.html', checkTocScroll: true }
];
const wave8InteractiveArticles = [
  { file: 'gemini-notebook-navod-pro-ucitele.html', buttons: 2, details: 0, checkboxes: 0 },
  { file: 'gemini-skills-pro-ucitele.html', buttons: 11, details: 8, checkboxes: 8 },
  { file: 'gemini-storybook-navod-pro-ucitele.html', buttons: 3, details: 0, checkboxes: 0 }
];

const migrationArticles = [...wave1Articles, ...wave2Articles, ...wave3Articles, ...wave4Articles, ...wave5Articles, ...wave6Articles, ...wave7Articles, ...wave8Articles];

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
        await expect(page.locator('.site-header')).toHaveCount(1);
        await expect(page.locator('.menu-toggle')).toHaveCount(1);
        await expect(page.locator('.brand')).toHaveAttribute('href', 'index.html');
        await expect(page.locator('.brand-symbol')).toBeVisible();
        await expect(page.locator('.site-nav-pilot details')).toHaveCount(6);
        await expect(page.locator('.site-nav-pilot details[data-active="true"] > summary'))
          .toHaveText(article.activeArea || 'Tvořit s AI');
        await expect(page.locator('.site-breadcrumbs li')).toHaveCount(3);
        await expect(page.locator('.site-breadcrumbs li').nth(0)).toContainText('Domů');
        await expect(page.locator('.site-breadcrumbs li').nth(1)).toHaveText(article.breadcrumb || 'AI agenti');
        await expect(page.locator('.site-breadcrumbs li').nth(1).locator('a')).toHaveAttribute('href', article.breadcrumbHref || 'ai-agenti.html');
        await expect(page.locator('.site-breadcrumbs li').nth(2)).toHaveAttribute('aria-current', 'page');
        await expect(page.locator('.site-breadcrumbs li').nth(2)).toHaveText(article.title);
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
            imageStatus: [...document.querySelectorAll('.article-figure img')].map(img => ({
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
        await expect(page.locator('.article-content-navigation a[aria-current="location"]'))
          .toHaveAttribute('href', fragment);
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
      for (const id of before.publicAnchorIds) expect(after.ids, `lost public article anchor: ${id}`).toContain(id);
      const lostIds = before.ids.filter(id => !after.ids.includes(id));
      expect(lostIds.sort(), 'only explicitly documented internal IDs from the removed TOC label may disappear')
        .toEqual([...(article.legacyInternalIds || [])].sort());
    });
  });
}

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
    const stem = article.file.replace(/\\.html$/, '');
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
      const visual = style.find(x => x.selector === '.tool-guide-hero-visual');
      expect(shell.backgroundImage).toContain('linear-gradient');
      expect(shell.backgroundImage).not.toMatch(/url\(/i);
      expect(shell.backgroundColor).toBe('rgba(0, 0, 0, 0)');
      if (visual) {
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

