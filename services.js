// ============================================
// SERVICE DATA
// ============================================
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
    { name: "Wash Dry", time: "1 hour 30 mins", desc: "", price: "£20" },
    { name: "Detox", time: "2 hours", desc: "Deep-cleaning soak with clay and apple cider vinegar to remove buildup.", price: "£35" },
    { name: "Micro Loc", time: "10 hours", desc: "", price: "from £250" },
    { name: "Micro Loc Extension", time: "12 hours", desc: "", price: "from £300" },
    { name: "Instant Loc Extension", time: "7 hours", desc: "", price: "from £200" },
    { name: "Interlocking Sister Locs", time: "4 hours", desc: "", price: "from £90" },
    { name: "Interlocking", time: "3 hours", desc: "", price: "from £60" },
    { name: "Retwist", time: "2 hours", desc: "", price: "from £50" },
    { name: "Sister Locs", time: "6 hours", desc: "", price: "from £180" },
    { name: "Comb Coil", time: "2 hours", desc: "Sections twisted tightly with a comb to form coils.", price: "from £40" },
    { name: "Instant Locking", time: "5 hours", desc: "Crochet-tool technique to form mature-looking locs instantly.", price: "from £150" }
  ],
  "Kids": [
    { name: "Treatment", time: "1 hour", desc: "", price: "£30" },
    { name: "Comb Twist", time: "1 hour", desc: "", price: "£35" },
    { name: "Instant Loc", time: "4 hours", desc: "", price: "£80" },
    { name: "Interlocking", time: "1 hour", desc: "", price: "£45" },
    { name: "Retwist", time: "1 hour", desc: "", price: "£35" },
    { name: "Hair Cut", time: "1 hour", desc: "", price: "from £10" },
    { name: "Box Braids / Twists with Extension", time: "3 hours", desc: "", price: "from £50" },
    { name: "Cornrows with Extension", time: "2 hours", desc: "", price: "from £30" }
  ],
  "Natural Hair": [
    { name: "Barrel Cornrows", time: "2 h 45 m", desc: "", price: "£50" },
    { name: "Two Strand Twist", time: "2 h 30 m", desc: "", price: "£40" },
    { name: "Box Braids / Twists Undercut", time: "1 h 5 m", desc: "", price: "£35" },
    { name: "Braided Ponytail", time: "2 hours", desc: "Price depends on thickness.", price: "from £30" },
    { name: "4 Cornrows Stitch", time: "1 hour", desc: "", price: "£25" },
    { name: "Cornrows with Design", time: "1 hour", desc: "", price: "£30" },
    { name: "Twists", time: "2 hours", desc: "", price: "£40" },
    { name: "Box Braids", time: "1 hour", desc: "", price: "£40" }
  ],
  "Cornrows": [
    { name: "Braided Ponytail", time: "3 hours", desc: "", price: "from £50" },
    { name: "Cornrows Under Wig", time: "1 hour", desc: "", price: "£20" },
    { name: "Cornrows with Design", time: "3 hours", desc: "", price: "from £60" },
    { name: "Stitch Cornrows", time: "2 hours", desc: "", price: "from £50" },
    { name: "Dutch Braids", time: "1 hour", desc: "", price: "£30" }
  ],
  "Box Braids": [
    { name: "Pick & Drop", time: "5 hours", desc: "", price: "£75" },
    { name: "Kinky Twist", time: "5 hours", desc: "Twists with kinky hair extensions.", price: "from £80" },
    { name: "Coi Leray Type Braids", time: "3 hours", desc: "Box braids with curly crochet.", price: "from £55" },
    { name: "Island Twist", time: "5 hours", desc: "Twists with curly crochet.", price: "from £75" },
    { name: "Passion Twists", time: "3 hours", desc: "", price: "from £70" },
    { name: "Twist", time: "4 hours", desc: "Twists with extensions added.", price: "from £70" },
    { name: "Goddess Box Braids", time: "5 h 30 m", desc: "Curls fed into the braid.", price: "from £75" },
    { name: "Box Braids", time: "5 hours", desc: "Price depends on length & thickness.", price: "from £70" }
  ],
  "Knotless Braids": [
    { name: "Bum Length Knotless", time: "5 h 30 m", desc: "", price: "from £120" },
    { name: "Waist Length Knotless", time: "5 hours", desc: "", price: "from £105" },
    { name: "Mid Back Knotless", time: "4 hours", desc: "", price: "from £95" },
    { name: "French Curls", time: "5 hours", desc: "", price: "from £85" },
    { name: "Coi Leray Type Braids", time: "3 h 15 m", desc: "", price: "from £50" },
    { name: "Shoulder Knotless Braids Goddess", time: "5 hours", desc: "Curls added.", price: "from £90" },
    { name: "Knotless Braids", time: "4 hours", desc: "Price depends on thickness and length.", price: "from £85" }
  ],
  "Fulani Braids": [
    { name: "Flip Fulani", time: "5 hours", desc: "", price: "£85" },
    { name: "Fulani Crochet", time: "3 h 30 m", desc: "", price: "from £65" },
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
    { name: "Wig Styling / Cut / Straight / Wash", time: "1 hour", desc: "", price: "from £20" },
    { name: "Sew In Wig", time: "1 hour", desc: "", price: "£30" },
    { name: "Fit Wig (No Glue, Cornrows Included)", time: "1 hour", desc: "", price: "£25" },
    { name: "Glue On", time: "3 hours", desc: "Cornrows included.", price: "£60" }
  ],
  "Weave": [
    { name: "Flip Over Weave", time: "1 hour", desc: "", price: "£75" },
    { name: "Full Head Weave", time: "3 h 30 m", desc: "", price: "£80" },
    { name: "LA Weave / Invisible", time: "3 h 45 m", desc: "", price: "£80" },
    { name: "Rows", time: "1 h 30 m", desc: "", price: "£50" },
    { name: "Weave with Leave Out (Straight)", time: "3 hours", desc: "", price: "£70" },
    { name: "Weave with Leave Out (Curl)", time: "2 hours", desc: "", price: "£60" },
    { name: "Weave with Closure (Straight)", time: "3 hours", desc: "", price: "£75" },
    { name: "Weave with Closure (Curls)", time: "3 hours", desc: "", price: "£65" }
  ],
  "Hair & Styling": [
    { name: "Sleek Ponytail Weave", time: "3 hours", desc: "Sleek ponytail using weave in the ponytail.", price: "£50" },
    { name: "Sleek Ponytail (Type 1, 2, 3)", time: "1 hour", desc: "Natural hair or one braid ponytail.", price: "£40" },
    { name: "Sleek Ponytail (Type 4)", time: "2 h 45 m", desc: "Includes shampoo, conditioning, and silk press.", price: "£40" },
    { name: "Blow Dry / GHD Straightening", time: "1 h 30 m", desc: "Blow dry and flat iron.", price: "£30" },
    { name: "Silk Press", time: "3 hours", desc: "Non-chemical straightening for curly or coarse hair.", price: "from £60" },
    { name: "Relax and Style", time: "2 hours", desc: "Permanent straightening chemical process.", price: "£40" },
    { name: "Perm / Curls", time: "3 hours", desc: "Price depends on length.", price: "from £60" },
    { name: "Hot Oil Treatment", time: "30 mins", desc: "Stimulates scalp and hair growth through oil massage.", price: "£35" }
  ]
};


