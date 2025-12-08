// booking.js – 3-step booking flow with Realtime DB + popup calendar

// ---------- 1. CONFIG ----------

const OPEN_MINUTES = 9 * 60;          // 09:00
const CLOSE_MINUTES = 18 * 60 + 30;   // 18:30
const SLOT_SIZE = 60;                 // 30-minute blocks

// DB paths (match your Realtime Database structure)
const BOOKINGS_PATH = "bookings";
const BOOKING_SLOTS_PATH = "bookingSlots";

const STYLISTS = [
  { id: "any",   name: "Any professional" },
  { id: "fala",  name: "Fala" },
  { id: "joice", name: "Joice" },
  { id: "neuza", name: "Neuza" }
];

const EMAIL_CONFIG = {
  publicKey: "Lgg9FCMDk-lwWnNxZ",
  serviceId: "service_63ezrdn",
  adminTemplateId: "template_5kd1bxc",
  customerTemplateId: "template_5kd1bxc",
  adminEmail: "PUT_SALON_EMAIL_HERE@example.com" // change to salon email if you want admin emails
};

// Firebase RTDB is provided globally in booking.html as window.rtdb
const db = window.rtdb || null;

// ---------- 2. STATE ----------

let basket = [];
let mode = "one";              // "one" or "per-service"
let stylistForAll = "any";
let stylistPerService = {};    // { serviceName: stylistId }

let selectedDate = null;       // "YYYY-MM-DD"
let selectedTime = null;       // "HH:MM"
let totalDurationMinutes = 60;

let currentStep = 1;
let historyReady = false;

// DOM refs
let servicesSummaryEl, summaryTotalEl, summaryTotalLabelEl;
let stylistAllSelect, stylistPerWrapper, stylistGlobalSelectWrapper, step1ErrorEl;
let stepPanels, stepIndicators;
let bookingDateInput, bookingDateButton, bookingDateLabel, timeSlotsEl, dateStatusEl;
let toStep2Btn, toStep3Btn, backTo1Btn, backTo2Btn;
let detailsForm, finalStatusEl;
let finalSummaryEl, finalTotalEl, finalTotalLabelEl;
let firstNameInput, lastNameInput, fullNameInput;

// Calendar DOM refs + state
let calendarEl, calendarDaysEl, calendarMonthLabelEl;
let calendarPrevBtn, calendarNextBtn, calendarCloseBtn;
let calendarOpen = false;
let calendarMonth = null;
let calendarMinDate = null;
let calendarMaxDate = null;

// ---------- 3. HELPERS ----------

function minutesFromHHMM(str) {
  const [h, m] = (str || "09:00").split(":").map(n => parseInt(n, 10) || 0);
  return h * 60 + m;
}

function hhmmFromMinutes(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function moneyFromText(str) {
  if (!str) return 0;
  const v = parseFloat(str.replace(/[^\d.]/g, ""));
  return isNaN(v) ? 0 : v;
}

/**
 * Parse durations like:
 *  - "45 min"
 *  - "2h"
 *  - "2 hours"
 *  - "1h 30"
 *  - "1 hr 45 mins"
 *  - "90 minutes"
 *  - "120"  (treated as minutes if 30–240)
 */
function parseDurationFromText(text) {
  if (!text) return 60;
  const lower = text.toLowerCase();

  const hourMin = lower.match(
    /(\d+)\s*(h|hr|hrs|hour|hours)[^\d]*?(\d+)\s*(m|min|mins|minute|minutes)?/
  );
  if (hourMin) {
    const h = parseInt(hourMin[1], 10) || 0;
    const m = parseInt(hourMin[3], 10) || 0;
    return h * 60 + m;
  }

  const hourOnly = lower.match(/(\d+)\s*(h|hr|hrs|hour|hours)/);
  if (hourOnly) {
    return (parseInt(hourOnly[1], 10) || 1) * 60;
  }

  const minOnly = lower.match(/(\d+)\s*(m|min|mins|minute|minutes)/);
  if (minOnly) {
    return parseInt(minOnly[1], 10) || 60;
  }

  const plainNumber = lower.match(/(\d{2,3})/);
  if (plainNumber) {
    const v = parseInt(plainNumber[1], 10);
    if (v >= 30 && v <= 240) return v;
  }

  return 60;
}

function markDateStatus(message, isError) {
  if (!dateStatusEl) return;
  dateStatusEl.textContent = message || "";
  dateStatusEl.classList.toggle("step-error", !!isError);
}

function formatNamePart(str) {
  if (!str) return "";
  return str
    .trim()
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(s => s[0].toUpperCase() + s.slice(1))
    .join(" ");
}

function isValidNamePart(str) {
  if (!str) return false;
  const clean = str.trim();
  if (clean.length < 2) return false;
  return /^[A-Za-zÀ-ž' -]+$/.test(clean);
}

function formatDisplayDate(iso) {
  if (!iso) return "Select a date";
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric"
  });
}

