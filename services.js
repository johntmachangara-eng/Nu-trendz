// ============================================================
// NU-TRENDZ SERVICES PAGE – ROBUST BUILD
// ============================================================
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  // ==========================================================
  //  DATA
  // ==========================================================
  const servicesData = {
    "Featured": [
      { name: "Cornrows with Design", time: "1 hour", price: "£30" },
      { name: "Wash Dry", time: "1 hour 30 mins", price: "£20" },
      { name: "Dutch Braids", time: "1 hour", price: "£30" },
      { name: "4 Cornrows Stitch", time: "1 hour", price: "£25" },
      { name: "Box Braids / Twists with Extension", time: "3 hours", price: "from £50" },
      { name: "Cornrows with Extension", time: "2 hours", price: "from £30" }
    ],
    "Extras": [
      { name: "Pre-Stretch Hair Extensions", time: "35 mins", desc: "Pre-stretch the hair extensions before braiding.", price: "£10" },
      { name: "Beads", time: "35 mins", price: "from £10" },
      { name: "Mixing Hair Colors (Extensions)", time: "35 mins", price: "£10" },
      { name: "Detangling", time: "40 mins", price: "from £10" }
    ],
    "Locs": [
      { name: "Wash Dry", time: "1 hour 30 mins", price: "£20" },
      { name: "Detox", time: "2 hours", desc: "Deep-cleaning soak with clay and apple cider vinegar to remove buildup.", price: "£35" },
      { name: "Micro Loc", time: "10 hours", price: "from £250" },
      { name: "Micro Loc Extension", time: "12 hours", price: "from £300" },
      { name: "Instant Loc Extension", time: "7 hours", price: "from £200" },
      { name: "Interlocking Sister Locs", time: "4 hours", price: "from £90" },
      { name: "Interlocking", time: "3 hours", price: "from £60" },
      { name: "Retwist", time: "2 hours", price: "from £50" },
      { name: "Sister Locs", time: "6 hours", price: "from £180" },
      { name: "Comb Coil", time: "2 hours", desc: "Sections twisted tightly with a comb to form coils.", price: "from £40" },
      { name: "Instant Locking", time: "5 hours", desc: "Crochet-tool technique to form mature-looking locs instantly.", price: "from £150" }
    ],
    "Kids": [
      { name: "Treatment", time: "1 hour", price: "£30" },
      { name: "Comb Twist", time: "1 hour", price: "£35" },
      { name: "Instant Loc", time: "4 hours", price: "£80" },
      { name: "Interlocking", time: "1 hour", price: "£45" },
      { name: "Retwist", time: "1 hour", price: "£35" },
      { name: "Hair Cut", time: "1 hour", price: "from £10" },
      { name: "Box Braids / Twists with Extension", time: "3 hours", price: "from £50" },
      { name: "Cornrows with Extension", time: "2 hours", price: "from £30" }
    ],
    "Natural Hair": [
      { name: "Barrel Cornrows", time: "2 h 45 m", price: "£50" },
      { name: "Two Strand Twist", time: "2 h 30 m", price: "£40" },
      { name: "Box Braids / Twists Undercut", time: "1 h 5 m", price: "£35" },
      { name: "Braided Ponytail", time: "2 hours", desc: "Price depends on thickness.", price: "from £30" },
      { name: "4 Cornrows Stitch", time: "1 hour", price: "£25" },
      { name: "Cornrows with Design", time: "1 hour", price: "£30" },
      { name: "Twists", time: "2 hours", price: "£40" },
      { name: "Box Braids", time: "1 hour", price: "£40" }
    ],
    "Cornrows": [
      { name: "Braided Ponytail", time: "3 hours", price: "from £50" },
      { name: "Cornrows Under Wig", time: "1 hour", price: "£20" },
      { name: "Cornrows with Design", time: "3 hours", price: "from £60" },
      { name: "Stitch Cornrows", time: "2 hours", price: "from £50" },
      { name: "Dutch Braids", time: "1 hour", price: "£30" }
    ],
    "Box Braids": [
      { name: "Pick & Drop", time: "5 hours", price: "£75" },
      { name: "Kinky Twist", time: "5 hours", desc: "Twists with kinky hair extensions.", price: "from £80" },
      { name: "Coi Leray Type Braids", time: "3 hours", desc: "Box braids with curly crochet.", price: "from £55" },
      { name: "Island Twist", time: "5 hours", desc: "Twists with curly crochet.", price: "from £75" },
      { name: "Passion Twists", time: "3 hours", price: "from £70" },
      { name: "Twist", time: "4 hours", desc: "Twists with extensions added.", price: "from £70" },
      { name: "Goddess Box Braids", time: "5 h 30 m", desc: "Curls fed into the braid.", price: "from £75" },
      { name: "Box Braids", time: "5 hours", desc: "Price depends on length & thickness.", price: "from £70" }
    ],
    "Knotless Braids": [
      { name: "Bum Length Knotless", time: "5 h 30 m", price: "from £120" },
      { name: "Waist Length Knotless", time: "5 hours", price: "from £105" },
      { name: "Mid Back Knotless", time: "4 hours", price: "from £95" },
      { name: "French Curls", time: "5 hours", price: "from £85" },
      { name: "Coi Leray Type Braids", time: "3 h 15 m", price: "from £50" },
      { name: "Shoulder Knotless Braids Goddess", time: "5 hours", desc: "Curls added.", price: "from £90" },
      { name: "Knotless Braids", time: "4 hours", desc: "Price depends on thickness and length.", price: "from £85" }
    ],
    "Fulani Braids": [
      { name: "Flip Fulani", time: "5 hours", price: "£85" },
      { name: "Fulani Crochet", time: "3 h 30 m", price: "from £65" },
      { name: "Fulani Weave", time: "3 hours", desc: "Fulani with weave at the back.", price: "£60" },
      { name: "Fulani Goddess", time: "4 hours", desc: "Curls fed into the braid; price varies with style.", price: "from £75" },
      { name: "Fulani Knotless", time: "4 hours", desc: "Knotless braids at the back.", price: "from £70" },
      { name: "Fulani Box Braids", time: "3 hours", desc: "Normal box braids; price depends on length and thickness.", price: "from £65" }
    ],
    "Crochet": [
      { name: "Wrap Crochet", time: "4 h 30 m", desc: "Faux locs, butterfly locs.", price: "from £80" },
      { name: "Faux Locs Individual", time: "4 h 30 m", desc: "Single plaits into faux locs.", price: "from £75" },
      { name: "Micro Crochet", time: "3 h 30 m", desc: "Curly crochet.", price: "£70" },
      { name: "Crochet", time: "2 h 30 m", desc: "Box braids, twist, faux locs.", price: "£50" }
    ],
    "Wig": [
      { name: "Wig Styling / Cut / Straight / Wash", time: "1 hour", price: "from £20" },
      { name: "Sew In Wig", time: "1 hour", price: "£30" },
      { name: "Fit Wig (No Glue, Cornrows Included)", time: "1 hour", price: "£25" },
      { name: "Glue On", time: "3 hours", desc: "Cornrows included.", price: "£60" }
    ],
    "Weave": [
      { name: "Flip Over Weave", time: "1 hour", price: "£75" },
      { name: "Full Head Weave", time: "3 h 30 m", price: "£80" },
      { name: "LA Weave / Invisible", time: "3 h 45 m", price: "£80" },
      { name: "Rows", time: "1 h 30 m", price: "£50" },
      { name: "Weave with Leave Out (Straight)", time: "3 hours", price: "£70" },
      { name: "Weave with Leave Out (Curl)", time: "2 hours", price: "£60" },
      { name: "Weave with Closure (Straight)", time: "3 hours", price: "£75" },
      { name: "Weave with Closure (Curls)", time: "3 hours", price: "£65" }
    ],
    "Hair & Styling": [
      { name: "Sleek Ponytail Weave", time: "3 hours", desc: "Sleek ponytail using weave in the ponytail.", price: "£50" },
      { name: "Sleek Ponytail (Type 1, 2, 3)", time: "1 hour", price: "£40" },
      { name: "Sleek Ponytail (Type 4)", time: "2 h 45 m", desc: "Includes shampoo, conditioning, and silk press.", price: "£40" },
      { name: "Blow Dry / GHD Straightening", time: "1 h 30 m", price: "£30" },
      { name: "Silk Press", time: "3 hours", price: "from £60" },
      { name: "Relax and Style", time: "2 hours", price: "£40" },
      { name: "Perm / Curls", time: "3 hours", price: "from £60" },
      { name: "Hot Oil Treatment", time: "30 mins", desc: "Stimulates scalp and hair growth through oil massage.", price: "£35" }
    ]
  };

  // ==========================================================
  //  DOM ELEMENTS (with basic safety)
  // ==========================================================
  const els = {
    allServices: document.getElementById("all-services"),
    floatingCategories: document.getElementById("floatingCategories"),
    searchInput: document.getElementById("serviceSearch"),
    navbar: document.getElementById("navbar"),
    basketIcon: document.getElementById("basketIcon"),
    basketPanel: document.getElementById("basketPanel"),
    closeBasket: document.getElementById("closeBasket"),
    basketList: document.getElementById("basketList"),
    basketCount: document.getElementById("basketCount"),
    basketTotal: document.getElementById("basketTotal"),
    proceedBooking: document.getElementById("proceedBooking"),
    basketOverlay: document.getElementById("basketOverlay")   
  };

  function assertElement(key, el) {
    if (!el) {
      console.error(`[Services] Missing DOM element: ${key}`);
      return false;
    }
    return true;
  }

  const requiredKeys = [
    "allServices",
    "floatingCategories",
    "searchInput",
    "navbar",
    "basketIcon",
    "basketPanel",
    "closeBasket",
    "basketList",
    "basketCount",
    "basketTotal",
    "proceedBooking",
    "basketOverlay"
  ];

  const domOk = requiredKeys.every(key => assertElement(key, els[key]));
  if (!domOk) {
    console.error("[Services] Required DOM structure not found. Aborting init.");
    return;
  }

  // ==========================================================
  //  BASKET STATE & HELPERS
  // ==========================================================
  let basket = loadBasket();

  function loadBasket() {
    try {
      const raw = localStorage.getItem("basket");
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn("[Services] Failed to parse basket from localStorage:", e);
      return [];
    }
  }

  function saveBasket() {
    try {
      localStorage.setItem("basket", JSON.stringify(basket));
    } catch (e) {
      console.warn("[Services] Failed to save basket to localStorage:", e);
    }
  }

  function getNumericPrice(priceString) {
    const value = parseFloat(priceString.replace(/[^\d.]/g, ""));
    return isNaN(value) ? 0 : value;
  }

  // ==========================================================
  //  DOM HELPERS
  // ==========================================================
  function createServiceCard(service) {
    const { name, time, desc = "", price } = service;

    const card = document.createElement("div");
    card.className = "service-card";
    card.innerHTML = `
      <h3>${name}</h3>
      <p class="service-time">${time}</p>
      ${desc ? `<p class="service-desc">${desc}</p>` : ""}
      <p class="service-price">${price}</p>
      <button class="book-btn"
              data-name="${name}"
              data-price="${price}"
              data-time="${time}">
        Book Now
      </button>
    `;
    return card;
  }

  function getAllServicesFlat() {
    return Object.values(servicesData).flat();
  }

  // ==========================================================
  //  BASKET RENDERING & INTERACTIONS
  // ==========================================================
  function updateBasket() {
    const { basketList, basketCount, basketTotal } = els;
    basketList.innerHTML = "";
    basketCount.textContent = basket.length;

    if (!basket.length) {
      basketList.innerHTML = `<p style="color:#aaa;text-align:center;">No services selected.</p>`;
      basketTotal.textContent = "£0";
      saveBasket();
      return;
    }

    // Update all book buttons to reflect basket state
    document.querySelectorAll(".book-btn").forEach(btn => {
      const inBasket = basket.some(item => item.name === btn.dataset.name);
      btn.disabled = inBasket;
      btn.textContent = inBasket ? "In Basket ✓" : "Book Now";
    });

    // Calculate total and render basket items
    let total = 0;
    basket.forEach((item, i) => {
      total += getNumericPrice(item.price);

      const div = document.createElement("div");
      div.className = "basket-item";
      div.innerHTML = `
        <div class="basket-item-info">
          <span class="basket-item-name">${item.name}</span>
          <span class="basket-item-price">${item.price}</span>
        </div>
        <button class="basket-remove-btn" data-index="${i}">🗑 Remove</button>
      `;
      basketList.appendChild(div);
    });

    basketTotal.textContent = `£${total.toFixed(2)}`;
    saveBasket();
  }

