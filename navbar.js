// navbar.js - Handles sticky navbar + mobile menu for NU-TRENDZ

document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.getElementById("navbar");
  const menuIcon = document.querySelector(".menu-icon");
  const navLinks = document.getElementById("nav-links");

  if (!navbar || !menuIcon || !navLinks) {
    // If something is missing, don't do anything to avoid errors.
    return;
  }

  const body = document.body;

  // Make sure any old checkbox toggles don't interfere
  const oldToggles = document.querySelectorAll('input[id*="menu-toggle"]');
  oldToggles.forEach((el) => el.parentNode && el.parentNode.removeChild(el));

  // === NAVBAR SHRINK ON SCROLL ===
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add("shrink");
    } else {
      navbar.classList.remove("shrink");
    }
  };

  handleScroll();
  window.addEventListener("scroll", handleScroll);

  // === MOBILE MENU TOGGLE ===
  const openMenu = () => {
    menuIcon.classList.add("active");
    navLinks.classList.add("show");
    body.classList.add("menu-open");
  };

  const closeMenu = () => {
    menuIcon.classList.remove("active");
    navLinks.classList.remove("show");
    body.classList.remove("menu-open");
  };

  const toggleMenu = () => {
    const isOpen = navLinks.classList.contains("show");
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  };

  // Click on hamburger icon
  menuIcon.addEventListener("click", toggleMenu);

  // Keyboard support for hamburger icon (Enter / Space)
  menuIcon.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleMenu();
    }
  });

  // Close menu when a nav link is clicked (on mobile)
  const linkElements = navLinks.querySelectorAll("a");
  linkElements.forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinks.classList.contains("show")) {
        closeMenu();
      }
    });
  });

  // Close menu if window resized above mobile breakpoint
  window.addEventListener("resize", () => {
    if (window.innerWidth > 992 && navLinks.classList.contains("show")) {
      closeMenu();
    }
  });
});

