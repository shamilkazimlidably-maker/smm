const WHATSAPP_NUMBER = "994XXXXXXXXX";

const app = document.getElementById("app");

const state = {
  currentQuestion: 0,
  answers: [],
  branchAnswers: [],
  name: "",
  phone: "",
  leadStatus: "not_qualified"
};

const questions = [
  {
    id: "experience",
    title: "Meta reklamları ilə hazırkı təcrübən nə səviyyədədir?",
    options: [
      "Heç başlamamışam",
      "Boost etmişəm, amma Ads Manager istifadə etməmişəm",
      "Ads Manager-də reklam açmışam, amma nəticələr stabil deyil",
      "Aktiv reklam idarə edirəm, daha yaxşı nəticə almaq istəyirəm"
    ]
  },
  {
    id: "problem",
    title: "Meta reklamlarında ən çox hansı problem səni saxlayır?",
    options: [
      "Haradan başlayacağımı bilmirəm",
      "Reklam açanda pul gedir, nəticə gəlmir",
      "Kreativləri necə test edəcəyimi bilmirəm",
      "Targeting, pixel və campaign structure qarışıq gəlir",
      "Müştəri üçün reklam idarə etmək istəyirəm, amma özümə güvənmirəm"
    ]
  },
  {
    id: "goal",
    title: "Reklam öyrənməkdə əsas məqsədin nədir?",
    options: [
      "Öz biznesim üçün reklam açmaq",
      "SMM xidmətimə Meta Ads əlavə etmək",
      "Freelance və ya agentlik işi görmək",
      "Mövcud reklam nəticələrimi yaxşılaşdırmaq",
      "Sadəcə maraqlanıram"
    ]
  },
  {
    id: "creative_testing",
    title: "Kreativ testinglə bağlı hansı cümlə sənə daha yaxındır?",
    options: [
      "Kreativ test nədir, bilmirəm",
      "Bir dizayn/video hazırlayıb reklam verirəm",
      "Bir neçə kreativ hazırlayıram, amma necə müqayisə edəcəyimi bilmirəm",
      "Hook, angle, format və offer testlərini sistemli etmək istəyirəm"
    ]
  },
  {
    id: "learning_format",
    title: "Sənə hansı öyrənmə formatı daha uyğundur?",
    options: [
      "Qısa və praktiki videolar",
      "Addım-addım ekran qeydi ilə izah",
      "Real reklam nümunələri və analizlər",
      "Tapşırıqlar və checklist-lərlə öyrənmək",
      "Hamısı"
    ]
  },
  {
    id: "price_intent",
    title: "Əgər bu videokurs sənə Meta reklamlarını sıfırdan qurmağı, kreativ test etməyi və reklam nəticələrini oxumağı öyrədirsə, 150 AZN qiymət sənə necə görünür?",
    options: [
      "Mənim üçün uyğundur, indi başlamaq istəyirəm",
      "Uyğundur, amma əvvəl proqramı görmək istəyirəm",
      "Maraqlıdır, amma qərarsızam",
      "Hazırda büdcəm yoxdur",
      "Mənə uyğun deyil"
    ]
  }
];

function trackEvent(eventName, params = {}) {
  console.log("EVENT:", eventName, params);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params
  });

  if (typeof fbq === "function") {
    if (eventName === "Lead") {
      fbq("track", "Lead", params);
    } else {
      fbq("trackCustom", eventName, params);
    }
  }
}

function startQuiz() {
  trackEvent("StartQuiz");
  renderQuestion();
}

function renderStart() {
  app.innerHTML = `
    <div class="info-box">
      <h2>Meta Ads-i öyrənmək istəyirsən?</h2>
      <p>
        6 qısa suala cavab ver. Sonda sənə bu videokursun uyğun olub-olmadığını göstərəcəyik.
      </p>
      <p>
        Kursun qiyməti <strong>150 AZN</strong>-dir və giriş <strong>ömürlükdür</strong>.
      </p>
    </div>

    <div class="actions">
      <button class="btn btn-primary" onclick="startQuiz()">Quiz-ə başla</button>
    </div>
  `;
}

