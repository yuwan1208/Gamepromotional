document.addEventListener("DOMContentLoaded", () => {
  const header = document.getElementById("siteHeader");
  const nav = document.getElementById("mainNav");
  const toggle = document.getElementById("menuToggle");
  const navLinks = [...document.querySelectorAll(".nav-link")];

  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 24);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  function closeMenu() {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open navigation");
    toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
  }
  toggle.addEventListener("click", () => {
    const opened = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(opened));
    toggle.setAttribute("aria-label", opened ? "Close navigation" : "Open navigation");
    toggle.innerHTML = opened ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
  });
  navLinks.forEach(link => link.addEventListener("click", closeMenu));
  document.addEventListener("click", event => {
    if (nav.classList.contains("open") && !nav.contains(event.target) && !toggle.contains(event.target)) closeMenu();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
      closeMenu();
      closeModal(trailerModal);
      closeModal(imageModal);
    } else if (imageModal && imageModal.classList.contains("open")) {
      if (event.key === "ArrowLeft") {
        navigateGallery(-1);
      } else if (event.key === "ArrowRight") {
        navigateGallery(1);
      }
    }
  });

  const sections = [...document.querySelectorAll("main section[id]")];
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navLinks.forEach(link => link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id));
        }
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => observer.observe(section));
  }

  const trailerModal = document.getElementById("trailerModal");
  const trailerFrame = document.getElementById("trailerFrame");
  const trailerEmbedUrl = "https://www.youtube-nocookie.com/embed/er7Fj6s3JPU?autoplay=1&playsinline=1&rel=0";
  const watchTrailerBtn = document.getElementById("watchTrailer");
  const imageModal = document.getElementById("imageModal");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCategory = document.getElementById("lightboxCategory");
  const lightboxTitle = document.getElementById("lightboxTitle");
  const lightboxDesc = document.getElementById("lightboxDesc");
  const lightboxCounter = document.getElementById("lightboxCounter");
  const lightboxPrev = document.getElementById("lightboxPrev");
  const lightboxNext = document.getElementById("lightboxNext");

  const galleryCards = [...document.querySelectorAll(".gallery-card[data-full]")];
  let currentGalleryIndex = 0;

  function showGalleryItem(index) {
    if (!galleryCards.length) return;
    currentGalleryIndex = (index + galleryCards.length) % galleryCards.length;
    const card = galleryCards[currentGalleryIndex];
    if (!card) return;

    const fullSrc = card.dataset.full || card.querySelector("img")?.src || "";
    const imgAlt = card.querySelector("img")?.alt || "Gallery image";
    const title = card.dataset.title || card.querySelector(".gallery-title")?.textContent || "";
    const category = card.dataset.category || card.querySelector(".gallery-cat")?.textContent || "";
    const desc = card.dataset.desc || card.querySelector(".gallery-desc")?.textContent || "";

    if (lightboxImage) {
      lightboxImage.src = fullSrc;
      lightboxImage.alt = imgAlt;
    }
    if (lightboxCategory) lightboxCategory.textContent = category;
    if (lightboxTitle) lightboxTitle.textContent = title;
    if (lightboxDesc) lightboxDesc.textContent = desc;
    if (lightboxCounter) lightboxCounter.textContent = `${currentGalleryIndex + 1} / ${galleryCards.length}`;
  }

  function navigateGallery(direction) {
    showGalleryItem(currentGalleryIndex + direction);
  }

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    document.documentElement.classList.add("modal-open");
  }

  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");

    if (modal === trailerModal && trailerFrame) {
      trailerFrame.removeAttribute("src");
    }
    if (modal === imageModal && lightboxImage) {
      lightboxImage.src = "";
      if (lightboxCategory) lightboxCategory.textContent = "";
      if (lightboxTitle) lightboxTitle.textContent = "";
      if (lightboxDesc) lightboxDesc.textContent = "";
    }

    if (!document.querySelector(".modal.open")) {
      document.body.classList.remove("modal-open");
      document.documentElement.classList.remove("modal-open");
    }
  }

  if (watchTrailerBtn) {
    watchTrailerBtn.addEventListener("click", () => {
      if (trailerFrame) trailerFrame.src = trailerEmbedUrl;
      openModal(trailerModal);
    });
  }

  // Close trailer modal on close button click or click outside modal panel
  if (trailerModal) {
    trailerModal.addEventListener("click", event => {
      if (event.target.closest("[data-close-modal]") || !event.target.closest(".modal-panel")) {
        closeModal(trailerModal);
      }
    });
  }

  // Close image lightbox on close button click or click outside modal panel
  if (imageModal) {
    imageModal.addEventListener("click", event => {
      if (event.target.closest("[data-close-image]") || !event.target.closest(".modal-panel")) {
        closeModal(imageModal);
      }
    });
  }

  galleryCards.forEach((card, index) => {
    card.addEventListener("click", () => {
      showGalleryItem(index);
      openModal(imageModal);
    });
  });

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", event => {
      event.stopPropagation();
      navigateGallery(-1);
    });
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", event => {
      event.stopPropagation();
      navigateGallery(1);
    });
  }

  document.getElementById("contactForm").addEventListener("submit", event => {
    event.preventDefault();
    const feedback = document.getElementById("formFeedback");
    if (!event.currentTarget.checkValidity()) { event.currentTarget.reportValidity(); return; }
    feedback.textContent = "Form validated successfully. Sending is not connected yet in this prototype.";
    event.currentTarget.reset();
  });
  const playFeedback = document.getElementById("playFeedback");
  document.getElementById("downloadClient").addEventListener("click", () => playFeedback.textContent = "The game client is a placeholder and is not available to download yet.");
  document.getElementById("playDemo").addEventListener("click", () => playFeedback.textContent = "The WebGL demo is a placeholder and is not available to play yet.");
  document.getElementById("year").textContent = new Date().getFullYear();
});
