const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const checkOnly = process.argv.includes('--check');
const navigation = fs.readFileSync(path.join(root, 'templates/site-navigation.tpl'), 'utf8').replace(/\r\n/g, '\n').trim();
const pages = [
  { file: 'chatgpt-pro-ucitele.html', area: 'tools', productClass: true },
  { file: 'gemini-pro-ucitele.html', area: 'tools' },
  { file: 'claude-pro-ucitele.html', area: 'tools' },
  { file: 'vibe-coding-pro-ucitele.html', area: 'create' },
  { file: 'neplytvej-inteligenci-ai-modely.html', area: 'prepare' },
];

function assert(condition, file, message) {
  if (!condition) throw new Error(`${file}: ${message}`);
}

function toEol(text, eol) {
  return text.replace(/\r?\n/g, eol);
}

function verifyMigrated(html, page) {
  const file = page.file;
  const headers = [...html.matchAll(/<header class="site-header" id="top">[\s\S]*?<\/header>/g)];
  assert(headers.length === 1, file, 'expected exactly one shared site header');
  assert(toEol(headers[0][0], '\n').trim() === navigation, file, 'shared header differs from templates/site-navigation.tpl');
  assert((html.match(/data-site-navigation role="group"/g) || []).length === 1, file, 'expected exactly one navigation root');
  assert(html.includes(`data-site-navigation-area="${page.area}"`), file, 'wrong or missing active navigation area');
  assert((html.match(/css\/site-navigation\.css/g) || []).length === 1, file, 'expected one shared navigation stylesheet');
  assert((html.match(/js\/site-navigation-data\.js/g) || []).length === 1, file, 'expected one shared navigation data script');
  assert((html.match(/js\/site-navigation\.js/g) || []).length === 1, file, 'expected one shared navigation script');
  if (!page.productClass) {
    assert((html.match(/<section class="workflow-shell">/g) || []).length === 1, file, 'workflow hero must remain a separate content section');
    if (file === 'gemini-pro-ucitele.html') {
      assert(html.includes('<nav class="site-breadcrumbs" aria-label="Drobečková navigace">'), file, 'shared breadcrumb is missing');
      assert(html.includes('<a href="asistenti.html">AI asistenti</a>'), file, 'breadcrumb return target changed');
      assert(!html.includes('class="workflow-back"'), file, 'duplicate return control remains beside the breadcrumb');
    } else {
      assert(html.includes('class="workflow-back"'), file, 'original return link is missing');
    }
    assert(!html.includes('class="nav-logo"'), file, 'legacy duplicate logo remains in workflow header');
  }
  assert((html.match(/<h1\b/g) || []).length === 1, file, 'expected the original single page H1');
}

function migrate(html, page) {
  const file = page.file;
  const eol = html.includes('\r\n') ? '\r\n' : '\n';
  let changed = html;
  if (/<header class="site-header" id="top">/.test(changed)) {
    verifyMigrated(changed, page);
    return changed;
  }

  const bodyMatch = changed.match(/<body class="workflow-page(?: catalog-product-page)?">/);
  assert(bodyMatch, file, 'unknown body template');
  const bodyClass = `workflow-page${page.productClass ? ' catalog-product-page' : ''} site-navigation-enabled`;
  changed = changed.replace(bodyMatch[0], `<body class="${bodyClass}" data-site-navigation-area="${page.area}">`);

  if (!changed.includes('css/site-navigation.css')) {
    const workflowCss = /(<link rel="stylesheet" href="css\/workflow\.css[^\r\n]*\r?\n)/;
    assert(workflowCss.test(changed), file, 'expected workflow stylesheet link');
    changed = changed.replace(workflowCss, `$1    <link rel="stylesheet" href="css/site-navigation.css?v=20261109-7i" />${eol}`);
  }

  const sharedNav = toEol(navigation, eol);
  if (page.productClass) {
    const legacy = /    <header class="site-header">[\s\S]*?    <\/header>/;
    const old = changed.match(legacy)?.[0];
    assert(old && old.includes('site-header-inner') && old.includes('primary-nav') && old.includes('nav-toggle'), file, 'unrecognized ChatGPT header');
    changed = changed.replace(old, sharedNav);
  } else {
    const start = changed.indexOf('    <header class="workflow-shell">');
    const main = changed.indexOf('<main', start);
    assert(start >= 0 && main > start, file, 'workflow shell or main element missing');
    const segment = changed.slice(start, main);
    const topbar = segment.match(/<div class="workflow-topbar">[\s\S]*?<\/div>/)?.[0];
    const hero = segment.match(/<div class="workflow-hero">/);
    const closing = segment.lastIndexOf('</header>');
    const returnLink = topbar?.match(/<a class="workflow-back" href="[^"]+">[\s\S]*?<\/a>/)?.[0];
    assert(topbar && topbar.includes('class="nav-logo"') && returnLink && hero && closing >= 0, file, 'unrecognized workflow shell/header structure');
    let transformedSegment = segment.replace('    <header class="workflow-shell">', '    <section class="workflow-shell">');
    transformedSegment = transformedSegment.replace(topbar, `<div class="workflow-topbar">${eol}            ${returnLink}${eol}        </div>`);
    transformedSegment = transformedSegment.slice(0, closing) + '</section>' + transformedSegment.slice(closing + '</header>'.length);
    changed = `${changed.slice(0, start)}${sharedNav}${eol}${transformedSegment}${changed.slice(start + segment.length)}`;
  }

  if (!changed.includes('js/site-navigation-data.js')) {
    const footerScript = /    <script src="js\/site-footer\.js/;
    assert(footerScript.test(changed), file, 'site footer script insertion point missing');
    changed = changed.replace(footerScript, `    <script src="js/site-navigation-data.js?v=20261109-7i"></script>${eol}    <script src="js/site-navigation.js?v=20261109-7i"></script>${eol}$&`);
  }
  verifyMigrated(changed, page);
  return changed;
}

for (const page of pages) {
  const absolute = path.join(root, page.file);
  const original = fs.readFileSync(absolute, 'utf8');
  const result = checkOnly ? original : migrate(original, page);
  if (checkOnly) verifyMigrated(result, page);
  else if (result !== original) fs.writeFileSync(absolute, result);
  console.log(`${page.file}: ${checkOnly ? 'OK' : result === original ? 'unchanged (already migrated)' : 'migrated'}`);
}
