/* =====================================================
   AI Pomůcky pro Učitele – Main JavaScript
   ===================================================== */

/* ── Nav scroll effect ── */
const nav = document.querySelector('.nav');
if (nav) {
    window.addEventListener('scroll', () => {
        nav.classList.toggle('scrolled', window.scrollY > 20);
    });
}

/* ── Mobile menu ── */
const mobileToggle = document.querySelector('.nav-mobile-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        const isOpen = mobileMenu.classList.contains('open');
        mobileToggle.setAttribute('aria-expanded', isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    document.querySelectorAll('.mobile-menu a').forEach(a => {
        a.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

/* ── Particle canvas (hero background) ── */
function initParticles(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;

    const symbols = ['∑', '√', '∫', 'π', 'Δ', '∞', 'α', 'β', '⚛', '🧬', 'A', 'B', 'C', '?', '!', '📚', '✏️', '🔬', '🌍', '🎓'];
    const particles = Array.from({ length: 55 }, () => ({
        x: Math.random() * W, y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 14 + 8,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        opacity: Math.random() * 0.18 + 0.04,
        color: ['#f5a623', '#00d4a8', '#4a90e2', '#9b59b6'][Math.floor(Math.random() * 4)]
    }));

    function draw() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.font = `${p.size}px 'Outfit', sans-serif`;
            ctx.fillText(p.symbol, p.x, p.y);
            p.x += p.vx; p.y += p.vy;
            if (p.x > W + 20) p.x = -20;
            if (p.x < -20) p.x = W + 20;
            if (p.y > H + 20) p.y = -20;
            if (p.y < -20) p.y = H + 20;
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(draw);
    }
    draw();

    window.addEventListener('resize', () => {
        W = canvas.offsetWidth; H = canvas.offsetHeight;
        canvas.width = W; canvas.height = H;
    });
}
initParticles('particles');

/* ── Scroll reveal ── */
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
            setTimeout(() => entry.target.classList.add('visible'), i * 80);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── Toast ── */
function showToast(msg, icon = '✅') {
    let toast = document.querySelector('.toast');
    if (!toast) {
        toast = document.createElement('div');
        toast.className = 'toast';
        document.body.appendChild(toast);
    }
    toast.innerHTML = `<span class="toast-icon">${icon}</span><span>${msg}</span>`;
    toast.classList.add('show');
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => toast.classList.remove('show'), 2800);
}

/* ── Copy to clipboard ── */
document.addEventListener('click', async (e) => {
    const btn = e.target.closest('.copy-btn');
    if (!btn) return;
    const text = btn.dataset.copy || btn.closest('.prompt-card')?.querySelector('.prompt-body')?.innerText || '';
    if (!text) return;
    const defaultCopyLabel = btn.closest('.activity-card') ? '📋 Kopírovat zadání' : '📋 Kopírovat';
    try {
        await navigator.clipboard.writeText(text.trim());
        btn.innerHTML = '✅ Zkopírováno';
        btn.classList.add('copied');
        showToast('Prompt zkopírován do schránky!');
        setTimeout(() => {
            btn.innerHTML = defaultCopyLabel;
            btn.classList.remove('copied');
        }, 2000);
    } catch {
        showToast('Kopírování selhalo – zkuste manuálně.', '⚠️');
    }
});

document.querySelectorAll('.activity-card .copy-btn').forEach(btn => {
    btn.innerHTML = '📋 Kopírovat zadání';
});

/* ── Prompt links from activity cards ── */
function promptSlug(value) {
    return value.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

function focusPromptFromHash() {
    const target = window.location.hash.replace(/^#prompt-/, '');
    if (!target || !document.querySelector('.prompt-title')) return;
    const title = [...document.querySelectorAll('.prompt-title')]
        .find(element => promptSlug(element.textContent) === target);
    const card = title?.closest('.prompt-card');
    if (!card) return;
    card.classList.add('prompt-focus');
    requestAnimationFrame(() => card.scrollIntoView({ behavior: 'smooth', block: 'center' }));
}
focusPromptFromHash();

/* ── Modal ── */
const modalOverlay = document.querySelector('.modal-overlay');
const modalClose = document.querySelector('.modal-close');

function openModal(data) {
    if (!modalOverlay) return;
    modalOverlay.querySelector('.modal-title').textContent = data.title || '';
    modalOverlay.querySelector('.modal-body').innerHTML = data.body || '';
    modalOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}
function closeModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('open');
    document.body.style.overflow = '';
}
if (modalClose) modalClose.addEventListener('click', closeModal);
if (modalOverlay) modalOverlay.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
window.openModal = openModal;

/* ── Filter chips ── */
function initFilters(gridSelector, cardSelector, filterAttr = 'data-filter') {
    const filterChips = document.querySelectorAll(`.filter-chip[${filterAttr}]`);
    const cards = document.querySelectorAll(`${gridSelector} ${cardSelector}`);
    const groupedSections = document.querySelectorAll('.subject-prompt-section');
    if (!filterChips.length) return;

    const updateGroupedSections = () => {
        groupedSections.forEach(section => {
            const hasVisibleCard = [...section.querySelectorAll(cardSelector)].some(card => card.style.display !== 'none');
            section.style.display = hasVisibleCard ? '' : 'none';
        });
    };

    filterChips.forEach(chip => {
        chip.addEventListener('click', () => {
            filterChips.forEach(c => c.classList.remove('active'));
            chip.classList.add('active');
            const val = chip.getAttribute(filterAttr);
            cards.forEach(card => {
                const match = val === 'all' || card.dataset.subject === val || card.dataset.level === val || card.dataset.llm === val || card.dataset.type === val;
                card.style.display = match ? '' : 'none';
            });
            updateGroupedSections();
        });
    });
}
initFilters('.activity-grid', '.activity-card', 'data-filter');
initFilters('.prompt-grid', '.prompt-card', 'data-filter');
initFilters('.assistant-grid', '.assistant-card', 'data-filter');

/* ── Search ── */
function initSearch(inputSelector, gridSelector, cardSelector) {
    const input = document.querySelector(inputSelector);
    const cards = document.querySelectorAll(`${gridSelector} ${cardSelector}`);
    const groupedSections = document.querySelectorAll(`.subject-prompt-section`);
    if (!input) return;
    input.addEventListener('input', () => {
        const q = input.value.toLowerCase().trim();
        cards.forEach(card => {
            const text = card.textContent.toLowerCase();
            card.style.display = text.includes(q) ? '' : 'none';
        });
        groupedSections.forEach(section => {
            const hasVisibleCard = [...section.querySelectorAll(cardSelector)].some(card => card.style.display !== 'none');
            section.style.display = hasVisibleCard ? '' : 'none';
        });
    });
}
initSearch('#search-activities', '.activity-grid', '.activity-card');
initSearch('#search-prompts', '.prompt-grid', '.prompt-card');
initSearch('#search-assistants', '.assistant-grid', '.assistant-card');

/* ── Tabs ── */
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const target = btn.dataset.tab;
        // The buttons live inside .tabs-container, while the panels are its
        // siblings in the surrounding section. Use the shared section as the
        // scope instead of searching only inside the button wrapper.
        const tabScope = btn.closest('.section') || document;
        tabScope.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        tabScope.querySelectorAll('.tab-panel').forEach(p => p.classList.add('d-none'));
        btn.classList.add('active');
        const panel = tabScope.querySelector(`#tab-${target}`);
        if (panel) panel.classList.remove('d-none');
    });
});

/* ── Active nav link ── */
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPage) link.classList.add('active');
});

/* ── Animated counters ── */
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    if (isNaN(target)) return;
    let start = 0;
    const duration = 1800;
    const step = timestamp => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target) + (el.dataset.suffix || '');
        if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}
const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            animateCounter(e.target);
            counterObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.5 });
document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));
