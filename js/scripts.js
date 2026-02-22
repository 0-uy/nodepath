/* ---- Custom Cursor ---- */
const cur = document.getElementById('cur');
const ring = document.getElementById('cur-ring');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{
  mx=e.clientX; my=e.clientY;
  cur.style.left=mx+'px'; cur.style.top=my+'px';
});
(function ani(){
  rx+=(mx-rx)*.13; ry+=(my-ry)*.13;
  ring.style.left=rx+'px'; ring.style.top=ry+'px';
  requestAnimationFrame(ani);
})();
document.querySelectorAll('a,button,.srv-card,.pi,.wi').forEach(el=>{
  el.addEventListener('mouseenter',()=>{
    cur.style.width='18px'; cur.style.height='18px'; cur.style.background='var(--b)';
    ring.style.width='52px'; ring.style.height='52px'; ring.style.borderColor='rgba(0,221,255,.35)';
  });
  el.addEventListener('mouseleave',()=>{
    cur.style.width='10px'; cur.style.height='10px'; cur.style.background='var(--g)';
    ring.style.width='36px'; ring.style.height='36px'; ring.style.borderColor='rgba(0,255,122,.35)';
  });
});

/* ---- Navbar ---- */
const nav = document.getElementById('nav');
window.addEventListener('scroll',()=>nav.classList.toggle('sc',scrollY>50));

/* ---- Hamburger ---- */
const ham = document.getElementById('ham');
const nm = document.getElementById('nm');
ham.addEventListener('click',()=>{
  nm.classList.toggle('open');
  const spans = ham.querySelectorAll('span');
  if(nm.classList.contains('open')){
    spans[0].style.transform='rotate(45deg) translate(4.5px,4.5px)';
    spans[1].style.opacity='0';
    spans[2].style.transform='rotate(-45deg) translate(4.5px,-4.5px)';
  } else {
    spans.forEach(s=>{ s.style.transform=''; s.style.opacity=''; });
  }
});
nm.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
  nm.classList.remove('open');
  ham.querySelectorAll('span').forEach(s=>{ s.style.transform=''; s.style.opacity=''; });
}));

/* ---- Scroll reveal ---- */
const obs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting) e.target.classList.add('vis'); });
},{threshold:.1,rootMargin:'0px 0px -50px 0px'});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

/* ---- Animated counters ---- */
function counter(el,target,suffix){
  let start=0; const dur=1600;
  const t0 = performance.now();
  const step = now=>{
    const p = Math.min((now-t0)/dur,1);
    const ease = 1-Math.pow(1-p,3);
    el.textContent = Math.floor(ease*target)+suffix;
    if(p<1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
const statsObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.querySelectorAll('[data-target]').forEach(el=>{
        counter(el, +el.dataset.target, el.dataset.suffix);
      });
      statsObs.unobserve(e.target);
    }
  });
},{threshold:.5});
const hs = document.querySelector('.h-stats');
if(hs) statsObs.observe(hs);

/* ---- Smooth scroll ---- */
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    e.preventDefault();
    const t=document.querySelector(a.getAttribute('href'));
    if(t) t.scrollIntoView({behavior:'smooth',block:'start'});
  });
});

/* ---- Form submit ---- */
document.getElementById('cform').addEventListener('submit',function(e){
  e.preventDefault();
  const btn = document.getElementById('fsub');
  btn.textContent='✓ ¡Mensaje enviado! Te contactamos en 24hs.';
  btn.style.background='rgba(0,255,122,.15)';
  btn.style.color='var(--g)';
  btn.style.border='1px solid rgba(0,255,122,.3)';
  btn.style.fontFamily='var(--mono)';
  setTimeout(()=>{
    btn.textContent='🚀 Quiero mi propuesta gratuita';
    btn.style.cssText='';
    this.reset();
  },4500);
});