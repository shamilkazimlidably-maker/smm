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

const goalOptions = document.querySelectorAll(".goal-option");

const stepText = document.getElementById("stepText");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");

const mainPage = document.getElementById("mainPage");
const thankYouPage = document.getElementById("thankYouPage");

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

  modal.classList.add("active");
  document.body.classList.add("modal-open");

  setStep(1);
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
    return;
  }

  setStep(2);
});

backStepBtn.addEventListener("click", () => {
  setStep(1);
});

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

/* Lead form submit */
leadForm.addEventListener("submit", async (event) => {
  event.preventDefault();

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

    Variantlar:
    - Make.com webhook
    - Zapier webhook
    - Google Sheets webhook
    - Telegram bot endpoint
    - CRM endpoint
  */

  setTimeout(() => {
    closeModal();

    mainPage.style.display = "none";
    thankYouPage.classList.add("active");
    document.body.classList.add("thank-you-active");

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });

    submitButton.disabled = false;
    submitButton.textContent = "Detalları göndər";

    resetFormState();
  }, 700);
});
