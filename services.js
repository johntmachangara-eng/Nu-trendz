// ============================================================
// NU-TRENDZ SERVICES PAGE – FIRESTORE + BASKET
// ============================================================

document.addEventListener("DOMContentLoaded", () => {
  // ----------------------------------------------------------
  // 1. LOAD DATA FROM FIRESTORE
  // ----------------------------------------------------------
  const db = window.db || null;

  // categoryName -> [ { name, time, price, desc } ]
  let servicesData = {};
  let orderedCategories = [];

  if (!db) {
    console.error("❌ Firestore (window.db) not found. Check services.html Firebase config.");
    init(); // still init UI so page doesn't explode
  } else {
    db.collection("categories")
      .orderBy("order")
      .get()
      .then((snapshot) => {
        const loaded = {};
        const catNames = [];

        snapshot.forEach((doc) => {
          const data = doc.data() || {};
          const services = Array.isArray(data.services) ? data.services : [];
          loaded[doc.id] = services;
          catNames.push(doc.id);
        });

        servicesData = loaded;
        orderedCategories = catNames;
        console.log("✅ Loaded services from Firestore:", servicesData);
        init();
      })
      .catch((err) => {
        console.error("❌ Error loading services from Firestore:", err);
        servicesData = {};
        orderedCategories = [];
        init();
      });
  }

  // ----------------------------------------------------------
  // 2. STATE
  // ----------------------------------------------------------
  let basket = [];
  let searchTerm = "";

  // keep any existing basket so user can come back from booking.html
  try {
    const raw = localStorage.getItem("basket");
    basket = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(basket)) basket = [];
  } catch {
    basket = [];
  }

  function saveBasket() {
    localStorage.setItem("basket", JSON.stringify(basket));
  }

  // ----------------------------------------------------------
  // 3. DOM ELEMENTS
  // ----------------------------------------------------------
  const els = {
    allServices: document.getElementById("all-services"),
    floatingCategories: document.getElementById("floatingCategories"),
    searchInput: document.getElementById("serviceSearch"),
    navbar: document.getElementById("navbar"),
    basketBar: document.getElementById("basketBar"),
    basketBarSummary: document.getElementById("basketBarSummary"),
    basketBarProceed: document.getElementById("basketBarProceed"),
    basketPanel: document.getElementById("basketPanel"),
    closeBasket: document.getElementById("closeBasket"),
    basketList: document.getElementById("basketList"),
    basketTotal: document.getElementById("basketTotal"),
    basketFooterLabel: document.getElementById("basketFooterLabel"),
    basketOverlay: document.getElementById("basketOverlay"),
    basketToast: document.getElementById("basketToast"),
    basketStatus: document.getElementById("basketStatus"),
  };

  const required = [
    "allServices",
    "floatingCategories",
    "searchInput",
    "basketBar",
    "basketBarSummary",
    "basketBarProceed",
    "basketPanel",
    "closeBasket",
    "basketList",
    "basketTotal",
    "basketOverlay",
  ];

  for (const key of required) {
    if (!els[key]) {
      console.error("❌ Missing required DOM element:", key);
      return;
    }
  }

  function getScrollY() {
    return (
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      0
    );
  }

  // ----------------------------------------------------------
  // 3a. HELPERS
  // ----------------------------------------------------------
  function showToast(message) {
    if (!els.basketToast) return;
    els.basketToast.textContent = message;
    els.basketToast.classList.add("show");
    setTimeout(() => {
      els.basketToast.classList.remove("show");
    }, 1500);
  }

  function announceBasket(message) {
    if (!els.basketStatus) return;
    els.basketStatus.textContent = message;
  }

  function debounce(fn, delay) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), delay);
    };
  }

  function moneyFromText(str) {
    if (!str) return 0;
    const v = parseFloat(str.replace(/[^\d.]/g, ""));
    return isNaN(v) ? 0 : v;
  }

  function formatPriceForCard(priceStr) {
    if (!priceStr) return "";
    if (/^from\s+/i.test(priceStr)) {
      const numberPart = priceStr.replace(/^from\s+/i, "").trim();
      // visually split “From” and the amount
      return `<span class="from-label">From</span> ${numberPart}`;
    }
    return priceStr;
  }

  function highlight(text, term) {
    if (!term) return text;
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp("(" + escaped + ")", "ig");
    return text.replace(re, "<mark>$1</mark>");
  }

  // Steps strip at top of services page
  function updateSteps() {
    const steps = document.querySelectorAll(".steps-strip .step");
    if (!steps.length) return;

    steps.forEach((step) => {
      step.classList.remove("step--active", "step--complete");
    });

    if (!basket.length) {
      if (steps[0]) steps[0].classList.add("step--active");
    } else {
      if (steps[0]) steps[0].classList.add("step--complete");
      if (steps[1]) steps[1].classList.add("step--active");
    }
  }

  // ----------------------------------------------------------
  // 4. BASKET
  // ----------------------------------------------------------
  function updateBasketBarSummary(total, hasFrom) {
    if (!els.basketBarSummary) return;
    if (!basket.length) {
      els.basketBarSummary.textContent = "No services selected yet";
      return;
    }

    const label = hasFrom ? "Estimated" : "Total";
    const count =
      basket.length === 1
        ? "1 service selected"
        : basket.length + " services selected";

    els.basketBarSummary.textContent =
      count + " • " + label + " £" + total.toFixed(2);
  }

  function updateBasket() {
    els.basketList.innerHTML = "";

    if (!basket.length) {
      els.basketList.innerHTML =
        '<p style="color:#aaa;text-align:center;">No services selected.</p>';
      if (els.basketTotal) els.basketTotal.textContent = "£0";
      if (els.basketFooterLabel) els.basketFooterLabel.textContent = "Total:";
      updateBasketBarSummary(0, false);
      saveBasket();
      updateSteps();
      return;
    }

    // sync button state on cards
    const bookBtns = document.querySelectorAll(".book-btn");
    bookBtns.forEach((btn) => {
      const name = btn.dataset.name;
      const inBasket = basket.some((item) => item.name === name);
      btn.disabled = inBasket;
      btn.textContent = inBasket ? "In Basket ✓" : "Book Now";
    });

    let total = 0;
    let hasFromPrice = false;

    basket.forEach((item, index) => {
      const priceStr = item.price || "";
      const value = moneyFromText(priceStr);
      total += value;
      if (/^from\s+/i.test(priceStr)) hasFromPrice = true;

      const row = document.createElement("div");
      row.className = "basket-item";
      row.innerHTML = `
        <div class="basket-item-info">
          <span class="basket-item-name">${item.name}</span>
          <span class="basket-item-price">${item.price}</span>
        </div>
        <button class="basket-remove-btn" data-index="${index}">🗑 Remove</button>
      `;
      els.basketList.appendChild(row);
    });

    if (els.basketTotal) els.basketTotal.textContent = "£" + total.toFixed(2);
    if (els.basketFooterLabel) {
      els.basketFooterLabel.textContent = hasFromPrice
        ? "Estimated total:"
        : "Total:";
    }

    updateBasketBarSummary(total, hasFromPrice);
    saveBasket();
    updateSteps();
  }

  function toggleBasket(open) {
    if (open) {
      els.basketPanel.classList.add("open");
      if (els.basketOverlay) els.basketOverlay.classList.add("show");

      // lock scroll on desktop
      const scrollBarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      if (scrollBarWidth > 0) {
        document.body.style.paddingRight = scrollBarWidth + "px";
      }
      document.body.classList.add("no-scroll");

      if (els.basketBar) {
        els.basketBar.setAttribute("aria-expanded", "true");
        const caret = els.basketBar.querySelector(".basket-bar-caret");
        if (caret) caret.textContent = "▼";
      }
    } else {
      els.basketPanel.classList.remove("open");
      if (els.basketOverlay) els.basketOverlay.classList.remove("show");

      document.body.classList.remove("no-scroll");
      document.body.style.paddingRight = "";

      if (els.basketBar) {
        els.basketBar.setAttribute("aria-expanded", "false");
        const caret = els.basketBar.querySelector(".basket-bar-caret");
        if (caret) caret.textContent = "▲";
      }
    }
  }

  function addToBasket(name, price, time) {
    if (basket.some((item) => item.name === name)) return false;
    basket.push({ name, price, time });
    updateBasket();
    announceBasket(
      `${name} added to selection. ${basket.length} service(s) selected.`
    );
    return true;
  }

  function removeFromBasket(index) {
    const removed = basket[index];
    basket.splice(index, 1);
    updateBasket();

    const selectorName = (removed.name || "").replace(/"/g, '\\"');
    const btn = document.querySelector(
      `.book-btn[data-name="${selectorName}"]`
    );
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Book Now";
    }

    announceBasket(
      `${removed.name} removed. ${basket.length} service(s) selected.`
    );
  }

  // ----------------------------------------------------------
  // 5. RENDER SERVICES FROM DATA
  // ----------------------------------------------------------
  function renderServices() {
    els.allServices.innerHTML = "";

    if (!orderedCategories.length) {
      els.allServices.innerHTML =
        "<p class='message'>Services will appear here once categories are added.</p>";
      return;
    }

    orderedCategories.forEach((categoryName) => {
      const list = servicesData[categoryName] || [];
      if (!list.length) return;

      const section = document.createElement("section");
      section.className = "category-section";
      section.id = "cat-" + categoryName.replace(/\s+/g, "-");

      const h2 = document.createElement("h2");
      h2.textContent = categoryName;
      section.appendChild(h2);

      const grid = document.createElement("div");
      grid.className = "service-grid";

      list.forEach((svc) => {
        const name = (svc.name || "").trim();
        const time = (svc.time || "").trim();
        const price = (svc.price || "").trim();
        const desc = (svc.desc || "").trim();

        // basic search filter
        const haystack = (name + " " + time + " " + price + " " + desc).toLowerCase();
        if (searchTerm && !haystack.includes(searchTerm.toLowerCase())) {
          return; // skip if doesn’t match search
        }

        const card = document.createElement("div");
        card.className = "service-card";
        card.dataset.name = name;
        card.dataset.time = time;
        card.dataset.price = price;

        const inBasket = basket.some((item) => item.name === name);

        card.innerHTML = `
          <div class="service-card-main">
            <h3 class="service-card-title">
              ${highlight(name, searchTerm)}
            </h3>
            <p class="service-card-meta">
              <span class="service-time">${time}</span>
              <span class="service-price">${formatPriceForCard(price)}</span>
            </p>
            ${
              desc
                ? `<p class="service-card-desc">${highlight(desc, searchTerm)}</p>`
                : ""
            }
          </div>
          <div class="service-card-actions">
            <button 
              class="book-btn"
              data-name="${name.replace(/"/g, "&quot;")}"
              data-time="${time.replace(/"/g, "&quot;")}"
              data-price="${price.replace(/"/g, "&quot;")}"
              ${inBasket ? "disabled" : ""}
            >
              ${inBasket ? "In Basket ✓" : "Book Now"}
            </button>
          </div>
        `;

        grid.appendChild(card);
      });

      if (grid.children.length) {
        section.appendChild(grid);
        els.allServices.appendChild(section);
      }
    });

    if (!els.allServices.children.length) {
      els.allServices.innerHTML =
        "<p class='message'>No services match your search yet. Try a different word.</p>";
    }
  }

  // ----------------------------------------------------------
  // 6. FLOATING CATEGORY BUTTONS
  // ----------------------------------------------------------
  function renderCategoryButtons() {
    els.floatingCategories.innerHTML = "";

    if (!orderedCategories.length) {
      els.floatingCategories.innerHTML =
        "<span class='category-pill disabled'>No categories yet</span>";
      return;
    }

    orderedCategories.forEach((name, index) => {
      const pill = document.createElement("button");
      pill.type = "button";
      pill.className = "category-pill";
      pill.textContent = name;
      pill.dataset.target = "#cat-" + name.replace(/\s+/g, "-");

      if (index === 0) pill.classList.add("active");

      pill.addEventListener("click", () => {
        const target = document.querySelector(pill.dataset.target);
        if (target) {
          const offset = 150; // nav + spacing
          const y =
            target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: y, behavior: "smooth" });
        }

        document
          .querySelectorAll(".category-pill")
          .forEach((p) => p.classList.remove("active"));
        pill.classList.add("active");
      });

      els.floatingCategories.appendChild(pill);
    });
  }

  function syncCategoryHighlightOnScroll() {
    const sections = document.querySelectorAll(".category-section");
    if (!sections.length) return;

    const scrollY = getScrollY();
    const offset = 130;

    let activeId = null;
    sections.forEach((sec) => {
      const top = sec.offsetTop - offset;
      if (scrollY >= top) {
        activeId = sec.id;
      }
    });

    if (!activeId) return;

    const pills = document.querySelectorAll(".category-pill");
    pills.forEach((pill) => {
      const target = pill.dataset.target || "";
      pill.classList.toggle(
        "active",
        target.replace("#", "") === activeId
      );
    });
  }

  // ----------------------------------------------------------
  // 7. SEARCH
  // ----------------------------------------------------------
  function initSearch() {
    const handler = debounce(() => {
      searchTerm = els.searchInput.value.trim();
      renderServices();
      updateBasket(); // re-sync disabled states
    }, 150);

    els.searchInput.addEventListener("input", handler);
  }

  // ----------------------------------------------------------
  // 8. EVENT LISTENERS (BASKET + NAV)
  // ----------------------------------------------------------
  function initEventListeners() {
    // bottom bar toggle
    if (els.basketBar) {
      const toggle = () => {
        const isOpen = els.basketPanel.classList.contains("open");
        toggleBasket(!isOpen);
      };
      els.basketBar.addEventListener("click", toggle);
      els.basketBar.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
    }

    // close panel
    if (els.closeBasket) {
      els.closeBasket.addEventListener("click", () => toggleBasket(false));
    }
    if (els.basketOverlay) {
      els.basketOverlay.addEventListener("click", () => toggleBasket(false));
    }

    // ESC key
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") toggleBasket(false);
    });

    // remove item buttons
    els.basketList.addEventListener("click", (e) => {
      const btn = e.target.closest(".basket-remove-btn");
      if (!btn) return;
      const index = Number(btn.dataset.index);
      if (!Number.isNaN(index)) removeFromBasket(index);
    });

    // add to basket from cards
    document.addEventListener("click", (e) => {
      const btn = e.target.closest(".book-btn");
      if (!btn) return;

      const name = btn.dataset.name || "";
      const price = btn.dataset.price || "";
      const time = btn.dataset.time || "";

      if (!name) return;

      if (basket.some((item) => item.name === name)) {
        btn.textContent = "In Basket ✓";
        btn.disabled = true;
        return;
      }

      if (addToBasket(name, price, time)) {
        btn.textContent = "Added ✓";
        btn.disabled = true;
        showToast(name + " added to selection");
        setTimeout(() => {
          btn.textContent = "In Basket ✓";
        }, 600);
      }
    });

    // proceed → booking.html
    if (els.basketBarProceed) {
      els.basketBarProceed.addEventListener("click", (e) => {
        e.stopPropagation();
        if (!basket.length) {
          showToast("Add at least one service first.");
          return;
        }
        // basket already saved to localStorage
        window.location.href = "booking.html";
      });
    }

    // navbar shrink on scroll (desktop only)
    window.addEventListener("scroll", () => {
      if (!els.navbar) return;
      if (window.innerWidth <= 768) {
        els.navbar.classList.remove("shrink");
        return;
      }
      els.navbar.classList.toggle("shrink", getScrollY() > 50);
      syncCategoryHighlightOnScroll();
    });

    // initial sync
    syncCategoryHighlightOnScroll();
  }

  // ----------------------------------------------------------
  // 9. INIT
  // ----------------------------------------------------------
  function init() {
    renderCategoryButtons();
    renderServices();
    initSearch();
    initEventListeners();
    updateBasket();
    updateSteps();
  }
});
