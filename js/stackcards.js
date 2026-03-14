(function () {
  const srvGrid = document.querySelector('.srv-grid');
  if (!srvGrid) return;

  // Solo las 6 regulares — excluye .srv-wide
  const stackCards = Array.from(
    srvGrid.querySelectorAll('.srv-card:not(.srv-wide)')
  );
  if (stackCards.length === 0) return;

  stackCards.forEach(c => c.classList.add('stack-card'));

  // Un solo wrapper flex-column
  const wrapper = document.createElement('div');
  wrapper.className = 'srv-stack-wrapper';
  srvGrid.insertBefore(wrapper, stackCards[0]);

  // Las cards van directo al wrapper — sin divs intermedios
  stackCards.forEach(c => wrapper.appendChild(c));

  const TOP_BASE = 80;
  const TOP_STEP = 18;

  // sticky y z-index en la card directamente
  stackCards.forEach((card, i) => {
    card.style.top    = `${TOP_BASE + i * TOP_STEP}px`;
    card.style.zIndex = String(i + 1);
  });

  function onScroll () {
    stackCards.forEach((card, i) => {
      const stickyTop = TOP_BASE + i * TOP_STEP;
      const rect      = card.getBoundingClientRect();
      const isStuck   = rect.top <= stickyTop + 2;

      if (!isStuck) {
        card.style.transform = '';
        card.style.filter    = '';
        return;
      }

      let overlap = 0;
      for (let j = i + 1; j < stackCards.length; j++) {
        if (stackCards[j].getBoundingClientRect().top < stickyTop + 80) overlap++;
      }

      if (overlap === 0) {
        card.style.transform = '';
        card.style.filter    = '';
        return;
      }

      const scale = Math.max(1 - overlap * 0.034, 0.84);
      const dim   = Math.max(1 - overlap * 0.045, 0.72);
      card.style.transform = `scale(${scale}) translateY(${overlap * -4}px)`;
      card.style.filter    = `brightness(${dim})`;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();