function renderProgress() {
  const percent = ((state.currentQuestion) / questions.length) * 100;

  return `
    <div class="progress-wrap">
      <div class="progress-meta">
        <span>Sual ${state.currentQuestion + 1} / ${questions.length}</span>
        <span>${Math.round(percent)}%</span>
      </div>
      <div class="progress">
        <div class="progress-fill" style="width: ${percent}%"></div>
      </div>
    </div>
  `;
}

function renderQuestion() {
  const q = questions[state.currentQuestion];

  app.innerHTML = `
    ${renderProgress()}
    <div class="question-title">
      <h2>${q.title}</h2>
    </div>

    <div class="options">
      ${q.options
        .map((option, index) => `
          <button class="option" onclick="selectAnswer(${index})">
            <strong>${String.fromCharCode(65 + index)})</strong> ${option}
          </button>
        `)
        .join("")}
    </div>

    ${
      state.currentQuestion > 0
        ? `<div class="actions">
            <button class="btn btn-light" onclick="goBack()">Geri</button>
          </div>`
        : ""
    }
  `;
}

function selectAnswer(optionIndex) {
  const question = questions[state.currentQuestion];
  const answer = question.options[optionIndex];

  state.answers[state.currentQuestion] = {
    questionId: question.id,
    question: question.title,
    answer
  };

  if (state.currentQuestion < questions.length - 1) {
    state.currentQuestion++;
    renderQuestion();
    return;
  }

  trackEvent("CompleteQuiz", {
    price_intent: answer
  });

  handleFinalIntent(optionIndex);
}

function goBack() {
  if (state.currentQuestion > 0) {
    state.currentQuestion--;
    renderQuestion();
  }
}

function handleFinalIntent(optionIndex) {
  if (optionIndex === 0) {
    state.leadStatus = "qualified_direct";
    renderQualifiedPage("direct");
  }

  if (optionIndex === 1) {
    renderProgramPage();
  }

  if (optionIndex === 2) {
    renderDecisionReasonPage();
  }

  if (optionIndex === 3) {
    state.leadStatus = "disqualified_budget";
    trackEvent("Disqualified", { reason: "budget_not_ready" });
    renderDisqualifiedPage("budget");
  }

  if (optionIndex === 4) {
    state.leadStatus = "disqualified_not_fit";
    trackEvent("Disqualified", { reason: "not_fit" });
    renderDisqualifiedPage("not_fit");
  }
}

function renderProgramPage() {
  trackEvent("ViewProgram");

  app.innerHTML = `
    <span class="tag">Proqram səhifəsi</span>
    <h2>Kurs proqramına bax və uyğun olub-olmadığını qərarlaşdır</h2>
    <p>
      Bu videokurs Meta reklamlarını sıfırdan sistemli öyrənmək, reklam strukturu qurmaq,
      kreativləri test etmək və nəticələri oxumaq istəyənlər üçün hazırlanıb.
    </p>

    <div class="program-grid">
      ${programModules()}
    </div>

    <div class="info-box">
      <h2>Proqrama baxdıqdan sonra indi ödəniş edib başlamaq istəyirsən?</h2>
      <div class="options">
        <button class="option" onclick="programDecision('yes')">
          <strong>A)</strong> Bəli, başlamaq istəyirəm
        </button>
        <button class="option" onclick="programDecision('unsure')">
          <strong>B)</strong> Hələ qərarsızam
        </button>
        <button class="option" onclick="programDecision('no')">
          <strong>C)</strong> İndi uyğun deyil
        </button>
      </div>
    </div>
  `;
}

