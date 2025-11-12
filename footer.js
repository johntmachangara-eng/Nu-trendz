// ===============================
// NU-TRENDZ FOOTER FADE-IN
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  const footer = document.querySelector(".site-footer");
  
  if (!footer) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          footer.classList.add("visible");
        }
      });
    },
    { threshold: 0.2 }
  );

  observer.observe(footer);
});
