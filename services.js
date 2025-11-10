// ============================================================
// NU-TRENDZ SERVICES PAGE – FINAL PRODUCTION BUILD
// Fully enhanced, optimized, and scroll-safe
// ============================================================

// ---------- SERVICE DATA ----------
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

// ---------- DOM ELEMENTS ----------
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
};

// ---------- MENU CLOSE ON MOBILE ----------
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
if (navLinks && menuToggle) {
  navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => (menuToggle.checked = false));
  });
}

// ---------- BASKET ----------
let basket = JSON.parse(localStorage.getItem("basket")) || [];

function saveBasket() {
  localStorage.setItem("basket", JSON.stringify(basket));
}

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

  // Disable already-added services on the page
document.querySelectorAll(".book-btn").forEach(btn => {
  const inBasket = basket.some(item => item.name === btn.dataset.name);
  btn.disabled = inBasket;
  btn.textContent = inBasket ? "In Basket ✓" : "Book Now";
});

  let total = 0;
  basket.forEach((item, i) => {
    const priceValue = parseFloat(item.price.replace(/[^\d.]/g, "")) || 0;
    total += priceValue;
    const div = document.createElement("div");
    div.className = "basket-item";
    div.innerHTML = `
      <div class="basket-item-info">
        <span class="basket-item-name">${item.name}</span>
        <span class="basket-item-price">${item.price}</span>
      </div>
      <button class="basket-remove-btn" data-index="${i}">
        <i class="fa-solid fa-trash-can"></i> Remove
      </button>`;
    basketList.appendChild(div);
  });

  basketTotal.textContent = `£${total.toFixed(2)}`;
  saveBasket();
}

// ---------- BASKET PANEL CONTROL ----------
function toggleBasket(open) {
  const panel = els.basketPanel;

  if (open) {
    panel.classList.add("open");
    document.body.classList.add("no-scroll");
    stopBasketNudge();
  } else {
    panel.classList.remove("open");
    document.body.classList.remove("no-scroll");
    if (basket.length > 0) startBasketNudge();
  }
}

// ---------- SCROLL RESTORE ----------
function restoreScroll() {
  document.body.classList.remove("no-scroll");
  document.body.style.position = "";
  document.body.style.width = "";
}

// ---------- BASKET EVENTS ----------
els.basketIcon.addEventListener("click", () => toggleBasket(true));
els.closeBasket.addEventListener("click", () => toggleBasket(false));
els.basketList.addEventListener("click", e => {
  const btn = e.target.closest(".basket-remove-btn");
  if (!btn) return;

  const removedItem = basket[btn.dataset.index];
  basket.splice(btn.dataset.index, 1);
  updateBasket();

  // ✅ Re-enable button for that service
  const matchBtn = document.querySelector(`.book-btn[data-name="${removedItem.name}"]`);
  if (matchBtn) {
    matchBtn.disabled = false;
    matchBtn.textContent = "Book Now";
  }
});

els.proceedBooking.addEventListener("click", () => {
  if (!basket.length) return alert("Please select at least one service.");
  window.location.href = "booking.html";
});

// Ensure close button exists
document.addEventListener("DOMContentLoaded", () => {
  if (!els.closeBasket) els.closeBasket = document.getElementById("closeBasket");
  if (els.closeBasket) els.closeBasket.addEventListener("click", () => toggleBasket(false));
});


// ---------- SAFETY LISTENERS ----------
window.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    els.basketPanel.classList.remove("open");
    restoreScroll();
  }
});
window.addEventListener("resize", restoreScroll);

