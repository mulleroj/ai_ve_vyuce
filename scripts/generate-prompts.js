const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const DATA_PATH = path.join(ROOT, 'data', 'prompts.json');

const SUBJECT_TARGETS = [
    { page: 'matematika.html', collection: 'matematika' },
    { page: 'cestina.html', collection: 'cestina' },
    { page: 'anglictina.html', collection: 'anglictina' },
    { page: 'prirodoveda.html', collection: 'prirodoveda' },
    { page: 'dejepis.html', collection: 'dejepis' }
];

const LIBRARY_SECTIONS = [
    { key: 'CHATGPT_VISUAL', filterKey: 'chatgpt-vizualni', count: 7 },
    { key: 'GENERAL', filterKey: 'gen', count: 6 },
    { key: 'MATH_BASIC', filterKey: 'mat', count: 2 },
    { key: 'LANGUAGES_BASIC', filterKey: null, count: 2 },
    { key: 'MATH_EXTENDED', filterKey: 'mat', count: 25 },
    { key: 'CZECH_EXTENDED', filterKey: 'cj', count: 25 },
    { key: 'ENGLISH_EXTENDED', filterKey: 'aj', count: 25 },
    { key: 'SCIENCE_EXTENDED', filterKey: 'pv', count: 28 },
    { key: 'HISTORY_EXTENDED', filterKey: 'dej', count: 25 }
];

const FILTER_KEYS = new Set([
    'chatgpt-vizualni', 'gen', 'mat', 'cj', 'aj', 'pv', 'dej'
]);
const SUBJECT_PAGE_BY_PAGE = new Map(SUBJECT_TARGETS.map((target) => [target.page, target]));
const LIBRARY_SECTION_BY_KEY = new Map(LIBRARY_SECTIONS.map((section) => [section.key, section]));
const LIBRARY_PAGE = 'prompty.html';
const VIBE_PAGE = 'vibe-coding-prompty.html';

const VIBE_SECTIONS = [
    { key: 'VIBE_MAIN', collection: 'vibe-coding-main', count: 10 },
    { key: 'VIBE_APPENDIX', collection: 'vibe-coding-appendix', count: 1 }
];


const SUBJECT_START_MARKER = '<!-- GENERATED:PROMPTS:START -->';
const SUBJECT_END_MARKER = '<!-- GENERATED:PROMPTS:END -->';

const TOOL_BADGE_CLASSES = {
    ChatGPT: 'badge-gold',
    Gemini: 'badge-mint',
    Claude: 'badge-purple',
    'Jakýkoli LLM': 'badge-gold'
};

