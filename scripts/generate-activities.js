const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = process.env.ACTIVITIES_DATA_PATH
    ? path.resolve(process.env.ACTIVITIES_DATA_PATH)
    : path.join(ROOT, 'data', 'activities.json');
const HTML_PATH = process.env.ACTIVITIES_HTML_PATH
    ? path.resolve(process.env.ACTIVITIES_HTML_PATH)
    : path.join(ROOT, 'matematika.html');
const PROMPTS_PATH = path.join(ROOT, 'data', 'prompts.json');

const START_MARKER = '<!-- GENERATED:ACTIVITIES:MATEMATIKA:START -->';
const END_MARKER = '<!-- GENERATED:ACTIVITIES:MATEMATIKA:END -->';
const EXPECTED_IDS = [
    'math-word-problem-generator',
    'math-step-by-step-guide',
    'math-test-paper-generator',
    'math-differentiated-problems',
    'math-story-problem-game',
    'math-statistics-analysis'
];
const ALLOWED_SUBJECTS = new Set(['mat']);
const ALLOWED_LEVELS = new Set(['zs1', 'zs2', 'ss']);
const ALLOWED_TOOLS = new Set(['chatgpt', 'claude', 'gemini']);
const FORMAT_LABELS = new Map([
    ['classroom', '🏫 Třída'],
    ['individual', '👤 Individuální'],
    ['groups', '👥 Skupiny'],
    ['whole-class', '👥 Celá třída'],
    ['teams-2-4', '👥 Týmy 2–4'],
    ['essay', '📝 Sloh']
]);
const LEVEL_LABELS = new Map([
    ['zs1', '1.–5. ročník'],
    ['zs2', '6.–9. ročník'],
    ['ss', 'SŠ']
]);
const TOOL_BADGES = new Map([
    ['chatgpt', ['ChatGPT', 'badge-gold']],
    ['claude', ['Claude', 'badge-purple']],
    ['gemini', ['Gemini', 'badge-mint']]
]);
const STATUS_BADGES = new Map([
    ['ready', ['Připraveno', 'badge-green']],
    ['favorite', ['Oblíbené', 'badge-gold']],
    ['recommended', ['⭐ Doporučeno', 'badge-gold']]
]);

function fail(message) {
    throw new Error(`ERROR: ${message}`);
}

function hasOwn(object, key) {
    return Object.prototype.hasOwnProperty.call(object, key);
}

function assertNoNulls(value, pathName) {
    if (value === null) fail(`${pathName} must not be null`);
    if (Array.isArray(value)) {
        value.forEach((item, index) => assertNoNulls(item, `${pathName}[${index}]`));
    } else if (typeof value === 'object') {
        Object.entries(value).forEach(([key, item]) => assertNoNulls(item, `${pathName}.${key}`));
    }
}

function assertNonEmptyString(value, field, index) {
    if (typeof value !== 'string' || value.trim() === '') fail(`record ${index + 1}: ${field} must be a non-empty string`);
}

function assertAllowedArray(values, field, allowed, index) {
    if (!Array.isArray(values) || values.length === 0) fail(`record ${index + 1}: ${field} must be a non-empty array`);
    values.forEach(value => {
        if (typeof value !== 'string' || !allowed.has(value)) fail(`record ${index + 1}: invalid ${field} value ${JSON.stringify(value)}`);
    });
}

function promptMap(promptRegistry) {
    if (!Array.isArray(promptRegistry)) fail('data/prompts.json must contain an array');
    const map = new Map();
    promptRegistry.forEach(prompt => {
        if (prompt && typeof prompt.id === 'string') map.set(prompt.id, prompt);
    });
    return map;
}

function validateDetail(detail, index) {
    if (detail === undefined) return;
    if (!detail || typeof detail !== 'object' || Array.isArray(detail)) fail(`record ${index + 1}: detail must be an object`);
    Object.keys(detail).forEach(key => {
        if (!['intro', 'modalTitle'].includes(key)) fail(`record ${index + 1}: unsupported detail field ${key}`);
        assertNonEmptyString(detail[key], `detail.${key}`, index);
    });
}

