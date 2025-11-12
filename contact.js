// ============================================================
// NU-TRENDZ CONTACT FORM — FUNCTIONAL + ANIMATED
// ============================================================

// Configuration
const CONFIG = {
  emailJsPublicKey: "Lgg9FCMDk-lwWnNxZ",
  serviceId: "service_63ezrdn",
  templateId: "template_5kd1bxc",
};

// DOM Elements
let form, formContainer, thankYou, status;

// Initialize DOM references
function initElements() {
  form = document.getElementById("contactForm");
  formContainer = document.getElementById("form-container");
  thankYou = document.getElementById("thankyou-message");
  status = document.getElementById("form-status");
}

// Update status message
function updateStatus(message, color) {
  status.style.color = color;
  status.textContent = message;
}

// Show thank you message
function showThankYouMessage() {
  formContainer.style.opacity = "0";
  formContainer.style.transform = "translateY(-15px)";
  
  setTimeout(() => {
    formContainer.style.display = "none";
    thankYou.classList.remove("hidden");
    
    setTimeout(() => {
      thankYou.classList.add("visible");
    }, 100);
  }, 500);
}

// Handle form submission
async function handleSubmit(e) {
  e.preventDefault();
  updateStatus("Sending your message...", "#ff9800");

  const formData = {
    from_name: form.name.value.trim(),
    reply_to: form.email.value.trim(),
    message: form.message.value.trim(),
  };

  try {
    await emailjs.send(
      CONFIG.serviceId,
      CONFIG.templateId,
      formData,
      CONFIG.emailJsPublicKey
    );
    showThankYouMessage();
  } catch (error) {
    console.error("EmailJS Error:", error);
    updateStatus("❌ Failed to send message. Please try again later.", "red");
  }
}

// Initialize application
function init() {
  initElements();
  emailjs.init(CONFIG.emailJsPublicKey);
  form.addEventListener("submit", handleSubmit);
}

// Start when DOM is ready
document.addEventListener("DOMContentLoaded", init);

// ============================================================
// END OF CONTACT FORM SCRIPT
// ============================================================