// Scroll progress bar
const scrollProgress = document.getElementById('scrollProgress');
window.addEventListener('scroll', () => {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  const progress = (window.scrollY / total) * 100;
  if (scrollProgress) scrollProgress.style.width = progress + '%';
});

// Desvanecer banner al hacer scroll
const banner = document.getElementById('banner-img');
window.addEventListener('scroll', () => {
  const maxScroll = 500;
  const scrollY = window.scrollY;
  let opacity = 1 - scrollY / maxScroll;
  if (banner) banner.style.opacity = Math.max(0, Math.min(1, opacity));
});

// Reproductor de música
const audio = document.getElementById('player');
const btn = document.getElementById('playPauseBtn');
const vinyl = document.getElementById('vinylDisc');
let isPlaying = false;

btn.addEventListener('click', () => {
  if (isPlaying) {
    audio.pause();
    btn.textContent = '⏵';
    if (vinyl) vinyl.classList.remove('playing');
  } else {
    audio.play();
    btn.textContent = '⏸';
    if (vinyl) vinyl.classList.add('playing');
  }
  isPlaying = !isPlaying;
});

// Animaciones al hacer scroll
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section').forEach(section => {
  observer.observe(section);
});

// Carrusel de cartas principales
const wrapper = document.querySelector('.cartas-wrapper');
const cartaSections = wrapper ? wrapper.querySelectorAll('.section') : [];
const prevBtn = document.getElementById('prevCarta');
const nextBtn = document.getElementById('nextCarta');
const cartaCounter = document.getElementById('cartaCounter');
let current = 0;

function pad(n) { return String(n).padStart(2, '0'); }

function updateCartaView() {
  if (!wrapper) return;
  wrapper.style.transform = `translateX(-${current * 100}%)`;
  prevBtn.disabled = current === 0;
  nextBtn.disabled = current === cartaSections.length - 1;
  prevBtn.style.opacity = prevBtn.disabled ? 0.2 : 1;
  nextBtn.style.opacity = nextBtn.disabled ? 0.2 : 1;
  if (cartaCounter) cartaCounter.textContent = `${pad(current + 1)} / ${pad(cartaSections.length)}`;
}

if (prevBtn) prevBtn.addEventListener('click', () => {
  if (current > 0) { current--; updateCartaView(); }
});

if (nextBtn) nextBtn.addEventListener('click', () => {
  if (current < cartaSections.length - 1) { current++; updateCartaView(); }
});

updateCartaView();

// Swipe support for carousel
let touchStartX = 0;
if (wrapper) {
  wrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  wrapper.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50 && current < cartaSections.length - 1) { current++; updateCartaView(); }
    if (diff < -50 && current > 0) { current--; updateCartaView(); }
  });
}

// Carrusel de cartas no enviadas
const noEnviadasWrapper = document.querySelector('.cartas-no-enviadas-wrapper');
const noEnviadas = noEnviadasWrapper ? noEnviadasWrapper.querySelectorAll('.carta') : [];
const prevNoEnviada = document.getElementById('prevNoEnviada');
const nextNoEnviada = document.getElementById('nextNoEnviada');
const noEnviadaCounter = document.getElementById('noEnviadaCounter');
let indexNoEnviada = 0;

function updateNoEnviadaView() {
  if (!noEnviadasWrapper) return;
  noEnviadasWrapper.style.transform = `translateX(-${indexNoEnviada * 100}%)`;
  prevNoEnviada.disabled = indexNoEnviada === 0;
  nextNoEnviada.disabled = indexNoEnviada === noEnviadas.length - 1;
  prevNoEnviada.style.opacity = prevNoEnviada.disabled ? 0.2 : 1;
  nextNoEnviada.style.opacity = nextNoEnviada.disabled ? 0.2 : 1;
  if (noEnviadaCounter) noEnviadaCounter.textContent = `${pad(indexNoEnviada + 1)} / ${pad(noEnviadas.length)}`;
}

if (prevNoEnviada) prevNoEnviada.addEventListener('click', () => {
  if (indexNoEnviada > 0) { indexNoEnviada--; updateNoEnviadaView(); }
});

if (nextNoEnviada) nextNoEnviada.addEventListener('click', () => {
  if (indexNoEnviada < noEnviadas.length - 1) { indexNoEnviada++; updateNoEnviadaView(); }
});

updateNoEnviadaView();

// Swipe support for no-enviadas
if (noEnviadasWrapper) {
  noEnviadasWrapper.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; });
  noEnviadasWrapper.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (diff > 50 && indexNoEnviada < noEnviadas.length - 1) { indexNoEnviada++; updateNoEnviadaView(); }
    if (diff < -50 && indexNoEnviada > 0) { indexNoEnviada--; updateNoEnviadaView(); }
  });
}
