const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'prompts.json');
const START_MARKER = '<!-- GENERATED:PROMPTS:START -->';
const END_MARKER = '<!-- GENERATED:PROMPTS:END -->';
const TARGETS = [
    { page: 'matematika.html', collection: 'matematika' },
    { page: 'cestina.html', collection: 'cestina' },
    { page: 'anglictina.html', collection: 'anglictina' },
    { page: 'prirodoveda.html', collection: 'prirodoveda' },
    { page: 'dejepis.html', collection: 'dejepis' }
];
const TARGET_BY_PAGE = new Map(TARGETS.map((target) => [target.page, target]));

// The prompt text is canonical in data/prompts.json. The marked regions in
// the subject pages are derived static build artifacts and must not be edited manually.

const TOOL_BADGE_CLASSES = {
    ChatGPT: 'badge-gold',
    Gemini: 'badge-mint',
    Claude: 'badge-purple'
};

const CATEGORY_BADGE_CLASSES = {
    Generování: 'badge-blue',
    Vysvětlení: 'badge-green',
    Testy: 'badge-orange',
    Diferenciace: 'badge-pink',
    Opravování: 'badge-blue',
    Diktáty: 'badge-green',
    Literatura: 'badge-orange',
    Sloh: 'badge-pink',
    Konverzace: 'badge-mint',
    Gramatika: 'badge-blue',
    Eseje: 'badge-orange',
    Slovíčka: 'badge-green',
    Experimenty: 'badge-green',
    Kvízy: 'badge-orange',
    Projekty: 'badge-pink',
    Roleplay: 'badge-purple',
    Analýza: 'badge-blue',
    Debata: 'badge-green',
    'Kreativní psaní': 'badge-orange'
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
        if (!TARGET_BY_PAGE.has(prompt.sourcePage)) {
            throw new Error(`${label} has unknown sourcePage: ${prompt.sourcePage}`);
        }
        if (prompt.lead !== undefined && typeof prompt.lead !== 'string') {
            throw new Error(`${label} lead must be a string when present`);
        }
        ['subjects', 'levels', 'tools', 'collections', 'tags'].forEach((field) => {
            if (!Array.isArray(prompt[field])) throw new Error(`${label} requires array ${field}`);
        });
    });

    TARGETS.forEach((target) => {
        const count = prompts.filter((prompt) => (
            prompt.sourcePage === target.page && prompt.collections.includes(target.collection)
        )).length;
        if (count !== 4) throw new Error(`expected exactly 4 prompts for ${target.page}, found ${count}`);
    });
    if (prompts.length !== 20) throw new Error(`expected exactly 20 prompts, found ${prompts.length}`);
    return prompts;
}

function renderBadge(label, badgeClass) {
    return `<span class="badge ${badgeClass}">${escapeHtml(label)}</span>`;
}

function renderCard(prompt, newline) {
    const metadataBadges = [
        ...prompt.tools.map((tool) => renderBadge(tool, TOOL_BADGE_CLASSES[tool] || 'badge-gray')),
        ...prompt.levels.map((level) => renderBadge(level, 'badge-gray'))
    ].join('');
    const lead = prompt.lead
        ? `${newline}                                <div class="prompt-lead">${escapeHtml(prompt.lead)}</div>`
        : '';
    const lines = [
        `                    <div id="prompt-${escapeHtml(prompt.id)}" class="prompt-card reveal">`,
        '                        <div class="prompt-header">',
        '                            <div>',
        `                                <div class="prompt-title">${escapeHtml(prompt.title)}</div>${lead}`,
        `                                <div style="display:flex;gap:6px;margin-top:6px">${metadataBadges}</div>`,
        '                            </div>',
        '                        </div>',
        `                        <div class="prompt-body">${escapeHtml(prompt.prompt)}</div>`,
        '                        <div class="prompt-footer">'
    ];
    if (prompt.category) {
        lines.push(`                            <span class="badge ${CATEGORY_BADGE_CLASSES[prompt.category] || 'badge-gray'}">${escapeHtml(prompt.category)}</span>`);
    }
    lines.push(
        `                            <button class="copy-btn" type="button" data-copy="${escapeHtml(prompt.prompt)}">📋 Kopírovat</button>`,
        '                        </div>',
        '                    </div>'
    );
    return lines.join(newline);
}

function getPageParts(html, page) {
    const start = html.indexOf(START_MARKER);
    const end = html.indexOf(END_MARKER);
    if (start === -1 || end === -1 || end < start) {
        throw new Error(`generated markers are missing or out of order in ${page}`);
    }
    if (html.indexOf(START_MARKER, start + START_MARKER.length) !== -1 ||
        html.indexOf(END_MARKER, end + END_MARKER.length) !== -1) {
        throw new Error(`generated markers must occur exactly once in ${page}`);
    }
    const lastNewline = html.lastIndexOf('\n', end);
    const endIndent = html.slice(lastNewline + 1, end);
    if (!/^\s*$/.test(endIndent)) throw new Error(`end marker must be on its own indented line in ${page}`);
    return {
        newline: html.includes('\r\n') ? '\r\n' : '\n',
        endIndent,
        currentRegion: html.slice(start + START_MARKER.length, end),
        start,
        end
    };
}

function buildExpectedRegion(prompts, target, newline, endIndent) {
    const pagePrompts = prompts.filter((prompt) => (
        prompt.sourcePage === target.page && prompt.collections.includes(target.collection)
    ));
    return `${newline}${pagePrompts.map((prompt) => renderCard(prompt, newline)).join(newline)}${newline}${endIndent}`;
}

function replaceGeneratedRegion(html, parts, expectedRegion) {
    return html.slice(0, parts.start + START_MARKER.length) + expectedRegion + html.slice(parts.end);
}

function inspectTarget(prompts, target) {
    const htmlPath = path.join(ROOT, target.page);
    const html = fs.readFileSync(htmlPath, 'utf8');
    const parts = getPageParts(html, target.page);
    const expectedRegion = buildExpectedRegion(prompts, target, parts.newline, parts.endIndent);
    return {
        ...target,
        htmlPath,
        html,
        parts,
        expectedRegion,
        drift: parts.currentRegion !== expectedRegion
    };
}

function main() {
    const checkOnly = process.argv.includes('--check');
    if (process.argv.length > 3 || (process.argv.length === 3 && !checkOnly)) {
        throw new Error('usage: node scripts/generate-prompts.js [--check]');
    }

    const prompts = readPrompts();
    const inspections = TARGETS.map((target) => inspectTarget(prompts, target));
    const driftCount = inspections.filter((inspection) => inspection.drift).length;

    console.log('Prompt generation check');
    console.log('-----------------------');
    inspections.forEach((inspection) => {
        const count = prompts.filter((prompt) => (
            prompt.sourcePage === inspection.page && prompt.collections.includes(inspection.collection)
        )).length;
        console.log(`${inspection.page}: ${inspection.drift ? 'DRIFT' : 'OK'} (${count})`);
    });
    console.log(`Prompts: ${prompts.length}`);
    console.log(`Pages: ${inspections.length}`);
    console.log(`Drift: ${driftCount}`);

    if (checkOnly) {
        if (driftCount) process.exitCode = 1;
        return;
    }
    inspections.forEach((inspection) => {
        if (inspection.drift) {
            fs.writeFileSync(
                inspection.htmlPath,
                replaceGeneratedRegion(inspection.html, inspection.parts, inspection.expectedRegion),
                'utf8'
            );
        }
    });
}

try {
    main();
} catch (error) {
    fail(error.message);
}
