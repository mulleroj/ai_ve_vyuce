const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');
const { BASELINE_SHA, PAGE_FILES, snapshot } = require('../scripts/capture-8o-baseline');
const baseline = require('./fixtures/pages-8o-baseline.json');

const BASE_URL = 'http://127.0.0.1:4173';
const WIDTHS = [320, 390, 768, 1024, 1440];
const SHARED_NAV_PAGES = [
  'index.html',
  'ai.html',
  'aktivity.html',
  'matematika.html',
  'katalog-asistenti.html',
  'prompty.html',
  'ai-navod-chatgpt-zacatek-bezpecne.html'
];
const evidence = {
  baselineSha: BASELINE_SHA,
  testedSha: process.env.TESTED_SHA || 'unknown',
  pages: [],
  sharedNavigation: [],
  screenshots: [],
  axe: [],
  consoleErrors: [],
  networkFailures: [],
  manualReview: []
};

test.beforeAll(() => fs.mkdirSync('artifacts/stability-8o', { recursive: true }));
test.afterAll(() => fs.writeFileSync('artifacts/stability-8o/technical-report.json', JSON.stringify(evidence, null, 2) + '\n'));

function textSnapshot(file, html, qrSource='') {
  const actual = snapshot(file, html, qrSource);
  if (file === 'qr-kod.html') actual.qrGenerator.scriptSha256 = null;
  return actual;
}
function normalizeText(value) { return String(value).replace(/\s+/g,' ').trim(); }

async function geometry(page) {
  return page.evaluate(() => {
    const offenders = [...document.body.querySelectorAll('*')].map(element => {
      if (element.closest('[aria-hidden="true"]')) return null;
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      if (!rect.width || !rect.height || style.display === 'none' || style.visibility === 'hidden') return null;
      let left = rect.left;
      let right = rect.right;
      for (let ancestor = element.parentElement; ancestor && ancestor !== document.documentElement; ancestor = ancestor.parentElement) {
        const ancestorStyle = getComputedStyle(ancestor);
        if (['hidden', 'clip', 'auto', 'scroll'].includes(ancestorStyle.overflowX)) {
          const clip = ancestor.getBoundingClientRect();
          left = Math.max(left, clip.left);
          right = Math.min(right, clip.right);
        }
      }
      if (right <= innerWidth + 1 && left >= -1) return null;
      let selector = element.tagName.toLowerCase();
      if (element.id) selector += '#' + element.id;
      if (element.classList.length) selector += '.' + [...element.classList].slice(0, 3).join('.');
      return { selector, left: Math.round(left * 10) / 10, right: Math.round(right * 10) / 10, width: Math.round((right - left) * 10) / 10, scrollWidth: element.scrollWidth, clientWidth: element.clientWidth, overflowX: style.overflowX };
    }).filter(Boolean).sort((a, b) => Math.max(b.right - innerWidth, -b.left) - Math.max(a.right - innerWidth, -a.left)).slice(0, 12);
    return { viewportWidth: innerWidth, documentWidth: document.documentElement.scrollWidth, bodyWidth: document.body.scrollWidth, offenders };
  });
}

async function settleVisualState(page) {
  await page.evaluate(() => {
    document.querySelectorAll('.reveal').forEach(element => element.classList.add('visible'));
    document.getAnimations({ subtree: true }).forEach(animation => {
      try { animation.finish(); } catch {}
    });
  });
  await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
}

