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

function setStep(step) {
  currentStep = step;

  formSteps.forEach((item) => {
    const itemStep = Number(item.dataset.step);
    item.classList.toggle("active", itemStep === currentStep);
  });

  if (currentStep === 1) {
    stepText.textContent = "Addım 1 / 2";
    progressPercent.textContent = "50%";
    progressFill.style.width = "50%";
  }

  if (currentStep === 2) {
    stepText.textContent = "Addım 2 / 2";
    progressPercent.textContent = "100%";
    progressFill.style.width = "100%";
  }
}

function openModal(packageName = "Ümumi maraq", ctaSource = "Unknown") {
  selectedPackageInput.value = packageName;
  ctaSourceInput.value = ctaSource;

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
  modal.classList.remove("active");
  document.body.classList.remove("modal-open");
}

function resetFormState() {
  leadForm.reset();

  selectedGoalInput.value = "";
  nextStepBtn.disabled = true;

  goalOptions.forEach((option) => {
    option.classList.remove("active");
  });

  if (phoneInput) {
    phoneInput.value = "+994 ";
  }

  setStep(1);
}

openModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const packageName = btn.dataset.package || "Ümumi maraq";
    const ctaSource = btn.dataset.cta || "Unknown";

    openModal(packageName, ctaSource);
  });
});

closeModalBtn.addEventListener("click", closeModal);

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});

goalOptions.forEach((option) => {
  option.addEventListener("click", () => {
    goalOptions.forEach((item) => item.classList.remove("active"));

    option.classList.add("active");
    selectedGoalInput.value = option.dataset.goal;

    nextStepBtn.disabled = false;
  });
});

nextStepBtn.addEventListener("click", () => {
  if (!selectedGoalInput.value) {
    alert("Zəhmət olmasa məqsədini seç.");
    return;
  }

  setStep(2);
});

backStepBtn.addEventListener("click", () => {
  setStep(1);
});

/* Phone input: +994 həmişə qalsın */
if (phoneInput) {
  phoneInput.addEventListener("focus", () => {
    if (!phoneInput.value.startsWith("+994")) {
      phoneInput.value = "+994 ";
    }
  });

  phoneInput.addEventListener("input", () => {
    if (!phoneInput.value.startsWith("+994")) {
      phoneInput.value = "+994 ";
    }
  });

  phoneInput.addEventListener("keydown", (event) => {
    const cursorPosition = phoneInput.selectionStart;

    if (
      cursorPosition <= 5 &&
      (event.key === "Backspace" || event.key === "Delete")
    ) {
      event.preventDefault();
    }
  });
}

/* FAQ accordion */
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    faqItems.forEach((faq) => {
      faq.classList.remove("active");
    });

    if (!isActive) {
      item.classList.add("active");
    }
  });
});

/* Smooth anchors */
const navLinks = document.querySelectorAll('a[href^="#"]');

navLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    const href = link.getAttribute("href");

    if (href.length > 1) {
      const target = document.querySelector(href);

      if (target) {
        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    }
  });
});

/* YouTube embed */
function getYouTubeEmbedUrl(url) {
  if (!url || url === "YOUTUBE_LINK_HERE") {
    return null;
  }

  let videoId = "";

  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname.includes("youtube.com")) {
      if (parsedUrl.pathname.includes("/shorts/")) {
        videoId = parsedUrl.pathname.split("/shorts/")[1];
      } else if (parsedUrl.pathname.includes("/embed/")) {
        videoId = parsedUrl.pathname.split("/embed/")[1];
      } else {
        videoId = parsedUrl.searchParams.get("v");
      }
    }

    if (parsedUrl.hostname.includes("youtu.be")) {
      videoId = parsedUrl.pathname.replace("/", "");
    }
  } catch (error) {
    return null;
  }

  if (!videoId) {
    return null;
  }

  videoId = videoId.split("?")[0].split("&")[0];

 return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playsinline=1&rel=0&modestbranding=1`;
}

function initYouTubeVideos() {
  const videoBlocks = document.querySelectorAll(".js-youtube-video");

  videoBlocks.forEach((block) => {
    const youtubeUrl = block.dataset.youtubeUrl;
    const embedUrl = getYouTubeEmbedUrl(youtubeUrl);

    if (!embedUrl) {
      return;
    }

    block.classList.add("has-video");

    block.innerHTML = `
  <iframe
    src="${embedUrl}"
    title="SMM 360 Video"
    allow="autoplay; accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
    allowfullscreen>
  </iframe>
`;
  });
}

initYouTubeVideos();

/* Strong validation */
function validateStepTwo() {
  const requiredFields = leadForm.querySelectorAll('.form-step[data-step="2"] [required]');

  for (const field of requiredFields) {
    if (!field.value.trim()) {
      field.focus();
      alert("Zəhmət olmasa bütün məcburi xanaları doldur.");
      return false;
    }
  }

  const digitsOnly = phoneInput.value.replace(/\D/g, "");

  if (!phoneInput.value.startsWith("+994") || digitsOnly.length < 12) {
    phoneInput.focus();
    alert("Zəhmət olmasa Azərbaycan nömrəsini düzgün yaz: +994 XX XXX XX XX");
    return false;
  }

  return true;
}

/* Lead form submit */
leadForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!selectedGoalInput.value) {
    setStep(1);
    alert("Zəhmət olmasa məqsədini seç.");
    return;
  }

  if (!validateStepTwo()) {
    return;
  }

  const submitButton = leadForm.querySelector('button[type="submit"]');

  submitButton.disabled = true;
  submitButton.textContent = "Göndərilir...";

  const formData = new FormData(leadForm);

  const leadData = {
    package: formData.get("selectedPackage"),
    goal: formData.get("selectedGoal"),
    ctaSource: formData.get("ctaSource"),
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    contactMethod: formData.get("contactMethod"),
    contactTime: formData.get("contactTime"),
    createdAt: new Date().toISOString()
  };

  console.log("Lead data:", leadData);

  /*
    Real inteqrasiya üçün bura webhook əlavə et:

    await fetch("YOUR_WEBHOOK_URL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(leadData)
    });

    Tracking üçün nümunələr:
    - Meta Pixel Lead event
    - GA4 form_submit event
    - TikTok Pixel CompleteRegistration event
  */

  setTimeout(() => {
    closeModal();

    mainPage.style.display = "none";
    thankYouPage.classList.add("active");

    document.body.classList.add("thank-you-active");
    document.body.style.overflowY = "auto";

    window.scrollTo({
      top: 0,
      behavior: "auto"
    });

    submitButton.disabled = false;
    submitButton.textContent = "Detalları göndər";

    resetFormState();
  }, 700);
});
