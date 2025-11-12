// ===============================
// NU-TRENDZ SHOP PAGE SCRIPT
// ===============================

/* ============================================
  YOUTUBE VIDEO MANAGEMENT
============================================ */

let ytPlayers = [];

/**
 * Initialize YouTube players with API
 */
function onYouTubeIframeAPIReady() {
  const iframes = document.querySelectorAll("iframe[src*='youtube.com']");
  iframes.forEach((iframe, index) => {
   ytPlayers[index] = new YT.Player(iframe, {
    events: {
      onReady: (event) => setupVideoObserver(event.target, iframe),
    },
   });
  });
}

/**
 * Pause video when it scrolls out of view
 */
function setupVideoObserver(player, iframe) {
  const observer = new IntersectionObserver(
   (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
       try {
        player.pauseVideo();
       } catch (err) {
        console.warn("Pause failed:", err);
       }
      }
    });
   },
   { threshold: 0.5 }
  );
  observer.observe(iframe);
}

/* ============================================
  IMAGE GALLERY & OVERLAY
============================================ */

const GalleryManager = {
  overlay: null,
  overlayContent: null,
  images: [],
  currentIndex: 0,

  init() {
   this.overlay = document.getElementById("mediaOverlay");
   this.overlayContent = document.getElementById("overlayContent");
   this.images = Array.from(document.querySelectorAll(".gallery-img"));

   this.setupEventListeners();
   this.setupKeyboardNavigation();
  },

  showImage(index) {
   const img = this.images[index];
   if (!img) return;
   this.overlayContent.innerHTML = `<img src="${img.src}" alt="preview">`;
   this.overlay.style.display = "flex";
   document.body.style.overflow = "hidden";
  },

  closeOverlay() {
   this.overlay.style.display = "none";
   this.overlayContent.innerHTML = "";
   document.body.style.overflow = "auto";
  },

  nextImage() {
   this.currentIndex = (this.currentIndex + 1) % this.images.length;
   this.showImage(this.currentIndex);
  },

  prevImage() {
   this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
   this.showImage(this.currentIndex);
  },

  setupEventListeners() {
   // Close on overlay click
   this.overlay.addEventListener("click", (e) => {
    if (e.target === this.overlay) this.closeOverlay();
   });

   // Navigation buttons
   const nextBtn = document.getElementById("nextBtn");
   const prevBtn = document.getElementById("prevBtn");

   if (nextBtn && prevBtn) {
    nextBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.nextImage();
    });

    prevBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      this.prevImage();
    });
   }

   // Image click handlers
   this.images.forEach((img, i) => {
    img.addEventListener("click", () => {
      this.currentIndex = i;
      this.showImage(this.currentIndex);
    });
   });
  },

  setupKeyboardNavigation() {
   document.addEventListener("keydown", (e) => {
    if (this.overlay.style.display === "flex") {
      if (e.key === "ArrowRight") this.nextImage();
      if (e.key === "ArrowLeft") this.prevImage();
      if (e.key === "Escape") this.closeOverlay();
    }
   });
  }
};

/* ============================================
  AUTO-SCROLL GALLERY (Mobile/Tablet)
============================================ */

const AutoScrollManager = {
  gallery: null,
  paused: false,

  init() {
   this.gallery = document.getElementById("scrollGallery");
   
   if (!this.gallery || window.innerWidth > 992) return;

   this.setupEventListeners();
   this.startAutoScroll();
  },

  setupEventListeners() {
   this.gallery.addEventListener("mouseenter", () => (this.paused = true));
   this.gallery.addEventListener("mouseleave", () => (this.paused = false));
   this.gallery.addEventListener("touchstart", () => (this.paused = true));
   this.gallery.addEventListener("touchend", () => (this.paused = false));
  },

  startAutoScroll() {
   const scroll = () => {
    if (!this.paused && this.gallery.scrollWidth > this.gallery.clientWidth) {
      this.gallery.scrollLeft += 0.6;
      if (this.gallery.scrollLeft >= this.gallery.scrollWidth - this.gallery.clientWidth) {
       this.gallery.scrollLeft = 0;
      }
    }
    requestAnimationFrame(scroll);
   };
   scroll();
  }
};

/* ============================================
  INITIALIZATION
============================================ */

document.addEventListener("DOMContentLoaded", () => {
  GalleryManager.init();
  AutoScrollManager.init();
});
