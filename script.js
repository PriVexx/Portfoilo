/* ============================================================
   script.js — Priyanshu Sharma Portfolio
   Vanilla JS replacement for all React/Framer Motion/Lenis logic
   ============================================================ */

'use strict';

/* ────────────────────────────────────────────────────────────
   1. LENIS SMOOTH SCROLL
   ──────────────────────────────────────────────────────────── */
let lenis;

function initLenis() {
  // Use Lenis from CDN (loaded in index.html)
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.1,
    easing: (t) => 1 - Math.pow(1 - t, 3),
    smoothWheel: true,
    touchMultiplier: 1.5,
  });
  window.__lenis = lenis;

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el, { offset: -72, duration: 1.2 });
  } else {
    el.scrollIntoView({ behavior: 'smooth' });
  }
}

/* ────────────────────────────────────────────────────────────
   2. SCROLL-TRIGGERED REVEAL (IntersectionObserver)
   ──────────────────────────────────────────────────────────── */
function initReveal() {
  const els = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-fade, .crack-reveal'
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '-60px 0px', threshold: 0 }
  );

  els.forEach((el) => observer.observe(el));
}

/* ────────────────────────────────────────────────────────────
   3. STICKER REVEAL (on section enter)
   ──────────────────────────────────────────────────────────── */
function initStickerReveal() {
  const stickers = document.querySelectorAll(
    '.ironman-sticker-wrap, .hulk-sticker-wrap, .cap-shield-wrap, .web-decal-wrap'
  );

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '-80px 0px', threshold: 0 }
  );

  stickers.forEach((s) => obs.observe(s));
}

/* ────────────────────────────────────────────────────────────
   4. NAVBAR: scroll state + active section + mobile menu
   ──────────────────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const navLinkBtns = document.querySelectorAll('.nav-link-btn');
  const mobileBtns = document.querySelectorAll('.mobile-nav-btn');
  const NAV_SECTIONS = ['home','about','journey','education','skills','projects','achievements','contact'];

  // Scroll → glassmorphism
  function onScroll() {
    if (window.scrollY > 60) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile menu
  let menuOpen = false;
  function toggleMenu() {
    menuOpen = !menuOpen;
    hamburger.classList.toggle('open', menuOpen);
    mobileMenu.classList.toggle('open', menuOpen);
    document.body.style.overflow = menuOpen ? 'hidden' : '';

    // Stagger mobile links
    if (menuOpen) {
      mobileBtns.forEach((btn, i) => {
        btn.style.transitionDelay = `${i * 0.05 + 0.1}s`;
      });
    }
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close on resize to desktop
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && menuOpen) toggleMenu();
  });

  // Nav clicks
  navLinkBtns.forEach((btn) => {
    btn.addEventListener('click', () => scrollToSection(btn.dataset.section));
  });
  mobileBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      scrollToSection(btn.dataset.section);
      if (menuOpen) toggleMenu();
    });
  });

  // Footer / logo buttons
  document.querySelectorAll('[data-scroll]').forEach((el) => {
    el.addEventListener('click', () => scrollToSection(el.dataset.scroll));
  });

  // Active section via IntersectionObserver
  const visibilityMap = {};

  function updateActive() {
    for (const id of NAV_SECTIONS) {
      if (visibilityMap[id]) {
        navLinkBtns.forEach((btn) => {
          btn.classList.toggle('active', btn.dataset.section === id);
        });
        mobileBtns.forEach((btn) => {
          btn.classList.toggle('active', btn.dataset.section === id);
        });
        return;
      }
    }
  }

  NAV_SECTIONS.forEach((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { visibilityMap[id] = e.isIntersecting; });
        updateActive();
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    obs.observe(el);
  });
}

/* ────────────────────────────────────────────────────────────
   5. TYPING ANIMATION (hero role text)
   ──────────────────────────────────────────────────────────── */
function initTyping() {
  const el = document.getElementById('hero-typing');
  if (!el) return;

  const words = [
    'C/C++ Learner',
    'AI Explorer',
    'Prompt Engineering Enthusiast',
    'Technology Explorer',
    'Future Builder',
  ];

  let wordIdx = 0;
  let charIdx = 0;
  let deleting = false;
  const speed = 55;
  const deleteSpeed = 40;
  const pauseEnd = 2000;
  const pauseStart = 400;

  function tick() {
    const word = words[wordIdx];
    if (!deleting) {
      el.textContent = word.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === word.length) {
        deleting = true;
        setTimeout(tick, pauseEnd);
        return;
      }
    } else {
      el.textContent = word.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        wordIdx = (wordIdx + 1) % words.length;
        setTimeout(tick, pauseStart);
        return;
      }
    }
    setTimeout(tick, deleting ? deleteSpeed : speed);
  }
  tick();
}

/* ────────────────────────────────────────────────────────────
   6. STATIC DOTS BACKGROUND (hero)
   ──────────────────────────────────────────────────────────── */
function initHeroDots() {
  const svg = document.getElementById('hero-dots-svg');
  if (!svg) return;

  const colors = ['#C41E3A', '#9333EA', '#39FF14', '#FF6B6B', '#C084FC'];
  const fragment = document.createDocumentFragment();

  for (let i = 0; i < 70; i++) {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', `${Math.random() * 100}%`);
    circle.setAttribute('cy', `${Math.random() * 100}%`);
    circle.setAttribute('r', String(Math.random() * 3 + 1));
    circle.setAttribute('fill', colors[Math.floor(Math.random() * colors.length)]);
    circle.setAttribute('opacity', String(Math.random() * 0.4 + 0.2));
    fragment.appendChild(circle);
  }
  svg.appendChild(fragment);
}

