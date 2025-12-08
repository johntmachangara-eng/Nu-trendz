// admin-bookings.js – tidy, responsive bookings manager with search, chips & summary

document.addEventListener("DOMContentLoaded", () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBshg3uKI9UK043ItARQhPf4kw4fDqDnkc",
    authDomain: "database-93ee7.firebaseapp.com",
    projectId: "database-93ee7",
    storageBucket: "database-93ee7.firebasestorage.app",
    messagingSenderId: "512064197430",
    appId: "1:512064197430:web:62ca518c67d20f82001997",
    databaseURL:
      "https://database-93ee7-default-rtdb.europe-west1.firebasedatabase.app",
  };

  // Avoid double init
  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const auth = firebase.auth();
  const db = firebase.database();
  const BOOKINGS_PATH = "bookings";

  // DOM
  const statusEl = document.getElementById("status");
  const logoutBtn = document.getElementById("logoutBtn");

  const filterDateFrom = document.getElementById("filterDateFrom");
  const filterDateTo = document.getElementById("filterDateTo");
  const applyFilterBtn = document.getElementById("applyFilterBtn");
  const resetFilterBtn = document.getElementById("resetFilterBtn");

  const searchText = document.getElementById("searchText");
  const statusFilterChips = document.getElementById("statusFilterChips");
  const quickRangeRow = document.getElementById("quickRangeRow");

  const bookingsMessage = document.getElementById("bookingsMessage");
  const tableWrapper = document.getElementById("tableWrapper");
  const bookingsTbody = document.getElementById("bookingsTbody");
  const summaryRow = document.getElementById("summaryRow");

  if (
    !statusEl ||
    !logoutBtn ||
    !filterDateFrom ||
    !filterDateTo ||
    !applyFilterBtn ||
    !resetFilterBtn ||
    !searchText ||
    !statusFilterChips ||
    !quickRangeRow ||
    !bookingsMessage ||
    !tableWrapper ||
    !bookingsTbody ||
    !summaryRow
  ) {
    console.error(
      "Admin bookings: missing DOM elements. Check admin-bookings.html IDs."
    );
    return;
  }

  // === Shared mobile sidebar toggle (matches admin-panel.js) ===
  const sidebar = document.querySelector(".sidebar");
  const sidebarBackdrop = document.getElementById("sidebarBackdrop");
  const navToggle = document.getElementById("navToggle");

  function setSidebarOpen(isOpen) {
    if (!sidebar) return;
    sidebar.classList.toggle("sidebar--open", isOpen);

    if (sidebarBackdrop) {
      sidebarBackdrop.classList.toggle(
        "sidebar-backdrop--visible",
        isOpen
      );
    }

    if (navToggle) {
      navToggle.classList.toggle("nav-toggle--open", isOpen);
    }
  }

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      const isOpen = sidebar.classList.contains("sidebar--open");
      setSidebarOpen(!isOpen);
    });
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener("click", () => setSidebarOpen(false));
  }

  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
      setSidebarOpen(false);
    }
  });

  document.querySelectorAll(".sidebar .nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (window.innerWidth <= 800) setSidebarOpen(false);
    });
  });

  // ---------- State ----------

  let allBookings = [];            // all bookings loaded for current date range
  let currentStatus = "all";       // all | pending | confirmed | cancelled

  const setStatus = (msg) => (statusEl.textContent = msg);

  function setBookingsMessage(msg, isError = false) {
    bookingsMessage.textContent = msg || "";
    bookingsMessage.classList.remove("message--error", "message--success");
    if (!msg) return;
    bookingsMessage.classList.add(
      isError ? "message--error" : "message--success"
    );
  }

  function todayISO() {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  }

  function addDaysISO(startIso, days) {
    const [y, m, d] = startIso.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    return date.toISOString().slice(0, 10);
  }

  function getDateRange() {
    let from = filterDateFrom.value;
    let to = filterDateTo.value;

    if (!from || !to) {
      // Default: today → next 30 days
      from = todayISO();
      to = addDaysISO(from, 30);
    }

    if (from > to) {
      const tmp = from;
      from = to;
      to = tmp;
    }

    return { from, to };
  }

  function buildDateList(fromIso, toIso) {
    const dates = [];
    let current = fromIso;
    while (current <= toIso) {
      dates.push(current);
      current = addDaysISO(current, 1);
    }
    return dates;
  }

  function formatDateDisplay(iso) {
    const [y, m, d] = iso.split("-").map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString(undefined, {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const formatTimeDisplay = (t) => t || "";

  function normaliseStatus(raw) {
    if (!raw) return "pending";
    const s = String(raw).toLowerCase();
    if (s === "confirmed") return "confirmed";
    if (s === "cancelled" || s === "canceled") return "cancelled";
    return "pending";
  }

  function statusLabel(status) {
    switch (status) {
      case "confirmed":
        return "Confirmed";
      case "cancelled":
        return "Cancelled";
      default:
        return "Pending";
    }
  }

  // ---------- Load bookings from Firebase ----------

  function loadBookings() {
    const { from, to } = getDateRange();
    filterDateFrom.value = from;
    filterDateTo.value = to;

    const dates = buildDateList(from, to);
    if (!dates.length) {
      tableWrapper.style.display = "none";
      summaryRow.innerHTML = "";
      setBookingsMessage("No dates selected.", true);
      return;
    }

    setStatus("Loading bookings…");
    setBookingsMessage("Loading bookings…");
    tableWrapper.style.display = "none";
    bookingsTbody.innerHTML = "";
    summaryRow.innerHTML = "";

    const promises = dates.map((dateStr) =>
      db
        .ref(`${BOOKINGS_PATH}/${dateStr}`)
        .once("value")
        .then((snap) => ({ date: dateStr, snapshot: snap }))
        .catch((err) => {
          console.error("Error reading bookings for", dateStr, err);
          return { date: dateStr, snapshot: null };
        })
    );

    Promise.all(promises)
      .then((results) => {
        const all = [];

        results.forEach(({ date, snapshot }) => {
          if (!snapshot || !snapshot.exists()) return;

          snapshot.forEach((child) => {
            const data = child.val() || {};
            const servicesArray = Array.isArray(data.services)
              ? data.services
              : [];

            const servicesText = servicesArray
              .map((s) => {
                if (!s) return "";
                const name = s.name || "";
                const stylist = s.stylistName ? ` (${s.stylistName})` : "";
                return name + stylist;
              })
              .filter(Boolean)
              .join(", ");

            all.push({
              id: child.key,
              date,
              time: data.time || "",
              customerName: data.customerName || "",
              phone: data.phone || "",
              email: data.email || "",
              status: normaliseStatus(data.status),
              paymentMethod: data.paymentMethod || "pay_at_venue",
              servicesText,
            });
          });
        });

        all.sort((a, b) => {
          if (a.date === b.date) return a.time.localeCompare(b.time);
          return a.date.localeCompare(b.date);
        });

        allBookings = all;
        applyFiltersAndRender();

        setStatus("Bookings loaded.");
      })
      .catch((err) => {
        console.error("Error loading bookings", err);
        setStatus("Error loading bookings.");
        setBookingsMessage("Error loading bookings. Check console.", true);
      });
  }

  // ---------- Filtering + summary ----------

  function applyFiltersAndRender() {
    const filtered = applyFilters(allBookings);
    renderSummary(allBookings, filtered);
    renderBookings(filtered);

    if (!filtered.length) {
      setBookingsMessage("No bookings match these filters.", false);
    } else {
      setBookingsMessage(`Showing ${filtered.length} booking(s).`, false);
    }
  }

  function applyFilters(list) {
    const search = searchText.value.trim().toLowerCase();
    const statusValue = currentStatus;
    const today = todayISO();

    return list.filter((b) => {
      // status filter
      if (statusValue !== "all" && b.status !== statusValue) {
        return false;
      }

      // search filter
      if (search) {
        const text =
          [
            b.customerName,
            b.phone,
            b.email,
            b.servicesText,
            b.date,
            b.time,
          ]
            .join(" ")
            .toLowerCase() || "";
        if (!text.includes(search)) {
          return false;
        }
      }

      return true;
    });
  }

  function renderSummary(all, shown) {
    summaryRow.innerHTML = "";
    if (!all.length) return;

    const today = todayISO();
    const total = all.length;
    const pending = all.filter((b) => b.status === "pending").length;
    const confirmed = all.filter((b) => b.status === "confirmed").length;
    const cancelled = all.filter((b) => b.status === "cancelled").length;
    const todayCount = all.filter((b) => b.date === today).length;
    const showing = shown.length;

    const makePill = (label, value) => {
      const span = document.createElement("span");
      span.className = "summary-pill";
      span.innerHTML = `<strong>${value}</strong> ${label}`;
      return span;
    };

    summaryRow.appendChild(makePill("total in range", total));
    summaryRow.appendChild(makePill("pending", pending));
    summaryRow.appendChild(makePill("confirmed", confirmed));
    summaryRow.appendChild(makePill("cancelled", cancelled));
    summaryRow.appendChild(makePill("today", todayCount));
    summaryRow.appendChild(makePill("showing now", showing));
  }

  function renderBookings(list) {
    bookingsTbody.innerHTML = "";

    if (!list.length) {
      tableWrapper.style.display = "none";
      return;
    }

    tableWrapper.style.display = "block";

    const today = todayISO();

    list.forEach((b) => {
      const tr = document.createElement("tr");
      tr.dataset.date = b.date;
      tr.dataset.id = b.id;

      if (b.date === today) {
        tr.classList.add("row-today");
      }

      const tdDate = document.createElement("td");
      tdDate.textContent = formatDateDisplay(b.date);

      const tdTime = document.createElement("td");
      tdTime.textContent = formatTimeDisplay(b.time);

      const tdCustomer = document.createElement("td");
      const custName = document.createElement("div");
      custName.className = "booking-customer";
      custName.textContent = b.customerName || "Unknown";

      const custContact = document.createElement("div");
      custContact.className = "booking-contact";
      const phoneText = b.phone ? `Tel: ${b.phone}` : "";
      const emailText = b.email ? `Email: ${b.email}` : "";
      custContact.innerHTML = [phoneText, emailText].filter(Boolean).join("<br>");

      tdCustomer.appendChild(custName);
      tdCustomer.appendChild(custContact);

      const tdServices = document.createElement("td");
      tdServices.className = "booking-services";
      tdServices.textContent = b.servicesText || "No services listed";

      const tdStatus = document.createElement("td");
      const statusSpan = document.createElement("span");
      statusSpan.className = `status-badge status-${b.status}`;
      statusSpan.textContent = statusLabel(b.status);
      tdStatus.appendChild(statusSpan);

      const tdActions = document.createElement("td");
      const actionsWrapper = document.createElement("div");
      actionsWrapper.className = "booking-actions";

      const confirmBtn = document.createElement("button");
      confirmBtn.type = "button";
      confirmBtn.className = "btn-pill confirm";
      confirmBtn.textContent = "Mark confirmed";
      confirmBtn.dataset.action = "confirm";

      const cancelBtn = document.createElement("button");
      cancelBtn.type = "button";
      cancelBtn.className = "btn-pill cancel";
      cancelBtn.textContent = "Mark cancelled";
      cancelBtn.dataset.action = "cancel";

      actionsWrapper.appendChild(confirmBtn);
      actionsWrapper.appendChild(cancelBtn);
      tdActions.appendChild(actionsWrapper);

      tr.appendChild(tdDate);
      tr.appendChild(tdTime);
      tr.appendChild(tdCustomer);
      tr.appendChild(tdServices);
      tr.appendChild(tdStatus);
      tr.appendChild(tdActions);

      bookingsTbody.appendChild(tr);
    });
  }

  // ---------- Update status (pending / confirmed / cancelled) ----------

  function updateBookingStatus(dateStr, bookingId, newStatus, rowEl) {
    if (!dateStr || !bookingId) return;

    setStatus("Updating status…");

    db.ref(`${BOOKINGS_PATH}/${dateStr}/${bookingId}/status`)
      .set(newStatus)
      .then(() => {
        setStatus("Status updated.");

        // Update badge in DOM
        const badge = rowEl.querySelector(".status-badge");
        if (badge) {
          const norm = normaliseStatus(newStatus);
          badge.className = `status-badge status-${norm}`;
          badge.textContent = statusLabel(norm);
        }

        // Update in local cache so summary / filters stay correct
        const target = allBookings.find(
          (b) => b.id === bookingId && b.date === dateStr
        );
        if (target) {
          target.status = normaliseStatus(newStatus);
        }
        applyFiltersAndRender();
      })
      .catch((err) => {
        console.error("Error updating status", err);
        setStatus("Error updating status. Check console.");
      });
  }

  bookingsTbody.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const row = btn.closest("tr");
    if (!row) return;

    const dateStr = row.dataset.date;
    const bookingId = row.dataset.id;
    const action = btn.dataset.action;

    if (action === "confirm") {
      updateBookingStatus(dateStr, bookingId, "confirmed", row);
    } else if (action === "cancel") {
      updateBookingStatus(dateStr, bookingId, "cancelled", row);
    }
  });

  // ---------- Status chips & search ----------

  statusFilterChips.addEventListener("click", (e) => {
    const btn = e.target.closest(".status-chip");
    if (!btn) return;

    const status = btn.dataset.status || "all";
    currentStatus = status;

    statusFilterChips.querySelectorAll(".status-chip").forEach((chip) => {
      chip.classList.toggle(
        "status-chip--active",
        chip === btn
      );
    });

    applyFiltersAndRender();
  });

  searchText.addEventListener("input", () => {
    applyFiltersAndRender();
  });

  // ---------- Quick date ranges ----------

  quickRangeRow.addEventListener("click", (e) => {
    const btn = e.target.closest(".quick-range-btn");
    if (!btn) return;

    const range = btn.dataset.range;

    const today = todayISO();

    if (range === "today") {
      filterDateFrom.value = today;
      filterDateTo.value = today;
    } else if (range === "7") {
      filterDateFrom.value = today;
      filterDateTo.value = addDaysISO(today, 7);
    } else if (range === "30") {
      filterDateFrom.value = today;
      filterDateTo.value = addDaysISO(today, 30);
    }

    quickRangeRow.querySelectorAll(".quick-range-btn").forEach((b) => {
      b.classList.toggle("quick-range-btn--active", b === btn);
    });

    loadBookings();
  });

  // ---------- Auth + base date range ----------

  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "admin.html";
    } else {
      setStatus(`Logged in as ${user.email}`);
      const from = todayISO();
      const to = addDaysISO(from, 30);
      filterDateFrom.value = from;
      filterDateTo.value = to;
      loadBookings();
    }
  });

  logoutBtn.addEventListener("click", () => {
    auth
      .signOut()
      .then(() => (window.location.href = "admin.html"))
      .catch((err) => console.error("Error signing out:", err));
  });

  applyFilterBtn.addEventListener("click", () => {
    // When the admin manually adjusts date range and hits Apply
    quickRangeRow
      .querySelectorAll(".quick-range-btn")
      .forEach((b) => b.classList.remove("quick-range-btn--active"));
    loadBookings();
  });

  resetFilterBtn.addEventListener("click", () => {
    const from = todayISO();
    const to = addDaysISO(from, 30);
    filterDateFrom.value = from;
    filterDateTo.value = to;

    quickRangeRow
      .querySelectorAll(".quick-range-btn")
      .forEach((b) =>
        b.classList.toggle("quick-range-btn--active", b.dataset.range === "30")
      );

    searchText.value = "";
    currentStatus = "all";
    statusFilterChips
      .querySelectorAll(".status-chip")
      .forEach((chip) =>
        chip.classList.toggle(
          "status-chip--active",
          chip.dataset.status === "all"
        )
      );

    loadBookings();
  });
});