function validateActivities(records, promptRegistry) {
    if (!Array.isArray(records)) fail('data/activities.json must contain an array');
    if (records.length !== EXPECTED_IDS.length) fail(`expected exactly ${EXPECTED_IDS.length} activities, got ${records.length}`);

    const prompts = promptMap(promptRegistry);
    const ids = new Set();
    const orders = new Set();
    const serialized = new Set();

    records.forEach((record, index) => {
        if (!record || typeof record !== 'object' || Array.isArray(record)) fail(`record ${index + 1} must be an object`);
        assertNoNulls(record, `record ${index + 1}`);
        assertNonEmptyString(record.id, 'id', index);
        if (ids.has(record.id)) fail(`duplicate activity id ${record.id}`);
        ids.add(record.id);
        if (record.id !== EXPECTED_IDS[index]) fail(`record ${index + 1}: expected id ${EXPECTED_IDS[index]}, got ${record.id}`);
        assertNonEmptyString(record.title, 'title', index);
        assertNonEmptyString(record.description, 'description', index);
        assertAllowedArray(record.subjects, 'subjects', ALLOWED_SUBJECTS, index);
        assertAllowedArray(record.levels, 'levels', ALLOWED_LEVELS, index);
        assertAllowedArray(record.tools, 'tools', ALLOWED_TOOLS, index);
        assertNonEmptyString(record.duration, 'duration', index);
        if (!FORMAT_LABELS.has(record.format)) fail(`record ${index + 1}: invalid format ${JSON.stringify(record.format)}`);
        if (!STATUS_BADGES.has(record.status)) fail(`record ${index + 1}: invalid status ${JSON.stringify(record.status)}`);
        assertNonEmptyString(record.icon, 'icon', index);

        const hasPrompt = hasOwn(record, 'prompt');
        const hasPromptId = hasOwn(record, 'promptId');
        if (hasPrompt === hasPromptId) fail(`record ${index + 1}: exactly one of prompt or promptId is required`);
        if (hasPrompt) assertNonEmptyString(record.prompt, 'prompt', index);
        if (hasPromptId) {
            assertNonEmptyString(record.promptId, 'promptId', index);
            if (!prompts.has(record.promptId)) fail(`record ${index + 1}: invalid promptId ${record.promptId}`);
        }
        if (hasOwn(record, 'relatedPromptId')) {
            assertNonEmptyString(record.relatedPromptId, 'relatedPromptId', index);
            if (!prompts.has(record.relatedPromptId)) fail(`record ${index + 1}: invalid relatedPromptId ${record.relatedPromptId}`);
        }

        if (!Array.isArray(record.collections) || record.collections.length !== 1) fail(`record ${index + 1}: exactly one collection is required`);
        const collection = record.collections[0];
        if (!collection || collection.id !== 'matematika') fail(`record ${index + 1}: collection id must be matematika`);
        if (!Number.isInteger(collection.order) || collection.order < 1) fail(`record ${index + 1}: collection order must be a positive integer`);
        if (orders.has(collection.order)) fail(`duplicate collection order ${collection.order}`);
        orders.add(collection.order);
        if (collection.order !== index + 1) fail(`record ${index + 1}: collection order must be ${index + 1}`);

        if (hasOwn(record, 'badges')) {
            if (!Array.isArray(record.badges)) fail(`record ${index + 1}: badges must be an array`);
            record.badges.forEach(badge => assertNonEmptyString(badge, 'badges[]', index));
        }
        validateDetail(record.detail, index);

        const exactRecord = JSON.stringify(record);
        if (serialized.has(exactRecord)) fail(`duplicate activity record at position ${index + 1}`);
        serialized.add(exactRecord);
    });

    if (ids.size !== EXPECTED_IDS.length) fail('activity ids must be unique');
    if (orders.size !== EXPECTED_IDS.length) fail('collection orders must be unique');
    return records;
}

