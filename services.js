// ============================================================
// NU-TRENDZ SERVICES PAGE – IMPROVED PRODUCTION BUILD
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
    basketBar: document.getElementById("basketBar"),
    basketBarSummary: document.getElementById("basketBarSummary"),
    basketBarProceed: document.getElementById("basketBarProceed"),
    basketPanel: document.getElementById("basketPanel"),
    closeBasket: document.getElementById("closeBasket"),
    basketList: document.getElementById("basketList"),
    basketTotal: document.getElementById("basketTotal"),
    basketFooterLabel: document.getElementById("basketFooterLabel"),
    navLinks: document.getElementById("nav-links"),
    basketOverlay: document.getElementById("basketOverlay"),
    basketToast: document.getElementById("basketToast"),
    basketStatus: document.getElementById("basketStatus")
  };

  const requiredKeys = [
    "allServices", "floatingCategories", "searchInput", "navbar",
    "basketBar", "basketPanel", "closeBasket", "basketList",
    "basketTotal", "basketOverlay"
  ];

  for (let i = 0; i < requiredKeys.length; i++) {
    if (!els[requiredKeys[i]]) {
      console.error("Missing required DOM element: " + requiredKeys[i]);
      return;
    }
  }

  function getScrollY() {
    return window.scrollY ||
           window.pageYOffset ||
           document.documentElement.scrollTop ||
           0;
  }

  // ============================================================
  // 3a. HELPERS
  // ============================================================

  function showToast(message) {
    if (!els.basketToast) return;
    els.basketToast.textContent = message;
    els.basketToast.classList.add("show");
    setTimeout(function () {
      if (!els.basketToast) return;
      els.basketToast.classList.remove("show");
    }, 1500);
  }

  function announceBasket(message) {
    if (!els.basketStatus) return;
    els.basketStatus.textContent = message;
  }

  function debounce(fn, delay) {
    let t;
    return function () {
      const args = arguments;
      clearTimeout(t);
      t = setTimeout(function () {
        fn.apply(null, args);
      }, delay);
    };
  }

  function formatPrice(priceStr) {
    if (!priceStr) return "";
    if (/^from\s+/i.test(priceStr)) {
      const numberPart = priceStr.replace(/^from\s+/i, "");
      return '<span class="from-label">From</span>' + numberPart;
    }
    return priceStr;
  }

  function highlightTerm(text, term) {
    if (!term) return text;
    const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp("(" + escaped + ")", "ig");
    return text.replace(regex, "<mark>$1</mark>");
  }

  // Steps controller – we only move the first 2 on this page
  function updateSteps() {
    const steps = document.querySelectorAll(".steps-strip .step");
    if (!steps.length) return;

    steps.forEach(function (step) {
      step.classList.remove("step--active", "step--complete");
    });

    if (basket.length === 0) {
      if (steps[0]) steps[0].classList.add("step--active");
    } else {
      if (steps[0]) steps[0].classList.add("step--complete");
      if (steps[1]) steps[1].classList.add("step--active");
    }
  }

  // ============================================================
  // 4. BASKET FUNCTIONALITY
  // ============================================================

  function updateBasketBarSummary(total, hasFrom) {
    if (!els.basketBarSummary) return;
    if (!basket.length) {
      els.basketBarSummary.textContent = "No services selected yet";
      return;
    }
    const label = hasFrom ? "Estimated" : "Total";
    const countText = basket.length === 1
      ? "1 service selected"
      : basket.length + " services selected";
    els.basketBarSummary.textContent =
      countText + " • " + label + " £" + total.toFixed(2);
  }

  function updateBasket() {
    els.basketList.innerHTML = "";

    if (!basket.length) {
      els.basketList.innerHTML = '<p style="color:#aaa;text-align:center;">No services selected.</p>';
      els.basketTotal.textContent = "£0";
      if (els.basketFooterLabel) {
        els.basketFooterLabel.textContent = "Total:";
      }
      updateBasketBarSummary(0, false);
      saveBasket();
      updateSteps();
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
    let hasFromPrice = false;

    for (let i = 0; i < basket.length; i++) {
      const item = basket[i];
      const priceStr = item.price || "";
      const priceValue = parseFloat(priceStr.replace(/[^\d.]/g, "")) || 0;
      total += priceValue;
      if (/^from\s+/i.test(priceStr)) {
        hasFromPrice = true;
      }

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
    if (els.basketFooterLabel) {
      els.basketFooterLabel.textContent = hasFromPrice ? "Estimated total:" : "Total:";
    }

    updateBasketBarSummary(total, hasFromPrice);
    saveBasket();
    updateSteps();
  }

  // 🔒 Freeze page scroll when basket is open (no layout shift)
  function toggleBasket(open) {
    if (open) {
      els.basketPanel.classList.add("open");
      if (els.basketOverlay) els.basketOverlay.classList.add("show");

      // Lock body scroll without layout jump (desktop)
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
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
    if (basket.some(function (item) { return item.name === name; })) {
      return false;
    }
    basket.push({ name: name, price: price, time: time });
    updateBasket();
    announceBasket(name + " added to selection. " + basket.length + " services selected.");
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

    announceBasket(removedItem.name + " removed from selection. " + basket.length + " services selected.");
  }

  // ============================================================
  // 5. RENDER SERVICES
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
          '<div class="service-meta">' +
            '<span class="service-tag">' + category + '</span>' +
          '</div>' +
          "<h3>" + service.name + "</h3>" +
          '<p class="service-time">' + service.time + "</p>" +
          (service.desc ? '<p class="service-desc">' + service.desc + "</p>" : "") +
          '<p class="service-price">' + formatPrice(service.price) + "</p>" +
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
  // 6. CATEGORY NAVIGATION
  // ============================================================

  function initCategoryButtons() {
    let index = 0;
    for (const category in servicesData) {
      if (!Object.prototype.hasOwnProperty.call(servicesData, category)) continue;
      const btn = document.createElement("button");
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

    let isAutoScrolling = false;
    let autoScrollTimeout = null;

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

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
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

        setActiveBySectionId(targetId);

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
            window.scrollTo(0, top);
          }
        } else {
          window.scrollTo(0, top);
        }

        if (autoScrollTimeout) clearTimeout(autoScrollTimeout);
        autoScrollTimeout = setTimeout(function () {
          isAutoScrolling = false;
        }, 600);
      });
    });

    window.addEventListener(
      "scroll",
      function () {
        if (searchActive || isAutoScrolling) return;

        const navHeight = els.navbar ? els.navbar.offsetHeight : 0;
        const catHeight = els.floatingCategories ? els.floatingCategories.offsetHeight : 0;
        const scrollY = getScrollY();
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
  // 7. SEARCH FUNCTIONALITY
  // ============================================================

  function handleSearchInput() {
    const termRaw = els.searchInput.value;
    const term = termRaw.toLowerCase().trim();
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

    const catBtns = document.querySelectorAll(".category-btn");
    catBtns.forEach(function (btn) {
      btn.classList.remove("active");
    });

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

    for (const category in servicesData) {
      if (!Object.prototype.hasOwnProperty.call(servicesData, category)) continue;
      const list = servicesData[category];

      for (let i = 0; i < list.length; i++) {
        const service = list[i];
        const lowerName = service.name.toLowerCase();
        const lowerDesc = (service.desc || "").toLowerCase();

        const matches = lowerName.includes(term) || lowerDesc.includes(term);
        if (!matches || seenNames[lowerName]) continue;

        seenNames[lowerName] = true;

        const titleHtml = highlightTerm(service.name, termRaw.trim());
        const descHtml = service.desc ? highlightTerm(service.desc, termRaw.trim()) : "";

        const card = document.createElement("div");
        card.className = "service-card";
        card.innerHTML =
          '<div class="service-meta">' +
            '<span class="service-tag">' + category + '</span>' +
          '</div>' +
          "<h3>" + titleHtml + "</h3>" +
          '<p class="service-time">' + service.time + "</p>" +
          (descHtml ? '<p class="service-desc">' + descHtml + "</p>" : "") +
          '<p class="service-price">' + formatPrice(service.price) + "</p>" +
          '<button class="book-btn" data-name="' + service.name +
          '" data-price="' + service.price + '" data-time="' + service.time + '">Book Now</button>';
        grid.appendChild(card);
        found++;
      }
    }

    resultDiv.innerHTML = '<h2>Search Results for "' + termRaw.replace(/"/g, "&quot;") + '"</h2>';
    if (found) {
      resultDiv.appendChild(grid);
    } else {
      const p = document.createElement("p");
      p.className = "no-services";
      p.textContent = "No matching services found.";
      resultDiv.appendChild(p);
    }

    els.allServices.prepend(resultDiv);
  }

  function initSearch() {
    els.searchInput.addEventListener("input", debounce(handleSearchInput, 200));

    els.searchInput.addEventListener("keydown", function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        e.target.blur();
      }
    });
  }

  // ============================================================
  // 8. EVENT LISTENERS
  // ============================================================

  function initEventListeners() {
    // Bottom bar toggle (click anywhere except Proceed)
    if (els.basketBar) {
      els.basketBar.addEventListener("click", function (e) {
        if (e.target && e.target.id === "basketBarProceed") return;
        const isOpen = els.basketPanel.classList.contains("open");
        toggleBasket(!isOpen);
      });

      els.basketBar.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const isOpen = els.basketPanel.classList.contains("open");
          toggleBasket(!isOpen);
        }
      });
    }

    // Proceed button on bar
    if (els.basketBarProceed) {
      els.basketBarProceed.addEventListener("click", function (e) {
        e.stopPropagation();
        if (!basket.length) {
          alert("Please select at least one service.");
          return;
        }
        window.location.href = "booking.html";
      });
    }

    // Close button
    els.closeBasket.addEventListener("click", function () {
      toggleBasket(false);
    });

    // Overlay click closes basket & blocks background interaction
    if (els.basketOverlay) {
      els.basketOverlay.addEventListener("click", function () {
        toggleBasket(false);
      });
    }

    // Escape closes basket
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") toggleBasket(false);
    });

    // Remove from basket
    els.basketList.addEventListener("click", function (e) {
      const btn = e.target.closest(".basket-remove-btn");
      if (btn) removeFromBasket(parseInt(btn.dataset.index, 10));
    });

    // Add to basket from cards
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
        showToast(name + " added to selection");
        setTimeout(function () {
          btn.textContent = "In Basket ✓";
        }, 700);
      }
    });

    // Navbar shrink on scroll (desktop only to avoid mobile jitter)
    window.addEventListener("scroll", function () {
      if (!els.navbar) return;

      // Disable shrink effect on small screens (mobile) to stop logo shaking
      if (window.innerWidth <= 768) {
        els.navbar.classList.remove("shrink");
        return;
      }

      els.navbar.classList.toggle("shrink", getScrollY() > 50);
    });
  }

  // ============================================================
  // 9. INITIALIZATION
  // ============================================================

  function init() {
    initCategoryButtons();
    renderServices();
    initCategoryScroll();
    initSearch();
    initEventListeners();
    updateBasket();
    updateSteps();
  }

  init();
});

// ============================================================
// END OF NU-TRENDZ SERVICES PAGE – IMPROVED PRODUCTION BUILD
// ============================================================