function programModules() {
  const modules = [
    {
      title: "Meta Ads məntiqi və reklam düşüncəsi",
      text: "Boost ilə Ads Manager fərqi, reklamın biznesdə rolu, kampaniya məntiqi."
    },
    {
      title: "Kampaniya strukturu",
      text: "Campaign, ad set, ad səviyyəsi, məqsəd seçimi, büdcə və yerləşdirmə məntiqi."
    },
    {
      title: "Auditoriya və targeting",
      text: "Broad targeting, interest, lookalike, retargeting və düzgün auditoriya yanaşması."
    },
    {
      title: "Kreativ testing sistemi",
      text: "Hook, angle, format, visual, copy testləri və hansı kreativin işlədiyini anlamaq."
    },
    {
      title: "Reklam nəticələrinin oxunması",
      text: "CTR, CPM, CPC, CPL, conversion, frequency və nəticəyə görə qərar vermək."
    },
    {
      title: "Real nümunələr və praktiki reklam planı",
      text: "Real reklam nümunələri, creative plan, test planı və optimizasiya addımları."
    }
  ];

  return modules.map((m, i) => `
    <div class="module">
      <span>Modul ${i + 1}</span>
      <h3>${m.title}</h3>
      <p>${m.text}</p>
    </div>
  `).join("");
}

function programDecision(decision) {
  if (decision === "yes") {
    state.branchAnswers.push({
      question: "Proqrama baxdıqdan sonra indi ödəniş edib başlamaq istəyirsən?",
      answer: "Bəli, başlamaq istəyirəm"
    });

    state.leadStatus = "qualified_after_program";
    renderQualifiedPage("program");
  }

  if (decision === "unsure") {
    state.branchAnswers.push({
      question: "Proqrama baxdıqdan sonra indi ödəniş edib başlamaq istəyirsən?",
      answer: "Hələ qərarsızam"
    });

    renderDecisionReasonPage();
  }

  if (decision === "no") {
    state.branchAnswers.push({
      question: "Proqrama baxdıqdan sonra indi ödəniş edib başlamaq istəyirsən?",
      answer: "İndi uyğun deyil"
    });

    state.leadStatus = "disqualified_program_no";
    trackEvent("Disqualified", { reason: "program_not_ready" });
    renderDisqualifiedPage("not_now");
  }
}

function renderDecisionReasonPage() {
  app.innerHTML = `
    <span class="tag">Qərarsızlıq mərhələsi</span>
    <h2>Qərarsız qalmağın əsas səbəbi nədir?</h2>
    <p>
      Cavabına görə sənə kursun uyğun olub-olmadığını daha dəqiq göstərəcəyik.
    </p>

    <div class="options">
      <button class="option" onclick="handleReason('fit')">
        <strong>A)</strong> Kursun mənə uyğun olub-olmadığını bilmirəm
      </button>
      <button class="option" onclick="handleReason('recorded')">
        <strong>B)</strong> Record olunmuş kursla öyrənə biləcəyimə əmin deyiləm
      </button>
      <button class="option" onclick="handleReason('value')">
        <strong>C)</strong> Qiymətə dəyib-dəyməyəcəyini bilmirəm
      </button>
      <button class="option" onclick="handleReason('hard')">
        <strong>D)</strong> Meta reklamları mənim üçün çətin görünür
      </button>
      <button class="option" onclick="handleReason('later')">
        <strong>E)</strong> Sadəcə daha sonra baxmaq istəyirəm
      </button>
    </div>
  `;
}

function handleReason(reason) {
  const labels = {
    fit: "Kursun mənə uyğun olub-olmadığını bilmirəm",
    recorded: "Record olunmuş kursla öyrənə biləcəyimə əmin deyiləm",
    value: "Qiymətə dəyib-dəyməyəcəyini bilmirəm",
    hard: "Meta reklamları mənim üçün çətin görünür",
    later: "Sadəcə daha sonra baxmaq istəyirəm"
  };

  state.branchAnswers.push({
    question: "Qərarsız qalmağın əsas səbəbi nədir?",
    answer: labels[reason]
  });

  if (reason === "fit") renderFitConditioning();
  if (reason === "recorded") renderRecordedConditioning();
  if (reason === "value") renderValueConditioning();
  if (reason === "hard") renderHardConditioning();
  if (reason === "later") renderLaterPage();
}