function resolvePrompt(record, prompts) {
    if (hasOwn(record, 'prompt')) return record.prompt;
    return prompts.get(record.promptId).prompt;
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function escapeAttribute(value) {
    return escapeHtml(value);
}

function buildModalBody(record, prompt) {
    const intro = record.detail && record.detail.intro
        ? `<p style="color:var(--text-secondary);line-height:1.7;margin-bottom:16px">${escapeHtml(record.detail.intro)}</p>`
        : '';
    const promptBlock = `<div style="background:rgba(0,0,0,0.3);padding:16px;border-radius:12px;font-size:0.875rem;color:var(--text-secondary);line-height:1.7">${escapeHtml(prompt)}</div>`;
    const copyBlock = `<div style="margin-top:16px"><button class="copy-btn btn btn-mint btn-sm" data-copy="${escapeAttribute(prompt)}">📋 Kopírovat prompt</button></div>`;
    return `${intro}${promptBlock}${copyBlock}`;
}

function buildCard(record, prompts) {
    const prompt = resolvePrompt(record, prompts);
    const [toolLabel, toolClass] = TOOL_BADGES.get(record.tools[0]);
    const levelLabel = LEVEL_LABELS.get(record.levels[0]);
    const [statusLabel, statusClass] = STATUS_BADGES.get(record.status);
    const extraBadges = (record.badges || []).map(label => `<span class="badge badge-gray">${escapeHtml(label)}</span>`).join('');
    const body = buildModalBody(record, prompt);
    const modalTitle = record.detail && record.detail.modalTitle ? record.detail.modalTitle : record.title;
    const modalPayload = JSON.stringify({title: modalTitle, body});
    return `                    <div class="activity-card reveal" data-level="${escapeAttribute(record.levels.join(' '))}">
                        <div class="activity-card-top">
                            <div class="activity-badges"><span class="badge ${toolClass}">${escapeHtml(toolLabel)}</span><span
                                    class="badge badge-gray">${escapeHtml(levelLabel)}</span>${extraBadges}</div>
                            <span style="font-size:1.8rem">${escapeHtml(record.icon)}</span>
                        </div>
                        <div class="activity-title">${escapeHtml(record.title)}</div>
                        <div class="activity-desc">${escapeHtml(record.description)}</div>
                        <div class="activity-meta"><span class="activity-meta-item">⏱ ${escapeHtml(record.duration)}</span><span
                                class="activity-meta-item">${escapeHtml(FORMAT_LABELS.get(record.format))}</span></div>
                        <div class="activity-footer">
                            <span class="badge ${statusClass}">${escapeHtml(statusLabel)}</span>
                            <button class="btn btn-mint btn-sm"
                                onclick="openModal(${escapeAttribute(modalPayload)})">Detail
                                →</button>
                        </div>
                    </div>`;
}

function buildRegion(records, promptRegistry) {
    const prompts = promptMap(promptRegistry);
    return records.map(record => buildCard(record, prompts)).join('\n\n');
}

function replaceGeneratedRegion(html, region) {
    const start = html.indexOf(START_MARKER);
    const end = html.indexOf(END_MARKER);
    if (start === -1 || end === -1 || end < start) fail('generated activity markers are missing or out of order');
    if (html.indexOf(START_MARKER, start + START_MARKER.length) !== -1 || html.indexOf(END_MARKER, end + END_MARKER.length) !== -1) {
        fail('generated activity markers must occur exactly once');
    }
    const contentStart = start + START_MARKER.length;
    return `${html.slice(0, contentStart)}\n${region}\n                    ${html.slice(end)}`;
}

function readJson(filePath) {
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (error) {
        fail(`cannot read valid JSON from ${filePath}: ${error.message}`);
    }
}

function main() {
    const args = process.argv.slice(2);
    if (args.some(arg => arg !== '--check')) fail(`unknown argument ${args.find(arg => arg !== '--check')}`);
    const checkOnly = args.includes('--check');
    const records = readJson(DATA_PATH);
    const promptRegistry = readJson(PROMPTS_PATH);
    validateActivities(records, promptRegistry);
    const html = fs.readFileSync(HTML_PATH, 'utf8');
    const region = buildRegion(records, promptRegistry);
    const updatedHtml = replaceGeneratedRegion(html, region);
    const drift = updatedHtml === html ? 0 : 1;

    console.log('Activity generation check');
    console.log('-------------------------');
    console.log(`Collection: matematika (${records.length} activities)`);
    console.log(`Source: ${path.relative(ROOT, DATA_PATH)}`);
    if (checkOnly) {
        console.log(`Drift: ${drift}`);
        if (drift !== 0) fail('generated matematika activity region is out of date');
    } else {
        if (drift !== 0) fs.writeFileSync(HTML_PATH, updatedHtml, 'utf8');
        console.log(`Updated: ${drift ? path.relative(ROOT, HTML_PATH) : 'no changes'}`);
        console.log('Drift: 0');
    }
}

if (require.main === module) {
    try {
        main();
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}

module.exports = {
    EXPECTED_IDS,
    START_MARKER,
    END_MARKER,
    buildRegion,
    replaceGeneratedRegion,
    validateActivities
};
