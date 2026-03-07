// Counter animation for ci-n
const ciObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      const el = e.target.querySelector("[data-counter]");
      if(!el || el.dataset.animated) return;
      el.dataset.animated = true;
      const target = +el.dataset.counter;
      const suffix = el.dataset.suffix || "";
      let start = 0;
      const dur = 1800;
      const t0 = performance.now();
      const step = now => {
        const p = Math.min((now-t0)/dur, 1);
        const ease = 1 - Math.pow(1-p, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if(p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      ciObs.unobserve(e.target);
    }
  });
}, {threshold: 0.5});
document.querySelectorAll(".counter-item").forEach(el => ciObs.observe(el));