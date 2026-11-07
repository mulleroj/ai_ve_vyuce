const fs = require('fs');
const path = require('path');
const { buildActivityNavigation } = require('./subject-navigation');
const { buildSubjectFooter } = require('./subject-footer');
const { ROLE_LABELS, cardTimingLabel, usageDetails, timingDetails } = require('./activity-metadata-display');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = process.env.ACTIVITIES_DATA_PATH
    ? path.resolve(process.env.ACTIVITIES_DATA_PATH)
    : path.join(ROOT, 'data', 'activities.json');
const PROMPTS_PATH = path.join(ROOT, 'data', 'prompts.json');

const COLLECTIONS = [
    { id: 'matematika', file: 'matematika.html', marker: 'MATEMATIKA', expectedIds: ['math-word-problem-generator', 'math-step-by-step-guide', 'math-test-paper-generator', 'math-differentiated-problems', 'math-story-problem-game', 'math-statistics-analysis'] },
    { id: 'cestina', file: 'cestina.html', marker: 'CESTINA', expectedIds: ['czech-essay-feedback', 'czech-dictation-generator', 'czech-literary-analysis', 'czech-spelling-word-exercises', 'czech-matura-oral-exam', 'czech-writing-form-guide'] },
    { id: 'anglictina', file: 'anglictina.html', marker: 'ANGLICTINA', expectedIds: ['english-conversation-partner', 'english-grammar-feedback', 'english-vocabulary-builder', 'english-cambridge-exam-practice', 'english-grammar-exercises', 'english-contextual-translation'] },
    { id: 'prirodoveda', file: 'prirodoveda.html', marker: 'PRIRODOVEDA', expectedIds: ['biology-virtual-lab-experiment', 'chemistry-equation-guide', 'physics-phenomenon-analogies-explainer', 'biology-animal-encyclopedia', 'physics-problem-solver', 'chemistry-elements-compounds-quiz'] },
    { id: 'dejepis', file: 'dejepis.html', marker: 'DEJEPIS', expectedIds: ['history-roleplay-historical-person', 'history-timeline-generator', 'history-debate-pro-con', 'history-period-newspaper', 'history-source-analysis', 'history-map-analysis'] },
    { id: 'activities-main', file: 'aktivity.html', marker: 'MAIN', expectedIds: ['math-real-life-word-problems', 'math-ai-tutor', 'math-data-analysis', 'czech-essay-workshop', 'czech-dictation-activity', 'czech-literary-analysis-class', 'english-conversation-activity', 'english-essay-feedback', 'science-virtual-lab-simulation', 'physics-phenomenon-analogies-class', 'history-roleplay-classroom', 'history-class-timeline', 'general-prompt-power-up-relay', 'general-fact-or-fiction'] }
];
const COLLECTION_BY_ID = new Map(COLLECTIONS.map(collection => [collection.id, collection]));
const EXPECTED_IDS = COLLECTIONS.flatMap(collection => collection.expectedIds);
const ALLOWED_SUBJECTS = new Set(['mat', 'cj', 'aj', 'pv', 'dej', 'obecne']);
const ALLOWED_SUBSUBJECTS = new Set(['bio', 'che', 'fyz']);
const ALLOWED_LEVELS = new Set(['zs1', 'zs2', 'ss']);
const ALLOWED_TOOLS = new Set(['chatgpt', 'claude', 'gemini']);
const FORMAT_LABELS = new Map([
    ['classroom', '🏫 Třída'], ['individual', '👤 Individuální'], ['groups', '👥 Skupiny'],
    ['whole-class', '👥 Celá třída'], ['teams-2-4', '👥 Týmy 2–4'], ['essay', '📝 Sloh']
]);
const LEVEL_LABELS = new Map([['zs1', '1.–5. ročník'], ['zs2', '6.–9. ročník'], ['ss', 'SŠ']]);
const SUBJECT_LABELS = new Map([['bio', 'Biologie'], ['che', 'Chemie'], ['fyz', 'Fyzika']]);
const MAIN_SUBJECT_LABELS = new Map([
    ['mat', ['Matematika', 'badge-blue']], ['cj', ['Čeština', 'badge-blue']], ['aj', ['Angličtina', 'badge-blue']],
    ['pv', ['Přírodní vědy', 'badge-green']], ['dej', ['Dějepis', 'badge-purple']]
]);
const LIBRARY_SUBJECT_LABELS = new Map([['mat', 'Matematika'], ['cj', 'Čeština'], ['aj', 'Angličtina'], ['pv', 'Přírodní vědy'], ['dej', 'Dějepis'], ['obecne', 'Obecné aktivity']]);
const TOOL_BADGES = new Map([
    ['chatgpt', ['ChatGPT', 'badge-gold']], ['claude', ['Claude', 'badge-purple']], ['gemini', ['Gemini', 'badge-mint']]
]);
const STATUS_BADGES = new Map([
    ['ready', ['Připraveno', 'badge-green']], ['favorite', ['Oblíbené', 'badge-gold']], ['recommended', ['⭐ Doporučeno', 'badge-gold']]
]);
const FORMAT_DISPLAY_OVERRIDES = new Map([
    ['history-roleplay-historical-person', '👥 Třída']
]);

