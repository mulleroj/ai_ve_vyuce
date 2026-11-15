const { test, expect } = require('@playwright/test');
const fs = require('node:fs');

const BASE_URL = 'http://127.0.0.1:4173';
const BASELINE_SHA = 'bfd39f3973d7139aeb4632ba7a74e94ab648f7bc';
const pages = [
  { file: 'anglictina.html', subject: 'Angličtina' },
  { file: 'cestina.html', subject: 'Čeština' },
  { file: 'dejepis.html', subject: 'Dějepis' },
  { file: 'matematika.html', subject: 'Matematika' },
  { file: 'prirodoveda.html', subject: 'Přírodní vědy' }
];
const widths = [320, 390, 420, 540, 541, 560, 561, 600, 601, 620, 621, 768, 769, 800, 801, 900, 901, 1050, 1051, 1100, 1101, 1440];
const evidence = {
  baselineSha: BASELINE_SHA,
  workflowTestedSha: process.env.TESTED_SHA || 'unknown',
  pages: [],
  screenshots: [],
  failures: [],
  findings: [],
  accessibility: []
};

test('subject pages: responsive rendering, menus, content, accessibility, and screenshots', async ({ page }) => {
  fs.mkdirSync('artifacts', { recursive: true });
  const localErrors = [];
  page.on('pageerror', error => localErrors.push(error.message));
  page.on('response', response => {
    if (response.url().startsWith(BASE_URL) && response.status() >= 400) {
      localErrors.push('HTTP ' + response.status() + ' ' + response.url());
    }
  });

  for (const item of pages) {
    const slug = item.file.replace('.html', '');
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(BASE_URL + '/' + item.file);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('nav[aria-label="Hlavní navigace"]')).toHaveCount(1);
    await expect(page.locator('[data-site-navigation]')).toHaveCount(1);
    await expect(page.locator('.site-nav-area')).toHaveCount(6);
    await expect(page.locator('.site-nav-area[data-area="teach"][data-active="true"]')).toHaveCount(1);
    await expect(page.locator('.menu-toggle')).toHaveCount(1);
    await expect(page.locator('.tab-btn')).toHaveCount(4);
    expect(await page.locator('.activity-card:visible').count()).toBeGreaterThan(0);
    await expect(page.locator('.subject-site-footer')).toHaveCount(1);

    const visual = await page.evaluate(() => {
      const hero = document.querySelector('.page-hero');
      const card = document.querySelector('.activity-card');
      const heading = document.querySelector('h1');
      const footer = document.querySelector('.subject-site-footer');
      return {
        bodyBackground: getComputedStyle(document.body).backgroundColor,
        heroBackgroundColor: getComputedStyle(hero).backgroundColor,
        heroBackgroundImage: getComputedStyle(hero).backgroundImage,
        headingFont: getComputedStyle(heading).fontFamily,
        headingColor: getComputedStyle(heading).color,
        cardBackground: card ? getComputedStyle(card).backgroundColor : null,
        cardTextColor: card ? getComputedStyle(card).color : null,
        footerBackground: getComputedStyle(footer).backgroundColor,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth: innerWidth
      };
    });
    const pageEvidence = { file: item.file, subject: item.subject, desktop: visual, hasMainLandmark: await page.locator('main, [role="main"]').count() > 0, breakpoints: [], accessibility: null };
    if (!pageEvidence.hasMainLandmark) evidence.findings.push(item.file + ': missing main landmark (<main> or role=main).');
    if (visual.bodyBackground !== 'rgb(247, 247, 241)') {
      evidence.failures.push(item.file + ': expected light page background, got ' + visual.bodyBackground);
    }
    if (!visual.heroBackgroundImage.includes('linear-gradient')) {
      evidence.failures.push(item.file + ': expected the light hero gradient, got ' + visual.heroBackgroundImage);
    }

    let shot = 'artifacts/subject-' + slug + '-desktop-1440.png';
    await page.screenshot({ path: shot, fullPage: true });
    evidence.screenshots.push(shot);

    // Open the shared subject navigation on desktop.
    const teach = page.locator('.site-nav-area[data-area="teach"]');
    await teach.locator('summary').click();
    await expect(teach).toHaveAttribute('open', '');
    await expect(teach.locator('a[href="' + item.file + '"]')).toHaveAttribute('aria-current', 'page');
    shot = 'artifacts/subject-' + slug + '-desktop-subject-navigation.png';
    await page.screenshot({ path: shot, fullPage: false });
    evidence.screenshots.push(shot);
    await teach.locator('summary').click();

    // Check responsive behavior at each relevant boundary.
    for (const width of widths) {
      await page.setViewportSize({ width, height: width <= 420 ? 860 : 960 });
      const geometry = await page.evaluate(() => {
        const header = document.querySelector('.site-header').getBoundingClientRect();
        const hero = document.querySelector('.page-hero').getBoundingClientRect();
        const grid = document.querySelector('.activity-grid')?.getBoundingClientRect();
        const toggle = document.querySelector('.menu-toggle');
        return {
          width: innerWidth,
          documentWidth: document.documentElement.scrollWidth,
          bodyWidth: document.body.scrollWidth,
          header: { left: header.left, right: header.right, height: header.height },
          hero: { left: hero.left, right: hero.right, top: hero.top, height: hero.height },
          grid: grid ? { left: grid.left, right: grid.right, width: grid.width } : null,
          menuToggleVisible: !!toggle && getComputedStyle(toggle).display !== 'none'
        };
      });
      pageEvidence.breakpoints.push(geometry);
      if (geometry.documentWidth > width + 1 || geometry.bodyWidth > width + 1) {
        evidence.failures.push(item.file + ': horizontal overflow at ' + width + 'px (document ' + geometry.documentWidth + 'px, body ' + geometry.bodyWidth + 'px)');
      }
      const shouldShowToggle = width <= 800;
      if (geometry.menuToggleVisible !== shouldShowToggle) {
        evidence.failures.push(item.file + ': menu toggle visibility mismatch at ' + width + 'px');
      }
      if ([768, 800, 801].includes(width) || (item.file === 'anglictina.html' && [420, 540, 541, 900, 901, 1050].includes(width))) {
        shot = 'artifacts/subject-' + slug + '-viewport-' + width + '.png';
        await page.screenshot({ path: shot, fullPage: false });
        evidence.screenshots.push(shot);
      }
    }

    // Capture the mobile view, footer, menu, and its subject submenu.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(BASE_URL + '/' + item.file);
    shot = 'artifacts/subject-' + slug + '-viewport-390.png';
    await page.screenshot({ path: shot, fullPage: false });
    evidence.screenshots.push(shot);
    await page.locator('.subject-site-footer').scrollIntoViewIfNeeded();
    shot = 'artifacts/subject-' + slug + '-mobile-footer-390.png';
    await page.screenshot({ path: shot, fullPage: false });
    evidence.screenshots.push(shot);
    await page.evaluate(() => window.scrollTo(0, 0));

    const toggle = page.locator('.menu-toggle');
    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(page.locator('#primary-menu')).toBeVisible();
    shot = 'artifacts/subject-' + slug + '-mobile-menu-390.png';
    await page.screenshot({ path: shot, fullPage: false });
    evidence.screenshots.push(shot);

    const mobileTeach = page.locator('.site-nav-area[data-area="teach"]');
    await mobileTeach.locator('summary').click();
    await expect(mobileTeach).toHaveAttribute('open', '');
    await expect(mobileTeach.locator('a[href="' + item.file + '"]')).toHaveAttribute('aria-current', 'page');
    shot = 'artifacts/subject-' + slug + '-mobile-subject-navigation-390.png';
    await page.screenshot({ path: shot, fullPage: false });
    evidence.screenshots.push(shot);
    await page.keyboard.press('Escape');
    await expect(mobileTeach).not.toHaveAttribute('open', '');
    await page.keyboard.press('Escape');
    await expect(page.locator('#primary-menu')).toBeHidden();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(toggle).toBeFocused();

    // Exercise all subject tabs and their target panels.
    for (const button of await page.locator('.tab-btn').all()) {
      const targetId = await button.getAttribute('aria-controls');
      await button.click();
      await expect(page.locator('#' + targetId)).toBeVisible();
      await expect(button).toHaveAttribute('aria-pressed', 'true');
    }

    // Run axe on the rendered page and retain all findings.
    await page.setViewportSize({ width: 1440, height: 1000 });
    await page.goto(BASE_URL + '/' + item.file);
    await page.addScriptTag({ content: require('axe-core').source });
    const axe = await page.evaluate(async () => {
      const result = await window.axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }
      });
      return {
        passes: result.passes.length,
        violations: result.violations.map(v => ({
          id: v.id,
          impact: v.impact,
          help: v.help,
          nodes: v.nodes.map(n => ({ target: n.target, summary: n.failureSummary }))
        }))
      };
    });
    pageEvidence.accessibility = axe;
    evidence.accessibility.push({ file: item.file, ...axe });
    expect(await page.locator('.activity-card:visible').count()).toBeGreaterThan(0);
    evidence.pages.push(pageEvidence);
  }

  // Verify the full shared navigation fallback without JavaScript.
  const noJs = await page.context().browser().newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 }
  });
  const noJsPage = await noJs.newPage();
  for (const item of pages) {
    await noJsPage.goto(BASE_URL + '/' + item.file);
    await expect(noJsPage.locator('[data-site-navigation] a')).toHaveCount(6);
    await expect(noJsPage.locator('[data-site-navigation] a[href="aktivity.html"]')).toBeVisible();
    const width = await noJsPage.evaluate(() => document.documentElement.scrollWidth);
    if (width > 391) evidence.failures.push(item.file + ': no-JS mobile overflow (' + width + 'px)');
  }
  await noJs.close();

  evidence.localErrors = localErrors;
  fs.writeFileSync('artifacts/subject-pages-visual-evidence.json', JSON.stringify(evidence, null, 2));
  const reportLines = [
    '# Subject pages visual audit',
    '',
    'Reference SHA: ' + BASELINE_SHA,
    'Audit workflow SHA: ' + evidence.workflowTestedSha,
    'Pages checked: ' + evidence.pages.length,
    'Screenshots captured: ' + evidence.screenshots.length,
    'Responsive geometry widths: ' + widths.join(', ') + ' px',
    'Horizontal overflow / menu failures: ' + (evidence.failures.length ? evidence.failures.join('; ') : 'none'),
    '',
    '## Confirmed findings',
    '',
    ...(evidence.findings.length ? evidence.findings.map(x => '- ' + x) : ['- None recorded.']),
    '',
    '## Axe findings',
    '',
    ...evidence.accessibility.flatMap(p => p.violations.map(v => '- ' + p.file + ': ' + v.impact + ' — ' + v.id + ' — ' + v.help)),
    '',
    'Full geometry, computed styles, axe targets, and screenshot filenames are in subject-pages-visual-evidence.json.'
  ];
  fs.writeFileSync('artifacts/subject-pages-visual-report.md', reportLines.join('\n') + '\n');
  expect(evidence.failures, evidence.failures.join('\n')).toEqual([]);
  expect(localErrors, localErrors.join('\n')).toEqual([]);
});