// ---------- 3a. HISTORY HELPERS ----------

function pushStepHistory(stepNum) {
  if (!historyReady || !window.history || !history.pushState) return;
  const url = new URL(window.location.href);
  url.searchParams.set("step", String(stepNum));
  history.pushState({ bookingStep: stepNum }, "", url.toString());
}

function setStep(stepNum, options) {
  const opts = options || {};
  const fromHistory = !!opts.fromHistory;
  const skipHistory = !!opts.skipHistory;

  currentStep = stepNum;
  localStorage.setItem("bookingCurrentStep", String(stepNum));

  stepPanels.forEach(panel => {
    const num = Number(panel.dataset.stepPanel);
    panel.classList.toggle("hidden", num !== stepNum);
  });

  stepIndicators.forEach(ind => {
    const num = Number(ind.dataset.step);
    ind.classList.remove("step--active", "step--complete", "step--disabled");

    if (num < stepNum) {
      ind.classList.add("step--complete");
    } else if (num === stepNum) {
      ind.classList.add("step--active");
    } else {
      ind.classList.add("step--disabled");
    }
  });

  if (stepNum === 2 && selectedDate) {
    renderTimeSlots();
  }

  if (historyReady && !fromHistory && !skipHistory) {
    pushStepHistory(stepNum);
  }
}

// ---------- 4. BASKET + SUMMARY ----------

function loadBasket() {
  try {
    const raw = localStorage.getItem("basket");
    basket = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(basket)) basket = [];
  } catch {
    basket = [];
  }
}

function renderServicesSummary() {
  servicesSummaryEl.innerHTML = "";
  finalSummaryEl.innerHTML = "";
  totalDurationMinutes = 0;

  if (!basket.length) {
    servicesSummaryEl.innerHTML = `
      <p>
        You don't have any services selected yet.<br>
        Go back to the Services page and choose at least one style.
      </p>
      <div class="step-buttons" style="margin-top:10px;">
        <a href="services.html" class="primary-btn">
          Go to services
        </a>
      </div>
    `;
    summaryTotalEl.textContent = "£0";
    finalTotalEl.textContent = "£0";
    totalDurationMinutes = 60;
    localStorage.setItem("bookingDurationMinutes", String(totalDurationMinutes));
    return;
  }

  let total = 0;
  let hasFrom = false;

  basket.forEach(service => {
    const priceStr = service.price || "";
    const priceValue = moneyFromText(priceStr);
    total += priceValue;
    if (/^from\s+/i.test(priceStr)) hasFrom = true;

    const dur = parseDurationFromText(service.time || "");
    totalDurationMinutes += dur;

    const rowHtml = `
      <div class="booking-service-item">
        <div class="booking-service-main">
          <div class="booking-service-name">${service.name}</div>
          <div class="booking-service-time">${service.time || ""}</div>
        </div>
        <div class="booking-service-price">${service.price || ""}</div>
      </div>
    `;
    servicesSummaryEl.insertAdjacentHTML("beforeend", rowHtml);
    finalSummaryEl.insertAdjacentHTML("beforeend", rowHtml);
  });

  if (totalDurationMinutes <= 0) totalDurationMinutes = 60;
  localStorage.setItem("bookingDurationMinutes", String(totalDurationMinutes));

  const label = hasFrom ? "Estimated total:" : "Total:";
  summaryTotalLabelEl.textContent = label;
  finalTotalLabelEl.textContent = label;
  summaryTotalEl.textContent = "£" + total.toFixed(2);
  finalTotalEl.textContent = "£" + total.toFixed(2);
}

// ---------- 5. STYLIST CONTROLS ----------

