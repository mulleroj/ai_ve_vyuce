const { test, expect } = require('@playwright/test');
const axeCore = require('axe-core');
const fs = require('node:fs');
const path = require('node:path');
const { PAGE_FILES, snapshot } = require('../scripts/assistant-pages-baseline');
const baseline = require('./fixtures/assistant-pages-wave22-baseline.json');

const BASE_URL = 'http://127.0.0.1:4173';
const BASELINE_DIR = process.env.ASSISTANT_WAVE22_BASELINE_DIR;
const widths = [320, 390, 620, 621, 768, 799, 800, 801, 900, 901, 1024, 1100, 1101, 1440];
const evidence = {
  baselineSha: baseline.baselineSha,
  testedSha: process.env.TESTED_SHA || 'unknown',
  pages: [],
  screenshots: [],
  baselineOverflow: [],
  contrast: {},
  accessibilityBefore: {
    asistenti: { 'color-contrast': 37, 'label-content-name-mismatch': 6 },
    'katalog-asistenti': { 'color-contrast': 13, 'label-content-name-mismatch': 1 }
  },
  accessibilityAfter: []
};

function contentContract(page) {
  const { noJavaScript, withJavaScript, publicIds, ...contract } = page;
  return contract;
}

function contrastRatio(foreground, background) {
  const luminance = color => {
    const channels = color.match(/[\da-f]{2}/gi).map(channel => parseInt(channel, 16) / 255)
      .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4);
    return .2126 * channels[0] + .7152 * channels[1] + .0722 * channels[2];
  };
  const a = luminance(foreground);
  const b = luminance(background);
  return (Math.max(a, b) + .05) / (Math.min(a, b) + .05);
}

test('wave 22 baseline fixture preserves both pages and the complete content contract', async () => {
  expect(baseline.baselineSha).toBe('2ddaab92e024cd4bafb638f9ea0e62835ef10d27');
  expect(Object.keys(baseline.pages)).toEqual(PAGE_FILES);

  for (const file of PAGE_FILES) {
    const actual = snapshot(file, fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8'));
    const expected = baseline.pages[file];
    expect(actual.cards, file + ' card count and content order').toHaveLength(file === 'asistenti.html' ? 9 : 2);
    expect(contentContract(actual), file + ' baseline content, SEO, imagery, links, navigation, and scripts')
      .toEqual(contentContract(expected));
    for (const id of expected.publicIds) expect(actual.publicIds, file + ' public ID ' + id).toContain(id);
  }
});

test('wave 22 fixes the exact 320px overflow present at the PR 75 baseline', async ({ page }) => {
  expect(BASELINE_DIR, 'workflow must stage HTML from exact baseline commit').toBeTruthy();
  fs.mkdirSync('artifacts', { recursive: true });
  const overflowEvidence = [];

  for (const file of PAGE_FILES) {
    const baselineHtml = fs.readFileSync(path.join(BASELINE_DIR, file), 'utf8');
    await page.route(url => {
      const parsed = new URL(url);
      return parsed.pathname.endsWith('/' + file) && parsed.searchParams.has('wave22-baseline');
    }, route => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: baselineHtml }));
    await page.setViewportSize({ width: 320, height: 900 });
    await page.goto(BASE_URL + '/' + file + '?wave22-baseline=1');
    await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; }' });
    await page.evaluate(() => document.fonts.ready);
    const before = await page.evaluate(() => {
      const selector = element => {
        if (element.id) return '#' + element.id;
        const classes = [...element.classList].slice(0, 3).map(value => '.' + value).join('');
        return element.tagName.toLowerCase() + classes;
      };
      const offenders = [...document.body.querySelectorAll('*')].map(element => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return { selector: selector(element), right: Math.round(rect.right * 10) / 10, width: Math.round(rect.width * 10) / 10, scrollWidth: element.scrollWidth, clientWidth: element.clientWidth, overflowX: style.overflowX };
      }).filter(item => item.right > innerWidth + 1 && item.width > 0)
        .sort((a, b) => b.right - a.right).slice(0, 15);
      return { viewportWidth: innerWidth, documentWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth, offenders };
    });
    expect(before.documentWidth, file + ' baseline really has recorded 320px overflow').toBeGreaterThan(320);
    const slug = file.replace('.html', '');
    const screenshot = 'artifacts/assistant-' + slug + '-baseline-320.png';
    await page.screenshot({ path: screenshot, fullPage: true });
    evidence.screenshots.push(screenshot);

    await page.unrouteAll({ behavior: 'wait' });
    await page.goto(BASE_URL + '/' + file);
    const after = await page.evaluate(() => ({ viewportWidth: innerWidth, documentWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth }));
    expect(after.documentWidth, file + ' repaired document width').toBeLessThanOrEqual(321);
    expect(after.bodyWidth, file + ' repaired body width').toBeLessThanOrEqual(321);
    overflowEvidence.push({ file, before, after });
  }

  evidence.baselineOverflow = overflowEvidence;
  console.log('Wave 22 baseline overflow diagnosis: ' + JSON.stringify(overflowEvidence));
  fs.writeFileSync('artifacts/assistant-pages-wave22-overflow.json', JSON.stringify(overflowEvidence, null, 2) + '\n');
});