const CATEGORY_BADGE_CLASSES = {
    Generování: 'badge-blue', Vysvětlení: 'badge-green', Testy: 'badge-orange',
    Diferenciace: 'badge-pink', Opravování: 'badge-blue', Diktáty: 'badge-green',
    Literatura: 'badge-orange', Sloh: 'badge-pink', Konverzace: 'badge-mint',
    Gramatika: 'badge-blue', Eseje: 'badge-orange', Slovíčka: 'badge-green',
    Experimenty: 'badge-green', Kvízy: 'badge-orange', Projekty: 'badge-pink',
    Roleplay: 'badge-purple', Analýza: 'badge-blue', Debata: 'badge-green',
    'Kreativní psaní': 'badge-orange', Infografika: 'badge-green',
    'Pojmová mapa': 'badge-purple', 'Časová osa': 'badge-gold', Proces: 'badge-blue',
    Srovnání: 'badge-mint', 'Studijní přehled': 'badge-green', Komiks: 'badge-orange',
    'Šablona promptu': 'badge-gold', Testování: 'badge-green', 'Zpětná vazba': 'badge-pink',
    'Slovní zásoba': 'badge-mint', Opakování: 'badge-gold', Grammar: 'badge-blue',
    Tenses: 'badge-purple', Reading: 'badge-blue', Listening: 'badge-mint',
    'Role-play': 'badge-orange', Vocabulary: 'badge-gold', 'Classroom English': 'badge-blue',
    Experiment: 'badge-mint', Laboratoř: 'badge-blue', Chemie: 'badge-blue',
    Fyzika: 'badge-blue', Biologie: 'badge-green', Kvíz: 'badge-green', Projekt: 'badge-green',
    Projekty: 'badge-pink', 'Historická osobnost': 'badge-gold', Osobnost: 'badge-gold',
    'Příprava na test': 'badge-purple', Chronologie: 'badge-purple',
    'Historické souvislosti': 'badge-orange', Prameny: 'badge-blue', Mapy: 'badge-blue',
    'Kritické čtení': 'badge-mint', Perspektiva: 'badge-purple',
    'Regionální dějiny': 'badge-green', Výstava: 'badge-gold', 'Odborný text': 'badge-purple',
    'Historická data': 'badge-blue', Esej: 'badge-purple', Média: 'badge-orange',
    'Životní prostředí': 'badge-orange', Bezpečnost: 'badge-orange', Geologie: 'badge-orange',
    Astronomie: 'badge-blue', Energie: 'badge-gold', Ekologie: 'badge-green',
    Člověk: 'badge-pink', Tělesa: 'badge-mint', Jednotky: 'badge-mint', Čísla: 'badge-mint',
    Algebra: 'badge-blue', Geometrie: 'badge-blue', Funkce: 'badge-blue', Data: 'badge-green',
    Vzory: 'badge-gold', Úměrnost: 'badge-orange', Procenta: 'badge-gold', Zlomky: 'badge-gold',
    Statistika: 'badge-green', Pravděpodobnost: 'badge-purple', Finance: 'badge-orange',
    Výklad: 'badge-blue', Modelování: 'badge-green', Chyby: 'badge-pink', Podpora: 'badge-mint',
    Hodnocení: 'badge-pink', Psaní: 'badge-gold', Pravopis: 'badge-pink',
    Interpunkce: 'badge-orange', Mluvnice: 'badge-blue', Syntax: 'badge-blue',
    Souvětí: 'badge-purple', Čtení: 'badge-blue', Četba: 'badge-green', Porozumění: 'badge-green',
    Interpretace: 'badge-pink', Argumentace: 'badge-purple', Tvoření: 'badge-mint',
    Mluvení: 'badge-blue', Zkoušení: 'badge-purple', Diktát: 'badge-blue',
    'Příprava na ústní zkoušení': 'badge-purple', 'Výzkumná otázka': 'badge-blue',
    Pozorování: 'badge-green', Závěr: 'badge-purple', 'Myšlenkový experiment': 'badge-purple',
    Bádání: 'badge-blue', 'Vizuální pramen': 'badge-blue', 'Historická mapa': 'badge-blue',
    'Historická debata': 'badge-orange', 'Dobový článek': 'badge-orange',
    'Místní dějiny': 'badge-green', Klasifikace: 'badge-mint', Komunikace: 'badge-blue',
    Reflexe: 'badge-blue', Translation: 'badge-blue', Pronunciation: 'badge-mint',
    Speaking: 'badge-purple', 'Opinion essay': 'badge-purple', Practice: 'badge-orange',
    'Exam prep': 'badge-orange', Feedback: 'badge-pink', Writing: 'badge-pink',
    Dictation: 'badge-blue', CEFR: 'badge-mint', Obecný: 'badge-gray'
};

