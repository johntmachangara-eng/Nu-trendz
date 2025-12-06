// booking.js — accurate duration, live availability, multi-hour bookings, confirmation redirect

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-analytics.js";
import {
  getDatabase,
  ref,
  get,
  push,
  set
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

// ========== 1. Firebase setup ==========
const firebaseConfig = {
  apiKey: "AIzaSyAmwRchhl7UDo3TcNZJmGUtWCguhgvcmrI",
  authDomain: "nu-trendz-8f560.firebaseapp.com",
  databaseURL: "https://nu-trendz-8f560-default-rtdb.firebaseio.com",
  projectId: "nu-trendz-8f560",
  storageBucket: "nu-trendz-8f560.firebasestorage.app",
  messagingSenderId: "206750888989",
  appId: "1:206750888989:web:83f40b0067649abc83c2f4",
  measurementId: "G-E1W9Y3ZSRH"
};

const app = initializeApp(firebaseConfig);
getAnalytics(app);
const db = getDatabase(app);

// ========== 2. EmailJS setup ==========
const EMAIL_CONFIG = {
  publicKey: "Lgg9FCMDk-lwWnNxZ",
  serviceId: "service_63ezrdn",
  adminTemplateId: "template_5kd1bxc",    // admin gets booking info
  customerTemplateId: "template_5kd1bxc", // client gets confirmation
  adminEmail: "PUT_SALON_EMAIL_HERE@example.com"
};

// ========== 3. Static data & state ==========
const STYLISTS = [
  { id: "any", name: "Any professional" },
  { id: "fala", name: "Fala" },
  { id: "joice", name: "Joice" },
  { id: "neuza", name: "Neuza" }
];

const OPEN_HOUR = 9;   // 09:00
const CLOSE_HOUR = 18; // salon closes at 18:00

let basket = [];
let mode = "one";
let stylistForAll = "any";
let stylistPerService = {};
let selectedDate = null; // "YYYY-MM-DD"
let selectedTime = null; // "HH:MM"
let currentStep = 1;
let totalDurationMinutes = 60; // total for all selected services

// DOM refs
let servicesSummaryEl, summaryTotalEl, summaryTotalLabelEl;
let stylistAllSelect, stylistPerWrapper, step1ErrorEl;
let stepPanels, stepIndicators;
let bookingDateInput, timeSlotsEl, dateStatusEl;
let toStep2Btn, toStep3Btn, backTo1Btn, backTo2Btn;
let detailsForm, finalStatusEl;
let finalSummaryEl, finalTotalEl, finalTotalLabelEl;

// ========== 4. Helpers ==========

function moneyFromText(str) {
  if (!str) return 0;
  const value = parseFloat(str.replace(/[^\d.]/g, ""));
  return isNaN(value) ? 0 : value;
}

function formatHHMM(h) {
  return `${String(h).padStart(2, "0")}:00`;
}

function isSunday(date) {
  return date.getDay() === 0;
}

// Parse "1 hour", "1 hr 30 min", "45 min" → minutes
function parseDurationFromText(text) {
  if (!text) return 60;
  const lower = text.toLowerCase();
  const nums = lower.match(/\d+/g);
  if (!nums) return 60;

  let minutes = 0;

  if (lower.includes("hour") || lower.includes("hr")) {
    const hrs = parseInt(nums[0], 10) || 1;
    minutes += hrs * 60;
    if (nums.length > 1 && lower.includes("min")) {
      minutes += parseInt(nums[1], 10) || 0;
    }
  } else if (lower.includes("min")) {
    minutes += parseInt(nums[0], 10) || 30;
  } else {
    const raw = parseInt(nums[0], 10) || 0;
    // if they wrote "2" we assume 2 hours, if "45" we treat as 45 min
    minutes = raw <= 5 ? raw * 60 : raw;
  }

  return minutes || 60;
}

// simple “signature” of the basket to detect a new booking
function getBasketSignature() {
  if (!basket || !basket.length) return "";
  const parts = basket.map(s =>
    `${s.name || ""}|${s.time || ""}|${s.price || ""}`
  );
  parts.sort();
  return parts.join("||");
}

function setStep(stepNum) {
  currentStep = stepNum;

  // save current step so refresh keeps it (for this basket)
  localStorage.setItem("bookingCurrentStep", String(stepNum));

  // show / hide step panels
  stepPanels.forEach(panel => {
    const num = Number(panel.dataset.stepPanel);
    panel.classList.toggle("hidden", num !== stepNum);
  });

  // update step indicator styling
  stepIndicators.forEach(ind => {
    const num = Number(ind.dataset.step);
    ind.classList.remove("step--active", "step--complete");
    if (num < stepNum) {
      ind.classList.add("step--complete");
    } else if (num === stepNum) {
      ind.classList.add("step--active");
    }
  });

  // whenever we enter step 2 and a date is selected, refresh availability
  if (stepNum === 2 && selectedDate) {
    renderTimeSlots();
  }
}

function validateEmail(email) {
  const simple = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return simple.test(email);
}

function validatePhone(phone) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 9;
}