function renderFitConditioning() {
  app.innerHTML = `
    <h2>Bu kurs sənə uyğundur əgər...</h2>

    <div class="check-list">
      <div class="check-item">✓ SMM edirsən, amma reklam tərəfin zəifdirsə</div>
      <div class="check-item">✓ Öz biznesin üçün reklam açmaq istəyirsənsə</div>
      <div class="check-item">✓ Boost yox, Ads Manager məntiqini öyrənmək istəyirsənsə</div>
      <div class="check-item">✓ Kreativləri necə test edəcəyini bilmirsənsə</div>
      <div class="check-item">✓ Reklam nəticələrini oxuyub qərar vermək istəyirsənsə</div>
    </div>

    <h2>Bu maddələrdən ən azı biri sənə uyğundur?</h2>

    <div class="options">
      <button class="option" onclick="conditioningDecision('fit_yes')">
        <strong>A)</strong> Bəli, mənə uyğundur
      </button>
      <button class="option" onclick="conditioningDecision('fit_no')">
        <strong>B)</strong> Yox, mənə uyğun deyil
      </button>
    </div>
  `;
}

function renderRecordedConditioning() {
  app.innerHTML = `
    <h2>Record olunmuş kursun üstünlüyü nədir?</h2>
    <div class="info-box">
      <p>
        Canlı dərs deyil, amma istədiyin vaxt baxa, dayandıra, təkrar izləyə və öz sürətində öyrənə bilirsən.
        Meta Ads kimi praktiki mövzuda ekran qeydi və addım-addım izah çox rahat işləyir.
      </p>
    </div>

    <h2>Sənə ömürlük giriş və təkrar izləmə imkanı uyğun gəlir?</h2>

    <div class="options">
      <button class="option" onclick="conditioningDecision('recorded_yes')">
        <strong>A)</strong> Bəli, bu mənim üçün rahatdır
      </button>
      <button class="option" onclick="conditioningDecision('recorded_no')">
        <strong>B)</strong> Yox, mən yalnız canlı dərs istəyirəm
      </button>
    </div>
  `;
}

function renderValueConditioning() {
  app.innerHTML = `
    <h2>150 AZN nə üçün məntiqli ola bilər?</h2>
    <div class="info-box">
      <p>
        Bu kursun məqsədi sənə təkcə reklam açmağı yox, reklamın məntiqini başa salmaqdır.
        Bir reklam büdcəsini səhv xərcləmək bəzən bu kursun qiymətindən daha baha başa gəlir.
        Kursa ömürlük giriş verilir.
      </p>
    </div>

    <h2>Bu sənin üçün məntiqli investisiya sayılır?</h2>

    <div class="options">
      <button class="option" onclick="conditioningDecision('value_yes')">
        <strong>A)</strong> Bəli, məntiqlidir
      </button>
      <button class="option" onclick="conditioningDecision('value_unsure')">
        <strong>B)</strong> Hələ də əmin deyiləm
      </button>
      <button class="option" onclick="conditioningDecision('value_no')">
        <strong>C)</strong> Xeyr, mənim üçün uyğun deyil
      </button>
    </div>
  `;
}

function renderHardConditioning() {
  app.innerHTML = `
    <h2>Meta Ads niyə çətin görünür?</h2>
    <div class="info-box">
      <p>
        Meta Ads ilk baxışda qarışıq görünə bilər. Amma problem çox vaxt reklamı sistemsiz öyrənməkdir.
        Bu kursda mövzular campaign, ad set, ad, kreativ, auditoriya və nəticə oxuma ardıcıllığı ilə izah olunur.
      </p>
    </div>

    <h2>Sənə sıfırdan və addım-addım izah olunan format uyğun olar?</h2>

    <div class="options">
      <button class="option" onclick="conditioningDecision('hard_yes')">
        <strong>A)</strong> Bəli, addım-addım öyrənmək istəyirəm
      </button>
      <button class="option" onclick="conditioningDecision('hard_no')">
        <strong>B)</strong> Yox, bu mövzu mənlik deyil
      </button>
    </div>
  `;
}

