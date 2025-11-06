document.addEventListener("DOMContentLoaded", () => {
  const navbar = document.querySelector('.navbar');
  const floatingLogo = document.querySelector('.floating-logo');
  const menuToggle = document.querySelector('#menu-toggle');
  const navLinks = document.querySelectorAll('.nav-links a');

  // Shrink navbar + show floating logo
  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 70) {
        navbar.classList.add('shrink');
        if (floatingLogo) floatingLogo.classList.add('visible');
      } else {
        navbar.classList.remove('shrink');
        if (floatingLogo) floatingLogo.classList.remove('visible');
      }
    }
  });

  // Close mobile menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuToggle && menuToggle.checked) menuToggle.checked = false;
    });
  });

  // Highlight active page
  const currentPage = window.location.pathname.split("/").pop();
  navLinks.forEach(link => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (
      linkPage === currentPage ||
      (linkPage === "index.html" && currentPage === "") ||
      (linkPage === "services.html" && currentPage.includes("services"))
    ) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
});