function limitString(str, max) {
  if (!str) return "";
  return str.length > max ? str.slice(0, max) : str;
}

function getSelectedPaymentMethod() {
  const input = document.querySelector("input[name='paymentMethod']:checked");
  return input ? input.value : "pay_at_venue";
}

// ========== 5. Basket + summary & duration ==========

function loadBasket() {
  try {
    const raw = localStorage.getItem("basket");
    basket = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(basket)) basket = [];
  } catch (err) {
    console.error("Error parsing basket from localStorage", err);
    basket = [];
  }
}

function renderServicesSummary() {
  servicesSummaryEl.innerHTML = "";
  finalSummaryEl.innerHTML = "";
  totalDurationMinutes = 0;

  if (!basket.length) {
    servicesSummaryEl.innerHTML =
      `<p>You don't have any services selected yet.<br>Go back to the services page and choose at least one style.</p>`;
    summaryTotalEl.textContent = "£0";
    finalTotalEl.textContent = "£0";
    totalDurationMinutes = 60;
    return;
  }

  let total = 0;
  let hasFrom = false;

  basket.forEach(service => {
    const priceStr = service.price || "";
    const priceValue = moneyFromText(priceStr);
    total += priceValue;
    if (/^from\s+/i.test(priceStr)) hasFrom = true;

    // duration from text like "1 hour 30 min"
    const dur = parseDurationFromText(service.time || "");
    totalDurationMinutes += dur;

    const rowHtml = `
      <div class="booking-service-item">
        <div class="booking-service-main">
          <div class="booking-service-name">${service.name}</div>
          <div class="booking-service-time">${service.time || ""}</div>
        </div>
        <div class="booking-service-price">${service.price}</div>
      </div>
    `;
    servicesSummaryEl.insertAdjacentHTML("beforeend", rowHtml);
    finalSummaryEl.insertAdjacentHTML("beforeend", rowHtml);
  });

  if (totalDurationMinutes <= 0) totalDurationMinutes = 60;

  const label = hasFrom ? "Estimated total:" : "Total:";
  summaryTotalLabelEl.textContent = label;
  finalTotalLabelEl.textContent = label;
  summaryTotalEl.textContent = "£" + total.toFixed(2);
  finalTotalEl.textContent = "£" + total.toFixed(2);
}

// ========== 6. Stylists (step 1) ==========

function populateStylistSelect(selectEl) {
  selectEl.innerHTML = "";
  STYLISTS.forEach(st => {
    const opt = document.createElement("option");
    opt.value = st.id;
    opt.textContent = st.name;
    selectEl.appendChild(opt);
  });
}