const LIBRARY_BADGE_CLASSES = {
    "prompt-vzdelavaci-infografika": "badge-green",
    "prompt-pojmova-mapa": "badge-purple",
    "prompt-casova-osa": "badge-gold",
    "prompt-proces-cyklus": "badge-blue",
    "prompt-srovnavaci-vizual": "badge-mint",
    "prompt-studijni-prehled": "badge-green",
    "prompt-vzdelavaci-komiks": "badge-orange",
    "library-general-generator-testovych-otazek": "badge-green",
    "library-general-plan-hodiny-45-minut": "badge-blue",
    "library-general-diferenciace-pro-ruzne-urovne": "badge-orange",
    "library-general-zpetna-vazba-k-zakovskemu-vytvoru": "badge-pink",
    "library-general-skupinove-projektove-zadani": "badge-mint",
    "library-general-komunikace-s-rodici-sablona-dopisu": "badge-blue",
    "prompt-generator-slovnich-uloh": "badge-gold",
    "library-math-krok-za-krokem-vyklad-tematu": "badge-blue",
    "prompt-opravovac-slohu-s-rubrikou": "badge-pink",
    "prompt-konverzacni-partner-v-anglictine": "badge-mint",
    "library-math-zlomky-porovnani-a-operace": "badge-gold",
    "library-math-procenta-v-kazdodennim-zivote": "badge-gold",
    "library-math-rovnice-krok-za-krokem": "badge-blue",
    "library-math-slovni-ulohy-s-kontrolou": "badge-green",
    "library-math-prevody-jednotek": "badge-mint",
    "library-math-obvod-a-obsah-geometrickych-utvaru": "badge-blue",
    "library-math-pythagorova-veta": "badge-purple",
    "library-math-desetinna-cisla-a-zaokrouhlovani": "badge-mint",
    "library-math-pomer-a-umernost": "badge-orange",
    "library-math-funkce-z-tabulky-do-grafu": "badge-blue",
    "library-math-cteni-a-tvorba-grafu": "badge-green",
    "library-math-pravdepodobnost-v-jednoduchych-pokusech": "badge-purple",
    "prompt-statistika-ze-tridnich-dat": "badge-green",
    "library-math-ciselne-rady-a-vzory": "badge-gold",
    "library-math-algebraicke-vyrazy": "badge-blue",
    "library-math-uhly-a-konstrukce": "badge-purple",
    "library-math-telesa-a-objem": "badge-mint",
    "library-math-financni-matematika-pro-skolu": "badge-orange",
    "library-math-najdi-chybu-v-reseni": "badge-pink",
    "prompt-napoveda-bez-prozrazeni-vysledku": "badge-mint",
    "library-math-tri-urovne-stejneho-cile": "badge-orange",
    "library-math-strategie-pro-cermat": "badge-purple",
    "library-math-matematicky-exit-ticket": "badge-blue",
    "library-math-matematicky-projekt-z-realnych-dat": "badge-green",
    "library-math-hodnotici-rubrika-pro-matematiku": "badge-pink",
    "library-czech-vyjmenovana-slova-v-kontextu": "badge-pink",
    "library-czech-i-y-v-koncovkach": "badge-blue",
    "library-czech-interpunkce-v-souveti": "badge-orange",
    "library-czech-slovni-druhy": "badge-purple",
    "library-czech-vetne-cleny-v-nakresu": "badge-blue",
    "library-czech-druhy-vedlejsich-vet": "badge-purple",
    "library-czech-prima-a-neprima-rec": "badge-orange",
    "prompt-pravopisna-korektura": "badge-pink",
    "library-czech-synonyma-a-antonyma": "badge-mint",
    "library-czech-frazeologie-a-ustalena-spojeni": "badge-gold",
    "library-czech-shrnuti-odborneho-textu": "badge-blue",
    "library-czech-ctenarska-gramotnost": "badge-green",
    "prompt-literarni-rozbor-dila": "badge-purple",
    "library-czech-postavy-motivy-a-vztahy": "badge-pink",
    "library-czech-porovnani-dvou-literarnich-del": "badge-blue",
    "library-czech-slohovy-utvar-krok-za-krokem": "badge-orange",
    "library-czech-osnova-slohove-prace": "badge-gold",
    "library-czech-zpetna-vazba-k-textu-bez-prepsani": "badge-pink",
    "library-czech-argumentacni-text": "badge-purple",
    "library-czech-kreativni-psani-s-omezenim": "badge-mint",
    "library-czech-medialni-gramotnost": "badge-orange",
    "library-czech-mluvni-cviceni": "badge-blue",
    "library-czech-priprava-na-ustni-zkousku": "badge-purple",
    "library-czech-kviz-z-cetby": "badge-green",
    "library-czech-diferencovany-pracovni-list-z-cestiny": "badge-orange",
    "library-english-tematicka-slovni-zasoba": "badge-mint",
    "library-english-opakovani-slovni-zasoby-v-case": "badge-green",
    "library-english-gramatika-s-jednoduchym-vysvetlenim": "badge-blue",
    "library-english-porovnani-anglickych-casu": "badge-purple",
    "library-english-oprava-chyb-bez-preruseni-komunikace": "badge-pink",
    "library-english-doplnovani-podle-pravidla": "badge-orange",
    "library-english-cteni-s-porozumenim": "badge-blue",
    "library-english-poslechovy-pracovni-list": "badge-mint",
    "library-english-popis-obrazku": "badge-purple",
    "library-english-role-play-v-anglictine": "badge-orange",
    "library-english-classroom-english": "badge-blue",
    "library-english-vyslovnost-a-rytmus-vety": "badge-mint",
    "library-english-email-v-anglictine": "badge-pink",
    "prompt-opinion-essay": "badge-purple",
    "library-english-cambridge-fce-cae-uloha": "badge-orange",
    "library-english-preklad-s-kulturnim-kontextem": "badge-blue",
    "library-english-adaptace-textu-podle-cefr": "badge-mint",
    "library-english-speaking-cards": "badge-purple",
    "library-english-debata-s-rolemi": "badge-orange",
    "library-english-projekt-v-anglictine": "badge-green",
    "library-english-diktat-se-zpetnou-vazbou": "badge-blue",
    "library-english-exit-ticket-v-anglictine": "badge-mint",
    "library-english-vocabulary-quiz": "badge-gold",
    "library-english-priprava-na-ustni-zkouseni": "badge-purple",
    "library-english-diferencovany-anglicky-pracovni-list": "badge-orange",
    "prompt-plan-laboratorniho-experimentu": "badge-mint",
    "library-science-hypoteza-a-vyzkumna-otazka": "badge-blue",
    "library-science-promenne-v-experimentu": "badge-purple",
    "library-science-bezpecnost-v-laboratori": "badge-orange",
    "library-science-pozorovani-bez-domnenek": "badge-green",
    "library-science-tabulka-laboratornich-dat": "badge-blue",
    "library-science-cteni-grafu-z-experimentu": "badge-mint",
    "library-science-vysledek-zaver-a-omezeni": "badge-purple",
    "library-science-bunka-jako-system": "badge-green",
    "library-science-trideni-organismu": "badge-mint",
    "library-science-potravni-retezec-a-sit": "badge-green",
    "library-science-ekosystem-a-lidsky-zasah": "badge-orange",
    "library-science-lidske-telo-a-organove-soustavy": "badge-pink",
    "library-science-chemicka-rovnice-s-kontrolou-atomu": "badge-blue",
    "library-science-periodicka-tabulka-jako-mapa": "badge-purple",
    "library-science-roztoky-a-koncentrace": "badge-mint",
    "library-science-kyseliny-zasady-a-ph": "badge-orange",
    "library-science-sila-a-pohyb": "badge-blue",
    "library-science-elektricky-obvod": "badge-mint",
    "library-science-premeny-energie": "badge-gold",
    "library-science-skupenstvi-a-zmeny-skupenstvi": "badge-purple",
    "library-science-horniny-a-geologicky-proces": "badge-orange",
    "library-science-astronomie-a-meritko": "badge-blue",
    "library-science-environmentalni-problem-jako-pripadova-studie": "badge-green",
    "prompt-vedecky-text-pro-zaky": "badge-purple",
    "library-science-odhaleni-mylne-predstavy": "badge-pink",
    "library-science-protokol-z-laboratorni-prace": "badge-blue",
    "library-science-badatelsky-projekt": "badge-green",
    "prompt-casova-osa-udalosti": "badge-purple",
    "library-history-priciny-a-dusledky": "badge-orange",
    "library-history-prace-s-primarnim-pramenem": "badge-blue",
    "library-history-kritika-historickeho-zdroje": "badge-mint",
    "library-history-historicka-perspektiva": "badge-purple",
    "library-history-srovnani-historickych-obdobi": "badge-blue",
    "prompt-historicka-osobnost": "badge-gold",
    "library-history-historicke-pojmy-a-slovnicek": "badge-mint",
    "library-history-historicka-mapa": "badge-blue",
    "library-history-chronologicke-razeni": "badge-purple",
    "library-history-historicka-debata": "badge-orange",
    "library-history-propaganda-a-historicke-sdeleni": "badge-pink",
    "library-history-oralni-historie": "badge-mint",
    "library-history-mistni-dejiny": "badge-green",
    "library-history-muzejni-vystava-ve-tride": "badge-gold",
    "library-history-dobovy-novinovy-clanek": "badge-orange",
    "library-history-analyza-historickeho-obrazu": "badge-blue",
    "library-history-historicka-data-a-graf": "badge-green",
    "library-history-teze-historicke-eseje": "badge-purple",
    "library-history-otazky-k-maturite-nebo-testu": "badge-orange",
    "library-history-historicky-kviz-s-vysvetlenim": "badge-green",
    "library-history-historicky-projekt-s-prameny": "badge-mint",
    "library-history-co-kdyby-v-historii": "badge-purple",
    "library-history-karticky-pro-opakovani-dejepisu": "badge-gold",
    "library-history-diferenciace-v-dejepisu": "badge-orange",
};

