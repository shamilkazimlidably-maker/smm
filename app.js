const modal = document.getElementById("leadModal");
const closeModalBtn = document.getElementById("closeModal");
const openModalBtns = document.querySelectorAll(".open-modal");
const leadForm = document.getElementById("leadForm");
const successMessage = document.getElementById("successMessage");
const selectedPackageInput = document.getElementById("selectedPackage");

function openModal(packageName = "Ümumi maraq") {
  selectedPackageInput.value = packageName;
  modal.classList.add("active");
  document.body.classList.add("modal-open");
}

function closeModal() {
  modal.classList.remove("active");
  document.body.classList.remove("modal-open");
}

openModalBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    const packageName = btn.dataset.package || "Ümumi maraq";
    openModal(packageName);
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

/* Smooth close for same-page anchor nav on mobile */
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
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    status: formData.get("status"),
    goal: formData.get("goal"),
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
    leadForm.style.display = "none";
    successMessage.style.display = "block";

    submitButton.disabled = false;
    submitButton.textContent = "Detalları göndər";
  }, 650);

  setTimeout(() => {
    leadForm.reset();
    leadForm.style.display = "grid";
    successMessage.style.display = "none";
    closeModal();
  }, 3200);
});