function renderStylistControls() {
  stylistAllSelect.innerHTML = "";
  STYLISTS.forEach(s => {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.name;
    stylistAllSelect.appendChild(opt);
  });
  stylistAllSelect.value = stylistForAll;

  stylistPerWrapper.innerHTML = "";
  basket.forEach(service => {
    const wrapper = document.createElement("div");
    wrapper.className = "form-group";
    const selectId = `stylist-${service.name.replace(/\s+/g, "-")}`;

    const label = document.createElement("label");
    label.htmlFor = selectId;
    label.textContent = `Stylist for ${service.name}`;

    const select = document.createElement("select");
    select.id = selectId;
    STYLISTS.forEach(s => {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.name;
      select.appendChild(opt);
    });

    select.value = stylistPerService[service.name] || "any";
    select.addEventListener("change", () => {
      stylistPerService[service.name] = select.value;
    });

    wrapper.appendChild(label);
    wrapper.appendChild(select);
    stylistPerWrapper.appendChild(wrapper);
  });

  const radios = document.querySelectorAll('input[name="stylistMode"]');
  radios.forEach(r => {
    r.addEventListener("change", () => {
      mode = r.value === "per-service" ? "per-service" : "one";
      updateStylistVisibility();
    });
  });

  stylistAllSelect.addEventListener("change", () => {
    stylistForAll = stylistAllSelect.value;
  });

  updateStylistVisibility();
}

function updateStylistVisibility() {
  if (!stylistGlobalSelectWrapper || !stylistPerWrapper) return;
  if (mode === "one") {
    stylistGlobalSelectWrapper.classList.remove("hidden");
    stylistPerWrapper.classList.add("hidden");
  } else {
    stylistGlobalSelectWrapper.classList.add("hidden");
    stylistPerWrapper.classList.remove("hidden");
  }
}

function buildServicesWithStylists() {
  return basket.map(service => {
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
}

// ---------- 6. DATE LIMITS & DURATION ----------

function limitDateInput() {
  if (!bookingDateInput) return;

  const today = new Date();
  const min = today.toISOString().slice(0, 10);

  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 30);
  const max = maxDate.toISOString().slice(0, 10);

  bookingDateInput.min = min;
  bookingDateInput.max = max;
}

/**
 * Shared duration logic:
 * - uses totalDurationMinutes
 * - falls back to localStorage
 * - ensures at least 30 mins
 */
function getEffectiveDurationMinutes() {
  let duration = Math.max(30, totalDurationMinutes || 0);

  if (!duration || duration < 30) {
    const stored = parseInt(
      localStorage.getItem("bookingDurationMinutes") || "60",
      10
    );
    if (!isNaN(stored) && stored >= 30) {
      duration = stored;
    } else {
      duration = 60;
    }
  }

  return duration;
}

/**
 * Read public slot data for a specific date from /bookingSlots/{date}
 * (contains only time + durationMinutes, no personal info).
 */
function getBlockedIntervalsForDate(dateStr) {
  if (!db || !dateStr) return Promise.resolve([]);

  return db
    .ref(BOOKING_SLOTS_PATH + "/" + dateStr)
    .once("value")
    .then(snapshot => {
      const blocked = [];
      snapshot.forEach(child => {
        const data = child.val() || {};
        const startMin = minutesFromHHMM(data.time || "09:00");
        const duration = data.durationMinutes || 60;
        const endMin = startMin + duration;
        blocked.push({ start: startMin, end: endMin });
      });
      return blocked;
    })
    .catch(err => {
      console.error("Error reading slots for date", dateStr, err);
      // On error: treat as no existing bookings so page still works
      return [];
    });
}

function slotIsFree(start, end, blocked) {
  return !blocked.some(b => !(end <= b.start || start >= b.end));
}

// ---------- 7. CALENDAR POPUP ----------

function parseISODate(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

function initCalendarState() {
  if (!bookingDateInput) return;
  const minStr = bookingDateInput.min;
  const maxStr = bookingDateInput.max;
  if (!minStr || !maxStr) return;

  calendarMinDate = parseISODate(minStr);
  calendarMaxDate = parseISODate(maxStr);

  if (!calendarMonth) {
    calendarMonth = new Date(
      calendarMinDate.getFullYear(),
      calendarMinDate.getMonth(),
      1
    );
  }
}

function buildCalendarGrid() {
  if (!calendarEl || !calendarDaysEl || !calendarMonthLabelEl || !bookingDateInput) {
    return;
  }

  calendarDaysEl.innerHTML = "";
  if (!calendarMonth) return;

  const year = calendarMonth.getFullYear();
  const month = calendarMonth.getMonth();

  const label = calendarMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });
  calendarMonthLabelEl.textContent = label;

  const firstOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Monday-based index: 0 = Mon ... 6 = Sun
  const jsDay = firstOfMonth.getDay(); // 0=Sun
  const firstDayIndex = (jsDay + 6) % 7;

  const minStr = bookingDateInput.min;
  const maxStr = bookingDateInput.max;

  const datesForAvailability = [];

  // empty cells before day 1
  for (let i = 0; i < firstDayIndex; i++) {
    const empty = document.createElement("span");
    empty.className = "calendar-day calendar-day--empty";
    calendarDaysEl.appendChild(empty);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day);
    const iso = date.toISOString().slice(0, 10);

    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "calendar-day booking-day";
    cell.dataset.date = iso;
    cell.textContent = String(day);

    if (iso < minStr || iso > maxStr) {
      cell.classList.add("booking-day--disabled");
      cell.dataset.disabled = "true";
    } else {
      cell.classList.add("booking-day--in-range");
      cell.dataset.disabled = "false";
      datesForAvailability.push(iso);
    }

    if (selectedDate === iso) {
      cell.classList.add("booking-day--selected");
    }

    calendarDaysEl.appendChild(cell);
  }

  markCalendarAvailability(datesForAvailability);
}

