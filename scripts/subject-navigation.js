const SUBJECTS = [
    { id: 'matematika', label: 'Matematika', icon: '🔢', file: 'matematika.html' },
    { id: 'cestina', label: 'Český jazyk', icon: '📖', file: 'cestina.html' },
    { id: 'anglictina', label: 'Anglický jazyk', icon: '🇬🇧', file: 'anglictina.html' },
    { id: 'prirodoveda', label: 'Přírodní vědy', icon: '🔬', file: 'prirodoveda.html' },
    { id: 'dejepis', label: 'Dějepis', icon: '🏛️', file: 'dejepis.html' }
];

const SECTIONS = [
    { href: 'prompty.html', label: '✨ Prompty' },
    { href: 'asistenti.html', label: '🤖 AI Asistenti' },
    { href: 'aktivity.html', label: '🎯 Aktivity' },
    { href: 'ai.html', label: '🧠 AI pro školy' },
    { href: 'vibe-coding.html', label: '💻 Vibe Coding' },
    { href: 'qr-kod.html', label: '🔳 QR kód' }
];

function subjectLinks(currentId, className, indent) {
    return SUBJECTS.map(subject => {
        const current = subject.id === currentId;
        return `${indent}<a href="${subject.file}" class="${className}${current ? ' active' : ''}"${current ? ' aria-current="page"' : ''}><span class="item-icon" aria-hidden="true">${subject.icon}</span>${subject.label}</a>`;
    }).join('\n');
}

function sectionLinks(currentId, className, indent) {
    return SECTIONS.map(section => {
        const current = section.href === `${currentId}.html`;
        return `${indent}<a href="${section.href}" class="${className}${current ? ' active' : ''}"${current ? ' aria-current="page"' : ''}>${section.label}</a>`;
    }).join('\n');
}

function buildSubjectNavigation(currentId) {
    if (!SUBJECTS.some(subject => subject.id === currentId)) throw new Error(`Unknown subject: ${currentId}`);
    return `    <nav class="nav" id="nav" aria-label="Hlavní navigace">
        <div class="nav-inner">
            <a href="index.html" class="nav-logo" aria-label="AI ve Výuce – úvodní stránka">
                <span class="nav-logo-icon" aria-hidden="true"></span>AI ve <span>Výuce</span>
            </a>
            <div class="nav-links">
                <div class="nav-dropdown">
                    <button type="button" class="nav-link active subject-nav-toggle" aria-haspopup="true" aria-expanded="false" aria-controls="subject-desktop-subjects">📚 Předměty <i class="fa-solid fa-chevron-down" aria-hidden="true" style="font-size:.65rem"></i></button>
                    <div class="nav-dropdown-menu" id="subject-desktop-subjects" aria-label="Předmětové stránky">
${subjectLinks(currentId, 'nav-dropdown-item', '                        ')}
                    </div>
                </div>
${sectionLinks(currentId, 'nav-link', '                ')}
            </div>
            <button type="button" class="nav-mobile-toggle" aria-expanded="false" aria-label="Otevřít navigaci" aria-controls="subject-mobile-menu"><span></span><span></span><span></span></button>
        </div>
    </nav>
    <div class="mobile-menu subject-mobile-menu" id="subject-mobile-menu" role="navigation" aria-label="Mobilní navigace">
        <a href="index.html" class="nav-link">🏠 Domů</a>
        <details class="subject-mobile-group">
            <summary class="nav-link">📚 Předměty</summary>
            <div class="subject-mobile-links">
${subjectLinks(currentId, 'nav-link', '                ')}
            </div>
        </details>
${sectionLinks(currentId, 'nav-link', '        ')}
    </div>`;
}

module.exports = { SUBJECTS, SECTIONS, buildSubjectNavigation };
