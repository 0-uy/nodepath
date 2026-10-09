const mySlides = document.querySelectorAll('.my-slide');
const myDots = document.querySelectorAll('.my-dot');
let myIndex = 0;

function showMySlide(index) {
  if (index >= mySlides.length) myIndex = 0;
  else if (index < 0) myIndex = mySlides.length - 1;
  else myIndex = index;

  mySlides.forEach((slide, i) => {
    slide.classList.remove('active');
    slide.style.display = 'none';
    myDots[i].classList.remove('active');
  });

  mySlides[myIndex].classList.add('active');
  mySlides[myIndex].style.display = 'block';
  myDots[myIndex].classList.add('active');
}

document.querySelector('.my-next').addEventListener('click', () => {
  showMySlide(myIndex + 1);
});

document.querySelector('.my-prev').addEventListener('click', () => {
  showMySlide(myIndex - 1);
});

myDots.forEach((dot, i) => {
  dot.addEventListener('click', () => showMySlide(i));
});

// Auto slide
setInterval(() => {
  showMySlide(myIndex + 1);
}, 5000);

// Inicializa
showMySlide(myIndex);