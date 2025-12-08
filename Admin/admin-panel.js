document.addEventListener("DOMContentLoaded", () => {
  const firebaseConfig = {
    apiKey: "AIzaSyBshg3uKI9UK043ItARQhPf4kw4fDqDnkc",
    authDomain: "database-93ee7.firebaseapp.com",
    projectId: "database-93ee7",
    storageBucket: "database-93ee7.firebasestorage.app",
    messagingSenderId: "512064197430",
    appId: "1:512064197430:web:62ca518c67d20f82001997"
  };

  // Avoid double init
  if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }

  const auth = firebase.auth();
  const db = firebase.firestore();

  // DOM elements
  const statusEl = document.getElementById("status");
  const logoutBtn = document.getElementById("logoutBtn");

  const categoryList = document.getElementById("categoryList");
  const newCategoryName = document.getElementById("newCategoryName");
  const addCategoryBtn = document.getElementById("addCategoryBtn");
  const categoryMessage = document.getElementById("categoryMessage");

  const categorySelect = document.getElementById("categorySelect");
  const servicesList = document.getElementById("servicesList");

  const svcName = document.getElementById("svcName");
  const svcHours = document.getElementById("svcHours");
  const svcMinutes = document.getElementById("svcMinutes");
  const svcPriceNumber = document.getElementById("svcPriceNumber");
  const svcPriceFrom = document.getElementById("svcPriceFrom");
  const svcDesc = document.getElementById("svcDesc");
  const formTitle = document.getElementById("formTitle");
  const formMessage = document.getElementById("formMessage");
  const saveServiceBtn = document.getElementById("saveServiceBtn");
  const cancelEditBtn = document.getElementById("cancelEditBtn");

  // === Shared mobile sidebar toggle ===
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

  // Close sidebar if window resized to desktop
  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) {
      setSidebarOpen(false);
    }
  });

  // Close sidebar when a nav item is clicked (on mobile)
  document.querySelectorAll(".sidebar .nav-item").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (window.innerWidth <= 800) {
        setSidebarOpen(false);
      }
    });
  });


  if (
    !statusEl ||
    !logoutBtn ||
    !categoryList ||
    !newCategoryName ||
    !addCategoryBtn ||
    !categoryMessage ||
    !categorySelect ||
    !servicesList ||
    !svcName ||
    !svcHours ||
    !svcMinutes ||
    !svcPriceNumber ||
    !svcPriceFrom ||
    !svcDesc ||
    !formTitle ||
    !formMessage ||
    !saveServiceBtn ||
    !cancelEditBtn
  ) {
    console.error("Admin panel: missing DOM elements. Check admin-panel.html IDs.");
    return;
  }

  let categories = []; // { id, order }
  let currentCategoryId = null;
  let currentServices = [];
  let editingIndex = null; // null = add mode

  // --- drag & drop state for categories ---
  let dragSrcEl = null;
  let isDraggingMouse = false;
  let isDraggingTouch = false;
  let touchDragChip = null;
  let longPressTimer = null;

  // ------- Utility helpers -------

  function setStatus(msg) {
    statusEl.textContent = msg;
  }

  function setCategoryMessage(msg, isError = false) {
    categoryMessage.textContent = msg || "";
    categoryMessage.classList.remove("message--error", "message--success");
    if (!msg) return;
    categoryMessage.classList.add(isError ? "message--error" : "message--success");
  }

  function setFormMessage(msg, isError = false) {
    formMessage.textContent = msg || "";
    formMessage.classList.remove("message--error", "message--success");
    if (!msg) return;
    formMessage.classList.add(isError ? "message--error" : "message--success");
  }

  function disableServiceForm(disabled) {
    [
      svcName,
      svcHours,
      svcMinutes,
      svcPriceNumber,
      svcPriceFrom,
      svcDesc,
      saveServiceBtn,
      cancelEditBtn
    ].forEach((el) => (el.disabled = disabled));
  }

  // Title Case helper (for category names)
  function toTitleCase(str) {
    return str
      .toLowerCase()
      .split(" ")
      .filter(Boolean)
      .map((word) => word[0].toUpperCase() + word.slice(1))
      .join(" ");
  }

  // Sanitize category name: trim, collapse spaces, title-case
  function cleanCategoryName(raw) {
    let s = (raw || "").trim();
    s = s.replace(/\s+/g, " "); // collapse spaces
    s = toTitleCase(s);
    return s;
  }

  // Allowed chars for category names: letters, numbers, spaces, & and -
  function categoryHasInvalidChars(name) {
    return /[^A-Za-z0-9 &-]/.test(name);
  }

  function isValidCategoryId(id) {
    if (!id) return false;
    if (id.length < 2 || id.length > 40) return false;
    if (categoryHasInvalidChars(id)) return false;
    return true;
  }

  // -------- TIME & PRICE HELPERS --------

  function makeTimeLabel(hours, minutes) {
    hours = Math.max(0, Math.floor(hours));
    minutes = Math.max(0, Math.floor(minutes));

    if (minutes >= 60) {
      hours += Math.floor(minutes / 60);
      minutes = minutes % 60;
    }

    const parts = [];
    if (hours > 0) {
      parts.push(hours + (hours === 1 ? " hour" : " hours"));
    }
    if (minutes > 0) {
      parts.push(minutes + " mins");
    }
    if (!parts.length) return "0 mins";
    return parts.join(" ");
  }

  function makePriceLabel(amount, isFrom) {
    const safe = Math.max(0, amount);
    const rounded = Math.round(safe * 100) / 100;
    const display =
      rounded % 1 === 0 ? "£" + rounded.toFixed(0) : "£" + rounded.toFixed(2);
    return isFrom ? "From " + display : display;
  }

  function parseTimeLabel(label) {
    if (!label) return { hours: 0, minutes: 0 };
    const hMatch = label.match(/(\d+)\s*hour/i);
    const mMatch = label.match(/(\d+)\s*min/i);
    const hours = hMatch ? parseInt(hMatch[1], 10) || 0 : 0;
    const minutes = mMatch ? parseInt(mMatch[1], 10) || 0 : 0;
    return { hours, minutes };
  }

  function parsePriceLabel(label) {
    if (!label) return { amount: 0, isFrom: false };
    const isFrom = /^from\b/i.test(label);
    const numMatch = label.replace(/,/g, "").match(/(\d+(\.\d+)?)/);
    const amount = numMatch ? parseFloat(numMatch[1]) || 0 : 0;
    return { amount, isFrom };
  }

  // ------- Auth protection -------
  auth.onAuthStateChanged((user) => {
    if (!user) {
      window.location.href = "admin.html";
    } else {
      setStatus(`Logged in as ${user.email}`);
      loadCategories();
    }
  });

  logoutBtn.addEventListener("click", () => {
    auth
      .signOut()
      .then(() => (window.location.href = "admin.html"))
      .catch((err) => console.error("Error signing out:", err));
  });

  // ------- Categories: load from DB with validation -------
  function loadCategories() {
    setStatus("Loading categories…");
    setCategoryMessage("");

    db.collection("categories")
      .orderBy("order")
      .get()
      .then((snapshot) => {
        categories = [];
        const invalidIds = [];

        snapshot.forEach((doc) => {
          const rawId = doc.id;
          const cleanedId = cleanCategoryName(rawId);

          // Only accept valid & correctly formatted IDs
          if (!isValidCategoryId(cleanedId) || cleanedId !== rawId) {
            invalidIds.push(rawId);
            return;
          }

          const data = doc.data() || {};
          categories.push({
            id: rawId,
            order: data.order || 0
          });
        });

        if (invalidIds.length) {
          console.warn(
            "Some categories in Firestore have invalid / unformatted IDs and were skipped:",
            invalidIds
          );
          setCategoryMessage(
            "Some invalid categories in the database were hidden. Clean them up in Firestore if needed.",
            true
          );
        }

        renderCategoryList();
        renderCategorySelect();

        if (!categories.length) {
          setStatus("No valid categories yet. Add one to get started.");
          servicesList.innerHTML =
            "<p class='message'>No category selected. Add a category first.</p>";
          disableServiceForm(true);
        } else {
          disableServiceForm(false);
          currentCategoryId = categories[0].id;
          categorySelect.value = currentCategoryId;
          loadServicesForCategory(currentCategoryId);
          setStatus("Categories loaded.");
        }

        categorySelect.addEventListener("change", () => {
          currentCategoryId = categorySelect.value || null;
          if (!currentCategoryId) {
            servicesList.innerHTML =
              "<p class='message'>No category selected.</p>";
            disableServiceForm(true);
            return;
          }
          disableServiceForm(false);
          loadServicesForCategory(currentCategoryId);
        });
      })
      .catch((err) => {
        console.error("Error loading categories:", err);
        setStatus("Error loading categories. Check console.");
        setCategoryMessage("Error loading categories.", true);
      });
  }

  function renderCategoryList() {
    categoryList.innerHTML = "";

    if (!categories.length) {
      const p = document.createElement("p");
      p.className = "message";
      p.textContent = "No categories yet. Add one on the right.";
      categoryList.appendChild(p);
      return;
    }

    categories.forEach((cat) => {
      const chip = document.createElement("div");
      chip.className = "chip";
      chip.draggable = true; // for mouse drag
      chip.dataset.id = cat.id;

      const label = document.createElement("span");
      label.textContent = cat.id;

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "chip-delete";
      delBtn.textContent = "×";
      delBtn.title = "Delete category";
      delBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // don't interfere with dragging
        handleDeleteCategory(cat.id);
      });

      chip.appendChild(label);
      chip.appendChild(delBtn);
      categoryList.appendChild(chip);
    });
  }

  function renderCategorySelect() {
    categorySelect.innerHTML = "";

    if (!categories.length) {
      const opt = document.createElement("option");
      opt.value = "";
      opt.textContent = "No categories";
      categorySelect.appendChild(opt);
      return;
    }

    categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat.id;
      opt.textContent = cat.id;
      categorySelect.appendChild(opt);
    });
  }

  // ------- Add category with strict validation -------
  function handleAddCategory() {
    setCategoryMessage("");

    let raw = newCategoryName.value;
    let cleaned = cleanCategoryName(raw);

    if (!cleaned || cleaned.length < 2) {
      setCategoryMessage("Category name must be at least 2 characters.", true);
      return;
    }

    if (cleaned.length > 40) {
      setCategoryMessage("Category name is too long (max 40 characters).", true);
      return;
    }

    if (categoryHasInvalidChars(cleaned)) {
      setCategoryMessage(
        "Only letters, numbers, spaces, '&' and '-' are allowed.",
        true
      );
      return;
    }

    const id = cleaned; // store exactly this as the doc ID

    if (categories.some((c) => c.id === id)) {
      setCategoryMessage("That category already exists.", true);
      return;
    }

    addCategoryBtn.disabled = true;

    db.collection("categories")
      .doc(id)
      .set(
        {
          order: Date.now(),
          services: []
        },
        { merge: true }
      )
      .then(() => {
        setCategoryMessage("Category added.", false);
        newCategoryName.value = "";
        return loadCategories();
      })
      .catch((err) => {
        console.error("Error adding category:", err);
        setCategoryMessage("Error adding category. Check console.", true);
      })
      .finally(() => {
        addCategoryBtn.disabled = false;
      });
  }

  function handleDeleteCategory(id) {
    const confirmDelete = window.confirm(
      `Are you sure you want to delete the category "${id}" and ALL of its services?\n\nThis cannot be undone.\n\nPress OK to delete, or Cancel to keep it.`
    );
    if (!confirmDelete) return;

    db.collection("categories")
      .doc(id)
      .delete()
      .then(() => {
        setCategoryMessage("Category deleted.", false);
        if (currentCategoryId === id) {
          currentCategoryId = null;
          servicesList.innerHTML =
            "<p class='message'>No category selected.</p>";
          disableServiceForm(true);
        }
        loadCategories();
      })
      .catch((err) => {
        console.error("Error deleting category:", err);
        setCategoryMessage("Error deleting category. Check console.", true);
      });
  }

  addCategoryBtn.addEventListener("click", handleAddCategory);

  newCategoryName.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddCategory();
    }
  });

  // Auto-format category field on blur (Title Case, clean spaces)
  newCategoryName.addEventListener("blur", () => {
    if (!newCategoryName.value.trim()) return;
    newCategoryName.value = cleanCategoryName(newCategoryName.value);
  });

  // ------- Services (read from DB, keep strings, new inputs are numeric) -------
  function loadServicesForCategory(categoryId) {
    if (!categoryId) return;

    setFormMessage("");
    resetServiceForm();
    servicesList.innerHTML = "<p class='message'>Loading services…</p>";

    db.collection("categories")
      .doc(categoryId)
      .get()
      .then((doc) => {
        if (!doc.exists) {
          currentServices = [];
          servicesList.innerHTML =
            "<p class='message'>Category document not found in Firestore.</p>";
          return;
        }

        const data = doc.data() || {};
        const rawServices = Array.isArray(data.services) ? data.services : [];

        currentServices = rawServices.map((svc) => ({
          name: (svc.name || "").trim() || "Untitled service",
          time: (svc.time || "").trim(),
          price: (svc.price || "").trim(),
          desc: (svc.desc || "").trim()
        }));

        renderServicesList();
      })
      .catch((err) => {
        console.error("Error loading services:", err);
        servicesList.innerHTML =
          "<p class='message message--error'>Error loading services.</p>";
      });
  }

  function renderServicesList() {
    servicesList.innerHTML = "";

    if (!currentServices.length) {
      servicesList.innerHTML =
        "<p class='message'>No services in this category yet.</p>";
      return;
    }

    currentServices.forEach((svc, index) => {
      const card = document.createElement("div");
      card.className = "service-card";

      const main = document.createElement("div");
      main.className = "service-main";

      const nameEl = document.createElement("div");
      nameEl.className = "service-name";
      nameEl.textContent = svc.name || "Untitled service";

      const metaEl = document.createElement("div");
      metaEl.className = "service-meta";
      metaEl.textContent = `${svc.time || ""} · ${svc.price || ""}`;

      main.appendChild(nameEl);
      main.appendChild(metaEl);

      if (svc.desc) {
        const descEl = document.createElement("div");
        descEl.className = "service-desc";
        descEl.textContent = svc.desc;
        main.appendChild(descEl);
      }

      const actions = document.createElement("div");
      actions.className = "service-actions";

      const editBtn = document.createElement("button");
      editBtn.type = "button";
      editBtn.className = "btn-pill edit";
      editBtn.textContent = "Edit";
      editBtn.addEventListener("click", () => startEditService(index));

      const delBtn = document.createElement("button");
      delBtn.type = "button";
      delBtn.className = "btn-pill delete";
      delBtn.textContent = "Delete";
      delBtn.addEventListener("click", () => deleteService(index));

      actions.appendChild(editBtn);
      actions.appendChild(delBtn);

      card.appendChild(main);
      card.appendChild(actions);
      servicesList.appendChild(card);
    });
  }

  function resetServiceForm() {
    editingIndex = null;
    formTitle.textContent = "Add new service";
    svcName.value = "";
    svcHours.value = "";
    svcMinutes.value = "";
    svcPriceNumber.value = "";
    svcPriceFrom.checked = false;
    svcDesc.value = "";
  }

  function startEditService(index) {
    const svc = currentServices[index];
    editingIndex = index;
    formTitle.textContent = "Edit service";

    svcName.value = svc.name || "";

    // Try to parse stored time like "1 hour 30 mins"
    const timeParts = parseTimeLabel(svc.time || "");
    svcHours.value = timeParts.hours || "";
    svcMinutes.value = timeParts.minutes || "";

    // Parse price like "From £40" or "£30"
    const priceParts = parsePriceLabel(svc.price || "");
    svcPriceNumber.value = priceParts.amount || "";
    svcPriceFrom.checked = priceParts.isFrom;

    svcDesc.value = svc.desc || "";
  }

  function saveService() {
    if (!currentCategoryId) return;

    const name = (svcName.value || "").trim();
    const hours = parseInt(svcHours.value, 10) || 0;
    const minutes = parseInt(svcMinutes.value, 10) || 0;
    const amount = parseFloat(svcPriceNumber.value);
    const desc = (svcDesc.value || "").trim();
    const isFrom = !!svcPriceFrom.checked;

    setFormMessage("");

    if (!name || name.length < 2) {
      setFormMessage("Service name must be at least 2 characters.", true);
      return;
    }

    if (hours < 0 || minutes < 0 || minutes > 59) {
      setFormMessage("Please enter a valid time (minutes 0–59).", true);
      return;
    }

    if (hours === 0 && minutes === 0) {
      setFormMessage("Time must be more than 0 minutes.", true);
      return;
    }

    if (isNaN(amount) || amount <= 0) {
      setFormMessage("Price must be a positive number.", true);
      return;
    }

    const timeLabel = makeTimeLabel(hours, minutes);
    const priceLabel = makePriceLabel(amount, isFrom);

    const svcObj = { name, time: timeLabel, price: priceLabel, desc };

    if (editingIndex === null) {
      currentServices.push(svcObj);
    } else {
      currentServices[editingIndex] = svcObj;
    }

    db.collection("categories")
      .doc(currentCategoryId)
      .set({ services: currentServices }, { merge: true })
      .then(() => {
        setFormMessage("Service saved.", false);
        resetServiceForm();
        renderServicesList();
      })
      .catch((err) => {
        console.error("Error saving service:", err);
        setFormMessage("Error saving service. Check console.", true);
      });
  }

  function deleteService(index) {
    const svc = currentServices[index];
    const ok = window.confirm(
      `Are you sure you want to delete the service "${svc.name}"?\n\nPress OK to delete, or Cancel to keep it.`
    );
    if (!ok) return;

    currentServices.splice(index, 1);

    db.collection("categories")
      .doc(currentCategoryId)
      .set({ services: currentServices }, { merge: true })
      .then(() => {
        setFormMessage("Service deleted.", false);
        resetServiceForm();
        renderServicesList();
      })
      .catch((err) => {
        console.error("Error deleting service:", err);
        setFormMessage("Error deleting service. Check console.", true);
      });
  }

  // Save / cancel
  saveServiceBtn.addEventListener("click", saveService);
  cancelEditBtn.addEventListener("click", () => {
    resetServiceForm();
    setFormMessage("");
  });

  // ------- CATEGORY DRAG & DROP (mouse + long-press touch) -------

  function updateCategoryOrderFromDomAndSave() {
    const chipEls = Array.from(categoryList.querySelectorAll(".chip"));
    if (!chipEls.length) return;

    const newOrderMap = {};
    chipEls.forEach((chip, idx) => {
      const id = chip.dataset.id || chip.querySelector("span")?.textContent;
      if (id) newOrderMap[id] = idx;
    });

    categories = categories
      .filter((cat) => Object.prototype.hasOwnProperty.call(newOrderMap, cat.id))
      .sort((a, b) => newOrderMap[a.id] - newOrderMap[b.id])
      .map((cat) => ({ ...cat, order: newOrderMap[cat.id] }));

    const updates = categories.map((cat) =>
      db.collection("categories").doc(cat.id).set({ order: cat.order }, { merge: true })
    );

    Promise.all(updates)
      .then(() => {
        setCategoryMessage("Category order updated.", false);
      })
      .catch((err) => {
        console.error("Error saving category order:", err);
        setCategoryMessage("Error saving order. Check console.", true);
      });
  }

  function initCategoryDragAndDrop() {
    // Mouse drag events
    categoryList.addEventListener("dragstart", (e) => {
      const chip = e.target.closest(".chip");
      if (!chip) return;
      isDraggingMouse = true;
      dragSrcEl = chip;
      chip.classList.add("chip--dragging");
      if (e.dataTransfer) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", chip.dataset.id || "");
      }
    });

    categoryList.addEventListener("dragover", (e) => {
      if (!isDraggingMouse) return;
      e.preventDefault();
      const overChip = e.target.closest(".chip");
      if (!overChip || overChip === dragSrcEl) return;

      const chips = Array.from(categoryList.children).filter((el) =>
        el.classList.contains("chip")
      );
      const srcIndex = chips.indexOf(dragSrcEl);
      const overIndex = chips.indexOf(overChip);
      if (srcIndex === -1 || overIndex === -1) return;

      if (overIndex > srcIndex) {
        categoryList.insertBefore(dragSrcEl, overChip.nextSibling);
      } else {
        categoryList.insertBefore(dragSrcEl, overChip);
      }
    });

    categoryList.addEventListener("drop", (e) => {
      if (!isDraggingMouse) return;
      e.preventDefault();
      if (dragSrcEl) {
        dragSrcEl.classList.remove("chip--dragging");
      }
      isDraggingMouse = false;
      dragSrcEl = null;
      updateCategoryOrderFromDomAndSave();
    });

    categoryList.addEventListener("dragend", () => {
      if (dragSrcEl) {
        dragSrcEl.classList.remove("chip--dragging");
      }
      isDraggingMouse = false;
      dragSrcEl = null;
    });

    // Touch long-press drag (basic)
    categoryList.addEventListener(
      "touchstart",
      (e) => {
        const touch = e.touches[0];
        if (!touch) return;

        const chip = e.target.closest(".chip");
        if (!chip) return;

        longPressTimer = setTimeout(() => {
          isDraggingTouch = true;
          touchDragChip = chip;
          chip.classList.add("chip--dragging");
        }, 250);
      },
      { passive: true }
    );

    categoryList.addEventListener(
      "touchmove",
      (e) => {
        if (!isDraggingTouch) return;
        e.preventDefault();

        const touch = e.touches[0];
        if (!touch) return;

        const elem = document.elementFromPoint(touch.clientX, touch.clientY);
        const overChip = elem && elem.closest(".chip");
        if (!overChip || overChip === touchDragChip) return;

        const chips = Array.from(categoryList.children).filter((el) =>
          el.classList.contains("chip")
        );
        const srcIndex = chips.indexOf(touchDragChip);
        const overIndex = chips.indexOf(overChip);
        if (srcIndex === -1 || overIndex === -1) return;

        if (overIndex > srcIndex) {
          categoryList.insertBefore(touchDragChip, overChip.nextSibling);
        } else {
          categoryList.insertBefore(touchDragChip, overChip);
        }
      },
      { passive: false }
    );

    function endTouchDrag() {
      clearTimeout(longPressTimer);
      if (!isDraggingTouch) return;

      isDraggingTouch = false;
      if (touchDragChip) {
        touchDragChip.classList.remove("chip--dragging");
      }
      touchDragChip = null;
      updateCategoryOrderFromDomAndSave();
    }

    categoryList.addEventListener("touchend", endTouchDrag);
    categoryList.addEventListener("touchcancel", endTouchDrag);
  }

  // Initialise drag + drop once
  initCategoryDragAndDrop();
});
