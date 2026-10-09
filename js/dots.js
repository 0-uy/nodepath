const stage = document.querySelector('.mockup3d-stage');
const dots = document.querySelectorAll('.dot');

stage.addEventListener('scroll', () => {
  const scrollIndex = Math.round(stage.scrollLeft / stage.offsetWidth);
  dots.forEach((dot, index) => {
    dot.classList.toggle('active', index === scrollIndex);
  });
});