function markerPair(collection) {
    return { start: `<!-- GENERATED:ACTIVITIES:${collection.marker}:START -->`, end: `<!-- GENERATED:ACTIVITIES:${collection.marker}:END -->` };
}
const START_MARKER = markerPair(COLLECTIONS[0]).start;
const END_MARKER = markerPair(COLLECTIONS[0]).end;
const ACTIVITY_COUNT_PAGE = 'index.html';
const ACTIVITY_COUNT_START_MARKER = '<!-- GENERATED:ACTIVITY_COUNT:START -->';
const ACTIVITY_COUNT_END_MARKER = '<!-- GENERATED:ACTIVITY_COUNT:END -->';

function fail(message) { throw new Error(`ERROR: ${message}`); }
function hasOwn(object, key) { return Object.prototype.hasOwnProperty.call(object, key); }

function assertNoNulls(value, pathName) {
    if (value === null) fail(`${pathName} must not be null`);
    if (Array.isArray(value)) value.forEach((item, index) => assertNoNulls(item, `${pathName}[${index}]`));
    else if (typeof value === 'object') Object.entries(value).forEach(([key, item]) => assertNoNulls(item, `${pathName}.${key}`));
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
    promptRegistry.forEach(prompt => { if (prompt && typeof prompt.id === 'string') map.set(prompt.id, prompt); });
    return map;
}
function validateDetail(detail, index) {
    if (detail === undefined) return;
    if (!detail || typeof detail !== 'object' || Array.isArray(detail)) fail(`record ${index + 1}: detail must be an object`);
    Object.keys(detail).forEach(key => {
        if (!['intro', 'modalTitle', 'modalId', 'ctaLabel', 'levelLabel'].includes(key)) fail(`record ${index + 1}: unsupported detail field ${key}`);
        assertNonEmptyString(detail[key], `detail.${key}`, index);
    });
}

const ALLOWED_AI_OPERATORS = new Set(Object.keys(ROLE_LABELS));
const ALLOWED_DIRECT_ACCESS = new Set(['required', 'optional', 'not_required', 'unknown']);
const ALLOWED_TIMING_STATUSES = new Set(['unverified_estimate', 'pilot_observed', 'unknown']);
const ALLOWED_TIMING_PHASES = new Set(['teacherPrep', 'learnerWork', 'teacherReview', 'activityTotal']);

function validateTimeValue(value, label) {
    if (!value || typeof value !== 'object' || Array.isArray(value)) fail(`${label} must be an object`);
    if (!ALLOWED_TIMING_STATUSES.has(value.status)) fail(`${label}: invalid timing status ${JSON.stringify(value.status)}`);
    if (value.unit !== 'minutes') fail(`${label}: unit must be minutes`);
    if (!['student', 'text', 'team', null].includes(value.per)) fail(`${label}: invalid per unit`);
    assertNonEmptyString(value.source, `${label}.source`, 0);
    if (value.status === 'unknown') {
        if (value.value !== null || value.range !== null) fail(`${label}: unknown time must use null value and range`);
        if (typeof value.note !== 'string' || !value.note.trim()) fail(`${label}: unknown time needs an explanatory note`);
    } else {
        const hasValue = Number.isFinite(value.value);
        const hasRange = value.range !== null && typeof value.range === 'object';
        if (hasValue === hasRange) fail(`${label}: provide exactly one numeric value or interval`);
        const numbers = hasValue ? [value.value] : [value.range.min, value.range.max];
        if (numbers.some(number => !Number.isFinite(number) || number < 0)) fail(`${label}: times must be finite and non-negative`);
        if (hasRange && value.range.min > value.range.max) fail(`${label}: interval minimum exceeds maximum`);
    }
    if (value.status === 'pilot_observed') {
        const evidence = value.pilotEvidence;
        if (!evidence || ['protocol', 'sample', 'method'].some(key => typeof evidence[key] !== 'string' || !evidence[key].trim())) {
            fail(`${label}: pilot_observed requires protocol, sample, and method evidence`);
        }
    }
}

function validateUsageTiming(record, index) {
    const usage = record.usage;
    if (!usage || typeof usage !== 'object' || Array.isArray(usage)) fail(`record ${index + 1}: usage must be an object`);
    if (!ALLOWED_AI_OPERATORS.has(usage.aiOperator)) fail(`record ${index + 1}: invalid usage.aiOperator`);
    if (typeof usage.requiresSchoolApprovedEnvironment !== 'boolean') fail(`record ${index + 1}: requiresSchoolApprovedEnvironment must be boolean`);
    if (!ALLOWED_DIRECT_ACCESS.has(usage.studentDirectAccess)) fail(`record ${index + 1}: invalid usage.studentDirectAccess`);
    const expectedAccess = usage.aiOperator === 'student_direct' ? 'required' : usage.aiOperator === 'flexible' ? 'optional' : 'not_required';
    if (usage.studentDirectAccess !== expectedAccess) fail(`record ${index + 1}: direct access conflicts with the approved operator category`);
    if (usage.requiresSchoolApprovedEnvironment !== (usage.studentDirectAccess !== 'not_required')) fail(`record ${index + 1}: school-approval flag applies only to direct student AI access`);
    assertNonEmptyString(usage.teacherRole, 'usage.teacherRole', index);
    assertNonEmptyString(usage.studentRole, 'usage.studentRole', index);
    if (usage.offlineAlternative !== null) {
        if (!usage.offlineAlternative || typeof usage.offlineAlternative !== 'object' || Array.isArray(usage.offlineAlternative)) fail(`record ${index + 1}: offlineAlternative must be null or an evidence object`);
        assertNonEmptyString(usage.offlineAlternative.description, 'usage.offlineAlternative.description', index);
        assertNonEmptyString(usage.offlineAlternative.evidence, 'usage.offlineAlternative.evidence', index);
    }

    const timing = record.timing;
    if (!timing || typeof timing !== 'object' || Array.isArray(timing)) fail(`record ${index + 1}: timing must be an object`);
    for (const key of ['teacherPrep', 'learnerWork', 'teacherReview', 'activityTotal', 'legacyUnclassified']) {
        if (!hasOwn(timing, key)) fail(`record ${index + 1}: timing.${key} is required`);
        if (timing[key] !== null) validateTimeValue(timing[key], `record ${index + 1}: timing.${key}`);
    }
    if (!Array.isArray(timing.variants)) fail(`record ${index + 1}: timing.variants must be an array`);
    timing.variants.forEach((variant, variantIndex) => {
        assertNonEmptyString(variant.label, `timing.variants[${variantIndex}].label`, index);
        if (!ALLOWED_TIMING_PHASES.has(variant.phase)) fail(`record ${index + 1}: invalid timing variant phase`);
        validateTimeValue(variant.duration, `record ${index + 1}: timing.variants[${variantIndex}].duration`);
    });
}

