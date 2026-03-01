const mybutton = document.getElementById("myBtn");

window.addEventListener("scroll", () => {
  if (window.scrollY > 400) {
    mybutton.classList.add("show");
  } else {
    mybutton.classList.remove("show");
  }
});

mybutton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
});