function markCalendarAvailability(dateList) {
  if (!calendarEl) return;

  const duration = getEffectiveDurationMinutes();
  const maxDuration = CLOSE_MINUTES - OPEN_MINUTES;

  if (duration > maxDuration) {
    dateList.forEach(dateStr => {
      const el = calendarEl.querySelector(
        '.booking-day[data-date="' + dateStr + '"]'
      );
      if (!el) return;
      el.classList.add("booking-day--full");
      el.dataset.disabled = "true";
    });
    return;
  }

  dateList.forEach(dateStr => {
    getBlockedIntervalsForDate(dateStr)
      .then(blocked => {
        let hasSlot = false;

        for (
          let start = OPEN_MINUTES;
          start + duration <= CLOSE_MINUTES;
          start += SLOT_SIZE
        ) {
          const end = start + duration;
          if (slotIsFree(start, end, blocked)) {
            hasSlot = true;
            break;
          }
        }

        const el = calendarEl.querySelector(
          '.booking-day[data-date="' + dateStr + '"]'
        );
        if (!el) return;

        if (hasSlot) {
          el.dataset.disabled = "false";
        } else {
          el.classList.add("booking-day--full");
          el.dataset.disabled = "true";
        }
      })
      .catch(() => {
        // On error, leave as available instead of blocking bookings
      });
  });
}

function updateCalendarSelection() {
  if (!calendarEl) return;
  const allDays = calendarEl.querySelectorAll(".booking-day");
  allDays.forEach(d => {
    d.classList.toggle(
      "booking-day--selected",
      !!selectedDate && d.dataset.date === selectedDate
    );
  });
}

function openCalendar() {
  if (!calendarEl) return;
  calendarEl.classList.add("booking-calendar--open");
  calendarEl.setAttribute("aria-hidden", "false");
  calendarOpen = true;
  if (bookingDateButton) {
    bookingDateButton.setAttribute("aria-expanded", "true");
  }
}

function closeCalendar() {
  if (!calendarEl) return;
  calendarEl.classList.remove("booking-calendar--open");
  calendarEl.setAttribute("aria-hidden", "true");
  calendarOpen = false;
  if (bookingDateButton) {
    bookingDateButton.setAttribute("aria-expanded", "false");
  }
}

function changeCalendarMonth(delta) {
  if (!calendarMonth || !calendarMinDate || !calendarMaxDate) return;

  const newMonth = new Date(
    calendarMonth.getFullYear(),
    calendarMonth.getMonth() + delta,
    1
  );

  const monthStart = newMonth;
  const monthEnd = new Date(newMonth.getFullYear(), newMonth.getMonth() + 1, 0);

  if (monthEnd < calendarMinDate || monthStart > calendarMaxDate) {
    return;
  }

  calendarMonth = newMonth;
  buildCalendarGrid();
}

