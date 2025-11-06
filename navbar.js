// === NAVBAR SHRINK + FLOATING LOGO ===
const navbar = document.querySelector('.navbar');
const floatingLogo = document.querySelector('.floating-logo');
const menuToggle = document.querySelector('#menu-toggle');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  if (window.scrollY > 80) {
    navbar.classList.add('shrink');
    floatingLogo.classList.add('visible');
  } else {
    navbar.classList.remove('shrink');
    floatingLogo.classList.remove('visible');
  }
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    if (menuToggle.checked) menuToggle.checked = false;
  });
});

// Highlight active link on click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});
