const track = document.querySelector('.slider-track');
const slides = Array.from(track.children);
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');
let index = 0;

function updateSlider() {
  track.style.transform = `translateX(-${index * 100}%)`;
}

next.addEventListener('click', () => {
  index = (index + 1) % slides.length;
  updateSlider();
});

prev.addEventListener('click', () => {
  index = (index - 1 + slides.length) % slides.length;
  updateSlider();
});