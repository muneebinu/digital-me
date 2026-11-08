(() => {
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('nav');
  const setMenu = open => {
    nav.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
  };
  btn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', e => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });

  const links = [...nav.querySelectorAll('a[href^="#"]:not(.btn)')];
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  links.forEach(a => { const s = document.querySelector(a.getAttribute('href')); if (s) io.observe(s); });
})();
