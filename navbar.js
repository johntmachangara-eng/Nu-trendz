// === UNIVERSAL NAVBAR SCRIPT (Auto Highlight + Shrink + Floating Logo) ===
const navbar = document.querySelector('.navbar');
const floatingLogo = document.querySelector('.floating-logo');
const menuToggle = document.querySelector('#menu-toggle');
const navLinks = document.querySelectorAll('.nav-links a');

// Shrink on scroll
window.addEventListener('scroll', () => {
  if (window.scrollY > 70) {
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

// === AUTO HIGHLIGHT ACTIVE PAGE ===
const currentPage = window.location.pathname.split("/").pop(); // e.g. "about.html"
navLinks.forEach(link => {
  const linkPage = link.getAttribute("href").split("/").pop();
  if (linkPage === currentPage || (linkPage === "index.html" && currentPage === "")) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});

// Optional: Smooth transition on hover click
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.forEach(l => l.classList.remove('active'));
    link.classList.add('active');
  });
});
