(() => {
  const root = document.documentElement, $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('js');

  // theme
  try { const t = localStorage.getItem('theme'); if (t) root.dataset.theme = t; else if (matchMedia('(prefers-color-scheme: light)').matches) root.dataset.theme = 'light'; } catch (e) {}
  $('#theme').addEventListener('click', () => {
    const next = root.dataset.theme === 'light' ? 'dark' : 'light';
    root.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch (e) {}
  });

  // menu
  const btn = $('#menuBtn'), nav = $('#nav');
  const setMenu = o => { nav.classList.toggle('open', o); btn.setAttribute('aria-expanded', o); };
  btn.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
  nav.addEventListener('click', e => e.target.closest('a') && setMenu(false));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  // headline letters
  $$('[data-split]').forEach((el, n) => {
    const txt = el.textContent; el.textContent = ''; el.setAttribute('aria-hidden', 'true');
    [...txt].forEach((c, i) => { const s = document.createElement('span'); s.className = 'ch'; s.style.setProperty('--i', i + n * 6); s.textContent = c === ' ' ? '\u00A0' : c; el.appendChild(s); });
  });

  // scroll progress + reveal + active nav
  const bar = $('#progress');
  const onScroll = () => { const h = root.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .15 });
  $$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
  const links = $$('nav a[href^="#"]:not(.btn)');
  const so = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.classList.toggle('active', a.hash === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' });
  links.forEach(a => { const s = $(a.hash); s && so.observe(s); });

  // project showcase
  const prev = $('.preview'), img = $('#pimg'), note = $('#pnote');
  const show = li => {
    $$('.proj').forEach(p => p.classList.toggle('active', p === li));
    if (li.dataset.img) { prev.classList.add('swap'); setTimeout(() => { img.src = li.dataset.img; img.alt = li.dataset.alt; prev.classList.remove('note', 'swap'); }, calm ? 0 : 220); }
    else { note.textContent = li.dataset.note; prev.classList.add('note'); }
  };
  $$('.proj').forEach(li => { li.addEventListener('mouseenter', () => show(li)); li.addEventListener('focusin', () => show(li)); });

  // pointer-driven effects (fine pointers only)
  if (matchMedia('(pointer: fine)').matches && !calm) {
    $$('.skill-cols>div').forEach(c => c.addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px'); }));
    $$('.magnetic').forEach(m => {
      m.addEventListener('pointermove', e => { const r = m.getBoundingClientRect(); m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px,${(e.clientY - r.top - r.height / 2) * .3}px)`; });
      m.addEventListener('pointerleave', () => { m.style.transform = ''; });
    });
  }

  // copy email
  const mail = $('#copyMail'), msg = $('#copied');
  mail.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(mail.dataset.mail); msg.textContent = 'Email address copied'; }
    catch (e) { msg.textContent = 'Press Ctrl+C to copy, or use the Email link below'; }
    setTimeout(() => { msg.textContent = ''; }, 2500);
  });
})();
