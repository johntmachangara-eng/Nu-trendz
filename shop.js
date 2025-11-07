// ===== Slideshow Logic =====
let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;

document.querySelector(".next").addEventListener("click", nextSlide);
document.querySelector(".prev").addEventListener("click", prevSlide);

function showSlide(index) {
  slides.forEach(slide => slide.classList.remove("active"));
  slides[index].classList.add("active");
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

function prevSlide() {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  showSlide(currentSlide);
}

setInterval(nextSlide, 6000);

// ===== Fade in video when loaded =====
const video = document.querySelector('.portrait-video');
video.addEventListener('loadeddata', () => {
  video.classList.add('loaded');
});
