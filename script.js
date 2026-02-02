document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.getElementById('myCarousel');
  const track = carousel.querySelector('.carousel-track');
  const slides = Array.from(track.children);
  const prevBtn = carousel.querySelector('.carousel-btn.prev');
  const nextBtn = carousel.querySelector('.carousel-btn.next');
  const dotsWrap = document.getElementById('myCarouselDots');

  let index = 0;
  let slidesVisible = Math.max(1, parseInt(getComputedStyle(carousel).getPropertyValue('--slides')) || 1);

  const AUTOPLAY_MS = 5000;
  let autoplayTimer = null;

  function buildDots() {
    dotsWrap.innerHTML = '';
    for (let i = 0; i < slides.length; i++) {
      const b = document.createElement('button');
      b.addEventListener('click', () => { index = i; update(); restartAutoplay(); });
      dotsWrap.appendChild(b);
    }
  }

  function updateSlidesVisible() {
    slidesVisible = Math.min(slides.length, Math.max(1, parseInt(getComputedStyle(carousel).getPropertyValue('--slides')) || 1));
  }

  function getMaxIndex() {
    updateSlidesVisible();
    return Math.max(0, slides.length - slidesVisible);
  }

  function update() {
    updateSlidesVisible();
    const maxIndex = getMaxIndex();
    // keep index inside 0..maxIndex using modulo when needed (wrap-around)
    if (maxIndex === 0) index = 0;
    else index = ((index % (maxIndex + 1)) + (maxIndex + 1)) % (maxIndex + 1);

    const percent = index * (100 / slidesVisible);
    track.style.transform = `translateX(-${percent}%)`;

    Array.from(dotsWrap.children).forEach((d, i) => d.classList.toggle('active', i === index));

    // never disable nav buttons - wrap behavior will handle boundaries
    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }

  function gotoNext() {
    const maxIndex = getMaxIndex();
    index = (index + 1) % (maxIndex + 1);
    update();
  }

  function gotoPrev() {
    const maxIndex = getMaxIndex();
    index = (index - 1 + (maxIndex + 1)) % (maxIndex + 1);
    update();
  }

  prevBtn.addEventListener('click', () => { gotoPrev(); restartAutoplay(); });
  nextBtn.addEventListener('click', () => { gotoNext(); restartAutoplay(); });

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(() => { gotoNext(); }, AUTOPLAY_MS);
  }

  function stopAutoplay() {
    if (autoplayTimer) { clearInterval(autoplayTimer); autoplayTimer = null; }
  }

  function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
  }

  // pause on hover/focus, resume on leave
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('focusin', stopAutoplay);
  carousel.addEventListener('focusout', startAutoplay);

  window.addEventListener('resize', () => { updateSlidesVisible(); update(); });

  buildDots();
  update();
  startAutoplay();
});