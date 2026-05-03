// ============================================================
// MUNEEB UR REHMAN — Portfolio Script
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ===== CUSTOM CURSOR =====
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');

  if (cursor && follower) {
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.left = mouseX + 'px';
      cursor.style.top = mouseY + 'px';
    });

    function animateFollower() {
      followerX += (mouseX - followerX) * 0.12;
      followerY += (mouseY - followerY) * 0.12;
      follower.style.left = followerX + 'px';
      follower.style.top = followerY + 'px';
      requestAnimationFrame(animateFollower);
    }
    animateFollower();

    document.querySelectorAll('a, button, .project-card, .service-card, .contact-card').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(2)';
        follower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        follower.style.borderColor = 'rgba(139,92,246,0.6)';
      });
      el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.transform = 'translate(-50%, -50%) scale(1)';
        follower.style.borderColor = 'rgba(255,255,255,0.4)';
      });
    });
  }

  // ===== NAVBAR SCROLL =====
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  });

  // ===== SMOOTH SCROLL =====
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
  });

  // ===== THEME TOGGLE =====
  const themeToggle = document.getElementById('themeToggle');
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') document.body.classList.add('light-mode');

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
  });

  // ===== TYPEWRITER EFFECT =====
  const typedEl = document.getElementById('typed');
  const phrases = [
    'BS Computer Science',
    'AI & ML Developer',
    'Deep Learning Engineer',
    'Prompt Engineer',
    'FYP Consultant'
  ];
  let phraseIdx = 0, charIdx = 0, isDeleting = false;

  function typeWriter() {
    if (!typedEl) return;
    const current = phrases[phraseIdx];
    const display = isDeleting ? current.substring(0, charIdx--) : current.substring(0, charIdx++);
    typedEl.textContent = display;
    typedEl.insertAdjacentHTML('afterend', '');

    if (!isDeleting && charIdx === current.length + 1) {
      setTimeout(() => { isDeleting = true; }, 1800);
      setTimeout(typeWriter, 2000);
      return;
    }
    if (isDeleting && charIdx < 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      setTimeout(typeWriter, 400);
      return;
    }
    setTimeout(typeWriter, isDeleting ? 50 : 80);
  }
  typeWriter();

  // ===== INTERSECTION OBSERVER — FADE UPS =====
  const fadeElements = document.querySelectorAll('.project-card, .service-card, .skill-item, .contact-card');
  fadeElements.forEach(el => el.classList.add('fade-up'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-up').forEach(el => observer.observe(el));

  // ===== SKILL BARS ANIMATION =====
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const bar = entry.target.querySelector('.progress');
        if (bar) {
          const target = bar.getAttribute('data-width');
          setTimeout(() => { bar.style.width = target; }, 200);
        }
        skillObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-item').forEach(el => skillObserver.observe(el));

  // ===== ACTIVE NAV LINK ON SCROLL =====
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-item');

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navItems.forEach(item => item.classList.remove('active'));
        const active = document.querySelector(`.nav-item[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionObserver.observe(s));

});