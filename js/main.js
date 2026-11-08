(() => {
  'use strict';

  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sticky header and current section navigation.
  const header = $('.site-header');
  const navLinks = $$('.desktop-nav a, .mobile-menu a');
  const sections = navLinks
    .map(link => $(link.getAttribute('href')))
    .filter(Boolean);

  const updateHeader = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 18);
  };
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  if ('IntersectionObserver' in window && sections.length) {
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          if (active) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-38% 0px -52% 0px' });
    sections.forEach(section => sectionObserver.observe(section));
  }

  // Accessible mobile navigation.
  const menuButton = $('.menu-toggle');
  const mobileMenu = $('.mobile-menu');
  const closeMenu = () => {
    if (!menuButton || !mobileMenu) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open navigation');
    mobileMenu.hidden = true;
    document.body.classList.remove('menu-open');
  };

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', () => {
      const opening = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(opening));
      menuButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
      mobileMenu.hidden = !opening;
      document.body.classList.toggle('menu-open', opening);
    });
    $$('a', mobileMenu).forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  // Project filters: use the native hidden state as a reliable fallback.
  const filters = $$('.filter');
  const projects = $$('.project-card');
  filters.forEach(button => {
    button.addEventListener('click', () => {
      const selected = button.dataset.filter || 'all';
      filters.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      projects.forEach(project => {
        const categories = (project.dataset.category || '').split(/\s+/);
        const visible = selected === 'all' || categories.includes(selected);
        project.hidden = !visible;
        project.classList.toggle('is-hidden', !visible);
      });
    });
  });

  // Reveal elements only when the observer is available; never leave content hidden.
  const revealTargets = $$('.section-label,.about-grid,.about-facts,.work-heading,.filter-row,.project-card,.work-outro,.capabilities-head,.capability,.founder-art,.founder-copy,.contact-kicker,.contact h2,.contact-copy,.contact-email');
  if (!reduceMotion && 'IntersectionObserver' in window && revealTargets.length) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

    revealTargets.forEach((element, index) => {
      element.classList.add('js-reveal');
      element.style.transitionDelay = Math.min((index % 4) * 65, 195) + 'ms';
      revealObserver.observe(element);
    });
  }

  // Pause the decorative marquee when off-screen or hovered.
  const marquee = $('.marquee-track');
  const marqueeShell = $('.marquee');
  if (marquee && !reduceMotion && 'IntersectionObserver' in window) {
    const marqueeObserver = new IntersectionObserver(entries => {
      marquee.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused';
    });
    marqueeObserver.observe(marquee);
  }
  marqueeShell?.addEventListener('pointerenter', () => {
    if (marquee) marquee.style.animationPlayState = 'paused';
  });
  marqueeShell?.addEventListener('pointerleave', () => {
    if (marquee && !reduceMotion) marquee.style.animationPlayState = 'running';
  });

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