function renderStylistControls() {
  populateStylistSelect(stylistAllSelect);
  stylistAllSelect.value = stylistForAll;

  stylistPerWrapper.innerHTML = "";
  basket.forEach(service => {
    const row = document.createElement("div");
    row.className = "service-stylist-row";

    const label = document.createElement("span");
    label.textContent = service.name;

    const select = document.createElement("select");
    populateStylistSelect(select);
    select.value = stylistPerService[service.name] || "any";
    select.addEventListener("change", () => {
      stylistPerService[service.name] = select.value;
    });

    row.appendChild(label);
    row.appendChild(select);
    stylistPerWrapper.appendChild(row);
  });

  if (mode === "one") {
    stylistAllSelect.parentElement.classList.remove("hidden");
    stylistPerWrapper.classList.add("hidden");
  } else {
    stylistAllSelect.parentElement.classList.add("hidden");
    stylistPerWrapper.classList.remove("hidden");
  }
}

function getStylistsForBooking() {
  if (!basket.length) return null;
  const map = new Map();

  if (mode === "one") {
    const s = STYLISTS.find(st => st.id === stylistForAll) || STYLISTS[0];
    map.set(s.id, s);
  } else {
    for (const service of basket) {
      const id = stylistPerService[service.name] || "any";
      const s = STYLISTS.find(st => st.id === id) || STYLISTS[0];
      map.set(s.id, s);
    }
  }
  return Array.from(map.values());
}

function validateStep1() {
  if (!basket.length) {
    step1ErrorEl.textContent =
      "You have no services selected. Please go back and choose at least one style.";
    return false;
  }

  if (mode === "one" && !stylistAllSelect.value) {
    step1ErrorEl.textContent = "Please choose a stylist for your services.";
    return false;
  }

  if (mode === "per-service") {
    for (const service of basket) {
      const id = stylistPerService[service.name] || "any";
      if (!id) {
        step1ErrorEl.textContent = "Please select a stylist for each service.";
        return false;
      }
    }
  }

  step1ErrorEl.textContent = "";
  return true;
}

// ========== 7. Date & time (step 2) ==========

function limitDateInput() {
  const today = new Date();
  const min = today.toISOString().slice(0, 10);

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const max = maxDate.toISOString().slice(0, 10);

  bookingDateInput.min = min;
  bookingDateInput.max = max;
}

// returns map: stylistId -> Set of BLOCKED hour-start times like "09:00"
async function getBlockedTimesForDate(dateStr) {
  if (!dateStr) return {};
  const snapshot = await get(ref(db, "bookings/" + dateStr));
  const blocked = {};

  if (snapshot.exists()) {
    snapshot.forEach(child => {
      const data = child.val();
      const time = data.time;
      const durationMinutes = data.durationMinutes || 60;
      const services = data.services || [];
      if (!time) return;

      const startHour = parseInt(time.split(":")[0], 10) || OPEN_HOUR;
      const hoursNeeded = Math.max(1, Math.ceil(durationMinutes / 60));

      services.forEach(svc => {
        const id = svc.stylistId || "any";
        if (!blocked[id]) blocked[id] = new Set();
        for (let i = 0; i < hoursNeeded; i++) {
          const slotTime = formatHHMM(startHour + i);
          blocked[id].add(slotTime);
        }
      });
    });
  }
  return blocked;
}