function validateApprovedMetadataCounts(records) {
    const counts = Object.fromEntries([...ALLOWED_AI_OPERATORS].map(role => [role, 0]));
    records.forEach(record => { if (record.usage && counts[record.usage.aiOperator] !== undefined) counts[record.usage.aiOperator]++; });
    const expected = { teacher_preparation: 16, teacher_led: 12, student_direct: 11, flexible: 5 };
    for (const [role, count] of Object.entries(expected)) if (counts[role] !== count) fail(`expected ${count} ${role} activities, got ${counts[role]}`);
}

function validateTimingDecisions(records) {
    const byId = new Map(records.map(record => [record.id, record]));
    const animal = byId.get('biology-animal-encyclopedia').timing.variants;
    if (animal.length !== 2 || animal[0].duration.value !== 8 || animal[1].duration.range?.min !== 20 || animal[1].duration.range?.max !== 30) fail('T01: preserve the two animal-profile time variants');
    const realLife = byId.get('math-real-life-word-problems').timing;
    if (realLife.teacherPrep?.value !== 5 || realLife.learnerWork !== null) fail('T02: five minutes is preparation; learner-work time is unknown');
    const essay = byId.get('czech-essay-workshop').timing.variants;
    if (essay.length !== 3 || essay[0].duration.value !== 2 || essay[0].duration.per !== 'student' || essay[1].duration.value !== 5 || essay[2].duration.status !== 'unknown') fail('T03: preserve essay-workshop modes and per-student unit');
    if (byId.get('czech-dictation-activity').timing.teacherPrep?.value !== 5) fail('T04: preserve preparation time only');
    const literature = byId.get('czech-literary-analysis-class').timing;
    if (literature.teacherPrep?.value !== 10 || literature.learnerWork?.range?.min !== 15 || literature.learnerWork?.range?.max !== 20) fail('T05: separate preparation and learner work');
    const conversation = byId.get('english-conversation-activity').timing;
    if (conversation.activityTotal?.value !== 15 || conversation.teacherPrep !== null || conversation.learnerWork !== null) fail('T06: preserve the orientational total without inventing phase splits');
    const physics = byId.get('physics-phenomenon-analogies-class').timing.legacyUnclassified;
    if (physics?.value !== 5 || !/not.*doloženo|není doloženo/i.test(physics.note || '')) fail('T07: five minutes must remain unclassified, not a full workshop duration');
    if (byId.get('history-class-timeline').timing.teacherPrep?.value !== 5 || byId.get('history-class-timeline').timing.learnerWork !== null) fail('T08: preserve preparation time and unknown learner-work duration');
}

function validateModalReferences(records, html) {
    const modalIds = new Set();
    records.filter(record => record.collections?.[0]?.id === 'activities-main').forEach((record, index) => {
        const modalId = record.detail && record.detail.modalId;
        if (modalId === undefined) return;
        if (!/^[A-Za-z][A-Za-z0-9_-]*$/.test(modalId)) fail(`main record ${index + 1}: invalid detail.modalId ${JSON.stringify(modalId)}`);
        if (modalIds.has(modalId)) fail(`duplicate modalId ${modalId}`);
        modalIds.add(modalId);
        const targetPattern = new RegExp(`(?:id|name)=["']${modalId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`);
        if (!targetPattern.test(html)) fail(`main record ${index + 1}: modalId ${modalId} does not exist in aktivity.html`);
    });
}

function validateRelatedPromptReferences(records, promptRegistry) {
    const prompts = promptMap(promptRegistry);
    const promptyPath = path.join(ROOT, 'prompty.html');
    const promptyHtml = fs.readFileSync(promptyPath, 'utf8');
    records.filter(record => record.collections?.[0]?.id === 'activities-main' && hasOwn(record, 'relatedPromptId')).forEach((record, index) => {
        const prompt = prompts.get(record.relatedPromptId);
        if (!prompt || prompt.sourcePage !== 'prompty.html') fail(`main record ${index + 1}: relatedPromptId ${record.relatedPromptId} must target prompty.html`);
        const fragmentPattern = new RegExp(`(?:id|name)=["']${record.relatedPromptId.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`);
        if (!fragmentPattern.test(promptyHtml)) fail(`main record ${index + 1}: related prompt fragment ${record.relatedPromptId} is missing from prompty.html`);
    });
}

