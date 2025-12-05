// booking-confirmation.js — reads last booking from localStorage and shows a friendly summary

document.addEventListener("DOMContentLoaded", () => {
  const raw = localStorage.getItem("lastBooking");
  const nameEl = document.getElementById("confirmName");
  const dtEl = document.getElementById("confirmDateTime");
  const payEl = document.getElementById("confirmPayment");
  const totalEl = document.getElementById("confirmTotal");
  const servicesEl = document.getElementById("confirmServices");

  if (!raw) {
    nameEl.textContent =
      "We couldn't find your booking details. Please return to the homepage or make a new booking.";
    dtEl.textContent = "";
    payEl.textContent = "";
    totalEl.textContent = "£0";
    return;
  }

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    nameEl.textContent =
      "We couldn't read your booking details. Please return to the homepage or make a new booking.";
    return;
  }

  nameEl.textContent = `Name: ${data.customerName}`;
  dtEl.textContent = `Date & time: ${data.date} at ${data.time}`;
  payEl.textContent =
    data.paymentMethod === "pay_at_venue"
      ? "Payment: Pay at the salon."
      : "Payment: Decide later (the salon will contact you).";

  totalEl.textContent = data.total || "£0";

  servicesEl.innerHTML = "";
  (data.services || []).forEach(svc => {
    const row = document.createElement("div");
    row.className = "booking-service-item";
    row.innerHTML = `
      <div class="booking-service-main">
        <div class="booking-service-name">${svc.name}</div>
        <div class="booking-service-time">
          ${svc.time || ""} — Stylist: ${svc.stylistName || "Any professional"}
        </div>
      </div>
      <div class="booking-service-price">${svc.price || ""}</div>
    `;
    servicesEl.appendChild(row);
  });
});