async function renderTimeSlots() {
  timeSlotsEl.innerHTML = "";
  dateStatusEl.textContent = "";
  selectedTime = null;

  if (!selectedDate) {
    dateStatusEl.textContent = "Please choose a date first.";
    return;
  }

  const dateObj = new Date(selectedDate + "T00:00:00");
  if (isSunday(dateObj)) {
    dateStatusEl.textContent = "We are closed on Sundays. Please pick Monday to Saturday.";
    bookingDateInput.value = "";
    selectedDate = null;
    return;
  }

  const involvedStylists = getStylistsForBooking();
  if (!involvedStylists || !involvedStylists.length) {
    dateStatusEl.textContent = "Go back and choose a stylist first.";
    return;
  }

  const blocked = await getBlockedTimesForDate(selectedDate);
  const hoursNeededNew = Math.max(1, Math.ceil(totalDurationMinutes / 60));

  let anyAvailable = false;

  // only show start times that fit before closing and don't clash
  for (let h = OPEN_HOUR; h <= CLOSE_HOUR - hoursNeededNew; h++) {
    const startTime = formatHHMM(h);
    let blockedHere = false;

    for (const s of involvedStylists) {
      const set = blocked[s.id];
      for (let i = 0; i < hoursNeededNew; i++) {
        const t = formatHHMM(h + i);
        if (set && set.has(t)) {
          blockedHere = true;
          break;
        }
      }
      if (blockedHere) break;
    }

    if (blockedHere) {
      // this start would overlap existing bookings → do NOT show it
      continue;
    }

    anyAvailable = true;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = startTime;
    btn.className = "time-slot";
    btn.addEventListener("click", () => {
      selectedTime = startTime;
      document
        .querySelectorAll(".time-slot")
        .forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
    });
    timeSlotsEl.appendChild(btn);
  }

  if (!anyAvailable) {
    dateStatusEl.textContent =
      "This day is fully booked for the length of your services. Please choose another date.";
  }
}

function validateStep2() {
  if (!selectedDate) {
    dateStatusEl.textContent = "Please select a date.";
    return false;
  }
  if (!selectedTime) {
    dateStatusEl.textContent = "Please select a time.";
    return false;
  }
  dateStatusEl.textContent = "";
  return true;
}

// ========== 8. Email text builders ==========

function buildBookingText(booking, forClient) {
  const lines = [];

  if (forClient) {
    lines.push("Thank you for booking with Nu-Trendz!");
    lines.push("");
    lines.push("Here are your booking details:");
  } else {
    lines.push("New booking from Nu-Trendz website");
  }

  lines.push("==================================");
  lines.push("");
  lines.push(`Name: ${booking.customerName}`);
  lines.push(`Email: ${booking.email}`);
  lines.push(`Phone: ${booking.phone}`);
  lines.push(`Date: ${booking.date}`);
  lines.push(`Time: ${booking.time}`);
  lines.push(`Payment choice: ${booking.paymentMethod}`);
  lines.push("");

  lines.push("Services:");
  booking.services.forEach(svc => {
    lines.push(
      `- ${svc.name} (${svc.time || "time not set"}) — ${svc.price} — Stylist: ${svc.stylistName}`
    );
  });

  lines.push("");
  if (booking.notes) {
    lines.push("Client notes:");
    lines.push(booking.notes);
  } else {
    lines.push("Client notes: (none)");
  }

  if (forClient) {
    lines.push("");
    lines.push(
      "We will contact you to confirm the appointment and talk about payment if needed."
    );
    lines.push("If anything looks wrong, please contact Nu-Trendz as soon as possible.");
  }

  return lines.join("\n");
}

async function sendConfirmationEmails(bookingData) {
  if (typeof emailjs === "undefined") return;

  emailjs.init(EMAIL_CONFIG.publicKey);

  const adminMsg = buildBookingText(bookingData, false);
  const clientMsg = buildBookingText(bookingData, true);

  const adminPayload = {
    from_name: "Nu-Trendz Website",
    reply_to: bookingData.email,
    to_email: EMAIL_CONFIG.adminEmail,
    message: adminMsg
  };

  const clientPayload = {
    from_name: "Nu-Trendz",
    reply_to: EMAIL_CONFIG.adminEmail,
    to_email: bookingData.email,
    message: clientMsg
  };

  await Promise.all([
    emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.adminTemplateId,
      adminPayload,
      EMAIL_CONFIG.publicKey
    ),
    emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.customerTemplateId,
      clientPayload,
      EMAIL_CONFIG.publicKey
    )
  ]);
}

// ========== 9. Final save (step 3) ==========