// ---------- CATEGORY NAVIGATION ----------
Object.keys(servicesData).forEach((category, index) => {
  const btn = document.createElement("button");
  btn.className = "category-btn" + (index === 0 ? " active" : "");
  btn.textContent = category;
  btn.addEventListener("click", () => {
    const section = document.querySelector(`#cat-${category.replace(/\s+/g, "-")}`);
    if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  els.floatingCategories.appendChild(btn);
});

// ---------- DISPLAY SERVICES ----------
for (const [category, list] of Object.entries(servicesData)) {
  const section = document.createElement("section");
  section.className = "category-section";
  section.id = `cat-${category.replace(/\s+/g, "-")}`;
  section.innerHTML = `<h2>${category}</h2>`;
  const grid = document.createElement("div");
  grid.className = "service-grid";

  list.forEach(service => {
    const card = document.createElement("div");
    card.className = "service-card";
    card.innerHTML = `
      <h3>${service.name}</h3>
      <p class="service-time">${service.time}</p>
      ${service.desc ? `<p class="service-desc">${service.desc}</p>` : ""}
      <p class="service-price">${service.price}</p>
      <button class="book-btn" data-name="${service.name}" data-price="${service.price}" data-time="${service.time}">Book Now</button>`;
    grid.appendChild(card);
  });

  section.appendChild(grid);
  els.allServices.appendChild(section);
}

// ---------- ADD TO BASKET ----------
document.addEventListener("click", e => {
  const btn = e.target.closest(".book-btn");
  if (!btn) return;

  const { name, price, time } = btn.dataset;

  // ✅ Check if service already exists in basket
  const alreadyAdded = basket.some(item => item.name === name);
  if (alreadyAdded) {
    btn.textContent = "In Basket ✓";
    btn.disabled = true;
    return;
  }

  // Add new service
  basket.push({ name, price, time });
  updateBasket();
  btn.textContent = "Added ✓";
  btn.disabled = true;

  // Keep it disabled while in basket
  setTimeout(() => {
    btn.textContent = "In Basket ✓";
  }, 700);

  startBasketNudge();
});

// ---------- SEARCH ----------
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

  Object.values(servicesData).flat().forEach(service => {
    const { name, desc = "", time, price } = service;
    if (name.toLowerCase().includes(term) || desc.toLowerCase().includes(term)) {
      const card = document.createElement("div");
      card.className = "service-card";
      card.innerHTML = `
        <h3>${name}</h3>
        <p class="service-time">${time}</p>
        ${desc ? `<p class="service-desc">${desc}</p>` : ""}
        <p class="service-price">${price}</p>
        <button class="book-btn" data-name="${name}" data-price="${price}" data-time="${time}">Book Now</button>`;
      grid.appendChild(card);
      found++;
    }
  });

  resultDiv.innerHTML = `<h2>Search Results for "${term}"</h2>`;
  resultDiv.appendChild(found ? grid : Object.assign(document.createElement("p"), {
    className: "no-services",
    textContent: "No matching services found."
  }));
  els.allServices.prepend(resultDiv);
});

// ---------- CATEGORY AUTO-HIGHLIGHT (fixed manual + auto) ----------
let manualScrollLock = false;

window.addEventListener("DOMContentLoaded", () => {
  const sections = Array.from(document.querySelectorAll(".category-section"));
  const buttons = Array.from(document.querySelectorAll(".category-btn"));
  const categoryBar = els.floatingCategories;

  // --- Manual click (scroll + highlight immediately) ---
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      manualScrollLock = true;

      // Remove previous highlight
      buttons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");

      // Find section and scroll
      const id = "cat-" + btn.textContent.replace(/\s+/g, "-");
      const target = document.getElementById(id);
      if (target) {
        const headerOffset = window.innerWidth < 768 ? categoryBar.offsetHeight + 40 : categoryBar.offsetHeight + 60;
        const top = target.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({ top, behavior: "smooth" });
      }

      // Keep lock briefly, then resume auto updates
      setTimeout(() => (manualScrollLock = false), 900);
    });
  });

  // --- Scroll-based auto highlight ---
  window.addEventListener(
    "scroll",
    () => {
      if (manualScrollLock) return;

      const scrollY = window.scrollY + categoryBar.offsetHeight + 100;
      let activeId = "";

      for (const sec of sections) {
        const top = sec.offsetTop;
        const bottom = top + sec.offsetHeight;
        if (scrollY >= top && scrollY < bottom) {
          activeId = sec.id;
          break;
        }
      }

      if (!activeId) return;

      const name = activeId.replace("cat-", "").replace(/-/g, " ").toLowerCase();

      buttons.forEach(btn => {
        const match = btn.textContent.toLowerCase() === name;
        btn.classList.toggle("active", match);
        if (match) {
          btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
        }
      });
    },
    { passive: true }
  );
});



// ---------- NAVBAR SHRINK ----------
let lastScroll = 0;
window.addEventListener("scroll", () => {
  const y = window.scrollY;
  if (y > lastScroll + 20) els.navbar.classList.add("shrink");
  else if (y < lastScroll - 20 || y === 0) els.navbar.classList.remove("shrink");
  lastScroll = Math.max(y, 0);
});

// ---------- BASKET NUDGE ----------
let nudgeInterval = null;
function triggerBasketNudge() {
  if (basket.length && !els.basketPanel.classList.contains("open") && !document.hidden) {
    els.basketIcon.classList.add("nudge");
    setTimeout(() => els.basketIcon.classList.remove("nudge"), 700);
  }
}
function startBasketNudge() {
  if (nudgeInterval) return;
  nudgeInterval = setInterval(triggerBasketNudge, 30000);
}
function stopBasketNudge() {
  clearInterval(nudgeInterval);
  nudgeInterval = null;
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopBasketNudge();
  else if (basket.length) startBasketNudge();
});

// ---------- INIT ----------
updateBasket();
if (basket.length) startBasketNudge();
