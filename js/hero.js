/* ============================================================
   HERO.JS — Particles network + outline text reveal
   ============================================================ */

// ── PARTICLES ──────────────────────────────────────────────
const canvas  = document.getElementById('particles-canvas');
const ctx     = canvas.getContext('2d');
const heroEl  = document.getElementById('hero');

let W, H;
const mouse = { x: -9999, y: -9999 };

function resize() {
  const rect = heroEl.getBoundingClientRect();
  W = canvas.width  = heroEl.offsetWidth;
  H = canvas.height = heroEl.offsetHeight;
}
resize();
window.addEventListener('resize', resize);

// Mouse position relative to hero
heroEl.addEventListener('mousemove', e => {
  const rect = heroEl.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});
heroEl.addEventListener('mouseleave', () => {
  mouse.x = -9999;
  mouse.y = -9999;
});

const PARTICLE_COUNT  = 90;
const CONNECTION_DIST = 160;
const MOUSE_DIST      = 200;

const GREEN = { r: 0, g: 255, b: 136 };
const CYAN  = { r: 0, g: 229, b: 204 };

function colorStr(c, a) {
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}

class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x     = Math.random() * W;
    this.y     = Math.random() * H;
    this.vx    = (Math.random() - 0.5) * 0.35;
    this.vy    = (Math.random() - 0.5) * 0.35;
    this.r     = Math.random() * 1.8 + 0.6;
    this.color = Math.random() > 0.5 ? GREEN : CYAN;
    this.alpha = Math.random() * 0.5 + 0.3;
  }

  update() {
    // Subtle pull toward mouse
    const dx   = mouse.x - this.x;
    const dy   = mouse.y - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < MOUSE_DIST) {
      const force = (MOUSE_DIST - dist) / MOUSE_DIST * 0.012;
      this.vx += dx * force * 0.1;
      this.vy += dy * force * 0.1;
    }
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.x  += this.vx;
    this.y  += this.vy;
    // Wrap around edges
    if (this.x < -20)    this.x = W + 20;
    if (this.x > W + 20) this.x = -20;
    if (this.y < -20)    this.y = H + 20;
    if (this.y > H + 20) this.y = -20;
  }

  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle   = colorStr(this.color, this.alpha);
    ctx.shadowBlur  = 8;
    ctx.shadowColor = colorStr(this.color, 0.5);
    ctx.fill();
    ctx.shadowBlur  = 0;
  }
}

const particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const a    = particles[i];
      const b    = particles[j];
      const dx   = a.x - b.x;
      const dy   = a.y - b.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONNECTION_DIST) {
        const alpha = (1 - dist / CONNECTION_DIST) * 0.25;
        const grad  = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, colorStr(a.color, alpha));
        grad.addColorStop(1, colorStr(b.color, alpha));
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth   = 0.7;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, W, H);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(animate);
}
animate();

// ── OUTLINE TEXT REVEAL ────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelectorAll('.outline-text')
      .forEach(el => el.classList.add('revealed'));
  }, 300);
});