function validateActivities(records, promptRegistry, mainHtml = fs.readFileSync(path.join(ROOT, 'aktivity.html'), 'utf8')) {
    if (!Array.isArray(records)) fail('data/activities.json must contain an array');
    if (records.length !== EXPECTED_IDS.length) fail(`expected exactly ${EXPECTED_IDS.length} activities, got ${records.length}`);
    const prompts = promptMap(promptRegistry);
    const ids = new Set();
    const serialized = new Set();
    const collectionCounts = new Map(COLLECTIONS.map(collection => [collection.id, 0]));
    const collectionOrders = new Map(COLLECTIONS.map(collection => [collection.id, new Set()]));

    records.forEach((record, index) => {
        if (!record || typeof record !== 'object' || Array.isArray(record)) fail(`record ${index + 1} must be an object`);
        Object.entries(record).forEach(([key, value]) => {
            if (!['usage', 'timing'].includes(key)) assertNoNulls(value, `record ${index + 1}.${key}`);
        });
        assertNonEmptyString(record.id, 'id', index);
        if (ids.has(record.id)) fail(`duplicate activity id ${record.id}`);
        ids.add(record.id);
        if (record.id !== EXPECTED_IDS[index]) fail(`record ${index + 1}: expected id ${EXPECTED_IDS[index]}, got ${record.id}`);
        assertNonEmptyString(record.title, 'title', index);
        assertNonEmptyString(record.description, 'description', index);
        assertAllowedArray(record.subjects, 'subjects', ALLOWED_SUBJECTS, index);
        if (record.subjects.length !== 1) fail(`record ${index + 1}: exactly one main subject is required`);
        if (record.collections?.[0]?.id !== 'activities-main' && record.subjects[0] === 'obecne') fail(`record ${index + 1}: obecne subject is only valid in activities-main`);
        assertAllowedArray(record.levels, 'levels', ALLOWED_LEVELS, index);
        assertAllowedArray(record.tools, 'tools', ALLOWED_TOOLS, index);
        if (record.tools.length !== 1) fail(`record ${index + 1}: exactly one tool is required`);
        if (hasOwn(record, 'subsubjects')) {
            assertAllowedArray(record.subsubjects, 'subsubjects', ALLOWED_SUBSUBJECTS, index);
            if (record.subjects[0] !== 'pv') fail(`record ${index + 1}: subsubjects are only valid for subject pv`);
        } else if (record.subjects[0] === 'pv' && record.collections?.[0]?.id !== 'activities-main') fail(`record ${index + 1}: subject pv requires subsubjects`);
        assertNonEmptyString(record.duration, 'duration', index);
        validateUsageTiming(record, index);
        if (!FORMAT_LABELS.has(record.format)) fail(`record ${index + 1}: invalid format ${JSON.stringify(record.format)}`);
        if (!STATUS_BADGES.has(record.status)) fail(`record ${index + 1}: invalid status ${JSON.stringify(record.status)}`);
        if (hasOwn(record, 'statusBadge')) fail(`record ${index + 1}: statusBadge is not allowed; use status`);
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
        const collectionDefinition = collection && COLLECTION_BY_ID.get(collection.id);
        if (!collectionDefinition) fail(`record ${index + 1}: invalid collection id ${JSON.stringify(collection && collection.id)}`);
        collectionCounts.set(collection.id, collectionCounts.get(collection.id) + 1);
        if (!Number.isInteger(collection.order) || collection.order < 1 || collection.order > collectionDefinition.expectedIds.length) {
            fail(`record ${index + 1}: collection order must be an integer from 1 to ${collectionDefinition.expectedIds.length}`);
        }
        const orders = collectionOrders.get(collection.id);
        if (orders.has(collection.order)) fail(`duplicate collection order ${collection.order} in ${collection.id}`);
        orders.add(collection.order);
        if (collectionDefinition.expectedIds[collection.order - 1] !== record.id) fail(`record ${index + 1}: id ${record.id} does not match ${collection.id} order ${collection.order}`);
        if (hasOwn(record, 'badges')) {
            if (!Array.isArray(record.badges)) fail(`record ${index + 1}: badges must be an array`);
            record.badges.forEach(badge => assertNonEmptyString(badge, 'badges[]', index));
        }
        validateDetail(record.detail, index);
        if (record.collections[0].id === 'activities-main') {
            if (!hasPrompt || hasPromptId) fail(`record ${index + 1}: main activities must use their own prompt`);
            if (!record.detail || !hasOwn(record.detail, 'ctaLabel')) fail(`record ${index + 1}: main activities require detail.ctaLabel`);
            if (record.relatedPromptId === undefined && !record.detail.modalId) fail(`record ${index + 1}: main activity needs relatedPromptId or detail.modalId`);
            if (record.relatedPromptId !== undefined && record.detail.modalId !== undefined) fail(`record ${index + 1}: main activity cannot combine relatedPromptId and detail.modalId`);
        }
        if (hasOwn(record, 'tags')) assertAllowedArray(record.tags, 'tags', new Set(record.tags), index);
        const exactRecord = JSON.stringify(record);
        if (serialized.has(exactRecord)) fail(`duplicate activity record at position ${index + 1}`);
        serialized.add(exactRecord);
    });
    COLLECTIONS.forEach(collection => {
        if (collectionCounts.get(collection.id) !== collection.expectedIds.length) fail(`collection ${collection.id} must contain exactly ${collection.expectedIds.length} activities`);
        if (collectionOrders.get(collection.id).size !== collection.expectedIds.length) fail(`collection ${collection.id} orders must be unique`);
    });
    if (ids.size !== EXPECTED_IDS.length) fail('activity ids must be unique');
    validateApprovedMetadataCounts(records);
    validateTimingDecisions(records);
    const promptRoleDecisions = {
        'english-grammar-feedback': 'teacher_preparation', 'chemistry-equation-guide': 'flexible',
        'physics-problem-solver': 'student_direct', 'history-roleplay-historical-person': 'teacher_led',
        'history-debate-pro-con': 'teacher_led', 'history-source-analysis': 'teacher_led',
        'history-map-analysis': 'teacher_led', 'english-essay-feedback': 'flexible'
    };
    for (const [id, role] of Object.entries(promptRoleDecisions)) {
        if (records.find(record => record.id === id)?.usage.aiOperator !== role) fail(`${id}: usage role conflicts with the approved 6C/4 decision`);
    }
    const promptIdCount = records.filter(record => hasOwn(record, 'promptId')).length;
    const relatedPromptCount = records.filter(record => hasOwn(record, 'relatedPromptId')).length;
    if (promptIdCount !== 0) fail(`expected 0 promptId references, got ${promptIdCount}`);
    if (relatedPromptCount !== 12) fail(`expected 12 relatedPromptId references, got ${relatedPromptCount}`);
    validateRelatedPromptReferences(records, promptRegistry);
    validateModalReferences(records, mainHtml);
    return records;
}