function updateDateLabel() {
  if (!bookingDateLabel) return;
  bookingDateLabel.textContent = formatDisplayDate(selectedDate);
}

// ---------- 8. TIME SLOTS (NO DUPLICATE / BOOKED SLOTS) ----------

function renderTimeSlots() {
  if (!bookingDateInput || !timeSlotsEl) return;

  const dateStr = bookingDateInput.value;
  timeSlotsEl.innerHTML = "";

  if (!dateStr) {
    markDateStatus("Please choose a date first.", true);
    return;
  }

  selectedDate = dateStr;
  localStorage.setItem("bookingDate", selectedDate);

  updateCalendarSelection();
  updateDateLabel();
  markDateStatus("Checking availability…", false);

  getBlockedIntervalsForDate(dateStr).then(blocked => {
    timeSlotsEl.innerHTML = "";

    const duration = getEffectiveDurationMinutes();
    const maxDuration = CLOSE_MINUTES - OPEN_MINUTES;

    if (duration > maxDuration) {
      markDateStatus(
        "The selected services are too long to fit in one day. Remove a service or contact the salon.",
        true
      );
      return;
    }

    const slots = [];
    const usedStarts = new Set();

    for (
      let start = OPEN_MINUTES;
      start + duration <= CLOSE_MINUTES;
      start += SLOT_SIZE
    ) {
      const end = start + duration;

      // Never show slot if it overlaps an existing booking
      if (!slotIsFree(start, end, blocked)) continue;

      if (usedStarts.has(start)) continue;
      usedStarts.add(start);

      slots.push({ start, end });
    }

    if (!slots.length) {
      markDateStatus(
        "This day is fully booked or has no suitable slots. Try another date.",
        true
      );
      return;
    }

    markDateStatus("Select a time that suits you.", false);

    slots.forEach(slot => {
      const timeText = hhmmFromMinutes(slot.start);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "time-slot";
      btn.textContent = timeText;
      btn.dataset.time = timeText;
      if (selectedTime === timeText) {
        btn.classList.add("selected");
      }
      timeSlotsEl.appendChild(btn);
    });
  });
}

// ---------- 9. VALIDATION ----------

function validateStep1() {
  if (!basket.length) {
    step1ErrorEl.textContent =
      "You need at least one service in your basket before booking.";
    return false;
  }

  if (mode === "one") {
    if (!stylistAllSelect.value) {
      step1ErrorEl.textContent = "Please choose a stylist.";
      return false;
    }
  } else {
    for (const service of basket) {
      const id = stylistPerService[service.name];
      if (!id) {
        step1ErrorEl.textContent =
          "Please choose a stylist for each service.";
        return false;
      }
    }
  }

  step1ErrorEl.textContent = "";
  return true;
}

function validateStep2() {
  if (!selectedDate) {
    markDateStatus("Please choose a date.", true);
    return false;
  }
  if (!selectedTime) {
    markDateStatus("Please choose a time.", true);
    return false;
  }
  markDateStatus("", false);
  return true;
}

function getSelectedPaymentMethod() {
  const checked = document.querySelector(
    'input[name="paymentMethod"]:checked'
  );
  return checked ? checked.value : "pay_at_venue";
}

// ---------- 10. EMAILS ----------