// ============================================
// DOM ELEMENTS
// ============================================
const allServicesContainer = document.getElementById("all-services");
const floatingCategories = document.getElementById("floatingCategories");
const searchInput = document.getElementById("serviceSearch");
const navbar = document.getElementById("navbar");
const basketIcon = document.getElementById("basketIcon");
const basketPanel = document.getElementById("basketPanel");
const closeBasket = document.getElementById("closeBasket");
const basketList = document.getElementById("basketList");
const basketCount = document.getElementById("basketCount");
const basketTotal = document.getElementById("basketTotal");
const proceedBooking = document.getElementById("proceedBooking");


// ============================================
// BASKET FUNCTIONALITY
// ============================================
let basket = JSON.parse(localStorage.getItem("basket")) || [];

function updateBasket() {
  basketList.innerHTML = "";
  basketCount.textContent = basket.length;

  if (basket.length === 0) {
    basketList.innerHTML = "<p style='color:#aaa;text-align:center;'>No services selected.</p>";
    basketTotal.textContent = "£0";
  } else {
    let total = 0;

  basket.forEach((item, i) => {
  const priceValue = parseFloat(item.price.replace(/[^\d.]/g, "")) || 0;
  total += priceValue;

  const div = document.createElement("div");
  div.classList.add("basket-item");
  div.innerHTML = `
    <div class="basket-item-info">
      <span class="basket-item-name">${item.name}</span>
      <span class="basket-item-price">${item.price}</span>
    </div>
    <button class="basket-remove-btn" data-index="${i}">
      <i class="fa-solid fa-trash-can"></i> Remove
    </button>
  `;
  basketList.appendChild(div);
});


    basketTotal.textContent = `£${total.toFixed(2)}`;
  }

  localStorage.setItem("basket", JSON.stringify(basket));
}