async function saveBooking(e) {
  e.preventDefault();

  if (!validateStep1()) {
    setStep(1);
    return;
  }
  if (!validateStep2()) {
    setStep(2);
    return;
  }

  let fullName = limitString(document.getElementById("fullName").value.trim(), 100);
  let email = limitString(document.getElementById("email").value.trim(), 120);
  let phone = limitString(document.getElementById("phone").value.trim(), 30);
  let notes = limitString(document.getElementById("notes").value.trim(), 1000);

  if (!fullName || !email || !phone) {
    finalStatusEl.textContent =
      "Please fill in your name, email and phone so we can contact you.";
    finalStatusEl.style.color = "#ff6b6b";
    return;
  }
  if (!validateEmail(email)) {
    finalStatusEl.textContent = "Please enter a valid email address.";
    finalStatusEl.style.color = "#ff6b6b";
    return;
  }
  if (!validatePhone(phone)) {
    finalStatusEl.textContent =
      "Please enter a phone number we can call or text (at least 9 digits).";
    finalStatusEl.style.color = "#ff6b6b";
    return;
  }

  finalStatusEl.style.color = "#ff9800";
  finalStatusEl.textContent = "Checking your time and saving your booking...";

  const paymentMethod = getSelectedPaymentMethod();
  const involvedStylists = getStylistsForBooking();
  const hoursNeededNew = Math.max(1, Math.ceil(totalDurationMinutes / 60));

  // Re-check to avoid double-booking
  const blocked = await getBlockedTimesForDate(selectedDate);
  const startHour = parseInt(selectedTime.split(":")[0], 10) || OPEN_HOUR;

  let conflict = false;
  for (const s of involvedStylists) {
    const set = blocked[s.id];
    for (let i = 0; i < hoursNeededNew; i++) {
      const t = formatHHMM(startHour + i);
      if (set && set.has(t)) {
        conflict = true;
        break;
      }
    }
    if (conflict) break;
  }

  if (conflict) {
    finalStatusEl.textContent =
      "Sorry, someone just booked this time. Please choose another time.";
    finalStatusEl.style.color = "#ff6b6b";
    selectedTime = null;
    await renderTimeSlots(); // refresh the list so the taken slot disappears
    setStep(2);
    return;
  }

  const servicesWithStylists = basket.map(service => {
    let stylistId;
    if (mode === "one") stylistId = stylistForAll;
    else stylistId = stylistPerService[service.name] || "any";

    const stylist = STYLISTS.find(s => s.id === stylistId) || STYLISTS[0];
    return {
      name: service.name,
      time: service.time,
      price: service.price,
      stylistId: stylist.id,
      stylistName: stylist.name
    };
  });

  const dayRef = ref(db, "bookings/" + selectedDate);
  const newRef = push(dayRef);
  const bookingData = {
    id: newRef.key,
    createdAt: Date.now(),
    customerName: fullName,
    email,
    phone,
    notes,
    date: selectedDate,
    time: selectedTime,
    paymentMethod,
    status: "pending",
    durationMinutes: totalDurationMinutes,
    services: servicesWithStylists
  };

  try {
    await set(newRef, bookingData);

    try {
      await sendConfirmationEmails(bookingData);
    } catch (emailErr) {
      console.error("Email sending failed:", emailErr);
      // continue anyway; booking is saved
    }

    // store summary for confirmation page
    const totalText = finalTotalEl.textContent || "";
    const lastBookingSummary = {
      customerName: bookingData.customerName,
      date: bookingData.date,
      time: bookingData.time,
      paymentMethod: bookingData.paymentMethod,
      services: bookingData.services,
      total: totalText,
      bookingId: bookingData.id
    };
    localStorage.setItem("lastBooking", JSON.stringify(lastBookingSummary));

    // clear booking flow state so next booking starts fresh
    localStorage.removeItem("basket");
    localStorage.removeItem("bookingCurrentStep");
    localStorage.removeItem("bookingBasketSig");

    // go to confirmation page
    window.location.href = "booking-confirmation.html";
  } catch (err) {
    console.error("Firebase booking error", err);
    finalStatusEl.textContent =
      "Something went wrong while saving your booking. Please try again in a moment.";
    finalStatusEl.style.color = "#ff6b6b";
  }
}