const VIBE_BADGE_CLASSES = {
    'vibe-interaktivni-kviz': 'badge-mint',
    'vibe-flashcards': 'badge-purple',
    'vibe-vyukove-pexeso': 'badge-orange',
    'vibe-drag-drop-prirazovani': 'badge-blue',
    'vibe-generator-nahodnych-otazek': 'badge-gold',
    'vibe-interaktivni-casova-osa': 'badge-purple',
    'vibe-interaktivni-pracovni-list': 'badge-orange',
    'vibe-vyukova-unikova-hra': 'badge-purple',
    'vibe-vyukova-simulace': 'badge-blue',
    'vibe-vyukova-hra-s-postupem-a-body': 'badge-gold',
    'vibe-univerzalni-dodatek-bezpecnost': 'badge-mint'
};

const VIBE_TAG_BADGE_CLASSES = {
    'vibe-interaktivni-kviz': { 'Kvíz': 'badge-mint', 'Všechny předměty': 'badge-blue' },
    'vibe-flashcards': { Flashcards: 'badge-purple', 'Opakování': 'badge-green' },
    'vibe-vyukove-pexeso': { Hra: 'badge-orange', 'Přiřazování': 'badge-mint' },
    'vibe-drag-drop-prirazovani': { 'Drag & drop': 'badge-blue', 'Dotykové ovládání': 'badge-green' },
    'vibe-generator-nahodnych-otazek': { Generátor: 'badge-gold', 'Interaktivní tabule': 'badge-purple' },
    'vibe-interaktivni-casova-osa': { 'Časová osa': 'badge-mint', Dějepis: 'badge-purple' },
    'vibe-interaktivni-pracovni-list': { 'Pracovní list': 'badge-orange', Vyhodnocení: 'badge-blue' },
    'vibe-vyukova-unikova-hra': { 'Úniková hra': 'badge-purple', Příběh: 'badge-gold' },
    'vibe-vyukova-simulace': { Simulace: 'badge-blue', Experimentování: 'badge-mint' },
    'vibe-vyukova-hra-s-postupem-a-body': { 'Výuková hra': 'badge-gold', Body: 'badge-green' }
};