function sendConfirmationEmails(bookingData) {
  if (!window.emailjs || !EMAIL_CONFIG.publicKey) {
    return Promise.resolve();
  }

  try {
    const totalText = document.getElementById("finalTotal")?.textContent || "";

    const customerParams = {
      to_email: bookingData.email,
      to_name: bookingData.customerName,
      date: bookingData.date,
      time: bookingData.time,
      payment_method:
        bookingData.paymentMethod === "pay_at_venue"
          ? "Pay at the salon"
          : "Decide later",
      services: (bookingData.services || [])
        .map(s => `${s.name} (${s.stylistName})`)
        .join(", "),
      total: totalText
    };

    const adminParams = {
      to_email: EMAIL_CONFIG.adminEmail,
      customer_name: bookingData.customerName,
      customer_phone: bookingData.phone,
      customer_email: bookingData.email,
      date: bookingData.date,
      time: bookingData.time,
      payment_method: customerParams.payment_method,
      services: customerParams.services,
      total: totalText
    };

    const sendCustomer = emailjs.send(
      EMAIL_CONFIG.serviceId,
      EMAIL_CONFIG.customerTemplateId,
      customerParams,
      EMAIL_CONFIG.publicKey
    );

    const sendAdmin = EMAIL_CONFIG.adminEmail
      ? emailjs.send(
          EMAIL_CONFIG.serviceId,
          EMAIL_CONFIG.adminTemplateId,
          adminParams,
          EMAIL_CONFIG.publicKey
        )
      : Promise.resolve();

    return Promise.allSettled([sendCustomer, sendAdmin]).then(() => {});
  } catch (err) {
    console.warn("EmailJS error (ignored):", err);
    return Promise.resolve();
  }
}

// ---------- 11. SAVE BOOKING ----------

function saveBooking(fullName, email, phone, notes) {
  if (!db) {
    finalStatusEl.textContent =
      "Booking system is not connected right now. Please contact the salon directly.";
    finalStatusEl.style.color = "#ff6b6b";
    return;
  }

  if (!selectedDate || !selectedTime) {
    finalStatusEl.textContent =
      "Please pick a date and time before confirming.";
    finalStatusEl.style.color = "#ff6b6b";
    return;
  }

  finalStatusEl.style.color = "#f59e0b";
  finalStatusEl.textContent = "Checking availability and saving your booking…";

  const paymentMethod = getSelectedPaymentMethod();
  const duration = getEffectiveDurationMinutes();

  const startMin = minutesFromHHMM(selectedTime);
  const endMin = startMin + duration;

  getBlockedIntervalsForDate(selectedDate).then(blocked => {
    if (!slotIsFree(startMin, endMin, blocked)) {
      finalStatusEl.textContent =
        "Sorry, this time was just taken. Please choose another time.";
      finalStatusEl.style.color = "#ff6b6b";
      selectedTime = null;
      renderTimeSlots();
      setStep(2);
      return;
    }

    const servicesWithStylists = buildServicesWithStylists();

    // Private booking (full data)
    const privateRef = db
      .ref(BOOKINGS_PATH + "/" + selectedDate)
      .push();

    // Public slot (time + duration only)
    const slotRef = db.ref(
      BOOKING_SLOTS_PATH + "/" + selectedDate + "/" + privateRef.key
    );

    const bookingData = {
      id: privateRef.key,
      createdAt: Date.now(),
      customerName: fullName,
      email,
      phone,
      notes,
      date: selectedDate,
      time: selectedTime,
      paymentMethod,
      status: "pending",
      durationMinutes: duration,
      services: servicesWithStylists
    };

    Promise.all([
      privateRef.set(bookingData),
      slotRef.set({
        time: selectedTime,
        durationMinutes: duration
      })
    ])
      .then(() => sendConfirmationEmails(bookingData))
      .then(() => {
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
        localStorage.setItem(
          "lastBooking",
          JSON.stringify(lastBookingSummary)
        );

        // Clear local storage booking state & basket
        localStorage.removeItem("basket");
        localStorage.removeItem("bookingCurrentStep");
        localStorage.removeItem("bookingBasketSig");
        localStorage.removeItem("bookingDate");
        localStorage.removeItem("bookingTime");
        localStorage.removeItem("bookingDurationMinutes");

        window.location.href = "booking-confirmation.html";
      })
      .catch(err => {
        console.error("Firebase booking error", err);

        if (err && err.code === "PERMISSION_DENIED") {
          finalStatusEl.textContent =
            "Our booking system is not allowed to save bookings right now. " +
            "Please tell the salon there is a Firebase Realtime Database rules issue.";
        } else {
          finalStatusEl.textContent =
            "Something went wrong while saving your booking" +
            (err && err.code ? " (" + err.code + ")" : "") +
            ". Please try again in a moment.";
        }

        finalStatusEl.style.color = "#ff6b6b";
      });
  });
}

// ---------- 12. INIT ----------