test('assistant pages retain accessible landmarks, keyboard controls, filters, and responsive layouts', async ({ page, browser }) => {
  fs.mkdirSync('artifacts', { recursive: true });
  const localErrors = [];
  page.on('pageerror', error => localErrors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith(BASE_URL) && response.status() >= 400) localErrors.push('HTTP ' + response.status() + ' ' + response.url());
  });

  const contrast = {
    heroInkOnAllGradientStops: ['#edf5e9', '#fbf8ef', '#eaf4ef'].map(color => contrastRatio('#18332a', color)),
    heroLeadOnAllGradientStops: ['#edf5e9', '#fbf8ef', '#eaf4ef'].map(color => contrastRatio('#40594f', color)),
    footerMutedOnLightFooter: contrastRatio('#4f665d', '#f0f3e9'),
    primaryButtonWhiteOnGreen: contrastRatio('#ffffff', '#075c3f'),
    filterWhiteOnGreen: contrastRatio('#ffffff', '#075c3f')
  };
  evidence.contrast = contrast;
  expect(Math.min(...contrast.heroInkOnAllGradientStops)).toBeGreaterThanOrEqual(4.5);
  expect(Math.min(...contrast.heroLeadOnAllGradientStops)).toBeGreaterThanOrEqual(4.5);
  expect(contrast.footerMutedOnLightFooter).toBeGreaterThanOrEqual(4.5);
  expect(contrast.primaryButtonWhiteOnGreen).toBeGreaterThanOrEqual(4.5);

  for (const file of PAGE_FILES) {
    const slug = file.replace('.html', '');
    await page.setViewportSize({ width: 1440, height: 1000 });
    const response = await page.goto(BASE_URL + '/' + file);
    if (await page.locator('main').count() === 0) {
      console.log('Wave 22 page response diagnostic: ' + JSON.stringify({ file, status: response?.status(), url: page.url(), title: await page.title(), body: (await page.locator('body').innerText()).slice(0, 500) }));
    }
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('body > header.site-header')).toHaveCount(1);
    await expect(page.locator('body > main.assistant-directory-main')).toHaveCount(1);
    await expect(page.locator('body > footer.footer')).toHaveCount(1);
    await expect(page.locator('main header, main footer')).toHaveCount(0);
    await expect(page.locator('a.skip-link')).toHaveAttribute('href', '#obsah');
    await expect(page.locator('main#obsah')).toHaveCount(1);
    await expect(page.locator('main#obsah')).toHaveAttribute('tabindex', '-1');
    await expect(page.locator('.site-nav > .brand')).not.toHaveAttribute('aria-label');
    await expect(page.locator('nav[aria-label="Hlavní navigace"]')).toHaveCount(1);
    await expect(page.locator('[data-site-navigation]')).toHaveCount(1);

    const expectedCards = file === 'asistenti.html' ? 9 : 2;
    await expect(page.locator(file === 'asistenti.html' ? '.assistant-card' : '.catalog-card')).toHaveCount(expectedCards);
    const ids = await page.locator('[id]').evaluateAll(nodes => nodes.map(node => node.id));
    for (const id of baseline.pages[file].publicIds) expect(ids, file + ' preserved public ID ' + id).toContain(id);

    const brokenLinks = [];
    for (const link of baseline.pages[file].links) {
      const href = link.href || '';
      if (!href || href.startsWith('#') || /^(https?:|mailto:|tel:|javascript:)/i.test(href)) continue;
      const target = decodeURIComponent(href.split(/[?#]/)[0]);
      if (target && !fs.existsSync(path.resolve(__dirname, '..', target))) brokenLinks.push(href);
    }
    expect(brokenLinks, file + ' local links').toEqual([]);

    const visual = await page.evaluate(() => ({
      background: getComputedStyle(document.body).backgroundColor,
      headerBackground: getComputedStyle(document.querySelector('.site-header')).backgroundColor,
      heroBackground: getComputedStyle(document.querySelector('.page-hero')).backgroundImage,
      cardBackground: getComputedStyle(document.querySelector('.assistant-card, .catalog-card')).backgroundColor,
      footerBackground: getComputedStyle(document.querySelector('.footer')).backgroundColor
    }));
    expect(visual.background).toBe('rgb(251, 248, 239)');
    expect(visual.headerBackground).toBe('rgb(255, 255, 255)');
    expect(visual.heroBackground).toContain('linear-gradient');
    expect(visual.cardBackground).toBe('rgb(255, 254, 250)');
    expect(visual.footerBackground).toBe('rgb(240, 243, 233)');
    const pageEvidence = { file, cards: expectedCards, visual, widths: [], axe: null, keyboard: {} };

    await page.screenshot({ path: 'artifacts/assistant-' + slug + '-desktop-1440.png', fullPage: true });
    evidence.screenshots.push('artifacts/assistant-' + slug + '-desktop-1440.png');
    const navArea = page.locator('.site-nav-area').first();
    await expect(page.locator('.site-nav-area')).toHaveCount(6);
    await navArea.locator('summary').click();
    await expect(navArea).toHaveAttribute('open', '');
    await page.screenshot({ path: 'artifacts/assistant-' + slug + '-desktop-navigation-open.png' });
    evidence.screenshots.push('artifacts/assistant-' + slug + '-desktop-navigation-open.png');
    await navArea.locator('summary').click();

    for (const width of widths) {
      await page.setViewportSize({ width, height: width <= 390 ? 844 : 960 });
      const geometry = await page.evaluate(() => ({
        viewport: innerWidth,
        document: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        menuVisible: getComputedStyle(document.querySelector('.menu-toggle')).display !== 'none',
        header: document.querySelector('.site-header').getBoundingClientRect().width
      }));
      pageEvidence.widths.push(geometry);
      expect(geometry.document, file + ' no document overflow at ' + width + 'px').toBeLessThanOrEqual(width + 1);
      expect(geometry.body, file + ' no body overflow at ' + width + 'px').toBeLessThanOrEqual(width + 1);
      expect(geometry.menuVisible, file + ' navigation breakpoint at ' + width + 'px').toBe(width <= 800);
      if ([320, 390, 768, 799, 800, 801, 1024, 1440].includes(width)) {
        const screenshot = 'artifacts/assistant-' + slug + '-viewport-' + width + '.png';
        await page.screenshot({ path: screenshot, fullPage: width <= 390 });
        evidence.screenshots.push(screenshot);
      }
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL + '/' + file);
    await page.keyboard.press('Tab');
    await expect(page.locator('.skip-link')).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/#obsah$/);
    await expect(page.locator('main')).toBeFocused();
    pageEvidence.keyboard.skipLink = true;

    await page.goto(BASE_URL + '/' + file);
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    const menu = page.locator('.menu-toggle');
    await expect(menu).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(menu).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#primary-menu')).toBeVisible();
    const mobileShot = 'artifacts/assistant-' + slug + '-mobile-menu-390.png';
    await page.screenshot({ path: mobileShot, fullPage: true });
    evidence.screenshots.push(mobileShot);
    const mobileArea = page.locator('.site-nav-area').first();
    await mobileArea.locator('summary').press('Enter');
    await expect(mobileArea).toHaveAttribute('open', '');
    await page.screenshot({ path: 'artifacts/assistant-' + slug + '-mobile-navigation-open-390.png' });
    evidence.screenshots.push('artifacts/assistant-' + slug + '-mobile-navigation-open-390.png');
    await page.keyboard.press('Escape');
    await expect(mobileArea).not.toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(page.locator('#primary-menu')).toBeHidden();
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect(menu).toBeFocused();
    pageEvidence.keyboard.mobileMenu = true;

    if (file === 'katalog-asistenti.html') {
      await page.goto(BASE_URL + '/' + file);
      await expect(page.locator('.catalog-card:visible')).toHaveCount(2);
      await expect(page.locator('#emptyState')).toBeHidden();
      const counts = { all: 2, gpt: 1, gem: 2, claude: 1 };
      for (const [platform, count] of Object.entries(counts)) {
        const button = page.locator('.filter-btn[data-platform="' + platform + '"]');
        await button.click();
        await expect(button).toHaveAttribute('aria-pressed', 'true');
        await expect(page.locator('.catalog-card:visible')).toHaveCount(count);
        await expect(page.locator('#emptyState')).toBeHidden();
      }
      await page.locator('.filter-btn[data-platform="gem"]').click();
      const filterShot = 'artifacts/assistant-' + slug + '-filter-gem.png';
      await page.screenshot({ path: filterShot, fullPage: true });
      evidence.screenshots.push(filterShot);
      await page.locator('.catalog-card').evaluateAll(cards => cards.forEach(card => card.dataset.platform = 'none'));
      await page.locator('.filter-btn[data-platform="claude"]').click();
      await expect(page.locator('.catalog-card:visible')).toHaveCount(0);
      await expect(page.locator('#emptyState')).toBeVisible();

      const noJsContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
      const noJsPage = await noJsContext.newPage();
      await noJsPage.goto(BASE_URL + '/' + file);
      await expect(noJsPage.locator('.catalog-card:visible')).toHaveCount(2);
      await expect(noJsPage.locator('#emptyState')).toBeHidden();
      await expect(noJsPage.locator('#primary-menu')).toBeVisible();
      await expect(noJsPage.locator('#primary-menu a')).toHaveCount(6);
      const noJsOverflow = await noJsPage.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      expect(noJsOverflow, 'catalog without JS should not overflow horizontally').toBe(false);
      await noJsContext.close();
      pageEvidence.filters = counts;
      pageEvidence.emptyStateOnZeroResults = true;
      pageEvidence.noJavaScript = { cardsVisible: 2, emptyStateVisible: false, navigationLinks: 6 };
    } else {
      const noJsContext = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
      const noJsPage = await noJsContext.newPage();
      await noJsPage.goto(BASE_URL + '/' + file);
      await expect(noJsPage.locator('.assistant-card:visible')).toHaveCount(9);
      await expect(noJsPage.locator('#primary-menu')).toBeVisible();
      await expect(noJsPage.locator('#primary-menu a')).toHaveCount(6);
      const noJsOverflow = await noJsPage.evaluate(() => document.documentElement.scrollWidth > innerWidth);
      expect(noJsOverflow, 'directory without JS should not overflow horizontally').toBe(false);
      await noJsContext.close();
      pageEvidence.noJavaScript = { cardsVisible: 9, navigationLinks: 6 };
    }

    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(BASE_URL + '/' + file);
    await page.addScriptTag({ content: axeCore.source });
    const axe = await page.evaluate(async () => {
      const result = await window.axe.run(document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] } });
      return {
        passes: result.passes.length,
        violations: result.violations.map(rule => ({ id: rule.id, impact: rule.impact, count: rule.nodes.length, nodes: rule.nodes.map(node => ({ target: node.target, summary: node.failureSummary })) })),
        incomplete: result.incomplete.map(rule => ({ id: rule.id, impact: rule.impact, count: rule.nodes.length }))
      };
    });
    expect(axe.violations, file + ' axe WCAG violations').toEqual([]);
    pageEvidence.axe = axe;
    evidence.accessibilityAfter.push({ file, ...axe });
    await page.screenshot({ path: 'artifacts/assistant-' + slug + '-desktop-1440.png', fullPage: true });
    expect(localErrors, file + ' JavaScript errors and failed local resources').toEqual([]);
    evidence.pages.push(pageEvidence);
  }

  fs.writeFileSync('artifacts/assistant-pages-wave22-report.json', JSON.stringify(evidence, null, 2) + '\n');
});
