const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Sticky header finish and section-aware navigation.
const header = document.querySelector('.site-header');
const navLinks = [...document.querySelectorAll('.desktop-nav a, .mobile-menu a')];
const sections = navLinks.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean);
const updateHeader = () => header?.classList.toggle('is-scrolled', window.scrollY > 18);
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();

if ('IntersectionObserver' in window) {
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

// Mobile navigation: accessible open/close, Escape key and close after selection.
const menuButton = document.querySelector('.menu-toggle');
const mobileMenu = document.querySelector('.mobile-menu');
function closeMenu() {
  if (!menuButton || !mobileMenu) return;
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  mobileMenu.hidden = true;
  document.body.classList.remove('menu-open');
}
menuButton?.addEventListener('click', () => {
  const opening = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(opening));
  menuButton.setAttribute('aria-label', opening ? 'Close navigation' : 'Open navigation');
  mobileMenu.hidden = !opening;
  document.body.classList.toggle('menu-open', opening);
});
mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeMenu(); });

// Project filters keep the full catalogue in the page while making it easier to browse.
const filters = [...document.querySelectorAll('.filter')];
const projects = [...document.querySelectorAll('.project-card')];
filters.forEach(button => button.addEventListener('click', () => {
  const selected = button.dataset.filter;
  filters.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  projects.forEach(project => {
    const categories = (project.dataset.category || '').split(' ');
    const show = selected === 'all' || categories.includes(selected);
    project.classList.toggle('is-hidden', !show);
  });
}));

// Subtle entrance motion. Content remains visible if the browser lacks observer support.
const revealTargets = document.querySelectorAll(
  '.section-label,.about-grid,.about-facts,.work-heading,.filter-row,.project-card,.work-outro,.capabilities-head,.capability,.founder-art,.founder-copy,.contact-kicker,.contact h2,.contact-copy,.contact-email'
);
if (!reduceMotion && 'IntersectionObserver' in window) {
  revealTargets.forEach((element, index) => {
    element.classList.add('js-reveal');
    element.style.transitionDelay = Math.min((index % 4) * 75, 225) + 'ms';
  });
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -35px 0px' });
  revealTargets.forEach(element => revealObserver.observe(element));
}

// Pause the moving type strip when it is not in view or when a visitor hovers it.
const marquee = document.querySelector('.marquee-track');
if (marquee && 'IntersectionObserver' in window) {
  const marqueeObserver = new IntersectionObserver(entries => {
    marquee.style.animationPlayState = entries[0].isIntersecting ? 'running' : 'paused';
  });
  marqueeObserver.observe(marquee);
}
document.querySelector('.marquee')?.addEventListener('pointerenter', () => {
  if (marquee) marquee.style.animationPlayState = 'paused';
});
document.querySelector('.marquee')?.addEventListener('pointerleave', () => {
  if (marquee && !reduceMotion) marquee.style.animationPlayState = 'running';
});

// Keep the footer year current without needing a build step.
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