/* ────────────────────────────────────────────────────────────
   7. SKILL CARDS (accordion expand/collapse)
   ──────────────────────────────────────────────────────────── */
function initSkillCards() {
  document.querySelectorAll('.skill-card').forEach((card) => {
    card.addEventListener('click', () => {
      const isExpanded = card.classList.toggle('expanded');
      card.setAttribute('aria-expanded', String(isExpanded));
    });
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });
}

/* ────────────────────────────────────────────────────────────
   8. FUTURE ACHIEVEMENTS TOGGLE
   ──────────────────────────────────────────────────────────── */
function initFutureToggle() {
  const btn = document.getElementById('future-toggle-btn');
  const content = document.getElementById('future-content');
  if (!btn || !content) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('open');
    content.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
  });
}

/* ────────────────────────────────────────────────────────────
   9. WEB SHOOT ANIMATION ("Let's Connect" CTA)
   ──────────────────────────────────────────────────────────── */
function initWebShoot() {
  const btn = document.getElementById('lets-connect-btn');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const rect = btn.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    runWebShoot(originX, originY, () => {
      scrollToSection('contact');
    });
  });
}

function runWebShoot(ox, oy, onComplete) {
  const canvas = document.getElementById('web-shoot-canvas');
  if (!canvas) { onComplete?.(); return; }

  // Respect reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    onComplete?.();
    return;
  }

  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const DURATION = 1300;
  const vw = window.innerWidth;
  const vh = window.innerHeight;

  const targets = [
    { x: ox - 60,  y: vh + 30  },
    { x: ox - 20,  y: vh + 50  },
    { x: ox + 20,  y: vh + 50  },
    { x: ox + 60,  y: vh + 30  },
    { x: ox,       y: vh + 80  },
  ];

  const strands = targets.map((t, i) => ({
    mid: { x: (ox + t.x) / 2 + (i % 2 === 0 ? -30 : 30), y: (oy + t.y) / 2 - 40 },
    end: t,
    width: i === 4 ? 1.8 : 1.2,
  }));

  const filaments = [
    { x1: ox - 35, y1: oy + 80,  x2: ox + 40, y2: oy + 90  },
    { x1: ox - 55, y1: oy + 160, x2: ox + 60, y2: oy + 170 },
    { x1: ox - 50, y1: oy + 250, x2: ox + 55, y2: oy + 255 },
  ];

  let startTime = null;
  canvas.style.opacity = '1';

  function getPointOnQuad(p0x, p0y, p1x, p1y, p2x, p2y, t) {
    const x = (1-t)*(1-t)*p0x + 2*(1-t)*t*p1x + t*t*p2x;
    const y = (1-t)*(1-t)*p0y + 2*(1-t)*t*p1y + t*t*p2y;
    return { x, y };
  }

  function draw(ts) {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / DURATION, 1);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Create gradient
    const grad = ctx.createLinearGradient(0, oy, 0, vh);
    grad.addColorStop(0, 'rgba(245,234,216,0.9)');
    grad.addColorStop(1, 'rgba(245,234,216,0)');

    // Draw main strands
    const strandProgress = progress < 0.6 ? progress / 0.6 : 1;
    const strandOpacity = progress > 0.85
      ? 1 - (progress - 0.85) / 0.15
      : Math.min(1, progress * 3);

    ctx.strokeStyle = grad;
    ctx.globalAlpha = strandOpacity;

    strands.forEach((s, i) => {
      const delay = i * 0.06;
      const sp = Math.max(0, Math.min(1, (strandProgress - delay) / (1 - delay)));

      ctx.beginPath();
      ctx.lineWidth = s.width;
      ctx.lineCap = 'round';

      // Draw partial bezier
      const steps = 30;
      for (let step = 0; step <= steps; step++) {
        const t = (step / steps) * sp;
        const pt = getPointOnQuad(ox, oy, s.mid.x, s.mid.y, s.end.x, s.end.y, t);
        if (step === 0) ctx.moveTo(pt.x, pt.y);
        else ctx.lineTo(pt.x, pt.y);
      }
      ctx.stroke();
    });

    // Draw filaments
    if (progress > 0.3) {
      const filOpacity = progress > 0.85
        ? (1 - (progress - 0.85) / 0.15) * 0.6
        : Math.min(0.6, (progress - 0.3) * 3);

      ctx.globalAlpha = filOpacity;
      ctx.lineWidth = 0.8;
      ctx.strokeStyle = 'rgba(245,234,216,1)';

      filaments.forEach((f) => {
        ctx.beginPath();
        ctx.moveTo(f.x1, f.y1);
        ctx.lineTo(f.x2, f.y2);
        ctx.stroke();
      });
    }

    // Origin burst
    if (progress < 0.2) {
      const burstAlpha = (1 - progress / 0.2) * 0.8;
      const burstR = (progress / 0.15) * 20;
      ctx.globalAlpha = burstAlpha;
      ctx.beginPath();
      ctx.arc(ox, oy, burstR, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(245,234,216,1)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    ctx.globalAlpha = 1;

    if (progress < 1) {
      requestAnimationFrame(draw);
    } else {
      canvas.style.opacity = '0';
      onComplete?.();
    }
  }

  requestAnimationFrame(draw);
}

/* ────────────────────────────────────────────────────────────
   10. FOOTER YEAR
   ──────────────────────────────────────────────────────────── */
function initFooterYear() {
  const el = document.getElementById('footer-year');
  if (el) el.textContent = new Date().getFullYear();
}

/* ────────────────────────────────────────────────────────────
   INIT ALL
   ──────────────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initReveal();
  initStickerReveal();
  initNavbar();
  initTyping();
  initHeroDots();
  initSkillCards();
  initFutureToggle();
  initWebShoot();
  initFooterYear();
});
