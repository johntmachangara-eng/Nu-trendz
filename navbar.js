document.addEventListener("DOMContentLoaded", () => {
  // ========================================
  // DOM Elements
  // ========================================
  const navbar = document.querySelector(".navbar");
  const menuIcon = document.querySelector(".menu-icon");
  const navLinks = document.querySelector(".nav-links");

  // ========================================
  // Cleanup
  // ========================================
  // Remove any leftover checkbox toggles from old versions
  document.querySelectorAll('input[type="checkbox"][id*="menu-toggle"]').forEach(el => el.remove());

  // ========================================
  // Navbar Shrink on Scroll
  // ========================================
  let lastScroll = 0;
  
  window.addEventListener("scroll", () => {
    const current = window.scrollY;
    
    if (current > 80 && current > lastScroll) {
      navbar.classList.add("shrink");
    } else if (current < lastScroll - 10 || current <= 0) {
      navbar.classList.remove("shrink");
    }
    
    lastScroll = current;
  });

  // ========================================
  // Mobile Menu Toggle
  // ========================================
  menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("active");
    navLinks.classList.toggle("show");
    document.body.classList.toggle("menu-open");
  });

  // ========================================
  // Close Menu on Link Click
  // ========================================
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      menuIcon.classList.remove("active");
      navLinks.classList.remove("show");
      document.body.classList.remove("menu-open");
    });
  });
});