function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (character) => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[character]));
}

function normalizePromptText(value) {
    return String(value).replace(/\r\n?/g, '\n').replace(/\u00a0/g, ' ')
        .split('\n').map((line) => line.replace(/[ \t]+/g, ' ').trim()).join('\n')
        .replace(/\n{3,}/g, '\n\n').trim();
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
    const seenTexts = new Map();
    prompts.forEach((prompt, index) => {
        const label = `record ${index + 1}`;
        if (!prompt || typeof prompt !== 'object') throw new Error(`${label} must be an object`);
        ['id', 'title', 'prompt', 'sourcePage'].forEach((field) => {
            if (typeof prompt[field] !== 'string' || !prompt[field].trim()) {
                throw new Error(`${label} requires non-empty ${field}`);
            }
        });
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)+$/.test(prompt.id) &&
            !/^prompt-[a-z0-9]+(?:-[a-z0-9]+)+$/.test(prompt.id)) {
            throw new Error(`${label} has invalid stable id: ${prompt.id}`);
        }
        if (seenIds.has(prompt.id)) throw new Error(`duplicate prompt id: ${prompt.id}`);
        seenIds.add(prompt.id);
        if (!SUBJECT_PAGE_BY_PAGE.has(prompt.sourcePage) &&
            prompt.sourcePage !== LIBRARY_PAGE && prompt.sourcePage !== VIBE_PAGE) {
            throw new Error(`${label} has unknown sourcePage: ${prompt.sourcePage}`);
        }
        if (prompt.lead !== undefined && typeof prompt.lead !== 'string') {
            throw new Error(`${label} lead must be a string when present`);
        }
        ['subjects', 'levels', 'tools', 'collections', 'tags'].forEach((field) => {
            if (!Array.isArray(prompt[field]) || prompt[field].some((value) => typeof value !== 'string')) {
                throw new Error(`${label} requires string array ${field}`);
            }
        });
        const normalized = normalizePromptText(prompt.prompt);
        if (seenTexts.has(normalized)) {
            throw new Error(`exact duplicate prompt text: ${prompt.id} and ${seenTexts.get(normalized)}`);
        }
        seenTexts.set(normalized, prompt.id);

        if (prompt.sourcePage === LIBRARY_PAGE) {
            if (typeof prompt.librarySection !== 'string' || !LIBRARY_SECTION_BY_KEY.has(prompt.librarySection)) {
                throw new Error(`${label} requires valid librarySection`);
            }
            if (typeof prompt.filterKey !== 'string' || !FILTER_KEYS.has(prompt.filterKey)) {
                throw new Error(`${label} requires valid filterKey`);
            }
            if (!prompt.collections.includes('prompty')) {
                throw new Error(`${label} must belong to the prompty collection`);
            }
        }
        if (prompt.sourcePage === VIBE_PAGE) {
            if (!prompt.collections.includes('vibe-coding')) {
                throw new Error(`${label} must belong to the vibe-coding collection`);
            }
            const vibeSections = VIBE_SECTIONS.filter((section) => prompt.collections.includes(section.collection));
            if (vibeSections.length !== 1) {
                throw new Error(`${label} requires exactly one valid Vibe Coding section collection`);
            }
        }
    });

    SUBJECT_TARGETS.forEach((target) => {
        const count = prompts.filter((prompt) => (
            prompt.sourcePage === target.page && prompt.collections.includes(target.collection)
        )).length;
        if (count !== 4) throw new Error(`expected exactly 4 prompts for ${target.page}, found ${count}`);
    });

    if (prompts.length !== 176) throw new Error(`expected exactly 176 prompts, found ${prompts.length}`);
    const subjectCount = prompts.filter((prompt) => SUBJECT_PAGE_BY_PAGE.has(prompt.sourcePage)).length;
    const libraryCount = prompts.filter((prompt) => prompt.sourcePage === LIBRARY_PAGE).length;
    const vibeCount = prompts.filter((prompt) => prompt.sourcePage === VIBE_PAGE).length;
    if (subjectCount !== 20) throw new Error(`expected exactly 20 subject prompts, found ${subjectCount}`);
    if (libraryCount !== 145) throw new Error(`expected exactly 145 library prompts, found ${libraryCount}`);
    if (vibeCount !== 11) throw new Error(`expected exactly 11 Vibe Coding prompts, found ${vibeCount}`);
    LIBRARY_SECTIONS.forEach((section) => {
        const cards = prompts.filter((prompt) => prompt.librarySection === section.key);
        if (cards.length !== section.count) {
            throw new Error(`expected ${section.count} prompts in ${section.key}, found ${cards.length}`);
        }
        if (section.filterKey && cards.some((prompt) => prompt.filterKey !== section.filterKey)) {
            throw new Error(`unexpected filterKey in ${section.key}`);
        }
    });
    VIBE_SECTIONS.forEach((section) => {
        const cards = prompts.filter((prompt) => (
            prompt.sourcePage === VIBE_PAGE && prompt.collections.includes(section.collection)
        ));
        if (cards.length !== section.count) {
            throw new Error(`expected ${section.count} prompts in ${section.key}, found ${cards.length}`);
        }
    });
    return prompts;
}

