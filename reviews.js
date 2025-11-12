document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.getElementById("reviewsGrid");

  // ============================================
  // Helper Functions
  // ============================================

  function createReviewCard({ name, rating, comment }) {
    const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
    return `
      <div class="review-card">
        <div class="review-stars">${stars}</div>
        <p>"${comment}"</p>
        <h3>- ${name}</h3>
      </div>
    `;
  }

  // ============================================
  // API Functions
  // ============================================

  async function loadReviews() {
    try {
      // 🔹 Connect to your backend API endpoint here:
      // Example:
      // const response = await fetch("https://api.nu-trendz.com/reviews");
      // const reviews = await response.json();

      const reviews = [];

      if (!reviews || reviews.length === 0) {
        grid.innerHTML = `<p class="no-reviews">No reviews yet — check back soon!</p>`;
        return;
      }

      grid.innerHTML = reviews.map(createReviewCard).join("");
    } catch (error) {
      console.error("Error loading reviews:", error);
      grid.innerHTML = `<p class="no-reviews">⚠️ Unable to load reviews. Please try again later.</p>`;
    }
  }

  // ============================================
  // Initialize
  // ============================================

  await loadReviews();
});