// Add to basket
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("book-btn")) {
    e.preventDefault();

    const card = e.target.closest(".service-card");
    const name = card.querySelector("h3").textContent;
    const price = card.querySelector(".service-price").textContent;
    const time = card.querySelector(".service-time")?.textContent || "";

    basket.push({ name, price, time });
    updateBasket();

    e.target.textContent = "Added ✓";
    e.target.style.background = "#555";
    setTimeout(() => {
      e.target.textContent = "In Basket";
      e.target.style.background = "var(--orange)";
    }, 1000);
  }
});

// Remove from basket
basketList.addEventListener("click", (e) => {
  if (e.target.closest(".basket-remove-btn")) {
    const btn = e.target.closest(".basket-remove-btn");
    const index = btn.dataset.index;
    basket.splice(index, 1);
    updateBasket();
  }
});


// Open/close basket panel
basketIcon.addEventListener("click", () => {
  basketPanel.classList.add("open");
  document.body.classList.add("no-scroll");
});

closeBasket.addEventListener("click", () => {
  basketPanel.classList.remove("open");
  document.body.classList.remove("no-scroll");
});

// Proceed to booking
proceedBooking.addEventListener("click", () => {
  if (basket.length === 0) {
    alert("Please select at least one service.");
    return;
  }
  window.location.href = "booking.html";
});

updateBasket();


// ============================================
// BUILD CATEGORY NAVIGATION
// ============================================
Object.keys(servicesData).forEach((category, index) => {
  const btn = document.createElement("button");
  btn.className = "category-btn" + (index === 0 ? " active" : "");
  btn.textContent = category;

  btn.addEventListener("click", () => {
    document.querySelector(`#cat-${category.replace(/\s+/g, '-')}`).scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });

  floatingCategories.appendChild(btn);
});


