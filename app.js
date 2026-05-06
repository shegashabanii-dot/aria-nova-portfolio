/* ═══════════════════════════
   CURSOR
═══════════════════════════ */
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

// Grow on hoverable elements
document.querySelectorAll('a, button, .proj, .svc-item, .testi-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursor?.classList.add('grow'));
  el.addEventListener('mouseleave', () => cursor?.classList.remove('grow'));
});

/* ═══════════════════════════
   NAV
═══════════════════════════ */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

/* ═══════════════════════════
   MOBILE MENU
═══════════════════════════ */
const burger  = document.getElementById('burger');
const mobMenu = document.getElementById('mobMenu');

burger.addEventListener('click', () => {
  mobMenu.classList.toggle('open');
  // Animate burger
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

/* ═══════════════════════════
   HERO TITLE LINE SPLIT
   Wrap content in .line-inner
═══════════════════════════ */
document.querySelectorAll('.hero-title .line').forEach(line => {
  const text = line.innerHTML;
  line.innerHTML = `<span class="line-inner">${text}</span>`;
});

/* ═══════════════════════════
   PARALLAX ON SHAPES
═══════════════════════════ */
const shapes = document.querySelectorAll('.shape');

function parallax() {
  const sy = window.scrollY;
  shapes.forEach((el, i) => {
    const speed = (i % 3 === 0) ? 0.08 : (i % 3 === 1) ? 0.05 : 0.12;
    const rect  = el.parentElement?.getBoundingClientRect();
    if (!rect) return;
    // Only parallax if section is in view
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.style.transform = `translateY(${sy * speed * -1}px)`;
    }
  });
}
window.addEventListener('scroll', parallax, { passive: true });

/* ═══════════════════════════
   SCROLL REVEAL
═══════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      revealObs.unobserve(e.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

// Add reveal classes programmatically
const revealTargets = [
  { sel: '.sec-head', cls: 'reveal' },
  { sel: '.proj',     cls: 'reveal' },
  { sel: '.svc-item', cls: 'reveal' },
  { sel: '.proc-item',cls: 'reveal' },
  { sel: '.testi-card',cls: 'reveal' },
  { sel: '.about-img',  cls: 'reveal-left' },
  { sel: '.about-text', cls: 'reveal-right' },
  { sel: '.contact-text', cls: 'reveal-left' },
  { sel: '.contact-form', cls: 'reveal-right' },
];

revealTargets.forEach(({ sel, cls }) => {
  document.querySelectorAll(sel).forEach((el, i) => {
    el.classList.add(cls);
    // Stagger delay for grid items
    const d = ['d1','d2','d3','d4','d5','d6'];
    if (['svc-item','proc-item','testi-card'].some(c => el.classList.contains(c))) {
      el.classList.add(d[i % 6]);
    }
    revealObs.observe(el);
  });
});

/* ═══════════════════════════
   COUNTER ANIMATION
═══════════════════════════ */
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

/* ═══════════════════════════
   TICKER pause on hover
═══════════════════════════ */
const ticker = document.querySelector('.ticker');
if (ticker) {
  ticker.addEventListener('mouseenter', () => ticker.style.animationPlayState = 'paused');
  ticker.addEventListener('mouseleave', () => ticker.style.animationPlayState = 'running');
}

/* ═══════════════════════════
   MAGNETIC BUTTONS
   Slight magnetic pull on CTAs
═══════════════════════════ */
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

/* ═══════════════════════════
   ACTIVE NAV LINK
═══════════════════════════ */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.id;
  });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--ink)' : '';
  });
}, { passive: true });

/* ═══════════════════════════
   CONTACT FORM
═══════════════════════════ */
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

/* ═══════════════════════════
   SMOOTH REVEAL on load
   (for above-fold content)
═══════════════════════════ */
window.addEventListener('load', () => {
  document.body.classList.add('loaded');
});
