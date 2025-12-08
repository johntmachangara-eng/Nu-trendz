// ======================================
// NU-TRENDZ FOOTER VISIBILITY ANIMATION
// ======================================

document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector(".site-footer");
  if (!footer) return; // Safety check

  // Fade-in animation when footer enters viewport
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          footer.classList.add("visible");
        }
      });
    },
    {
      threshold: 0.2, // Trigger when 20% of footer is visible
    }
  );

  observer.observe(footer);
});
