const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const footerScriptName = 'site-footer.js';
const excludedFiles = new Set(['googled4301464bc8f67c5.html']);

function walk(directory) {
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const entryPath = path.join(directory, entry.name);
        if (entry.isDirectory()) return walk(entryPath);
        return entry.name.toLowerCase().endsWith('.html') ? [entryPath] : [];
    });
}

const failures = [];
const pages = walk(root).filter((filePath) => !excludedFiles.has(path.basename(filePath)));

for (const filePath of pages) {
    const relativePath = path.relative(root, filePath).replaceAll(path.sep, '/');
    const html = fs.readFileSync(filePath, 'utf8');
    if (!/<body\b/i.test(html)) continue;

    const scriptMatches = html.match(/<script\b[^>]*src=["']([^"']*site-footer\.js(?:\?[^"']*)?)["'][^>]*>/gi) || [];
    const footerCount = (html.match(/<footer\b/gi) || []).length;
    const expectedScript = path.relative(path.dirname(filePath), path.join(root, 'js', footerScriptName)).replaceAll(path.sep, '/');
    const hasExpectedScript = scriptMatches.some((tag) => tag.includes(expectedScript));

    if (scriptMatches.length !== 1 || !hasExpectedScript) {
        failures.push(`${relativePath}: expected exactly one ${expectedScript} script`);
    }

    if (footerCount > 1) {
        failures.push(`${relativePath}: expected at most one <footer>, found ${footerCount}`);
    }
}

if (failures.length > 0) {
    console.error('Site footer check failed:');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exitCode = 1;
} else {
    console.log(`Site footer check passed for ${pages.length} relevant HTML file(s).`);
}
