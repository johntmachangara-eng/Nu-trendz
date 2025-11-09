const form = document.getElementById("contactForm");
const statusText = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusText.textContent = "Sending...";
  statusText.style.color = "#ff9800";

  const data = new FormData(form);

  try {
    const response = await fetch(form.action, {
      method: form.method,
      body: data,
      headers: { Accept: "application/json" }
    });

    if (response.ok) {
      statusText.textContent = "✅ Message sent successfully!";
      statusText.style.color = "#00ff99";
      form.reset();
    } else {
      statusText.textContent = "⚠️ Oops! Something went wrong.";
      statusText.style.color = "red";
    }
  } catch (error) {
    statusText.textContent = "❌ Network error. Please try again later.";
    statusText.style.color = "red";
  }
});
