document.addEventListener("DOMContentLoaded", function () {

  const track = document.querySelector('.slider-track');
  const slides = document.querySelectorAll('.slide');
  const next = document.querySelector('.next');
  const prev = document.querySelector('.prev');

  if (!track || slides.length === 0) return;

  let index = 0;
  let timer;

  function updateSlider() {
    track.style.transform = `translateX(-${index * 100}%)`;
  }

  function autoplay() {
    clearTimeout(timer);

    let delay = (index === 0) ? 5000 : 3000;

    timer = setTimeout(() => {
      index++;
      if (index >= slides.length) index = 0;
      updateSlider();
      autoplay();
    }, delay);
  }

  function nextSlide() {
    index++;
    if (index >= slides.length) index = 0;
    updateSlider();
    autoplay();
  }

  function prevSlide() {
    index--;
    if (index < 0) index = slides.length - 1;
    updateSlider();
    autoplay();
  }

  next.addEventListener('click', nextSlide);
  prev.addEventListener('click', prevSlide);

  autoplay(); // iniciar automático

});