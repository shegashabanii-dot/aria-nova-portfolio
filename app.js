/* ═══════════════════════════════════
   CURSOR
═══════════════════════════════════ */
const cursor = document.getElementById('cursor');
let mx = 0, my = 0, cx = 0, cy = 0;

document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

(function moveCursor() {
  cx += (mx - cx) * 0.1;
  cy += (my - cy) * 0.1;
  if (cursor) {
    cursor.style.left = cx + 'px';
    cursor.style.top  = cy + 'px';
  }
  requestAnimationFrame(moveCursor);
})();

document.querySelectorAll('a, button, .proj, .svc-item, .testi-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor?.classList.add('grow'));
  el.addEventListener('mouseleave', () => cursor?.classList.remove('grow'));
});

/* ═══════════════════════════════════
   SCROLL PROGRESS LINE
═══════════════════════════════════ */
const progressLine = document.createElement('div');
progressLine.id = 'scroll-progress';
document.body.appendChild(progressLine);

window.addEventListener('scroll', () => {
  const pct = window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100;
  progressLine.style.transform = `scaleX(${pct / 100})`;
}, { passive: true });

/* ═══════════════════════════════════
   NAV
═══════════════════════════════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ═══════════════════════════════════
   MOBILE MENU
═══════════════════════════════════ */
const burger  = document.getElementById('burger');
const mobMenu = document.getElementById('mobMenu');

burger.addEventListener('click', () => {
  mobMenu.classList.toggle('open');
  const spans = burger.querySelectorAll('span');
  const open  = mobMenu.classList.contains('open');
  spans[0].style.transform = open ? 'translateY(7.5px) rotate(45deg)' : '';
  spans[1].style.transform = open ? 'translateY(-7.5px) rotate(-45deg)' : '';
});

mobMenu.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobMenu.classList.remove('open');
    burger.querySelectorAll('span').forEach(s => s.style.transform = '');
  });
});

/* ═══════════════════════════════════
   HERO TITLE — SPLIT LINES
═══════════════════════════════════ */
document.querySelectorAll('.hero-title .line').forEach(line => {
  const text = line.innerHTML;
  line.innerHTML = `<span class="line-inner">${text}</span>`;
});

/* ═══════════════════════════════════
   IMAGE REVEAL PANELS
   A cover panel slides away on scroll to reveal images
═══════════════════════════════════ */
document.querySelectorAll('.proj-img').forEach(img => {
  const panel = document.createElement('div');
  panel.className = 'img-panel';
  img.appendChild(panel);
});

/* ═══════════════════════════════════
   PARALLAX SHAPES
═══════════════════════════════════ */
const shapes = document.querySelectorAll('.shape');

function parallax() {
  const sy = window.scrollY;
  shapes.forEach((el, i) => {
    const speed = (i % 3 === 0) ? 0.06 : (i % 3 === 1) ? 0.04 : 0.09;
    const rect  = el.parentElement?.getBoundingClientRect();
    if (!rect) return;
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.style.transform = `translateY(${sy * speed * -1}px)`;
    }
  });
}
window.addEventListener('scroll', parallax, { passive: true });

/* ═══════════════════════════════════
   INTERSECTION OBSERVERS
═══════════════════════════════════ */

/* 1 ─ Image panel wipe */
const imgObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const panel = e.target.querySelector('.img-panel');
      if (panel) {
        setTimeout(() => panel.classList.add('is-wiped'), 80);
      }
      imgObs.unobserve(e.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.proj-img').forEach(el => imgObs.observe(el));

/* 2 ─ General reveals (also drives h2 clip-path via CSS cascade) */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

/* Mark h2s with text-clip — reveal is CSS-cascaded from parent .visible state */
document.querySelectorAll('h2, .statement-text').forEach(el => {
  el.classList.add('text-clip');
});

[
  { sel: '.sec-head',       cls: 'reveal' },
  { sel: '.label',          cls: 'reveal' },
  { sel: '.work-header',    cls: 'reveal' },
  { sel: '.proj',           cls: 'reveal-up' },
  { sel: '.work-footer',    cls: 'reveal' },
  { sel: '.svc-item',       cls: 'reveal-scale', stagger: true },
  { sel: '.proc-item',      cls: 'reveal-scale', stagger: true },
  { sel: '.testi-card',     cls: 'reveal-scale', stagger: true },
  { sel: '.about-img',      cls: 'reveal-left' },
  { sel: '.about-text',     cls: 'reveal-right' },
  { sel: '.contact-text',   cls: 'reveal-left' },
  { sel: '.contact-form',   cls: 'reveal-right' },
  { sel: '.about-skills',   cls: 'reveal' },
  { sel: '.about-stats',    cls: 'reveal' },
  { sel: '.statement-meta', cls: 'reveal' },
].forEach(({ sel, cls, stagger }) => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add(cls);
    if (stagger) el.style.transitionDelay = `${i * 0.09}s`;
    revealObs.observe(el);
  });
});

/* ═══════════════════════════════════
   COUNTER ANIMATION
═══════════════════════════════════ */
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (!e.isIntersecting) return;
    const el     = e.target;
    const target = +el.dataset.target;
    const dur    = 1600;
    const steps  = 60;
    const inc    = target / steps;
    let   cur    = 0;
    const tick   = setInterval(() => {
      cur += inc;
      if (cur >= target) { el.textContent = target; clearInterval(tick); }
      else el.textContent = Math.floor(cur);
    }, dur / steps);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });

document.querySelectorAll('.count').forEach(el => counterObs.observe(el));

/* ═══════════════════════════════════
   TICKER pause on hover
═══════════════════════════════════ */
const ticker = document.querySelector('.ticker');
if (ticker) {
  ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
  ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
}

/* ═══════════════════════════════════
   MAGNETIC BUTTONS
═══════════════════════════════════ */
document.querySelectorAll('.hero-cta, .submit-btn, .nav-cta').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const r  = btn.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top  + r.height / 2);
    btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.18}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
    btn.style.transition = 'transform .4s cubic-bezier(0.25,0.1,0.25,1)';
    setTimeout(() => btn.style.transition = '', 400);
  });
});

/* ═══════════════════════════════════
   PROJECT ROW — hover line expand
═══════════════════════════════════ */
document.querySelectorAll('.proj').forEach(proj => {
  proj.addEventListener('mouseenter', () => {
    proj.querySelectorAll('.proj-num, .proj-tag').forEach(el => el.classList.add('hovered'));
  });
  proj.addEventListener('mouseleave', () => {
    proj.querySelectorAll('.proj-num, .proj-tag').forEach(el => el.classList.remove('hovered'));
  });
});

/* ═══════════════════════════════════
   ACTIVE NAV LINK
═══════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--ink)' : '';
  });
}, { passive: true });

/* ═══════════════════════════════════
   CONTACT FORM
═══════════════════════════════════ */
document.getElementById('contactForm')?.addEventListener('submit', e => {
  e.preventDefault();
  const btn  = e.target.querySelector('.submit-btn span');
  const orig = btn.textContent;
  btn.textContent = 'Message sent ✓';
  e.target.querySelector('.submit-btn').style.background = '#4CAF50';
  setTimeout(() => {
    btn.textContent = orig;
    e.target.querySelector('.submit-btn').style.background = '';
    e.target.reset();
  }, 3500);
});

/* ═══════════════════════════════════
   LOAD
═══════════════════════════════════ */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