function toggleBasket(open) {
  const panel = els.basketPanel;
  const overlay = els.basketOverlay;

  if (open) {
    panel.classList.add("open");
    if (overlay) overlay.classList.add("show");
    stopBasketNudge();
  } else {
    panel.classList.remove("open");
    if (overlay) overlay.classList.remove("show");
    if (basket.length > 0) startBasketNudge();
  }
}


  // ==========================================================
  //  BASKET NUDGE ANIMATION
  // ==========================================================
  let nudgeInterval = null;

  function triggerBasketNudge() {
    if (
      basket.length &&
      !els.basketPanel.classList.contains("open") &&
      !document.hidden
    ) {
      els.basketIcon.classList.add("nudge");
      setTimeout(() => els.basketIcon.classList.remove("nudge"), 700);
    }
  }

  function startBasketNudge() {
    if (nudgeInterval) return;
    nudgeInterval = setInterval(triggerBasketNudge, 30000);
  }

  function stopBasketNudge() {
    if (!nudgeInterval) return;
    clearInterval(nudgeInterval);
    nudgeInterval = null;
  }

  // ==========================================================
  //  RENDER SERVICES
  // ==========================================================
  function renderServices() {
    for (const [category, list] of Object.entries(servicesData)) {
      const section = document.createElement("section");
      section.className = "category-section";
      section.id = `cat-${category.replace(/\s+/g, "-")}`;
      section.innerHTML = `<h2>${category}</h2>`;

      const grid = document.createElement("div");
      grid.className = "service-grid";

      list.forEach(service => {
        grid.appendChild(createServiceCard(service));
      });

      section.appendChild(grid);
      els.allServices.appendChild(section);
    }
  }

  // ==========================================================
  //  CATEGORY NAVIGATION BUTTONS
  // ==========================================================
  function initCategoryButtons() {
    Object.keys(servicesData).forEach((category, i) => {
      const btn = document.createElement("button");
      btn.className = "category-btn" + (i === 0 ? " active" : "");
      btn.textContent = category;
      els.floatingCategories.appendChild(btn);
    });
  }

  // ==========================================================
  //  CATEGORY NAVIGATION (SCROLL-SYNCED)
  // ==========================================================
  function initCategoryScroll() {
    const buttons = Array.from(document.querySelectorAll(".category-btn"));
    const sections = Array.from(document.querySelectorAll(".category-section"));

    if (!buttons.length || !sections.length) return;

    function getSectionIdFromButton(btn) {
      return "cat-" + btn.textContent.replace(/\s+/g, "-");
    }

    let lastActiveId = null;
    function setActiveSection(sectionId) {
      if (!sectionId) return;
      const normalized = sectionId.toLowerCase();
      if (normalized === lastActiveId) return;
      lastActiveId = normalized;

      buttons.forEach(btn => {
        const btnId = getSectionIdFromButton(btn).toLowerCase();
        const isActive = btnId === lastActiveId;

        btn.classList.toggle("active", isActive);

        if (isActive) {
          btn.scrollIntoView({
            behavior: "auto",
            inline: "center",
            block: "nearest"
          });
        }
      });
    }

    const barHeight =
      (els.floatingCategories && els.floatingCategories.offsetHeight) || 80;

    const observer = new IntersectionObserver(
      entries => {
        let bestEntry = null;

        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
            bestEntry = entry;
          }
        });

        if (!bestEntry || !bestEntry.target || !bestEntry.target.id) return;
        setActiveSection(bestEntry.target.id);
      },
      {
        root: null,
        rootMargin: `-${barHeight + 10}px 0px -60% 0px`,
        threshold: [0.1, 0.25, 0.5, 0.75]
      }
    );

    sections.forEach(sec => observer.observe(sec));

    buttons.forEach(btn => {
      btn.addEventListener("click", () => {
        const targetId = getSectionIdFromButton(btn);
        const target = document.getElementById(targetId);
        if (!target) return;

        const offset = barHeight + 120;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;

        window.scrollTo({ top, behavior: "smooth" });
      });
    });
  }

  // ==========================================================
  //  SEARCH FUNCTIONALITY (de-duplicated)
  // ==========================================================
  function initSearch() {
    els.searchInput.addEventListener("input", () => {
      const term = els.searchInput.value.toLowerCase().trim();
      document.querySelector("#search-results")?.remove();

      const sections = document.querySelectorAll(".category-section");

      if (!term) {
        sections.forEach(s => (s.style.display = "block"));
        return;
      }

      sections.forEach(s => (s.style.display = "none"));

      const resultDiv = document.createElement("div");
      resultDiv.id = "search-results";
      resultDiv.className = "category-section";

      const grid = document.createElement("div");
      grid.className = "service-grid";

      let found = 0;
      const seenNames = new Set();

      getAllServicesFlat().forEach(service => {
        const { name, desc = "" } = service;
        const lowerName = name.toLowerCase();
        const lowerDesc = desc.toLowerCase();

        if (!lowerName.includes(term) && !lowerDesc.includes(term)) return;
        if (seenNames.has(lowerName)) return;
        seenNames.add(lowerName);

        grid.appendChild(createServiceCard(service));
        found++;
      });

      resultDiv.innerHTML = `<h2>Search Results for "${term}"</h2>`;
      if (found) {
        resultDiv.appendChild(grid);
      } else {
        const p = document.createElement("p");
        p.className = "no-services";
        p.textContent = "No matching services found.";
        resultDiv.appendChild(p);
      }

      els.allServices.prepend(resultDiv);

      updateBasket();
    });
  }

  // ==========================================================
  //  EVENT LISTENERS
  // ==========================================================

  
