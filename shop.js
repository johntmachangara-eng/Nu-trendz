// ===== VIDEO AUTOPLAY CONTROL =====
const videos = document.querySelectorAll(".portrait-video");

const videoObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const video = entry.target;
    if (entry.isIntersecting) {
      video.play().catch(() => {});
    } else {
      video.pause();
    }
  });
}, { threshold: 0.6 });

videos.forEach(video => {
  video.muted = true;
  video.playsInline = true;
  video.loop = true;
  videoObserver.observe(video);
});


// ===== MEDIA OVERLAY POPUP (VIDEOS & IMAGES) =====
const overlay = document.getElementById("mediaOverlay");
const overlayContent = document.getElementById("overlayContent");

function showMedia(src, type) {
  overlayContent.innerHTML = "";

  if (type === "video") {
    overlayContent.innerHTML = `
      <video 
        src="${src}" 
        controls 
        autoplay 
        playsinline 
        style="max-height:80vh;border-radius:16px;display:block;margin:auto;"
      ></video>
    `;
    overlay.classList.add("video-active");
  } else {
    overlayContent.innerHTML = `<img src="${src}" alt="preview">`;
    overlay.classList.remove("video-active");
  }

  overlay.style.display = "flex";
  document.body.style.overflow = "hidden"; // disable scroll behind overlay
}


// ===== CLOSE OVERLAY =====
overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    overlay.style.display = "none";
    overlayContent.innerHTML = "";
    document.body.style.overflow = "auto";
  }
});


// ===== VIDEO CLICK HANDLER =====
videos.forEach(video => {
  video.addEventListener("click", (e) => {
    e.stopPropagation();

    const videoSrc = video.querySelector("source")
      ? video.querySelector("source").src
      : video.src;

    // On desktop → open overlay popup
    if (window.innerWidth > 992) {
      showMedia(videoSrc, "video");
    } else {
      // On mobile → play inline
      video.muted = false;
      video.setAttribute("controls", true);
      video.play();
    }
  });
});


// ===== AUTO-SCROLL GALLERY (only on mobile/tablet) =====
const scrollGallery = document.getElementById("scrollGallery");

if (scrollGallery && window.innerWidth <= 992) {
  let paused = false;

  scrollGallery.addEventListener("mouseenter", () => paused = true);
  scrollGallery.addEventListener("mouseleave", () => paused = false);
  scrollGallery.addEventListener("touchstart", () => paused = true);
  scrollGallery.addEventListener("touchend", () => paused = false);

  function autoScroll() {
    if (!paused && scrollGallery.scrollWidth > scrollGallery.clientWidth) {
      scrollGallery.scrollLeft += 0.5;
      if (scrollGallery.scrollLeft >= scrollGallery.scrollWidth - scrollGallery.clientWidth) {
        scrollGallery.scrollLeft = 0;
      }
    }
    requestAnimationFrame(autoScroll);
  }

  autoScroll();
}


// ===== IMAGE OVERLAY WITH NAVIGATION =====
const images = Array.from(document.querySelectorAll(".gallery-img"));
let currentIndex = 0;

function showImage(index) {
  const img = images[index];
  if (!img) return;

  overlayContent.innerHTML = `<img src="${img.src}" alt="preview">`;
  overlay.style.display = "flex";
  overlay.classList.remove("video-active");
}

const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");

if (nextBtn && prevBtn) {
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
  });

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
  });
}

images.forEach((img, i) => {
  img.addEventListener("click", () => {
    currentIndex = i;
    showImage(currentIndex);
  });
});


// ===== Keyboard navigation (desktop) =====
document.addEventListener("keydown", (e) => {
  if (overlay.style.display === "flex") {
    if (e.key === "ArrowRight") nextBtn?.click();
    if (e.key === "ArrowLeft") prevBtn?.click();
    if (e.key === "Escape") overlay.click();
  }
});


// ===== END OF shop.js =====