test('8O baseline retains all three pages, metadata, links, prompts, forms, IDs, images and scripts', async () => {
  expect(baseline.baselineSha).toBe(BASELINE_SHA);
  expect(Object.keys(baseline.pages)).toEqual(PAGE_FILES);
  for (const file of PAGE_FILES) {
    const html = fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
    const qrSource = file === 'qr-kod.html' ? fs.readFileSync(path.resolve(__dirname, '..', 'js/qr-kod.js'), 'utf8') : '';
    const actual = textSnapshot(file, html, qrSource);
    const expected = structuredClone(baseline.pages[file]);
    if (file === 'qr-kod.html') {
      expected.qrGenerator.scriptSha256 = null;
      actual.qrGenerator.functionDeclarations = actual.qrGenerator.functionDeclarations.filter(name => expected.qrGenerator.functionDeclarations.includes(name));
      const brandLink = actual.links.find(link => link.href === 'index.html' && link.text.startsWith('AI ve výuce'));
      const baselineBrandLink = expected.links.find(link => link.href === 'index.html' && link.ariaLabel);
      expect(brandLink?.ariaLabel).toBeNull();
      if (brandLink && baselineBrandLink) brandLink.ariaLabel = baselineBrandLink.ariaLabel;
    }
    expect(actual, file + ' semantic baseline').toEqual(expected);
    for (const link of baseline.pages[file].links) {
      const href = link.href || '';
      if (!href || href.startsWith('#') || /^(https?:|mailto:|tel:|javascript:)/i.test(href)) continue;
      const target = decodeURIComponent(href.split(/[?#]/)[0]);
      if (target) expect(fs.existsSync(path.resolve(__dirname, '..', path.dirname(file), target)), file + ' link ' + href).toBe(true);
    }
    for (const image of baseline.pages[file].images) {
      const src = image.src || '';
      if (!src || /^(https?:|data:)/i.test(src)) continue;
      expect(fs.existsSync(path.resolve(__dirname, '..', path.dirname(file), src.split(/[?#]/)[0])), file + ' image ' + src).toBe(true);
    }
  }
  expect(baseline.pages['qr-kod.html'].qrGenerator.functionDeclarations).toEqual([
    'setError','normalizeUrl','clearResult','getOverlayType','updateOverlayOptions','getQrImage',
    'drawRoundedRect','drawTextOverlay','drawImageOverlay','getOverlay','renderQr','draw','downloadQrCode'
  ]);
});

test('8O target pages render at five widths with no document or element overflow and preserve relative assets', async ({ page }) => {
  const localErrors = [];
  const failures = [];
  const consoleErrors = [];
  const networkFailures = [];
  page.on('pageerror', error => localErrors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('requestfailed', request => networkFailures.push({ url:request.url(), error:request.failure()?.errorText || '' }));
  page.on('response', response => {
    if (response.url().startsWith(BASE_URL) && response.status() >= 400) failures.push(response.status() + ' ' + response.url());
  });

  for (const file of PAGE_FILES) {
    const pageEvidence = { file, widths: [], axe: null, keyboard: {}, screenshot: {} };
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: width <= 390 ? 860 : 1000 });
      await page.goto(BASE_URL + '/' + file, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);
      await settleVisualState(page);
      const measured = await geometry(page);
      pageEvidence.widths.push(measured);
      expect(measured.documentWidth, file + ' document overflow at ' + width + 'px: ' + JSON.stringify(measured.offenders)).toBeLessThanOrEqual(width + 1);
      expect(measured.bodyWidth, file + ' body overflow at ' + width + 'px: ' + JSON.stringify(measured.offenders)).toBeLessThanOrEqual(width + 1);
      expect(measured.offenders, file + ' visible element outside viewport at ' + width + 'px').toEqual([]);
      if ([320, 390, 768, 1024, 1440].includes(width)) {
        const shot = 'artifacts/stability-8o/' + file.replaceAll('/', '-') .replace('.html', '') + '-' + width + '.png';
        await page.screenshot({ path: shot, fullPage: width >= 1024 || width <= 390 });
        evidence.screenshots.push(shot);
        pageEvidence.screenshot[width] = shot;
      }
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL + '/' + file, { waitUntil: 'domcontentloaded' });
    await page.keyboard.press('Tab');
    const firstFocusable = await page.evaluate(() => {
      const element = document.activeElement;
      const style = getComputedStyle(element);
      return { tag: element.tagName, href: element.getAttribute('href'), outlineStyle: style.outlineStyle, outlineWidth: style.outlineWidth, outlineColor: style.outlineColor, boxShadow: style.boxShadow };
    });
    expect(firstFocusable.tag).not.toBe('BODY');
    expect(firstFocusable.outlineStyle !== 'none' || firstFocusable.boxShadow !== 'none', file + ' visible keyboard focus').toBe(true);
    pageEvidence.keyboard.firstFocusable = firstFocusable;

    if (file.startsWith('asistenti/')) {
      const copyButton = page.locator('.copy-btn').first();
      let found = false;
      for (let i = 0; i < 40; i++) {
        if (await copyButton.evaluate(element => document.activeElement === element)) { found = true; break; }
        await page.keyboard.press('Tab');
      }
      expect(found, file + ' copy button reachable from keyboard').toBe(true);
      const copyFocus = await copyButton.evaluate(element => ({ outline:getComputedStyle(element).outlineStyle, width:getComputedStyle(element).outlineWidth, color:getComputedStyle(element).outlineColor }));
      expect(copyFocus.outline).not.toBe('none');
      pageEvidence.keyboard.copyButton = copyFocus;
      await page.context().grantPermissions(['clipboard-read','clipboard-write'], { origin:BASE_URL });
      const expectedPrompt = await copyButton.evaluate(button => {
        const prompt = button.closest('.prompt-container').cloneNode(true);
        prompt.querySelector('.copy-btn')?.remove();
        return prompt.innerText || prompt.textContent;
      });
      await page.keyboard.press('Enter');
      await expect(copyButton).toContainText('Zkopírováno!', { timeout:3000 });
      const copiedPrompt = await page.evaluate(() => navigator.clipboard.readText());
      expect(normalizeText(copiedPrompt), file + ' keyboard copied prompt').toBe(normalizeText(expectedPrompt));
    }

    await settleVisualState(page);
    await page.addScriptTag({ path: require.resolve('axe-core') });
    const axeResult = await page.evaluate(async () => {
      const result = await axe.run(document);
      return {
        violations: result.violations.map(rule => ({ id:rule.id, impact:rule.impact, help:rule.help, nodes:rule.nodes.map(node => ({target:node.target, summary:node.failureSummary})) })),
        incomplete: result.incomplete.map(rule => ({ id:rule.id, impact:rule.impact, count:rule.nodes.length, targets:rule.nodes.map(node=>node.target) }))
      };
    });
    pageEvidence.axe = axeResult;
    evidence.axe.push({ file, ...axeResult });
    pageEvidence.localErrors = [...localErrors];
    pageEvidence.localFailures = [...failures];
    pageEvidence.consoleErrors = [...consoleErrors];
    pageEvidence.networkFailures = [...networkFailures];
    evidence.pages.push(pageEvidence);
  }
  expect(evidence.axe.filter(page => page.violations.length > 0), 'axe-core violations across the three target pages').toEqual([]);
  expect(localErrors).toEqual([]);
  expect(failures).toEqual([]);
  expect(consoleErrors).toEqual([]);
  expect(networkFailures.filter(item => item.url.startsWith(BASE_URL))).toEqual([]);
  evidence.consoleErrors.push(...consoleErrors.map(error => ({ scope:'target-pages', error })));
  evidence.networkFailures.push(...networkFailures.map(item => ({ scope:'target-pages', ...item })));
});

test('QR form validates input, creates a QR image, downloads PNG and preserves the entered value on errors', async ({ page }) => {
  const consoleErrors = [];
  const networkFailures = [];
  page.on('console', message => { if (message.type() === 'error') consoleErrors.push(message.text()); });
  page.on('requestfailed', request => networkFailures.push({ url:request.url(), error:request.failure()?.errorText || '' }));
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto(BASE_URL + '/qr-kod.html', { waitUntil: 'load' });
  await page.waitForFunction(() => typeof window.QRCode === 'function', null, { timeout: 15000 });
  const libraryLoaded = await page.evaluate(() => typeof window.QRCode === 'function');
  expect(libraryLoaded).toBe(true);
  const input = page.locator('#urlInput');
  const download = page.locator('#downloadQr');

  await input.fill('');
  await input.focus();
  await input.press('Enter');
  await expect.poll(() => input.evaluate(element => element.validity.valueMissing)).toBe(true);
  await expect(download).toBeDisabled();
  await expect(page.locator('#qrCode canvas')).toHaveCount(0);

  await input.fill('http://[');
  await input.press('Enter');
  await expect(page.locator('#qrError')).toContainText('platný formát');
  await expect(input).toHaveValue('http://[');
  await expect(download).toBeDisabled();

  const entered = 'https://example.com/skola?q=1';
  await input.fill(entered);
  await input.focus();
  const focus = await input.evaluate(element => ({ borderColor:getComputedStyle(element).borderColor, boxShadow:getComputedStyle(element).boxShadow }));
  expect(focus.boxShadow).not.toBe('none');
  await input.press('Enter');
  await expect(page.locator('#qrCode canvas')).toHaveCount(1);
  await expect(page.locator('#qrCode canvas')).toHaveAttribute('role', 'img');
  await expect(download).toBeEnabled();
  await expect(page.locator('#qrStatus')).toContainText('QR kód je připraven.');
  await expect(page.locator('#qrStatus')).toContainText(entered);

  const shot = 'artifacts/stability-8o/qr-kod-generated-desktop-1440.png';
  await page.screenshot({ path: shot, fullPage: true });
  evidence.screenshots.push(shot);
  const downloadEvent = page.waitForEvent('download');
  await download.focus();
  await page.keyboard.press('Enter');
  const downloaded = await downloadEvent;
  expect(downloaded.suggestedFilename()).toBe('qr-kod.png');
  const downloadedPath = await downloaded.path();
  const png = fs.readFileSync(downloadedPath);
  expect([...png.subarray(0, 8)]).toEqual([137,80,78,71,13,10,26,10]);

  await input.fill('http://[');
  await input.focus();
  await input.press('Enter');
  await expect(page.locator('#qrCode canvas')).toHaveCount(0);
  await expect(download).toBeDisabled();
  await expect(input).toHaveValue('http://[');
  evidence.qr = { libraryLoaded, validUrlGenerated:true, downloadedPngBytes:png.length, invalidInputRetained:true, emptyInputNativeValidation:true, consoleErrors, networkFailures };
  evidence.consoleErrors.push(...consoleErrors.map(error => ({ page:'qr-kod.html', error })));
  evidence.networkFailures.push(...networkFailures.map(item => ({ page:'qr-kod.html', ...item })));
  expect(consoleErrors).toEqual([]);
});

test('QR dependency failure reports an error, disables download and preserves form input', async ({ page }) => {
  const cdn = 'https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js';
  await page.route(cdn, route => route.abort('failed'));
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE_URL + '/qr-kod.html', { waitUntil: 'load' });
  const entered = 'https://example.com/when-cdn-is-down';
  await page.locator('#urlInput').fill(entered);
  await page.locator('#urlInput').focus();
  await page.locator('#urlInput').press('Enter');
  await expect(page.locator('#qrError')).toContainText('nenačetl');
  await expect(page.locator('#qrStatus')).toContainText('Zadaná adresa zůstává ve formuláři');
  await expect(page.locator('#urlInput')).toHaveValue(entered);
  await expect(page.locator('#qrCode canvas')).toHaveCount(0);
  await expect(page.locator('#downloadQr')).toBeDisabled();
  evidence.qrLibraryUnavailable = { errorShown:true, valuePreserved:true, falseSuccess:false, downloadDisabled:true };
});

test('no-JavaScript QR and assistant pages remain navigable and fit the mobile viewport', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled:false, viewport:{ width:320, height:844 } });
  const page = await context.newPage();
  for (const file of PAGE_FILES) {
    await page.goto(BASE_URL + '/' + file, { waitUntil:'domcontentloaded' });
    await page.waitForFunction(() => [...document.querySelectorAll('link[rel="stylesheet"]')]
      .filter(link => new URL(link.href).origin === location.origin)
      .every(link => Boolean(link.sheet)));
    const measured = await geometry(page);
    expect(measured.documentWidth, file + ' no-JS document overflow: ' + JSON.stringify(measured.offenders)).toBeLessThanOrEqual(321);
    expect(measured.bodyWidth, file + ' no-JS body overflow: ' + JSON.stringify(measured.offenders)).toBeLessThanOrEqual(321);
    expect(measured.offenders, file + ' no-JS element overflow').toEqual([]);
    await expect(page.locator('main')).toHaveCount(1);
    if (file === 'qr-kod.html') {
      await expect(page.locator('#urlInput')).toBeVisible();
      await expect(page.locator('#qrForm button[type="submit"]')).toBeVisible();
    } else {
      await expect(page.locator('#assistantPrompt')).toBeVisible();
    }
  }
  await context.close();
});

test('shared navigation still works across seven representative pages', async ({ page }) => {
  const checks = [];
  for (const file of SHARED_NAV_PAGES) {
    const item = { file, widths:[], mobileMenu:false };
    for (const width of WIDTHS) {
      await page.setViewportSize({ width, height: 900 });
      const response = await page.goto(BASE_URL + '/' + file, { waitUntil:'domcontentloaded' });
      expect(response?.status(), file + ' HTTP status').toBe(200);
      const nav = page.locator('body > header.site-header');
      await expect(nav, file + ' shared header').toHaveCount(1);
      await expect(nav.locator('nav[aria-label="Hlavní navigace"]')).toHaveCount(1);
      const measured = await geometry(page);
      item.widths.push(measured);
      expect(measured.documentWidth, file + ' navigation overflow at ' + width + 'px: ' + JSON.stringify(measured.offenders)).toBeLessThanOrEqual(width + 1);
      expect(measured.offenders, file + ' navigation element overflow at ' + width + 'px').toEqual([]);
      expect(await nav.locator('.menu-toggle').isVisible()).toBe(width <= 800);
    }
    await page.setViewportSize({ width:390, height:844 });
    await page.goto(BASE_URL + '/' + file, { waitUntil:'domcontentloaded' });
    const toggle = page.locator('body > header.site-header .menu-toggle');
    await toggle.focus();
    await expect(toggle).toBeFocused();
    const focusStyle = await toggle.evaluate(element => ({ outline:getComputedStyle(element).outlineStyle, width:getComputedStyle(element).outlineWidth, shadow:getComputedStyle(element).boxShadow }));
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded','true');
    await expect(page.locator('body > header.site-header .nav-content')).toBeVisible();
    item.mobileMenu = true;
    item.focusStyle = focusStyle;
    checks.push(item);
  }
  evidence.sharedNavigation = checks;
});

