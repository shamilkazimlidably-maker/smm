// ======================================================
// SMM Akademiyası Landing Page — app.js
// Modal, 2-step lead form, package select,
// thank-you page, FAQ, YouTube play, parallax, reveal
// ======================================================

// ---------- DOM ELEMENTS ----------
const modal = document.getElementById("leadModal");
const closeModalBtn = document.getElementById("closeModal");
const openModalBtns = document.querySelectorAll(".open-modal");

const leadForm = document.getElementById("leadForm");
const formSteps = document.querySelectorAll(".form-step");
const nextStepBtn = document.getElementById("nextStepBtn");
const backStepBtn = document.getElementById("backStepBtn");

const selectedPackageInput = document.getElementById("selectedPackage");
const selectedGoalInput = document.getElementById("selectedGoal");
const ctaSourceInput = document.getElementById("ctaSource");

const selectedPackageText = document.getElementById("selectedPackageText");
const goalOptions = document.querySelectorAll(".goal-option");

const stepText = document.getElementById("stepText");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");

const mainPage = document.getElementById("mainPage");
const thankYouPage = document.getElementById("thankYouPage");

const phoneInput = document.getElementById("phone");

let currentStep = 1;

// ---------- FORM STEP HANDLER ----------
function setStep(step) {
  currentStep = step;

  formSteps.forEach((item) => {
    const itemStep = Number(item.dataset.step);
    item.classList.toggle("active", itemStep === currentStep);
  });

  if (currentStep === 1) {
    if (stepText) stepText.textContent = "Addım 1 / 2";
    if (progressPercent) progressPercent.textContent = "50%";
    if (progressFill) progressFill.style.width = "50%";
  }

  if (currentStep === 2) {
    if (stepText) stepText.textContent = "Addım 2 / 2";
    if (progressPercent) progressPercent.textContent = "100%";
    if (progressFill) progressFill.style.width = "100%";
  }
}

// ---------- MODAL OPEN / CLOSE ----------
function openModal(packageName = "Ümumi maraq", ctaSource = "Unknown") {
  if (!modal) return;

  if (selectedPackageInput) {
    selectedPackageInput.value = packageName;
  }

  if (ctaSourceInput) {
    ctaSourceInput.value = ctaSource;
  }

  if (selectedPackageText) {
    selectedPackageText.textContent = packageName;
  }

  modal.classList.add("active");
  document.body.classList.add("modal-open");

  setStep(1);

  if (phoneInput && !phoneInput.value.trim()) {
    phoneInput.value = "+994 ";
  }
}

function closeModal() {
  if (!modal) return;

  modal.classList.remove("active");
  document.body.classList.remove("modal-open");
}

openModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const packageName = btn.dataset.package || "Ümumi maraq";
    const ctaSource = btn.dataset.cta || "Unknown";

    openModal(packageName, ctaSource);
  });
});

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeModal);
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal && modal.classList.contains("active")) {
    closeModal();
  }
});

// ---------- GOAL SELECTION ----------
goalOptions.forEach((option) => {
  option.addEventListener("click", () => {
    goalOptions.forEach((item) => item.classList.remove("selected"));

    option.classList.add("selected");

    const goal = option.dataset.goal || option.textContent.trim();

    if (selectedGoalInput) {
      selectedGoalInput.value = goal;
    }

    if (nextStepBtn) {
      nextStepBtn.disabled = false;
    }
  });
});

// ---------- NEXT / BACK ----------
if (nextStepBtn) {
  nextStepBtn.addEventListener("click", () => {
    if (!selectedGoalInput || !selectedGoalInput.value.trim()) {
      return;
    }

    setStep(2);
  });
}

if (backStepBtn) {
  backStepBtn.addEventListener("click", () => {
    setStep(1);
  });
}

// ---------- PHONE INPUT ----------
if (phoneInput) {
  phoneInput.addEventListener("focus", () => {
    if (!phoneInput.value.trim()) {
      phoneInput.value = "+994 ";
    }
  });

  phoneInput.addEventListener("input", () => {
    if (!phoneInput.value.startsWith("+994")) {
      phoneInput.value = "+994 ";
    }
  });
}