function conditioningDecision(decision) {
  const positive = ["fit_yes", "recorded_yes", "value_yes", "hard_yes"];
  const unsure = ["value_unsure"];

  const answerMap = {
    fit_yes: "Bəli, mənə uyğundur",
    fit_no: "Yox, mənə uyğun deyil",
    recorded_yes: "Bəli, bu mənim üçün rahatdır",
    recorded_no: "Yox, mən yalnız canlı dərs istəyirəm",
    value_yes: "Bəli, məntiqlidir",
    value_unsure: "Hələ də əmin deyiləm",
    value_no: "Xeyr, mənim üçün uyğun deyil",
    hard_yes: "Bəli, addım-addım öyrənmək istəyirəm",
    hard_no: "Yox, bu mövzu mənlik deyil"
  };

  state.branchAnswers.push({
    question: "Conditioning cavabı",
    answer: answerMap[decision]
  });

  if (positive.includes(decision)) {
    state.leadStatus = "qualified_after_conditioning";
    renderQualifiedPage("conditioning");
    return;
  }

  if (unsure.includes(decision)) {
    state.leadStatus = "not_qualified_unsure";
    trackEvent("NotQualified", { reason: "still_unsure" });
    renderSoftNotReadyPage();
    return;
  }

  state.leadStatus = "disqualified_after_conditioning";
  trackEvent("Disqualified", { reason: decision });
  renderDisqualifiedPage("not_fit");
}

function renderLaterPage() {
  state.leadStatus = "not_qualified_later";
  trackEvent("NotQualified", { reason: "later" });

  app.innerHTML = `
    <h2>Başa düşdük.</h2>
    <p>
      Kurs hazırda <strong>150 AZN</strong>-dir və ömürlük giriş daxildir.
      Daha sonra baxmaq istəyirsənsə, proqram səhifəsini saxla və hazır olanda geri qayıt.
    </p>

    <div class="actions">
      <button class="btn btn-light" onclick="renderProgramPage()">Proqramı gör</button>
      <button class="btn btn-primary" onclick="restartQuiz()">Quiz-i yenidən başla</button>
    </div>

    <p class="notice">Bu mərhələdə lead event atılmır.</p>
  `;
}

function renderSoftNotReadyPage() {
  app.innerHTML = `
    <h2>Hələ qərarsız qalmağın normaldır.</h2>
    <p>
      Hazır deyilsənsə, əvvəl proqramı bir daha görə bilərsən.
      Əgər sonra başlamaq istəsən, WhatsApp-a keçib kursu əldə edə bilərsən.
    </p>

    <div class="actions">
      <button class="btn btn-light" onclick="renderProgramPage()">Proqramı yenidən gör</button>
      <button class="btn btn-primary" onclick="restartQuiz()">Quiz-i yenidən başla</button>
    </div>

    <p class="notice">Bu mərhələdə lead event atılmır.</p>
  `;
}

function renderQualifiedPage(source) {
  trackEvent("QualifiedLead", {
    source,
    lead_status: state.leadStatus
  });

  app.innerHTML = `
    <span class="tag">Uyğundur</span>
    <h2>Əla, kurs sənə uyğundur.</h2>
    <p>
      Cavablarına əsasən sən Meta reklamlarını sistemli şəkildə öyrənmək və praktiki olaraq tətbiq etmək istəyirsən.
      Onlayn videokursun qiyməti <strong>150 AZN</strong>-dir və giriş <strong>ömürlükdür</strong>.
    </p>

    <div class="form-grid">
      <input class="input" id="nameInput" placeholder="Adın" />
      <input class="input" id="phoneInput" placeholder="Telefon nömrən, məsələn: 050..." />
    </div>

    <div class="actions">
      <button class="btn btn-whatsapp" onclick="goToWhatsApp()">
        Onlayn videokursu əldə etmək üçün WhatsApp-a yaz
      </button>
    </div>

    <p class="notice">
      WhatsApp mesajında quiz cavabların avtomatik əlavə olunacaq.
    </p>

    ${renderAnswerSummary()}
  `;
}

