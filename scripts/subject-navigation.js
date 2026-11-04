'use strict';

// The subject hubs use the same header layout and link groups as the 2.0
// catalog directories, not the legacy .nav/.nav-links site menu.
const SUBJECTS = [
  { id: 'matematika', label: 'Matematika', file: 'matematika.html' },
  { id: 'cestina', label: 'Čeština', file: 'cestina.html' },
  { id: 'anglictina', label: 'Angličtina', file: 'anglictina.html' },
  { id: 'prirodoveda', label: 'Přírodní vědy', file: 'prirodoveda.html' },
  { id: 'dejepis', label: 'Dějepis', file: 'dejepis.html' }
];

const TOOLS = [
  { href: 'prompty.html', label: 'Knihovna promptů' },
  { href: 'asistenti.html', label: 'AI asistenti' },
  { href: 'aktivity.html', label: 'Výukové aktivity' },
  { href: 'vibe-coding.html', label: 'Vibe coding' },
  { href: 'qr-kod.html', label: 'Generátor QR kódů' }
];

function subjectLinks(currentId) {
  return SUBJECTS.map(subject =>
    '            <a href="' + subject.file + '"' +
    (subject.id === currentId ? ' aria-current="page"' : '') + '>' +
    subject.label + '</a>'
  ).join('\n');
}

function toolLinks(currentHref) {
  return TOOLS.map(tool =>
    '            <a href="' + tool.href + '"' + (tool.href === currentHref ? ' aria-current="page"' : '') + '>' + tool.label + '</a>'
  ).join('\n');
}

function buildNavigation(currentId, currentToolHref) {
  return [
    '    <header class="site-header">',
    '      <div class="site-header-inner">',
    '        <a class="brand" href="index.html" aria-label="AI ve Výuce – úvodní stránka">',
    '          <img class="brand-logo" src="images/ai-assistant-book-logo.png" width="44" height="42" alt="">',
    '          <span>AI ve Výuce</span>',
    '        </a>',
    '        <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">Navigace</button>',
    '        <nav id="primary-nav" class="primary-nav" aria-label="Hlavní navigace">',
    '          <a href="index.html">Úvod</a>',
    '          <a href="ai.html">AI obsah</a>',
    '          <a href="ai-navody.html">Praktické návody</a>',
    '          <a href="ai-novinky.html">Novinky</a>',
    '          <details class="nav-group subject-nav-group">',
    '            <summary>Předměty</summary>',
    '            <div class="nav-panel">',
    subjectLinks(currentId),
    '            </div>',
    '          </details>',
    '          <details class="nav-group">',
    '            <summary>Nástroje a aktivity</summary>',
    '            <div class="nav-panel">',
    toolLinks(currentToolHref),
    '            </div>',
    '          </details>',
    '        </nav>',
    '      </div>',
    '    </header>'
  ].join('\n');
}

function buildSubjectNavigation(currentId) {
  if (!SUBJECTS.some(subject => subject.id === currentId)) throw new Error('Unknown subject: ' + currentId);
  return buildNavigation(currentId);
}

function buildActivityNavigation() { return buildNavigation(null, 'aktivity.html'); }

module.exports = { SUBJECTS, TOOLS, buildSubjectNavigation, buildActivityNavigation };
