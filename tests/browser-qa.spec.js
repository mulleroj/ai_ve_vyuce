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