function renderAnswerSummary() {
  const allAnswers = [...state.answers, ...state.branchAnswers];

  return `
    <div class="summary">
      ${allAnswers.map((item, index) => `
        <div class="summary-row">
          <strong>${index + 1}. ${item.question}</strong><br>
          ${item.answer}
        </div>
      `).join("")}
    </div>
  `;
}

function goToWhatsApp() {
  const nameInput = document.getElementById("nameInput");
  const phoneInput = document.getElementById("phoneInput");

  state.name = nameInput ? nameInput.value.trim() : "";
  state.phone = phoneInput ? phoneInput.value.trim() : "";

  trackEvent("Lead", {
    lead_status: state.leadStatus,
    name: state.name || "not_provided"
  });

  trackEvent("WhatsAppClick", {
    lead_status: state.leadStatus
  });

  const message = buildWhatsAppMessage();
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.location.href = url;
}

function buildWhatsAppMessage() {
  const answerLines = state.answers.map((item, index) => {
    return `${index + 1}. ${shortQuestionName(item.questionId)}: ${item.answer}`;
  });

  const branchLines = state.branchAnswers.map((item, index) => {
    return `${state.answers.length + index + 1}. ${item.question}: ${item.answer}`;
  });

  return `
Salam, Meta Ads videokursunu əldə etmək istəyirəm.

Adım: ${state.name || "Qeyd edilməyib"}
Telefon: ${state.phone || "Qeyd edilməyib"}

Quiz cavablarım:

${[...answerLines, ...branchLines].join("\n")}

Kursun ödəniş və giriş məlumatlarını göndərə bilərsiniz?
`.trim();
}

function shortQuestionName(id) {
  const names = {
    experience: "Meta Ads təcrübəm",
    problem: "Əsas problemim",
    goal: "Reklam öyrənmək məqsədim",
    creative_testing: "Kreativ testing səviyyəm",
    learning_format: "Mənə uyğun öyrənmə formatı",
    price_intent: "Qiymətə münasibətim"
  };

  return names[id] || id;
}

function renderDisqualifiedPage(type) {
  let title = "Təşəkkürlər.";
  let text = "Cavablarına əsasən bu videokurs hazırda sənə uyğun olmaya bilər.";

  if (type === "budget") {
    title = "Başa düşdük.";
    text = "Bu kurs hazırda 150 AZN-dir və ömürlük giriş daxildir. Hazırda büdcən uyğun deyilsə, daha sonra geri qayıda bilərsən.";
  }

  if (type === "not_now") {
    title = "Problem deyil.";
    text = "Əgər indi başlamaq istəmirsənsə, daha sonra yenidən proqram səhifəsinə baxa bilərsən.";
  }

  app.innerHTML = `
    <h2>${title}</h2>
    <p>${text}</p>

    <div class="actions">
      <button class="btn btn-light" onclick="renderProgramPage()">Proqramı gör</button>
      <button class="btn btn-primary" onclick="restartQuiz()">Quiz-i yenidən başla</button>
    </div>

    <p class="notice">
      Bu cavab lead sayılmır və WhatsApp-a əsas satış yönləndirməsi edilmir.
    </p>
  `;
}

function restartQuiz() {
  state.currentQuestion = 0;
  state.answers = [];
  state.branchAnswers = [];
  state.name = "";
  state.phone = "";
  state.leadStatus = "not_qualified";

  renderStart();
}

renderStart();