function renderBadge(label, badgeClass) {
    return `<span class="badge ${badgeClass}">${escapeHtml(label)}</span>`;
}

function htmlId(prompt) {
    return prompt.id.startsWith('prompt-') ? prompt.id : `prompt-${prompt.id}`;
}

function renderCard(prompt, newline, variant) {
    const metadataBadges = variant === 'vibe'
        ? prompt.tags.map((tag) => renderBadge(
            tag,
            VIBE_TAG_BADGE_CLASSES[prompt.id]?.[tag] || 'badge-gray'
        )).join('')
        : [
            ...prompt.tools.map((tool) => renderBadge(tool, TOOL_BADGE_CLASSES[tool] || 'badge-gray')),
            ...prompt.levels.map((level) => renderBadge(level, 'badge-gray'))
        ].join('');
    const lead = prompt.lead
        ? `${newline}                                <div class="prompt-lead">${escapeHtml(prompt.lead)}</div>`
        : '';
    const metadataRow = variant === 'subject' || metadataBadges
        ? `${newline}                                <div style="display:flex;gap:6px;margin-top:6px">${metadataBadges}</div>`
        : '';
    const filterAttribute = prompt.filterKey ? ` data-subject="${escapeHtml(prompt.filterKey)}"` : '';
    const categoryClass = variant === 'library'
        ? (LIBRARY_BADGE_CLASSES[prompt.id] || CATEGORY_BADGE_CLASSES[prompt.category] || 'badge-gray')
        : variant === 'vibe'
            ? (VIBE_BADGE_CLASSES[prompt.id] || 'badge-gray')
            : (CATEGORY_BADGE_CLASSES[prompt.category] || 'badge-gray');
    const lines = [
        `                    <div id="${escapeHtml(htmlId(prompt))}" class="prompt-card reveal"${filterAttribute}>`,
        '                        <div class="prompt-header">',
        '                            <div>',
        `                                <div class="prompt-title">${escapeHtml(prompt.title)}</div>${lead}${metadataRow}`,
        '                            </div>',
        '                        </div>',
        `                        <div class="prompt-body">${escapeHtml(prompt.prompt)}</div>`,
        '                        <div class="prompt-footer">'
    ];
    if (prompt.category) {
        lines.push(`                            <span class="badge ${categoryClass}">${escapeHtml(prompt.category)}</span>`);
    }
    lines.push(
        `                            <button class="copy-btn" type="button" data-copy="${escapeHtml(prompt.prompt)}">📋 Kopírovat</button>`,
        '                        </div>',
        '                    </div>'
    );
    return lines.join(newline);
}

