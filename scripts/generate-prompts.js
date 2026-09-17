const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'prompts.json');
const HTML_PATH = path.join(ROOT, 'matematika.html');
const START_MARKER = '<!-- GENERATED:PROMPTS:START -->';
const END_MARKER = '<!-- GENERATED:PROMPTS:END -->';
const TARGET_PAGE = 'matematika.html';
const TARGET_COLLECTION = 'matematika';

// The prompt text is canonical in data/prompts.json. The marked region in
// matematika.html is a derived static build artifact and must not be edited manually.

const TOOL_BADGE_CLASSES = {
    ChatGPT: 'badge-gold',
    Gemini: 'badge-mint',
    Claude: 'badge-purple'
};

const CATEGORY_BADGE_CLASSES = {
    Generování: 'badge-blue',
    Vysvětlení: 'badge-green',
    Testy: 'badge-orange',
    Diferenciace: 'badge-pink'
};

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    }[character]));
}

function fail(message) {
    console.error(`Prompt generation ERROR: ${message}`);
    process.exitCode = 1;
}

function readPrompts() {
    let prompts;
    try {
        prompts = JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
    } catch (error) {
        throw new Error(`cannot read ${path.relative(ROOT, DATA_PATH)} (${error.message})`);
    }
    if (!Array.isArray(prompts)) throw new Error('data/prompts.json must contain an array');

    const seenIds = new Set();
    prompts.forEach((prompt, index) => {
        const label = `record ${index + 1}`;
        if (!prompt || typeof prompt !== 'object') throw new Error(`${label} must be an object`);
        ['id', 'title', 'prompt', 'sourcePage'].forEach((field) => {
            if (typeof prompt[field] !== 'string' || !prompt[field].trim()) {
                throw new Error(`${label} requires non-empty ${field}`);
            }
        });
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(prompt.id)) {
            throw new Error(`${label} has invalid stable id: ${prompt.id}`);
        }
        if (seenIds.has(prompt.id)) throw new Error(`duplicate prompt id: ${prompt.id}`);
        seenIds.add(prompt.id);
        if (prompt.lead !== undefined && typeof prompt.lead !== 'string') {
            throw new Error(`${label} lead must be a string when present`);
        }
        ['subjects', 'levels', 'tools', 'collections', 'tags'].forEach((field) => {
            if (!Array.isArray(prompt[field])) throw new Error(`${label} requires array ${field}`);
        });
    });
    return prompts;
}

function renderBadge(label, badgeClass) {
    return `<span class="badge ${badgeClass}">${escapeHtml(label)}</span>`;
}

function renderCard(prompt, newline) {
    const toolBadges = prompt.tools
        .map((tool) => renderBadge(tool, TOOL_BADGE_CLASSES[tool] || 'badge-gray'))
        .join('');
    const lead = prompt.lead
        ? `${newline}                                <div class="prompt-lead">${escapeHtml(prompt.lead)}</div>`
        : '';
    const lines = [
        `                    <div id="prompt-${escapeHtml(prompt.id)}" class="prompt-card reveal">`,
        '                        <div class="prompt-header">',
        '                            <div>',
        `                                <div class="prompt-title">${escapeHtml(prompt.title)}</div>${lead}`,
        `                                <div style="display:flex;gap:6px;margin-top:6px">${toolBadges}</div>`,
        '                            </div>',
        '                        </div>',
        `                        <div class="prompt-body">${escapeHtml(prompt.prompt)}</div>`,
        '                        <div class="prompt-footer">'
    ];
    if (prompt.category) {
        lines.push(`                            <span class="badge ${CATEGORY_BADGE_CLASSES[prompt.category] || 'badge-gray'}">${escapeHtml(prompt.category)}</span>`);
    }
    lines.push(
        '                            <button class="copy-btn" type="button">📋 Kopírovat</button>',
        '                        </div>',
        '                    </div>'
    );
    return lines.join(newline);
}

function buildExpectedRegion(newline, endIndent) {
    const prompts = readPrompts().filter((prompt) => (
        prompt.sourcePage === TARGET_PAGE && prompt.collections.includes(TARGET_COLLECTION)
    ));
    if (prompts.length !== 4) {
        throw new Error(`expected exactly 4 pilot prompts for ${TARGET_PAGE}, found ${prompts.length}`);
    }
    return `${newline}${prompts.map((prompt) => renderCard(prompt, newline)).join(newline)}${newline}${endIndent}`;
}

function replaceGeneratedRegion(html, expectedRegion) {
    const start = html.indexOf(START_MARKER);
    const end = html.indexOf(END_MARKER);
    if (start === -1 || end === -1 || end < start) {
        throw new Error('generated markers are missing or out of order');
    }
    if (html.indexOf(START_MARKER, start + START_MARKER.length) !== -1 ||
        html.indexOf(END_MARKER, end + END_MARKER.length) !== -1) {
        throw new Error('generated markers must occur exactly once');
    }
    return html.slice(0, start + START_MARKER.length) + expectedRegion + html.slice(end);
}

function main() {
    const checkOnly = process.argv.includes('--check');
    if (process.argv.length > 3 || (process.argv.length === 3 && !checkOnly)) {
        throw new Error('usage: node scripts/generate-prompts.js [--check]');
    }
    const html = fs.readFileSync(HTML_PATH, 'utf8');
    const newline = html.includes('\r\n') ? '\r\n' : '\n';
    const start = html.indexOf(START_MARKER);
    const end = html.indexOf(END_MARKER);
    if (start === -1 || end === -1 || end < start) {
        throw new Error('generated markers are missing or out of order');
    }
    const lastNewline = html.lastIndexOf('\n', end);
    const endIndent = html.slice(lastNewline + 1, end);
    if (!/^\s*$/.test(endIndent)) throw new Error('end marker must be on its own indented line');
    const expectedRegion = buildExpectedRegion(newline, endIndent);
    const currentRegion = html.slice(start + START_MARKER.length, end);
    const drift = currentRegion !== expectedRegion;

    console.log('Prompt generation check');
    console.log('-----------------------');
    console.log(`matematika.html: ${drift ? 'DRIFT' : 'OK'}`);
    console.log('Prompts: 4');
    console.log(`Drift: ${drift ? 1 : 0}`);

    if (checkOnly) {
        if (drift) process.exitCode = 1;
        return;
    }
    if (drift) fs.writeFileSync(HTML_PATH, replaceGeneratedRegion(html, expectedRegion), 'utf8');
}

try {
    main();
} catch (error) {
    fail(error.message);
}
