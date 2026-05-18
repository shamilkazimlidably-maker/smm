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

// FAQ accordion
const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach((item) => {
  const question = item.querySelector(".faq-question");

  question.addEventListener("click", () => {
    const isActive = item.classList.contains("active");

    faqItems.forEach((faq) => faq.classList.remove("active"));

    if (!isActive) {
      item.classList.add("active");
    }
  });
});

// Form submit
leadForm.addEventListener("submit", (event) => {
  event.preventDefault();

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
    Burada real inteqrasiya edə bilərsən:

    1. Google Sheets webhook
    2. Telegram bot
    3. CRM
    4. Email service
    5. Formspree / Getform / Make.com webhook

    Nümunə:

    fetch("YOUR_WEBHOOK_URL", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(leadData)
    });
  */

  leadForm.style.display = "none";
  successMessage.style.display = "block";

  setTimeout(() => {
    leadForm.reset();
    leadForm.style.display = "grid";
    successMessage.style.display = "none";
    closeModal();
  }, 2600);
});
