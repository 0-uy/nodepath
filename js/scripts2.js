
/* ================================================================
   SCROLL EFFECTS ENGINE — NodePath
   Inspired by: 3D floating screens, circuit parallax, cinematic scroll
   ================================================================ */

const isMobile = window.innerWidth <= 768;

// ---- Reading Progress Bar ----
const readingBar = document.createElement('div');
readingBar.className = 'reading-bar';
document.body.prepend(readingBar);

// ---- Grain overlay ----
const grain = document.createElement('div');
grain.className = 'grain';
document.body.appendChild(grain);

// ---- Section navigation dots ----
const sections = ['#hero','#servicios','#proceso','#portafolio','#por-que','#contacto'];
const sectionLabels = ['Inicio','Servicios','Proceso','Portafolio','Nosotros','Contacto'];
const spNav = document.createElement('div');
spNav.className = 'section-progress';
sections.forEach((s,i) => {
  const dot = document.createElement('div');
  dot.className = 'sp-dot';
  dot.title = sectionLabels[i];
  dot.addEventListener('click', () => {
    const el = document.querySelector(s);
    if(el) el.scrollIntoView({behavior:'smooth'});
  });
  spNav.appendChild(dot);
});
document.body.appendChild(spNav);

// ---- Particle System (skip on mobile for performance) ----
if(!isMobile) {
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  document.body.prepend(canvas);
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const PARTICLES = [];
  const PARTICLE_COUNT = 60;

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.speedY = -(Math.random() * 0.4 + 0.1);
      this.opacity = Math.random() * 0.5 + 0.1;
      this.color = Math.random() > 0.5 ? '0,255,122' : '0,221,255';
      this.life = 1;
      this.decay = Math.random() * 0.003 + 0.001;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;
      if(this.life <= 0 || this.y < -10) this.reset();
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.opacity * this.life;
      ctx.fillStyle = `rgb(${this.color})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = `rgb(${this.color})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  for(let i = 0; i < PARTICLE_COUNT; i++) {
    const p = new Particle();
    p.y = Math.random() * canvas.height;
    PARTICLES.push(p);
  }

  function drawConnections() {
    for(let i = 0; i < PARTICLES.length; i++) {
      for(let j = i+1; j < PARTICLES.length; j++) {
        const dx = PARTICLES[i].x - PARTICLES[j].x;
        const dy = PARTICLES[i].y - PARTICLES[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < 100) {
          ctx.save();
          ctx.globalAlpha = (1 - dist/100) * 0.12 * PARTICLES[i].life * PARTICLES[j].life;
          ctx.strokeStyle = '#00ff7a';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(PARTICLES[i].x, PARTICLES[i].y);
          ctx.lineTo(PARTICLES[j].x, PARTICLES[j].y);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawConnections();
    PARTICLES.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();
}

// Hero scroll text (add dynamically)
const hero = document.getElementById('hero');
if(hero) {
  const scrollText = document.createElement('div');
  scrollText.className = 'hero-scroll-text';
  scrollText.textContent = 'NODEPATH NODEPATH NODEPATH NODEPATH NODEPATH NODEPATH ';
  hero.appendChild(scrollText);
}

// Apply eyebrow animation
const eyebrow = document.querySelector('.h-eyebrow');
if(eyebrow) {
  const text = eyebrow.textContent;
  eyebrow.innerHTML = [...text].map((c,i) =>
    `<span style="display:inline-block;opacity:0;transform:translateY(20px);transition:all 0.5s cubic-bezier(.23,1,.32,1) ${i*0.03}s">${c === ' ' ? '&nbsp;' : c}</span>`
  ).join('');
  setTimeout(() => {
    eyebrow.querySelectorAll('span').forEach(s => {
      s.style.opacity = '1';
      s.style.transform = 'translateY(0)';
    });
  }, 300);
}

// ---- Scroll-based effects ----
function onScroll() {
  const sy = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;

  // Reading bar
  readingBar.style.width = (sy / docH * 100) + '%';

  // Section dots
  const spDots = document.querySelectorAll('.sp-dot');
  sections.forEach((s,i) => {
    const el = document.querySelector(s);
    if(!el) return;
    const top = el.offsetTop;
    const bot = top + el.offsetHeight;
    spDots[i]?.classList.toggle('active', sy >= top - 100 && sy < bot);
  });

  // Parallax orbs — skip on mobile
  if(!isMobile) {
    const orbs = document.querySelectorAll('.orb');
    orbs.forEach((orb, i) => {
      const speed = [0.08, -0.06, 0.04][i] || 0.05;
      orb.style.transform = `translateY(${sy * speed}px) scale(${1 + sy*0.00005})`;
    });

    // 3D hero title perspective shift on scroll
    const heroTitle = document.querySelector('.h-title');
    if(heroTitle && sy < window.innerHeight) {
      const progress = sy / window.innerHeight;
      heroTitle.style.transform = `perspective(800px) rotateX(${progress * 4}deg) translateY(${progress * -30}px)`;
      heroTitle.style.opacity = 1 - progress * 0.7;
    }

    // 3D screens parallax
    const screenMain = document.querySelector('.screen-main');
    const screenLeft = document.querySelector('.screen-left');
    const screenRight = document.querySelector('.screen-right');
    const mockupSection = document.getElementById('mockup3d-section');

    if(mockupSection && screenMain) {
      const rect = mockupSection.getBoundingClientRect();
      const progress = -rect.top / (window.innerHeight + rect.height);
      const clamped = Math.max(-0.3, Math.min(0.3, progress - 0.2));
      screenMain.style.transform = `perspective(1200px) rotateY(${clamped * -8}deg) rotateX(${4 + clamped*2}deg) translateY(${clamped * -20}px)`;
      if(screenLeft) screenLeft.style.transform = `perspective(1200px) rotateY(${28 + clamped*-12}deg) rotateX(${4 + clamped*2}deg) translateZ(-80px) scale(0.85) translateY(${clamped * -15}px)`;
      if(screenRight) screenRight.style.transform = `perspective(1200px) rotateY(${-28 + clamped*12}deg) rotateX(${4 + clamped*2}deg) translateZ(-80px) scale(0.85) translateY(${clamped * -15}px)`;
    }
  }

  // Clip-path reveals
  document.querySelectorAll('.clip-reveal:not(.revealed)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight * 0.85) el.classList.add('revealed');
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// ---- 3D card tilt on mouse (desktop only) ----
if(!isMobile) {
  document.querySelectorAll('.srv-card, .pi, .wi').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = (e.clientX - rect.left) / rect.width - 0.5;
      const cy = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${cx * 10}deg) rotateX(${cy * -10}deg) translateY(-4px)`;
      card.style.transition = 'transform 0.05s ease';
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
    });
  });

  // Magnetic buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx = (e.clientX - rect.left - rect.width/2) * 0.25;
      const cy = (e.clientY - rect.top - rect.height/2) * 0.25;
      btn.style.transform = `translate(${cx}px, ${cy}px) translateY(-2px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

// ---- Ripple effect on click ----
document.addEventListener('click', e => {
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position:fixed;
    left:${e.clientX}px;
    top:${e.clientY}px;
    width:4px;height:4px;
    background:rgba(0,255,122,0.5);
    border-radius:50%;
    pointer-events:none;
    z-index:9997;
    transform:translate(-50%,-50%) scale(0);
    animation:rippleAnim 0.6s ease forwards;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes rippleAnim { to { transform: translate(-50%,-50%) scale(30); opacity: 0; } }`;
document.head.appendChild(rippleStyle);

// ---- Mouse-tracking glow on hero (desktop only) ----
if(!isMobile) {
  const heroSection = document.getElementById('hero');
  if(heroSection) {
    heroSection.addEventListener('mousemove', e => {
      const rect = heroSection.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      heroSection.style.setProperty('--mx', x + '%');
      heroSection.style.setProperty('--my', y + '%');
    });
  }
}

// ---- Service cards entrance ----
const srvCards = document.querySelectorAll('.srv-card');
const srvObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      const cards = [...srvCards];
      const idx = cards.indexOf(entry.target);
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
      }, idx * 70);
      srvObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
srvCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(50px) scale(0.95)';
  card.style.transition = 'opacity 0.7s cubic-bezier(0.23,1,0.32,1), transform 0.7s cubic-bezier(0.23,1,0.32,1)';
  srvObs.observe(card);
});

// ---- Portfolio items fly in ----
const portItems = document.querySelectorAll('.pi');
portItems.forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = isMobile ? 'translateY(40px)' : (i % 2 === 0 ? 'translateX(-60px)' : 'translateX(60px)');
  item.style.transition = `opacity 0.8s cubic-bezier(0.23,1,0.32,1) ${i*0.1}s, transform 0.8s cubic-bezier(0.23,1,0.32,1) ${i*0.1}s`;
});
const portObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateX(0) translateY(0)';
      portObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
portItems.forEach(item => portObs.observe(item));

// ---- Why items scale in ----
const whyItems = document.querySelectorAll('.wi');
whyItems.forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = isMobile ? 'translateY(30px)' : 'scale(0.9) translateX(40px)';
  item.style.transition = `opacity 0.6s ease ${i*0.12}s, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${i*0.12}s`;
});
const wiObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'scale(1) translateX(0) translateY(0)';
      wiObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
whyItems.forEach(item => wiObs.observe(item));

// ---- Process steps cascade ----
const proSteps = document.querySelectorAll('.pro-step');
proSteps.forEach((step, i) => {
  step.style.opacity = '0';
  step.style.transform = 'translateY(60px)';
  step.style.transition = `opacity 0.7s ease ${i*0.15}s, transform 0.7s cubic-bezier(0.23,1,0.32,1) ${i*0.15}s`;
});
const proObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      proObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
proSteps.forEach(s => proObs.observe(s));

// ---- Animated border on CTA box ----
const ctaBox = document.querySelector('.cta-box');
if(ctaBox) {
  let angle = 0;
  setInterval(() => {
    angle = (angle + 0.5) % 360;
    ctaBox.style.borderColor = 'transparent';
    ctaBox.style.backgroundImage = `
      linear-gradient(135deg,rgba(0,255,122,.055) 0%,rgba(0,221,255,.035) 100%),
      conic-gradient(from ${angle}deg, rgba(0,255,122,0.5), rgba(0,221,255,0.5), rgba(0,255,122,0.5))
    `;
    ctaBox.style.backgroundOrigin = 'border-box';
    ctaBox.style.backgroundClip = 'padding-box, border-box';
    ctaBox.style.border = '1px solid transparent';
  }, 16);
}

// ---- Ticker hover glow ----
document.querySelectorAll('.ticker-3d-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.boxShadow = '0 0 30px rgba(0,255,122,0.15)';
    const lbl = item.querySelector('.t3i-label span');
    if(lbl) lbl.style.textShadow = '0 0 20px rgba(0,255,122,0.8)';
  });
  item.addEventListener('mouseleave', () => {
    item.style.boxShadow = '';
    const lbl = item.querySelector('.t3i-label span');
    if(lbl) lbl.style.textShadow = '';
  });
});

// ---- Screen 3D mouse tracking (desktop only) ----
if(!isMobile) {
  const stage = document.querySelector('.mockup3d-stage');
  if(stage) {
    stage.addEventListener('mousemove', e => {
      const rect = stage.getBoundingClientRect();
      const cx = (e.clientX - rect.left - rect.width/2) / rect.width;
      const cy = (e.clientY - rect.top - rect.height/2) / rect.height;
      const main = stage.querySelector('.screen-main');
      const left = stage.querySelector('.screen-left');
      const right = stage.querySelector('.screen-right');
      if(main) main.style.transform = `perspective(1200px) rotateY(${cx*6}deg) rotateX(${4 - cy*4}deg)`;
      if(left) left.style.transform = `perspective(1200px) rotateY(${28 + cx*4}deg) rotateX(${4 - cy*3}deg) translateZ(-80px) scale(0.85)`;
      if(right) right.style.transform = `perspective(1200px) rotateY(${-28 + cx*4}deg) rotateX(${4 - cy*3}deg) translateZ(-80px) scale(0.85)`;
    });
    stage.addEventListener('mouseleave', () => {
      const main = stage.querySelector('.screen-main');
      const left = stage.querySelector('.screen-left');
      const right = stage.querySelector('.screen-right');
      if(main) main.style.transform = '';
      if(left) left.style.transform = '';
      if(right) right.style.transform = '';
    });
  }
}


// ---- Draw circuit lines on mockup3d entry ----
const lineObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      e.target.querySelectorAll(".draw-line").forEach(l => l.classList.add("drawn"));
      lineObs.unobserve(e.target);
    }
  });
}, {threshold: 0.3});
const m3s = document.getElementById("mockup3d-section");
if(m3s) lineObs.observe(m3s);

// ---- Grain overlay ----
const grain = document.createElement('div');
grain.className = 'grain';
document.body.appendChild(grain);

// ---- Section navigation dots ----
const sections = ['#hero','#servicios','#proceso','#portafolio','#por-que','#contacto'];
const sectionLabels = ['Inicio','Servicios','Proceso','Portafolio','Nosotros','Contacto'];
const spNav = document.createElement('div');
spNav.className = 'section-progress';
sections.forEach((s,i) => {
  const dot = document.createElement('div');
  dot.className = 'sp-dot';
  dot.title = sectionLabels[i];
  dot.addEventListener('click', () => {
    const el = document.querySelector(s);
    if(el) el.scrollIntoView({behavior:'smooth'});
  });
  spNav.appendChild(dot);
});
document.body.appendChild(spNav);

// ---- Particle System ----
const canvas = document.createElement('canvas');
canvas.id = 'particle-canvas';
document.body.prepend(canvas);
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const PARTICLES = [];
const PARTICLE_COUNT = 60;

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = -(Math.random() * 0.4 + 0.1);
    this.opacity = Math.random() * 0.5 + 0.1;
    this.color = Math.random() > 0.5 ? '0,255,122' : '0,221,255';
    this.life = 1;
    this.decay = Math.random() * 0.003 + 0.001;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= this.decay;
    if(this.life <= 0 || this.y < -10) this.reset();
  }
  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity * this.life;
    ctx.fillStyle = `rgb(${this.color})`;
    ctx.shadowBlur = 8;
    ctx.shadowColor = `rgb(${this.color})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

for(let i = 0; i < PARTICLE_COUNT; i++) {
  const p = new Particle();
  p.y = Math.random() * canvas.height; // spread initially
  PARTICLES.push(p);
}

// Connection lines between nearby particles
function drawConnections() {
  for(let i = 0; i < PARTICLES.length; i++) {
    for(let j = i+1; j < PARTICLES.length; j++) {
      const dx = PARTICLES[i].x - PARTICLES[j].x;
      const dy = PARTICLES[i].y - PARTICLES[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < 100) {
        ctx.save();
        ctx.globalAlpha = (1 - dist/100) * 0.12 * PARTICLES[i].life * PARTICLES[j].life;
        ctx.strokeStyle = '#00ff7a';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(PARTICLES[i].x, PARTICLES[i].y);
        ctx.lineTo(PARTICLES[j].x, PARTICLES[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  PARTICLES.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// ---- Parallax on scroll ----
let scrollY = 0;
let targetScrollY = 0;
let smoothScrollY = 0;

// Hero scroll text (add dynamically)
const hero = document.getElementById('hero');
if(hero) {
  const scrollText = document.createElement('div');
  scrollText.className = 'hero-scroll-text';
  scrollText.textContent = 'NODEPATH NODEPATH NODEPATH NODEPATH NODEPATH NODEPATH ';
  hero.appendChild(scrollText);
}

// ---- Text splitting for hero title ----
function splitText(selector) {
  const el = document.querySelector(selector);
  if(!el) return;
  const html = el.innerHTML;
  // Split by words, preserve HTML tags
  const words = html.split(/(\s+)/);
  el.innerHTML = words.map(w => {
    if(w.trim() === '' || w.startsWith('<')) return w;
    const chars = [...w].map(c =>
      `<span class="split-char" style="transition-delay:${Math.random()*0.3}s">${c}</span>`
    );
    return `<span class="split-word">${chars.join('')}</span>`;
  }).join('');

  setTimeout(() => {
    el.querySelectorAll('.split-char').forEach(c => c.classList.add('in'));
  }, 200);
}

// Apply to eyebrow after load
const eyebrow = document.querySelector('.h-eyebrow');
if(eyebrow) {
  const text = eyebrow.textContent;
  eyebrow.innerHTML = [...text].map((c,i) =>
    `<span style="display:inline-block;opacity:0;transform:translateY(20px);transition:all 0.5s cubic-bezier(.23,1,.32,1) ${i*0.03}s">${c === ' ' ? '&nbsp;' : c}</span>`
  ).join('');
  setTimeout(() => {
    eyebrow.querySelectorAll('span').forEach(s => {
      s.style.opacity = '1';
      s.style.transform = 'translateY(0)';
    });
  }, 300);
}

// ---- Scroll-based effects ----
function onScroll() {
  const sy = window.scrollY;
  const docH = document.documentElement.scrollHeight - window.innerHeight;

  // Reading bar
  readingBar.style.width = (sy / docH * 100) + '%';

  // Section dots
  const spDots = document.querySelectorAll('.sp-dot');
  sections.forEach((s,i) => {
    const el = document.querySelector(s);
    if(!el) return;
    const top = el.offsetTop;
    const bot = top + el.offsetHeight;
    spDots[i]?.classList.toggle('active', sy >= top - 100 && sy < bot);
  });

  // Parallax orbs
  const orbs = document.querySelectorAll('.orb');
  orbs.forEach((orb, i) => {
    const speed = [0.08, -0.06, 0.04][i] || 0.05;
    orb.style.transform = `translateY(${sy * speed}px) scale(${1 + sy*0.00005})`;
  });

  // 3D hero title perspective shift on scroll
  const heroTitle = document.querySelector('.h-title');
  if(heroTitle && sy < window.innerHeight) {
    const progress = sy / window.innerHeight;
    heroTitle.style.transform = `perspective(800px) rotateX(${progress * 4}deg) translateY(${progress * -30}px)`;
    heroTitle.style.opacity = 1 - progress * 0.7;
  }

  // 3D screens parallax
  const screenMain = document.querySelector('.screen-main');
  const screenLeft = document.querySelector('.screen-left');
  const screenRight = document.querySelector('.screen-right');
  const mockupSection = document.getElementById('mockup3d-section');

  if(mockupSection && screenMain) {
    const rect = mockupSection.getBoundingClientRect();
    const progress = -rect.top / (window.innerHeight + rect.height);
    const clamped = Math.max(-0.3, Math.min(0.3, progress - 0.2));

    screenMain.style.transform = `perspective(1200px) rotateY(${clamped * -8}deg) rotateX(${4 + clamped*2}deg) translateY(${clamped * -20}px)`;
    if(screenLeft) screenLeft.style.transform = `perspective(1200px) rotateY(${28 + clamped*-12}deg) rotateX(${4 + clamped*2}deg) translateZ(-80px) scale(0.85) translateY(${clamped * -15}px)`;
    if(screenRight) screenRight.style.transform = `perspective(1200px) rotateY(${-28 + clamped*12}deg) rotateX(${4 + clamped*2}deg) translateZ(-80px) scale(0.85) translateY(${clamped * -15}px)`;
  }

  // Clip-path reveals
  document.querySelectorAll('.clip-reveal:not(.revealed)').forEach(el => {
    const rect = el.getBoundingClientRect();
    if(rect.top < window.innerHeight * 0.85) el.classList.add('revealed');
  });

  // Stagger counter-items glowing on scroll
  const counterItems = document.querySelectorAll('.counter-item');
  counterItems.forEach((item, i) => {
    const rect = item.getBoundingClientRect();
    if(rect.top < window.innerHeight * 0.9) {
      setTimeout(() => item.style.opacity = '1', i * 80);
    }
  });
}

window.addEventListener('scroll', onScroll, { passive: true });
onScroll(); // initial call

// ---- 3D card tilt on mouse ----
document.querySelectorAll('.srv-card, .pi, .wi').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const cx = (e.clientX - rect.left) / rect.width - 0.5;
    const cy = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(800px) rotateY(${cx * 10}deg) rotateX(${cy * -10}deg) translateY(-4px)`;
    card.style.transition = 'transform 0.05s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)';
  });
});

// ---- Magnetic buttons ----
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const cx = (e.clientX - rect.left - rect.width/2) * 0.25;
    const cy = (e.clientY - rect.top - rect.height/2) * 0.25;
    btn.style.transform = `translate(${cx}px, ${cy}px) translateY(-2px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ---- Ripple effect on click ----
document.addEventListener('click', e => {
  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position:fixed;
    left:${e.clientX}px;
    top:${e.clientY}px;
    width:4px;height:4px;
    background:rgba(0,255,122,0.5);
    border-radius:50%;
    pointer-events:none;
    z-index:9997;
    transform:translate(-50%,-50%) scale(0);
    animation:rippleAnim 0.6s ease forwards;
  `;
  document.body.appendChild(ripple);
  setTimeout(() => ripple.remove(), 600);
});

// Add ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
  @keyframes rippleAnim {
    to { transform: translate(-50%,-50%) scale(30); opacity: 0; }
  }
`;
document.head.appendChild(rippleStyle);

// ---- Mouse-tracking glow on hero ----
const heroSection = document.getElementById('hero');
if(heroSection) {
  heroSection.addEventListener('mousemove', e => {
    const rect = heroSection.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    heroSection.style.setProperty('--mx', x + '%');
    heroSection.style.setProperty('--my', y + '%');
  });
}

// ---- Service cards: entrance with stagger from left ----
const srvCards = document.querySelectorAll('.srv-card');
const srvObs = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if(entry.isIntersecting) {
      const cards = [...srvCards];
      const idx = cards.indexOf(entry.target);
      setTimeout(() => {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0) scale(1)';
      }, idx * 70);
      srvObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

srvCards.forEach(card => {
  card.style.opacity = '0';
  card.style.transform = 'translateY(50px) scale(0.95)';
  card.style.transition = 'opacity 0.7s cubic-bezier(0.23,1,0.32,1), transform 0.7s cubic-bezier(0.23,1,0.32,1)';
  srvObs.observe(card);
});

// ---- Portfolio items fly in from sides ----
const portItems = document.querySelectorAll('.pi');
portItems.forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = i % 2 === 0 ? 'translateX(-60px)' : 'translateX(60px)';
  item.style.transition = `opacity 0.8s cubic-bezier(0.23,1,0.32,1) ${i*0.1}s, transform 0.8s cubic-bezier(0.23,1,0.32,1) ${i*0.1}s`;
});
const portObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateX(0)';
      portObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
portItems.forEach(item => portObs.observe(item));

// ---- Why items: scale in ----
const whyItems = document.querySelectorAll('.wi');
whyItems.forEach((item, i) => {
  item.style.opacity = '0';
  item.style.transform = 'scale(0.9) translateX(40px)';
  item.style.transition = `opacity 0.6s ease ${i*0.12}s, transform 0.6s cubic-bezier(0.23,1,0.32,1) ${i*0.12}s`;
});
const wiObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'scale(1) translateX(0)';
      wiObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
whyItems.forEach(item => wiObs.observe(item));

// ---- Process steps: cascade from top ----
const proSteps = document.querySelectorAll('.pro-step');
proSteps.forEach((step, i) => {
  step.style.opacity = '0';
  step.style.transform = 'translateY(60px)';
  step.style.transition = `opacity 0.7s ease ${i*0.15}s, transform 0.7s cubic-bezier(0.23,1,0.32,1) ${i*0.15}s`;
});
const proObs = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      proObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
proSteps.forEach(s => proObs.observe(s));

// ---- Animated border on CTA box ----
const ctaBox = document.querySelector('.cta-box');
if(ctaBox) {
  let angle = 0;
  // Add animated border gradient
  setInterval(() => {
    angle = (angle + 0.5) % 360;
    ctaBox.style.borderColor = 'transparent';
    ctaBox.style.backgroundImage = `
      linear-gradient(135deg,rgba(0,255,122,.055) 0%,rgba(0,221,255,.035) 100%),
      conic-gradient(from ${angle}deg, rgba(0,255,122,0.5), rgba(0,221,255,0.5), rgba(0,255,122,0.5))
    `;
    ctaBox.style.backgroundOrigin = 'border-box';
    ctaBox.style.backgroundClip = 'padding-box, border-box';
    ctaBox.style.border = '1px solid transparent';
  }, 16);
}

// ---- Horizontal scroll ticker glow on hover ----
document.querySelectorAll('.ticker-3d-item').forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.boxShadow = '0 0 30px rgba(0,255,122,0.15)';
    item.querySelector('.t3i-label span').style.textShadow = '0 0 20px rgba(0,255,122,0.8)';
  });
  item.addEventListener('mouseleave', () => {
    item.style.boxShadow = '';
    item.querySelector('.t3i-label span').style.textShadow = '';
  });
});

// ---- Screen 3D mouse tracking ----
const stage = document.querySelector('.mockup3d-stage');
if(stage) {
  stage.addEventListener('mousemove', e => {
    const rect = stage.getBoundingClientRect();
    const cx = (e.clientX - rect.left - rect.width/2) / rect.width;
    const cy = (e.clientY - rect.top - rect.height/2) / rect.height;
    const main = stage.querySelector('.screen-main');
    const left = stage.querySelector('.screen-left');
    const right = stage.querySelector('.screen-right');
    if(main) main.style.transform = `perspective(1200px) rotateY(${cx*6}deg) rotateX(${4 - cy*4}deg)`;
    if(left) left.style.transform = `perspective(1200px) rotateY(${28 + cx*4}deg) rotateX(${4 - cy*3}deg) translateZ(-80px) scale(0.85)`;
    if(right) right.style.transform = `perspective(1200px) rotateY(${-28 + cx*4}deg) rotateX(${4 - cy*3}deg) translateZ(-80px) scale(0.85)`;
  });
  stage.addEventListener('mouseleave', () => {
    const main = stage.querySelector('.screen-main');
    const left = stage.querySelector('.screen-left');
    const right = stage.querySelector('.screen-right');
    if(main) main.style.transform = '';
    if(left) left.style.transform = '';
    if(right) right.style.transform = '';
  });
}


// Draw circuit lines on mockup3d entry
const lineObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      e.target.querySelectorAll(".draw-line").forEach(l => l.classList.add("drawn"));
      lineObs.unobserve(e.target);
    }
  });
}, {threshold: 0.3});
const m3s = document.getElementById("mockup3d-section");
if(m3s) lineObs.observe(m3s);