function getParts(html, page, markers) {
    const start = html.indexOf(markers.start);
    const end = html.indexOf(markers.end);
    if (start === -1 || end === -1 || end < start) {
        throw new Error(`generated markers are missing or out of order in ${page}`);
    }
    if (html.indexOf(markers.start, start + markers.start.length) !== -1 ||
        html.indexOf(markers.end, end + markers.end.length) !== -1) {
        throw new Error(`generated markers must occur exactly once in ${page}`);
    }
    const lastNewline = html.lastIndexOf('\n', end);
    const endIndent = html.slice(lastNewline + 1, end);
    if (!/^\s*$/.test(endIndent)) throw new Error(`end marker must be on its own indented line in ${page}`);
    return {
        newline: html.includes('\r\n') ? '\r\n' : '\n', endIndent,
        currentRegion: html.slice(start + markers.start.length, end), start, end
    };
}

function buildExpectedRegion(cards, parts, variant) {
    return `${parts.newline}${cards.map((prompt) => renderCard(prompt, parts.newline, variant)).join(parts.newline)}${parts.newline}${parts.endIndent}`;
}

function replaceRegion(html, parts, markers, expectedRegion) {
    return html.slice(0, parts.start + markers.start.length) + expectedRegion + html.slice(parts.end);
}

function markerPair(sectionKey) {
    return {
        start: `<!-- GENERATED:PROMPTS:${sectionKey}:START -->`,
        end: `<!-- GENERATED:PROMPTS:${sectionKey}:END -->`
    };
}

function inspectTarget(page, markers, cards, variant) {
    const htmlPath = path.join(ROOT, page);
    const html = fs.readFileSync(htmlPath, 'utf8');
    const parts = getParts(html, page, markers);
    const expectedRegion = buildExpectedRegion(cards, parts, variant);
    return { page, htmlPath, html, parts, expectedRegion, drift: parts.currentRegion !== expectedRegion, cards };
}