function resolvePrompt(record, prompts) { return hasOwn(record, 'prompt') ? record.prompt : prompts.get(record.promptId).prompt; }
function escapeHtml(value) {
    return String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}
function escapeAttribute(value) { return escapeHtml(value); }
function buildModalBody(record, prompt) {
    const intro = record.detail && record.detail.intro ? `<p style="color:var(--text-secondary);line-height:1.7;margin-bottom:16px">${escapeHtml(record.detail.intro)}</p>` : '';
    const usage = usageDetails(record.usage);
    const usageBlock = `<section class="activity-detail-block"><h3>Jak se používá AI</h3><dl><dt>${escapeHtml(usage.roleLabel)}</dt><dd>${escapeHtml(usage.operatorDescription)}</dd><dt>Učitel</dt><dd>${escapeHtml(usage.teacherRole)}</dd><dt>Žák</dt><dd>${escapeHtml(usage.studentRole)}</dd><dt>Přímý přístup žáka</dt><dd>${escapeHtml(usage.accessText)}</dd>${usage.offlineAlternative ? `<dt>Varianta bez AI</dt><dd>${escapeHtml(usage.offlineAlternative)}</dd>` : ''}</dl></section>`;
    const timingRows = timingDetails(record.timing).map(row => `<div><dt>${escapeHtml(row.label)}</dt><dd>${escapeHtml(row.text)}</dd></div>`).join('');
    const timingBlock = `<section class="activity-detail-block"><h3>Časová náročnost</h3><dl>${timingRows}</dl><p>Časové údaje jsou orientační odhady, nikoli pilotní měření. Neznámé fáze nejsou doplněny.</p></section>`;
    const promptBlock = `<div style="background:rgba(0,0,0,0.3);padding:16px;border-radius:12px;font-size:0.875rem;color:var(--text-secondary);line-height:1.7">${escapeHtml(prompt)}</div>`;
    const copyBlock = `<div style="margin-top:16px"><button class="copy-btn btn btn-mint btn-sm" data-copy="${escapeAttribute(prompt)}">📋 Kopírovat prompt</button></div>`;
    return `${intro}${usageBlock}${timingBlock}${promptBlock}${copyBlock}`;
}
function levelLabel(levels) {
    if (levels.length === 3 && levels.every(level => ALLOWED_LEVELS.has(level))) return 'ZŠ/SŠ';
    if (levels.length === 2 && levels.includes('zs1') && levels.includes('zs2')) return 'ZŠ';
    return levels.map(level => LEVEL_LABELS.get(level)).join(' / ');
}
function formatLabel(record) {
    return FORMAT_DISPLAY_OVERRIDES.get(record.id) || FORMAT_LABELS.get(record.format);
}
function usageTimingAttributes(record) {
    const usage = usageDetails(record.usage);
    const timing = timingDetails(record.timing);
    return ` data-role-label="${escapeAttribute(ROLE_LABELS[record.usage.aiOperator])}" data-card-timing="${escapeAttribute(cardTimingLabel(record.timing))}" data-usage-info="${escapeAttribute(JSON.stringify(usage))}" data-timing-info="${escapeAttribute(JSON.stringify(timing))}"`;
}
function cardMetadata(record) {
    const timingLabel = cardTimingLabel(record.timing);
    const timingPrefix = timingLabel.startsWith('Čas ') ? '' : 'Čas: ';
    return `<div class="activity-meta activity-meta-roles"><span class="activity-meta-item activity-meta-role">Role AI: ${escapeHtml(ROLE_LABELS[record.usage.aiOperator])}</span><span class="activity-meta-item activity-meta-time">${timingPrefix}${escapeHtml(timingLabel)}</span><span class="activity-meta-item">${escapeHtml(formatLabel(record))}</span></div>`;
}
function buildCard(record, prompts, library = false) {
    const prompt = resolvePrompt(record, prompts);
    const [toolLabel, toolClass] = TOOL_BADGES.get(record.tools[0]);
    const secondaryLabel = record.subsubjects ? SUBJECT_LABELS.get(record.subsubjects[0]) : levelLabel(record.levels);
    const [statusLabel, statusClass] = STATUS_BADGES.get(record.status);
    const extraBadges = (record.badges || []).map(label => `<span class="badge badge-gray">${escapeHtml(label)}</span>`).join('');
    const body = buildModalBody(record, prompt);
    const modalTitle = record.detail && record.detail.modalTitle ? record.detail.modalTitle : record.title;
    const modalPayload = JSON.stringify({title: modalTitle, body});
    const subjectAttribute = library ? ` data-subject="${escapeAttribute(record.subjects[0])}"` : (record.subsubjects ? ` data-subject="${escapeAttribute(record.subsubjects[0])}"` : '');
    const titleTag = ['anglictina', 'matematika'].includes(record.collections[0].id) ? 'h3' : 'div';
    const libraryAttributes = library ? ` data-activity-id="${escapeAttribute(record.id)}" data-search="${escapeAttribute(`${record.title} ${record.description}`)}" data-tool="${escapeAttribute(record.tools[0])}" data-duration="${escapeAttribute(record.duration)}" data-format="${escapeAttribute(formatLabel(record))}" data-prompt="${escapeAttribute(prompt)}" data-modal-title="${escapeAttribute(modalTitle)}" data-intro="${escapeAttribute(record.detail?.intro || '')}"${usageTimingAttributes(record)}${record.relatedPromptId ? ` data-related-prompt="${escapeAttribute(record.relatedPromptId)}"` : ''}` : '';
    const detailButton = library
        ? `<button class="btn btn-mint btn-sm" type="button" data-open-activity="${escapeAttribute(record.id)}" aria-haspopup="dialog">Detail →</button>`
        : `<button class="btn btn-mint btn-sm"
                                onclick="openModal(${escapeAttribute(modalPayload)})">Detail
                                →</button>`;
    return `                    <div class="activity-card reveal"${library ? ` data-subject="${escapeAttribute(record.subjects[0])}"` : ''} data-level="${escapeAttribute(record.levels.join(' '))}"${libraryAttributes}${subjectAttribute}>
                        <div class="activity-card-top">
                            <div class="activity-badges"><span class="badge ${toolClass}">${escapeHtml(toolLabel)}</span>${library ? `<span class="badge badge-blue">${escapeHtml(LIBRARY_SUBJECT_LABELS.get(record.subjects[0]))}</span>` : ''}<span
                                    class="badge badge-gray">${escapeHtml(secondaryLabel)}</span>${extraBadges}</div>
                            <span style="font-size:1.8rem">${escapeHtml(record.icon)}</span>
                        </div>
                        <${library ? 'h3' : titleTag} class="activity-title">${escapeHtml(record.title)}</${library ? 'h3' : titleTag}>
                        <div class="activity-desc">${escapeHtml(record.description)}</div>
                        ${cardMetadata(record)}
                        <div class="activity-footer">
                            <span class="badge ${statusClass}">${escapeHtml(statusLabel)}</span>
                            ${library ? `<div class="activity-footer-actions">${detailButton}<button class="copy-btn btn btn-mint btn-sm" data-copy="${escapeAttribute(prompt)}">📋 Kopírovat</button></div>` : detailButton}
                        </div>
                    </div>`;
}
const MAIN_BADGE_CLASSES = new Map([
    ['⚡ Icebreaker', 'badge-gold'], ['6.–9. · SŠ', 'badge-gray'], ['Prompt skills', 'badge-purple'],
    ['🎮 AI hra', 'badge-blue'], ['6.–9.', 'badge-gray'], ['Mediální gramotnost', 'badge-purple']
]);
const MAIN_CARD_STYLES = new Map([
    ['general-prompt-power-up-relay', ' style="border-color:rgba(245,166,35,0.3);background:rgba(245,166,35,0.03)"'],
    ['general-fact-or-fiction', ' style="border-color:rgba(52,152,219,0.3);background:rgba(52,152,219,0.03)"']
]);
function mainLevelLabel(record) {
    if (record.detail && record.detail.levelLabel) return record.detail.levelLabel;
    return levelLabel(record.levels).replace(' ročník', '').replace(' / ', ' · ');
}
function mainSubjectBadge(record) {
    const subject = MAIN_SUBJECT_LABELS.get(record.subjects[0]);
    return subject ? `<span class="badge ${subject[1]}">${escapeHtml(subject[0])}</span>` : '';
}
function mainBadgeMarkup(record) {
    if (record.subjects[0] !== 'obecne') {
        return `${mainSubjectBadge(record)}<span class="badge badge-gray">${escapeHtml(mainLevelLabel(record))}</span>`;
    }
    return (record.badges || []).map(label => `<span class="badge ${MAIN_BADGE_CLASSES.get(label) || 'badge-gray'}">${escapeHtml(label)}</span>`).join('');
}
function mainCtaMarkup(record, library = false) {
    const ctaLabel = record.detail.ctaLabel;
    if (record.relatedPromptId) {
        return `<a href="${escapeAttribute(`prompty.html#${record.relatedPromptId}`)}" class="activity-template-link btn btn-outline btn-sm">${escapeHtml(ctaLabel)}</a>`;
    }
    if (library) return `<button class="btn btn-primary btn-sm" type="button" data-open-activity="${escapeAttribute(record.id)}" aria-haspopup="dialog">${escapeHtml(ctaLabel)}</button>`;
    const modalId = record.detail.modalId;
    const onclick = `document.getElementById(${JSON.stringify(modalId)}).classList.add('open')`;
    const modalLabel = ctaLabel.replace(' →', '\n                                →');
    return `<button class="btn btn-primary btn-sm" onclick="${escapeAttribute(onclick)}">${escapeHtml(modalLabel)}</button>`;
}
function buildMainCard(record, library = false) {
    const tool = TOOL_BADGES.get(record.tools[0]);
    const status = STATUS_BADGES.get(record.status);
    const style = MAIN_CARD_STYLES.get(record.id) || '';
    const cardAttributes = `data-subject="${escapeAttribute(record.subjects[0])}" data-level="${escapeAttribute(record.levels.join(' '))}" data-tool="${escapeAttribute(record.tools[0])}"${library ? ` data-activity-id="${escapeAttribute(record.id)}" data-recommended="true" data-search="${escapeAttribute(`${record.title} ${record.description}`)}" data-duration="${escapeAttribute(record.duration)}" data-format="${escapeAttribute(formatLabel(record))}" data-prompt="${escapeAttribute(record.prompt)}"${usageTimingAttributes(record)}${record.relatedPromptId ? ` data-related-prompt="${escapeAttribute(record.relatedPromptId)}"` : ''}` : ''}`;
    return `                    <div class="activity-card reveal" ${cardAttributes}${style}>
                        <div class="activity-card-top">
                            <div class="activity-badges">${record.subjects[0] === 'obecne' ? `<span class="badge badge-green">Obecné aktivity</span>` : `<span class="badge ${tool[1]}">${escapeHtml(tool[0])}</span>`}${mainBadgeMarkup(record)}${library && record.status !== 'recommended' ? '<span class="badge badge-gold">⭐ Doporučeno</span>' : ''}</div>
                            <span style="font-size:1.8rem">${escapeHtml(record.icon)}</span>
                        </div>
                        <${library ? 'h3' : 'div'} class="activity-title">${escapeHtml(record.title)}</${library ? 'h3' : 'div'}>
                        <div class="activity-desc">${escapeHtml(record.description)}</div>
                        ${cardMetadata(record)}
                        <div class="activity-footer"><span class="badge ${status[1]}">${escapeHtml(status[0])}</span><div class="activity-footer-actions">${mainCtaMarkup(record, library)}${library && !record.detail.modalId ? `<button class="btn btn-outline btn-sm" type="button" data-open-activity="${escapeAttribute(record.id)}" aria-haspopup="dialog">Detail</button>` : ''}<button class="copy-btn btn btn-mint btn-sm"
                                data-copy="${escapeAttribute(record.prompt)}">📋 Kopírovat</button></div></div>
                    </div>`;
}
function buildRegion(records, promptRegistry, collectionId) {
    const prompts = promptMap(promptRegistry);
    const selectedRecords = collectionId ? records.filter(record => record.collections[0].id === collectionId).sort((a, b) => a.collections[0].order - b.collections[0].order) : records;
    if (collectionId === 'activities-main') {
        const all = records.filter(record => record.collections[0].id === 'activities-main').sort((a, b) => a.collections[0].order - b.collections[0].order);
        const recommended = all;
        const remaining = records.filter(record => record.collections[0].id !== 'activities-main');
        const libraryRecords = [...recommended, ...remaining];
        if (libraryRecords.length !== records.length || new Set(libraryRecords.map(record => record.id)).size !== records.length) fail('activity library must contain every registry activity exactly once');
        return [...recommended.map(record => buildMainCard(record, true)), ...remaining.map(record => buildCard(record, prompts, true))].join('\n\n');
    }
    return selectedRecords.map(record => buildCard(record, prompts)).join('\n\n');
}
function replaceGeneratedRegion(html, region, startMarker = START_MARKER, endMarker = END_MARKER) {
    const start = html.indexOf(startMarker);
    const end = html.indexOf(endMarker);
    if (start === -1 || end === -1 || end < start) fail('generated activity markers are missing or out of order');
    if (html.indexOf(startMarker, start + startMarker.length) !== -1 || html.indexOf(endMarker, end + endMarker.length) !== -1) fail('generated activity markers must occur exactly once');
    const contentStart = start + startMarker.length;
    const newline = html.slice(contentStart).match(/\r\n|\n/)?.[0] || '\n';
    const normalizedRegion = region.replace(/\r\n?/g, '\n').replace(/\n/g, newline);
    return `${html.slice(0, contentStart)}${newline}${normalizedRegion}${newline}                    ${html.slice(end)}`;
}