// ---------- FORM SUBMIT ----------
if (leadForm) {
  leadForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(leadForm);

    const leadData = {
      selectedPackage: formData.get("selectedPackage"),
      selectedGoal: formData.get("selectedGoal"),
      ctaSource: formData.get("ctaSource"),
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      contactMethod: formData.get("contactMethod"),
      contactTime: formData.get("contactTime"),
      submittedAt: new Date().toISOString()
    };

    console.log("SMM Akademiyası Lead:", leadData);

    localStorage.setItem("smmAcademyLead", JSON.stringify(leadData));

    closeModal();

    if (mainPage && thankYouPage) {
      mainPage.style.display = "none";
      thankYouPage.classList.add("active");
      document.body.classList.add("thank-you-active");

      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }

    leadForm.reset();

    if (selectedPackageInput) selectedPackageInput.value = "Ümumi maraq";
    if (selectedGoalInput) selectedGoalInput.value = "";
    if (ctaSourceInput) ctaSourceInput.value = "";
    if (selectedPackageText) selectedPackageText.textContent = "Ümumi maraq";

    goalOptions.forEach((item) => item.classList.remove("selected"));

    if (nextStepBtn) {
      nextStepBtn.disabled = true;
    }

    setStep(1);

    if (phoneInput) {
      phoneInput.value = "+994 ";
    }
  });
}

// ---------- FAQ ACCORDION ----------
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  if (!question) return;

  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    faqItems.forEach((faq) => faq.classList.remove("active"));

    if (!isActive) {
      item.classList.add("active");
    }
  });
});

// ---------- YOUTUBE CLICK TO PLAY ----------
const youtubeBoxes = document.querySelectorAll(".js-youtube-video");

function getYouTubeEmbedUrl(url) {
  if (!url) return "";

  let videoId = "";

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtube.com")) {
      videoId = parsedUrl.searchParams.get("v");
    }

    if (parsedUrl.hostname.includes("youtu.be")) {
      videoId = parsedUrl.pathname.replace("/", "");
    }
  } catch (error) {
    console.warn("Invalid YouTube URL:", url);
  }

  if (!videoId) return "";

  return `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
}

youtubeBoxes.forEach((box) => {
  box.addEventListener("click", () => {
    const youtubeUrl = box.dataset.youtubeUrl;
    const embedUrl = getYouTubeEmbedUrl(youtubeUrl);

    if (!embedUrl) return;

    box.innerHTML = `
      <iframe
        src="${embedUrl}"
        title="SMM Akademiyası Video"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    `;

    box.classList.add("video-active");
  });
});

// ---------- DESKTOP PARALLAX ----------
const parallaxItems = document.querySelectorAll(
  ".floating-card, .hero-glow, .browser-card"
);

function isDesktop() {
  return window.innerWidth > 1120;
}

window.addEventListener("mousemove", (event) => {
  if (!isDesktop()) return;

  const x = (event.clientX / window.innerWidth - 0.5) * 22;
  const y = (event.clientY / window.innerHeight - 0.5) * 22;

  parallaxItems.forEach((item, index) => {
    const strength = (index + 1) * 1.45;

    item.style.transform = `translate(${x / strength}px, ${y / strength}px)`;
  });
});

window.addEventListener("resize", () => {
  if (isDesktop()) return;

  parallaxItems.forEach((item) => {
    item.style.transform = "";
  });
});

// ---------- HEADER SCROLL STATE ----------
const siteHeader = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  if (!siteHeader) return;

  if (window.scrollY > 24) {
    siteHeader.classList.add("scrolled");
  } else {
    siteHeader.classList.remove("scrolled");
  }
});

// ---------- SMOOTH SCROLL ----------
const anchorLinks = document.querySelectorAll('a[href^="#"]');

anchorLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const targetId = link.getAttribute("href");

    if (!targetId || targetId === "#") return;

    const target = document.querySelector(targetId);

    if (!target) return;

    event.preventDefault();

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  });
});

// ---------- REVEAL ON SCROLL ----------
const revealItems = document.querySelectorAll(
  ".section, .problem-card, .persona-card, .method-card, .month-card, .package-card, .ba-card"
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  {
    threshold: 0.12
  }
);

revealItems.forEach((item) => {
  item.classList.add("reveal-item");
  revealObserver.observe(item);
});

// ---------- MOBILE STICKY HIDE NEAR FOOTER ----------
const mobileSticky = document.querySelector(".mobile-sticky");
const footer = document.querySelector(".footer");

if (mobileSticky && footer) {
  const stickyObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          mobileSticky.classList.add("hidden");
        } else {
          mobileSticky.classList.remove("hidden");
        }
      });
    },
    {
      threshold: 0.1
    }
  );

  stickyObserver.observe(footer);
}
