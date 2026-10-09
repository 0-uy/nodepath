const slider = document.querySelector('.ssip-slider');
const slides = document.querySelectorAll('.ssip-slide');
const next = document.querySelector('.ssip-nav.next');
const prev = document.querySelector('.ssip-nav.prev');

let index = 0;

function updateSlide(){

  // mover slider
  slider.style.transform = `translateX(-${index * 100}%)`;

  // quitar active de todos
  slides.forEach(slide => slide.classList.remove('active'));

  // activar el actual
  slides[index].classList.add('active');
}

next.addEventListener('click', ()=>{
  index = (index + 1) % slides.length;
  updateSlide();
});

prev.addEventListener('click', ()=>{
  index = (index - 1 + slides.length) % slides.length;
  updateSlide();
});

/* Auto slide */
setInterval(()=>{
  index = (index + 1) % slides.length;
  updateSlide();
}, 8000);

/* activar el primero al cargar */
updateSlide();