function main() {
    const checkOnly = process.argv.includes('--check');
    if (process.argv.length > 3 || (process.argv.length === 3 && !checkOnly)) {
        throw new Error('usage: node scripts/generate-prompts.js [--check]');
    }

    const prompts = readPrompts();
    const inspections = [];
    SUBJECT_TARGETS.forEach((target) => {
        const cards = prompts.filter((prompt) => (
            prompt.sourcePage === target.page && prompt.collections.includes(target.collection)
        ));
        inspections.push(inspectTarget(target.page,
            { start: SUBJECT_START_MARKER, end: SUBJECT_END_MARKER }, cards, 'subject'));
    });
    LIBRARY_SECTIONS.forEach((section) => {
        const cards = prompts.filter((prompt) => prompt.librarySection === section.key);
        inspections.push(inspectTarget(LIBRARY_PAGE, markerPair(section.key), cards, 'library'));
    });
    VIBE_SECTIONS.forEach((section) => {
        const cards = prompts.filter((prompt) => (
            prompt.sourcePage === VIBE_PAGE && prompt.collections.includes(section.collection)
        ));
        inspections.push(inspectTarget(VIBE_PAGE, markerPair(section.key), cards, 'vibe'));
    });

    const driftCount = inspections.filter((inspection) => inspection.drift).length;
    const subjectInspections = inspections.slice(0, SUBJECT_TARGETS.length);
    const libraryStart = SUBJECT_TARGETS.length;
    const libraryEnd = libraryStart + LIBRARY_SECTIONS.length;
    const libraryInspections = inspections.slice(libraryStart, libraryEnd);
    const vibeInspections = inspections.slice(libraryEnd);
    console.log('Prompt generation check');
    console.log('-----------------------');
    console.log('Subject pages:');
    subjectInspections.forEach((inspection) => console.log(
        `${inspection.page}: ${inspection.drift ? 'DRIFT' : 'OK'} (${inspection.cards.length})`
    ));
    console.log('Library sections:');
    libraryInspections.forEach((inspection, index) => {
        const section = LIBRARY_SECTIONS[index];
        console.log(`${section.key}: ${inspection.drift ? 'DRIFT' : 'OK'} (${inspection.cards.length})`);
    });
    console.log('Vibe Coding:');
    const vibeDrift = vibeInspections.some((inspection) => inspection.drift);
    const vibeCount = vibeInspections.reduce((sum, inspection) => sum + inspection.cards.length, 0);
    console.log(`${VIBE_PAGE}: ${vibeDrift ? 'DRIFT' : 'OK'} (${vibeCount})`);
    vibeInspections.forEach((inspection, index) => {
        const section = VIBE_SECTIONS[index];
        console.log(`  ${section.key}: ${inspection.drift ? 'DRIFT' : 'OK'} (${inspection.cards.length})`);
    });
    console.log('Summary:');
    console.log(`Registry prompts: ${prompts.length}`);
    console.log(`Subject prompts: ${subjectInspections.reduce((sum, inspection) => sum + inspection.cards.length, 0)}`);
    console.log(`Library prompts: ${libraryInspections.reduce((sum, inspection) => sum + inspection.cards.length, 0)}`);
    console.log(`Vibe Coding prompts: ${vibeCount}`);
    console.log(`Pages: ${SUBJECT_TARGETS.length + 2}`);
    console.log(`Library sections: ${LIBRARY_SECTIONS.length}`);
    console.log(`Vibe Coding sections: ${VIBE_SECTIONS.length}`);
    console.log(`Drift: ${driftCount}`);

    if (checkOnly) {
        if (driftCount) process.exitCode = 1;
        return;
    }
    const inspectionsByPath = new Map();
    inspections.forEach((inspection, index) => {
        if (!inspection.drift) return;
        let markers;
        if (index < SUBJECT_TARGETS.length) {
            markers = { start: SUBJECT_START_MARKER, end: SUBJECT_END_MARKER };
        } else if (index < libraryEnd) {
            markers = markerPair(LIBRARY_SECTIONS[index - libraryStart].key);
        } else {
            markers = markerPair(VIBE_SECTIONS[index - libraryEnd].key);
        }
        if (!inspectionsByPath.has(inspection.htmlPath)) inspectionsByPath.set(inspection.htmlPath, []);
        inspectionsByPath.get(inspection.htmlPath).push({ inspection, markers });
    });
    inspectionsByPath.forEach((items, htmlPath) => {
        let updated = items[0].inspection.html;
        items.sort((left, right) => right.inspection.parts.start - left.inspection.parts.start)
            .forEach(({ inspection, markers }) => {
                updated = replaceRegion(updated, inspection.parts, markers, inspection.expectedRegion);
            });
        fs.writeFileSync(htmlPath, updated, 'utf8');
    });
}

try {
    main();
} catch (error) {
    fail(error.message);
}