document.addEventListener("DOMContentLoaded", () => {
  servicesSummaryEl = document.getElementById("servicesSummary");
  summaryTotalEl = document.getElementById("summaryTotal");
  summaryTotalLabelEl = document.getElementById("summaryTotalLabel");
  stylistAllSelect = document.getElementById("stylistAll");
  stylistPerWrapper = document.getElementById("stylistPerServiceWrapper");
  stylistGlobalSelectWrapper = document.getElementById("stylistGlobalSelectWrapper");
  step1ErrorEl = document.getElementById("step1Error");

  stepPanels = Array.from(document.querySelectorAll(".booking-step"));
  stepIndicators = Array.from(
    document.querySelectorAll(".steps-strip .step")
  );

  bookingDateInput = document.getElementById("bookingDate");
  bookingDateButton = document.getElementById("bookingDateButton");
  bookingDateLabel = document.getElementById("bookingDateLabel");
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

  firstNameInput = document.getElementById("firstName");
  lastNameInput = document.getElementById("lastName");
  fullNameInput = document.getElementById("fullName");

  // calendar elements
  calendarEl = document.getElementById("bookingCalendar");
  calendarDaysEl = document.getElementById("calendarDays");
  calendarMonthLabelEl = document.getElementById("calendarMonthLabel");
  calendarPrevBtn = document.getElementById("calendarPrev");
  calendarNextBtn = document.getElementById("calendarNext");
  calendarCloseBtn = document.getElementById("calendarClose");

  loadBasket();
  renderServicesSummary();
  renderStylistControls();
  limitDateInput();

  // navigation type (to handle reload vs new visit)
  let navType = "navigate";
  try {
    const navEntry = performance.getEntriesByType("navigation")[0];
    if (navEntry && navEntry.type) {
      navType = navEntry.type;
    }
  } catch {
    // ignore
  }

  const isReload = navType === "reload";
  const isBackForward = navType === "back_forward";

  if (!isReload && !isBackForward) {
    [
      "bookingCurrentStep",
      "bookingBasketSig",
      "bookingDate",
      "bookingTime",
      "bookingDurationMinutes"
    ].forEach(key => localStorage.removeItem(key));
  }

  let storedStep = parseInt(
    localStorage.getItem("bookingCurrentStep") || "1",
    10
  );
  if (isNaN(storedStep) || storedStep < 1 || storedStep > 3) {
    storedStep = 1;
  }

  if (isReload) {
    if (storedStep === 2) {
      localStorage.removeItem("bookingDate");
      localStorage.removeItem("bookingTime");
    }
  }

  const storedDate = localStorage.getItem("bookingDate") || null;
  const storedTime = localStorage.getItem("bookingTime") || null;
  selectedDate = storedDate;
  selectedTime = storedTime;

  if (bookingDateInput && selectedDate) {
    bookingDateInput.value = selectedDate;
  }

  updateDateLabel();

  currentStep = storedStep;

  if (window.history && history.replaceState) {
    historyReady = true;
    const url = new URL(window.location.href);
    url.searchParams.set("step", String(currentStep));
    history.replaceState({ bookingStep: currentStep }, "", url.toString());
  }

  setStep(currentStep, { skipHistory: true });

  // calendar state
  initCalendarState();
  buildCalendarGrid();
  updateCalendarSelection();

  if (currentStep === 2 && selectedDate && bookingDateInput) {
    renderTimeSlots();
  }

  // Step indicators (allow going back but not skipping ahead)
  stepIndicators.forEach(ind => {
    ind.addEventListener("click", () => {
      const stepNum = Number(ind.dataset.step);
      if (stepNum < currentStep) {
        setStep(stepNum);
      }
    });
  });

  if (toStep2Btn) {
    toStep2Btn.addEventListener("click", () => {
      if (!validateStep1()) return;
      setStep(2);
    });
  }

  if (backTo1Btn) {
    backTo1Btn.addEventListener("click", () => setStep(1));
  }

  if (toStep3Btn) {
    toStep3Btn.addEventListener("click", () => {
      if (!validateStep2()) return;
      setStep(3);
    });
  }

  if (backTo2Btn) {
    backTo2Btn.addEventListener("click", () => setStep(2));
  }

  if (bookingDateInput) {
    bookingDateInput.addEventListener("change", () => {
      selectedDate = bookingDateInput.value || null;
      selectedTime = null;
      if (selectedDate) {
        localStorage.setItem("bookingDate", selectedDate);
      }
      localStorage.removeItem("bookingTime");
      updateCalendarSelection();
      updateDateLabel();
      renderTimeSlots();
    });
  }

  if (bookingDateButton) {
    bookingDateButton.addEventListener("click", () => {
      openCalendar();
    });
  }

  if (calendarPrevBtn) {
    calendarPrevBtn.addEventListener("click", () => {
      changeCalendarMonth(-1);
    });
  }

  if (calendarNextBtn) {
    calendarNextBtn.addEventListener("click", () => {
      changeCalendarMonth(1);
    });
  }

  if (calendarCloseBtn) {
    calendarCloseBtn.addEventListener("click", () => {
      closeCalendar();
    });
  }

  if (calendarEl) {
    calendarEl.addEventListener("click", e => {
      if (e.target === calendarEl) {
        closeCalendar();
        return;
      }

      const dayBtn = e.target.closest(".booking-day");
      if (!dayBtn) return;

      const dateStr = dayBtn.dataset.date;
      if (!dateStr) return;
      if (
        dayBtn.dataset.disabled === "true" ||
        dayBtn.classList.contains("booking-day--full")
      ) {
        return;
      }

      selectedDate = dateStr;
      localStorage.setItem("bookingDate", dateStr);
      selectedTime = null;
      localStorage.removeItem("bookingTime");

      if (bookingDateInput) {
        bookingDateInput.value = dateStr;
      }

      updateCalendarSelection();
      updateDateLabel();
      renderTimeSlots();
      closeCalendar();
    });
  }

  if (timeSlotsEl) {
    timeSlotsEl.addEventListener("click", e => {
      const btn = e.target.closest(".time-slot");
      if (!btn) return;

      const time = btn.dataset.time;
      if (!time) return;

      selectedTime = time;
      localStorage.setItem("bookingTime", time);

      const all = timeSlotsEl.querySelectorAll(".time-slot");
      all.forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");

      markDateStatus("", false);
    });
  }

  if (detailsForm) {
    detailsForm.addEventListener("submit", e => {
      e.preventDefault();

      let firstName = firstNameInput?.value.trim() || "";
      let lastName = lastNameInput?.value.trim() || "";
      const singleName = fullNameInput?.value.trim() || "";

      if (firstNameInput && lastNameInput) {
        if (!isValidNamePart(firstName) || !isValidNamePart(lastName)) {
          finalStatusEl.textContent =
            "Please enter a valid first and last name (letters only, at least 2 characters).";
          finalStatusEl.style.color = "#ff6b6b";
          return;
        }
      } else {
        if (!singleName || singleName.length < 2) {
          finalStatusEl.textContent = "Please enter your full name.";
          finalStatusEl.style.color = "#ff6b6b";
          return;
        }
        const parts = singleName.split(" ").filter(Boolean);
        firstName = parts[0];
        lastName = parts.slice(1).join(" ") || " ";
      }

      const formattedFirst = formatNamePart(firstName);
      const formattedLast = formatNamePart(lastName);
      const fullName = (formattedFirst + " " + formattedLast).trim();

      const email = document.getElementById("email")?.value.trim();
      const phone = document.getElementById("phone")?.value.trim();
      const notes = document.getElementById("notes")?.value.trim() || "";

      if (!email || !phone) {
        finalStatusEl.textContent =
          "Please fill in your email and mobile number.";
        finalStatusEl.style.color = "#ff6b6b";
        return;
      }

      if (!basket.length) {
        finalStatusEl.textContent =
          "Your services list is empty. Please go back and select at least one service.";
        finalStatusEl.style.color = "#ff6b6b";
        return;
      }

      if (!validateStep2()) {
        setStep(2);
        return;
      }

      saveBooking(fullName, email, phone, notes);
    });
  }

  // Browser back/forward between steps
  window.addEventListener("popstate", event => {
    if (!event.state || typeof event.state.bookingStep === "undefined") {
      return;
    }
    const step = Math.min(3, Math.max(1, Number(event.state.bookingStep) || 1));
    setStep(step, { fromHistory: true });
  });

  // ESC to close calendar
  document.addEventListener("keydown", e => {
    if (calendarOpen && e.key === "Escape") {
      closeCalendar();
    }
  });
});