// ============================================
// DISPLAY SERVICES BY CATEGORY
// ============================================
Object.entries(servicesData).forEach(([category, list]) => {
  const section = document.createElement("div");
  section.className = "category-section";
  section.id = `cat-${category.replace(/\s+/g, '-')}`;

  const title = document.createElement("h2");
  title.textContent = category;

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
      <a href="booking.html"><button class="book-btn">Book Now</button></a>
    `;
    grid.appendChild(card);
  });

  section.append(title, grid);
  allServicesContainer.appendChild(section);
});


// ============================================
// SEARCH FUNCTIONALITY
// ============================================
searchInput.addEventListener("input", () => {
  const term = searchInput.value.toLowerCase().trim();
  const sections = document.querySelectorAll(".category-section");
  const existingResults = document.querySelector("#search-results");
  const noMsg = document.querySelector(".no-services");

  if (existingResults) existingResults.remove();
  if (noMsg) noMsg.remove();

  if (term === "") {
    sections.forEach(section => section.style.display = "block");
    return;
  }

  sections.forEach(section => section.style.display = "none");

  const resultDiv = document.createElement("div");
  resultDiv.id = "search-results";
  resultDiv.className = "category-section";
  const title = document.createElement("h2");
  title.textContent = `Search Results for "${term}"`;
  const grid = document.createElement("div");
  grid.className = "service-grid";

  let visibleCount = 0;

  Object.values(servicesData).forEach(categoryList => {
    categoryList.forEach(service => {
      const name = service.name.toLowerCase();
      const desc = (service.desc || "").toLowerCase();
      if (name.includes(term) || desc.includes(term)) {
        const card = document.createElement("div");
        card.className = "service-card";
        card.innerHTML = `
          <h3>${service.name}</h3>
          <p class="service-time">${service.time}</p>
          ${service.desc ? `<p class="service-desc">${service.desc}</p>` : ""}
          <p class="service-price">${service.price}</p>
          <a href="booking.html"><button class="book-btn">Book Now</button></a>
        `;
        grid.appendChild(card);
        visibleCount++;
      }
    });
  });

  if (visibleCount > 0) {
    resultDiv.append(title, grid);
    allServicesContainer.prepend(resultDiv);
  } else {
    const msg = document.createElement("p");
    msg.className = "no-services";
    msg.textContent = "No matching services found.";
    allServicesContainer.prepend(msg);
  }
});

searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    searchInput.blur();
  }
});


// ============================================
// CATEGORY HIGHLIGHTING ON SCROLL
// ============================================
const categoryBtns = Array.from(document.querySelectorAll(".category-btn"));
const sections = Array.from(document.querySelectorAll(".category-section"));
let manualClick = false;

categoryBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    manualClick = true;
    categoryBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const targetId = `cat-${btn.textContent.replace(/\s+/g, "-")}`;
    document.getElementById(targetId)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    setTimeout(() => (manualClick = false), 800);
  });
});

window.addEventListener("scroll", () => {
  if (manualClick) return;

  const scrollPosition = window.scrollY + 200;
  let currentSectionId = "";

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    if (scrollPosition >= top && scrollPosition < top + height) {
      currentSectionId = section.id;
    }
  });

  if (currentSectionId) {
    const activeCategory = currentSectionId.replace("cat-", "").replace(/-/g, " ");
    categoryBtns.forEach(btn => {
      const isActive = btn.textContent.toLowerCase() === activeCategory.toLowerCase();
      btn.classList.toggle("active", isActive);
      if (isActive) {
        btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    });
  }
});


// ============================================
// NAVBAR SHRINK ON SCROLL
// ============================================
let lastScrollTop = 0;

window.addEventListener("scroll", () => {
  const scrollTop = window.scrollY;
  if (scrollTop > lastScrollTop + 20) {
    navbar.classList.add("shrink");
  } else if (scrollTop < lastScrollTop - 20 || scrollTop === 0) {
    navbar.classList.remove("shrink");
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// ======================================================
// 🧺 Basket Nudge (Shake Reminder)
// ======================================================

let basketNudgeInterval = null;

function triggerBasketNudge() {
  // only shake if there's something in basket, panel closed, and user is on page
  if (basket.length > 0 && !basketPanel.classList.contains("open") && !document.hidden) {
    basketIcon.classList.add("nudge");
    setTimeout(() => basketIcon.classList.remove("nudge"), 700);
  }
}

function startBasketNudge() {
  // prevent multiple intervals
  if (basketNudgeInterval) return;
  basketNudgeInterval = setInterval(triggerBasketNudge, 30000); // every 30s
}

function stopBasketNudge() {
  clearInterval(basketNudgeInterval);
  basketNudgeInterval = null;
}

// Stop shaking if user switches tabs
document.addEventListener("visibilitychange", () => {
  if (document.hidden) stopBasketNudge();
  else if (basket.length > 0) startBasketNudge();
});

// === Initialization ===
updateBasket(); // render basket contents on page load

// Start shaking only if basket already has items
if (basket.length > 0) startBasketNudge();

// When an item is added, start nudge timer
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("book-btn")) {
    startBasketNudge();
  }
});

// Stop shaking when basket opens
basketIcon.addEventListener("click", () => {
  basketPanel.classList.add("open");
  document.body.classList.add("no-scroll");
  stopBasketNudge();
});

// Resume shaking when basket closes (if items exist)
closeBasket.addEventListener("click", () => {
  basketPanel.classList.remove("open");
  document.body.classList.remove("no-scroll");
  if (basket.length > 0) startBasketNudge();
});

// ============================================
// INITIALIZE BASKET NUDGE AFTER PAGE LOAD
// ============================================
updateBasket(); // ensure basket is rendered on load

// If basket already has items when page loads, start nudging
updateBasket();

// only start nudge when an item gets added
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("book-btn")) {
    startBasketNudge();
  }
});


// When opening basket, stop shaking
basketIcon.addEventListener("click", () => {
  basketPanel.classList.add("open");
  document.body.classList.add("no-scroll");
  stopBasketNudge();
});

// When closing basket, restart shake (if there are items)
closeBasket.addEventListener("click", () => {
  basketPanel.classList.remove("open");
  document.body.classList.remove("no-scroll");
  if (basket.length > 0) startBasketNudge();
});

