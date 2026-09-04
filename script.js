(function() {
    'use strict';

    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    function getStoredTheme() {
        return localStorage.getItem('theme');
    }

    function setStoredTheme(theme) {
        localStorage.setItem('theme', theme);
    }

    function getPreferredTheme() {
        const storedTheme = getStoredTheme();
        if (storedTheme) {
            return storedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }

    function updateThemeUI(theme) {
        if (!themeToggle) return;
        const isDark = theme === 'dark';
        themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        themeToggle.setAttribute('title', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    }

    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        setStoredTheme(theme);
        updateThemeUI(theme);
    }

    function toggleTheme() {
        const currentTheme = html.getAttribute('data-theme') || getPreferredTheme();
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    }

    function initTheme() {
        const theme = getPreferredTheme();
        setTheme(theme);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Listen for system theme changes if no manual preference is saved
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        const storedTheme = getStoredTheme();
        if (!storedTheme) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });

    initTheme();

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (!targetId || targetId === '#') {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                return;
            }

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const header = document.querySelector('.header');
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 16;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                target.focus({ preventScroll: true });
            }
        });
    });

    // Scroll reveal animations
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        const animatedElements = document.querySelectorAll(
            '.education-card, .skill-category, .project-card, .contact-card, .hero-content, .hero-image'
        );

        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = `opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index % 4 * 0.08}s, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${index % 4 * 0.08}s`;
            observer.observe(el);
        });
    }
})();