// ========== 10. Init & step-click behaviour ==========

document.addEventListener("DOMContentLoaded", () => {
  servicesSummaryEl = document.getElementById("servicesSummary");
  summaryTotalEl = document.getElementById("summaryTotal");
  summaryTotalLabelEl = document.getElementById("summaryTotalLabel");
  stylistAllSelect = document.getElementById("stylistAll");
  stylistPerWrapper = document.getElementById("stylistPerServiceWrapper");
  step1ErrorEl = document.getElementById("step1Error");

  stepPanels = Array.from(document.querySelectorAll(".booking-step"));
  stepIndicators = Array.from(document.querySelectorAll(".steps-strip .step"));

  bookingDateInput = document.getElementById("bookingDate");
  timeSlotsEl = document.getElementById("timeSlots");
  dateStatusEl = document.getElementById("dateStatus");

  toStep2Btn = document.getElementById("toStep2");
  toStep3Btn = document.getElementById("toStep3");
  backTo1Btn = document.getElementById("backTo1");
  backTo2Btn = document.getElementById("backTo2");

  detailsForm = document.getElementById("detailsForm");
  finalStatusEl = document.getElementById("finalStatus");
  finalSummaryEl = document.getElementById("finalSummary");
  finalTotalEl = document.getElementById("finalTotal");
  finalTotalLabelEl = document.getElementById("finalTotalLabel");

  loadBasket();

  // decide whether to restore last step or start fresh
  const signatureNow = getBasketSignature();
  const savedSignature = localStorage.getItem("bookingBasketSig");
  const savedStep = Number(localStorage.getItem("bookingCurrentStep") || "1");

  if (!signatureNow) {
    // no services → always fresh, step 1
    localStorage.removeItem("bookingBasketSig");
    localStorage.removeItem("bookingCurrentStep");
    currentStep = 1;
  } else if (!savedSignature || savedSignature !== signatureNow) {
    // basket changed → treat as NEW booking
    localStorage.setItem("bookingBasketSig", signatureNow);
    localStorage.removeItem("bookingCurrentStep");
    currentStep = 1;
  } else {
    // same basket → restore step
    if (savedStep >= 1 && savedStep <= 3) {
      currentStep = savedStep;
    } else {
      currentStep = 1;
    }
  }

  renderServicesSummary();
  renderStylistControls();
  limitDateInput();

  // stylist mode switch
  document.querySelectorAll("input[name='stylistMode']").forEach(radio => {
    radio.addEventListener("change", () => {
      mode = radio.value;
      renderStylistControls();
    });
  });

  stylistAllSelect.addEventListener("change", () => {
    stylistForAll = stylistAllSelect.value;
  });

  // step buttons
  toStep2Btn.addEventListener("click", () => {
    if (!validateStep1()) return;
    setStep(2);
  });

  backTo1Btn.addEventListener("click", () => setStep(1));

  bookingDateInput.addEventListener("change", async () => {
    selectedDate = bookingDateInput.value || null;
    if (selectedDate) {
      await renderTimeSlots(); // always pull latest bookings for that date
    } else {
      timeSlotsEl.innerHTML = "";
      dateStatusEl.textContent = "";
    }
  });

  toStep3Btn.addEventListener("click", () => {
    if (!validateStep2()) return;
    setStep(3);
  });

  backTo2Btn.addEventListener("click", () => setStep(2));

  detailsForm.addEventListener("submit", saveBooking);

  // clickable steps: users can go back, but not skip forward
  stepIndicators.forEach(ind => {
    ind.addEventListener("click", () => {
      const target = Number(ind.dataset.step);
      if (target < currentStep) {
        setStep(target);
      }
    });
    ind.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        const target = Number(ind.dataset.step);
        if (target < currentStep) {
          setStep(target);
        }
      }
    });
  });

  // initial step
  setStep(currentStep);
});
