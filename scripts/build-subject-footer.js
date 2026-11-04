'use strict';
const fs = require('node:fs');
const path = require('node:path');
const { buildSubjectFooter } = require('./subject-footer');

const ROOT = path.resolve(__dirname, '..');
const PAGES = ['anglictina.html', 'matematika.html'];
const normalise = text => text.replace(/\r\n?/g, '\n');

function renderPage(file) {
  const filename = path.join(ROOT, file);
  const html = fs.readFileSync(filename, 'utf8');
  const start = html.indexOf('<footer class="footer');
  if (start < 0) throw new Error(file + ': expected subject footer not found');
  const endStart = html.indexOf('</footer>', start);
  if (endStart < 0) throw new Error(file + ': footer closing tag missing');
  const end = endStart + '</footer>'.length;
  if (html.indexOf('<footer ', start + 7) >= 0 && html.indexOf('<footer ', start + 7) < end) {
    throw new Error(file + ': unexpected nested footer');
  }
  const indentStart = html.lastIndexOf('\n', start) + 1;
  const updated = html.slice(0, indentStart) + buildSubjectFooter() + html.slice(end);
  return { filename, html, updated };
}

function main() {
  const args = process.argv.slice(2);
  if (args.some(arg => arg !== '--check')) throw new Error('Unknown option: ' + args.join(' '));
  const check = args.includes('--check');
  let drift = 0;
  for (const file of PAGES) {
    const output = renderPage(file);
    const changed = normalise(output.html) !== normalise(output.updated);
    console.log(file + ': ' + (changed ? 'DRIFT' : 'OK'));
    if (changed && check) drift++;
    if (changed && !check) fs.writeFileSync(output.filename, output.updated, 'utf8');
  }
  if (drift) throw new Error(drift + ' subject footer(s) are stale');
}

if (require.main === module) {
  try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}

module.exports = { PAGES, renderPage };
