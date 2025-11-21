// ============================================================
// NU-TRENDZ SERVICES PAGE – FINAL PRODUCTION BUILD
// ============================================================

document.addEventListener("DOMContentLoaded", function () {

  // ============================================================
  // 1. DATA LAYER
  // ============================================================

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

  // ============================================================
  // 2. STATE MANAGEMENT
  // ============================================================

  let basket = JSON.parse(localStorage.getItem("basket")) || [];
  let searchActive = false;
  let nudgeInterval = null;

  const saveBasket = function () {
    localStorage.setItem("basket", JSON.stringify(basket));
  };

  // ============================================================
  // 3. DOM ELEMENT REFERENCES
  // ============================================================

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
    menuToggle: document.getElementById("menu-toggle"),
    navLinks: document.getElementById("nav-links"),
    basketOverlay: document.getElementById("basketOverlay")
  };

  const requiredKeys = [
    "allServices", "floatingCategories", "searchInput", "navbar",
    "basketIcon", "basketPanel", "closeBasket", "basketList",
    "basketCount", "basketTotal", "proceedBooking", "basketOverlay"
  ];

  for (let i = 0; i < requiredKeys.length; i++) {
    if (!els[requiredKeys[i]]) {
      console.error("Missing required DOM element: " + requiredKeys[i]);
      return;
    }
  }

  // helper to read scroll position in a cross-browser way
  function getScrollY() {
    return window.scrollY ||
           window.pageYOffset ||
           document.documentElement.scrollTop ||
           0;
  }

  // ============================================================
  // 4. BASKET FUNCTIONALITY
  // ============================================================

  function updateBasket() {
    els.basketList.innerHTML = "";
    els.basketCount.textContent = basket.length;

    if (!basket.length) {
      els.basketList.innerHTML = '<p style="color:#aaa;text-align:center;">No services selected.</p>';
      els.basketTotal.textContent = "£0";
      saveBasket();
      return;
    }

    const bookBtns = document.querySelectorAll(".book-btn");
    for (let i = 0; i < bookBtns.length; i++) {
      const btn = bookBtns[i];
      const inBasket = basket.some(function (item) {
        return item.name === btn.dataset.name;
      });
      btn.disabled = inBasket;
      btn.textContent = inBasket ? "In Basket ✓" : "Book Now";
    }

    let total = 0;
    for (let i = 0; i < basket.length; i++) {
      const item = basket[i];
      const priceValue = parseFloat(item.price.replace(/[^\d.]/g, "")) || 0;
      total += priceValue;

      const div = document.createElement("div");
      div.className = "basket-item";
      div.innerHTML =
        '<div class="basket-item-info">' +
          '<span class="basket-item-name">' + item.name + '</span>' +
          '<span class="basket-item-price">' + item.price + '</span>' +
        '</div>' +
        '<button class="basket-remove-btn" data-index="' + i + '">🗑 Remove</button>';
      els.basketList.appendChild(div);
    }

    els.basketTotal.textContent = "£" + total.toFixed(2);
    saveBasket();
  }

  function toggleBasket(open) {
    if (open) {
      els.basketPanel.classList.add("open");
      if (els.basketOverlay) els.basketOverlay.classList.add("show");
      stopBasketNudge();
    } else {
      els.basketPanel.classList.remove("open");
      if (els.basketOverlay) els.basketOverlay.classList.remove("show");
      if (basket.length > 0) startBasketNudge();
    }
  }

  function addToBasket(name, price, time) {
    if (basket.some(function (item) { return item.name === name; })) {
      return false;
    }
    basket.push({ name: name, price: price, time: time });
    updateBasket();
    startBasketNudge();
    return true;
  }

  function removeFromBasket(index) {
    const removedItem = basket[index];
    basket.splice(index, 1);
    updateBasket();

    const selectorName = removedItem.name.replace(/"/g, '\\"');
    const matchBtn = document.querySelector('.book-btn[data-name="' + selectorName + '"]');
    if (matchBtn) {
      matchBtn.disabled = false;
      matchBtn.textContent = "Book Now";
    }
  }

  // ============================================================
  // 5. BASKET NUDGE ANIMATION
  // ============================================================

  function triggerBasketNudge() {
    if (basket.length &&
        !els.basketPanel.classList.contains("open") &&
        !document.hidden) {
      els.basketIcon.classList.add("nudge");
      setTimeout(function () {
        els.basketIcon.classList.remove("nudge");
      }, 700);
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

  // ============================================================
  // 6. RENDER SERVICES
  // ============================================================

  function renderServices() {
    for (const category in servicesData) {
      if (!Object.prototype.hasOwnProperty.call(servicesData, category)) continue;
      const list = servicesData[category];

      const section = document.createElement("section");
      section.className = "category-section";
      section.id = "cat-" + category.replace(/\s+/g, "-");
      section.innerHTML = "<h2>" + category + "</h2>";

      const grid = document.createElement("div");
      grid.className = "service-grid";

      for (let i = 0; i < list.length; i++) {
        const service = list[i];
        const card = document.createElement("div");
        card.className = "service-card";
        card.innerHTML =
          "<h3>" + service.name + "</h3>" +
          '<p class="service-time">' + service.time + "</p>" +
          (service.desc ? '<p class="service-desc">' + service.desc + "</p>" : "") +
          '<p class="service-price">' + service.price + "</p>" +
          '<button class="book-btn" ' +
            'data-name="' + service.name + '" ' +
            'data-price="' + service.price + '" ' +
            'data-time="' + service.time + '">Book Now</button>';
        grid.appendChild(card);
      }

      section.appendChild(grid);
      els.allServices.appendChild(section);
    }
  }

  // ============================================================
  // 7. CATEGORY NAVIGATION
  // ============================================================

  function initCategoryButtons() {
    let index = 0;
    for (const category in servicesData) {
      if (!Object.prototype.hasOwnProperty.call(servicesData, category)) continue;
      const btn = document.createElement("button");
      // first one starts active; scroll handler will keep it in sync
      btn.className = "category-btn" + (index === 0 ? " active" : "");
      btn.textContent = category;
      els.floatingCategories.appendChild(btn);
      index++;
    }
  }

function initCategoryScroll() {
  const buttons = Array.prototype.slice.call(
    document.querySelectorAll(".category-btn")
  );
  const sections = Array.prototype.slice.call(
    document.querySelectorAll(".category-section")
  );

  if (!buttons.length || !sections.length) return;

  // flag to ignore scroll-based updates while we're auto-scrolling
  let isAutoScrolling = false;
  let autoScrollTimeout = null;

  // helper: ensure ONLY one button has .active, based on section id
  function setActiveBySectionId(id) {
    const activeName = id
      .replace("cat-", "")
      .replace(/-/g, " ")
      .toLowerCase();

    for (let i = 0; i < buttons.length; i++) {
      const btn = buttons[i];
      const match = btn.textContent.toLowerCase() === activeName;
      if (match) {
        btn.classList.add("active");
        // keep the active pill centered horizontally
        btn.scrollIntoView({
          behavior: "auto",
          inline: "center",
          block: "nearest"
        });
      } else {
        btn.classList.remove("active");
      }
    }
  }

  // ---------- CLICK: highlight immediately + scroll ----------
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      // Clear search mode if active
      const searchVal = els.searchInput.value.trim();
      const searchResults = document.getElementById("search-results");
      if (searchVal || searchResults) {
        els.searchInput.value = "";
        if (searchResults) searchResults.remove();
        const allSections = document.querySelectorAll(".category-section");
        allSections.forEach(function (sec) {
          sec.style.display = "block";
        });
      }

      searchActive = false;

      const targetId = "cat-" + btn.textContent.replace(/\s+/g, "-");
      const target = document.getElementById(targetId);
      if (!target) return;

      // 1) immediately highlight the clicked category
      setActiveBySectionId(targetId);

      // 2) scroll to the section
      const navHeight = els.navbar ? els.navbar.offsetHeight : 0;
      const catHeight = els.floatingCategories ? els.floatingCategories.offsetHeight : 0;
      const offset = navHeight + catHeight + 50;
      const rect = target.getBoundingClientRect();
      const scrollY = getScrollY();
      const top = rect.top + scrollY - offset;

      isAutoScrolling = true;
      if (typeof window.scrollTo === "function") {
        try {
          window.scrollTo({ top: top, behavior: "smooth" });
        } catch (e) {
          // older browsers without smooth option
          window.scrollTo(0, top);
        }
      } else {
        window.scrollTo = top;
      }

      // 3) after ~600ms, let scroll handler take over again
      if (autoScrollTimeout) {
        clearTimeout(autoScrollTimeout);
      }
      autoScrollTimeout = setTimeout(function () {
        isAutoScrolling = false;
      }, 600);
    });
  });

  // ---------- SCROLL: decide which section is “active” ----------
  window.addEventListener(
    "scroll",
    function () {
      // don't fight with search mode or our own smooth scroll
      if (searchActive || isAutoScrolling) return;

      const navHeight = els.navbar ? els.navbar.offsetHeight : 0;
      const catHeight = els.floatingCategories ? els.floatingCategories.offsetHeight : 0;
      const scrollY = getScrollY();

      // pick the section whose middle is closest to this line
      const viewLine = scrollY + navHeight + catHeight + 40;

      let closestId = sections[0].id;
      let closestDelta = Infinity;

      for (let i = 0; i < sections.length; i++) {
        const sec = sections[i];
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        const middle = (top + bottom) / 2;
        const delta = Math.abs(viewLine - middle);

        if (delta < closestDelta) {
          closestDelta = delta;
          closestId = sec.id;
        }
      }

      setActiveBySectionId(closestId);
    },
    { passive: true }
  );
}


  // ============================================================
  // 8. SEARCH FUNCTIONALITY
  // ============================================================

  function initSearch() {
    els.searchInput.addEventListener("input", function () {
      const term = els.searchInput.value.toLowerCase().trim();
      const existingResults = document.getElementById("search-results");
      if (existingResults) existingResults.remove();

      const sections = document.querySelectorAll(".category-section");

      if (!term) {
        searchActive = false;
        sections.forEach(function (s) {
          s.style.display = "block";
        });
        return;
      }

      searchActive = true;

      // Remove all category highlights while searching
      const catBtns = document.querySelectorAll(".category-btn");
      catBtns.forEach(function (btn) {
        btn.classList.remove("active");
      });

      // Hide all category sections when searching
      sections.forEach(function (s) {
        s.style.display = "none";
      });

      const resultDiv = document.createElement("div");
      resultDiv.id = "search-results";
      resultDiv.className = "category-section";

      const grid = document.createElement("div");
      grid.className = "service-grid";

      let found = 0;
      const seenNames = {};

      for (const key in servicesData) {
        if (!Object.prototype.hasOwnProperty.call(servicesData, key)) continue;
        const list = servicesData[key];

        for (let i = 0; i < list.length; i++) {
          const service = list[i];
          const lowerName = service.name.toLowerCase();
          const lowerDesc = (service.desc || "").toLowerCase();

          const matches = lowerName.includes(term) || lowerDesc.includes(term);
          if (!matches || seenNames[lowerName]) continue;

          seenNames[lowerName] = true;

          const card = document.createElement("div");
          card.className = "service-card";
          card.innerHTML =
            "<h3>" + service.name + "</h3>" +
            '<p class="service-time">' + service.time + "</p>" +
            (service.desc ? '<p class="service-desc">' + service.desc + "</p>" : "") +
            '<p class="service-price">' + service.price + "</p>" +
            '<button class="book-btn" data-name="' + service.name +
            '" data-price="' + service.price + '" data-time="' + service.time + '">Book Now</button>';
          grid.appendChild(card);
          found++;
        }
      }

      resultDiv.innerHTML = '<h2>Search Results for "' + term + '"</h2>';
      if (found) {
        resultDiv.appendChild(grid);
      } else {
        const p = document.createElement("p");
        p.className = "no-services";
        p.textContent = "No matching services found.";
        resultDiv.appendChild(p);
      }

      els.allServices.prepend(resultDiv);
    });

    els.searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        e.target.blur();
      }
    });
  }

  // ============================================================
  // 9. EVENT LISTENERS
  // ============================================================

  function initEventListeners() {
    // Basket controls
    els.basketIcon.addEventListener("click", function () {
      toggleBasket(true);
    });
    els.closeBasket.addEventListener("click", function () {
      toggleBasket(false);
    });
    if (els.basketOverlay) {
      els.basketOverlay.addEventListener("click", function () {
        toggleBasket(false);
      });
    }
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") toggleBasket(false);
    });

    // Remove from basket
    els.basketList.addEventListener("click", function (e) {
      const btn = e.target.closest(".basket-remove-btn");
      if (btn) removeFromBasket(parseInt(btn.dataset.index, 10));
    });

    // Proceed to booking
    els.proceedBooking.addEventListener("click", function () {
      if (!basket.length) {
        alert("Please select at least one service.");
        return;
      }
      window.location.href = "booking.html";
    });

    // Add to basket
    document.addEventListener("click", function (e) {
      const btn = e.target.closest(".book-btn");
      if (!btn) return;

      const name = btn.dataset.name;
      const price = btn.dataset.price;
      const time = btn.dataset.time;

      if (basket.some(function (item) { return item.name === name; })) {
        btn.textContent = "In Basket ✓";
        btn.disabled = true;
        return;
      }

      if (addToBasket(name, price, time)) {
        btn.textContent = "Added ✓";
        btn.disabled = true;
        setTimeout(function () {
          btn.textContent = "In Basket ✓";
        }, 700);
      }
    });

    // Navbar shrink on scroll
    window.addEventListener("scroll", function () {
      if (els.navbar) {
        els.navbar.classList.toggle("shrink", getScrollY() > 50);
      }
    });

    // Nudge visibility control
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stopBasketNudge();
      else if (basket.length) startBasketNudge();
    });

    // Mobile nav close (if you use a checkbox menu)
    if (els.navLinks && els.menuToggle) {
      const navLinks = els.navLinks.querySelectorAll("a");
      navLinks.forEach(function (link) {
        link.addEventListener("click", function () {
          els.menuToggle.checked = false;
        });
      });
    }
  }

  // ============================================================
  // 10. INITIALIZATION
  // ============================================================

  function init() {
    initCategoryButtons();
    renderServices();
    initCategoryScroll();
    initSearch();
    initEventListeners();
    updateBasket();
    if (basket.length) startBasketNudge();
  }

  init();
});

// ============================================================
// END OF NU-TRENDZ SERVICES PAGE – FINAL PRODUCTION BUILD
// ============================================================
