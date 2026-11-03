(() => {
    const dropdowns = [...document.querySelectorAll('.subject-page .nav-dropdown')];
    const closeDropdown = (dropdown, returnFocus = false) => {
        const toggle = dropdown.querySelector('.subject-nav-toggle');
        dropdown.classList.remove('is-open');
        toggle?.setAttribute('aria-expanded', 'false');
        if (returnFocus) toggle?.focus();
    };

    dropdowns.forEach(dropdown => {
        const toggle = dropdown.querySelector('.subject-nav-toggle');
        const menu = dropdown.querySelector('.nav-dropdown-menu');
        if (!toggle || !menu) return;

        toggle.addEventListener('click', () => {
            const willOpen = !dropdown.classList.contains('is-open');
            dropdowns.forEach(other => closeDropdown(other));
            if (willOpen) {
                dropdown.classList.add('is-open');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });

        toggle.addEventListener('keydown', event => {
            if (event.key !== 'ArrowDown') return;
            event.preventDefault();
            dropdown.classList.add('is-open');
            toggle.setAttribute('aria-expanded', 'true');
            menu.querySelector('a')?.focus();
        });

        dropdown.addEventListener('keydown', event => {
            if (event.key === 'Escape') closeDropdown(dropdown, true);
        });

        dropdown.addEventListener('mouseenter', () => toggle.setAttribute('aria-expanded', 'true'));
        dropdown.addEventListener('mouseleave', () => {
            if (!dropdown.classList.contains('is-open')) toggle.setAttribute('aria-expanded', 'false');
        });
        dropdown.addEventListener('focusout', event => {
            if (!dropdown.contains(event.relatedTarget)) closeDropdown(dropdown);
        });
    });

    document.addEventListener('click', event => {
        dropdowns.forEach(dropdown => {
            if (!dropdown.contains(event.target)) closeDropdown(dropdown);
        });
    });
})();