function initEventListeners() {
  // Basket toggle
  els.basketIcon.addEventListener("click", () => toggleBasket(true));
  els.closeBasket.addEventListener("click", () => toggleBasket(false));

  // CLICK AWAY: close when clicking outside the basket (on overlay)
  els.basketOverlay.addEventListener("click", () => toggleBasket(false));

  window.addEventListener("keydown", e => {
    if (e.key === "Escape") toggleBasket(false);
  });

    // Remove from basket
    els.basketList.addEventListener("click", e => {
      const btn = e.target.closest(".basket-remove-btn");
      if (!btn) return;
      const index = Number(btn.dataset.index);
      if (isNaN(index)) return;

      const removedItem = basket[index];
      basket.splice(index, 1);
      updateBasket();

      if (removedItem && removedItem.name) {
        document
          .querySelectorAll(`.book-btn[data-name="${removedItem.name}"]`)
          .forEach(matchBtn => {
            matchBtn.disabled = false;
            matchBtn.textContent = "Book Now";
          });
      }
    });

    // Proceed to booking
    els.proceedBooking.addEventListener("click", () => {
      if (!basket.length) {
        alert("Please select at least one service.");
        return;
      }
      window.location.href = "booking.html";
    });

    // Add to basket
    document.addEventListener("click", e => {
      const btn = e.target.closest(".book-btn");
      if (!btn) return;

      const { name, price, time } = btn.dataset;
      if (!name) return;

      if (basket.some(item => item.name === name)) {
        btn.textContent = "In Basket ✓";
        btn.disabled = true;
        return;
      }

      basket.push({ name, price, time });
      updateBasket();
      btn.textContent = "Added ✓";
      btn.disabled = true;
      setTimeout(() => {
        btn.textContent = "In Basket ✓";
      }, 700);
      startBasketNudge();
    });

    // Navbar shrink on scroll
    window.addEventListener("scroll", () => {
      els.navbar.classList.toggle("shrink", window.scrollY > 50);
    });

    // Nudge visibility control
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stopBasketNudge();
      else if (basket.length) startBasketNudge();
    });
  }

  // ==========================================================
  //  INITIALIZATION
  // ==========================================================
  function init() {
    initCategoryButtons();   // create pills
    renderServices();        // create sections/cards
    initCategoryScroll();    // wire scroll sync
    initSearch();
    initEventListeners();
    updateBasket();
    if (basket.length) startBasketNudge();
  }

  try {
    init();
  } catch (err) {
    console.error("[Services] Unhandled error during init:", err);
  }
});
