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
const migrationArticles = [...wave1Articles, ...wave2Articles, ...wave3Articles, ...wave4Articles];

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
          .toHaveText('Tvořit s AI');
        await expect(page.locator('.site-breadcrumbs li')).toHaveCount(3);
        await expect(page.locator('.site-breadcrumbs li').nth(0)).toContainText('Domů');
        await expect(page.locator('.site-breadcrumbs li').nth(1)).toHaveText('AI agenti');
        await expect(page.locator('.site-breadcrumbs li').nth(1).locator('a')).toHaveAttribute('href', 'ai-agenti.html');
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
      for (const id of before.ids) expect(after.ids, `lost original id: ${id}`).toContain(id);
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

test('original light pilot visual before and after comparison', async ({ page }) => {
  const article = wave4Articles.find(item => item.file === 'ai-agenti-co-je-ai-agent.html');
  const { execFileSync } = require('node:child_process');
  const baselineHTML = execFileSync('git', ['show', `${article.baselineSha}:${article.file}`], { encoding: 'utf8' });
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.setContent(baselineHTML.replace('</head>', `<base href="${baseURL}/"></head>`), { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const beforeGeometry = await page.locator('.workflow-hero').evaluate(el => {
    const box = el.getBoundingClientRect(), title = el.querySelector('h1'), style = getComputedStyle(title);
    return { width: box.width, height: box.height, titleFont: style.fontFamily, titleSize: style.fontSize, titleColor: style.color, text: title.innerText };
  });
  const before = await page.screenshot({ path: 'artifacts/ai-agenti-co-je-ai-agent-pilot-before.png' });
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