function getActivityCountParts(html) {
    const start = html.indexOf(ACTIVITY_COUNT_START_MARKER);
    const end = html.indexOf(ACTIVITY_COUNT_END_MARKER);
    if (start === -1 && end === -1) {
        const unmarkedCount = [...html.matchAll(/<div\b[^>]*\bdata-target=["']\d+["'][^>]*>[\s\S]*?<\/div>/gi)]
            .some(([markup]) => /\bhome-stat-blue\b/i.test(markup));
        if (unmarkedCount) fail(`activity counter in ${ACTIVITY_COUNT_PAGE} is missing its generated markers`);
        return null;
    }
    if (start === -1 || end === -1 || end < start) fail(`generated activity count markers are incomplete or out of order in ${ACTIVITY_COUNT_PAGE}`);
    if (html.indexOf(ACTIVITY_COUNT_START_MARKER, start + ACTIVITY_COUNT_START_MARKER.length) !== -1 ||
        html.indexOf(ACTIVITY_COUNT_END_MARKER, end + ACTIVITY_COUNT_END_MARKER.length) !== -1) {
        fail(`generated activity count markers must occur exactly once in ${ACTIVITY_COUNT_PAGE}`);
    }
    const lastNewline = html.lastIndexOf('\n', end);
    const endIndent = html.slice(lastNewline + 1, end);
    if (!/^\s*$/.test(endIndent)) fail(`activity count end marker must be on its own indented line in ${ACTIVITY_COUNT_PAGE}`);
    return {
        newline: html.includes('\r\n') ? '\r\n' : '\n',
        endIndent,
        currentRegion: html.slice(start + ACTIVITY_COUNT_START_MARKER.length, end),
        start,
        end
    };
}

function buildActivityCountRegion(activityCount, parts) {
    return `${parts.newline}${parts.endIndent}<div class="stat-number home-stat-blue" data-target="${activityCount}">${activityCount}</div>${parts.newline}${parts.endIndent}`;
}

function inspectActivityCount(activityCount) {
    const htmlPath = path.join(ROOT, ACTIVITY_COUNT_PAGE);
    const html = fs.readFileSync(htmlPath, 'utf8');
    const parts = getActivityCountParts(html);
    if (!parts) return null;
    const expectedRegion = buildActivityCountRegion(activityCount, parts);
    return { page: ACTIVITY_COUNT_PAGE, htmlPath, html, parts, expectedRegion, drift: parts.currentRegion !== expectedRegion };
}

function replaceActivityCountRegion(inspection) {
    const { html, parts, expectedRegion } = inspection;
    return `${html.slice(0, parts.start + ACTIVITY_COUNT_START_MARKER.length)}${expectedRegion}${html.slice(parts.end)}`;
}
function readJson(filePath) {
    try { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
    catch (error) { fail(`cannot read valid JSON from ${filePath}: ${error.message}`); }
}
function getTargets() {
    if (process.env.ACTIVITIES_HTML_PATH) return [{...COLLECTIONS[0], htmlPath: path.resolve(process.env.ACTIVITIES_HTML_PATH)}];
    return COLLECTIONS.map(collection => ({...collection, htmlPath: path.join(ROOT, collection.file)}));
}
function main() {
    const args = process.argv.slice(2);
    if (args.some(arg => arg !== '--check')) fail(`unknown argument ${args.find(arg => arg !== '--check')}`);
    const checkOnly = args.includes('--check');
    const records = readJson(DATA_PATH);
    const promptRegistry = readJson(PROMPTS_PATH);
    validateActivities(records, promptRegistry);
    const activityCountInspection = inspectActivityCount(records.length);
    const targets = getTargets();
    let totalDrift = 0;
    console.log('Activity generation check');
    console.log('-------------------------');
    targets.forEach(target => {
        const collection = COLLECTION_BY_ID.get(target.id);
        const html = fs.readFileSync(target.htmlPath, 'utf8');
        const {start, end} = markerPair(collection);
        const region = buildRegion(records, promptRegistry, collection.id);
        let updatedHtml = replaceGeneratedRegion(html, region, start, end);
        if (collection.id === 'activities-main') {
            updatedHtml = replaceGeneratedRegion(updatedHtml, buildActivityNavigation(), '<!-- GENERATED:ACTIVITY_NAV:START -->', '<!-- GENERATED:ACTIVITY_NAV:END -->');
            updatedHtml = replaceGeneratedRegion(updatedHtml, buildSubjectFooter(), '<!-- GENERATED:ACTIVITY_FOOTER:START -->', '<!-- GENERATED:ACTIVITY_FOOTER:END -->');
        }
        const drift = updatedHtml === html ? 0 : 1;
        totalDrift += checkOnly ? drift : 0;
        console.log(`Collection: ${collection.id} (${collection.expectedIds.length} activities)`);
        console.log(`Source: ${path.relative(ROOT, DATA_PATH)}`);
        if (checkOnly) {
            console.log(`Drift: ${drift}`);
            if (drift !== 0) fail(`generated ${collection.id} activity region is out of date`);
        } else {
            if (drift !== 0) fs.writeFileSync(target.htmlPath, updatedHtml, 'utf8');
            console.log(`Updated: ${drift ? path.relative(ROOT, target.htmlPath) : 'no changes'}`);
            console.log('Drift: 0');
        }
    });
    console.log('Homepage activity count:');
    if (!activityCountInspection) {
        console.log(`${ACTIVITY_COUNT_PAGE}: no generated counter block (not present in the homepage)`);
    } else {
        console.log(`${activityCountInspection.page}: ${activityCountInspection.drift ? 'DRIFT' : 'OK'} (${records.length})`);
        if (checkOnly) {
            totalDrift += activityCountInspection.drift ? 1 : 0;
            if (activityCountInspection.drift) fail('homepage activity count is out of date');
        }
        if (!checkOnly && activityCountInspection.drift) {
            fs.writeFileSync(activityCountInspection.htmlPath, replaceActivityCountRegion(activityCountInspection), 'utf8');
            console.log(`Updated: ${path.relative(ROOT, activityCountInspection.htmlPath)}`);
        }
    }
    console.log(`Collections: ${targets.length}`);
    console.log(`Total activities: ${records.length}`);
    console.log(`Registry activities: ${records.length}`);
    console.log(`Drift: ${totalDrift}`);
}
if (require.main === module) {
    try { main(); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
module.exports = {
    COLLECTIONS,
    EXPECTED_IDS,
    START_MARKER,
    END_MARKER,
    ACTIVITY_COUNT_PAGE,
    ACTIVITY_COUNT_START_MARKER,
    ACTIVITY_COUNT_END_MARKER,
    buildRegion,
    replaceGeneratedRegion,
    buildActivityCountRegion,
    inspectActivityCount,
    validateActivities
};
