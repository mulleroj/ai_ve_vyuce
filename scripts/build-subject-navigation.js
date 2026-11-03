const fs = require('fs');
const path = require('path');
const { buildSubjectNavigation } = require('./subject-navigation');

const ROOT = path.resolve(__dirname, '..');
const PILOT_PAGES = ['anglictina', 'matematika'];

function renderPage(file, subjectId) {
    const filePath = path.join(ROOT, file);
    const html = fs.readFileSync(filePath, 'utf8');
    const start = html.indexOf('<nav class="nav" id="nav"');
    const end = html.indexOf('<section class="page-hero"', start);
    if (start === -1 || end === -1 || end < start) throw new Error(`${file}: shared subject navigation boundaries are missing`);
    const regionStart = html.lastIndexOf('\n', start) + 1;
    const heroComment = subjectId === 'matematika' ? '    <!-- Page Hero -->\n' : '';
    const expected = `${buildSubjectNavigation(subjectId)}\n${heroComment}    `;
    const updated = `${html.slice(0, regionStart)}${expected}${html.slice(end)}`;
    return { file, filePath, html, updated };
}

function main() {
    const args = process.argv.slice(2);
    if (args.some(arg => arg !== '--check')) throw new Error(`Unknown argument: ${args.find(arg => arg !== '--check')}`);
    const checkOnly = args.includes('--check');
    let driftCount = 0;
    PILOT_PAGES.forEach(subjectId => {
        const result = renderPage(`${subjectId}.html`, subjectId);
        const drift = result.updated !== result.html;
        console.log(`${result.file}: ${drift ? 'DRIFT' : 'OK'}`);
        if (drift && checkOnly) driftCount += 1;
        if (drift && !checkOnly) fs.writeFileSync(result.filePath, result.updated, 'utf8');
    });
    if (driftCount) throw new Error(`${driftCount} subject navigation page(s) are out of date`);
}

if (require.main === module) {
    try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}

module.exports = { PILOT_PAGES, renderPage };
