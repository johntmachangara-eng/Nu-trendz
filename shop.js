// =======================================
// NU-TRENDZ SHOP PAGE SCRIPT (FIXED)
// =======================================

document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.getElementById("scrollGallery");
  const overlay = document.getElementById("mediaOverlay");
  const overlayContent = document.getElementById("overlayContent");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const closeBtn = document.getElementById("closeOverlayBtn");

  if (!gallery || !overlay || !overlayContent) return;

  const mediaItems = Array.from(gallery.querySelectorAll("img, video"));
  let currentIndex = 0;
  let autoScrollInterval = null;
  let overlayOpen = false;

  // ===============================
  // AUTO SCROLL
  // ===============================
  const startAutoScroll = () => {
    stopAutoScroll();
    autoScrollInterval = setInterval(() => {
      gallery.scrollLeft += 1;
      if (gallery.scrollLeft + gallery.clientWidth >= gallery.scrollWidth - 2) {
        gallery.scrollLeft = 0;
      }
    }, 20);
  };

  const stopAutoScroll = () => {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  };

  startAutoScroll();

  gallery.addEventListener("mouseenter", stopAutoScroll);
  gallery.addEventListener("mouseleave", startAutoScroll);
  gallery.addEventListener("touchstart", stopAutoScroll, { passive: true });

  // ===============================
  // OVERLAY CONTROLS
  // ===============================
  const openOverlay = (index) => {
    overlayOpen = true;
    currentIndex = index;

    stopAutoScroll();

    overlay.classList.add("show");
    document.body.style.overflow = "hidden";

    renderOverlay();
  };

  const closeOverlay = () => {
    overlayOpen = false;

    overlay.classList.remove("show");
    overlayContent.innerHTML = "";
    document.body.style.overflow = "";

    startAutoScroll();
  };

  const renderOverlay = () => {
    overlayContent.innerHTML = "";
    const item = mediaItems[currentIndex];

    let element;

    if (item.tagName === "VIDEO") {
      element = document.createElement("video");
      element.src = item.src;
      element.controls = true;
      element.autoplay = true;
    } else {
      element = document.createElement("img");
      element.src = item.src;
      element.alt = item.alt || "Shop media";
    }

    element.classList.add("overlay-media");

    // ✅ Clicking the image ALSO closes overlay

    overlayContent.appendChild(element);
  };

  // ===============================
  // NAVIGATION
  // ===============================
  const showNext = () => {
    currentIndex = (currentIndex + 1) % mediaItems.length;
    renderOverlay();
  };

  const showPrev = () => {
    currentIndex =
      (currentIndex - 1 + mediaItems.length) % mediaItems.length;
    renderOverlay();
  };

  nextBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
  });

  prevBtn?.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrev();
  });

  closeBtn?.addEventListener("click", closeOverlay);

  // ===============================
  // EVENT LISTENERS
  // ===============================
  mediaItems.forEach((item, index) => {
    item.addEventListener("click", () => openOverlay(index));
  });

  // ✅ Clicking dark background closes overlay
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      closeOverlay();
    }
  });

  // ✅ Keyboard controls
  document.addEventListener("keydown", (e) => {
    if (!overlayOpen) return;

    if (e.key === "Escape") closeOverlay();
    if (e.key === "ArrowRight") showNext();
    if (e.key === "ArrowLeft") showPrev();
  });
});
